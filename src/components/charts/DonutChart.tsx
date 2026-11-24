import { useMemo } from 'react'
import { defineChart } from '@tanstack/charts'
import { pie, polar, radialArc } from '@tanstack/charts/polar'
import { Chart } from '@tanstack/charts/react'
import { tooltip } from '@tanstack/charts/tooltip'
import type { TeamResult } from '#/lib/calculator'
import { personColor, personName } from '#/lib/chartColors'

export function DonutChart({
  realisticResult,
}: {
  realisticResult: TeamResult
}) {
  const definition = useMemo(() => {
    const rows = realisticResult.persons.map((r) => ({
      id: r.person.id,
      name: personName(r),
      pd: r.pd,
    }))

    return defineChart({
      marks: [
        polar({
          inset: 8,
          marks: [
            radialArc(pie(rows, { value: 'pd' }), {
              innerRadius: ({ radius }) => radius * 0.62,
              cornerRadius: 3,
              color: 'id',
              key: 'id',
            }),
          ],
          scales: { angle: null, radius: null },
        }),
      ],
      scales: { x: null, y: null },
      color: personColor(realisticResult.persons, 'bottom'),
      tooltip: {
        use: tooltip,
        format: (point) =>
          `${point.datum.name}: ${point.datum.value.toFixed(2)} PD`,
      },
    })
  }, [realisticResult])

  return (
    <div className="relative">
      <Chart
        definition={definition}
        height={240}
        ariaLabel="Share of realistic project-days per person"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-8 flex flex-col items-center justify-center">
        <span className="text-xs text-muted-foreground">Total PD</span>
        <span className="text-xl font-bold text-foreground">
          {realisticResult.totalPD.toFixed(1)}
        </span>
      </div>
    </div>
  )
}
