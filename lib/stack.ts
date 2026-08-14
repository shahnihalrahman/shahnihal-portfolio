/**
 * TECHNOLOGY CONSTELLATION
 *
 * No percentage bars. Nobody's React is 95%.
 *
 * Instead every node carries an honest evidence level:
 *   'repo'      — appears in a project repository inspected for this portfolio
 *   'shipped'   — used in delivered client / platform work
 *   'exploring' — actively learning or trialling, not claimed as depth
 */

export type Evidence = 'repo' | 'shipped' | 'exploring';

export type TechNode = {
  name: string;
  evidence: Evidence;
  /** Short, factual note surfaced on hover / focus. */
  note?: string;
  /**
   * Technologies this one actually connects to in my work — what calls what,
   * what deploys what, what measures what. Drives the highlighted relationships
   * in the constellation, so hovering a node shows a real dependency rather
   * than decorative lines.
   */
  links?: string[];
};

export type TechCluster = {
  id: string;
  label: string;
  blurb: string;
  accent: 'cyan' | 'blue' | 'violet';
  nodes: TechNode[];
};

export const evidenceMeta: Record<Evidence, { label: string; description: string }> = {
  repo: {
    label: 'In a project repo',
    description: 'Present in a codebase inspected while building this portfolio.',
  },
  shipped: {
    label: 'Used in delivered work',
    description: 'Used on live platforms, stores or campaigns I have run.',
  },
  exploring: {
    label: 'Exploring',
    description: 'Actively learning or trialling. Listed without claiming depth.',
  },
};

export const clusters: TechCluster[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    blurb: 'Where the product becomes something a person can actually use.',
    accent: 'cyan',
    nodes: [
      { name: 'React', evidence: 'repo', note: 'Core of both web applications', links: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
      { name: 'Next.js', evidence: 'repo', note: 'App Router in both projects', links: ['React', 'REST APIs', 'Vercel', 'Firebase App Hosting', 'TypeScript'] },
      { name: 'TypeScript', evidence: 'repo', links: ['React', 'Next.js', 'Zod', 'Cloud Functions'] },
      { name: 'JavaScript', evidence: 'shipped', links: ['React', 'HTML5', 'CSS3', 'WordPress', 'Shopify'] },
      { name: 'HTML5', evidence: 'shipped', links: ['CSS3', 'JavaScript'] },
      { name: 'CSS3', evidence: 'shipped', links: ['Tailwind CSS', 'Responsive Design', 'HTML5'] },
      { name: 'Tailwind CSS', evidence: 'repo', links: ['React', 'CSS3', 'Responsive Design'] },
      { name: 'Responsive Design', evidence: 'shipped', links: ['CSS3', 'Tailwind CSS', 'CRO'] },
      { name: 'Framer Motion', evidence: 'repo', links: ['React', 'three.js'] },
      { name: 'three.js', evidence: 'repo', links: ['React', 'Framer Motion'] },
    ],
  },
  {
    id: 'platforms',
    label: 'Web Platforms',
    blurb: 'Years of shipping on hosted platforms before building custom.',
    accent: 'blue',
    nodes: [
      { name: 'WordPress', evidence: 'shipped', note: 'Earlier Truepost platform', links: ['SEO', 'Google Analytics 4', 'JavaScript'] },
      { name: 'Shopify', evidence: 'shipped', note: 'E-commerce work at QUL', links: ['CRO', 'Meta Pixel', 'Google Analytics 4', 'SEO'] },
    ],
  },
  {
    id: 'data',
    label: 'APIs / Data',
    blurb: 'The layer that decides whether a product can be trusted.',
    accent: 'violet',
    nodes: [
      { name: 'REST APIs', evidence: 'repo', links: ['JSON', 'Next.js', 'Cloud Functions', 'Zod'] },
      { name: 'JSON', evidence: 'repo', links: ['REST APIs', 'Cloud Firestore'] },
      { name: 'Firebase', evidence: 'repo', note: 'Auth, Firestore, Storage', links: ['Cloud Firestore', 'Cloud Functions', 'Firebase App Hosting', 'Google Cloud'] },
      { name: 'Cloud Firestore', evidence: 'repo', links: ['Firebase', 'Cloud Functions', 'JSON'] },
      { name: 'Supabase', evidence: 'repo', links: ['PostgreSQL', 'Row Level Security', 'Next.js'] },
      { name: 'PostgreSQL', evidence: 'repo', note: '24 versioned migrations', links: ['Supabase', 'Row Level Security'] },
      { name: 'Row Level Security', evidence: 'repo', links: ['PostgreSQL', 'Supabase'] },
      { name: 'Zod', evidence: 'repo', note: 'Schema validation', links: ['TypeScript', 'REST APIs'] },
      { name: 'TanStack Query', evidence: 'repo', links: ['React', 'REST APIs'] },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud / Deployment',
    blurb: 'Shipping is part of building, not a separate job.',
    accent: 'cyan',
    nodes: [
      { name: 'Vercel', evidence: 'repo', links: ['Next.js', 'Git', 'Vercel Speed Insights'] },
      { name: 'Firebase App Hosting', evidence: 'repo', links: ['Firebase', 'Next.js', 'Google Cloud'] },
      { name: 'Cloud Functions', evidence: 'repo', note: 'Node 20 runtime', links: ['Firebase', 'Cloud Firestore', 'REST APIs', 'Workflow automation'] },
      { name: 'Google Cloud', evidence: 'shipped', links: ['Firebase', 'Firebase App Hosting'] },
      { name: 'Git', evidence: 'repo', links: ['GitHub', 'Vercel', 'Turborepo'] },
      { name: 'GitHub', evidence: 'shipped', links: ['Git'] },
      { name: 'Turborepo', evidence: 'repo', links: ['Git', 'TypeScript'] },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    blurb: 'Used as a build layer, with the decisions staying mine.',
    accent: 'violet',
    nodes: [
      { name: 'Claude', evidence: 'shipped', note: 'Primary build assistant', links: ['Cursor', 'Kiro', 'TypeScript', 'React'] },
      { name: 'ChatGPT', evidence: 'shipped', links: ['Claude', 'Workflow automation'] },
      { name: 'Gemini', evidence: 'shipped', links: ['Claude', 'AI agents'] },
      { name: 'Cursor', evidence: 'shipped', links: ['Claude', 'TypeScript'] },
      { name: 'Kiro', evidence: 'shipped', note: 'Used to build this portfolio', links: ['Claude', 'Next.js', 'TypeScript'] },
      { name: 'AI agents', evidence: 'exploring', links: ['Workflow automation', 'Cloud Functions', 'Gemini'] },
      { name: 'Workflow automation', evidence: 'shipped', links: ['AI agents', 'Cloud Functions', 'ChatGPT'] },
    ],
  },
  {
    id: 'growth',
    label: 'Analytics / Growth',
    blurb: 'A product that nobody finds or completes is not finished.',
    accent: 'blue',
    nodes: [
      { name: 'Google Analytics 4', evidence: 'repo', links: ['Search Console', 'SEO', 'CRO', 'Next.js'] },
      { name: 'Search Console', evidence: 'shipped', links: ['SEO', 'Google Analytics 4'] },
      { name: 'Meta Pixel', evidence: 'shipped', links: ['Meta Ads', 'CRO', 'Shopify'] },
      { name: 'SEO', evidence: 'shipped', links: ['Search Console', 'Google Analytics 4', 'Next.js', 'WordPress'] },
      { name: 'CRO', evidence: 'shipped', links: ['Google Analytics 4', 'Meta Pixel', 'Responsive Design', 'Shopify'] },
      { name: 'Meta Ads', evidence: 'shipped', links: ['Meta Pixel', 'CRO'] },
      { name: 'Google Ads', evidence: 'shipped', links: ['Google Analytics 4', 'CRO'] },
      { name: 'Vercel Speed Insights', evidence: 'repo', links: ['Vercel', 'Next.js'] },
    ],
  },
];
