import { SectionTitle } from '#/components/SectionTitle'
import { BarChart } from '#/components/charts/BarChart'
import { CumulativeLineChart } from '#/components/charts/CumulativeLineChart'
import { DonutChart } from '#/components/charts/DonutChart'
import type { DailyPD, TeamResult } from '#/lib/calculator'
import { cn } from '#/lib/utils'

interface Props {
  realisticResult: TeamResult
  optimisticResult: TeamResult
  realisticCumulative: DailyPD[]
  optimisticCumulative: DailyPD[]
}

function ChartTile({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-2 rounded-xl border bg-muted/50 p-4',
        className,
      )}
    >
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  )
}

export function ChartsPanel(props: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 @min-[32rem]:grid-cols-2">
      <ChartTile title="PD per Person">
        <BarChart
          realisticResult={props.realisticResult}
          optimisticResult={props.optimisticResult}
        />
      </ChartTile>
      <ChartTile title="Team Share (Realistic)">
        <DonutChart realisticResult={props.realisticResult} />
      </ChartTile>
      <ChartTile title="Cumulative PD over Time" className="col-span-full">
        <CumulativeLineChart
          realisticCumulative={props.realisticCumulative}
          optimisticCumulative={props.optimisticCumulative}
        />
      </ChartTile>
    </div>
  )
}
