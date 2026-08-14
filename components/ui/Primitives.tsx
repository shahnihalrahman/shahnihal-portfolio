import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/* ─────────────────────────────  SECTION HEAD  ───────────────────────────── */

export function SectionHead({
  index,
  kicker,
  narrative,
  title,
  lede,
  align = 'left',
  className,
}: {
  index?: string;
  kicker: string;
  /** One-line narrative beat, e.g. "How I work". Ties the page together as a story. */
  narrative?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <header
      className={cn(
        'relative',
        align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3',
          align === 'center' && 'justify-center',
        )}
      >
        {index ? (
          <span className="font-mono text-2xs text-ink-faint tabular-nums">{index}</span>
        ) : null}
        <span className="h-px w-8 bg-gradient-to-r from-accent-cyan/70 to-transparent" />
        <span className="label">{kicker}</span>
        {narrative ? (
          <>
            <span className="hidden h-3 w-px bg-white/12 sm:block" aria-hidden />
            <span className="hidden font-mono text-2xs uppercase tracking-label text-accent-cyan/70 sm:block">
              {narrative}
            </span>
          </>
        ) : null}
      </div>
      <h2 className="mt-5 text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.03]">
        {title}
      </h2>
      {lede ? (
        <p
          className={cn(
            'mt-5 text-[1.0625rem] leading-relaxed text-ink-soft',
            align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl',
          )}
        >
          {lede}
        </p>
      ) : null}
    </header>
  );
}

/* ───────────────────────────────  STATUS DOT  ─────────────────────────────── */

const toneStyles = {
  live: { dot: 'bg-emerald-400', ring: 'bg-emerald-400/30', text: 'text-emerald-300' },
  building: { dot: 'bg-accent-cyan', ring: 'bg-accent-cyan/30', text: 'text-accent-cyan' },
  iterating: { dot: 'bg-accent-blue', ring: 'bg-accent-blue/30', text: 'text-accent-blue' },
  experimenting: { dot: 'bg-accent-violet', ring: 'bg-accent-violet/30', text: 'text-accent-violet' },
  planned: { dot: 'bg-ink-faint', ring: 'bg-ink-faint/25', text: 'text-ink-muted' },
} as const;

export type Tone = keyof typeof toneStyles;

export function StatusDot({ tone, className }: { tone: Tone; className?: string }) {
  const s = toneStyles[tone];
  return (
    <span className={cn('relative flex h-2 w-2 shrink-0', className)} aria-hidden>
      <span className={cn('absolute inset-0 animate-pulse-node rounded-full', s.ring)} />
      <span className={cn('relative m-auto h-1.5 w-1.5 rounded-full', s.dot)} />
    </span>
  );
}

export function StatusPill({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
}) {
  const s = toneStyles[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1',
        'font-mono text-2xs uppercase tracking-label',
        s.text,
        className,
      )}
    >
      <StatusDot tone={tone} />
      {children}
    </span>
  );
}

/* ──────────────────────────────────  TAG  ────────────────────────────────── */

export function Tag({
  children,
  muted,
  className,
}: {
  children: ReactNode;
  muted?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-2xs tracking-wide',
        muted
          ? 'border-white/[0.06] bg-white/[0.015] text-ink-faint'
          : 'border-white/[0.09] bg-white/[0.03] text-ink-soft',
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ────────────────────────────────  BUTTONS  ──────────────────────────────── */

type ButtonBase = {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'ghost' | 'quiet';
};

const buttonStyles = {
  primary:
    'group relative overflow-hidden rounded-full bg-gradient-to-r from-accent-cyan via-[#7ad6ff] to-accent-violet px-6 py-3 text-sm font-semibold text-void shadow-[0_18px_50px_-20px_rgba(62,224,242,0.7)] transition-transform duration-500 ease-premium hover:scale-[1.02] active:scale-[0.99]',
  ghost:
    'group relative rounded-full border border-white/12 bg-white/[0.025] px-6 py-3 text-sm font-medium text-ink transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06]',
  // min-h keeps this a comfortable touch target even though it reads as inline text.
  quiet:
    'group inline-flex min-h-11 items-center gap-2 py-2 text-sm font-medium text-ink-soft transition-colors duration-300 hover:text-ink',
} as const;

export function ActionLink({
  href,
  external,
  children,
  className,
  variant = 'primary',
  ...rest
}: ButtonBase & {
  href: string;
  external?: boolean;
  'aria-label'?: string;
}) {
  return (
    <a
      href={href}
      data-focus-ring="custom"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        buttonStyles[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}

export function ActionButton({
  children,
  className,
  variant = 'ghost',
  ...rest
}: ButtonBase & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      data-focus-ring="custom"
      className={cn(
        'inline-flex items-center justify-center gap-2',
        buttonStyles[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ────────────────────────────────  ICONS  ──────────────────────────────── */

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn('h-3.5 w-3.5', className)}
      strokeWidth="1.6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn('h-3.5 w-3.5', className)}
      strokeWidth="1.6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 3.5H12.5V9.5M12.5 3.5 7 9M11 11.5v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h1" />
    </svg>
  );
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn('h-3.5 w-3.5', className)}
      strokeWidth="1.6"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <path d="M8 3.5v9M3.5 8h9" />
    </svg>
  );
}

/* ─────────────────────────────  FLOW CONNECTOR  ─────────────────────────── */

/** Horizontal / vertical connector with an animated data pulse. */
export function Connector({
  orientation = 'horizontal',
  className,
}: {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) {
  if (orientation === 'vertical') {
    return (
      <div className={cn('relative mx-auto h-8 w-px overflow-hidden', className)} aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.16] to-white/[0.16]" />
        <div className="absolute inset-x-0 -top-4 h-4 animate-scan bg-gradient-to-b from-transparent via-accent-cyan to-transparent" />
      </div>
    );
  }
  return (
    <div className={cn('relative h-px min-w-6 flex-1 overflow-hidden', className)} aria-hidden>
      <div className="absolute inset-0 bg-white/[0.14]" />
    </div>
  );
}
