'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** SSR-safe media query hook. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Mounts heavy children only once they are near the viewport, and unmounts them
 * again when far away. Keeps the WebGL context off the critical path.
 */
export function useNearViewport<T extends HTMLElement>(margin = '200px') {
  const ref = useRef<T | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return { ref, near };
}

/** Tracks which section id is currently dominant in the viewport. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const ratios = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        let best = '';
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        if (best && bestRatio > 0) setActive(best);
      },
      {
        rootMargin: '-18% 0px -55% 0px',
        threshold: [0, 0.12, 0.3, 0.55, 0.8],
      },
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

/** Normalised pointer offset from an element's centre, in the range -1..1. */
export function usePointerOffset<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        setOffset({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        });
      });
    };
    const onLeave = () => setOffset({ x: 0, y: 0 });

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  return { ref, offset };
}

/** Locks body scroll while a dialog is open, without layout shift. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const gap = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [locked]);
}

/** Keeps keyboard focus inside a dialog and restores it on close. */
export function useFocusTrap(active: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const selector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  useEffect(() => {
    if (!active) return;
    restoreTo.current = document.activeElement as HTMLElement | null;
    const node = ref.current;
    if (!node) return;

    const focusables = Array.from(node.querySelectorAll<HTMLElement>(selector));
    (focusables[0] ?? node).focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => el.offsetParent !== null,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener('keydown', onKeyDown);
    return () => {
      node.removeEventListener('keydown', onKeyDown);
      restoreTo.current?.focus({ preventScroll: true });
    };
  }, [active]);

  return ref;
}

/** Smooth anchor navigation that plays nicely with Lenis when present. */
export function useAnchorScroll() {
  return useCallback((href: string) => {
    const id = href.replace('#', '');
    const target = document.getElementById(id);
    if (!target) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } })
      .__lenis;
    // Clear the floating navigation, otherwise it covers the section heading
    // the visitor just asked to see.
    if (lenis) {
      lenis.scrollTo(target, { offset: -96 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    history.replaceState(null, '', `#${id}`);
  }, []);
}
