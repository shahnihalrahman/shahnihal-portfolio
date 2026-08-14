'use client';

import { useEffect, useRef, useState } from 'react';

import { SectionHead, StatusDot, Tag } from '@/components/ui/Primitives';
import { experience } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * Experience as an activating timeline: the spine fills and each role lights up
 * as it reaches the middle of the viewport, so the section has motion without
 * adding any new claims to the content.
 */
export function Experience() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>('[data-role]');
    if (!items?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.getAttribute('data-role')));
        });
      },
      { rootMargin: '-40% 0px -40% 0px' },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);

  return (
    <section id="experience" data-stage="thinking" className="section relative seam">
      <div className="shell">
        <SectionHead
          index="08"
          kicker="Experience"
          narrative="Where I learned it"
          title={
            <>
              Where I&rsquo;ve <span className="text-gradient">Done the Work</span>
            </>
          }
        />

        <ol ref={listRef} className="relative mt-12 lg:mt-16">
          {/* Spine */}
          <span
            aria-hidden
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-white/[0.08]"
          />

          {experience.map((role, i) => {
            const on = active === i;
            return (
              <li key={`${role.company}-${role.period}`} data-role={i} className="relative pb-10 pl-8 last:pb-0">
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-0 top-2 h-[15px] w-[15px] rounded-full border transition-all duration-500',
                    on
                      ? 'border-accent-cyan bg-void shadow-[0_0_0_4px_rgba(62,224,242,0.1)]'
                      : 'border-white/[0.14] bg-void-2',
                  )}
                />
                <article
                  className={cn(
                    'rounded-2xl border p-5 transition-all duration-500 sm:p-6',
                    on
                      ? 'border-white/[0.11] bg-white/[0.025]'
                      : 'border-white/[0.05] bg-transparent',
                  )}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2.5">
                      {role.current ? <StatusDot tone="live" /> : null}
                      <h3 className="text-lg font-semibold uppercase tracking-tight text-ink sm:text-xl">
                        {role.company}
                      </h3>
                    </div>
                    <p className="font-mono text-2xs uppercase tracking-label text-ink-faint">
                      {role.period}
                    </p>
                  </div>

                  <p className="mt-3 text-[1.0625rem] font-medium text-ink-soft">{role.title}</p>
                  {role.meta ? (
                    <p className="mt-1.5 font-mono text-2xs uppercase tracking-label text-ink-faint">
                      {role.meta}
                    </p>
                  ) : null}

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {role.focus.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
