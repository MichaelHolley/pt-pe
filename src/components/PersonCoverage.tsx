import type { TeamResult } from '#/lib/calculator'
import { cn } from '#/lib/utils'

const PD_HOURS = 8

interface Props {
  realisticResult: TeamResult
  optimisticResult: TeamResult
}

const SEGMENTS = [
  { key: 'realistic', label: 'Realistic', className: 'bg-realistic' },
  { key: 'upside', label: 'Upside', className: 'bg-optimistic' },
  { key: 'loss', label: 'Efficiency loss', className: 'loss-hatch' },
  { key: 'unavailable', label: 'Unavailable', className: 'bg-muted' },
] as const

type SegmentKey = (typeof SEGMENTS)[number]['key']

function Swatch({ className }: { className: string }) {
  return (
    <span
      className={cn('size-2.5 rounded-[3px] ring-1 ring-border', className)}
    />
  )
}

export function PersonCoverage({ realisticResult, optimisticResult }: Props) {
  const base = realisticResult.weekdaysInRange
  const pct = (pd: number) => (base > 0 ? (Math.max(0, pd) / base) * 100 : 0)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {SEGMENTS.map((s) => (
            <li key={s.key} className="flex items-center gap-1.5">
              <Swatch className={s.className} />
              {s.label}
            </li>
          ))}
        </ul>
        <span>
          Full bar = {base} weekdays × {PD_HOURS} h
        </span>
      </div>

      <div className="grid grid-cols-[minmax(5rem,9rem)_1fr_auto] items-center gap-x-4">
        {realisticResult.persons.map((r) => {
          const optPD =
            optimisticResult.persons.find((o) => o.person.id === r.person.id)
              ?.pd ?? 0
          const grossPD = r.grossHours / PD_HOURS
          const values: Record<SegmentKey, number> = {
            realistic: r.pd,
            upside: optPD - r.pd,
            loss: grossPD - optPD,
            unavailable: base - grossPD,
          }

          return (
            <div
              key={r.person.id}
              className="col-span-3 grid grid-cols-subgrid items-center border-b border-dashed py-2.5 last:border-b-0"
            >
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold">
                  {r.person.name || 'Unnamed'}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {r.workingDays}/{base} weekdays, {r.grossHours.toFixed(0)} h
                </span>
              </div>

              <div className="flex h-4 overflow-hidden rounded-[5px] bg-muted">
                {SEGMENTS.filter((s) => s.key !== 'unavailable').map((s) => (
                  <div
                    key={s.key}
                    className={cn('h-full shrink-0', s.className)}
                    style={{ width: `${pct(values[s.key])}%` }}
                    title={`${s.label}: ${values[s.key].toFixed(2)} PD`}
                  />
                ))}
              </div>

              <div className="flex items-baseline justify-end gap-1 text-sm tabular-nums">
                <span className="font-bold text-realistic">
                  {r.pd.toFixed(2)}
                </span>
                <span className="text-muted-foreground">–</span>
                <span className="font-bold text-optimistic">
                  {optPD.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">PD</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
