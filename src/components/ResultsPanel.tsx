import { For, type Component } from 'solid-js'
import type { TeamResult } from '../utils/calculator'

interface Props {
  result: TeamResult
}

const ResultsPanel: Component<Props> = (props) => {
  return (
    <section class="bg-white rounded-xl border border-gray-200 p-6">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Results</h2>

      <div class="flex items-baseline gap-2 mb-6">
        <span class="text-5xl font-bold text-blue-600">{props.result.totalPT.toFixed(2)}</span>
        <span class="text-2xl font-semibold text-gray-500">PT</span>
        <span class="text-sm text-gray-400 ml-1">achievable</span>
      </div>

      <div class="flex flex-col gap-3">
        <For each={props.result.persons}>
          {(r) => (
            <div class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-gray-800">{r.person.name || 'Unnamed'}</span>
                <span class="text-xs text-gray-500">
                  {r.workingDays} working days · {r.grossHours.toFixed(1)}h gross → {r.netHours.toFixed(1)}h net
                </span>
              </div>
              <div class="flex items-baseline gap-1">
                <span class="text-xl font-bold text-gray-800">{r.pt.toFixed(2)}</span>
                <span class="text-sm text-gray-500">PT</span>
              </div>
            </div>
          )}
        </For>
      </div>
    </section>
  )
}

export default ResultsPanel
