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

export function getWorkingDays(
  startISO: string,
  endISO: string,
  blockedDates: string[],
  globalBlockedDates: string[] = [],
): number {
  const blockedSet = new Set([...blockedDates, ...globalBlockedDates]);
  let count = 0;
  const cur = new Date(startISO + "T00:00:00");
  const end = new Date(endISO + "T00:00:00");

  while (cur <= end) {
    const dow = cur.getDay(); // 0=Sun, 1=Mon … 6=Sat
    const iso = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
    if (dow !== 0 && dow !== 6 && !blockedSet.has(iso)) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export function calcPersonResult(
  person: Person,
  startISO: string,
  endISO: string,
  efficiencyPercent: number,
  globalBlockedDates: string[] = [],
): PersonResult {
  const blockedSet = new Set([...person.blockedDates, ...globalBlockedDates]);
  let workingDays = 0;
  let grossHours = 0;

  const cur = new Date(startISO + "T00:00:00");
  const end = new Date(endISO + "T00:00:00");

  while (cur <= end) {
    const dow = cur.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const iso = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
    if (dow >= 1 && dow <= 5 && !blockedSet.has(iso)) {
      const hours = person.hoursPerDay[dow as keyof typeof person.hoursPerDay] ?? 0;
      if (hours > 0) {
        workingDays++;
        grossHours += hours;
      }
    }
    cur.setDate(cur.getDate() + 1);
  }

  const netHours = grossHours * (efficiencyPercent / 100);
  const pt = netHours / 8;
  return { person, workingDays, grossHours, netHours, pt };
}

export interface DailyPT {
  date: string; // formatted label e.g. "Apr 7"
  cumPT: number;
}

export function calcDailyCumulativePT(
  persons: Person[],
  startISO: string,
  endISO: string,
  efficiencyPercent: number,
  globalBlockedDates: string[] = [],
): DailyPT[] {
  const globalSet = new Set(globalBlockedDates);
  const result: DailyPT[] = [];
  let cumulative = 0;

  const cur = new Date(startISO + "T00:00:00");
  const end = new Date(endISO + "T00:00:00");

  while (cur <= end) {
    const dow = cur.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const iso = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
    const label = cur.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    if (dow >= 1 && dow <= 5 && !globalSet.has(iso)) {
      let dayHours = 0;
      for (const person of persons) {
        if (!person.blockedDates.includes(iso)) {
          const h = person.hoursPerDay[dow as keyof HoursPerDay] ?? 0;
          dayHours += h;
        }
      }
      cumulative += (dayHours * (efficiencyPercent / 100)) / 8;
    }

    result.push({ date: label, cumPT: parseFloat(cumulative.toFixed(2)) });
    cur.setDate(cur.getDate() + 1);
  }

  return result;
}

export function calcTeamResult(
  persons: Person[],
  startISO: string,
  endISO: string,
  efficiencyPercent: number,
  globalBlockedDates: string[] = [],
): TeamResult {
  const results = persons.map((p) =>
    calcPersonResult(p, startISO, endISO, efficiencyPercent, globalBlockedDates),
  );
  const totalPT = results.reduce((sum, r) => sum + r.pt, 0);
  return { persons: results, totalPT };
}
