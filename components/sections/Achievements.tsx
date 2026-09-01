import { Reveal } from '@/components/ui/Reveal';
import { businessAchievements, technicalAchievements } from '@/lib/content';

/**
 * Two rows, same card language throughout — only the emphasis changes.
 *
 * Technical row (primary): what the Work and Stack sections above actually
 * evidence — shipped full-stack products, agentic AI workflows, backend/data
 * architecture, AI-assisted engineering. See the `technicalAchievements`
 * source comment in lib/content.ts for the evidence behind each line.
 *
 * Business row (secondary): the original four figures Shahnihal supplied,
 * unchanged and still present — proof of business impact, not demoted, just
 * no longer the first thing a reader sees.
 */
export function Achievements() {
  return (
    <section aria-labelledby="achievements-title" className="relative pb-6 pt-4 sm:pb-10">
      <div className="shell">
        <div className="flex flex-wrap items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-accent-cyan/70 to-transparent" />
          <h2 id="achievements-title" className="label text-ink-soft">
            Achievements
          </h2>
        </div>

        {/* Technical — primary. Accent top border and slightly larger value
            text are the only visual differentiators from the row below;
            everything else (card chrome, radius, Reveal stagger) matches. */}
        <p className="mt-7 label text-accent-cyan/85">Technical engineering</p>
        <ul className="mt-3 grid gap-px overflow-hidden rounded-2xl border border-accent-cyan/20 bg-white/[0.05] sm:grid-cols-2 lg:grid-cols-4">
          {technicalAchievements.map((item, i) => (
            <li key={item.value} className="border-t-2 border-accent-cyan/60 bg-void-2/90">
              <Reveal delay={Math.min(i * 0.05, 0.2)}>
                <div className="h-full p-5">
                  <p className="text-[1.375rem] font-semibold leading-tight tracking-tight text-ink sm:text-2xl">
                    {item.value}
                  </p>
                  <p className="mt-3 text-[0.8125rem] leading-snug text-ink-faint">{item.label}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Business / growth — secondary. Original four figures, unchanged. */}
        <p className="mt-10 label text-ink-faint">Product &amp; business impact</p>
        <ul className="mt-3 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.05] sm:grid-cols-2 lg:grid-cols-4">
          {businessAchievements.map((item, i) => (
            <li key={item.label} className="bg-void-2/90">
              <Reveal delay={Math.min(i * 0.05, 0.2)}>
                <div className="h-full p-5">
                  <p className="text-2xl font-semibold leading-none tracking-tight text-ink sm:text-[1.75rem]">
                    {item.value}
                  </p>
                  <p className="mt-3 text-[0.8125rem] leading-snug text-ink-faint">{item.label}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
