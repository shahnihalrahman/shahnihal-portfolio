/**
 * Narrative content: pipeline, AI workflow, product thinking, collaboration,
 * experience, achievements, education.
 *
 * Achievements are limited to figures Shahnihal supplied. Nothing is rounded up,
 * extrapolated or invented.
 */

/* ─────────────────────────────  PIPELINE  ───────────────────────────── */

export type PipelineStep = {
  id: string;
  title: string;
  line: string;
  detail: string;
};

export const pipeline: PipelineStep[] = [
  {
    id: 'problem',
    title: 'Problem',
    line: "Understand the user's and business's actual need.",
    detail: 'Before features, the question: what breaks today, and for whom?',
  },
  {
    id: 'product-thinking',
    title: 'Product Thinking',
    line: 'Define features, workflows, priorities and user journeys.',
    detail: 'Scope becomes a sequence. What ships first, and what can wait.',
  },
  {
    id: 'ux',
    title: 'UX / Interface',
    line: 'Structure interfaces, flows, information architecture and interactions.',
    detail: 'Hierarchy, states, empty cases, error cases. The unglamorous half.',
  },
  {
    id: 'ai-build',
    title: 'AI-Assisted Build',
    line: 'Use Claude, ChatGPT and other AI development tools to accelerate implementation and iteration.',
    detail: 'AI compresses the typing. The architecture stays a human decision.',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    line: 'Connect APIs, databases, analytics, authentication and third-party services.',
    detail: 'Payments, auth, notifications, data. Where products usually leak.',
  },
  {
    id: 'deploy',
    title: 'Deploy',
    line: 'Use modern deployment infrastructure such as Vercel and cloud services.',
    detail: 'Shipped is a state, not an event. Environments, config, rollbacks.',
  },
  {
    id: 'test',
    title: 'Test',
    line: 'Debug, validate responsiveness, identify issues and iterate.',
    detail: 'Real devices, real edge cases, real failure paths.',
  },
  {
    id: 'improve',
    title: 'Improve',
    line: 'Use feedback, analytics and real user behaviour to improve the product.',
    detail: 'What people actually do beats what we assumed they would.',
  },
];

/* ────────────────────────  AI-ASSISTED DEVELOPMENT  ──────────────────── */

export type AiStep = {
  id: string;
  title: string;
  detail: string;
  owner: 'human' | 'ai' | 'shared';
};

export const aiWorkflow: AiStep[] = [
  { id: 'idea', title: 'Idea', detail: 'The problem worth solving, framed as an outcome.', owner: 'human' },
  {
    id: 'context',
    title: 'Prompt / Context',
    detail: 'Constraints, existing code, data shape, edge cases. Context is the real skill.',
    owner: 'human',
  },
  {
    id: 'tools',
    title: 'Claude / ChatGPT / Cursor / Kiro',
    detail: 'The assistant proposes implementation against that context.',
    owner: 'ai',
  },
  {
    id: 'implementation',
    title: 'Implementation',
    detail: 'Reviewed, restructured and integrated into the real codebase.',
    owner: 'shared',
  },
  { id: 'debug', title: 'Debug', detail: 'Reproduce, isolate, fix. Assisted, not automated.', owner: 'shared' },
  { id: 'test', title: 'Test', detail: 'Behaviour, responsiveness, failure paths, regressions.', owner: 'human' },
  { id: 'deploy', title: 'Deploy', detail: 'Environments, config, monitoring, rollback plan.', owner: 'human' },
  { id: 'iterate', title: 'Iterate', detail: 'Feedback and analytics feed the next loop.', owner: 'shared' },
];

export const aiTools = [
  { name: 'Claude', role: 'Primary build & reasoning assistant' },
  { name: 'ChatGPT', role: 'Exploration, drafting, alternatives' },
  { name: 'Gemini', role: 'Research & cross-checking' },
  { name: 'Cursor', role: 'In-editor implementation' },
  { name: 'Kiro', role: 'Agentic build environment — used to build this site' },
];

export const aiStatement =
  'AI accelerates my development process, but product decisions, architecture choices, testing, validation, quality and final outcomes remain my responsibility.';

/* ──────────────────────────  ARCHITECTURE VIEW  ─────────────────────── */

export type ArchNode = {
  id: string;
  label: string;
  kicker: string;
  detail: string;
  examples: string[];
};

export const architecture: ArchNode[] = [
  {
    id: 'user',
    label: 'User',
    kicker: 'Where every decision is judged',
    detail:
      'A patient trying to see a doctor, a reader looking for a story, a customer completing a purchase. The intent at this layer determines everything below it.',
    examples: ['Intent', 'Context', 'Device', 'Trust'],
  },
  {
    id: 'ui',
    label: 'React / Web UI',
    kicker: 'Interface & interaction',
    detail:
      'Server-rendered pages with client interactivity where it earns its weight. A component system, real states, and layouts designed per breakpoint rather than stacked.',
    examples: ['Next.js App Router', 'React', 'Tailwind CSS', 'Design system'],
  },
  {
    id: 'api',
    label: 'API',
    kicker: 'The contract',
    detail:
      'Route handlers and callable endpoints with validated inputs. The browser asks; the server decides. Nothing sensitive is trusted from the client.',
    examples: ['Route handlers', 'Callable functions', 'REST', 'Zod validation'],
  },
  {
    id: 'logic',
    label: 'Business Logic',
    kicker: 'Rules that must not be optional',
    detail:
      'Transactional booking, slot holds, commissions, publishing states, access roles. This runs server-side because correctness matters more than convenience.',
    examples: ['Transactions', 'Slot holds', 'Role rules', 'State machines'],
  },
  {
    id: 'data',
    label: 'Database',
    kicker: 'Structure & access control',
    detail:
      'Firestore with security rules on one product, Postgres with row-level security and versioned migrations on another. Access is enforced at the data layer, not hidden in the UI.',
    examples: ['Cloud Firestore', 'PostgreSQL', 'Security rules', 'RLS', 'Migrations'],
  },
  {
    id: 'ai',
    label: 'AI / Automation',
    kicker: 'Work that should not need a human',
    detail:
      'Triggers, scheduled jobs, notifications, agents with a narrow brief. Plus AI-assisted development throughout the build itself.',
    examples: ['Triggers', 'Scheduled jobs', 'Notifications', 'AI agents'],
  },
  {
    id: 'deploy',
    label: 'Deployment',
    kicker: 'Shipped and observable',
    detail:
      'Continuous deployment, environment configuration, analytics and performance monitoring. A product you cannot observe is a product you cannot improve.',
    examples: ['Vercel', 'Firebase App Hosting', 'GA4', 'Speed Insights'],
  },
];

/* ─────────────────────────  PRODUCT THINKING  ──────────────────────── */

export const productThinking = [
  { title: 'User experience', line: 'Whether the thing feels obvious in the hand.' },
  { title: 'Product logic', line: 'What the system should do, and refuse to do.' },
  { title: 'Business requirements', line: 'The outcome someone is paying for.' },
  { title: 'Information architecture', line: 'How content and actions are organised.' },
  { title: 'Visual hierarchy', line: 'What the eye reaches first, second, never.' },
  { title: 'Performance', line: 'Speed is a feature, and usually the first one.' },
  { title: 'Accessibility', line: 'Keyboard, contrast, semantics, reduced motion.' },
  { title: 'Conversion', line: 'Where intent turns into a completed action.' },
  { title: 'Communication', line: 'Making the technical legible to everyone involved.' },
  { title: 'Iteration', line: 'Version two is where products get good.' },
];

export const productStack = [
  { label: 'Business', note: 'Outcome, constraints, priorities' },
  { label: 'Product', note: 'Scope, workflows, sequencing' },
  { label: 'UX', note: 'Structure, flows, interaction' },
  { label: 'Technology', note: 'Architecture, data, delivery' },
  { label: 'AI', note: 'Acceleration and automation' },
];

/* ────────────────────  COMMUNICATION & COLLABORATION  ────────────────── */

export const collaborationFlow = [
  { label: 'Requirement', note: 'Capture the real ask, not the stated one' },
  { label: 'Alignment', note: 'Agree scope and trade-offs early' },
  { label: 'Design', note: 'Make the solution visible before it is expensive' },
  { label: 'Build', note: 'Ship in reviewable increments' },
  { label: 'Feedback', note: 'Short loops with the people affected' },
  { label: 'Delivery', note: 'Handover, documentation, next iteration' },
];

export const collaborationStatement =
  'I work comfortably with founders, designers, content teams, marketers, business stakeholders and technical collaborators. I focus on making technical concepts understandable, turning requirements into actionable product decisions, and keeping work moving across teams.';

/* ────────────────────────────  EXPERIENCE  ──────────────────────────── */

export type Role = {
  company: string;
  title: string;
  period: string;
  meta?: string;
  current?: boolean;
  focus: string[];
};

export const experience: Role[] = [
  {
    company: 'Truepost India Pvt. Ltd.',
    title: 'Web Application & Digital Platform Lead',
    period: 'Apr 2020 – Jan 2023 · Feb 2025 – Present',
    current: true,
    focus: [
      'Custom web application',
      'Product development',
      'Platform ownership',
      'UX',
      'Stakeholder communication',
      'Analytics',
      'SEO',
      'AI-assisted workflows',
    ],
  },
  {
    company: 'QUL',
    title: 'Web & E-commerce Platform Lead',
    period: 'Apr 2023 – Feb 2025',
    meta: 'India / UAE / Thailand / China',
    focus: [
      'Shopify',
      'E-commerce',
      'UI/UX',
      'Customer journeys',
      'SEO',
      'Analytics',
      'Digital growth',
      'Multi-market coordination',
    ],
  },
  {
    company: 'DML Research',
    title: 'Web Developer Intern',
    period: 'Jul 2020 – Aug 2020',
    focus: [
      'University website',
      'HTML',
      'CSS',
      'JavaScript',
      'PHP',
      'CMS',
      'Requirements',
      'Delivery',
    ],
  },
];

/* ───────────────────────────  ACHIEVEMENTS  ─────────────────────────── */

export const achievements = [
  { value: '2.5M+', label: 'Monthly organic reach achieved at Truepost' },
  { value: '13K+', label: 'Followers built at Truepost' },
  { value: '₹0.033', label: 'Meta campaign CPE achieved' },
  { value: 'IIT Delhi', label: 'Entrepreneurship Development Program' },
];

/* ────────────────────────────  EDUCATION  ──────────────────────────── */

export const education = [
  {
    institution: 'Indian Institute of Technology, IIT Delhi',
    qualification: 'Entrepreneurship Development Program',
    period: '2025 – 2026',
  },
  {
    institution: 'Techno India University, Kolkata',
    qualification: 'B.Tech — Computer Science Engineering',
    period: '2019 – 2023',
  },
];

/* ──────────────────────────────  ABOUT  ────────────────────────────── */

export const about = [
  "I'm a Computer Science graduate with 5+ years of hands-on experience building digital products, web applications, e-commerce experiences and growth systems. My work sits between technology and business — I enjoy taking ambiguous ideas, structuring them into usable products, and using AI-assisted development to move from concept to working software quickly.",
  'I work comfortably with technical and non-technical stakeholders and enjoy the complete product journey: understanding the problem, designing the experience, building the solution, deploying it, and continuously improving it.',
];

export const profileCard = [
  { value: 'B.Tech CSE', label: 'Techno India University' },
  { value: 'Entrepreneurship Development Program', label: 'IIT Delhi' },
  { value: '5+ Years', label: 'Digital / Web Experience' },
  { value: 'Applied AI', label: 'AI-assisted Development & Automation' },
];
