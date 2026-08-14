import { Magnetic } from '@/components/ui/Magnetic';
import { ActionLink, ArrowIcon, ExternalIcon } from '@/components/ui/Primitives';
import { Reveal } from '@/components/ui/Reveal';
import { site } from '@/lib/site';

/**
 * Social buttons only render when a real URL is configured in lib/site.ts.
 * An empty string means the button is absent — never a dead or invented link.
 */
export function Contact() {
  const candidates = [
    { label: 'LinkedIn', href: site.social.linkedin },
    { label: 'GitHub', href: site.social.github },
  ];
  const socials = candidates.filter((item) => item.href.length > 0);
  const missing = candidates.filter((item) => item.href.length === 0).map((item) => item.label);

  return (
    <section id="contact" data-stage="contact" className="section relative overflow-hidden">
      {/* Closing glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-14rem] h-[34rem] bg-[radial-gradient(closest-side,rgba(62,224,242,0.13),rgba(169,140,255,0.07)_55%,transparent)]"
      />

      <div className="shell relative">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-accent-cyan/70 to-transparent" />
          <span className="label">Contact</span>
        </div>

        <Reveal>
          <h2 className="mt-6 max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1.01]">
            Have an idea{' '}
            <span className="text-gradient">worth building?</span>
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
            Let&rsquo;s turn it into something real.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <Magnetic strength={9}>
              <ActionLink href={`mailto:${site.email}`} variant="primary">
                Email Me
                <ArrowIcon className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5" />
              </ActionLink>
            </Magnetic>
            {socials.map((social) => (
              <ActionLink key={social.label} href={social.href} external variant="ghost">
                {social.label}
                <ExternalIcon />
              </ActionLink>
            ))}
          </div>
        </Reveal>

        {/* Details */}
        <Reveal delay={0.16}>
          <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.05] sm:grid-cols-3">
            <div className="bg-void-2/90 p-5">
              <dt className="label">Email</dt>
              <dd className="mt-2.5">
                <a
                  href={`mailto:${site.email}`}
                  data-focus-ring="custom"
                  className="inline-flex min-h-11 items-center break-all text-[0.9375rem] font-medium text-ink transition-colors hover:text-accent-cyan"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="bg-void-2/90 p-5">
              <dt className="label">Phone</dt>
              <dd className="mt-2.5">
                <a
                  href={`tel:${site.phoneHref}`}
                  data-focus-ring="custom"
                  className="inline-flex min-h-11 items-center text-[0.9375rem] font-medium text-ink transition-colors hover:text-accent-cyan"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
            <div className="bg-void-2/90 p-5">
              <dt className="label">Location</dt>
              <dd className="mt-2.5 text-[0.9375rem] font-medium leading-snug text-ink">
                {site.location}
              </dd>
            </div>
          </dl>
        </Reveal>

        {missing.length ? (
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-prose text-[0.8125rem] leading-relaxed text-ink-faint">
              {missing.join(' and ')} {missing.length > 1 ? 'buttons' : 'button'} will appear here
              automatically once the {missing.length > 1 ? 'URLs are' : 'URL is'} added to{' '}
              <span className="font-mono text-ink-muted">lib/site.ts</span>. Nothing is linked until
              it points somewhere real.
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
