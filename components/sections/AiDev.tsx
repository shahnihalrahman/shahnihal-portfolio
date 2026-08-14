'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';

import { SectionHead, Tag } from '@/components/ui/Primitives';
import { Reveal } from '@/components/ui/Reveal';
import { aiStatement, aiTools, aiWorkflow } from '@/lib/content';
import { microcopy } from '@/lib/site';
import { cn } from '@/lib/utils';

const ownerMeta = {
  human: { label: 'My call', className: 'text-accent-cyan border-accent-cyan/25 bg-accent-cyan/[0.07]' },
  ai: { label: 'AI drafts', className: 'text-accent-violet border-accent-violet/25 bg-accent-violet/[0.07]' },
  shared: { label: 'Both', className: 'text-accent-blue border-accent-blue/25 bg-accent-blue/[0.07]' },
} as const;

export function AiDev() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const active = aiWorkflow[index];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = aiWorkflow.length - 1;
    let next = index;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    setIndex(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <section aria-labelledby="ai-dev-title" data-stage="ai" className="section relative seam">
      <div className="shell">
        <SectionHead
          index="03"
          kicker="AI-assisted development"
          narrative="How I use AI"
          title={
            <span id="ai-dev-title">
              I Don&rsquo;t Just Use AI.{' '}
              <span className="text-gradient">I Build With It.</span>
            </span>
          }
          lede={microcopy.prompt}
        />

        {/* min-w-0 on the columns: without it the track sizes to the min-content
            of the truncating labels inside and the page scrolls sideways. */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ── The loop ─────────────────────────────────────────────── */}
          <div className="min-w-0 lg:col-span-5">
            <div
              role="tablist"
              aria-orientation="vertical"
              aria-label="AI-assisted development workflow"
              onKeyDown={onKeyDown}
              className="relative"
            >
              {/* Spine */}
              <span
                aria-hidden
                className="absolute left-[11px] top-4 h-[calc(100%-2rem)] w-px bg-white/[0.07]"
              />

              {aiWorkflow.map((step, i) => {
                const selected = i === index;
                return (
                  <button
                    key={step.id}
                    ref={(el) => {
                      tabsRef.current[i] = el;
                    }}
                    role="tab"
                    id={`ai-tab-${step.id}`}
                    aria-selected={selected}
                    aria-controls="ai-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setIndex(i)}
                    data-focus-ring="custom"
                    className={cn(
                      'group relative flex w-full items-center gap-3.5 rounded-xl py-2.5 pl-0 pr-3 text-left transition-colors duration-300',
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'relative z-10 flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                        selected
                          ? 'border-accent-cyan/60 bg-void shadow-[0_0_0_4px_rgba(62,224,242,0.09)]'
                          : 'border-white/[0.12] bg-void-2 group-hover:border-white/30',
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full transition-colors duration-300',
                          selected ? 'bg-accent-cyan' : 'bg-ink-faint/70',
                        )}
                      />
                    </span>
                    <span
                      className={cn(
                        'min-w-0 flex-1 truncate text-[0.9375rem] font-medium transition-colors duration-300',
                        selected ? 'text-ink' : 'text-ink-muted group-hover:text-ink-soft',
                      )}
                    >
                      {step.title}
                    </span>
                    <span
                      className={cn(
                        'shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-label transition-opacity duration-300',
                        ownerMeta[step.owner].className,
                        selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-70',
                      )}
                    >
                      {ownerMeta[step.owner].label}
                    </span>
                  </button>
                );
              })}

              {/* Loop closure */}
              <div className="relative mt-2 flex items-center gap-3.5 pl-[3px]">
                <svg
                  viewBox="0 0 18 18"
                  className="h-4 w-4 text-ink-faint"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M14 6a6 6 0 1 0 1.6 5.6" />
                  <path d="M14 2.4V6h-3.6" />
                </svg>
                <span className="font-mono text-2xs uppercase tracking-label text-ink-faint">
                  Back to idea
                </span>
              </div>
            </div>
          </div>

          {/* ── Detail ───────────────────────────────────────────────── */}
          <div className="min-w-0 lg:col-span-7">
            <div
              role="tabpanel"
              id="ai-panel"
              aria-labelledby={`ai-tab-${active.id}`}
              tabIndex={0}
              className="panel relative overflow-hidden rounded-3xl p-6 sm:p-8"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(700px 260px at 85% 0%, rgba(169,140,255,0.10), transparent 68%)',
                }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={reduced ? undefined : { opacity: 0, y: 10 }}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <span
                    className={cn(
                      'inline-flex rounded-md border px-2 py-1 font-mono text-2xs uppercase tracking-label',
                      ownerMeta[active.owner].className,
                    )}
                  >
                    {ownerMeta[active.owner].label}
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
                    {active.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-ink-soft">
                    {active.detail}
                  </p>
                </motion.div>
              </AnimatePresence>

              <p className="relative mt-8 border-t border-white/[0.07] pt-6 text-[0.9375rem] leading-relaxed text-ink-soft">
                {aiStatement}
              </p>
            </div>

            {/* Tools */}
            <Reveal delay={0.06}>
              <div className="mt-6 rounded-3xl border border-white/[0.06] bg-white/[0.012] p-6 sm:p-7">
                <h3 className="label text-ink-soft">Tools in the loop</h3>
                <ul className="mt-4 divide-y divide-white/[0.055]">
                  {aiTools.map((tool) => (
                    <li
                      key={tool.name}
                      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5 first:pt-0 last:pb-0"
                    >
                      <span className="text-[0.9375rem] font-medium text-ink">{tool.name}</span>
                      <span className="text-[0.8125rem] text-ink-faint">{tool.role}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  <Tag>AI-assisted build</Tag>
                  <Tag>AI-assisted debugging</Tag>
                  <Tag>AI-assisted documentation</Tag>
                  <Tag muted>No fabricated AI expertise</Tag>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
