'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { useMediaQuery, usePrefersReducedMotion } from '@/lib/hooks';
import { trackStages } from '@/lib/stage';

/** WebGL is code-split and only requested where it will actually be used. */
const SystemScene = dynamic(() => import('@/components/system/SystemScene'), {
  ssr: false,
  loading: () => null,
});

/**
 * Mounts the shared product system once for the whole page.
 *
 * Fixed behind the content rather than living inside the hero, so the same
 * object carries the visitor from the first screen to the last. Stage tracking
 * runs regardless of whether WebGL is active, so the CSS fallbacks respond to
 * the story too.
 */
export function SystemStage() {
  const reduced = usePrefersReducedMotion();
  const wide = useMediaQuery('(min-width: 768px)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const [ready, setReady] = useState(false);

  useEffect(() => trackStages(), []);

  // Let the first paint land before asking for a GL context.
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  const active = wide && !reduced && ready;

  return (
    <div
      aria-hidden
      data-system-stage={active ? 'gl' : 'static'}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {active ? <SystemScene compact={!finePointer} /> : null}
    </div>
  );
}
