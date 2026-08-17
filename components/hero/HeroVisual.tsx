'use client';

import { useEffect, useState } from 'react';

import { CoreStatic } from '@/components/hero/CoreStatic';
import { MobileSystem } from '@/components/hero/MobileSystem';
import { systemChips } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Hero layer for the shared product system.
 *
 * Three distinct visuals, one per capability tier, selected in CSS so the right
 * one is correct on first paint:
 *
 *   phones     `.mobile-system` → MobileSystem, a purpose-built interactive
 *              scene. Rendered in normal flow rather than absolutely, because
 *              unlike the other two it has controls beneath it that need room.
 *   md and up  the shared WebGL system (mounted once, see SystemStage) plus the
 *              floating labels positioned against the square box below.
 *   fallback   `.core-fallback` → CoreStatic, for reduced-motion or a lost GPU
 *              context from md up.
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
    <>
      {/* Phones: the interactive system, in flow so its controls have room. */}
      <div className="mobile-system w-full">
        <MobileSystem />
      </div>

      <div
        className={cn(
          'pointer-events-none relative mx-auto hidden aspect-square',
          'md:block md:w-[min(62vw,30rem)]',
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
    </>
  );
}
