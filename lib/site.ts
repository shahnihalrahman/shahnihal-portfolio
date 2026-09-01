/**
 * Single source of truth for identity, contact details and outbound links.
 *
 * TRUTH RULE FOR THIS FILE
 * Every value below is either supplied by Shahnihal or derived from a real
 * artefact. Optional links default to an empty string and the UI hides the
 * corresponding button, so the site never renders a fabricated URL.
 */

export const site = {
  name: 'Shahnihal Rahman',
  firstName: 'Shahnihal',
  role: 'Applied AI & Digital Product Builder',
  headline: 'I Build Digital Products With AI, Code & Product Thinking.',
  subheadline:
    "I'm Shahnihal Rahman — an applied digital product builder working across web applications, AI-assisted development, UX, automation, analytics, and digital growth.",
  positioning:
    'I turn ideas into working digital products using AI-assisted development, modern web technologies, product thinking, and automation.',
  capabilities: [
    'Web Applications',
    'Applied AI',
    'Digital Products',
    'UX',
    'Automation',
    'AI-Assisted Development',
  ],
  location: 'India · Open to UAE / Gulf Opportunities',
  locationShort: 'India',
  email: 'rahman@shahnihal.com',
  phone: '+91 8910404283',
  phoneHref: '+918910404283',

  /**
   * Set these once and the buttons appear automatically.
   * Leave them empty and they stay hidden — no placeholder profiles.
   */
  social: {
    /** Supplied by Shahnihal. LinkedIn answers 999 to automated requests, so it
     *  is unverifiable by script — confirmed by its owner instead. */
    linkedin: 'https://www.linkedin.com/in/shahnihalrahman',
    /** Verified reachable (HTTP 200) at build time. */
    github: 'https://github.com/shahnihalrahman',
  },

  /**
   * Set NEXT_PUBLIC_SITE_URL at deploy time (e.g. on Vercel) so canonical URLs,
   * Open Graph tags, robots.txt and the sitemap all resolve to the live domain.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const;

export const seo = {
  title: 'Shahnihal Rahman — Applied AI & Digital Product Builder',
  description:
    'Portfolio of Shahnihal Rahman — an applied AI and digital product builder working across web applications, AI-assisted development, UX, automation, and digital products.',
  keywords: [
    'Shahnihal Rahman',
    'Applied AI',
    'Digital Product Builder',
    'AI-assisted development',
    'Web Applications',
    'Next.js',
    'Product Thinking',
    'UX',
    'Automation',
    'India',
    'UAE',
  ],
} as const;

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'Build', href: '#build' },
  { label: 'Experience', href: '#experience' },
  { label: 'Stack', href: '#stack' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const microcopy = {
  build: 'Build fast. Think deeply. Iterate relentlessly.',
  idea: 'From idea to interface.',
  prompt: 'From prompt to product.',
  purpose: 'Technology with a purpose.',
} as const;

/** Hero capability nodes. */
export const capabilityNodes = ['Build', 'Design', 'Automate', 'Deploy', 'Optimize'] as const;

export type SystemChip = {
  label: string;
  hint: string;
  /**
   * Optional longer explanation. On phones this renders above the chip row when
   * the part is selected, so a selection can carry a full sentence rather than
   * just a fragment.
   *
   * Left unset on purpose. This file's truth rule is that copy is supplied, not
   * generated, and writing claims about how Shahnihal works would break it. Add
   * a real sentence to any entry below and the mobile system renders it with no
   * further changes.
   */
  detail?: string;
};

/** Floating system elements around the hero core. */
export const systemChips: readonly SystemChip[] = [
  { label: 'API', hint: 'Route handlers & callable endpoints' },
  { label: 'AI', hint: 'Assisted build, debug & docs' },
  { label: 'Database', hint: 'Firestore & Postgres' },
  { label: 'UI', hint: 'Design system & components' },
  { label: 'Automation', hint: 'Triggers & scheduled jobs' },
  { label: 'Analytics', hint: 'GA4, Search Console, product data' },
  { label: 'Deployment', hint: 'Vercel & Firebase App Hosting' },
];
