import { cn } from '@/lib/utils';

/**
 * Zero-JavaScript stand-in for the WebGL core.
 *
 * Rendered on phones and whenever the visitor prefers reduced motion, and shown
 * underneath the canvas while it loads so the hero never has an empty hole in it.
 * SVG geometry is written out by hand, so it costs one paint and no requests.
 */

const NODES = [
  [50, 6],
  [77, 17],
  [92, 42],
  [86, 71],
  [64, 90],
  [36, 91],
  [14, 72],
  [8, 43],
  [23, 17],
  [50, 28],
  [69, 40],
  [63, 63],
  [37, 64],
  [31, 40],
] as const;

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 0],
  [9, 10],
  [10, 11],
  [11, 12],
  [12, 13],
  [13, 9],
  [0, 9],
  [2, 10],
  [4, 11],
  [6, 12],
  [8, 13],
];

export function CoreStatic({ className, animated = true }: { className?: string; animated?: boolean }) {
  return (
    <div className={cn('relative h-full w-full', className)} aria-hidden>
      {/* Volumetric glow */}
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgba(62,224,242,0.20),rgba(110,140,255,0.10)_52%,transparent_74%)] blur-[2px]" />
      <div className="absolute inset-[34%] rounded-full bg-[radial-gradient(closest-side,rgba(169,140,255,0.28),transparent)] blur-[6px]" />

      <svg
        viewBox="0 0 100 100"
        className={cn('relative h-full w-full', animated && 'motion-safe:animate-drift-y')}
        role="presentation"
      >
        <defs>
          <radialGradient id="core-fill" cx="50%" cy="42%" r="52%">
            <stop offset="0%" stopColor="#dffbff" stopOpacity="0.95" />
            <stop offset="42%" stopColor="#3ee0f2" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#6e8cff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="edge-stroke" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#3ee0f2" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a98cff" stopOpacity="0.32" />
          </linearGradient>
        </defs>

        {/* Orbit rings */}
        <ellipse cx="50" cy="50" rx="46" ry="17" stroke="url(#edge-stroke)" strokeWidth="0.25" fill="none" opacity="0.55" />
        <ellipse cx="50" cy="50" rx="17" ry="46" stroke="url(#edge-stroke)" strokeWidth="0.25" fill="none" opacity="0.4" />
        <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.08)" strokeWidth="0.22" fill="none" />
        <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,0.07)" strokeWidth="0.22" fill="none" />

        {/* Lattice */}
        <g stroke="url(#edge-stroke)" strokeWidth="0.22">
          {EDGES.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={NODES[a][0]}
              y1={NODES[a][1]}
              x2={NODES[b][0]}
              y2={NODES[b][1]}
            />
          ))}
        </g>

        {/* Nodes */}
        <g>
          {NODES.map(([x, y], i) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r={i < 9 ? 0.85 : 1.05}
              fill="#3ee0f2"
              opacity={i < 9 ? 0.7 : 0.95}
            />
          ))}
        </g>

        {/* Core */}
        <circle cx="50" cy="50" r="13" fill="url(#core-fill)" />
        <circle cx="50" cy="50" r="13" stroke="rgba(223,251,255,0.4)" strokeWidth="0.3" fill="none" />
        <circle cx="50" cy="50" r="6.2" fill="#eafcff" opacity="0.85" />
      </svg>
    </div>
  );
}
