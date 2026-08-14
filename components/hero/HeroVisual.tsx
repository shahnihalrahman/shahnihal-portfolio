'use client';

import { useEffect, useState } from 'react';

import { CoreStatic } from '@/components/hero/CoreStatic';
import { systemChips } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Hero layer for the shared product system.
 *
 * The 3D system itself is mounted once for the whole page (see SystemStage), so
 * this component only supplies what belongs to the hero specifically: the
 * floating system labels, and a vector core for the cases where WebGL is not
 * running (phones, reduced-motion, or a lost GPU context).
 *
 * Fallback visibility is decided in CSS via `.core-fallback`, so it is correct
 * on the very first paint with no JavaScript involved.
 */

/**
 * Chip positions as percentages of this box.
 *
 * From `lg` up the box overlaps the headline column, so every chip stays in the
 * right-hand region. Anything further left lands on top of the headline.
 */
const CHIP_LAYOUT = [
  { top: '8%', left: '56%', depth: 1.0 },
  { top: '20%', left: '87%', depth: 0.6 },
  { top: '47%', left: '96%', depth: 0.85 },
  { top: '73%', left: '88%', depth: 0.5 },
  { top: '89%', left: '63%', depth: 0.95 },
  { top: '93%', left: '35%', depth: 0.7 },
  { top: '31%', left: '48%', depth: 1.1 },
] as const;

export function HeroVisual() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || calm.matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setOffset({
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        });
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      className={cn(
        'pointer-events-none relative mx-auto aspect-square w-[min(84vw,19rem)]',
        'md:w-[min(62vw,30rem)]',
        'lg:absolute lg:right-[-7%] lg:top-1/2 lg:z-0 lg:w-[min(56vw,50rem)] lg:-translate-y-1/2',
        'xl:right-[-4%]',
      )}
    >
      {/* Shown only when the shared WebGL system is not running. */}
      <div className="core-fallback absolute inset-0">
        <CoreStatic />
      </div>

      {/* Floating system elements — real parts of the systems I build. */}
      <ul className="absolute inset-0 hidden md:block">
        {systemChips.map((chip, i) => {
          const pos = CHIP_LAYOUT[i];
          return (
            <li
              key={chip.label}
              className="absolute will-change-transform"
              style={{
                top: pos.top,
                left: pos.left,
                transform: `translate3d(calc(-50% + ${(-offset.x * 14 * pos.depth).toFixed(2)}px), calc(-50% + ${(-offset.y * 12 * pos.depth).toFixed(2)}px), 0)`,
                transition: 'transform 700ms cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <span className="glass flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-2xs uppercase tracking-label text-ink-soft">
                <span className="h-1 w-1 rounded-full bg-accent-cyan" />
                {chip.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
