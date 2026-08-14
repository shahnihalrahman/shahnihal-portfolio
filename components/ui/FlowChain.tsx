import { cn } from '@/lib/utils';

export type ChainNode = {
  label: string;
  note?: string;
  state?: 'built' | 'planned';
};

/**
 * A reusable chain of steps.
 *
 * `orientation="auto"` stacks on phones and turns horizontal from `sm` up.
 * `orientation="vertical"` stays stacked at every width — used where each step
 * carries a note and a squeezed row would be unreadable.
 */
export function FlowChain({
  nodes,
  className,
  compact,
  accent = 'cyan',
  orientation = 'auto',
}: {
  nodes: ChainNode[];
  className?: string;
  compact?: boolean;
  accent?: 'cyan' | 'blue' | 'violet';
  orientation?: 'auto' | 'vertical';
}) {
  const dot = {
    cyan: 'bg-accent-cyan',
    blue: 'bg-accent-blue',
    violet: 'bg-accent-violet',
  }[accent];

  const horizontal = orientation === 'auto';

  return (
    <ol
      className={cn('flex flex-col items-stretch', horizontal && 'sm:flex-row sm:items-center', className)}
    >
      {nodes.map((node, i) => (
        <li
          key={node.label}
          className={cn(
            'flex flex-col items-stretch',
            horizontal ? 'flex-1 sm:flex-row sm:items-center' : 'w-full',
          )}
        >
          <div
            className={cn(
              'flex flex-1 items-center gap-2.5 rounded-xl border px-3 py-2.5',
              compact && 'px-2.5 py-2',
              node.state === 'planned'
                ? 'border-dashed border-white/[0.11] bg-transparent'
                : 'border-white/[0.07] bg-white/[0.02]',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full',
                node.state === 'planned' ? 'bg-ink-faint' : dot,
              )}
            />
            <span className="min-w-0">
              <span
                className={cn(
                  'block truncate font-mono text-2xs uppercase tracking-label',
                  node.state === 'planned' ? 'text-ink-muted' : 'text-ink-soft',
                )}
              >
                {node.label}
              </span>
              {node.note ? (
                <span className="mt-1 block text-[0.75rem] leading-snug text-ink-faint">
                  {node.note}
                </span>
              ) : null}
            </span>
            {node.state === 'planned' ? (
              <span className="ml-auto shrink-0 font-mono text-[0.625rem] uppercase tracking-label text-ink-faint">
                Planned
              </span>
            ) : null}
          </div>

          {i < nodes.length - 1 ? (
            <span
              aria-hidden
              className={cn(
                'flex shrink-0 items-center justify-center self-center py-1.5',
                horizontal && 'sm:px-2 sm:py-0',
              )}
            >
              <svg
                viewBox="0 0 12 12"
                className={cn('h-3 w-3 rotate-90 text-ink-faint', horizontal && 'sm:rotate-0')}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6h8M7.5 3 10.5 6l-3 3" />
              </svg>
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
