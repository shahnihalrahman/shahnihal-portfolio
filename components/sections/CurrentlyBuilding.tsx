'use client';

import { StatusDot, type Tone } from '@/components/ui/Primitives';
import { useAnchorScroll } from '@/lib/hooks';
import { currentlyBuilding } from '@/lib/projects';
import { cn } from '@/lib/utils';

const stateTone: Record<string, Tone> = {
  Building: 'building',
  Iterating: 'iterating',
  Experimenting: 'experimenting',
};

/**
 * THE LAB STRIP
 *
 * Sits immediately under the hero so the page feels occupied from the first
 * scroll. Statuses are hand-maintained in lib/projects.ts — no pretend telemetry
 * and no invented "live" feed; they change when the work changes.
 */
export function CurrentlyBuilding() {
  const scrollTo = useAnchorScroll();

  return (
    <section
      aria-label="Currently building"
      className="relative border-y border-white/[0.07] bg-[#06080e]/50"
    >
      {/* Reads as an instrument panel rather than three cards. */}
      <div className="shell">
        <div className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex shrink-0 items-center gap-3">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inset-0 animate-pulse-node rounded-full bg-accent-cyan/40" />
              <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-accent-cyan" />
            </span>
            <span className="label whitespace-nowrap text-ink-soft">The Lab · Currently Building</span>
          </div>

          <ul className="grid min-w-0 flex-1 grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4 lg:flex lg:items-stretch lg:gap-0">
            {currentlyBuilding.map((item, i) => (
              <li
                key={item.name}
                className={cn(
                  'min-w-0 lg:flex-1 lg:px-5',
                  i > 0 && 'lg:border-l lg:border-white/[0.07]',
                )}
              >
                <button
                  type="button"
                  onClick={() => scrollTo('#work')}
                  data-focus-ring="custom"
                  className="group flex w-full items-start gap-2.5 rounded-lg text-left"
                >
                  <StatusDot tone={stateTone[item.state]} className="mt-1.5" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink transition-colors group-hover:text-accent-cyan">
                      {item.name}
                    </span>
                    <span className="mt-1 block truncate font-mono text-2xs uppercase tracking-label text-ink-faint">
                      {item.context}
                    </span>
                    <span className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-label text-ink-muted">
                      {item.state}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
