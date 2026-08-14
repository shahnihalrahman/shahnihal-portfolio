'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

import { SectionHead, Tag } from '@/components/ui/Primitives';
import { architecture } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * "How I Build" — an interactive layer stack.
 *
 * Each plate is a real layer from the products in the Work section. Opening one
 * expands its explanation inline, so the section reads as a system you can
 * inspect rather than a diagram you can only look at.
 */
export function ArchitectureView() {
  const [openId, setOpenId] = useState<string | null>('logic');
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="architecture-title" data-stage="architecture" className="section relative seam">
      <div className="shell">
        <SectionHead
          index="04"
          kicker="Interactive architecture"
          narrative="How I think technically"
          title={<span id="architecture-title">How I Build</span>}
          lede="The same shape underneath every product on this page. Open a layer to see what actually lives there."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-10">
          <ol className="min-w-0 lg:col-span-8">
            {architecture.map((node, i) => {
              const open = openId === node.id;
              return (
                <li key={node.id} className="relative">
                  {/* Connector between plates */}
                  {i > 0 ? (
                    <div className="flex justify-start pl-7 sm:pl-9" aria-hidden>
                      <div className="relative h-5 w-px bg-white/[0.09]">
                        <span className="absolute inset-x-[-2px] top-1/2 h-1 w-[5px] -translate-y-1/2 rounded-full bg-accent-cyan/50" />
                      </div>
                    </div>
                  ) : null}

                  <div
                    className={cn(
                      'overflow-hidden rounded-2xl border transition-colors duration-500 ease-premium',
                      open
                        ? 'border-accent-cyan/22 bg-white/[0.03]'
                        : 'border-white/[0.06] bg-white/[0.012] hover:border-white/[0.13]',
                    )}
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : node.id)}
                        aria-expanded={open}
                        aria-controls={`arch-panel-${node.id}`}
                        data-focus-ring="custom"
                        className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
                      >
                        <span className="font-mono text-2xs tabular-nums text-ink-faint">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              'block truncate text-base font-semibold tracking-tight transition-colors sm:text-lg',
                              open ? 'text-ink' : 'text-ink-soft',
                            )}
                          >
                            {node.label}
                          </span>
                          <span className="mt-1 block truncate font-mono text-2xs uppercase tracking-label text-ink-faint">
                            {node.kicker}
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className={cn(
                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-500',
                            open
                              ? 'rotate-45 border-accent-cyan/40 text-accent-cyan'
                              : 'border-white/[0.1] text-ink-muted',
                          )}
                        >
                          <svg
                            viewBox="0 0 16 16"
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          >
                            <path d="M8 3.5v9M3.5 8h9" />
                          </svg>
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          id={`arch-panel-${node.id}`}
                          initial={reduced ? undefined : { height: 0, opacity: 0 }}
                          animate={reduced ? undefined : { height: 'auto', opacity: 1 }}
                          exit={reduced ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/[0.06] px-4 pb-5 pt-4 sm:px-5">
                            <p className="max-w-prose text-[0.9375rem] leading-relaxed text-ink-soft">
                              {node.detail}
                            </p>
                            <ul className="mt-4 flex flex-wrap gap-1.5">
                              {node.examples.map((example) => (
                                <li key={example}>
                                  <Tag>{example}</Tag>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Aside */}
          <aside className="min-w-0 lg:col-span-4">
            <div className="glass sticky top-24 rounded-3xl p-6">
              <p className="label text-ink-soft">Why show this</p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
                Most portfolios show screens. Screens do not tell you whether someone understands
                where correctness has to live, which layer enforces access, or what happens when a
                payment succeeds but a slot has already gone.
              </p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
                This is the part of the work that decides whether a product survives real users.
              </p>
              <div className="mt-6 border-t border-white/[0.07] pt-5">
                <p className="font-mono text-2xs uppercase tracking-label text-ink-faint">
                  Technology with a purpose.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
