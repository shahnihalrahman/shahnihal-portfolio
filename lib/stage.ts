/**
 * STAGE STORE
 *
 * The whole page shares one 3D system. Rather than each section owning a visual,
 * sections declare which stage of the story they are (`data-stage="…"`) and this
 * module tracks which one the visitor is currently inside, plus how far through
 * it they are.
 *
 * Deliberately a plain mutable module rather than React state: the renderer reads
 * it once per frame, so pushing this through React would mean a re-render on
 * every scroll event for no benefit.
 */

export type StageId =
  | 'hero'
  | 'pipeline'
  | 'work'
  | 'ai'
  | 'architecture'
  | 'stack'
  | 'thinking'
  | 'contact';

export const stage = {
  /** Stage the viewport is currently centred on. */
  id: 'hero' as StageId,
  /** 0 → 1 progress through the current stage. */
  progress: 0,
  /** Pointer position, normalised to -1 → 1 from the viewport centre. */
  pointer: { x: 0, y: 0 },
  /** Whether the document is visible; the renderer idles when it is not. */
  visible: true,
  /** Set when the GPU drops the WebGL context so fallbacks can take over. */
  glLost: false,
};

/**
 * Starts tracking. Returns a cleanup function.
 * Safe to call more than once; each call is independent.
 */
export function trackStages() {
  if (typeof window === 'undefined') return () => {};

  let sections: { id: StageId; el: HTMLElement }[] = [];
  let frame = 0;

  const collect = () => {
    sections = Array.from(document.querySelectorAll<HTMLElement>('[data-stage]')).map((el) => ({
      id: el.dataset.stage as StageId,
      el,
    }));
  };

  const measure = () => {
    frame = 0;
    if (!sections.length) return;
    const centre = window.innerHeight * 0.42;
    let best: { id: StageId; progress: number } | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const section of sections) {
      const rect = section.el.getBoundingClientRect();
      if (rect.height === 0) continue;
      // Progress through this section relative to the reference line.
      const progress = Math.min(1, Math.max(0, (centre - rect.top) / rect.height));
      const inside = rect.top <= centre && rect.bottom >= centre;
      const distance = inside ? 0 : Math.min(Math.abs(rect.top - centre), Math.abs(rect.bottom - centre));
      if (distance < bestDistance) {
        bestDistance = distance;
        best = { id: section.id, progress };
      }
    }

    if (best) {
      stage.id = best.id;
      stage.progress = best.progress;
    }
  };

  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(measure);
  };

  const onPointerMove = (e: PointerEvent) => {
    stage.pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    stage.pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  const onVisibility = () => {
    stage.visible = document.visibilityState === 'visible';
  };

  collect();
  measure();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    collect();
    onScroll();
  });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}

/**
 * How each stage of the story configures the shared system.
 *
 * `x`/`y` move it in world space, `cam` dollies the camera, and the remaining
 * values are 0 → 1 weights for each sub-system. Values are interpolated, so the
 * transition between two sections is the animation.
 */
export type StageConfig = {
  x: number;
  y: number;
  scale: number;
  cam: number;
  /** Dense central core. */
  core: number;
  /** Service node lattice + connections. */
  lattice: number;
  /** Orbital rings. */
  rings: number;
  /** Floating interface fragments. */
  fragments: number;
  /** AI layer nodes. */
  ai: number;
  /** Layered technical architecture. */
  architecture: number;
  /** Multiplier on the lattice radius. */
  spread: number;
};

export const STAGES: Record<StageId, StageConfig> = {
  // Abstract product core, held to the right of the headline.
  hero: { x: 2.45, y: 0, scale: 1, cam: 8, core: 1, lattice: 1, rings: 1, fragments: 0, ai: 0, architecture: 0, spread: 1 },
  // Nodes begin activating as the process is described.
  pipeline: { x: 2.1, y: -0.15, scale: 0.94, cam: 8.4, core: 1, lattice: 1, rings: 0.65, fragments: 0.25, ai: 0.12, architecture: 0, spread: 1.05 },
  // Real interface fragments surface while products are shown.
  work: { x: 3.05, y: 0.1, scale: 0.7, cam: 9.3, core: 0.55, lattice: 0.5, rings: 0.3, fragments: 1, ai: 0.15, architecture: 0, spread: 1.1 },
  // The AI layer wires itself into the system.
  ai: { x: 2.35, y: 0, scale: 0.92, cam: 8.2, core: 0.9, lattice: 0.8, rings: 0.45, fragments: 0.35, ai: 1, architecture: 0.15, spread: 1 },
  // Expands into a layered technical architecture, centred.
  architecture: { x: 0.15, y: 0, scale: 0.88, cam: 8.8, core: 0.65, lattice: 0.45, rings: 0.2, fragments: 0.28, ai: 0.5, architecture: 1, spread: 1.15 },
  // Widest state: the technology map.
  stack: { x: 2.6, y: 0, scale: 1.02, cam: 9.1, core: 0.45, lattice: 1, rings: 0.55, fragments: 0.1, ai: 0.5, architecture: 0.2, spread: 1.32 },
  // Relationships rather than parts.
  thinking: { x: 2.4, y: 0, scale: 0.84, cam: 8.6, core: 0.8, lattice: 0.55, rings: 0.38, fragments: 0.2, ai: 0.3, architecture: 0.42, spread: 1 },
  // Everything collapses back into a single connected core.
  contact: { x: 0, y: 0.05, scale: 0.6, cam: 7.1, core: 1, lattice: 0.22, rings: 0.18, fragments: 0, ai: 0.2, architecture: 0, spread: 0.8 },
};
