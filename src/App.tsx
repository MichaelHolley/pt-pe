import { createEffect, createMemo, For, type Component } from 'solid-js'
import { createStore } from 'solid-js/store'
import { calcTeamResult } from './utils/calculator'
import { loadState, saveState } from './utils/storage'
import TimeframeSection from './components/TimeframeSection'
import PersonCard from './components/PersonCard'
import ResultsPanel from './components/ResultsPanel'
import type { Person } from './utils/calculator'

const App: Component = () => {
  const [state, setState] = createStore(loadState())

  createEffect(() => saveState({ ...state, persons: [...state.persons] }))

  const result = createMemo(() =>
    calcTeamResult(state.persons, state.startDate, state.endDate, state.efficiencyPercent)
  )

  const addPerson = () => {
    const newPerson: Person = {
      id: crypto.randomUUID(),
      name: `Person ${String.fromCharCode(65 + state.persons.length)}`,
      hoursPerWeek: 40,
      blockedWeekdays: [],
      blockedDates: [],
    }
    setState('persons', p => [...p, newPerson])
  }

  const updatePerson = (id: string, updated: Person) => {
    setState('persons', p => p.map(person => person.id === id ? updated : person))
  }

  const removePerson = (id: string) => {
    setState('persons', p => p.filter(person => person.id !== id))
  }

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
        <header>
          <h1 class="text-2xl font-bold text-gray-900">PT Planner</h1>
          <p class="text-sm text-gray-500 mt-1">Estimate achievable Projekt Tage for your team</p>
        </header>

        <TimeframeSection
          startDate={state.startDate}
          endDate={state.endDate}
          efficiencyPercent={state.efficiencyPercent}
          onStartDate={v => setState('startDate', v)}
          onEndDate={v => setState('endDate', v)}
          onEfficiency={v => setState('efficiencyPercent', v)}
        />

        <section class="flex flex-col gap-3">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500">Team</h2>
          <For each={state.persons}>
            {(person) => (
              <PersonCard
                person={person}
                onUpdate={updated => updatePerson(person.id, updated)}
                onRemove={() => removePerson(person.id)}
                canRemove={state.persons.length > 1}
              />
            )}
          </For>
          <button
            onClick={addPerson}
            class="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm font-medium"
          >
            + Add Person
          </button>
        </section>

        <ResultsPanel result={result()} />
      </div>
    </div>
  )
}

export default App
