'use client';

import { useState } from 'react';

import { SectionHead } from '@/components/ui/Primitives';
import { collaborationFlow, collaborationStatement } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * I BRIDGE TECHNOLOGY & BUSINESS
 *
 * The people model, not a paragraph. Each role sits on a spine and hovering one
 * shows what I actually exchange with them — which is the point of the section:
 * the work is as much translation as it is building.
 */

const PEOPLE = [
  {
    role: 'Founder',
    exchange: 'Turning an outcome and a budget into a scope that can actually ship.',
    accent: 'cyan',
  },
  {
    role: 'Designer',
    exchange: 'Agreeing what is buildable, what is worth the effort, and what has to change.',
    accent: 'blue',
  },
  {
    role: 'Developer',
    exchange: 'Architecture, data shape, edge cases and review — the technical detail.',
    accent: 'violet',
  },
  {
    role: 'Marketing',
    exchange: 'Analytics, SEO, tracking and the numbers that decide the next iteration.',
    accent: 'blue',
  },
  {
    role: 'User',
    exchange: 'Feedback and real behaviour, which outrank everyone else in this list.',
    accent: 'cyan',
  },
] as const;

const dotColor = {
  cyan: 'bg-accent-cyan',
  blue: 'bg-accent-blue',
  violet: 'bg-accent-violet',
} as const;

export function Collaboration() {
  const [active, setActive] = useState(2);

  return (
    <section aria-labelledby="collaboration-title" data-stage="thinking" className="section relative">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <SectionHead
              index="07"
              kicker="Communication & collaboration"
              narrative="How I work with people"
              title={
                <span id="collaboration-title">
                  I Bridge <span className="text-gradient">Technology &amp; Business.</span>
                </span>
              }
            />
            <p className="mt-6 max-w-prose text-[0.9375rem] leading-relaxed text-ink-soft">
              {collaborationStatement}
            </p>

            <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.014] p-5">
              <p className="label mb-4">How work actually moves</p>
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
                {collaborationFlow.map((step, i) => (
                  <li key={step.label} className="flex items-center gap-2">
                    <span className="rounded-full border border-white/[0.09] bg-white/[0.03] px-2.5 py-1 font-mono text-2xs uppercase tracking-label text-ink-soft">
                      {step.label}
                    </span>
                    {i < collaborationFlow.length - 1 ? (
                      <span className="text-ink-faint" aria-hidden>
                        →
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* ── People spine ────────────────────────────────────────────── */}
          <div className="min-w-0 lg:col-span-7">
            <div className="relative rounded-3xl border border-white/[0.07] bg-white/[0.012] p-6 sm:p-8">
              <p className="label mb-6">Who I work with, and what we exchange</p>

              <ul className="relative">
                {/* Spine */}
                <span
                  aria-hidden
                  className="absolute left-[15px] top-3 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-accent-cyan/45 via-accent-blue/35 to-accent-violet/35"
                />

                {PEOPLE.map((person, i) => {
                  const on = active === i;
                  return (
                    <li key={person.role} className="relative">
                      <button
                        type="button"
                        onPointerEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onClick={() => setActive(i)}
                        data-focus-ring="custom"
                        className="flex w-full items-start gap-4 rounded-xl py-3 pl-0 pr-2 text-left"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            'relative z-10 mt-0.5 flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full border transition-all duration-400',
                            on
                              ? 'border-accent-cyan/55 bg-void shadow-[0_0_0_4px_rgba(62,224,242,0.09)]'
                              : 'border-white/[0.12] bg-void-2',
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full transition-colors duration-400',
                              on ? dotColor[person.accent] : 'bg-ink-faint/70',
                            )}
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              'block text-lg font-semibold tracking-tight transition-colors duration-400',
                              on ? 'text-ink' : 'text-ink-soft',
                            )}
                          >
                            {person.role}
                          </span>
                          <span
                            className={cn(
                              'mt-1 block max-w-lg text-[0.875rem] leading-relaxed transition-colors duration-400',
                              on ? 'text-ink-soft' : 'text-ink-faint',
                            )}
                          >
                            {person.exchange}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 border-t border-white/[0.07] pt-5 text-[0.8125rem] leading-relaxed text-ink-faint">
                Most delivery problems I have seen were translation problems, not technical ones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
