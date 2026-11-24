import { useMemo } from 'react'
import { curveStepAfter } from 'd3-shape'
import {
  colorLegend,
  colorLegendItems,
  defineChart,
  lineY,
} from '@tanstack/charts'
import { d3Curve } from '@tanstack/charts/d3/shape'
import { Chart } from '@tanstack/charts/react'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scaleOrdinal } from '@tanstack/charts/scales/ordinal'
import { tooltip } from '@tanstack/charts/tooltip'
import type { DailyPD } from '#/lib/calculator'

const SCENARIOS = ['Realistic', 'Optimistic']
const stepAfter = d3Curve(curveStepAfter)

interface Props {
  realisticCumulative: DailyPD[]
  optimisticCumulative: DailyPD[]
}

export function CumulativeLineChart({
  realisticCumulative,
  optimisticCumulative,
}: Props) {
  const definition = useMemo(() => {
    const labels = realisticCumulative.map((d) => d.date)
    const toRows = (scenario: string, series: DailyPD[]) =>
      series.map((d, day) => ({ scenario, day, cumPD: d.cumPD }))
    const line = (scenario: string, series: DailyPD[], dashed: boolean) =>
      lineY(toRows(scenario, series), {
        x: 'day',
        y: 'cumPD',
        color: 'scenario',
        curve: stepAfter,
        strokeWidth: 2,
        strokeDasharray: dashed ? '6 6' : undefined,
      })

    return defineChart({
      marks: [
        line('Realistic', realisticCumulative, false),
        line('Optimistic', optimisticCumulative, true),
      ],
      scales: {
        x: {
          scale: scaleLinear,
          axis: {
            line: false,
            ticks: {
              size: 0,
              format: (v) => (Number.isInteger(v) ? (labels[v] ?? '') : ''),
            },
          },
        },
        y: {
          scale: scaleLinear,
          nice: true,
          grid: true,
          axis: { label: 'Cumulative PD', line: false, ticks: { size: 0 } },
        },
      },
      color: {
        scale: scaleOrdinal<string, string>()
          .domain(SCENARIOS)
          .range(['var(--realistic)', 'var(--optimistic)']),
        legend: colorLegend<string>({
          items: colorLegendItems<string>({
            justify: 'center',
            indicator: { shape: 'line' },
          }),
        }),
      },
      focus: 'group-x',
      tooltip: {
        use: tooltip,
        formatGroup: (points) =>
          [
            labels[points[0]?.datum.day ?? 0],
            ...points.map(
              (p) => `${p.datum.scenario}: ${p.datum.cumPD.toFixed(2)} PD`,
            ),
          ].join('\n'),
      },
    })
  }, [realisticCumulative, optimisticCumulative])

  return (
    <Chart
      definition={definition}
      height={240}
      ariaLabel="Cumulative project-days over time"
    />
  )
}
