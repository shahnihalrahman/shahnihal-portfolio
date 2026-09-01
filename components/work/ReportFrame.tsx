'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import { ActionButton, ArrowIcon } from '@/components/ui/Primitives';
import type { Project, ProjectReport } from '@/lib/projects';
import { cn } from '@/lib/utils';

/**
 * The card-side face of a report-backed project.
 *
 * pdf.js is a heavy dependency, so the viewer is pulled in only when the
 * visitor asks for it — `ssr: false` plus a dynamic import keeps it out of the
 * initial bundle and off the LCP path. Until then this frame is plain markup:
 * the highlighted pages are labelled tiles, not rendered PDF canvases.
 */
const ReportViewer = dynamic(() => import('@/components/work/ReportViewer'), {
  ssr: false,
});

const accentChip = {
  cyan: 'border-accent-cyan/25 bg-accent-cyan/[0.07] text-accent-cyan',
  blue: 'border-accent-blue/25 bg-accent-blue/[0.07] text-accent-blue',
  violet: 'border-accent-violet/25 bg-accent-violet/[0.07] text-accent-violet',
} as const;

function DocIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 3v5h5M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-4-5z" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}

export function ReportFrame({
  project,
  report,
}: {
  project: Project;
  report: ProjectReport;
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#080B12] shadow-lift">
        {/* Document bar — the report equivalent of the browser bar on a capture. */}
        <div className="flex items-center gap-2.5 border-b border-white/[0.07] bg-white/[0.022] px-3 py-2">
          <span className="flex items-center gap-1.5 text-ink-faint">
            <DocIcon />
          </span>
          <span className="min-w-0 flex-1 truncate font-mono text-[0.625rem] uppercase tracking-label text-ink-muted">
            Dissertation · {report.pages} pages
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/90" aria-hidden />
            <span className="hidden font-mono text-[0.625rem] uppercase tracking-label text-emerald-300/85 sm:inline">
              Original
            </span>
          </span>
        </div>

        <div className="relative bg-[#05070C] p-3.5 sm:p-4">
          <div className="absolute inset-0 bg-grid-fine bg-grid-sm opacity-[0.25]" aria-hidden />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(460px 240px at 82% 8%, rgba(169,140,255,0.10), transparent 70%)',
            }}
          />

          <ul className="relative grid grid-cols-2 gap-2.5">
            {report.highlights.map((h) => (
              <li key={h.page}>
                <button
                  type="button"
                  onClick={() => setOpenAt(h.page)}
                  data-focus-ring="custom"
                  aria-label={`Open page ${h.page} of the report — ${h.label}`}
                  className="group/tile flex h-full w-full flex-col items-start gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-left transition-colors duration-300 hover:border-accent-violet/30 hover:bg-white/[0.04]"
                >
                  <span className="flex w-full items-center gap-2">
                    <span className="font-mono text-[0.625rem] tabular-nums text-ink-faint">
                      p{String(h.page).padStart(2, '0')}
                    </span>
                    <span
                      aria-hidden
                      className="h-px flex-1 bg-gradient-to-r from-white/12 to-transparent"
                    />
                  </span>
                  <span className="font-mono text-2xs uppercase tracking-label text-ink-soft transition-colors group-hover/tile:text-accent-violet/90">
                    {h.label}
                  </span>
                  <span className="text-[0.75rem] leading-snug text-ink-faint">{h.caption}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="relative mt-3.5">
            <ActionButton
              variant="ghost"
              onClick={() => setOpenAt(1)}
              aria-haspopup="dialog"
              className="w-full justify-center"
            >
              Read Project Report
              <ArrowIcon className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5" />
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Provenance, outside the frame — same convention as the capture frames. */}
      <div className="mt-3 space-y-2.5 px-0.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span
            className={cn(
              'rounded-md border px-2 py-1 font-mono text-[0.625rem] uppercase tracking-label',
              accentChip[project.accent],
            )}
          >
            B.Tech · 2023
          </span>
          <p className="min-w-0 flex-1 text-[0.8125rem] leading-snug text-ink-soft">
            {report.note}
          </p>
        </div>
        <p className="text-[0.75rem] leading-relaxed text-ink-faint">
          Select any page to read it in place — page navigation, zoom, fit and fullscreen included.
        </p>
      </div>

      {openAt !== null ? (
        <ReportViewer report={report} initialPage={openAt} onClose={() => setOpenAt(null)} />
      ) : null}
    </>
  );
}
