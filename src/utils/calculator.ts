import { toISO } from "./dateUtils";

const PT_HOURS = 8;

export interface HoursPerDay {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface Person {
  id: string;
  name: string;
  hoursPerDay: HoursPerDay; // 1=Mon … 5=Fri
  blockedDates: string[]; // ISO strings e.g. "2026-04-15"
}

export interface PersonResult {
  person: Person;
  workingDays: number;
  grossHours: number;
  netHours: number;
  pt: number;
}

export interface TeamResult {
  persons: PersonResult[];
  totalPT: number;
}

export interface DailyPT {
  date: string; // formatted label e.g. "Apr 7"
  cumPT: number;
}

export interface TeamResultWithCumulative {
  teamResult: TeamResult;
  cumulative: DailyPT[];
}

/**
 * Single-pass calculation that produces both the per-person TeamResult and the
 * daily cumulative PT series. Replaces the previous calcTeamResult +
 * calcDailyCumulativePT pair, halving the number of date-range iterations per
 * scenario.
 */
export function calcTeamResultWithCumulative(
  persons: Person[],
  startISO: string,
  endISO: string,
  efficiencyPercent: number,
  globalBlockedDates: string[] = [],
): TeamResultWithCumulative {
  const globalSet = new Set(globalBlockedDates);

  const accumulators = persons.map((person) => ({
    person,
    blockedSet: new Set([...person.blockedDates, ...globalBlockedDates]),
    workingDays: 0,
    grossHours: 0,
  }));

  const cumulative: DailyPT[] = [];
  let runningCumPT = 0;

  const cur = new Date(startISO + "T00:00:00");
  const end = new Date(endISO + "T00:00:00");

  while (cur <= end) {
    const dow = cur.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const iso = toISO(cur);
    const label = cur.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    if (dow >= 1 && dow <= 5 && !globalSet.has(iso)) {
      let dayHours = 0;
      for (const acc of accumulators) {
        if (!acc.blockedSet.has(iso)) {
          const h = acc.person.hoursPerDay[dow as keyof HoursPerDay] ?? 0;
          if (h > 0) {
            acc.workingDays++;
            acc.grossHours += h;
            dayHours += h;
          }
        }
      }
      runningCumPT += (dayHours * (efficiencyPercent / 100)) / PT_HOURS;
    }

    cumulative.push({ date: label, cumPT: parseFloat(runningCumPT.toFixed(2)) });
    cur.setDate(cur.getDate() + 1);
  }

  const personResults: PersonResult[] = accumulators.map((acc) => {
    const netHours = acc.grossHours * (efficiencyPercent / 100);
    return {
      person: acc.person,
      workingDays: acc.workingDays,
      grossHours: acc.grossHours,
      netHours,
      pt: netHours / PT_HOURS,
    };
  });

  const totalPT = personResults.reduce((sum, r) => sum + r.pt, 0);

  return {
    teamResult: { persons: personResults, totalPT },
    cumulative,
  };
}
