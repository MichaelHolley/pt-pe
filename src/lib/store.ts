import { create } from 'zustand'
import type { Person } from './calculator'
import { isOutOfRange } from './dateUtils'
import type { AppState } from './storage'
import { loadState, saveState } from './storage'

export const usePlanner = create<AppState>()(() => loadState())

if (typeof window !== 'undefined') usePlanner.subscribe(saveState)

const set = usePlanner.setState

export const setStartDate = (startDate: string) => set({ startDate })
export const setEndDate = (endDate: string) => set({ endDate })
export const setRealisticEfficiency = (realisticEfficiency: number) =>
  set({ realisticEfficiency })
export const setOptimisticEfficiency = (optimisticEfficiency: number) =>
  set({ optimisticEfficiency })

export const toggleGlobalBlockedDate = (date: string) =>
  set(({ globalBlockedDates: dates }) => ({
    globalBlockedDates: dates.includes(date)
      ? dates.filter((d) => d !== date)
      : [...dates, date].sort(),
  }))

export const clearOutOfRangeGlobalBlockedDates = () =>
  set(({ globalBlockedDates, startDate, endDate }) => ({
    globalBlockedDates: globalBlockedDates.filter(
      (d) => !isOutOfRange(d, startDate, endDate),
    ),
  }))

export const addPerson = () =>
  set(({ persons }) => ({
    persons: [
      ...persons,
      {
        id: crypto.randomUUID(),
        name: `Person ${String.fromCharCode(65 + persons.length)}`,
        hoursPerDay: { 1: 8, 2: 8, 3: 8, 4: 8, 5: 8 },
        blockedDates: [],
      },
    ],
  }))

export const updatePerson = (id: string, patch: Partial<Person>) =>
  set(({ persons }) => ({
    persons: persons.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  }))

export const removePerson = (id: string) =>
  set(({ persons }) => ({ persons: persons.filter((p) => p.id !== id) }))
