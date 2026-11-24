import { useMemo } from 'react'
import { barY, defineChart, group } from '@tanstack/charts'
import { Chart } from '@tanstack/charts/react'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { tooltip } from '@tanstack/charts/tooltip'
import type { TeamResult } from '#/lib/calculator'
import { personColor, personName } from '#/lib/chartColors'

interface Props {
  realisticResult: TeamResult
  optimisticResult: TeamResult
}

export function BarChart({ realisticResult, optimisticResult }: Props) {
  const definition = useMemo(() => {
    const toRows = (scenario: string, result: TeamResult) =>
      result.persons.map((r) => ({
        scenario,
        id: r.person.id,
        name: personName(r),
        pd: r.pd,
      }))
    const rows = [
      ...toRows('Realistic', realisticResult),
      ...toRows('Optimistic', optimisticResult),
    ]

    return defineChart({
      marks: [
        barY(rows, {
          x: 'scenario',
          y: 'pd',
          color: 'id',
          key: (row) => `${row.scenario}-${row.id}`,
          layout: group({ padding: 0.1 }),
          radius: { end: 4 },
        }),
      ],
      scales: {
        x: {
          scale: () => scaleBand().padding(0.2),
          axis: { line: false, ticks: { size: 0 } },
        },
        y: {
          scale: scaleLinear,
          nice: true,
          grid: true,
          axis: { label: 'PD', line: false, ticks: { size: 0 } },
        },
      },
      color: personColor(realisticResult.persons, 'top'),
      tooltip: {
        use: tooltip,
        format: (point) =>
          `${point.datum.name} (${point.datum.scenario}): ${point.datum.pd.toFixed(2)} PD`,
      },
    })
  }, [realisticResult, optimisticResult])

  return (
    <Chart
      definition={definition}
      height={240}
      ariaLabel="PD per person, realistic and optimistic"
    />
  )
}
