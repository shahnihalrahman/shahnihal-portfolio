'use client';

import { useEffect } from 'react';

import { useMediaQuery, usePrefersReducedMotion } from '@/lib/hooks';

/**
 * Momentum scrolling, added only when the user has not asked for reduced motion.
 * The page is fully usable without it — this is polish, not plumbing.
 */
export function SmoothScroll() {
  const reduced = usePrefersReducedMotion();
  // Touch platforms already have good native momentum scrolling. Loading a
  // scroll-hijacking library there only adds main-thread work and risks jank,
  // so the library is never even fetched on those devices.
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    if (reduced || !finePointer) return;

    let cancelled = false;
    let frame = 0;
    let instance: { raf: (t: number) => void; destroy: () => void } | null = null;

    void (async () => {
      const { default: Lenis } = await import('lenis');
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });

      instance = lenis as unknown as { raf: (t: number) => void; destroy: () => void };
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;

      const loop = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    })();

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      instance?.destroy();
      delete (window as unknown as { __lenis?: unknown }).__lenis;
    };
  }, [reduced, finePointer]);

  return null;
}
