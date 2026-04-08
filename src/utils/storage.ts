import type { Person } from "./calculator";
import { toISO } from "./dateUtils";

export interface AppState {
  startDate: string;
  endDate: string;
  realisticEfficiency: number;
  optimisticEfficiency: number;
  globalBlockedDates: string[];
  persons: Person[];
}

const KEY = "pt-planner";
const STORAGE_VERSION = 1;

type StoredState = AppState & { version: number };

function today(): string {
  return toISO(new Date());
}

function defaultEndDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return toISO(d);
}

const DEFAULT_HOURS_PER_DAY = { 1: 8, 2: 8, 3: 8, 4: 8, 5: 8 };

const DEFAULT_STATE: AppState = {
  startDate: today(),
  endDate: defaultEndDate(),
  realisticEfficiency: 75,
  optimisticEfficiency: 90,
  globalBlockedDates: [],
  persons: [
    {
      id: "1",
      name: "Person A",
      hoursPerDay: { ...DEFAULT_HOURS_PER_DAY },
      blockedDates: [],
    },
    {
      id: "2",
      name: "Person B",
      hoursPerDay: { ...DEFAULT_HOURS_PER_DAY },
      blockedDates: [],
    },
  ],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    if (parsed.version !== STORAGE_VERSION) {
      localStorage.removeItem(KEY);
      return DEFAULT_STATE;
    }
    if (!Array.isArray(parsed.persons) || parsed.persons.length === 0) {
      localStorage.removeItem(KEY);
      return DEFAULT_STATE;
    }
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    localStorage.removeItem(KEY);
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  const stored: StoredState = { ...state, version: STORAGE_VERSION };
  localStorage.setItem(KEY, JSON.stringify(stored));
}
