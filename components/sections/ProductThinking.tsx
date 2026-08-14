import { SectionHead } from '@/components/ui/Primitives';
import { Reveal } from '@/components/ui/Reveal';
import { productStack, productThinking } from '@/lib/content';

/** Static by design — this section is an argument, not a toy. */
export function ProductThinking() {
  return (
    <section aria-labelledby="product-thinking-title" data-stage="thinking" className="section relative seam">
      <div className="shell">
        <SectionHead
          index="06"
          kicker="Product thinking"
          narrative="How I think about users"
          title={
            <span id="product-thinking-title">
              Technology Is Only <span className="text-gradient">Half the Job.</span>
            </span>
          }
          lede="Working code is the entry fee. Whether a product is worth using is decided in the decisions around it."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ── The stack of concerns ──────────────────────────────── */}
          <div className="min-w-0 lg:col-span-4">
            <Reveal>
              <div className="glass rounded-3xl p-6">
                <p className="label text-ink-soft">How the layers pull on each other</p>
                <ol className="mt-6">
                  {productStack.map((layer, i) => (
                    <li key={layer.label}>
                      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
                        <p className="text-[0.9375rem] font-semibold tracking-tight text-ink">
                          {layer.label}
                        </p>
                        <p className="mt-1 text-[0.75rem] leading-snug text-ink-faint">
                          {layer.note}
                        </p>
                      </div>
                      {i < productStack.length - 1 ? (
                        <div className="flex justify-center py-1.5" aria-hidden>
                          <svg
                            viewBox="0 0 12 22"
                            className="h-5 w-3 text-accent-cyan/55"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M6 3v16" />
                            <path d="M3.2 5.8 6 3l2.8 2.8" />
                            <path d="M3.2 16.2 6 19l2.8-2.8" />
                          </svg>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ol>
                <p className="mt-6 border-t border-white/[0.07] pt-5 text-[0.8125rem] leading-relaxed text-ink-faint">
                  A decision at any layer changes the ones above and below it. Treating them as
                  separate is how products end up technically fine and commercially useless.
                </p>
              </div>
            </Reveal>
          </div>

          {/* ── What I care about ─────────────────────────────────── */}
          <div className="min-w-0 lg:col-span-8">
            <ul className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.05] sm:grid-cols-2">
              {productThinking.map((item, i) => (
                <li key={item.title} className="bg-void-2/90">
                  <Reveal delay={Math.min(i * 0.03, 0.2)}>
                    <div className="group h-full p-5 transition-colors duration-500 hover:bg-white/[0.02] sm:p-6">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-2xs tabular-nums text-ink-faint">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-[0.9375rem] font-semibold tracking-tight text-ink">
                          {item.title}
                        </h3>
                      </div>
                      <p className="mt-2 pl-[1.85rem] text-[0.8125rem] leading-relaxed text-ink-faint">
                        {item.line}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
