import { OutOfRangeBadge } from '#/components/OutOfRangeBadge'
import { SectionTitle } from '#/components/SectionTitle'
import { isOutOfRange, toISO } from '#/lib/dateUtils'
import { cn } from '#/lib/utils'

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

interface Props {
  startDate: string
  endDate: string
  globalBlockedDates: string[]
  onToggle: (date: string) => void
  onClearOutOfRange: () => void
}

function getMondayOf(dateISO: string): Date {
  const d = new Date(dateISO + 'T00:00:00')
  const dow = d.getDay()
  d.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow))
  return d
}

function buildWeeks(startISO: string, endISO: string): string[][] {
  const monday = getMondayOf(startISO)
  const end = new Date(endISO + 'T00:00:00')
  const weeks: string[][] = []
  while (monday <= end) {
    const week: string[] = []
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      week.push(toISO(d))
    }
    weeks.push(week)
    monday.setDate(monday.getDate() + 7)
  }
  return weeks
}

function weekLabel(mondayISO: string): string {
  return new Date(mondayISO + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function WeekCalendar({
  startDate,
  endDate,
  globalBlockedDates,
  onToggle,
  onClearOutOfRange,
}: Props) {
  const weeks =
    startDate && endDate && startDate <= endDate
      ? buildWeeks(startDate, endDate)
      : []
  const blockedSet = new Set(globalBlockedDates)
  const blockedCount = globalBlockedDates.length

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <SectionTitle>Calendar</SectionTitle>
        {blockedCount > 0 && (
          <span className="flex items-center gap-2 text-xs text-red-500">
            {blockedCount} blocked day{blockedCount !== 1 ? 's' : ''}
            <OutOfRangeBadge
              count={
                globalBlockedDates.filter((d) =>
                  isOutOfRange(d, startDate, endDate),
                ).length
              }
              onClear={onClearOutOfRange}
            />
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="w-14 pr-2 pb-1" />
              {WEEKDAY_LABELS.map((d) => (
                <th
                  key={d}
                  className="w-10 pb-1 text-center font-medium text-muted-foreground"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week[0]}>
                <td className="py-0.5 pr-2 text-right whitespace-nowrap text-muted-foreground">
                  {weekLabel(week[0])}
                </td>
                {week.map((dateISO) => {
                  const inRange = !isOutOfRange(dateISO, startDate, endDate)
                  const blocked = blockedSet.has(dateISO)
                  return (
                    <td key={dateISO} className="p-0.5 text-center">
                      <button
                        type="button"
                        disabled={!inRange}
                        onClick={() => onToggle(dateISO)}
                        className={cn(
                          'h-8 w-9 rounded-md border text-xs font-medium transition-colors',
                          !inRange &&
                            'cursor-default border-transparent text-muted-foreground/30',
                          inRange &&
                            blocked &&
                            'border-red-300 bg-red-100 text-red-600 hover:bg-red-200',
                          inRange &&
                            !blocked &&
                            'border-transparent bg-muted hover:bg-blue-100 hover:text-blue-700',
                        )}
                      >
                        {Number(dateISO.slice(8))}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {blockedCount > 0 && (
        <p className="text-xs text-muted-foreground">
          Click a red day to unblock it
        </p>
      )}
    </div>
  )
}
