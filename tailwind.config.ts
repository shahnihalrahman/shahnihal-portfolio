import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#04060B',
          2: '#070A11',
          3: '#0B0F18',
        },
        graphite: {
          100: '#151A24',
          200: '#1B212D',
          300: '#242B38',
        },
        /**
         * Contrast-checked against the darkest surface (#04060B) and the
         * lightest panel (#0C0D12) in use. Every step clears WCAG AA 4.5:1 for
         * normal text, so secondary and tertiary copy stays readable:
         *   soft  ~11.4:1   muted ~7.1:1   faint ~4.6:1
         * Do not darken `faint` further — it is already at the AA floor.
         */
        ink: {
          DEFAULT: '#E9EDF6',
          soft: '#B4BDD0',
          muted: '#8E99AE',
          faint: '#707B90',
        },
        accent: {
          cyan: '#3EE0F2',
          blue: '#6E8CFF',
          violet: '#A98CFF',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        label: '0.18em',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      maxWidth: {
        shell: '84rem',
        prose: '46rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px -32px rgba(62,224,242,0.28)',
        panel: '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 40px 120px -60px rgba(0,0,0,0.9)',
        lift: '0 40px 100px -40px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07)',
      },
      backgroundImage: {
        'grid-fine':
          'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
        'sheen': 'linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0) 42%)',
      },
      backgroundSize: {
        grid: '64px 64px',
        'grid-sm': '32px 32px',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'pulse-node': {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.35)' },
        },
        'dash-flow': {
          from: { strokeDashoffset: '24' },
          to: { strokeDashoffset: '0' },
        },
        'drift-y': {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-10px,0)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translate3d(0,14px,0)' },
          to: { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        /**
         * Transform-only entrance. Used for the hero headline, which is the LCP
         * element: animating its opacity would delay Largest Contentful Paint
         * until the fade finished, so it moves without ever being transparent.
         */
        'rise-in': {
          from: { transform: 'translate3d(0,18px,0)' },
          to: { transform: 'translate3d(0,0,0)' },
        },
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        /* Ambient life: the background never sits completely still. */
        'grid-drift': {
          '0%': { backgroundPosition: '0px 0px' },
          '100%': { backgroundPosition: '64px 64px' },
        },
        'light-shift': {
          '0%, 100%': { opacity: '0.75', transform: 'translate3d(-50%, 0, 0) scale(1)' },
          '50%': { opacity: '1', transform: 'translate3d(-50%, 2rem, 0) scale(1.06)' },
        },
      },
      animation: {
        'pulse-node': 'pulse-node 2.8s cubic-bezier(0.4,0,0.6,1) infinite',
        'dash-flow': 'dash-flow 1.2s linear infinite',
        'drift-y': 'drift-y 7s ease-in-out infinite',
        scan: 'scan 5s linear infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'rise-in': 'rise-in 0.85s cubic-bezier(0.22,1,0.36,1) both',
        marquee: 'marquee 42s linear infinite',
        'grid-drift': 'grid-drift 26s linear infinite',
        'light-shift': 'light-shift 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
