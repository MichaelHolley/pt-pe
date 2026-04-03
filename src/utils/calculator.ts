export interface Person {
  id: string;
  name: string;
  hoursPerWeek: number;
  blockedWeekdays: number[]; // 1=Mon … 5=Fri
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
  blockedWeekdays: number[],
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
    if (dow !== 0 && dow !== 6 && !blockedWeekdays.includes(dow) && !blockedSet.has(iso)) {
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
  const dailyHours = person.hoursPerWeek / 5;
  const workingDays = getWorkingDays(
    startISO,
    endISO,
    person.blockedWeekdays,
    person.blockedDates,
    globalBlockedDates,
  );
  const grossHours = workingDays * dailyHours;
  const netHours = grossHours * (efficiencyPercent / 100);
  const pt = netHours / 8;
  return { person, workingDays, grossHours, netHours, pt };
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
