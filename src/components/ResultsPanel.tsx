import { ChartsPanel } from '#/components/ChartsPanel'
import type { DailyPD, TeamResult } from '#/lib/calculator'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { cn } from '#/lib/utils'

interface Props {
  realisticResult: TeamResult
  optimisticResult: TeamResult
  realisticCumulative: DailyPD[]
  optimisticCumulative: DailyPD[]
}

function PDStat({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border bg-muted/50 px-4 py-3">
      <span className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className={cn('text-3xl font-bold', className)}>{value}</span>
        <span className="text-base font-semibold text-muted-foreground">
          PD
        </span>
      </div>
    </div>
  )
}

export function ResultsPanel(props: Props) {
  const { realisticResult, optimisticResult } = props
  const delta = optimisticResult.totalPD - realisticResult.totalPD
  const base = realisticResult.calendarWorkingDays
  const pct = (v: number) => (base > 0 ? (v / base) * 100 : 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
        <CardAction className="text-xs text-muted-foreground">
          1 PD = 8 hours
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-4">
          <PDStat
            label="Realistic"
            value={realisticResult.totalPD.toFixed(2)}
            className="text-realistic"
          />
          <PDStat
            label="Optimistic"
            value={optimisticResult.totalPD.toFixed(2)}
            className="text-optimistic"
          />
          <PDStat
            label="Difference"
            value={`${delta >= 0 ? '+' : ''}${delta.toFixed(2)}`}
            className="text-muted-foreground"
          />
        </div>

        <div className="flex flex-col gap-3">
          {realisticResult.persons.map((r, i) => {
            const optPD = optimisticResult.persons[i]?.pd ?? 0
            return (
              <div
                key={r.person.id}
                className="flex flex-col gap-2 rounded-lg border bg-muted/50 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {r.person.name || 'Unnamed'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {r.workingDays} / {base} working days ·{' '}
                      {r.grossHours.toFixed(1)}h gross
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-realistic">
                      {r.pd.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">–</span>
                    <span className="text-base font-bold text-optimistic">
                      {optPD.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">PD</span>
                  </div>
                </div>
                <div
                  className="relative h-2 overflow-hidden rounded-full bg-muted"
                  title={`Timeframe: ${base} total working days (Mon–Fri)`}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/40"
                    style={{ width: `${pct(r.workingDays)}%` }}
                    title={`Actual working days: ${r.workingDays} (after blocked dates)`}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-optimistic"
                    style={{ width: `${pct(optPD)}%` }}
                    title={`Optimistic: ${optPD.toFixed(2)} PD`}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-realistic"
                    style={{ width: `${pct(r.pd)}%` }}
                    title={`Realistic: ${r.pd.toFixed(2)} PD`}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <ChartsPanel {...props} />
      </CardContent>
    </Card>
  )
}
