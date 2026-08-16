'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { ProjectPreview } from '@/components/work/Previews';
import { ProductProofFrame } from '@/components/work/ProductProof';
import {
  ActionButton,
  ActionLink,
  ArrowIcon,
  ExternalIcon,
  StatusPill,
  Tag,
} from '@/components/ui/Primitives';
import { useMediaQuery } from '@/lib/hooks';
import type { PreviewKind, Project } from '@/lib/projects';
import { cn } from '@/lib/utils';

/**
 * IMMERSIVE PROJECT STORY
 *
 * A sticky product window on one side, the narrative scrolling past on the other.
 * Each beat the visitor scrolls through highlights a different aspect of the
 * product, and the window reacts — so the section is experienced rather than read.
 *
 * The sticky panel is disabled below `lg`, where there is not enough width for two
 * columns; phones get the same beats stacked, with the window pinned above them.
 */

const accentText = {
  cyan: 'text-accent-cyan',
  blue: 'text-accent-blue',
  violet: 'text-accent-violet',
} as const;

const accentGlow = {
  cyan: 'rgba(62,224,242,0.13)',
  blue: 'rgba(110,140,255,0.13)',
  violet: 'rgba(169,140,255,0.13)',
} as const;

const accentBorder = {
  cyan: 'border-accent-cyan/25',
  blue: 'border-accent-blue/25',
  violet: 'border-accent-violet/25',
} as const;

function StackBadge({ source }: { source: Project['stackSource'] }) {
  if (source === 'repository') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] px-2 py-1 font-mono text-2xs uppercase tracking-label text-emerald-300/90">
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3.5 8.5 6.5 11.5 12.5 5" />
        </svg>
        Stack read from repo
      </span>
    );
  }
  if (source === 'planned') {
    return (
      <span className="inline-flex items-center rounded-md border border-dashed border-accent-violet/30 px-2 py-1 font-mono text-2xs uppercase tracking-label text-accent-violet/85">
        Planned stack
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md border border-white/[0.08] px-2 py-1 font-mono text-2xs uppercase tracking-label text-ink-muted">
      Practices, not products
    </span>
  );
}

type Beat = { key: string; label: string; render: () => React.ReactNode };

export function ProjectStory({
  project,
  onOpen,
  index,
}: {
  project: Project;
  onOpen: () => void;
  index: number;
}) {
  const reduced = useReducedMotion();
  const isLarge = useMediaQuery('(min-width: 1024px)');
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const containerRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState(0);

  /* Scroll progress drives which narrative beat is active. */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 45%'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });
  const lineScale = useTransform(smooth, (v) => (reduced ? 1 : v));

  const journey = project.journey?.nodes ?? [];

  const beats: Beat[] = [
    {
      key: 'problem',
      label: 'The problem',
      render: () => (
        <p className="text-[1.0625rem] leading-relaxed text-ink-soft">{project.problem}</p>
      ),
    },
    {
      key: 'built',
      label: 'What it is',
      render: () => (
        <p className="text-[1.0625rem] leading-relaxed text-ink-soft">{project.summary}</p>
      ),
    },
    ...(journey.length
      ? [
          {
            key: 'journey',
            label: project.journey!.title,
            render: () => (
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
                {journey.map((node, i) => (
                  <li key={node.label} className="flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full border border-white/[0.09] bg-white/[0.03] px-3 py-1.5 font-mono text-2xs uppercase tracking-label',
                        i === 0 ? accentText[project.accent] : 'text-ink-soft',
                      )}
                    >
                      {node.label}
                    </span>
                    {i < journey.length - 1 ? (
                      <span className="text-ink-faint" aria-hidden>
                        →
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            ),
          },
        ]
      : []),
    {
      key: 'role',
      label: 'My role',
      render: () => (
        <ul className="flex flex-wrap gap-1.5">
          {project.role.map((r) => (
            <li key={r}>
              <Tag>{r}</Tag>
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: 'stack',
      label: 'Technology',
      render: () => (
        <div>
          <StackBadge source={project.stackSource} />
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.flatMap((g) => g.items).slice(0, 10).map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
          <p className="mt-3 max-w-md text-[0.8125rem] leading-relaxed text-ink-faint">
            {project.stackNote}
          </p>
        </div>
      ),
    },
    {
      key: 'ai',
      label: 'AI layer',
      render: () => (
        <ul className="flex flex-wrap gap-1.5">
          {project.aiLayer.map((a) => (
            <li key={a}>
              <Tag>{a}</Tag>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  /* Track which beat is in view to drive the sticky panel. */
  useEffect(() => {
    if (!isLarge) return;
    const nodes = containerRef.current?.querySelectorAll<HTMLElement>('[data-beat]');
    if (!nodes?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setBeat(Number(entry.target.getAttribute('data-beat')));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [isLarge]);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!canHover) return;
    const el = glowRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };

  return (
    <article
      ref={containerRef}
      onPointerMove={onPointerMove}
      className={cn(
        'group relative border-t border-white/[0.07] pt-10 lg:pt-14',
        index === 0 && 'border-t-0 pt-0 lg:pt-0',
      )}
    >
      {/* Cursor-reactive lighting across the whole story block. */}
      <div
        aria-hidden
        ref={glowRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background: `radial-gradient(700px 380px at var(--mx,50%) var(--my,20%), ${accentGlow[project.accent]}, transparent 70%)`,
        }}
      />

      <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-14">
        {/* ── Narrative column ─────────────────────────────────────────── */}
        <div className="min-w-0 lg:col-span-5">
          <header>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-2xs tabular-nums text-ink-faint">{project.index}</span>
              <StatusPill tone={project.status.tone}>{project.status.label}</StatusPill>
            </div>
            <h3 className="mt-4 text-[clamp(2rem,4vw,3.1rem)] font-semibold uppercase leading-[1] tracking-tightest">
              {project.name}
            </h3>
            <p className={cn('mt-3 text-[0.9375rem] font-medium', accentText[project.accent])}>
              {project.category}
            </p>
            <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ink-faint">
              {project.tagline}
            </p>
          </header>

          {/* Product window on phones and tablets, where sticky has no room. */}
          <div className="mt-8 lg:hidden">
            <StoryVisual
              project={project}
              beat={beat}
              beatCount={beats.length}
              onOpen={onOpen}
            />
          </div>

          {/* Beats */}
          <div className="relative mt-10 lg:mt-12">
            <div aria-hidden className="absolute left-[7px] top-1 h-[calc(100%-0.5rem)] w-px bg-white/[0.07]">
              <motion.div
                style={{ scaleY: lineScale, transformOrigin: 'top' }}
                className="h-full w-full bg-gradient-to-b from-accent-cyan via-accent-blue to-accent-violet"
              />
            </div>

            <ol className="space-y-9">
              {beats.map((b, i) => (
                <li key={b.key} data-beat={i} className="relative pl-8">
                  <span
                    aria-hidden
                    className={cn(
                      'absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border transition-all duration-500',
                      beat === i && isLarge
                        ? 'border-accent-cyan bg-void shadow-[0_0_0_4px_rgba(62,224,242,0.1)]'
                        : 'border-white/[0.14] bg-void-2',
                    )}
                  />
                  <p
                    className={cn(
                      'label mb-2.5 transition-colors duration-500',
                      beat === i && isLarge ? 'text-accent-cyan' : 'text-ink-muted',
                    )}
                  >
                    {b.label}
                  </p>
                  {b.render()}
                </li>
              ))}
            </ol>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ActionButton variant="ghost" onClick={onOpen} aria-haspopup="dialog">
              Full case detail
              <ArrowIcon className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5" />
            </ActionButton>
            {project.links.map((link) => (
              <ActionLink key={link.href} href={link.href} external variant="quiet" className="px-1">
                {link.label}
                <ExternalIcon />
              </ActionLink>
            ))}
          </div>
          {!project.links.length && project.linksNote ? (
            <p className="mt-4 max-w-md text-[0.8125rem] leading-relaxed text-ink-faint">
              {project.linksNote}
            </p>
          ) : null}
        </div>

        {/* ── Sticky product window ────────────────────────────────────── */}
        <div className="hidden min-w-0 lg:col-span-7 lg:block">
          <div className="sticky top-24">
            <StoryVisual
              project={project}
              beat={beat}
              beatCount={beats.length}
              onOpen={onOpen}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Chooses between real product proof and a structural blueprint.
 *
 * Products with a real capture get the interactive frame, which brings its own
 * chrome, caption and provenance note. Everything else keeps the wireframe
 * window and its narrative-beat indicator, still labelled as a rebuilt preview.
 */
function StoryVisual({
  project,
  beat,
  beatCount,
  onOpen,
}: {
  project: Project;
  beat: number;
  beatCount: number;
  onOpen: () => void;
}) {
  if (project.proof) {
    return <ProductProofFrame project={project} onOpen={onOpen} />;
  }
  if (!project.preview) return null;

  return (
    <>
      <div
        className={cn(
          'rounded-3xl border bg-[#05070C]/60 p-3 transition-colors duration-700',
          accentBorder[project.accent],
        )}
      >
        <BlueprintWindow kind={project.preview} beat={beat} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 px-1">
        <p className="font-mono text-2xs uppercase tracking-label text-ink-faint">
          Interface preview · structure rebuilt for this page
        </p>
        <p className="font-mono text-2xs tabular-nums text-ink-faint">
          {String(beat + 1).padStart(2, '0')} / {String(beatCount).padStart(2, '0')}
        </p>
      </div>
    </>
  );
}

/** The blueprint window itself, reacting to the active narrative beat. */
function BlueprintWindow({ kind, beat }: { kind: PreviewKind; beat: number }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#05070C] sm:aspect-[16/11]">
      <div className="absolute inset-0 bg-grid-fine bg-grid-sm opacity-[0.3]" aria-hidden />

      {/* Data connections behind the interface. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(520px 260px at 78% 12%, rgba(62,224,242,0.09), transparent 70%), radial-gradient(420px 220px at 12% 88%, rgba(169,140,255,0.08), transparent 70%)',
        }}
      />

      <div className="absolute inset-0 p-3 sm:p-4">
        <ProjectPreview kind={kind} />
      </div>

      {/* The active beat is reflected on the window itself. */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-0.5 flex-1 rounded-full transition-colors duration-500',
              i === beat ? 'bg-accent-cyan' : 'bg-white/10',
            )}
          />
        ))}
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 bg-sheen opacity-40 mix-blend-overlay" />
    </div>
  );
}
