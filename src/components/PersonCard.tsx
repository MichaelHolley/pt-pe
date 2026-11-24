import { useState } from 'react'
import { X } from 'lucide-react'
import { DateRangePicker } from '#/components/DateRangePicker'
import type { IsoRange } from '#/components/DateRangePicker'
import { OutOfRangeBadge } from '#/components/OutOfRangeBadge'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import type { HoursPerDay, Person } from '#/lib/calculator'
import { isOutOfRange, toISO } from '#/lib/dateUtils'
import { removePerson, updatePerson, usePlanner } from '#/lib/store'
import { cn } from '#/lib/utils'

const FULL_DAY = 8
const MAX_HOURS = 10

const WEEKDAYS: { label: string; value: keyof HoursPerDay }[] = [
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
]

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

const parse = (iso: string) => new Date(iso + 'T00:00:00')

function weekdaysBetween(from: string, to: string): string[] {
  const dates: string[] = []
  const cur = parse(from)
  const last = parse(to)
  while (cur <= last) {
    const dow = cur.getDay()
    if (dow >= 1 && dow <= 5) dates.push(toISO(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

function nextWeekday(iso: string): string {
  const d = parse(iso)
  do d.setDate(d.getDate() + 1)
  while (d.getDay() === 0 || d.getDay() === 6)
  return toISO(d)
}

type TimeOff = { dates: string[]; outOfRange: boolean }

function groupTimeOff(sorted: string[], start: string, end: string) {
  const groups: TimeOff[] = []
  for (const date of sorted) {
    const outOfRange = isOutOfRange(date, start, end)
    const last = groups.at(-1)
    if (
      last &&
      last.outOfRange === outOfRange &&
      nextWeekday(last.dates.at(-1)!) === date
    ) {
      last.dates.push(date)
    } else {
      groups.push({ dates: [date], outOfRange })
    }
  }
  return groups
}

function formatTimeOff(dates: string[]) {
  const first = parse(dates[0])
  return dates.length === 1
    ? dateFormat.format(first)
    : dateFormat.formatRange(first, parse(dates.at(-1)!))
}

function HoursColumn({
  label,
  hours,
  onChange,
}: {
  label: string
  hours: number
  onChange: (hours: number) => void
}) {
  const setFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = 1 - (e.clientY - rect.top) / rect.height
    onChange(Math.round(Math.min(1, Math.max(0, ratio)) * MAX_HOURS))
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-1.5">
      <input
        type="number"
        min={0}
        max={MAX_HOURS}
        step={0.5}
        value={hours}
        aria-label={`${label} hours`}
        onChange={(e) =>
          onChange(Math.min(MAX_HOURS, Math.max(0, Number(e.target.value))))
        }
        className={cn(
          'h-7 w-full [appearance:textfield] rounded-md bg-transparent text-center text-sm font-semibold tabular-nums transition-colors hover:bg-muted focus:bg-background focus:ring-2 focus:ring-ring/50 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          hours === 0 && 'text-muted-foreground',
        )}
      />
      <div
        aria-hidden
        title={`Drag to set ${label} hours`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          setFromPointer(e)
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromPointer(e)
        }}
        className="relative h-20 w-full cursor-ns-resize touch-none overflow-hidden rounded-md bg-muted"
        style={{
          backgroundImage: `repeating-linear-gradient(to top, transparent 0 calc(100% / ${MAX_HOURS} - 1px), var(--background) calc(100% / ${MAX_HOURS} - 1px) calc(100% / ${MAX_HOURS}))`,
        }}
      >
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 border-realistic bg-optimistic/60 transition-[height] duration-100 ease-out motion-reduce:transition-none',
            hours > 0 && 'border-t-2',
          )}
          style={{ height: `${(hours / MAX_HOURS) * 100}%` }}
        />
        <div
          className="absolute inset-x-0 border-t border-dashed border-foreground/30"
          style={{ bottom: `${(FULL_DAY / MAX_HOURS) * 100}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export function PersonCard({ person }: { person: Person }) {
  const startDate = usePlanner((s) => s.startDate)
  const endDate = usePlanner((s) => s.endDate)
  const canRemove = usePlanner((s) => s.persons.length > 1)
  const [range, setRange] = useState<IsoRange>({})

  const update = (patch: Partial<Person>) => updatePerson(person.id, patch)

  const addTimeOff = () => {
    if (!range.from) return
    const dates = weekdaysBetween(range.from, range.to ?? range.from)
    update({
      blockedDates: [...new Set([...person.blockedDates, ...dates])].sort(),
    })
    setRange({})
  }

  const removeDates = (dates: string[]) => {
    const removed = new Set(dates)
    update({ blockedDates: person.blockedDates.filter((d) => !removed.has(d)) })
  }

  const weeklyHours = Object.values(person.hoursPerDay).reduce(
    (a, b) => a + b,
    0,
  )
  const timeOff = groupTimeOff(person.blockedDates, startDate, endDate)
  const outOfRange = timeOff.filter((g) => g.outOfRange).flatMap((g) => g.dates)

  return (
    <Card className="gap-0 py-0">
      <CardContent className="flex flex-col gap-6 p-5">
        <div className="flex items-center gap-2">
          <input
            value={person.name}
            placeholder="Name"
            aria-label="Name"
            onChange={(e) => update({ name: e.target.value })}
            className="-ml-2 min-w-0 flex-1 rounded-md px-2 py-1 text-lg font-semibold transition-colors placeholder:text-muted-foreground hover:bg-muted focus:bg-background focus:ring-2 focus:ring-ring/50 focus:outline-none"
          />
          <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
            <span className="font-semibold text-foreground">{weeklyHours}</span>{' '}
            h a week
          </span>
          {canRemove && (
            <Button
              variant="ghost"
              size="icon-sm"
              title="Remove person"
              onClick={() => removePerson(person.id)}
              className="-mr-2 text-muted-foreground hover:bg-red-50 hover:text-red-500"
            >
              <X />
            </Button>
          )}
        </div>

        <div role="group" aria-label="Hours per day" className="flex gap-2">
          {WEEKDAYS.map((day) => (
            <HoursColumn
              key={day.value}
              label={day.label}
              hours={person.hoursPerDay[day.value]}
              onChange={(hours) =>
                update({
                  hoursPerDay: { ...person.hoursPerDay, [day.value]: hours },
                })
              }
            />
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">Time off</h3>
            <OutOfRangeBadge
              count={outOfRange.length}
              onClear={() => removeDates(outOfRange)}
            />
          </div>
          <div className="flex gap-2">
            <DateRangePicker
              value={range}
              onChange={setRange}
              placeholder="Pick a day or range"
              className="flex-1"
            />
            <Button onClick={addTimeOff} disabled={!range.from}>
              Add
            </Button>
          </div>
          {timeOff.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {timeOff.map((group) => {
                const label = formatTimeOff(group.dates)
                return (
                  <li
                    key={group.dates[0]}
                    title={group.outOfRange ? 'Outside timeframe' : undefined}
                    className={cn(
                      'flex items-center gap-2 rounded-md py-1 pr-1 pl-2.5 text-sm',
                      group.outOfRange
                        ? 'bg-muted text-muted-foreground line-through decoration-muted-foreground/50'
                        : 'bg-amber-50 text-amber-800',
                    )}
                  >
                    <span className="font-medium">{label}</span>
                    <span className="text-xs tabular-nums opacity-70">
                      {group.dates.length} day
                      {group.dates.length !== 1 && 's'}
                    </span>
                    <button
                      type="button"
                      title={`Remove ${label}`}
                      onClick={() => removeDates(group.dates)}
                      className="rounded p-1 transition-colors hover:bg-black/5 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <X className="size-3" strokeWidth={2.5} />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
