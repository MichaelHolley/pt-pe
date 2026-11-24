import { toISO } from './dateUtils'

const PD_HOURS = 8

export interface HoursPerDay {
  1: number
  2: number
  3: number
  4: number
  5: number
}

export interface Person {
  id: string
  name: string
  hoursPerDay: HoursPerDay // 1=Mon … 5=Fri
  blockedDates: string[] // ISO strings e.g. "2026-04-15"
}

export interface PersonResult {
  person: Person
  workingDays: number
  grossHours: number
  netHours: number
  pd: number
}

export interface TeamResult {
  persons: PersonResult[]
  totalPD: number
  weekdaysInRange: number
}

export interface DailyPD {
  date: string // formatted label e.g. "Apr 7"
  cumPD: number
}

export interface TeamResultWithCumulative {
  teamResult: TeamResult
  cumulative: DailyPD[]
}

/**
 * Single-pass calculation that produces both the per-person TeamResult and the
 * daily cumulative PD series. Replaces the previous calcTeamResult +
 * calcDailyCumulativePD pair, halving the number of date-range iterations per
 * scenario.
 */
export function calcTeamResultWithCumulative(
  persons: Person[],
  startISO: string,
  endISO: string,
  efficiencyPercent: number,
  globalBlockedDates: string[] = [],
): TeamResultWithCumulative {
  const globalSet = new Set(globalBlockedDates)

  const accumulators = persons.map((person) => ({
    person,
    blockedSet: new Set([...person.blockedDates, ...globalBlockedDates]),
    workingDays: 0,
    grossHours: 0,
  }))

  const cumulative: DailyPD[] = []
  let runningCumPD = 0
  let weekdaysInRange = 0

  const cur = new Date(startISO + 'T00:00:00')
  const end = new Date(endISO + 'T00:00:00')

  while (cur <= end) {
    const dow = cur.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6
    const iso = toISO(cur)
    const label = cur.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })

    if (dow >= 1 && dow <= 5) weekdaysInRange++

    if (dow >= 1 && dow <= 5 && !globalSet.has(iso)) {
      let dayHours = 0
      for (const acc of accumulators) {
        if (!acc.blockedSet.has(iso)) {
          const h = acc.person.hoursPerDay[dow as keyof HoursPerDay]
          if (h > 0) {
            acc.workingDays++
            acc.grossHours += h
            dayHours += h
          }
        }
      }
      runningCumPD += (dayHours * (efficiencyPercent / 100)) / PD_HOURS
    }

    cumulative.push({ date: label, cumPD: parseFloat(runningCumPD.toFixed(2)) })
    cur.setDate(cur.getDate() + 1)
  }

  const personResults: PersonResult[] = accumulators.map((acc) => {
    const netHours = acc.grossHours * (efficiencyPercent / 100)
    return {
      person: acc.person,
      workingDays: acc.workingDays,
      grossHours: acc.grossHours,
      netHours,
      pd: netHours / PD_HOURS,
    }
  })

  const totalPD = personResults.reduce((sum, r) => sum + r.pd, 0)

  return {
    teamResult: { persons: personResults, totalPD, weekdaysInRange },
    cumulative,
  }
}
