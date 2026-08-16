'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import { useCallback, useId, useRef, useState } from 'react';

import { useMediaQuery } from '@/lib/hooks';
import type { Project, ProjectShot } from '@/lib/projects';
import { cn } from '@/lib/utils';

/**
 * REAL PRODUCT PREVIEWS
 *
 * These render actual screens captured from actual builds. The screenshot is the
 * proof, so every effect here is deliberately subordinate to it:
 *
 *   - Nothing is drawn on top of the interface. Chrome, metadata, stack labels,
 *     captions and affordances all live outside the image box, so no part of the
 *     real UI is ever obscured by decoration.
 *   - The cursor light and sheen sit at low alpha under `mix-blend-overlay`, and
 *     the tilt is a few degrees. UI text legibility wins over spectacle.
 *   - Motion is opt-out: `prefers-reduced-motion` and coarse pointers get a
 *     completely still frame carrying identical information.
 *
 * Layout note: on phones a 2.25:1 desktop capture would be ~160px tall and
 * unreadable, so the frame switches to a taller ratio and anchors the crop to
 * the top-left where the meaningful UI sits. The uncropped screen is always one
 * tap away in the modal, which is where full-size inspection happens.
 */

const accentChip = {
  cyan: 'border-accent-cyan/25 bg-accent-cyan/[0.07] text-accent-cyan',
  blue: 'border-accent-blue/25 bg-accent-blue/[0.07] text-accent-blue',
  violet: 'border-accent-violet/25 bg-accent-violet/[0.07] text-accent-violet',
} as const;

/**
 * Narrow-viewport crop anchor. At `lg` the frame adopts the capture's true
 * aspect ratio, so the crop stops applying and the whole screen is visible.
 */
const focusClass = {
  'left-top': 'object-left-top',
  top: 'object-top',
  center: 'object-center',
} as const;

type Accent = Project['accent'];

/* ──────────────────────────────  CHROME  ────────────────────────────────── */

function LockIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-2.5 w-2.5 shrink-0 text-ink-faint"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <rect x="3.5" y="7" width="9" height="6" rx="1.4" />
      <path d="M5.75 7V5.25a2.25 2.25 0 0 1 4.5 0V7" strokeLinecap="round" />
    </svg>
  );
}

/**
 * A restrained browser bar. It exists to say "this is a shipped web app", then
 * get out of the way — no oversized traffic lights, no faux toolbars.
 */
function ChromeBar({ urlLabel }: { urlLabel: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-white/[0.07] bg-white/[0.022] px-3 py-2">
      <span className="flex shrink-0 gap-1.5" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-white/[0.13]" />
        <span className="h-2 w-2 rounded-full bg-white/[0.13]" />
        <span className="h-2 w-2 rounded-full bg-white/[0.13]" />
      </span>

      <span className="mx-auto flex min-w-0 items-center gap-1.5 rounded-md border border-white/[0.06] bg-black/40 px-2.5 py-1">
        <LockIcon />
        <span className="truncate font-mono text-[0.625rem] tracking-wide text-ink-muted">
          {urlLabel}
        </span>
      </span>

      {/* The one claim worth making inside the frame itself. */}
      <span className="flex shrink-0 items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/90" aria-hidden />
        <span className="hidden font-mono text-[0.625rem] uppercase tracking-label text-emerald-300/85 sm:inline">
          Real capture
        </span>
      </span>
    </div>
  );
}

/* ──────────────────────────────  GALLERY  ───────────────────────────────── */

/**
 * Rendered only when more than one screen exists for a product, so a lone
 * capture never gets dressed up as a gallery. Labels come straight from the
 * data, so nothing is ever labelled a screen that was not provided.
 */
function ShotTabs({
  shots,
  active,
  setActive,
  accent,
  idBase,
  panelId,
}: {
  shots: ProjectShot[];
  active: number;
  setActive: (i: number) => void;
  accent: Accent;
  idBase: string;
  panelId: string;
}) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const last = shots.length - 1;
    let next = active;
    if (e.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    else if (e.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`${idBase}-tab-${next}`)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Product screens"
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      className="flex flex-wrap gap-1.5"
    >
      {shots.map((shot, i) => (
        <button
          key={shot.src}
          id={`${idBase}-tab-${i}`}
          role="tab"
          type="button"
          aria-selected={i === active}
          aria-controls={panelId}
          tabIndex={i === active ? 0 : -1}
          onClick={() => setActive(i)}
          className={cn(
            'rounded-md border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-label transition-colors',
            i === active
              ? accentChip[accent]
              : 'border-white/[0.07] text-ink-faint hover:border-white/20 hover:text-ink-soft',
          )}
        >
          {shot.label}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────────  STORY FRAME  ─────────────────────────────── */

export function ProductProofFrame({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const proof = project.proof;
  const reduced = useReducedMotion();
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const idBase = useId();
  const panelId = `${idBase}-panel`;

  const motionOff = Boolean(reduced) || !canHover;

  /* Cursor-reactive depth. */
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const cfg = { stiffness: 150, damping: 22, restDelta: 0.001 };
  const srx = useSpring(rx, cfg);
  const sry = useSpring(ry, cfg);
  const smx = useSpring(mx, cfg);
  const smy = useSpring(my, cfg);
  const light = useMotionTemplate`radial-gradient(460px 320px at ${smx}% ${smy}%, rgba(255,255,255,0.09), transparent 66%)`;

  /* Scroll-linked settle. Small on purpose: the screen should feel anchored. */
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'end start'],
  });
  const rawScale = useTransform(scrollYProgress, [0, 0.42, 1], [0.972, 1, 0.99]);
  const rawY = useTransform(scrollYProgress, [0, 0.42, 1], [18, 0, -10]);
  const scale = useSpring(rawScale, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const y = useSpring(rawY, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (motionOff) return;
      const r = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      mx.set(px * 100);
      my.set(py * 100);
      ry.set((px - 0.5) * 8);
      rx.set(-(py - 0.5) * 6);
    },
    [motionOff, mx, my, rx, ry],
  );

  const reset = useCallback(() => {
    rx.set(0);
    ry.set(0);
    mx.set(50);
    my.set(50);
    setHovered(false);
  }, [mx, my, rx, ry]);

  if (!proof?.shots.length) return null;

  const shot = proof.shots[Math.min(active, proof.shots.length - 1)];
  const multiple = proof.shots.length > 1;

  return (
    <div ref={wrapRef} className="[perspective:1400px]">
      <motion.div
        style={motionOff ? undefined : { scale, y, rotateX: srx, rotateY: sry }}
        className="preserve-3d"
        onPointerMove={onPointerMove}
        onPointerEnter={() => canHover && setHovered(true)}
        onPointerLeave={reset}
      >
        {/* The panel role lives on the frame, not on anything inside the button:
            a tabpanel may contain a button, but not the other way round. */}
        <div
          id={panelId}
          role={multiple ? 'tabpanel' : undefined}
          aria-label={multiple ? `${shot.label} screen` : undefined}
          className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#080B12] shadow-lift"
        >
          <ChromeBar urlLabel={proof.urlLabel} />

          {/* The screen. A real button, so it is reachable and operable by keyboard. */}
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            data-focus-ring="custom"
            aria-label={`${project.name} — open full case detail with the ${shot.label} interface at full size`}
            className="group/shot relative block w-full cursor-zoom-in overflow-hidden bg-[#05070C]"
          >
            <span
              className="relative block w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[var(--shot-ar)]"
              style={{ ['--shot-ar' as string]: `${shot.width} / ${shot.height}` } as React.CSSProperties}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                quality={92}
                loading="lazy"
                className={cn(
                  'object-cover transition-transform duration-[900ms] ease-premium lg:object-center',
                  focusClass[shot.focus ?? 'left-top'],
                  hovered && !reduced ? 'scale-[1.035]' : 'scale-100',
                )}
              />
            </span>

            {/* Lighting: low alpha, overlay blend, no colour cast on UI text. */}
            {motionOff ? null : (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover/shot:opacity-100"
                style={{ backgroundImage: light }}
              />
            )}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-sheen opacity-[0.18] mix-blend-overlay"
            />
          </button>
        </div>
      </motion.div>

      {/* Metadata rail — deliberately outside the frame so the UI stays clean. */}
      <div className="mt-3 space-y-2.5 px-0.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {shot.stage ? (
            <span
              className={cn(
                'rounded-md border px-2 py-1 font-mono text-[0.625rem] uppercase tracking-label',
                accentChip[project.accent],
              )}
            >
              {shot.stage}
            </span>
          ) : null}
          <p className="min-w-0 flex-1 text-[0.8125rem] leading-snug text-ink-soft">
            {shot.caption}
          </p>
        </div>

        {multiple ? (
          <ShotTabs
            shots={proof.shots}
            active={active}
            setActive={setActive}
            accent={project.accent}
            idBase={idBase}
            panelId={panelId}
          />
        ) : null}

        <p className="text-[0.75rem] leading-relaxed text-ink-faint">
          {proof.note}{' '}
          <span className="text-ink-muted">Select the screen to inspect it at full size.</span>
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────  MODAL VIEWER  ───────────────────────────── */

/**
 * The full-resolution view. Two modes:
 *   fit     — the whole screen scaled to the dialog width, nothing cropped.
 *   inspect — the capture at its true pixel width inside a scroll container,
 *             which doubles as the horizontal inspection path on phones.
 */
export function ProductProofViewer({ project }: { project: Project }) {
  const proof = project.proof;
  const [active, setActive] = useState(0);
  const [inspect, setInspect] = useState(false);
  const idBase = useId();
  const panelId = `${idBase}-panel`;

  if (!proof?.shots.length) return null;

  const shot = proof.shots[Math.min(active, proof.shots.length - 1)];
  const multiple = proof.shots.length > 1;

  return (
    <figure className="m-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {multiple ? (
          <ShotTabs
            shots={proof.shots}
            active={active}
            setActive={setActive}
            accent={project.accent}
            idBase={idBase}
            panelId={panelId}
          />
        ) : (
          <span className="font-mono text-2xs uppercase tracking-label text-ink-faint">
            {shot.label}
          </span>
        )}

        <button
          type="button"
          onClick={() => setInspect((v) => !v)}
          aria-pressed={inspect}
          className="rounded-md border border-white/[0.1] bg-white/[0.03] px-2.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-label text-ink-soft transition-colors hover:border-white/25 hover:text-ink"
        >
          {inspect ? 'Fit to width' : 'Inspect full size'}
        </button>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#080B12] shadow-lift">
        <ChromeBar urlLabel={proof.urlLabel} />

        <div
          id={panelId}
          role={multiple ? 'tabpanel' : 'group'}
          aria-label={`${project.name} ${shot.label} interface${inspect ? ', scrollable at full size' : ''}`}
          tabIndex={0}
          className={cn(
            'relative bg-[#05070C]',
            inspect ? 'max-h-[68svh] overflow-auto' : 'overflow-hidden',
          )}
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            sizes={inspect ? `${shot.width}px` : '(min-width: 640px) 90vw, 100vw'}
            quality={95}
            className={cn('block h-auto', inspect ? 'max-w-none' : 'w-full')}
            style={inspect ? { width: shot.width } : undefined}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-sheen opacity-[0.1] mix-blend-overlay"
          />
        </div>
      </div>

      <figcaption className="mt-3 space-y-1.5">
        <p className="text-[0.8125rem] leading-snug text-ink-soft">{shot.caption}</p>
        <p className="text-[0.75rem] leading-relaxed text-ink-faint">{proof.note}</p>
      </figcaption>
    </figure>
  );
}
