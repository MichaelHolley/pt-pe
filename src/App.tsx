import { createEffect, createMemo, For, type Component } from "solid-js";
import { createStore } from "solid-js/store";
import { calcTeamResultWithCumulative } from "./utils/calculator";
import { loadState, saveState } from "./utils/storage";
import TimeframeSection from "./components/TimeframeSection";
import PersonCard from "./components/PersonCard";
import ResultsPanel from "./components/ResultsPanel";
import type { Person } from "./utils/calculator";

const App: Component = () => {
  const [state, setState] = createStore(loadState());

  createEffect(() => saveState({ ...state, persons: [...state.persons] }));

  const realisticData = createMemo(() =>
    calcTeamResultWithCumulative(
      state.persons,
      state.startDate,
      state.endDate,
      state.realisticEfficiency,
      state.globalBlockedDates,
    ),
  );

  const optimisticData = createMemo(() =>
    calcTeamResultWithCumulative(
      state.persons,
      state.startDate,
      state.endDate,
      state.optimisticEfficiency,
      state.globalBlockedDates,
    ),
  );

  const toggleGlobalBlockedDate = (date: string) => {
    setState("globalBlockedDates", (dates) =>
      dates.includes(date) ? dates.filter((d) => d !== date) : [...dates, date].sort(),
    );
  };

  const addPerson = () => {
    const newPerson: Person = {
      id: crypto.randomUUID(),
      name: `Person ${String.fromCharCode(65 + state.persons.length)}`,
      hoursPerDay: { 1: 8, 2: 8, 3: 8, 4: 8, 5: 8 },
      blockedDates: [],
    };
    setState("persons", (p) => [...p, newPerson]);
  };

  const updatePerson = (id: string, updated: Person) => {
    const idx = state.persons.findIndex((p) => p.id === id);
    if (idx !== -1) setState("persons", idx, updated);
  };

  const removePerson = (id: string) => {
    setState("persons", (p) => p.filter((person) => person.id !== id));
  };

  return (
    <div class="flex flex-col md:flex-row md:h-screen bg-gray-50">
      {/* Left panel */}
      <div class="md:w-[460px] md:shrink-0 md:h-screen md:overflow-y-auto border-b md:border-b-0 md:border-r border-gray-200 px-6 py-8 flex flex-col gap-6">
        <header class="flex items-start justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">PT Planner</h1>
            <p class="text-sm text-gray-500 mt-1">Estimate achievable Projekt Tage for your team</p>
          </div>
          <a
            href="https://github.com/MichaelHolley/pt-pe"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-gray-700 transition-colors mt-1"
            aria-label="View on GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.51 11.51 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.222 0 4.61-2.807 5.625-5.479 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.697.825.578C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </header>

        <TimeframeSection
          startDate={state.startDate}
          endDate={state.endDate}
          realisticEfficiency={state.realisticEfficiency}
          optimisticEfficiency={state.optimisticEfficiency}
          globalBlockedDates={state.globalBlockedDates}
          onStartDate={(v) => setState("startDate", v)}
          onEndDate={(v) => setState("endDate", v)}
          onRealisticEfficiency={(v) => setState("realisticEfficiency", v)}
          onOptimisticEfficiency={(v) => setState("optimisticEfficiency", v)}
          onToggleBlockedDate={toggleGlobalBlockedDate}
        />

        <section class="flex flex-col gap-3">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500">Team</h2>
          <For each={state.persons}>
            {(person) => (
              <PersonCard
                person={person}
                onUpdate={(updated) => updatePerson(person.id, updated)}
                onRemove={() => removePerson(person.id)}
                canRemove={state.persons.length > 1}
              />
            )}
          </For>
          <button
            onClick={addPerson}
            class="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/40 transition-all text-sm font-medium"
          >
            + Add Person
          </button>
        </section>
      </div>

      {/* Right panel */}
      <div class="flex-1 md:h-screen md:overflow-y-auto px-6 py-8">
        <ResultsPanel
          realisticResult={realisticData().teamResult}
          optimisticResult={optimisticData().teamResult}
          realisticCumulative={realisticData().cumulative}
          optimisticCumulative={optimisticData().cumulative}
        />
      </div>
    </div>
  );
};

export default App;
