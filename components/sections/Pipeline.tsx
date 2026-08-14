'use client';

import { useEffect, useRef, useState } from 'react';

import { SectionHead } from '@/components/ui/Primitives';
import { pipeline } from '@/lib/content';
import { useMediaQuery } from '@/lib/hooks';
import { microcopy, site } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * FROM IDEA → WORKING PRODUCT
 *
 * The argument of the whole portfolio, staged as an assembly rather than a list.
 * A sticky diagram sits alongside the steps and gains a node for each stage the
 * visitor scrolls into, so the visitor watches a product being put together.
 *
 * The diagram is hand-plotted SVG: crisp at any size, no images, and cheap
 * enough to animate purely with CSS transitions.
 */

/** Node positions per stage, in a 100×100 viewBox. */
type DiagramNode = { x: number; y: number; r?: number };

const NODES: DiagramNode[] = [
  { x: 50, y: 50, r: 5.5 }, // problem — the origin
  { x: 25, y: 27 },
  { x: 74, y: 24 },
  { x: 84, y: 55 },
  { x: 67, y: 80 },
  { x: 33, y: 82 },
  { x: 16, y: 57 },
  { x: 50, y: 12 },
];

/** Which earlier node each new node wires itself into. */
const LINKS: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [0, 3],
  [2, 3],
  [0, 4],
  [3, 4],
  [0, 5],
  [4, 5],
  [0, 6],
  [5, 6],
  [1, 6],
  [0, 7],
  [2, 7],
  [1, 7],
];

function AssemblyDiagram({ active }: { active: number }) {
  return (
    <div className="relative aspect-square w-full">
      <div
        aria-hidden
        className="absolute inset-[16%] rounded-full bg-[radial-gradient(closest-side,rgba(62,224,242,0.1),transparent_72%)]"
      />
      <svg viewBox="0 0 100 100" className="relative h-full w-full" role="presentation">
        <defs>
          <linearGradient id="pipe-edge" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#3ee0f2" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#a98cff" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Frame */}
        <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.25" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.25" />

        {/* Connections appear as their endpoints activate. */}
        <g stroke="url(#pipe-edge)" strokeWidth="0.3">
          {LINKS.map(([a, b]) => {
            const on = active >= Math.max(a, b);
            return (
              <line
                key={`${a}-${b}`}
                x1={NODES[a].x}
                y1={NODES[a].y}
                x2={NODES[b].x}
                y2={NODES[b].y}
                style={{
                  opacity: on ? 1 : 0,
                  transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1)',
                }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        {NODES.map((n, i) => {
          const on = active >= i;
          const isCurrent = active === i;
          return (
            <g
              key={i}
              style={{
                opacity: on ? 1 : 0,
                transform: on ? 'scale(1)' : 'scale(0.4)',
                transformOrigin: `${n.x}px ${n.y}px`,
                transition: 'opacity 600ms cubic-bezier(0.22,1,0.36,1), transform 600ms cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              {isCurrent ? <circle cx={n.x} cy={n.y} r={(n.r ?? 3.4) + 3.5} fill="rgba(62,224,242,0.12)" /> : null}
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r ?? 3.4}
                fill={i === 0 ? '#eafcff' : isCurrent ? '#3ee0f2' : 'rgba(62,224,242,0.72)'}
              />
              <text
                x={n.x}
                y={n.y + (n.y > 60 ? 9 : -6.5)}
                textAnchor="middle"
                className="fill-ink-muted font-mono"
                style={{ fontSize: '3.4px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
              >
                {pipeline[i]?.title.split(' ')[0].toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function Pipeline() {
  const [active, setActive] = useState(0);
  const isLarge = useMediaQuery('(min-width: 1024px)');
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>('[data-step]');
    if (!items?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.getAttribute('data-step')));
        });
      },
      { rootMargin: '-42% 0px -42% 0px' },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);

  return (
    <section id="build" data-stage="pipeline" className="section relative seam">
      <div className="shell">
        <SectionHead
          index="01"
          kicker="What I actually do"
          narrative="How I work"
          title={
            <>
              From Idea <span className="text-ink-faint">→</span>{' '}
              <span className="text-gradient">Working Product</span>
            </>
          }
          lede={site.positioning}
        />

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          {/* ── Sticky assembly ─────────────────────────────────────────── */}
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="mx-auto w-[min(78vw,22rem)] lg:w-full">
                <AssemblyDiagram active={active} />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
                <p className="label text-ink-soft">{pipeline[active]?.title}</p>
                <p className="font-mono text-2xs tabular-nums text-ink-faint">
                  {String(active + 1).padStart(2, '0')} / {String(pipeline.length).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>

          {/* ── Steps ───────────────────────────────────────────────────── */}
          <ol ref={listRef} className="min-w-0 lg:col-span-7">
            {pipeline.map((step, i) => {
              const on = active === i;
              return (
                <li
                  key={step.id}
                  data-step={i}
                  className={cn(
                    'relative border-l py-6 pl-6 transition-colors duration-500 first:pt-0 sm:pl-8',
                    on && isLarge ? 'border-accent-cyan/45' : 'border-white/[0.08]',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'absolute -left-[5px] top-7 h-2.5 w-2.5 rounded-full transition-all duration-500 first:top-1',
                      on && isLarge
                        ? 'bg-accent-cyan shadow-[0_0_0_4px_rgba(62,224,242,0.12)]'
                        : 'bg-ink-faint/60',
                    )}
                    style={i === 0 ? { top: '0.25rem' } : undefined}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-mono text-2xs tabular-nums text-ink-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className={cn(
                        'text-xl font-semibold tracking-tight transition-colors duration-500 sm:text-2xl',
                        on && isLarge ? 'text-ink' : 'text-ink-soft',
                      )}
                    >
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-soft">
                    {step.line}
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-faint">{step.detail}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="mt-10 font-mono text-2xs uppercase tracking-label text-ink-faint">
          {microcopy.build}
        </p>
      </div>
    </section>
  );
}
