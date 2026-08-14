'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { clusters, type TechNode } from '@/lib/stack';
import { seededRandom } from '@/lib/utils';

/**
 * INTERACTIVE 3D TECHNOLOGY MAP
 *
 * A rotating point cloud projected to 2D by hand, so the labels stay flat and
 * legible (billboarded) while the structure genuinely moves in depth.
 *
 * Why not WebGL: the hero already owns one GL context, crisp text inside a
 * canvas is a fight, and DOM nodes here are focusable and screen-reader
 * addressable for free. Rotation is written straight to element styles inside a
 * single rAF loop — React never re-renders during the animation, and the loop
 * stops when the section is off screen.
 */

type Placed = {
  cluster: number;
  node: TechNode;
  base: [number, number, number];
};

const FOCAL = 2.1;

function unitSphere(count: number) {
  const points: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push([Math.cos(theta) * r, y * 0.82, Math.sin(theta) * r]);
  }
  return points;
}

export function Constellation({
  activeCluster,
  activeNode,
  onHover,
}: {
  activeCluster: string | null;
  /** Name of the hovered/focused technology, so its real relationships can be drawn. */
  activeNode: string | null;
  onHover: (payload: { clusterId: string; node: TechNode } | null) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLLIElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activeRef = useRef<string | null>(null);
  const activeNodeRef = useRef<string | null>(null);
  const relationRefs = useRef<(SVGLineElement | null)[]>([]);
  const hubRefs = useRef<(SVGCircleElement | null)[]>([]);
  const spokeRefs = useRef<(SVGLineElement | null)[]>([]);
  const backboneRefs = useRef<(SVGLineElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const paused = useRef(false);
  const size = useRef(0);

  /* Deterministic layout: cluster hubs on a sphere, nodes in a shell around each hub. */
  const { placed, hubs, backbone, relations } = useMemo(() => {
    const hubPositions = unitSphere(clusters.length).map(
      ([x, y, z]) => [x * 0.8, y * 0.8, z * 0.8] as [number, number, number],
    );

    const items: Placed[] = [];
    clusters.forEach((cluster, ci) => {
      const random = seededRandom(cluster.id);
      const [hx, hy, hz] = hubPositions[ci];
      const shell = unitSphere(cluster.nodes.length);
      cluster.nodes.forEach((node, ni) => {
        const [sx, sy, sz] = shell[ni];
        const spread = 0.24 + random() * 0.14;
        items.push({
          cluster: ci,
          node,
          base: [hx + sx * spread, hy + sy * spread, hz + sz * spread],
        });
      });
    });

    const indexByName = new Map<string, number>();
    items.forEach((item, i) => indexByName.set(item.node.name, i));

    // Real dependencies between technologies, de-duplicated.
    const relations: { a: number; b: number; from: string; to: string }[] = [];
    const seen = new Set<string>();
    items.forEach((item, i) => {
      (item.node.links ?? []).forEach((target) => {
        const j = indexByName.get(target);
        if (j === undefined || j === i) return;
        const key = [Math.min(i, j), Math.max(i, j)].join('-');
        if (seen.has(key)) return;
        seen.add(key);
        relations.push({ a: i, b: j, from: item.node.name, to: target });
      });
    });

    const links: [number, number][] = [];
    for (let i = 0; i < hubPositions.length; i += 1) {
      links.push([i, (i + 1) % hubPositions.length]);
      links.push([i, (i + 2) % hubPositions.length]);
    }

    return { placed: items, hubs: hubPositions, backbone: links, relations };
  }, []);

  // Mirror the active cluster into a ref so the frame loop can read it without
  // re-subscribing every time React state changes.
  useEffect(() => {
    activeRef.current = activeCluster;
  }, [activeCluster]);

  useEffect(() => {
    activeNodeRef.current = activeNode;
  }, [activeNode]);

  /* Pause when off screen — no background CPU burn. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => {
      paused.current = !entry.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /**
   * Cache the box size instead of reading `clientWidth` inside the frame loop.
   * Reading layout every frame while also writing styles forces a synchronous
   * reflow on each tick, which Lighthouse flags and which costs real frame time.
   */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      size.current = el.clientWidth;
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let frame = 0;
    let angle = 0;
    let tiltX = 0;
    let tiltTarget = 0;
    let last = performance.now();

    const project = (
      p: [number, number, number],
      cos: number,
      sin: number,
      cosX: number,
      sinX: number,
    ) => {
      // Rotate around Y, then X.
      const x1 = p[0] * cos + p[2] * sin;
      const z1 = -p[0] * sin + p[2] * cos;
      const y2 = p[1] * cosX - z1 * sinX;
      const z2 = p[1] * sinX + z1 * cosX;
      const scale = FOCAL / (FOCAL + z2);
      return { x: x1 * scale, y: y2 * scale, scale };
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (paused.current) return;

      const box = size.current;
      if (!box) return;
      const radius = box * 0.4;
      const centre = box / 2;

      angle += dt * 0.16 + pointer.current.x * dt * 0.5;
      // A slow autonomous tilt on top of pointer input. Without it, nodes sitting
      // on the Y axis never move and the map looks partly frozen.
      tiltTarget = pointer.current.y * 0.34 + Math.sin(now * 0.00022) * 0.16;
      tiltX += (tiltTarget - tiltX) * Math.min(1, dt * 3);

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);

      const hubScreen = hubs.map((h) => {
        const p = project(h, cos, sin, cosX, sinX);
        return { x: centre + p.x * radius, y: centre + p.y * radius, scale: p.scale };
      });

      hubScreen.forEach((h, i) => {
        const c = hubRefs.current[i];
        if (!c) return;
        c.setAttribute('cx', h.x.toFixed(1));
        c.setAttribute('cy', h.y.toFixed(1));
        c.setAttribute('r', (2.6 * h.scale).toFixed(2));
      });

      backbone.forEach(([a, b], i) => {
        const line = backboneRefs.current[i];
        if (!line) return;
        line.setAttribute('x1', hubScreen[a].x.toFixed(1));
        line.setAttribute('y1', hubScreen[a].y.toFixed(1));
        line.setAttribute('x2', hubScreen[b].x.toFixed(1));
        line.setAttribute('y2', hubScreen[b].y.toFixed(1));
      });

      const nodeScreen: { x: number; y: number }[] = [];

      placed.forEach((item, i) => {
        const node = nodeRefs.current[i];
        const p = project(item.base, cos, sin, cosX, sinX);
        const x = centre + p.x * radius;
        const y = centre + p.y * radius;
        const depth = (p.scale - 0.72) / 0.72; // ~0 at the back, ~1 at the front

        if (node) {
          node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${(0.82 + depth * 0.3).toFixed(3)})`;
          node.style.zIndex = String(Math.round(p.scale * 1000));
          node.style.opacity = (0.36 + depth * 0.64).toFixed(3);
        }

        const label = labelRefs.current[i];
        if (label) {
          const focused = activeRef.current === clusters[item.cluster].id;
          const show = focused || depth > 0.62;
          label.style.opacity = show ? '1' : '0';
          label.style.transform = show ? 'scale(1)' : 'scale(0.9)';
        }

        nodeScreen[i] = { x, y };

        const spoke = spokeRefs.current[i];
        if (spoke) {
          const hub = hubScreen[item.cluster];
          spoke.setAttribute('x1', hub.x.toFixed(1));
          spoke.setAttribute('y1', hub.y.toFixed(1));
          spoke.setAttribute('x2', x.toFixed(1));
          spoke.setAttribute('y2', y.toFixed(1));
          spoke.setAttribute('opacity', (0.06 + depth * 0.16).toFixed(3));
        }
      });

      // Relationship lines: only drawn for the technology under the cursor, so
      // the map stays legible and the connection means something.
      const focusName = activeNodeRef.current;
      relations.forEach((rel, i) => {
        const line = relationRefs.current[i];
        if (!line) return;
        const on = focusName !== null && (rel.from === focusName || rel.to === focusName);
        if (!on) {
          line.setAttribute('opacity', '0');
          return;
        }
        const a = nodeScreen[rel.a];
        const b = nodeScreen[rel.b];
        if (!a || !b) return;
        line.setAttribute('x1', a.x.toFixed(1));
        line.setAttribute('y1', a.y.toFixed(1));
        line.setAttribute('x2', b.x.toFixed(1));
        line.setAttribute('y2', b.y.toFixed(1));
        line.setAttribute('opacity', '0.85');
      });
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [backbone, hubs, placed, relations]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    };
  }, []);

  const onPointerLeave = useCallback(() => {
    pointer.current = { x: 0, y: 0 };
  }, []);

  return (
    <div
      ref={wrapRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative mx-auto aspect-square w-full max-w-[40rem]"
    >
      {/* Depth glow */}
      <div
        aria-hidden
        className="absolute inset-[14%] rounded-full bg-[radial-gradient(closest-side,rgba(62,224,242,0.09),rgba(169,140,255,0.05)_58%,transparent_76%)]"
      />

      {/* No viewBox on purpose: user units map 1:1 to CSS pixels, so the loop can
          write the same coordinates it computes for the DOM nodes. */}
      <svg aria-hidden className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
        <g>
          {backbone.map(([a, b], i) => (
            <line
              key={`bb-${a}-${b}`}
              ref={(el) => {
                backboneRefs.current[i] = el;
              }}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.7"
            />
          ))}
          {placed.map((item, i) => (
            <line
              key={`sp-${item.node.name}`}
              ref={(el) => {
                spokeRefs.current[i] = el;
              }}
              stroke="rgba(110,140,255,0.55)"
              strokeWidth="0.6"
              opacity="0.1"
            />
          ))}
          {relations.map((rel, i) => (
            <line
              key={`rel-${rel.from}-${rel.to}`}
              ref={(el) => {
                relationRefs.current[i] = el;
              }}
              stroke="rgba(62,224,242,0.95)"
              strokeWidth="1.1"
              opacity="0"
              style={{ transition: 'opacity 220ms ease-out' }}
            />
          ))}
          {hubs.map((_, i) => (
            <circle
              key={`hub-${clusters[i].id}`}
              ref={(el) => {
                hubRefs.current[i] = el;
              }}
              fill="rgba(62,224,242,0.9)"
            />
          ))}
        </g>
      </svg>

      <ul className="absolute inset-0">
        {placed.map((item, i) => {
          const cluster = clusters[item.cluster];
          const dimmed = activeCluster !== null && activeCluster !== cluster.id;
          return (
            <li
              key={`${cluster.id}-${item.node.name}`}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className="absolute left-0 top-0 will-change-transform"
            >
              {/*
                The dot is always present so the cloud keeps its shape; the label
                fades in only when the node faces the viewer or its cluster is
                focused. Every label is still in the DOM and focusable, so
                keyboard and screen-reader users get the full list regardless.
              */}
              <button
                type="button"
                data-focus-ring="custom"
                onPointerEnter={() => onHover({ clusterId: cluster.id, node: item.node })}
                onFocus={() => onHover({ clusterId: cluster.id, node: item.node })}
                onPointerLeave={() => onHover(null)}
                onBlur={() => onHover(null)}
                className="group/node flex items-center gap-1.5 rounded-full p-1"
              >
                <span
                  aria-hidden
                  className={[
                    'h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300',
                    dimmed ? 'bg-ink-faint' : 'bg-accent-cyan',
                  ].join(' ')}
                />
                <span
                  ref={(el) => {
                    labelRefs.current[i] = el;
                  }}
                  className={[
                    'whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[0.6875rem] tracking-wide',
                    'transition-[opacity,transform,color,border-color] duration-300',
                    dimmed
                      ? 'border-white/[0.05] bg-void/80 text-ink-faint'
                      : 'border-white/[0.1] bg-void-2/90 text-ink-soft group-hover/node:border-accent-cyan/50 group-hover/node:text-ink',
                    item.node.evidence === 'exploring' ? 'border-dashed' : '',
                  ].join(' ')}
                >
                  {item.node.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
