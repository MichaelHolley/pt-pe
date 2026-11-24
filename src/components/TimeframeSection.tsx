import { useId } from 'react'
import { WeekCalendar } from '#/components/WeekCalendar'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
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

function EfficiencyField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <Field label={label}>
      {(id) => (
        <div className="flex items-center gap-2">
          <Input
            id={id}
            type="number"
            min={1}
            max={100}
            value={value}
            onChange={(e) =>
              onChange(Math.min(100, Math.max(1, Number(e.target.value))))
            }
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      )}
    </Field>
  )
}

export function TimeframeSection() {
  const state = usePlanner()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeframe</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end gap-4">
          <Field label="Start date">
            {(id) => (
              <Input
                id={id}
                type="date"
                value={state.startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-auto"
              />
            )}
          </Field>
          <Field label="End date">
            {(id) => (
              <Input
                id={id}
                type="date"
                value={state.endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-auto"
              />
            )}
          </Field>
          <EfficiencyField
            label="Realistic"
            value={state.realisticEfficiency}
            onChange={setRealisticEfficiency}
          />
          <EfficiencyField
            label="Optimistic"
            value={state.optimisticEfficiency}
            onChange={setOptimisticEfficiency}
          />
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
