import type { Person } from './calculator'

export interface AppState {
  startDate: string
  endDate: string
  efficiencyPercent: number
  globalBlockedDates: string[]
  persons: Person[]
}

const KEY = 'pt-planner'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function defaultEndDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().slice(0, 10)
}

const DEFAULT_STATE: AppState = {
  startDate: today(),
  endDate: defaultEndDate(),
  efficiencyPercent: 85,
  globalBlockedDates: [],
  persons: [
    { id: '1', name: 'Person A', hoursPerWeek: 40, blockedWeekdays: [], blockedDates: [] },
    { id: '2', name: 'Person B', hoursPerWeek: 32, blockedWeekdays: [4], blockedDates: [] },
  ],
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as AppState
    // backfill field added after initial release
    if (!parsed.globalBlockedDates) parsed.globalBlockedDates = []
    return parsed
  } catch {
    return DEFAULT_STATE
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}
