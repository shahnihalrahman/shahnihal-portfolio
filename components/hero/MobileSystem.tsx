'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { systemChips } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * MOBILE PRODUCT SYSTEM — INTERACTIVE, NOT A FALLBACK
 *
 * Phones do not get the page-wide WebGL scene: shipping that lattice, its
 * shaders and its packet simulation to a mid-range phone costs far more than it
 * returns. But "no WebGL" must not mean "no system", which is what it used to
 * mean here — the hero fell back to a completely static SVG.
 *
 * So this is a purpose-built mobile scene rather than a downgraded desktop one:
 *
 *   - Seven parts, nine relationships, five data packets. The desktop lattice
 *     runs 16–26 nodes with ~40 edges; this is deliberately a fraction of it.
 *   - Pseudo-3D. Nodes orbit an ellipse and are dimmed and shrunk by depth, so
 *     the system reads as volume without a 3D context, a camera or a shader.
 *   - One rAF loop, and it only writes geometry attributes on ~40 elements.
 *     Node pulse, edge dash-flow and core breathing are pure CSS, so they run
 *     on the compositor and cost the loop nothing.
 *   - The loop is suspended whenever the hero is off screen or the tab is
 *     hidden, so it never burns battery behind other content.
 *
 * Interaction: drag rotates the system, tapping a part activates it, activating
 * a part highlights what it genuinely connects to and dims the rest, and page
 * scroll feeds a small amount of extra rotation and lift.
 *
 * Touch handling uses `touch-action: pan-y`, so horizontal drags rotate the
 * system while vertical swipes still scroll the page normally.
 *
 * Reduced motion: the loop never starts and the system renders at its resting
 * position, but every part stays visible and tapping still works. Motion is
 * removed; information and interaction are not.
 */

const CX = 50;
const CY = 50;
const RADIUS = 33;
/** Flattens the orbit into perspective rather than a flat spin. */
const SQUASH = 0.4;

/** Per-node vertical offset, so the lattice has height instead of being a ring. */
const LIFT = [-7, 5, -2, 8, -9, 1, 6] as const;

/**
 * How the parts actually relate, mirroring the architecture described in
 * lib/content.ts. Tapping a part highlights these and nothing else, so the
 * highlight is information rather than decoration.
 *
 * 0 API · 1 AI · 2 Database · 3 UI · 4 Automation · 5 Analytics · 6 Deployment
 */
const RELATIONS: readonly [number, number][] = [
  [0, 1], // API ↔ AI
  [0, 2], // API ↔ Database
  [0, 3], // API ↔ UI
  [0, 4], // API ↔ Automation
  [1, 4], // AI ↔ Automation
  [2, 5], // Database ↔ Analytics
  [3, 5], // UI ↔ Analytics
  [4, 6], // Automation ↔ Deployment
  [5, 6], // Analytics ↔ Deployment
];

/** Packet routes. -1 is the core. Five is enough to read as traffic. */
const PACKETS: readonly [number, number][] = [
  [-1, 0],
  [-1, 3],
  [0, 2],
  [4, 6],
  [-1, 1],
];

const COUNT = systemChips.length;

type Pt = { x: number; y: number; depth: number };

/** Position of node `i` at rotation `rot`. `depth` runs -1 (back) → 1 (front). */
function nodeAt(i: number, rot: number): Pt {
  const theta = (i / COUNT) * Math.PI * 2 + rot;
  const depth = Math.sin(theta);
  return {
    x: CX + Math.cos(theta) * RADIUS,
    y: CY + depth * RADIUS * SQUASH + LIFT[i],
    depth,
  };
}

/** Which nodes a given node connects to. */
function connectionsOf(i: number): number[] {
  const out: number[] = [];
  for (const [a, b] of RELATIONS) {
    if (a === i) out.push(b);
    else if (b === i) out.push(a);
  }
  return out;
}

export function MobileSystem() {
  const [active, setActive] = useState<number | null>(null);

  const hostRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const haloRefs = useRef<(SVGCircleElement | null)[]>([]);
  const hitRefs = useRef<(SVGCircleElement | null)[]>([]);
  const spokeRefs = useRef<(SVGLineElement | null)[]>([]);
  const relRefs = useRef<(SVGLineElement | null)[]>([]);
  const packetRefs = useRef<(SVGCircleElement | null)[]>([]);
  const latticeRef = useRef<SVGGElement>(null);

  /** Mutable animation state, kept out of React so no frame causes a render. */
  const anim = useRef({
    rot: 0,
    /** Extra rotation contributed by drag, decaying back to drift. */
    drag: 0,
    velocity: 0,
    dragging: false,
    lastX: 0,
    /** Set once a gesture travels far enough to be a drag rather than a tap. */
    moved: false,
    scroll: 0,
    activeIdx: null as number | null,
  });

  useEffect(() => {
    anim.current.activeIdx = active;
  }, [active]);

  const activate = useCallback((i: number) => {
    setActive((prev) => (prev === i ? null : i));
  }, []);

  /** Ignores the click that ends a rotation gesture, so dragging cannot toggle. */
  const onNodeClick = useCallback(
    (i: number) => {
      if (anim.current.moved) return;
      activate(i);
    },
    [activate],
  );

  /* ── Pointer: horizontal drag rotates, vertical is left to the page ──── */

  const onPointerDown = (e: React.PointerEvent) => {
    const a = anim.current;
    a.dragging = true;
    a.moved = false;
    a.lastX = e.clientX;
    a.velocity = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const a = anim.current;
    if (!a.dragging) return;
    const dx = e.clientX - a.lastX;
    if (Math.abs(dx) > 2) a.moved = true;
    a.lastX = e.clientX;
    // 220px of travel ≈ a full turn.
    const delta = (dx / 220) * Math.PI * 2;
    a.drag += delta;
    a.velocity = delta;
  };

  const endDrag = () => {
    anim.current.dragging = false;
  };

  /* ── The one animation loop ──────────────────────────────────────────── */

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

    let frame = 0;
    let visible = true;
    let running = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: '96px' },
    );
    io.observe(host);

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && visible) start();
      else stop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const write = (t: number) => {
      const a = anim.current;

      // Scroll contributes a small amount of rotation and lift.
      const rect = host.getBoundingClientRect();
      const seen = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
      a.scroll = Math.min(1, Math.max(0, seen));

      if (!a.dragging) {
        // Inertia from the last drag, then a slow constant drift.
        a.drag += a.velocity;
        a.velocity *= 0.94;
        if (Math.abs(a.velocity) < 0.00012) a.velocity = 0;
      }

      const drift = calm.matches ? 0 : t * 0.00011;
      a.rot = drift + a.drag + a.scroll * 0.5;

      const act = a.activeIdx;
      const connected = act === null ? null : connectionsOf(act);

      // Nodes
      const pts: Pt[] = [];
      for (let i = 0; i < COUNT; i += 1) {
        const p = nodeAt(i, a.rot);
        pts.push(p);

        // Depth: front nodes are larger and brighter than back nodes.
        const near = (p.depth + 1) / 2;
        let opacity = 0.4 + near * 0.6;
        let scale = 1;

        if (act !== null) {
          if (i === act) {
            opacity = 1;
            scale = 1.55;
          } else if (connected?.includes(i)) {
            opacity = Math.max(0.8, opacity);
            scale = 1.2;
          } else {
            opacity *= 0.3;
            scale = 0.85;
          }
        }

        const n = nodeRefs.current[i];
        if (n) {
          // Breathing folded into the radius, staggered per node.
          const pulse = calm.matches ? 0 : Math.sin(t * 0.0016 + i * 0.9) * 0.2;
          n.setAttribute('cx', p.x.toFixed(2));
          n.setAttribute('cy', p.y.toFixed(2));
          n.setAttribute('r', Math.max(0.4, (1.6 + near * 0.9) * scale + pulse).toFixed(2));
          n.setAttribute('opacity', opacity.toFixed(3));
        }

        const halo = haloRefs.current[i];
        if (halo) {
          halo.setAttribute('cx', p.x.toFixed(2));
          halo.setAttribute('cy', p.y.toFixed(2));
          halo.setAttribute('r', (i === act ? 6.4 : 0).toFixed(2));
        }

        const hit = hitRefs.current[i];
        if (hit) {
          hit.setAttribute('cx', p.x.toFixed(2));
          hit.setAttribute('cy', p.y.toFixed(2));
        }

        // Core spokes
        const spoke = spokeRefs.current[i];
        if (spoke) {
          spoke.setAttribute('x2', p.x.toFixed(2));
          spoke.setAttribute('y2', p.y.toFixed(2));
          const lit = act === null ? 0.3 : i === act ? 0.85 : connected?.includes(i) ? 0.4 : 0.08;
          spoke.setAttribute('opacity', lit.toFixed(3));
        }
      }

      // Relationship edges
      RELATIONS.forEach(([x, y], i) => {
        const line = relRefs.current[i];
        if (!line) return;
        const p = pts[x];
        const q = pts[y];
        line.setAttribute('x1', p.x.toFixed(2));
        line.setAttribute('y1', p.y.toFixed(2));
        line.setAttribute('x2', q.x.toFixed(2));
        line.setAttribute('y2', q.y.toFixed(2));
        const touches = act !== null && (x === act || y === act);
        const lit = act === null ? 0.5 : touches ? 1 : 0.07;
        line.setAttribute('opacity', lit.toFixed(3));
      });

      // Data packets
      PACKETS.forEach(([from, to], i) => {
        const dot = packetRefs.current[i];
        if (!dot) return;
        const a0 = from === -1 ? { x: CX, y: CY } : pts[from];
        const a1 = pts[to];
        const phase = calm.matches ? 0.5 : ((t * 0.00022 + i * 0.31) % 1);
        dot.setAttribute('cx', (a0.x + (a1.x - a0.x) * phase).toFixed(2));
        dot.setAttribute('cy', (a0.y + (a1.y - a0.y) * phase).toFixed(2));
        dot.setAttribute('opacity', (act === null ? 0.9 : 0.35).toFixed(2));
      });

      // Whole-system lift from scroll.
      if (latticeRef.current) {
        const lift = (a.scroll - 0.5) * 3.2;
        latticeRef.current.setAttribute('transform', `translate(0 ${lift.toFixed(2)})`);
      }
    };

    const tick = (t: number) => {
      write(t);
      frame = requestAnimationFrame(tick);
    };

    function start() {
      if (running || document.visibilityState !== 'visible') return;
      running = true;
      // Reduced motion still gets one pass, so depth and layout are correct.
      if (calm.matches) {
        write(performance.now());
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }

    start();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Re-run one frame when the active part changes, so reduced-motion users see
  // the highlight update even though no loop is running.
  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!calm.matches) return;
    const act = active;
    const connected = act === null ? null : connectionsOf(act);
    for (let i = 0; i < COUNT; i += 1) {
      const halo = haloRefs.current[i];
      if (halo) halo.setAttribute('r', (i === act ? 6.4 : 0).toFixed(2));

      // Spoke and radius are updated here too, so a selection looks the same
      // with motion disabled as it does with the loop running. Without this the
      // reduced-motion path dimmed nodes but left the core spokes flat.
      const spoke = spokeRefs.current[i];
      if (spoke) {
        const lit = act === null ? 0.3 : i === act ? 0.85 : connected?.includes(i) ? 0.4 : 0.08;
        spoke.setAttribute('opacity', lit.toFixed(3));
      }

      const n = nodeRefs.current[i];
      if (!n) continue;
      const on = act === null || i === act || connected?.includes(i);
      n.setAttribute('opacity', on ? '1' : '0.3');
      n.setAttribute(
        'r',
        (act === null ? 2.2 : i === act ? 3.4 : connected?.includes(i) ? 2.6 : 1.9).toFixed(2),
      );
    }
    RELATIONS.forEach(([x, y], i) => {
      const line = relRefs.current[i];
      if (!line) return;
      const touches = act !== null && (x === act || y === act);
      line.setAttribute('opacity', act === null ? '0.5' : touches ? '1' : '0.07');
    });
  }, [active]);

  const initial = Array.from({ length: COUNT }, (_, i) => nodeAt(i, 0));
  const activeChip = active === null ? null : (systemChips[active] ?? null);

  return (
    <div ref={hostRef} className="pointer-events-auto relative w-full">
      <div
        className="relative mx-auto aspect-square w-[min(74vw,16.5rem)] select-none"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        {/* Volumetric glow, breathing in CSS. */}
        <div
          aria-hidden
          className="absolute inset-[15%] rounded-full bg-[radial-gradient(closest-side,rgba(62,224,242,0.22),rgba(110,140,255,0.1)_54%,transparent_74%)] blur-[2px] motion-safe:animate-light-shift"
        />
        <div
          aria-hidden
          className="absolute inset-[36%] rounded-full bg-[radial-gradient(closest-side,rgba(169,140,255,0.3),transparent)] blur-[6px]"
        />

        <svg viewBox="0 0 100 100" className="relative h-full w-full" role="presentation">
          <defs>
            <radialGradient id="ms-core" cx="50%" cy="42%" r="52%">
              <stop offset="0%" stopColor="#dffbff" stopOpacity="0.95" />
              <stop offset="42%" stopColor="#3ee0f2" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#6e8cff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ms-edge" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#3ee0f2" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#a98cff" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Static frame */}
          <circle cx={CX} cy={CY} r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.25" />
          <ellipse
            cx={CX}
            cy={CY}
            rx={RADIUS + 4}
            ry={(RADIUS + 4) * SQUASH}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="0.25"
          />

          <g ref={latticeRef}>
            {/* Core spokes */}
            <g stroke="url(#ms-edge)" strokeWidth="0.3">
              {initial.map((p, i) => (
                <line
                  key={`spoke-${i}`}
                  ref={(el) => {
                    spokeRefs.current[i] = el;
                  }}
                  x1={CX}
                  y1={CY}
                  x2={p.x}
                  y2={p.y}
                  opacity="0.3"
                />
              ))}
            </g>

            {/* Relationship edges — dash-flow gives them direction. */}
            <g
              stroke="url(#ms-edge)"
              strokeWidth="0.35"
              strokeDasharray="2 3"
              className="motion-safe:animate-dash-flow"
            >
              {RELATIONS.map(([x, y], i) => (
                <line
                  key={`rel-${x}-${y}`}
                  ref={(el) => {
                    relRefs.current[i] = el;
                  }}
                  x1={initial[x].x}
                  y1={initial[x].y}
                  x2={initial[y].x}
                  y2={initial[y].y}
                  opacity="0.5"
                />
              ))}
            </g>

            {/* Core */}
            <circle cx={CX} cy={CY} r="12" fill="url(#ms-core)" />
            <circle cx={CX} cy={CY} r="12" fill="none" stroke="rgba(223,251,255,0.4)" strokeWidth="0.3" />
            <circle
              cx={CX}
              cy={CY}
              r="5.6"
              fill="#eafcff"
              opacity="0.9"
              className="motion-safe:animate-pulse-node"
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            />

            {/* Packets */}
            <g fill="#a98cff">
              {PACKETS.map(([from, to], i) => (
                <circle
                  key={`pk-${from}-${to}`}
                  ref={(el) => {
                    packetRefs.current[i] = el;
                  }}
                  r="0.85"
                  cx={CX}
                  cy={CY}
                  opacity="0.9"
                />
              ))}
            </g>

            {/* Active halo */}
            <g fill="rgba(62,224,242,0.16)">
              {initial.map((p, i) => (
                <circle
                  key={`halo-${i}`}
                  ref={(el) => {
                    haloRefs.current[i] = el;
                  }}
                  cx={p.x}
                  cy={p.y}
                  r="0"
                />
              ))}
            </g>

            {/*
              Nodes. Deliberately NOT using the CSS pulse here: that keyframe
              animates opacity, which would win over the presentation attribute
              and wipe out the depth shading and the dim-when-unrelated state.
              The pulse is folded into the radius in the loop instead.
            */}
            <g fill="#3ee0f2">
              {initial.map((p, i) => (
                <circle
                  key={`node-${i}`}
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  cx={p.x}
                  cy={p.y}
                  r="2.2"
                />
              ))}
            </g>

            {/*
              Touch targets, sized for fingers rather than for the dot. r=9 in a
              100-unit viewBox is ~24px radius against the 264px box a 360px
              screen gives, so ~48px across — clear of the 44px minimum. Adjacent
              nodes sit ~28 units apart, so these do not overlap and cannot cause
              a mis-tap.
            */}
            <g fill="transparent" style={{ cursor: 'pointer', pointerEvents: 'all' }}>
              {initial.map((p, i) => (
                <circle
                  key={`hit-${i}`}
                  ref={(el) => {
                    hitRefs.current[i] = el;
                  }}
                  cx={p.x}
                  cy={p.y}
                  r="9"
                  onClick={() => onNodeClick(i)}
                />
              ))}
            </g>
          </g>
        </svg>
      </div>

      {/*
        SELECTED CAPABILITY — ABOVE THE CHIPS
        This sits between the system and the chip row on purpose. When it lived
        below the chips it read as though it belonged to whatever followed it,
        and on a narrow screen the chip row wrapping to two lines pushed it into
        the process strip beneath. Reading order is now:
        system → what you selected → the things you can select.

        The reserved min-height is what stops the chips shifting under a finger
        as hints of different lengths swap in.
      */}
      {/*
        `justify-center` matters: with only a reserved height, short hints sit at
        the top of the box and leave an uneven gap above the chips that changes
        per selection. Centring keeps the spacing symmetrical whatever the
        content length, so switching parts reads as stable.
      */}
      <div
        aria-live="polite"
        className="mx-auto mt-5 flex min-h-[4rem] max-w-[19rem] flex-col justify-center px-2 text-center"
      >
        {activeChip ? (
          <>
            <p className="text-[0.8125rem] leading-snug text-ink-soft">
              <span className="font-medium text-accent-cyan">{activeChip.label}</span>
              <span className="text-ink-faint"> · </span>
              {activeChip.hint}
            </p>
            {/* Renders itself the moment a real sentence exists in lib/site.ts. */}
            {activeChip.detail ? (
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-faint">
                {activeChip.detail}
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-[0.8125rem] leading-snug text-ink-faint">
            Drag to rotate the system. Tap any part to see what it connects to.
          </p>
        )}
      </div>

      {/*
        The accessible control surface. These are the same seven parts as the
        floating chips used from `md` up, but on phones they are real buttons:
        keyboard reachable, screen-reader labelled, and the tap target the SVG
        dots alone could not honestly provide.
      */}
      <ul
        aria-label="System elements I work across"
        className="flex flex-wrap justify-center gap-1.5"
      >
        {systemChips.map((chip, i) => {
          const on = active === i;
          const related = active !== null && connectionsOf(active).includes(i);
          return (
            <li key={chip.label}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => activate(i)}
                className={cn(
                  'rounded-full border px-2.5 py-1 font-mono text-2xs uppercase tracking-label transition-colors duration-300',
                  on
                    ? 'border-accent-cyan/50 bg-accent-cyan/[0.12] text-accent-cyan'
                    : related
                      ? 'border-accent-cyan/25 bg-white/[0.03] text-ink-soft'
                      : 'border-white/[0.07] bg-white/[0.025] text-ink-muted',
                )}
              >
                {chip.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
