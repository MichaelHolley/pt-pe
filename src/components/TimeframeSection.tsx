import { useId } from 'react'
import { DateRangePicker } from '#/components/DateRangePicker'
import { WeekCalendar } from '#/components/WeekCalendar'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import {
  clearOutOfRangeGlobalBlockedDates,
  setEndDate,
  setOptimisticEfficiency,
  setRealisticEfficiency,
  setStartDate,
  toggleGlobalBlockedDate,
  usePlanner,
} from '#/lib/store'
import { cn } from '#/lib/utils'

function Field({
  label,
  children,
}: {
  label: string
  children: (id: string) => React.ReactNode
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children(id)}
    </div>
  )
}

const SCENARIO_DOT = {
  realistic: 'bg-realistic',
  optimistic: 'bg-optimistic',
}

function EfficiencyField({
  scenario,
  label,
  value,
  onChange,
}: {
  scenario: keyof typeof SCENARIO_DOT
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex h-9 cursor-text items-center gap-2 rounded-md border px-3 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
      <span className={cn('size-2 rounded-full', SCENARIO_DOT[scenario])} />
      <span className="text-sm">{label}</span>
      <input
        type="number"
        min={1}
        max={100}
        value={value}
        onChange={(e) =>
          onChange(Math.min(100, Math.max(1, Number(e.target.value))))
        }
        className="ml-auto w-10 [appearance:textfield] bg-transparent text-right text-sm font-semibold tabular-nums focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <span className="text-sm text-muted-foreground">%</span>
    </label>
  )
}

export function TimeframeSection() {
  const state = usePlanner()
  const efficiencyId = useId()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeframe</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Field label="Dates">
            {(id) => (
              <DateRangePicker
                id={id}
                value={{ from: state.startDate, to: state.endDate }}
                onChange={({ from, to }) => {
                  if (!from || !to) return
                  setStartDate(from)
                  setEndDate(to)
                }}
              />
            )}
          </Field>
          <div
            role="group"
            aria-labelledby={efficiencyId}
            className="flex flex-col gap-1.5"
          >
            <Label id={efficiencyId}>Efficiency</Label>
            <div className="grid grid-cols-2 gap-2">
              <EfficiencyField
                scenario="realistic"
                label="Realistic"
                value={state.realisticEfficiency}
                onChange={setRealisticEfficiency}
              />
              <EfficiencyField
                scenario="optimistic"
                label="Optimistic"
                value={state.optimisticEfficiency}
                onChange={setOptimisticEfficiency}
              />
            </div>
          </div>
        </div>
        <WeekCalendar
          startDate={state.startDate}
          endDate={state.endDate}
          globalBlockedDates={state.globalBlockedDates}
          onToggle={toggleGlobalBlockedDate}
          onClearOutOfRange={clearOutOfRangeGlobalBlockedDates}
        />
      </CardContent>
    </Card>
  )
}
