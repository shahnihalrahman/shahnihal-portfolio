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

/* ─────────────────────────────  01 · DAKTARJI  ───────────────────────────── */

const DISCOVERY_ROWS = [
  { specialty: 'Cardiology', meta: 'Verified clinic · Nearby', slot: 'Next: Today' },
  { specialty: 'Dermatology', meta: 'Verified clinic · Nearby', slot: 'Next: Tomorrow' },
  { specialty: 'Paediatrics', meta: 'Verified clinic · Nearby', slot: 'Next: Today' },
];

function DaktarjiPreview() {
  return (
    <Chrome
      label="Daktarji · patient discovery"
      meta="Search → Compare → Book"
      accentClass="bg-accent-cyan/70"
    >
      <div className="flex h-full flex-col gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2.5">
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 shrink-0 text-accent-cyan/80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden
          >
            <circle cx="7" cy="7" r="4.2" />
            <path d="M10.4 10.4 13.5 13.5" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-2xs uppercase tracking-label text-ink-muted">
            Specialty · Location
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5">
          {['Verified', 'Available today', 'Near me', 'Department'].map((f, i) => (
            <span
              key={f}
              className={cn(
                'rounded-md px-2 py-1 font-mono text-[0.625rem] uppercase tracking-wide',
                i === 0
                  ? 'bg-accent-cyan/14 text-accent-cyan'
                  : 'border border-white/[0.07] text-ink-faint',
              )}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Result rows */}
        <ul className="flex flex-1 flex-col gap-2">
          {DISCOVERY_ROWS.map((row, i) => (
            <li
              key={row.specialty}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                i === 0
                  ? 'border-accent-cyan/22 bg-accent-cyan/[0.045]'
                  : 'border-white/[0.055] bg-white/[0.012]',
              )}
            >
              <span
                aria-hidden
                className="h-7 w-7 shrink-0 rounded-full bg-[linear-gradient(140deg,rgba(62,224,242,0.28),rgba(110,140,255,0.12))]"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.8125rem] font-medium text-ink">
                  {row.specialty}
                </span>
                <span className="mt-1 block truncate font-mono text-[0.625rem] text-ink-faint">
                  {row.meta}
                </span>
              </span>
              <span
                className={cn(
                  'shrink-0 rounded-md px-2 py-1 font-mono text-[0.625rem] tracking-wide',
                  i === 0 ? 'bg-accent-cyan/16 text-accent-cyan' : 'text-ink-faint',
                )}
              >
                {row.slot}
              </span>
            </li>
          ))}
        </ul>

        {/* Booking strip */}
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2">
          {['Slot held', 'Payment', 'Confirmed'].map((s, i) => (
            <span key={s} className="flex flex-1 items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  i === 0 ? 'bg-accent-cyan' : 'bg-white/15',
                )}
              />
              <span className="truncate font-mono text-[0.625rem] uppercase tracking-label text-ink-faint">
                {s}
              </span>
              {i < 2 ? <span aria-hidden className="h-px flex-1 bg-white/[0.08]" /> : null}
            </span>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

/* ─────────────────────────────  02 · TRUEPOST  ──────────────────────────── */

const FORMATS = ['Articles', 'Videos', 'Podcasts', 'Documentaries', 'Pages'];

function TruepostPreview() {
  return (
    <Chrome
      label="Truepost India · custom platform"
      meta="Reader + editorial admin"
      accentClass="bg-accent-blue/70"
    >
      <div className="flex h-full flex-col gap-3">
        {/* Dynamic menu — masked at the right edge so the clipped items read as
            a scrollable nav rather than as broken layout. */}
        <div className="flex items-center gap-2 overflow-hidden border-b border-white/[0.06] pb-2.5 [mask-image:linear-gradient(to_right,black_78%,transparent)]">
          {FORMATS.map((f, i) => (
            <span
              key={f}
              className={cn(
                'whitespace-nowrap font-mono text-[0.625rem] uppercase tracking-label',
                i === 0 ? 'text-ink' : 'text-ink-faint',
              )}
            >
              {f}
            </span>
          ))}
          <span className="ml-auto hidden shrink-0 rounded-md border border-white/[0.08] px-1.5 py-0.5 font-mono text-[0.625rem] text-ink-faint sm:block">
            Search
          </span>
        </div>

        {/* Lead + grid */}
        <div className="flex gap-3">
          <div className="flex flex-[1.4] flex-col gap-2">
            <span
              aria-hidden
              className="block h-16 rounded-lg bg-[linear-gradient(135deg,rgba(110,140,255,0.22),rgba(169,140,255,0.08))] sm:h-20"
            />
            <Bar w="92%" />
            <Bar w="64%" dim />
          </div>
          <div className="flex flex-1 flex-col gap-2.5">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <span
                  aria-hidden
                  className="block h-6 rounded-md bg-white/[0.05] sm:h-7"
                />
                <Bar w="88%" dim />
              </div>
            ))}
          </div>
        </div>

        {/* Admin rail */}
        <div className="mt-auto rounded-lg border border-white/[0.07] bg-white/[0.018] p-2.5">
          <span className="mb-2 block font-mono text-[0.625rem] uppercase tracking-label text-ink-faint">
            Editorial admin
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {['Content', 'Media', 'Menus', 'Categories', 'Newsletter', 'Roles'].map((m) => (
              <span
                key={m}
                className="truncate rounded-md border border-white/[0.055] bg-white/[0.015] px-1.5 py-1 text-center font-mono text-[0.625rem] text-ink-muted"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Chrome>
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
  daktarji: DaktarjiPreview,
  truepost: TruepostPreview,
  commerce: CommercePreview,
  agents: AgentsPreview,
};

export function ProjectPreview({ kind }: { kind: PreviewKind }) {
  const Component = previews[kind];
  return <Component />;
}
