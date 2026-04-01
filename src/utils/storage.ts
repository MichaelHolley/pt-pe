import type { Person } from "./calculator";

export interface AppState {
  startDate: string;
  endDate: string;
  efficiencyPercent: number;
  globalBlockedDates: string[];
  persons: Person[];
}

const KEY = "pt-planner";

function localISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function today(): string {
  return localISO(new Date());
}

function defaultEndDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return localISO(d);
}

const DEFAULT_STATE: AppState = {
  startDate: today(),
  endDate: defaultEndDate(),
  efficiencyPercent: 85,
  globalBlockedDates: [],
  persons: [
    {
      id: "1",
      name: "Person A",
      hoursPerWeek: 40,
      blockedWeekdays: [],
      blockedDates: [],
    },
    {
      id: "2",
      name: "Person B",
      hoursPerWeek: 40,
      blockedWeekdays: [],
      blockedDates: [],
    },
  ],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as AppState;
    // backfill field added after initial release
    if (!parsed.globalBlockedDates) parsed.globalBlockedDates = [];
    return parsed;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}
