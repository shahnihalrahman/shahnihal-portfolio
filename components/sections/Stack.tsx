'use client';

import { useState } from 'react';

import { Constellation } from '@/components/stack/Constellation';
import { SectionHead } from '@/components/ui/Primitives';
import { Reveal } from '@/components/ui/Reveal';
import { useMediaQuery, usePrefersReducedMotion } from '@/lib/hooks';
import { clusters, evidenceMeta, type Evidence, type TechNode } from '@/lib/stack';
import { cn } from '@/lib/utils';

const evidenceDot: Record<Evidence, string> = {
  repo: 'bg-emerald-400',
  shipped: 'bg-accent-cyan',
  exploring: 'bg-accent-violet',
};

const clusterAccent = {
  cyan: 'text-accent-cyan',
  blue: 'text-accent-blue',
  violet: 'text-accent-violet',
} as const;

function EvidenceKey() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {(Object.keys(evidenceMeta) as Evidence[]).map((key) => (
        <li key={key} className="flex items-start gap-2">
          <span
            aria-hidden
            className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', evidenceDot[key])}
          />
          <span>
            <span className="block font-mono text-2xs uppercase tracking-label text-ink-soft">
              {evidenceMeta[key].label}
            </span>
            <span className="mt-0.5 block text-[0.6875rem] leading-snug text-ink-faint">
              {evidenceMeta[key].description}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Grouped, static fallback: phones and reduced-motion visitors get this. */
function ClusterGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {clusters.map((cluster) => (
        <div
          key={cluster.id}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.014] p-5"
        >
          <h3 className={cn('text-sm font-semibold', clusterAccent[cluster.accent])}>
            {cluster.label}
          </h3>
          <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-faint">{cluster.blurb}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {cluster.nodes.map((node) => (
              <li
                key={node.name}
                className={cn(
                  'flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[0.6875rem] tracking-wide text-ink-soft',
                  node.evidence === 'exploring'
                    ? 'border-dashed border-white/[0.1]'
                    : 'border-white/[0.08]',
                )}
              >
                <span
                  aria-hidden
                  className={cn('h-1 w-1 rounded-full', evidenceDot[node.evidence])}
                />
                {node.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Stack() {
  const reduced = usePrefersReducedMotion();
  const isLarge = useMediaQuery('(min-width: 1024px)');
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const [hovered, setHovered] = useState<{ clusterId: string; node: TechNode } | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  const use3d = isLarge && canHover && !reduced;
  const activeClusterId = hovered?.clusterId ?? pinned;
  const activeCluster = clusters.find((c) => c.id === activeClusterId) ?? null;
  const detail = hovered?.node ?? null;

  const totalCount = clusters.reduce((sum, c) => sum + c.nodes.length, 0);

  return (
    <section id="stack" data-stage="stack" className="section relative seam">
      <div className="shell">
        <SectionHead
          index="05"
          kicker="Technology constellation"
          narrative="What I build with"
          title={
            <>
              The Stack, <span className="text-gradient">Mapped Honestly</span>
            </>
          }
          lede="No skill meters. A bar claiming near-mastery of React tells you nothing you can check. Instead, every technology here carries where it comes from: a real repository, delivered work, or something I am openly still exploring."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ── Map ─────────────────────────────────────────────────── */}
          <div className="min-w-0 lg:col-span-7">
            {use3d ? (
              <>
                <Constellation
                  activeCluster={activeClusterId}
                  activeNode={hovered?.node.name ?? null}
                  onHover={setHovered}
                />
                <p className="mt-2 text-center font-mono text-2xs uppercase tracking-label text-ink-faint">
                  {totalCount} technologies · move the pointer to steer · hover one to see what it connects to
                </p>
              </>
            ) : (
              <ClusterGrid />
            )}
          </div>

          {/* ── Legend & detail ────────────────────────────────────── */}
          <div className="min-w-0 lg:col-span-5">
            <ul className="divide-y divide-white/[0.055]">
              {clusters.map((cluster) => {
                const isActive = activeClusterId === cluster.id;
                return (
                  <li key={cluster.id}>
                    <button
                      type="button"
                      onPointerEnter={() => (use3d ? setPinned(cluster.id) : undefined)}
                      onPointerLeave={() => (use3d ? setPinned(null) : undefined)}
                      onFocus={() => setPinned(cluster.id)}
                      onBlur={() => setPinned(null)}
                      onClick={() => setPinned(isActive ? null : cluster.id)}
                      data-focus-ring="custom"
                      className="group flex w-full items-center gap-4 py-3.5 text-left"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-300',
                          cluster.accent === 'cyan' && 'bg-accent-cyan',
                          cluster.accent === 'blue' && 'bg-accent-blue',
                          cluster.accent === 'violet' && 'bg-accent-violet',
                          isActive && 'scale-[1.8]',
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            'block text-[0.9375rem] font-medium transition-colors',
                            isActive ? 'text-ink' : 'text-ink-soft group-hover:text-ink',
                          )}
                        >
                          {cluster.label}
                        </span>
                        <span className="mt-0.5 block text-[0.75rem] leading-snug text-ink-faint">
                          {cluster.blurb}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-2xs tabular-nums text-ink-faint">
                        {String(cluster.nodes.length).padStart(2, '0')}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Readout */}
            <div className="mt-6 min-h-[8.5rem] rounded-2xl border border-white/[0.07] bg-white/[0.016] p-5">
              {detail ? (
                <>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      aria-hidden
                      className={cn('h-1.5 w-1.5 rounded-full', evidenceDot[detail.evidence])}
                    />
                    <span className="font-mono text-2xs uppercase tracking-label text-ink-muted">
                      {evidenceMeta[detail.evidence].label}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-semibold tracking-tight text-ink">
                    {detail.name}
                  </p>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">
                    {detail.note ?? evidenceMeta[detail.evidence].description}
                  </p>
                  {detail.links?.length ? (
                    <div className="mt-3.5 border-t border-white/[0.07] pt-3">
                      <p className="label mb-2">Connects to</p>
                      <ul className="flex flex-wrap gap-1.5">
                        {detail.links.map((l) => (
                          <li
                            key={l}
                            className="rounded-md border border-accent-cyan/25 bg-accent-cyan/[0.06] px-2 py-0.5 font-mono text-[0.6875rem] text-accent-cyan"
                          >
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </>
              ) : activeCluster ? (
                <>
                  <span className="font-mono text-2xs uppercase tracking-label text-ink-muted">
                    {activeCluster.label}
                  </span>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                    {activeCluster.blurb}
                  </p>
                </>
              ) : (
                <>
                  <span className="font-mono text-2xs uppercase tracking-label text-ink-muted">
                    Evidence key
                  </span>
                  <div className="mt-3.5">
                    <EvidenceKey />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <Reveal delay={0.06}>
          <p className="mt-12 max-w-prose text-[0.9375rem] leading-relaxed text-ink-faint">
            Progress bars on a skills list are a design decision that hides information. A tag with
            a source behind it tells you more in less space — and it is checkable.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
