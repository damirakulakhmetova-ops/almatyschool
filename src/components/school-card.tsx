import { MapPin } from 'lucide-react'
import { cn } from 'cn'
import type { School } from '../../shared/school'
import { Card } from '@/components/ui/card'
import { initials, schoolNumber } from '@/lib/format'
import { fundingLabels, typeLabels } from '@/lib/labels'

/** Школ 226 из 343 — им нейтральная плашка, цвет достаётся редким типам. */
const typeTile: Record<School['type'], string> = {
  school: 'bg-foreground/6 text-foreground/75 ring-foreground/10',
  gymnasium: 'bg-violet-500/12 text-violet-600 ring-violet-500/25 dark:text-violet-300',
  lyceum: 'bg-amber-500/12 text-amber-700 ring-amber-500/25 dark:text-amber-300',
}

const typeDot: Record<School['type'], string> = {
  school: 'bg-foreground/30',
  gymnasium: 'bg-violet-500',
  lyceum: 'bg-amber-500',
}

export function SchoolCard({ school }: { school: School }) {
  const number = schoolNumber(school.name)
  const badge = number ?? initials(school.name)

  return (
    <Card
      className={cn(
        'group h-full gap-0 overflow-hidden rounded-2xl py-0 ring-foreground/8',
        'transition-all duration-200 hover:-translate-y-0.5',
        'hover:shadow-lg hover:shadow-foreground/6 hover:ring-foreground/20',
      )}
    >
      <div className="flex flex-1 items-start gap-3.5 p-4">
        <div
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-xl font-heading font-semibold tabular-nums ring-1 ring-inset',
            badge.length > 3 ? 'text-[13px]' : 'text-base',
            typeTile[school.type],
          )}
        >
          {badge}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-[15px] leading-snug font-medium text-balance">
            {school.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className={cn('size-1.5 rounded-full', typeDot[school.type])} />
              {typeLabels[school.type]}
            </span>
            {school.funding === 'private' ? (
              <span className="rounded-md bg-amber-500/12 px-1.5 py-0.5 font-medium text-amber-700 dark:text-amber-300">
                {fundingLabels.private}
              </span>
            ) : (
              <span className="text-muted-foreground/70">{fundingLabels.public}</span>
            )}
          </div>
        </div>
      </div>

      {(school.address !== null || school.district !== null) && (
        <div className="mt-auto flex items-start gap-1.5 border-t border-foreground/8 px-4 py-2.5 text-[13px] text-muted-foreground">
          <MapPin className="mt-0.5 size-3.5 shrink-0 opacity-70" />
          <span className="min-w-0">
            {school.address}
            {school.district && (
              <span className="text-muted-foreground/60"> · {school.district} р-н</span>
            )}
          </span>
        </div>
      )}
    </Card>
  )
}

export function SchoolCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-card ring-1 ring-foreground/8">
      <div className="flex items-start gap-3.5 p-4">
        <div className="size-12 shrink-0 rounded-xl bg-foreground/8" />
        <div className="flex-1 space-y-2.5 pt-1">
          <div className="h-3.5 w-4/5 rounded bg-foreground/8" />
          <div className="h-3.5 w-1/2 rounded bg-foreground/8" />
          <div className="h-3 w-1/3 rounded bg-foreground/6" />
        </div>
      </div>
      <div className="border-t border-foreground/8 px-4 py-2.5">
        <div className="h-3 w-3/5 rounded bg-foreground/6" />
      </div>
    </div>
  )
}
