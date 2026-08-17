'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { HeroVisual } from '@/components/hero/HeroVisual';
import { Magnetic } from '@/components/ui/Magnetic';
import { ActionButton, ArrowIcon } from '@/components/ui/Primitives';
import { useAnchorScroll } from '@/lib/hooks';
import { capabilityNodes, site } from '@/lib/site';

const HEADLINE_PARTS = [
  { text: 'I Build ', accent: false },
  { text: 'Digital Products', accent: true },
  { text: ' With AI, Code & Product Thinking.', accent: false },
];

export function Hero() {
  const scrollTo = useAnchorScroll();
  const reduced = useReducedMotion();

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="home"
      data-stage="hero"
      aria-label="Introduction"
      /*
       * The mobile bottom padding used to reserve room for the absolutely
       * positioned capability strip. That strip is in normal flow on phones now
       * (see below), so it occupies real space and the reservation is gone.
       * md and up keep the original values exactly.
       */
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pb-12 pt-32 md:pb-44 lg:pb-36 lg:pt-28"
    >
      <div className="shell relative w-full">
        {/* This wrapper is the positioning context the floating visual anchors to. */}
        <div className="relative lg:grid lg:grid-cols-12 lg:items-center">
          <div className="z-10 lg:col-span-7">
            <motion.p
              {...rise(0.05)}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-2xs uppercase tracking-label text-ink-muted"
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_12px_2px_rgba(62,224,242,0.6)]" />
              {site.name}
              <span className="text-ink-faint" aria-hidden>
                /
              </span>
              <span className="text-ink-soft">{site.role}</span>
            </motion.p>

            {/*
              Deliberately not JavaScript-animated. This headline is the Largest
              Contentful Paint element; starting it at opacity 0 and waiting for
              hydration pushed LCP out by roughly two seconds on throttled
              mobile. A CSS entrance runs at first paint instead, so the text is
              eligible for LCP immediately and still arrives with movement.
            */}
            <h1 className="mt-7 animate-rise-in text-[clamp(2.55rem,7.2vw,5.25rem)] font-semibold leading-[0.98]">
              {HEADLINE_PARTS.map((part) =>
                part.accent ? (
                  <span key={part.text} className="text-gradient">
                    {part.text}
                  </span>
                ) : (
                  <span key={part.text}>{part.text}</span>
                ),
              )}
            </h1>

            <motion.p
              {...rise(0.24)}
              className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft sm:text-lg"
            >
              {site.subheadline}
            </motion.p>

            {/*
              On phones the calls to action come before the visual, so the
              primary action is reachable without scrolling past a large piece of
              decoration. From `lg` up the visual is absolutely positioned, so
              this DOM order has no effect on the desktop composition.
            */}
            <motion.div {...rise(0.28)} className="mt-9 flex flex-wrap items-center gap-3.5">
              <Magnetic strength={9}>
                <ActionButton variant="primary" onClick={() => scrollTo('#work')}>
                  View My Work
                  <ArrowIcon className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5" />
                </ActionButton>
              </Magnetic>
              <Magnetic strength={7}>
                <ActionButton variant="ghost" onClick={() => scrollTo('#contact')}>
                  Let&rsquo;s Build Something
                </ActionButton>
              </Magnetic>
            </motion.div>

            <motion.p
              {...rise(0.42)}
              className="mt-8 font-mono text-2xs uppercase tracking-label text-ink-faint"
            >
              {site.location}
            </motion.p>

            {/*
              Visual sits here in the mobile flow and floats free from lg up.
              On phones this is the interactive system, and it carries its own
              labelled controls — the plain chip list that used to sit below it
              was the same seven parts rendered twice, so it has gone.
            */}
            <div className="mt-12 lg:mt-0">
              <HeroVisual />
            </div>
          </div>
        </div>
      </div>

      {/*
        ── Capability strip ───────────────────────────────────────────
        Absolute from md up, exactly as before. In normal flow on phones,
        because absolute positioning cannot be made safe here: the strip
        stacks vertically below md and runs 191-229px tall at 360px, while
        `pb-40` only reserved 160px. Being out of flow, it overlapped the
        chip row above it and nothing pushed back. In flow it cannot collide,
        at any width or content length, without needing a magic number.
      */}
      <motion.div
        {...rise(0.52)}
        className="shell pointer-events-none relative z-10 mt-14 md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:pb-12"
      >
        <div className="hairline mb-5 w-full" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap items-center gap-x-1 gap-y-2.5">
            {capabilityNodes.map((node, i) => (
              <li key={node} className="flex items-center">
                <span className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5">
                  <span
                    className="h-1 w-1 rounded-full bg-accent-cyan/90 motion-safe:animate-pulse-node"
                    style={{ animationDelay: `${i * 0.32}s` }}
                    aria-hidden
                  />
                  <span className="font-mono text-2xs uppercase tracking-label text-ink-soft">
                    {node}
                  </span>
                </span>
                {i < capabilityNodes.length - 1 ? (
                  <span className="mx-1 h-px w-3 bg-white/10 sm:w-5" aria-hidden />
                ) : null}
              </li>
            ))}
          </ul>
          <p className="max-w-md font-mono text-2xs uppercase tracking-label text-ink-faint md:text-right">
            {site.capabilities.join(' · ')}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
