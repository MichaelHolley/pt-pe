import { useMemo } from 'react'
import { barX, defineChart, ruleX } from '@tanstack/charts'
import { Chart } from '@tanstack/charts/react'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'

interface Props {
  realisticPD: number
  optimisticPD: number
  fullTimePD: number
  maxPD: number
}

export function CapacityBar({
  realisticPD,
  optimisticPD,
  fullTimePD,
  maxPD,
}: Props) {
  const definition = useMemo(() => {
    const scenarios = [
      { scenario: 'Optimistic', pd: optimisticPD, fill: 'var(--optimistic)' },
      { scenario: 'Realistic', pd: realisticPD, fill: 'var(--realistic)' },
    ].sort((a, b) => b.pd - a.pd)

    return defineChart({
      marks: [
        ...scenarios.map((scenario) =>
          barX([scenario], {
            id: scenario.scenario,
            x1: 0,
            x2: 'pd',
            y: () => 'capacity',
            fill: scenario.fill,
          }),
        ),
        ruleX([fullTimePD], {
          stroke: 'var(--foreground)',
          strokeOpacity: 0.5,
          strokeWidth: 2,
          strokeDasharray: '2 2',
        }),
      ],
      scales: {
        x: { scale: scaleLinear().domain([0, maxPD]) },
        y: { scale: scaleBand().padding(0) },
      },
      guides: false,
      margin: 0,
      keyboard: false,
      pointer: false,
    })
  }, [realisticPD, optimisticPD, fullTimePD, maxPD])

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded-sm ring-1 ring-border/70"
    >
      <div
        className="capacity-gap absolute inset-y-0 left-0"
        style={{ width: `${(fullTimePD / maxPD) * 100}%` }}
      />
      <Chart
        definition={definition}
        height={16}
        ariaLabel="Realistic and optimistic delivery against full-time capacity"
      />
    </div>
  )
}
