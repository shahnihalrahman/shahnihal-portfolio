'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

import { ProjectPreview } from '@/components/work/Previews';
import { ProductProofViewer } from '@/components/work/ProductProof';
import { FlowChain } from '@/components/ui/FlowChain';
import { ActionLink, ExternalIcon, StatusPill, Tag } from '@/components/ui/Primitives';
import { useFocusTrap, useScrollLock } from '@/lib/hooks';
import type { Project } from '@/lib/projects';

function Block({
  title,
  children,
  hint,
}: {
  title: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <section className="border-t border-white/[0.06] pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="label text-ink-soft">{title}</h4>
        {hint ? <span className="text-[0.6875rem] text-ink-faint">{hint}</span> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const open = Boolean(project);
  const trapRef = useFocusTrap(open);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close project details"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-void/85 backdrop-blur-md"
          />

          <motion.div
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`project-${project.id}-title`}
            tabIndex={-1}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.985 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.99 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative flex max-h-[94svh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl sm:max-h-[88svh] sm:rounded-3xl"
          >
            {/* Header */}
            <header className="relative flex items-start gap-4 border-b border-white/[0.07] bg-void-2/70 px-5 py-4 sm:px-8 sm:py-5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-2xs tabular-nums text-ink-faint">
                    {project.index}
                  </span>
                  <StatusPill tone={project.status.tone}>{project.status.label}</StatusPill>
                </div>
                <h3
                  id={`project-${project.id}-title`}
                  className="mt-2.5 truncate text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  {project.name}
                </h3>
                <p className="mt-1.5 font-mono text-2xs uppercase tracking-label text-ink-muted">
                  {project.category}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                data-focus-ring="custom"
                className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] text-ink-soft transition-colors hover:border-white/25 hover:text-ink"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </header>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-6 sm:px-8">
              <p className="max-w-prose text-base leading-relaxed text-ink sm:text-lg">
                {project.summary}
              </p>

              <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.016] p-5">
                <p className="label mb-2">The problem</p>
                <p className="max-w-prose text-[0.9375rem] leading-relaxed text-ink-soft">
                  {project.problem}
                </p>
              </div>

              {/* A real screen gets the full width — it is the strongest
                  evidence on the page, so it is not demoted to a side column.
                  Blueprints stay beside the copy, where they belong. */}
              {project.proof ? (
                <>
                  <div className="mt-8">
                    <ProductProofViewer project={project} />
                  </div>
                  <div className="mt-8 max-w-prose space-y-4">
                    {project.body.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 32)}
                        className="text-[0.9375rem] leading-relaxed text-ink-soft"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-8 grid gap-8 lg:grid-cols-5">
                  <div className="min-w-0 space-y-4 lg:col-span-3">
                    {project.body.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 32)}
                        className="text-[0.9375rem] leading-relaxed text-ink-soft"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {project.preview ? (
                    <div className="min-w-0 lg:col-span-2">
                      <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#05070C] p-3">
                        <ProjectPreview kind={project.preview} />
                      </div>
                      <p className="mt-2.5 text-center font-mono text-2xs uppercase tracking-label text-ink-faint">
                        Interface preview
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="mt-8 space-y-6">
                <Block title="My role">
                  <ul className="flex flex-wrap gap-1.5">
                    {project.role.map((r) => (
                      <li key={r}>
                        <Tag>{r}</Tag>
                      </li>
                    ))}
                  </ul>
                </Block>

                {project.journey ? (
                  <Block title={project.journey.title}>
                    <FlowChain
                      nodes={project.journey.nodes}
                      accent={project.accent}
                      compact
                    />
                  </Block>
                ) : null}

                <Block title={project.architecture.title}>
                  <FlowChain
                    nodes={project.architecture.nodes}
                    accent={project.accent}
                    compact
                  />
                </Block>

                {project.moduleGroups ? (
                  <Block title="What is built, by scope">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {project.moduleGroups.map((group) => (
                        <div
                          key={group.scope}
                          className="rounded-2xl border border-white/[0.06] bg-white/[0.014] p-4"
                        >
                          <p className="text-sm font-semibold text-ink">{group.scope}</p>
                          {group.note ? (
                            <p className="mt-1 text-[0.6875rem] text-ink-faint">{group.note}</p>
                          ) : null}
                          <ul className="mt-3 space-y-1.5">
                            {group.items.map((item) => (
                              <li
                                key={item}
                                className="flex gap-2 text-[0.8125rem] leading-snug text-ink-soft"
                              >
                                <span
                                  aria-hidden
                                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-cyan/60"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </Block>
                ) : null}

                <Block
                  title="Product areas"
                  hint="Anything not built yet is marked Planned"
                >
                  <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {project.areas.map((area) => (
                      <li
                        key={area.label}
                        className="flex items-center gap-2.5 rounded-lg border border-white/[0.055] bg-white/[0.012] px-3 py-2"
                      >
                        {area.state === 'planned' ? (
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 shrink-0 rounded-full border border-ink-faint"
                          />
                        ) : (
                          <svg
                            viewBox="0 0 16 16"
                            className="h-3 w-3 shrink-0 text-emerald-400/80"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <path d="M3.5 8.5 6.5 11.5 12.5 5" />
                          </svg>
                        )}
                        <span className="flex-1 text-[0.8125rem] leading-snug text-ink-soft">
                          {area.label}
                        </span>
                        {area.state === 'planned' ? (
                          <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-label text-ink-faint">
                            Planned
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </Block>

                <Block title="Technology" hint={project.stackNote}>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {project.tech.map((group) => (
                      <div key={group.label}>
                        <p className="font-mono text-2xs uppercase tracking-label text-ink-faint">
                          {group.label}
                        </p>
                        <ul className="mt-2.5 flex flex-wrap gap-1.5">
                          {group.items.map((item) => (
                            <li key={item}>
                              <Tag>{item}</Tag>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Block>

                <Block title="AI layer">
                  <ul className="flex flex-wrap gap-1.5">
                    {project.aiLayer.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </Block>

                <Block title="Links">
                  {project.links.length ? (
                    <div className="flex flex-wrap gap-3">
                      {project.links.map((link) => (
                        <ActionLink key={link.href} href={link.href} external variant="ghost">
                          {link.label}
                          <ExternalIcon />
                        </ActionLink>
                      ))}
                    </div>
                  ) : (
                    <p className="max-w-prose text-[0.8125rem] leading-relaxed text-ink-faint">
                      {project.linksNote ??
                        'No public link yet. Nothing is linked here until it actually exists.'}
                    </p>
                  )}
                  {project.links.length && project.linksNote ? (
                    <p className="mt-3 max-w-prose text-[0.8125rem] leading-relaxed text-ink-faint">
                      {project.linksNote}
                    </p>
                  ) : null}
                </Block>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
