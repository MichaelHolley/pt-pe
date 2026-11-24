import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '#/components/ui/button'
import { Calendar } from '#/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { toISO } from '#/lib/dateUtils'
import { cn } from '#/lib/utils'

export type IsoRange = { from?: string; to?: string }

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

const toDate = (iso: string | undefined) =>
  iso ? new Date(iso + 'T00:00:00') : undefined

function formatRange({ from, to }: DateRange) {
  if (!from) return undefined
  return to ? dateFormat.formatRange(from, to) : dateFormat.format(from)
}

export function DateRangePicker({
  id,
  value,
  onChange,
  placeholder = 'Pick dates',
  className,
}: {
  id?: string
  value: IsoRange
  onChange: (range: IsoRange) => void
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  // Holds a half-picked range so callers that only accept complete ranges don't reset the selection.
  const [draft, setDraft] = useState<DateRange>()

  const selected = draft ?? { from: toDate(value.from), to: toDate(value.to) }

  const select = (range: DateRange | undefined) => {
    const complete = !!range?.to
    setDraft(complete ? undefined : range)
    if (complete) setOpen(false)
    onChange({
      from: range?.from && toISO(range.from),
      to: range?.to && toISO(range.to),
    })
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setDraft(undefined)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            'justify-start font-normal',
            !selected.from && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon />
          {formatRange(selected) ?? placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          resetOnSelect
          weekStartsOn={1}
          numberOfMonths={2}
          defaultMonth={selected.from}
          selected={selected}
          onSelect={select}
        />
      </PopoverContent>
    </Popover>
  )
}
