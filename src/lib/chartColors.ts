import { colorLegend, colorLegendItems } from '@tanstack/charts'
import { scaleOrdinal } from '@tanstack/charts/scales/ordinal'
import type { PersonResult } from './calculator'

const CHART_COLORS = [
  '#9333ea', // purple-600
  '#c084fc', // purple-400
  '#7c3aed', // violet-600
  '#6d28d9', // violet-700
  '#a855f7', // purple-500
  '#4f46e5', // indigo-600
  '#7e22ce', // purple-700
  '#d8b4fe', // purple-300
]

export const personName = (r: PersonResult) => r.person.name || 'Unnamed'

/** Color scale keyed by person id, so renaming a person keeps their color. */
export function personColor(
  persons: readonly PersonResult[],
  placement: 'top' | 'bottom',
) {
  const names = new Map(persons.map((r) => [r.person.id, personName(r)]))
  return {
    scale: scaleOrdinal<string, string>()
      .domain(persons.map((r) => r.person.id))
      .range(CHART_COLORS),
    legend: colorLegend<string>({
      placement,
      items: colorLegendItems<string>({
        justify: 'center',
        label: { format: (id) => names.get(id) ?? '' },
      }),
    }),
  }
}
