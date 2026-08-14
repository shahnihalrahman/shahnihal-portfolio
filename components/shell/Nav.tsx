'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useActiveSection, useAnchorScroll } from '@/lib/hooks';
import { navItems } from '@/lib/site';
import { cn } from '@/lib/utils';

const sectionIds = navItems.map((item) => item.href.replace('#', ''));

export function Nav() {
  const active = useActiveSection(sectionIds);
  const scrollTo = useAnchorScroll();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (href: string) => {
    scrollTo(href);
    setOpen(false);
  };

  const activeLabel =
    navItems.find((item) => item.href === `#${active}`)?.label ?? navItems[0].label;

  return (
    <>
      {/* ── Desktop / tablet: floating pill ───────────────────────────── */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden justify-center px-6 pt-5 md:flex">
        <nav
          aria-label="Primary"
          className={cn(
            'pointer-events-auto flex items-center gap-1 rounded-full border p-1.5 transition-all duration-500 ease-premium',
            condensed
              ? 'glass border-white/[0.09] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]'
              : 'border-white/[0.05] bg-white/[0.018] backdrop-blur-md',
          )}
        >
          <span
            className="ml-2 mr-1.5 hidden select-none font-mono text-2xs uppercase tracking-label text-ink-faint lg:inline"
            aria-hidden
          >
            SR
          </span>
          {navItems.map((item) => {
            const isActive = item.href === `#${active}`;
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => go(item.href)}
                aria-current={isActive ? 'true' : undefined}
                data-focus-ring="custom"
                className={cn(
                  'relative rounded-full px-3.5 py-2 text-[0.8125rem] font-medium transition-colors duration-300',
                  isActive ? 'text-void' : 'text-ink-soft hover:text-ink',
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-cyan to-[#8fd8ff]"
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }
                    }
                  />
                ) : null}
                <span className="relative">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/*
        ── Mobile: compact floating control ────────────────────────────
        Sized to 100dvh and aligned to its end rather than pinned with
        `bottom-0`. `bottom-0` resolves against the large viewport, which parks
        the control behind the browser's own chrome on real phones.
        Safe-area padding keeps it clear of the home indicator.
      */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-[100dvh] flex-col items-center justify-end px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
        <AnimatePresence>
          {open ? (
            <motion.nav
              aria-label="Primary"
              initial={reduced ? undefined : { opacity: 0, y: 12, scale: 0.97 }}
              animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto mb-2.5 w-full max-w-sm rounded-3xl border border-white/[0.09] bg-[#0a0d14]/97 p-2 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.95)]"
            >
              <ul className="grid grid-cols-2 gap-1.5">
                {navItems.map((item) => {
                  const isActive = item.href === `#${active}`;
                  return (
                    <li key={item.href}>
                      <button
                        type="button"
                        onClick={() => go(item.href)}
                        aria-current={isActive ? 'true' : undefined}
                        data-focus-ring="custom"
                        className={cn(
                          'flex w-full items-center gap-2.5 rounded-2xl px-3.5 py-3 text-left text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-white/[0.09] text-ink'
                            : 'text-ink-soft active:bg-white/[0.05]',
                        )}
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full transition-colors',
                            isActive ? 'bg-accent-cyan' : 'bg-ink-faint/50',
                          )}
                          aria-hidden
                        />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          ) : null}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          /**
           * The accessible name has to contain the visible text (the current
           * section) to satisfy WCAG 2.5.3 Label in Name, otherwise voice-control
           * users cannot address this button by what they can see on it.
           */
          aria-label={open ? `${activeLabel}, close navigation` : `${activeLabel}, open navigation`}
          data-focus-ring="custom"
          className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/[0.09] bg-[#0a0d14]/95 py-2.5 pl-4 pr-3 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.95)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" aria-hidden />
          <span className="font-mono text-2xs uppercase tracking-label text-ink">
            {activeLabel}
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.07]">
            <svg
              viewBox="0 0 16 16"
              className={cn(
                'h-3.5 w-3.5 text-ink-soft transition-transform duration-300',
                open && 'rotate-180',
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M4 10l4-4 4 4" />
            </svg>
          </span>
        </button>
      </div>
    </>
  );
}
