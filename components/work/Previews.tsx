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
 * Scope note: blueprints cover only the entries with no shipped interface to
 * show. Daktarji and Truepost India render real captures instead — see
 * `ProductProof` — so a wireframe can never stand in for a product that exists.
 *
 * The two Applied AI products are diagrams of their own workflow rather than
 * mock screens, because the workflow is the product. Bar widths and segment
 * counts are illustrative structure in the same way the commerce wireframe's
 * are: no creator handles, no fit scores and no visibility percentages appear,
 * since none of those could be sourced.
 *
 * Motion here is CSS-only (`animate-dash-flow`, `animate-pulse-node`), so the
 * global `prefers-reduced-motion` rule in globals.css stills it with no
 * component-level branching.
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

/* ──────────────────────  05 · AI GEO — VISIBILITY TEST  ────────────────── */

/** Mirrors the `architecture` nodes on the ai-geo project. */
const GEO_FLOW = [
  'Prompt',
  'AI model',
  'Response',
  'Competitor set',
  'Gap detection',
  'Recommendation',
];

/** The stage the diagram highlights, matching the product's actual purpose. */
const GEO_FOCUS = 4;

function GeoPreview() {
  return (
    <Chrome
      label="AI GEO · visibility test"
      meta="Prompt → Response → Gap → Recommendation"
      accentClass="bg-accent-violet/70"
    >
      <div className="flex h-full flex-col gap-2.5">
        {/* Hidden on short windows: the window bar already names the test, and
            this row is what squeezed the sixth stage out of view on a phone. */}
        <div className="hidden items-center justify-between gap-2 sm:flex">
          <span className="truncate font-mono text-[0.625rem] uppercase tracking-label text-ink-faint">
            Generative engine optimization
          </span>
          <span className="shrink-0 rounded-md border border-accent-violet/35 px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-label text-accent-violet/85">
            Re-testable
          </span>
        </div>

        {/* The run. One column with a flowing spine from `sm` up; two compact
            columns on short windows so all six stages stay visible instead of
            the last two being clipped. */}
        <div className="flex min-h-0 flex-1 gap-2.5">
          <svg
            viewBox="0 0 8 100"
            preserveAspectRatio="none"
            className="hidden h-full w-2 shrink-0 sm:block"
            aria-hidden
          >
            <line x1="4" y1="2" x2="4" y2="98" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
            <line
              x1="4"
              y1="2"
              x2="4"
              y2="98"
              stroke="rgba(169,140,255,0.7)"
              strokeWidth="1"
              strokeDasharray="5 17"
              strokeLinecap="round"
              className="animate-dash-flow"
            />
          </svg>

          <ol className="flex min-w-0 flex-1 flex-col justify-start gap-0.5 sm:gap-2.5">
            {GEO_FLOW.map((label, i) => (
              <li key={label} className="flex min-w-0 items-center gap-2">
                <span className="hidden w-3 shrink-0 font-mono text-2xs tabular-nums text-ink-faint sm:block">
                  {i + 1}
                </span>
                {/* Bare rows on short windows, chips from `sm` up: the borders
                    are what push the six stages past a phone-height window. */}
                <span
                  className={cn(
                    'flex min-w-0 flex-1 items-center gap-2 sm:rounded-lg sm:border sm:px-3 sm:py-2.5',
                    i === GEO_FOCUS
                      ? 'sm:border-accent-violet/25 sm:bg-accent-violet/[0.05]'
                      : 'sm:border-white/[0.06] sm:bg-white/[0.014]',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full',
                      i === GEO_FOCUS ? 'animate-pulse-node bg-accent-violet' : 'bg-white/25',
                    )}
                  />
                  <span
                    className={cn(
                      'truncate font-mono text-[0.625rem] uppercase tracking-label sm:text-2xs',
                      i === GEO_FOCUS ? 'text-accent-violet/90' : 'text-ink-soft',
                    )}
                  >
                    {label}
                  </span>
                  <span
                    aria-hidden
                    className="ml-auto hidden h-px w-6 bg-gradient-to-r from-white/12 to-transparent sm:block"
                  />
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Presence side by side. Structure only — no visibility figures exist.
            Hidden on the shortest windows, where the flow above is the priority. */}
        <div className="hidden grid-cols-2 gap-2.5 border-t border-white/[0.06] pt-2.5 sm:grid">
          {['This brand', 'Competitor'].map((who, i) => (
            <div key={who} className="min-w-0">
              <span className="block truncate font-mono text-[0.625rem] uppercase tracking-label text-ink-faint">
                {who}
              </span>
              <span className="mt-1.5 flex gap-1" aria-hidden>
                {[0, 1, 2, 3].map((j) => (
                  <span
                    key={j}
                    className={cn(
                      'h-1 flex-1 rounded-full',
                      j <= (i === 0 ? 1 : 3)
                        ? i === 0
                          ? 'bg-accent-violet/55'
                          : 'bg-white/22'
                        : 'bg-white/[0.07]',
                    )}
                  />
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

/* ─────────────────  06 · INFLUENCER AGENT — CAMPAIGN RUN  ──────────────── */

/** Marked exactly as the project data marks them: supervised, not autonomous. */
const AGENT_TAIL = [
  { label: 'Outreach', supervised: true },
  { label: 'Conversation', supervised: true },
  { label: 'Qualified', supervised: false },
];

function InfluencerPreview() {
  return (
    <Chrome
      label="Influencer agent · campaign run"
      meta="Brief → Discovery → Scoring → Outreach"
      accentClass="bg-accent-blue/70"
    >
      <div className="flex h-full flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-mono text-[0.625rem] uppercase tracking-label text-ink-faint">
            Agentic workflow
          </span>
          <span className="shrink-0 rounded-md border border-accent-blue/35 px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-label text-accent-blue/85">
            Human-in-the-loop
          </span>
        </div>

        {/* Brief feeding the agent. */}
        <div className="flex items-center gap-2">
          <span className="shrink-0 rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-1 font-mono text-[0.625rem] uppercase tracking-label text-ink-muted">
            Brief
          </span>
          <svg viewBox="0 0 60 4" preserveAspectRatio="none" className="h-1 flex-1" aria-hidden>
            <line x1="0" y1="2" x2="60" y2="2" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line
              x1="0"
              y1="2"
              x2="60"
              y2="2"
              stroke="rgba(110,140,255,0.75)"
              strokeWidth="1"
              strokeDasharray="4 12"
              strokeLinecap="round"
              className="animate-dash-flow"
            />
          </svg>
          <span className="flex shrink-0 items-center gap-1.5 rounded-md border border-accent-blue/30 bg-accent-blue/[0.06] px-2 py-1">
            <span aria-hidden className="h-1.5 w-1.5 animate-pulse-node rounded-full bg-accent-blue" />
            <span className="font-mono text-[0.625rem] uppercase tracking-label text-accent-blue/90">
              Agent
            </span>
          </span>
        </div>

        {/* Candidates. Anonymous rows: no handles or scores were available. */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.014] p-2 sm:p-2.5">
          <span className="hidden shrink-0 truncate font-mono text-[0.625rem] uppercase tracking-label text-ink-faint sm:block">
            Creator candidates · ranked for fit
          </span>
          {/* Rows spread through the panel rather than stacking at the top, so
              a tall desktop window fills instead of leaving dead space. */}
          <ul className="flex min-h-0 flex-1 flex-col justify-center gap-1.5 sm:justify-around sm:gap-0 sm:pt-1">
            {[0, 1, 2].map((i) => (
              <li
                key={i}
                className={cn('flex items-center gap-2', i === 2 && 'hidden sm:flex')}
              >
                <span
                  aria-hidden
                  className="h-4 w-4 shrink-0 rounded-full border border-white/[0.09] bg-white/[0.03]"
                />
                <span className="min-w-0 flex-1">
                  <Bar w={['74%', '58%', '44%'][i]} dim={i === 2} />
                </span>
                <span aria-hidden className="flex w-9 shrink-0 gap-0.5">
                  {[0, 1, 2].map((j) => (
                    <span
                      key={j}
                      className={cn(
                        'h-1 flex-1 rounded-full',
                        j <= 2 - i ? 'bg-accent-blue/55' : 'bg-white/[0.07]',
                      )}
                    />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Where the human stays in the loop. The badge in the header carries the
            same fact at every width, so hiding this row on short windows costs
            no accuracy. */}
        <ol className="hidden items-center gap-1.5 sm:flex">
          {AGENT_TAIL.map((s, i) => (
            <li key={s.label} className="flex min-w-0 flex-1 items-center gap-1.5">
              <span
                className={cn(
                  'min-w-0 flex-1 truncate rounded border px-1.5 py-1 text-center font-mono text-[0.625rem] uppercase tracking-label',
                  s.supervised
                    ? 'border-accent-blue/30 bg-accent-blue/[0.05] text-accent-blue/85'
                    : 'border-white/[0.07] text-ink-muted',
                )}
              >
                {s.label}
              </span>
              {i < AGENT_TAIL.length - 1 ? (
                <span aria-hidden className="h-px w-1.5 shrink-0 bg-white/12" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </Chrome>
  );
}

/* ────────────────────────────────  EXPORT  ─────────────────────────────── */

const previews: Record<PreviewKind, () => React.JSX.Element> = {
  commerce: CommercePreview,
  agents: AgentsPreview,
  geo: GeoPreview,
  influencer: InfluencerPreview,
};

export function ProjectPreview({ kind }: { kind: PreviewKind }) {
  const Component = previews[kind];
  return <Component />;
}
