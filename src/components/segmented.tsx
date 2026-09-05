import { cn } from 'cn'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  'aria-label': ariaLabel,
}: {
  value: T
  onChange: (value: T) => void
  options: readonly SegmentedOption<T>[]
  className?: string
  'aria-label': string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex shrink-0 items-center gap-0.5 rounded-xl bg-muted/70 p-1',
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-all outline-none',
              'focus-visible:ring-3 focus-visible:ring-ring/50',
              active
                ? 'bg-card text-foreground shadow-sm ring-1 ring-foreground/10'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
