import { ChartsPanel } from '#/components/ChartsPanel'
import { PersonCoverage } from '#/components/PersonCoverage'
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
            className="text-optimistic"
          />
        </div>

        <PersonCoverage
          realisticResult={realisticResult}
          optimisticResult={optimisticResult}
        />

        <ChartsPanel {...props} />
      </CardContent>
    </Card>
  )
}
