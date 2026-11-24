import { ChartsPanel } from '#/components/ChartsPanel'
import { PersonCapacityList } from '#/components/PersonCapacityList'
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
  highlight = false,
}: {
  label: string
  value: string
  className?: string
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 bg-card px-3 py-3 @min-[26rem]:flex-col',
        highlight && 'bg-optimistic/15',
      )}
    >
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-baseline gap-x-1 tabular-nums">
        <span
          className={cn('text-2xl font-semibold tracking-tight', className)}
        >
          {value}
        </span>
        <span className="text-xs text-muted-foreground">PD</span>
      </div>
    </div>
  )
}

export function ResultsPanel(props: Props) {
  const { realisticResult, optimisticResult } = props
  const delta = optimisticResult.totalPD - realisticResult.totalPD

  return (
    <Card className="@container min-w-0">
      <CardHeader>
        <CardTitle>Results</CardTitle>
        <CardAction className="text-xs text-muted-foreground">
          1 PD = 8 hours
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-px overflow-hidden rounded-lg border bg-border @min-[26rem]:grid-cols-3">
          <PDStat
            label="Realistic"
            value={realisticResult.totalPD.toFixed(2)}
            className="text-realistic"
          />
          <PDStat
            label="Optimistic"
            value={optimisticResult.totalPD.toFixed(2)}
            className="text-optimistic-foreground"
          />
          <PDStat
            label="Difference"
            value={`${delta >= 0 ? '+' : ''}${delta.toFixed(2)}`}
            className="text-realistic"
            highlight
          />
        </div>

        <PersonCapacityList
          realisticResult={realisticResult}
          optimisticResult={optimisticResult}
        />

        <ChartsPanel {...props} />
      </CardContent>
    </Card>
  )
}
