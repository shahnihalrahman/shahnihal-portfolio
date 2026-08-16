import type { PreviewKind } from '@/lib/projects';
import { cn } from '@/lib/utils';

/**
 * INTERFACE PREVIEWS — BLUEPRINTS, NOT SCREENSHOTS
 *
 * These are structural previews drawn in markup: the real modules, states and
 * flows of each product, rendered as a wireframe. They are labelled as previews
 * in the UI so nobody mistakes them for a captured screen, they cost no image
 * requests, and they stay sharp on every display.
 *
 * No invented names, no invented numbers, no invented copy.
 *
 * Scope note: blueprints now cover only the entries with nothing shipped to
 * show. Daktarji and Truepost India render real captures instead — see
 * `ProductProof` — so a wireframe can never stand in for a product that exists.
 */

function Chrome({
  label,
  meta,
  children,
  accentClass,
}: {
  label: string;
  meta: string;
  children: React.ReactNode;
  accentClass: string;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-[#070A11]">
      {/* Window bar */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.06] bg-white/[0.018] px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-white/12" />
          <span className="h-2 w-2 rounded-full bg-white/12" />
          <span className={cn('h-2 w-2 rounded-full', accentClass)} />
        </span>
        <span className="ml-1 truncate font-mono text-2xs uppercase tracking-label text-ink-faint">
          {label}
        </span>
        <span className="ml-auto hidden truncate font-mono text-2xs text-ink-faint sm:block">
          {meta}
        </span>
      </div>
      <div className="relative flex-1 p-3.5 sm:p-4">{children}</div>
    </div>
  );
}

function Bar({ w, dim }: { w: string; dim?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn('block h-2 rounded-full', dim ? 'bg-white/[0.055]' : 'bg-white/[0.11]')}
      style={{ width: w }}
    />
  );
}

/* ────────────────────────────  03 · E-COMMERCE  ─────────────────────────── */

function CommercePreview() {
  return (
    <Chrome
      label="E-commerce app · in development"
      meta="Scope defined · build in progress"
      accentClass="bg-accent-violet/70"
    >
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.625rem] uppercase tracking-label text-ink-faint">
            Buying journey
          </span>
          <span className="rounded-md border border-dashed border-accent-violet/35 px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-label text-accent-violet/85">
            Planned
          </span>
        </div>

        <div className="flex gap-3">
          {/* Gallery */}
          <div className="flex flex-1 flex-col gap-2">
            <span
              aria-hidden
              className="block h-24 rounded-lg border border-dashed border-white/[0.09] bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_6px,transparent_6px,transparent_12px)] sm:h-28"
            />
            <span className="flex gap-1.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-5 flex-1 rounded border border-white/[0.07]" />
              ))}
            </span>
          </div>

          {/* Detail */}
          <div className="flex flex-1 flex-col gap-2">
            <Bar w="86%" />
            <Bar w="52%" dim />
            <span className="mt-1 flex flex-wrap gap-1.5">
              {['Variant', 'Size', 'Stock'].map((v) => (
                <span
                  key={v}
                  className="rounded border border-white/[0.08] px-1.5 py-0.5 font-mono text-[0.625rem] text-ink-faint"
                >
                  {v}
                </span>
              ))}
            </span>
            <span
              aria-hidden
              className="mt-auto block h-7 rounded-md border border-dashed border-accent-violet/30 bg-accent-violet/[0.06]"
            />
          </div>
        </div>

        {/* Flow */}
        <div className="mt-auto flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.015] px-2.5 py-2">
          {['UI', 'API', 'DB', 'Payments', 'Orders'].map((n, i) => (
            <span key={n} className="flex min-w-0 flex-1 items-center gap-1.5">
              <span className="truncate font-mono text-[0.625rem] uppercase tracking-label text-ink-muted">
                {n}
              </span>
              {i < 4 ? (
                <span aria-hidden className="h-px flex-1 bg-white/[0.09]" />
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

/* ────────────────────────────  04 · APPLIED AI  ─────────────────────────── */

const AGENT_FLOW = ['Trigger', 'AI Agent', 'Tools', 'Data', 'Action'];

function AgentsPreview() {
  return (
    <Chrome
      label="Applied AI · workflow shape"
      meta="Trigger → Agent → Tools → Data → Action"
      accentClass="bg-accent-cyan/70"
    >
      <div className="flex h-full flex-col justify-between gap-4">
        <ol className="flex flex-col gap-2">
          {AGENT_FLOW.map((node, i) => (
            <li key={node} className="flex items-center gap-3">
              <span className="flex w-6 shrink-0 justify-center font-mono text-[0.625rem] text-ink-faint tabular-nums">
                {i + 1}
              </span>
              <span
                className={cn(
                  'flex flex-1 items-center gap-2.5 rounded-lg border px-3 py-2',
                  i === 1
                    ? 'border-accent-cyan/25 bg-accent-cyan/[0.05]'
                    : 'border-white/[0.06] bg-white/[0.014]',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    i === 1 ? 'bg-accent-cyan' : 'bg-white/20',
                  )}
                />
                <span className="text-[0.8125rem] font-medium text-ink-soft">{node}</span>
                <span
                  aria-hidden
                  className="ml-auto h-px w-8 bg-gradient-to-r from-white/12 to-transparent"
                />
              </span>
            </li>
          ))}
        </ol>

        <div className="grid grid-cols-3 gap-1.5">
          {['Build', 'Debug', 'Docs', 'Research', 'Content', 'Ops'].map((t) => (
            <span
              key={t}
              className="truncate rounded-md border border-white/[0.055] bg-white/[0.015] px-1.5 py-1 text-center font-mono text-[0.625rem] uppercase tracking-label text-ink-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

/* ────────────────────────────────  EXPORT  ─────────────────────────────── */

const previews: Record<PreviewKind, () => React.JSX.Element> = {
  commerce: CommercePreview,
  agents: AgentsPreview,
};

export function ProjectPreview({ kind }: { kind: PreviewKind }) {
  const Component = previews[kind];
  return <Component />;
}
