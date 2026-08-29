import Image from 'next/image';

import { SectionHead } from '@/components/ui/Primitives';
import { Reveal } from '@/components/ui/Reveal';
import { about, education, profileCard } from '@/lib/content';
import { microcopy } from '@/lib/site';

export function About() {
  return (
    <section id="about" data-stage="contact" className="section relative seam">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* ── Copy ────────────────────────────────────────────────── */}
          <div className="min-w-0 lg:col-span-7">
            <SectionHead
              index="09"
              kicker="About"
              narrative="Who I am"
              title={
                <>
                  Between <span className="text-gradient">Technology &amp; Business</span>
                </>
              }
            />
            <div className="mt-7 space-y-5">
              {about.map((paragraph) => (
                <Reveal key={paragraph.slice(0, 24)}>
                  <p className="max-w-prose text-[1.0625rem] leading-relaxed text-ink-soft">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.08}>
              <p className="mt-8 font-mono text-2xs uppercase tracking-label text-ink-faint">
                {microcopy.idea}
              </p>
            </Reveal>

            {/* Education */}
            <Reveal delay={0.1}>
              <div className="mt-12">
                <h3 className="label text-ink-soft">Education</h3>
                <ol className="mt-5 border-t border-white/[0.07]">
                  {education.map((item) => (
                    <li
                      key={item.institution}
                      className="flex flex-col gap-1.5 border-b border-white/[0.07] py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    >
                      <div className="min-w-0">
                        <p className="text-[0.9375rem] font-semibold tracking-tight text-ink">
                          {item.institution}
                        </p>
                        <p className="mt-1 text-[0.875rem] text-ink-soft">{item.qualification}</p>
                      </div>
                      <p className="shrink-0 font-mono text-2xs uppercase tracking-label text-ink-faint">
                        {item.period}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>

          {/* ── Portrait + profile card ────────────────────────────── */}
          <div className="min-w-0 lg:col-span-5">
            {/* The person behind the products. Deliberately outside the card
                and modest in size — a signature, not a profile-page hero. */}
            <Reveal delay={0.03}>
              <div className="flex justify-center lg:justify-start">
                <div className="group relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(closest-side,rgba(62,224,242,0.16),transparent_72%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative h-full w-full rounded-full border border-white/[0.12] bg-white/[0.03] p-[3px] shadow-glow backdrop-blur-sm transition-transform duration-500 ease-premium motion-safe:group-hover:scale-[1.03]">
                    <Image
                      src="/shahnihal-rahman-portrait.jpg"
                      alt="Shahnihal Rahman"
                      width={256}
                      height={256}
                      sizes="128px"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="glass sticky top-24 mt-6 overflow-hidden rounded-3xl">
                <div className="relative border-b border-white/[0.07] p-6">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(420px 200px at 20% 0%, rgba(62,224,242,0.12), transparent 70%)',
                    }}
                  />
                  <div className="relative flex items-center gap-4">
                    {/* Monogram, not a stock avatar. */}
                    <span
                      aria-hidden
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.1] bg-void-2 font-display text-lg font-semibold text-accent-cyan"
                    >
                      SR
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[0.9375rem] font-semibold tracking-tight text-ink">
                        Shahnihal Rahman
                      </p>
                      <p className="mt-1 font-mono text-2xs uppercase tracking-label text-ink-faint">
                        Applied AI · Digital Products
                      </p>
                    </div>
                  </div>
                </div>

                <dl className="divide-y divide-white/[0.055]">
                  {profileCard.map((item) => (
                    <div key={item.value} className="px-6 py-4">
                      <dt className="text-[0.9375rem] font-semibold leading-snug tracking-tight text-ink">
                        {item.value}
                      </dt>
                      <dd className="mt-1 text-[0.8125rem] leading-snug text-ink-faint">
                        {item.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
