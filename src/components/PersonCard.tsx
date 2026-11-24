import { useState } from 'react'
import { X } from 'lucide-react'
import { OutOfRangeBadge } from '#/components/OutOfRangeBadge'
import { SectionTitle } from '#/components/SectionTitle'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { HoursPerDay, Person } from '#/lib/calculator'
import { isOutOfRange, toISO } from '#/lib/dateUtils'
import { removePerson, updatePerson, usePlanner } from '#/lib/store'

const WEEKDAYS: { label: string; value: keyof HoursPerDay }[] = [
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
]

function weekdaysBetween(from: string, to: string): string[] {
  const dates: string[] = []
  const cur = new Date(from + 'T00:00:00')
  const last = new Date(to + 'T00:00:00')
  while (cur <= last) {
    const dow = cur.getDay()
    if (dow >= 1 && dow <= 5) dates.push(toISO(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

export function PersonCard({ person }: { person: Person }) {
  const startDate = usePlanner((s) => s.startDate)
  const endDate = usePlanner((s) => s.endDate)
  const canRemove = usePlanner((s) => s.persons.length > 1)
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')

  const update = (patch: Partial<Person>) => updatePerson(person.id, patch)

  const addBlockedRange = () => {
    if (!rangeStart) return
    const dates = weekdaysBetween(rangeStart, rangeEnd || rangeStart)
    update({
      blockedDates: [...new Set([...person.blockedDates, ...dates])].sort(),
    })
    setRangeStart('')
    setRangeEnd('')
  }

  const weeklyHours = Object.values(person.hoursPerDay).reduce(
    (a, b) => a + b,
    0,
  )
  const outOfRangeCount = person.blockedDates.filter((d) =>
    isOutOfRange(d, startDate, endDate),
  ).length

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-row items-center gap-3 border-b py-4 [.border-b]:pb-4">
        <Avatar>
          <AvatarFallback className="bg-optimistic/30 font-bold text-realistic uppercase">
            {person.name[0] || '?'}
          </AvatarFallback>
        </Avatar>
        <Input
          value={person.name}
          placeholder="Name"
          aria-label="Name"
          onChange={(e) => update({ name: e.target.value })}
          className="font-semibold"
        />
        {canRemove && (
          <Button
            variant="ghost"
            size="icon-sm"
            title="Remove person"
            onClick={() => removePerson(person.id)}
            className="text-muted-foreground hover:bg-red-50 hover:text-red-500"
          >
            <X />
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-5 py-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <SectionTitle>Hours per day</SectionTitle>
            <Badge className="bg-optimistic/30 font-semibold text-realistic">
              {weeklyHours}h / week
            </Badge>
          </div>
          <div className="flex gap-2">
            {WEEKDAYS.map((day) => (
              <label
                key={day.value}
                className="flex flex-1 flex-col items-center gap-1.5 rounded-lg border bg-muted/50 px-1 py-2.5 focus-within:ring-2 focus-within:ring-ring/50"
              >
                <span className="text-[11px] font-medium text-muted-foreground">
                  {day.label}
                </span>
                <input
                  type="number"
                  min={0}
                  max={24}
                  value={person.hoursPerDay[day.value]}
                  onChange={(e) =>
                    update({
                      hoursPerDay: {
                        ...person.hoursPerDay,
                        [day.value]: Math.min(
                          24,
                          Math.max(0, Number(e.target.value)),
                        ),
                      },
                    })
                  }
                  className="w-full [appearance:textfield] bg-transparent text-center text-sm font-semibold focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <SectionTitle>Blocked dates</SectionTitle>
            <OutOfRangeBadge
              count={outOfRangeCount}
              onClear={() =>
                update({
                  blockedDates: person.blockedDates.filter(
                    (d) => !isOutOfRange(d, startDate, endDate),
                  ),
                })
              }
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <Label
                htmlFor={`${person.id}-from`}
                className="text-[11px] text-muted-foreground"
              >
                From
              </Label>
              <Input
                id={`${person.id}-from`}
                type="date"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Label
                htmlFor={`${person.id}-to`}
                className="text-[11px] text-muted-foreground"
              >
                To
              </Label>
              <Input
                id={`${person.id}-to`}
                type="date"
                value={rangeEnd}
                min={rangeStart}
                onChange={(e) => setRangeEnd(e.target.value)}
              />
            </div>
            <Button onClick={addBlockedRange}>Block</Button>
          </div>
          {person.blockedDates.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {person.blockedDates.map((date) => (
                <Badge
                  key={date}
                  variant="outline"
                  className="gap-1 border-amber-200 bg-amber-50 py-1 pr-1.5 pl-2.5 font-semibold text-amber-700"
                >
                  {date}
                  <button
                    type="button"
                    title={`Remove ${date}`}
                    onClick={() =>
                      update({
                        blockedDates: person.blockedDates.filter(
                          (d) => d !== date,
                        ),
                      })
                    }
                    className="rounded-full p-0.5 transition-colors hover:text-red-500"
                  >
                    <X className="size-2.5" strokeWidth={3} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
