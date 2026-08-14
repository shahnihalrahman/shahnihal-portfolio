'use client';

import { useCallback, useRef } from 'react';
import type { ReactNode } from 'react';

import { useMediaQuery, usePrefersReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * Magnetic hover: the wrapped control drifts a few pixels toward the cursor and
 * springs back on exit.
 *
 * Written with direct style writes rather than state so hover never triggers a
 * React render, and disabled entirely for touch pointers and reduced-motion
 * users — where it would be either meaningless or unwelcome.
 */
export function Magnetic({
  children,
  strength = 10,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const reduced = usePrefersReducedMotion();
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const enabled = canHover && !reduced;

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLSpanElement>) => {
      if (!enabled) return;
      const el = ref.current;
      if (!el || frame.current) return;
      const { clientX, clientY } = e;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const r = el.getBoundingClientRect();
        const dx = (clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (clientY - (r.top + r.height / 2)) / (r.height / 2);
        el.style.transform = `translate3d(${(dx * strength).toFixed(2)}px, ${(dy * strength * 0.5).toFixed(2)}px, 0)`;
      });
    },
    [enabled, strength],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    el.style.transform = 'translate3d(0,0,0)';
  }, []);

  return (
    <span
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn('inline-flex transition-transform duration-500 ease-premium', className)}
    >
      {children}
    </span>
  );
}
