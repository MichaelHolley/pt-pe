import { createStore } from "solid-js/store";
import type { Person } from "./utils/calculator";
import { loadState } from "./utils/storage";

const [state, setState] = createStore(loadState());
export { state };

export const setStartDate = (v: string) => setState("startDate", v);
export const setEndDate = (v: string) => setState("endDate", v);
export const setRealisticEfficiency = (v: number) => setState("realisticEfficiency", v);
export const setOptimisticEfficiency = (v: number) => setState("optimisticEfficiency", v);

export const toggleGlobalBlockedDate = (date: string) =>
  setState("globalBlockedDates", (dates) =>
    dates.includes(date) ? dates.filter((d) => d !== date) : [...dates, date].sort(),
  );

export const addPerson = () => {
  const newPerson: Person = {
    id: crypto.randomUUID(),
    name: `Person ${String.fromCharCode(65 + state.persons.length)}`,
    hoursPerDay: { 1: 8, 2: 8, 3: 8, 4: 8, 5: 8 },
    blockedDates: [],
  };
  setState("persons", (p) => [...p, newPerson]);
};

export const updatePerson = (id: string, updated: Person) => {
  const idx = state.persons.findIndex((p) => p.id === id);
  if (idx !== -1) setState("persons", idx, updated);
};

export const removePerson = (id: string) =>
  setState("persons", (p) => p.filter((person) => person.id !== id));
