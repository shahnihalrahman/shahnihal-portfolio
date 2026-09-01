'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import { useFocusTrap, useMediaQuery, useScrollLock } from '@/lib/hooks';
import type { ProjectReport } from '@/lib/projects';
import { cn } from '@/lib/utils';

/**
 * EMBEDDED REPORT VIEWER
 *
 * The dissertation is the artefact for this project, so it is read in place
 * rather than downloaded and opened elsewhere.
 *
 * WHY THE BROWSER'S OWN PDF ENGINE, NOT A BUNDLED ONE
 *
 * The first build of this used react-pdf/pdf.js so the toolbar could be styled
 * to match the rest of the page. pdfjs-dist v5's ESM build does not survive
 * this project's webpack pipeline — it throws `Object.defineProperty called on
 * non-object` while the module is still evaluating, before any component code
 * runs. Rather than fight the bundler or pre-render 30 pages to images, the
 * viewer hands the file to the engine already in every browser.
 *
 * What that buys: page navigation, zoom, fit, text search, text selection,
 * print and download, all natively, with no dependency added and no 1MB worker
 * shipped. What it costs: the control strip inside the document area is the
 * browser's, not ours. The frame, the page jumps and the chrome around it are.
 *
 * Inline PDF embedding is unreliable on iOS and most mobile browsers — they
 * render only the first page, or nothing. Coarse-pointer devices therefore get
 * an explicit hand-off instead of a broken embed.
 */

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

const PATH = {
  close: 'M18 6L6 18M6 6l12 12',
  expand: 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7',
  shrink: 'M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7',
  external: 'M14 3h7v7M21 3l-9 9M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5',
} as const;

function ToolButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      data-focus-ring="custom"
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg border px-2 font-mono text-[0.625rem] uppercase tracking-label transition-colors duration-300',
        active
          ? 'border-accent-cyan/35 bg-accent-cyan/[0.08] text-accent-cyan'
          : 'border-white/[0.09] bg-white/[0.03] text-ink-soft hover:border-white/25 hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}

export default function ReportViewer({
  report,
  initialPage = 1,
  onClose,
}: {
  report: ProjectReport;
  initialPage?: number;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const canEmbed = useMediaQuery('(hover: hover) and (pointer: fine)');
  const [page, setPage] = useState(initialPage);
  const [isFull, setIsFull] = useState(false);

  useScrollLock(true);
  const dialogRef = useFocusTrap(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (document.fullscreenElement) return;
      e.preventDefault();
      onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const onFs = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  }, [dialogRef]);

  /* `view=FitH` opens fitted to width; the fragment also drives page jumps.
     Keying the iframe on it forces a reload, which Safari needs. */
  const src = `${report.src}#page=${page}&view=FitH&toolbar=1`;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-6"
        initial={reduced ? undefined : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        exit={reduced ? undefined : { opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <button
          type="button"
          aria-label="Close report"
          onClick={onClose}
          className="absolute inset-0 cursor-default bg-void/85 backdrop-blur-sm"
        />

        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={report.title}
          initial={reduced ? undefined : { opacity: 0, y: 16, scale: 0.99 }}
          animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-full w-full flex-col overflow-hidden border-white/[0.09] bg-[#080B12] shadow-lift sm:h-[92vh] sm:max-w-6xl sm:rounded-3xl sm:border"
        >
          {/* Chrome */}
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-white/[0.07] bg-white/[0.02] px-3 py-2.5 sm:px-4">
            <div className="mr-auto min-w-0 flex-1">
              <p className="truncate font-mono text-[0.625rem] uppercase tracking-label text-ink-faint">
                {report.title}
              </p>
              <p className="mt-0.5 truncate font-mono text-[0.625rem] uppercase tracking-label text-ink-muted">
                {report.pages} pages · original
              </p>
            </div>

            <a
              href={report.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the original PDF in a new tab"
              title="Open original PDF"
              data-focus-ring="custom"
              className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.03] text-ink-soft transition-colors duration-300 hover:border-white/25 hover:text-ink"
            >
              <Icon d={PATH.external} />
            </a>
            {canEmbed ? (
              <ToolButton
                label={isFull ? 'Exit fullscreen' : 'Fullscreen'}
                onClick={toggleFullscreen}
                active={isFull}
              >
                <Icon d={isFull ? PATH.shrink : PATH.expand} />
              </ToolButton>
            ) : null}
            <ToolButton label="Close report" onClick={onClose}>
              <Icon d={PATH.close} />
            </ToolButton>
          </div>

          {/* Page jumps — the pages worth going straight to. */}
          <div className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-white/[0.07] bg-white/[0.012] px-3 py-2 sm:px-4">
            {report.highlights.map((h) => (
              <button
                key={h.page}
                type="button"
                onClick={() => setPage(h.page)}
                data-focus-ring="custom"
                className={cn(
                  'shrink-0 rounded-md border px-2.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-label transition-colors duration-300',
                  h.page === page
                    ? 'border-accent-cyan/30 bg-accent-cyan/[0.07] text-accent-cyan'
                    : 'border-white/[0.09] text-ink-faint hover:border-white/25 hover:text-ink-soft',
                )}
              >
                <span className="tabular-nums opacity-60">
                  p{String(h.page).padStart(2, '0')}
                </span>{' '}
                {h.label}
              </button>
            ))}
          </div>

          {/* Document */}
          <div className="relative min-h-0 flex-1 bg-[#05070C]">
            {canEmbed ? (
              <iframe
                key={page}
                src={src}
                title={report.title}
                className="h-full w-full border-0 bg-white"
              />
            ) : (
              /* Coarse pointer: hand off rather than render a broken embed. */
              <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
                <p className="max-w-xs text-[0.9375rem] leading-relaxed text-ink-soft">
                  Mobile browsers can&rsquo;t reliably display a PDF inline, so the report opens
                  in your device&rsquo;s own viewer.
                </p>
                <a
                  href={report.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-focus-ring="custom"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan via-[#7ad6ff] to-accent-violet px-6 py-3 text-sm font-semibold text-void"
                >
                  Open the report
                  <Icon d={PATH.external} />
                </a>
                <p className="max-w-xs text-[0.75rem] leading-relaxed text-ink-faint">
                  {report.pages} pages. {report.note}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
