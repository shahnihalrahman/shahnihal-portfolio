import { microcopy, site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] pb-28 pt-10 md:pb-12">
      <div className="shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.9375rem] font-semibold tracking-tight text-ink">{site.name}</p>
          <p className="mt-1.5 font-mono text-2xs uppercase tracking-label text-ink-faint">
            {site.role}
          </p>
        </div>

        <div className="sm:text-right">
          <p className="font-mono text-2xs uppercase tracking-label text-ink-faint">
            {microcopy.purpose}
          </p>
          <p className="mt-2 text-[0.75rem] text-ink-faint">
            Built with Next.js, TypeScript and AI-assisted development.
          </p>
        </div>
      </div>
    </footer>
  );
}
