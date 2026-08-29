/**
 * PROJECT DATA — SOURCED, NOT INVENTED
 *
 * Daktarji and Truepost India: every technology, module and integration listed
 * below was read out of the actual project repositories (package manifests,
 * route trees, cloud function sources, SQL migrations, deployment config).
 * `stackSource: 'repository'` marks those cards.
 *
 * E-commerce web application: the repository was not available in this
 * environment, so nothing is claimed as built. Its stack is labelled as
 * planned and every system is explicitly marked Planned.
 *
 * Applied AI Products: the AI GEO platform and the influencer-marketing agent
 * are real products, but neither repository was available in this environment.
 * Their capabilities are recorded as described by their builder, and their
 * stacks carry `stackSource: 'declared'`, which renders a badge saying exactly
 * that. Nothing about their technology is guessed to fill a gap.
 *
 * AI-assisted building — the models and editors used to build everything else —
 * is a practice rather than a product, and is listed as such.
 *
 * Links are intentionally sparse. A button only renders when a real,
 * verifiable URL exists.
 *
 * Previews follow the same rule. Daktarji and Truepost India carry `proof`:
 * real screens captured from their real builds, used unretouched. Entries with
 * no shipped interface to show keep a blueprint `preview` instead, so a
 * wireframe can never be mistaken for a product that exists.
 */

export type StatusTone = 'live' | 'building' | 'iterating' | 'experimenting' | 'planned';

export type ProjectStatus = {
  label: string;
  tone: StatusTone;
};

export type SystemState = 'built' | 'planned';

export type SystemItem = {
  label: string;
  state: SystemState;
};

export type ModuleGroup = {
  scope: string;
  note?: string;
  items: string[];
};

export type TechGroup = {
  label: string;
  items: string[];
};

export type FlowNode = {
  label: string;
  state?: SystemState;
  /**
   * Optional qualifier rendered under the node by `FlowChain`. Used to mark the
   * stages of an agentic workflow that still pass through a human, so a flow
   * diagram can never imply more autonomy than is actually implemented.
   */
  note?: string;
};

export type ProjectLink = {
  label: 'Live Demo' | 'GitHub' | 'Case Study' | 'Live Site';
  href: string;
};

/**
 * Blueprint previews are structural wireframes drawn in markup. They now exist
 * only for the two entries that have no shipped interface to show. Daktarji and
 * Truepost India use real captures instead — see `ProductProof`.
 */
export type PreviewKind = 'commerce' | 'agents' | 'geo' | 'influencer';

/**
 * A real screen captured from a real build.
 *
 * `width` and `height` are the true intrinsic pixel dimensions of the file, so
 * next/image can reserve layout space and generate responsive sources without
 * guessing. Nothing here is upscaled, redrawn or recomposed: the only edits
 * applied to the source captures were trimming the browser chrome and the
 * scrollbar column, so what remains is the product's own viewport.
 */
export type ProjectShot = {
  /** Path under /public. */
  src: string;
  /** Gallery label. Must describe the screen that was actually captured. */
  label: string;
  /** Alt text. Describes what is on screen, not the file. */
  alt: string;
  width: number;
  height: number;
  /** Caption rendered beneath the frame. */
  caption: string;
  /** The journey stage this screen evidences, when it maps to one. */
  stage?: string;
};

export type ProductProof = {
  /** What the frame's address bar shows. Never a fabricated domain. */
  urlLabel: string;
  /** Provenance note kept beneath the frame. */
  note: string;
  shots: ProjectShot[];
};

export type Project = {
  id: string;
  index: string;
  name: string;
  category: string;
  tagline: string;
  /** The problem the product exists to solve, stated in one sentence. */
  problem: string;
  status: ProjectStatus;
  summary: string;
  body: string[];
  role: string[];
  areas: SystemItem[];
  moduleGroups?: ModuleGroup[];
  journey?: { title: string; nodes: FlowNode[] };
  architecture: { title: string; nodes: FlowNode[] };
  tech: TechGroup[];
  /**
   * Where the technology list came from.
   *   repository — read out of the actual codebase.
   *   planned    — intended stack, nothing claimed as shipped.
   *   practice   — tools and methods rather than a product stack.
   *   declared   — stated by the builder, not yet verified against a repository.
   *                Used where a product exists but its code is not available in
   *                this environment, so the list is honest about its own source.
   */
  stackSource: 'repository' | 'planned' | 'practice' | 'declared';
  stackNote: string;
  aiLayer: string[];
  facts: { value: string; label: string }[];
  links: ProjectLink[];
  linksNote?: string;
  /** Blueprint fallback. Only for products with no real interface to show yet. */
  preview?: PreviewKind;
  /** Real captured interfaces. Takes precedence over `preview` wherever present. */
  proof?: ProductProof;
  accent: 'cyan' | 'blue' | 'violet';
};

export const projects: Project[] = [
  /* ─────────────────────────────  PROJECT 01  ───────────────────────────── */
  {
    id: 'daktarji',
    index: '01',
    name: 'Daktarji',
    category: 'Healthcare Discovery · Digital Product · Web Application',
    tagline: 'Find the right doctor. See a real appointment time. Skip the phone call.',
    problem:
      'Finding care usually means calling around, guessing who is available, and trusting an unverified listing. Patients cannot see a real appointment time before they commit.',
    status: { label: 'Live · Product in Active Development', tone: 'live' },
    summary:
      'Daktarji is a healthcare discovery and appointment platform designed around how patients actually discover doctors, clinics and healthcare services.',
    body: [
      'Daktarji is a healthcare discovery and appointment platform designed around how patients actually discover doctors, clinics and healthcare services. Instead of starting from a hospital directory, it starts from the question a patient actually has — what do I need, who near me can help, and when can I be seen.',
      'The product is built as a multi-role platform. Patients discover and book. Doctors manage schedules and appointments. Clinics manage their doctors and staff. Receptionists run the live queue and walk-ins. Partner coordinators onboard clinics. A platform admin layer handles verification and oversight.',
      'Booking is the hard part, so it is handled server-side: slots are generated ahead of time, held transactionally while a patient completes payment, and released automatically if the hold goes stale. That logic lives in cloud functions rather than in the browser.',
    ],
    role: [
      'Product Concept',
      'UX & Information Architecture',
      'Web Application Development',
      'AI-Assisted Development',
    ],
    areas: [
      { label: 'Doctor discovery', state: 'built' },
      { label: 'Clinic discovery', state: 'built' },
      { label: 'Department & specialty discovery', state: 'built' },
      { label: 'Doctor profiles', state: 'built' },
      { label: 'Clinic profiles', state: 'built' },
      { label: 'Appointment workflows', state: 'built' },
      { label: 'Search & location-based discovery', state: 'built' },
      { label: 'Patient journeys', state: 'built' },
      { label: 'Structured healthcare information', state: 'built' },
      { label: 'Family profiles', state: 'built' },
      { label: 'Live queue & walk-in handling', state: 'built' },
      { label: 'Clinic verification & admin oversight', state: 'built' },
    ],
    moduleGroups: [
      {
        scope: 'Patient',
        items: [
          'Search & specialty browse',
          'Doctor and clinic profiles',
          'Slot selection & booking',
          'Appointments & cancellation',
          'Family member profiles',
          'Reviews',
        ],
      },
      {
        scope: 'Doctor',
        items: ['Dashboard', 'Schedule management', 'Appointment list'],
      },
      {
        scope: 'Clinic',
        items: ['Clinic dashboard', 'Doctor roster', 'Staff management', 'Clinic settings'],
      },
      {
        scope: 'Reception',
        items: ['Live queue & tokens', 'Walk-in registration', 'Schedule board', 'Check-in'],
      },
      {
        scope: 'Partner coordinator',
        note: 'Field onboarding layer',
        items: ['Clinic onboarding', 'Assigned clinics', 'Referrals', 'Commission view'],
      },
      {
        scope: 'Platform admin',
        items: [
          'Clinic & doctor records',
          'Clinic admin accounts',
          'Coordinator accounts',
          'Verification queue',
          'Platform analytics',
        ],
      },
    ],
    journey: {
      title: 'Patient journey',
      nodes: [
        { label: 'Discover' },
        { label: 'Explore' },
        { label: 'Compare' },
        { label: 'Select' },
        { label: 'Book' },
      ],
    },
    architecture: {
      title: 'How a booking actually happens',
      nodes: [
        { label: 'Patient UI' },
        { label: 'Auth & session' },
        { label: 'Firestore + rules' },
        { label: 'Booking function' },
        { label: 'Payment order' },
        { label: 'Confirmation & reminders' },
      ],
    },
    tech: [
      {
        label: 'Application',
        items: [
          'Next.js (App Router)',
          'React',
          'TypeScript',
          'Tailwind CSS',
          'shadcn/ui',
          'Radix UI',
        ],
      },
      {
        label: 'State & forms',
        items: ['TanStack Query', 'Zustand', 'React Hook Form', 'Zod'],
      },
      {
        label: 'Backend & data',
        items: [
          'Firebase Auth',
          'Cloud Firestore',
          'Firestore security rules',
          'Firebase Storage',
          'Cloud Functions (Node 20)',
        ],
      },
      {
        label: 'Integrations',
        items: [
          'Razorpay payments + webhook',
          'WhatsApp webhook',
          'Web push (FCM service worker)',
          'Geo search (geofire)',
        ],
      },
      {
        label: 'Engineering',
        items: [
          'Turborepo monorepo',
          'Vitest (rules tests on emulators)',
          'ESLint',
          'Prettier',
          'Husky',
          'Conventional commits',
        ],
      },
      {
        label: 'Deployment',
        items: ['Firebase App Hosting', 'Firebase emulator suite', 'Git'],
      },
    ],
    stackSource: 'repository',
    stackNote: 'Stack read directly from the project repository, not from memory.',
    aiLayer: [
      'Claude',
      'ChatGPT',
      'AI-assisted implementation',
      'AI-assisted debugging',
      'AI-assisted documentation',
    ],
    facts: [
      { value: '6', label: 'User roles in one platform' },
      { value: '20+', label: 'Cloud functions: callables, triggers, jobs' },
      { value: '3', label: 'Scheduled jobs keeping slots honest' },
    ],
    links: [{ label: 'Live Site', href: 'https://daktarji.com' }],
    linksNote:
      'Daktarji is publicly accessible at daktarji.com. It remains an actively evolving product: modules are still being extended and refined.',
    proof: {
      urlLabel: 'daktarji.com',
      note: 'Captured from the live site at daktarji.com, under its own Daktarji branding. Used unretouched: the only edit was trimming the browser chrome and the scrollbar column.',
      shots: [
        {
          src: '/work/daktarji-home-find-care.png',
          label: 'Find care',
          alt: 'Daktarji home page — the headline "Find care. Pick a time. Done." over the line "Find trusted doctors and hospitals near you. Book an appointment in just a few taps." A Book Appointment button sits beside a Search by doctor name option, with the note "No account needed to look around." The header carries Find care, Find a doctor and How it works alongside a Kolkata location and Sign in. Below, a Browse by Department row lists General Physician, Pediatrics, Gynecology and Dermatology, each with the conditions it covers.',
          width: 1901,
          height: 869,
          caption:
            'The entry point — a patient states what they need and books a real time, before any doctor list appears.',
          stage: 'Discover',
        },
      ],
    },
    accent: 'cyan',
  },

  /* ─────────────────────────────  PROJECT 02  ───────────────────────────── */
  {
    id: 'truepost',
    index: '02',
    name: 'Truepost India',
    category: 'Custom Web Application · Digital Product · Media Platform',
    tagline: 'A media platform rebuilt from a CMS install into a product I own end to end.',
    problem:
      'An off-the-shelf CMS publishes fine but caps everything else: content modelling, editorial roles, reader accounts and performance all hit a ceiling you cannot move.',
    status: { label: 'Custom Build · Active Development', tone: 'iterating' },
    summary:
      'I evolved Truepost India from its earlier CMS-based platform into a custom-coded web application, taking responsibility across product structure, user experience, development, deployment and continuous iteration.',
    body: [
      'Truepost India started on an off-the-shelf CMS. That was fine for publishing and limiting for everything else — content modelling, editorial roles, reader accounts, performance and anything resembling product logic.',
      'The current Truepost is a custom-coded web application: its own content model, its own admin surface, its own reader-side experience. Editors work in an admin built for how this newsroom actually publishes, with drafts and pending states, media, navigation menus, categories and SEO fields as first-class concerns.',
      'On the reader side it handles multiple content formats — articles, videos, podcasts, documentaries and standalone pages — with authors, categories, search, bookmarks and a newsletter. Access control is enforced in the database with row-level security and a role model, not just hidden in the UI.',
    ],
    role: [
      'Product',
      'UX & Information Architecture',
      'Web Application Development',
      'Platform Management',
    ],
    areas: [
      { label: 'Product evolution: CMS → custom application', state: 'built' },
      { label: 'Content experience across five formats', state: 'built' },
      { label: 'Dynamic navigation & menus', state: 'built' },
      { label: 'Reader accounts & interaction', state: 'built' },
      { label: 'Custom admin & editorial workflow', state: 'built' },
      { label: 'Role-based access control', state: 'built' },
      { label: 'Responsive UI', state: 'built' },
      { label: 'Analytics & audience reporting', state: 'built' },
      { label: 'SEO: sitemap, metadata, category SEO', state: 'built' },
      { label: 'Performance monitoring', state: 'built' },
      { label: 'Continuous deployment', state: 'built' },
    ],
    moduleGroups: [
      {
        scope: 'Reader',
        items: [
          'Articles, videos, podcasts, documentaries',
          'Category & author pages',
          'Search',
          'Bookmarks & profile',
          'Newsletter signup',
          'Rewards, wallet & leaderboard',
        ],
      },
      {
        scope: 'Editorial admin',
        items: [
          'Content authoring with pending states',
          'Categories & SEO fields',
          'Standalone pages module',
          'Media library',
          'Navigation menu builder',
        ],
      },
      {
        scope: 'Platform admin',
        items: [
          'Role-based access control',
          'Team invites with tokens',
          'Newsletter campaigns & subscribers',
          'Audience & analytics views',
          'Activity log',
          'Platform settings',
        ],
      },
    ],
    journey: {
      title: 'Product evolution',
      nodes: [
        { label: 'Earlier CMS platform' },
        { label: 'Product rethink' },
        { label: 'Custom content model' },
        { label: 'Custom web application' },
        { label: 'Continuous iteration' },
      ],
    },
    architecture: {
      title: 'Platform shape',
      nodes: [
        { label: 'Reader UI' },
        { label: 'Route handlers' },
        { label: 'Postgres + RLS' },
        { label: 'Custom admin' },
        { label: 'Analytics & SEO' },
        { label: 'Vercel' },
      ],
    },
    tech: [
      {
        label: 'Application',
        items: ['Next.js (App Router)', 'React', 'TypeScript', 'Tailwind CSS'],
      },
      {
        label: 'Interface & motion',
        items: ['Framer Motion', 'Lenis smooth scroll', 'three.js', 'React Three Fiber'],
      },
      {
        label: 'Backend & data',
        items: [
          'Supabase',
          'PostgreSQL',
          'Row Level Security',
          'Supabase Auth (SSR sessions)',
          'Supabase Storage',
          'SQL migrations',
        ],
      },
      {
        label: 'Integrations',
        items: ['YouTube Data API', 'Google Tag Manager', 'Newsletter delivery'],
      },
      {
        label: 'Analytics & growth',
        items: [
          'Google Analytics 4',
          'Search Console',
          'Vercel Analytics',
          'Vercel Speed Insights',
          'SEO: sitemap & robots',
        ],
      },
      {
        label: 'Deployment',
        items: ['Vercel', 'Git', 'GitHub'],
      },
    ],
    stackSource: 'repository',
    stackNote: 'Stack read directly from the project repository, not from memory.',
    aiLayer: ['Claude', 'ChatGPT', 'AI-assisted implementation', 'AI-assisted debugging'],
    facts: [
      { value: '5', label: 'Content formats on one platform' },
      { value: '24', label: 'Versioned database migrations' },
      { value: '12+', label: 'Admin modules built for editors' },
    ],
    links: [{ label: 'Live Site', href: 'https://truepostin.com' }],
    linksNote:
      'The platform is live at truepostin.com. The application code stays in a private repository, so the build itself is represented here by captures rather than a repo link.',
    proof: {
      urlLabel: 'Truepost India · custom build',
      note: 'Captured from the custom application now serving readers, not the legacy CMS it replaced.',
      shots: [
        {
          src: '/work/truepost-home.png',
          label: 'Reader home',
          alt: 'Truepost India custom web application interface — reader homepage with Sections, Watch and Listen, Stories, Documentaries, Videos and About navigation, the "Discover the Reality Behind India" editorial hero, and live audience panels for monthly organic viewership, Indian audience share, engagement rate and total stories.',
          width: 1893,
          height: 916,
          caption: 'Reader home — the custom application that replaced the CMS front end.',
          stage: 'Custom web application',
        },
      ],
    },
    accent: 'blue',
  },

  /* ─────────────────────────────  PROJECT 03  ───────────────────────────── */
  {
    id: 'commerce',
    index: '03',
    name: 'E-Commerce Web Application',
    category: 'Digital Commerce · Web Application',
    tagline: 'A commerce product being built from the buying journey backwards.',
    problem:
      'Hosted commerce platforms make storefronts easy and leave the deciding parts rigid: how products are found, how variants and stock are represented, and how an order behaves once money is involved.',
    status: { label: 'In Development', tone: 'building' },
    summary:
      'A custom commerce application currently in development. Scope and architecture are defined; the build is in progress, so everything below is marked honestly as built or planned.',
    body: [
      'This one is in development, and the card says so. After several years working inside hosted commerce platforms, the interesting problem is no longer the storefront — it is everything that decides whether a purchase completes: how products are found, how variants and stock are represented, how the cart survives a session, and how an order behaves once money is involved.',
      'The scope is being defined journey-first: discovery and search, product detail, cart, checkout, account, order lifecycle, and the operational surface a store actually needs behind the scenes.',
      'No metrics, no launch date and no invented architecture will appear here. When the implementation lands, this card gets updated from the repository the same way the two above it were.',
    ],
    role: ['Product Definition', 'UX Flows', 'Application Development', 'AI-Assisted Development'],
    areas: [
      { label: 'Product discovery', state: 'planned' },
      { label: 'Search', state: 'planned' },
      { label: 'Filters & facets', state: 'planned' },
      { label: 'Product detail page', state: 'planned' },
      { label: 'Cart', state: 'planned' },
      { label: 'Checkout', state: 'planned' },
      { label: 'User account', state: 'planned' },
      { label: 'Order flow & lifecycle', state: 'planned' },
      { label: 'Admin & operational tooling', state: 'planned' },
    ],
    architecture: {
      title: 'Intended architecture',
      nodes: [
        { label: 'User interface', state: 'planned' },
        { label: 'API', state: 'planned' },
        { label: 'Database', state: 'planned' },
        { label: 'Payments', state: 'planned' },
        { label: 'Orders', state: 'planned' },
      ],
    },
    tech: [
      {
        label: 'Planned application layer',
        items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      },
      {
        label: 'Planned data & APIs',
        items: ['REST APIs', 'JSON', 'Hosted database', 'Authentication'],
      },
      {
        label: 'Planned operations',
        items: ['Payments provider', 'Analytics', 'Vercel', 'Git'],
      },
    ],
    stackSource: 'planned',
    stackNote:
      'Planned stack. Nothing here is presented as shipped — this section will be regenerated from the repository once the build is further along.',
    aiLayer: ['Claude', 'ChatGPT', 'AI-assisted implementation'],
    facts: [
      { value: 'In Dev', label: 'Current status, stated plainly' },
      { value: '0', label: 'Metrics claimed before launch' },
    ],
    links: [],
    linksNote: 'Links will appear here when there is something real to link to.',
    preview: 'commerce',
    accent: 'violet',
  },

  /* ─────────────────────────────  PROJECT 04  ───────────────────────────── */
  {
    id: 'applied-ai',
    index: '04',
    name: 'Applied AI Products',
    category: 'Applied AI · Agentic Systems · Workflow Automation',
    tagline: 'Practical AI products built around real business problems.',
    problem:
      'AI tooling is easy to talk about and easy to misuse. The useful question is which parts of real work it can actually take over, and which parts must stay a human decision.',
    status: { label: 'Applied · In Active Development', tone: 'building' },
    summary:
      "Real systems I've built to solve practical problems — an AI search-visibility platform and an agentic influencer-marketing system — alongside the AI-assisted process behind everything else on this page.",
    body: [
      'This is where AI stops being a tab I keep open and starts being something I ship. Two products carry it: an AI GEO platform that examines how brands are represented inside generative search, and an influencer-marketing agent that takes a campaign brief from creator discovery through to a qualified conversation. Both have their own cards below.',
      'The pattern that keeps proving useful is boring and effective — a trigger, an agent with a narrow brief, a small set of tools, real data, and a concrete action at the end. Anything vaguer than that tends not to survive contact with real use.',
      'The third strand is the build process itself: Claude, ChatGPT, Gemini, Cursor and Kiro used as working instruments across implementation, debugging and documentation. The judgement stays human. AI drafts, suggests and accelerates; what ships is a decision I make and own.',
    ],
    role: ['Applied AI', 'Automation Design', 'Workflow Engineering'],
    areas: [
      { label: 'AI agents with a defined job', state: 'built' },
      { label: 'Workflow automation', state: 'built' },
      { label: 'Research automation', state: 'built' },
      { label: 'Content automation', state: 'built' },
      { label: 'Business workflows', state: 'built' },
      { label: 'AI-assisted coding', state: 'built' },
      { label: 'AI-assisted debugging', state: 'built' },
      { label: 'AI-assisted documentation', state: 'built' },
      { label: 'Personal productivity systems', state: 'built' },
    ],
    architecture: {
      title: 'The pattern that works',
      nodes: [
        { label: 'Trigger' },
        { label: 'AI agent' },
        { label: 'Tools' },
        { label: 'Data' },
        { label: 'Action' },
      ],
    },
    tech: [
      {
        label: 'Models & assistants',
        items: ['Claude', 'ChatGPT', 'Gemini'],
      },
      {
        label: 'Build environments',
        items: ['Cursor', 'Kiro'],
      },
      {
        label: 'Applied to',
        items: [
          'Product development',
          'Debugging',
          'Documentation',
          'Research',
          'Content operations',
          'Internal workflows',
        ],
      },
    ],
    stackSource: 'practice',
    stackNote:
      'Models and build environments rather than a product stack. The two products below carry their own technology lists.',
    aiLayer: ['Claude', 'ChatGPT', 'Gemini', 'Cursor', 'Kiro'],
    facts: [
      { value: 'Applied', label: 'Not research, not theory' },
      { value: 'Human', label: 'Final judgement stays mine' },
    ],
    links: [],
    preview: 'agents',
    accent: 'cyan',
  },

  /* ─────────────────────────────  PROJECT 05  ───────────────────────────── */
  {
    id: 'ai-geo',
    index: '05',
    name: 'AI GEO Platform',
    category: 'Generative Engine Optimization · AI Search · SEO',
    tagline: 'SEO asks how a search engine ranks you. GEO asks how an AI describes you.',
    problem:
      'When someone asks ChatGPT or Gemini for a recommendation, the answer is generated rather than ranked. A business has no obvious way to see how it is being characterised in that answer, which competitors are named beside it, or whether it appears at all.',
    status: { label: 'In Development', tone: 'building' },
    summary:
      'A platform designed to help businesses improve how their content and brand are discovered and surfaced by generative AI systems such as ChatGPT and Gemini.',
    body: [
      'Generative Engine Optimization is the AI-search counterpart to SEO. Where SEO is concerned with how a search engine ranks a page, GEO is concerned with how an AI system discovers, evaluates and surfaces information while composing an answer — which sources it leans on, how a brand gets described, and who gets mentioned alongside it. The concept is familiar; the surface being optimised for is not.',
      'The platform works by interrogation rather than guesswork. It runs prompts against AI models, captures how a brand, product or service is currently represented in the responses, and does the same for competitors so the two can be compared directly. From that comparison it identifies where a business is absent, thinly described or mischaracterised.',
      'The output is a set of specific areas worth improving in content and positioning, expressed as actionable recommendations. Because every finding starts from a prompt that can be run again, the same checks can be repeated later to track how visibility inside AI models shifts over time rather than assuming it did.',
    ],
    role: [
      'Product Concept',
      'Product Design',
      'AI-Assisted Development',
      'Web Application Development',
      'Testing',
    ],
    areas: [
      { label: 'Prompt testing against AI models', state: 'built' },
      { label: 'Brand representation analysis', state: 'built' },
      { label: 'Competitor visibility & positioning', state: 'built' },
      { label: 'Competing response comparison', state: 'built' },
      { label: 'AI-search presence gaps', state: 'built' },
      { label: 'Content & positioning suggestions', state: 'built' },
      { label: 'Actionable recommendations', state: 'built' },
      { label: 'Visibility tracking over time', state: 'built' },
    ],
    journey: {
      title: 'Product workflow',
      nodes: [
        { label: 'Prompt Testing' },
        { label: 'AI Response Analysis' },
        { label: 'Competitor Analysis' },
        { label: 'Visibility Gaps' },
        { label: 'Recommendations' },
        { label: 'Optimization' },
        { label: 'Re-test' },
      ],
    },
    architecture: {
      title: 'How a single test runs',
      nodes: [
        { label: 'Prompt' },
        { label: 'AI model' },
        { label: 'Response' },
        { label: 'Competitor set' },
        { label: 'Gap detection' },
        { label: 'Recommendation' },
      ],
    },
    tech: [
      {
        label: 'AI systems tested against',
        items: ['ChatGPT', 'Gemini', 'Other LLMs'],
      },
      {
        label: 'Product surface',
        items: ['Web application'],
      },
      {
        label: 'Build approach',
        items: ['AI-assisted development'],
      },
    ],
    stackSource: 'declared',
    stackNote:
      'Declared rather than read from a repository. The codebase was not available in this environment, so this lists only what the product is known to work with — the models it tests against, and the fact that it is a web application. The framework and data layer get filled in from the repository the same way Daktarji and Truepost were, rather than guessed at now.',
    aiLayer: ['ChatGPT', 'Gemini', 'Other LLMs', 'AI-assisted implementation'],
    facts: [
      { value: 'GEO', label: 'Optimising for generated answers, not blue links' },
      { value: '0', label: 'Guarantees made about AI rankings or citations' },
    ],
    links: [],
    linksNote:
      'Helps identify opportunities to improve visibility and representation across AI-generated search experiences. It does not promise rankings, placement or citations inside AI answers — no tool honestly can. Nothing is linked here yet; a link goes in when there is a public one to give.',
    preview: 'geo',
    accent: 'violet',
  },

  /* ─────────────────────────────  PROJECT 06  ───────────────────────────── */
  {
    id: 'ai-influencer-agent',
    index: '06',
    name: 'AI Influencer Marketing Agent',
    category: 'Agentic AI · Marketing Automation · Workflow Automation',
    tagline: 'A campaign brief goes in. A qualified creator conversation comes out.',
    problem:
      'Influencer marketing runs on manual searching, spreadsheet shortlists and copy-pasted outreach. The matching is subjective, the work is repetitive, and most of the follow-up never happens.',
    status: { label: 'In Development', tone: 'building' },
    summary:
      'An agentic AI system designed to automate the influencer-marketing workflow from identifying suitable creators to outreach and communication.',
    body: [
      'This is an agent rather than a chatbot. It is handed a business and a campaign brief and works a sequence from there: find candidate creators, analyse them against what the campaign actually asks for, score the fit, and shortlist the strongest matches. Each stage feeds the next instead of waiting for a prompt.',
      'Outreach is the part that usually decays into a template. Here the message is generated against the specific creator and the specific campaign, the conversation is opened, and follow-ups are handled rather than forgotten — carrying a thread far enough to establish whether there is genuine interest before it reaches me.',
      'It is deliberately not described as fully autonomous. The stages that commit something on my behalf — sending outreach, and continuing a live conversation — are marked human-in-the-loop in the workflow, because that is how the system is actually operated today.',
    ],
    role: [
      'Product Concept',
      'Agentic Workflow Design',
      'AI-Assisted Development',
      'Automation',
      'Web Application',
    ],
    areas: [
      { label: 'Campaign brief understanding', state: 'built' },
      { label: 'Creator discovery', state: 'built' },
      { label: 'Creator analysis against brief', state: 'built' },
      { label: 'Relevance & fit assessment', state: 'built' },
      { label: 'Best-match shortlisting', state: 'built' },
      { label: 'Personalised outreach generation', state: 'built' },
      { label: 'Conversation initiation', state: 'built' },
      { label: 'Follow-up handling', state: 'built' },
      { label: 'Qualification hand-off', state: 'built' },
    ],
    journey: {
      title: 'Core workflow',
      nodes: [
        { label: 'Campaign Brief' },
        { label: 'Creator Discovery' },
        { label: 'Creator Analysis' },
        { label: 'Best-Match Scoring' },
        { label: 'Personalised Outreach' },
        { label: 'Conversation' },
        { label: 'Follow-up' },
        { label: 'Qualified Influencer' },
      ],
    },
    architecture: {
      title: 'The agent loop',
      nodes: [
        { label: 'Business / brief' },
        { label: 'Agent' },
        { label: 'Creator data' },
        { label: 'Fit scoring' },
        { label: 'Outreach', note: 'Human-in-the-loop' },
        { label: 'Conversation', note: 'Human-in-the-loop' },
        { label: 'Qualified influencer' },
      ],
    },
    tech: [
      {
        label: 'Agent layer',
        items: ['Agentic workflow', 'Campaign-brief reasoning', 'Fit scoring'],
      },
      {
        label: 'Product surface',
        items: ['Web application'],
      },
      {
        label: 'Build approach',
        items: ['AI-assisted development', 'Workflow automation'],
      },
    ],
    stackSource: 'declared',
    stackNote:
      'Declared rather than read from a repository. The codebase was not available in this environment, so the list stays at the level that is actually known — the agent stages, and that it is operated through a web application. Models, data sources and platform integrations are left off until they can be confirmed from the repository.',
    aiLayer: [
      'Agentic workflow',
      'Creator analysis',
      'Outreach generation',
      'AI-assisted implementation',
    ],
    facts: [
      { value: 'Agentic', label: 'A working sequence, not a chat window' },
      { value: 'Human', label: 'Outreach and live conversation stay supervised' },
    ],
    links: [],
    linksNote:
      'An internal system rather than a public product, so there is nothing to link yet. The scope above describes what runs today, and the stages that still pass through me are marked human-in-the-loop rather than presented as autonomous.',
    preview: 'influencer',
    accent: 'blue',
  },
];

/* ───────────────────────────  CURRENTLY BUILDING  ─────────────────────────
 * Manually configured on purpose. No fake telemetry, no invented "live" feed.
 * Update `state` when reality changes.
 * ─────────────────────────────────────────────────────────────────────────── */

export type NowItem = {
  name: string;
  context: string;
  state: 'Building' | 'Iterating';
  projectId?: string;
};

export const currentlyBuilding: NowItem[] = [
  { name: 'Daktarji', context: 'Healthcare Product', state: 'Building', projectId: 'daktarji' },
  {
    name: 'E-commerce Web Application',
    context: 'Digital Commerce',
    state: 'Building',
    projectId: 'commerce',
  },
  { name: 'AI GEO Platform', context: 'AI Search', state: 'Building', projectId: 'ai-geo' },
  {
    name: 'AI Influencer Marketing Agent',
    context: 'Agentic AI',
    state: 'Building',
    projectId: 'ai-influencer-agent',
  },
  { name: 'Truepost India', context: 'Media Platform', state: 'Iterating', projectId: 'truepost' },
];
