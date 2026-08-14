import { Reveal } from '@/components/ui/Reveal';
import { achievements } from '@/lib/content';

/**
 * Kept deliberately small. Only figures Shahnihal supplied appear here, and the
 * projects above are meant to carry more weight than these four numbers.
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

        <ul className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.05] sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((item, i) => (
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
