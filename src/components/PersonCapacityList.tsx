import { useId } from 'react'
import { CapacityBar } from '#/components/charts/CapacityBar'
import type { TeamResult } from '#/lib/calculator'
import { personName } from '#/lib/chartColors'

interface Props {
  realisticResult: TeamResult
  optimisticResult: TeamResult
}

export function PersonCapacityList({
  realisticResult,
  optimisticResult,
}: Props) {
  const headingId = useId()
  const fullTimePD = realisticResult.calendarWorkingDays
  const optimisticById = new Map(
    optimisticResult.persons.map((result) => [result.person.id, result.pd]),
  )
  const maxPD = Math.max(
    fullTimePD,
    ...realisticResult.persons.map((result) => result.pd),
    ...optimisticResult.persons.map((result) => result.pd),
    1,
  )
  const scenariosReversed = optimisticResult.totalPD < realisticResult.totalPD

  return (
    <section aria-labelledby={headingId}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id={headingId} className="text-sm font-semibold">
          Capacity by person
        </h2>
        <p className="text-xs text-muted-foreground tabular-nums">
          100% = {fullTimePD} PD per person
        </p>
      </div>
      <ul
        className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground"
        aria-label="Capacity legend"
      >
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2.5 w-4 rounded-xs bg-realistic"
          />
          Realistic
        </li>
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2.5 w-4 rounded-xs bg-optimistic"
          />
          Optimistic
        </li>
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="capacity-gap h-2.5 w-4 rounded-xs border"
          />
          Gap to full time
        </li>
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {scenariosReversed
          ? 'Optimistic efficiency is below realistic. The bars show both scenario endpoints.'
          : 'Light blue extends the realistic estimate to optimistic. Hatching shows the remaining gap to full-time capacity.'}
      </p>

      {fullTimePD === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          No working days in this timeframe. Choose a range that includes
          Monday–Friday.
        </p>
      ) : (
        <div className="mt-4">
          <div
            aria-hidden="true"
            className="hidden grid-cols-[minmax(0,1fr)_6rem_6rem] gap-x-4 border-b pb-2 text-xs text-muted-foreground @min-[28rem]:grid"
          >
            <span>Person</span>
            <span className="text-right">Realistic PD</span>
            <span className="text-right">Optimistic PD</span>
          </div>
          <ul className="divide-y">
            {realisticResult.persons.map((result) => {
              const optimisticPD = optimisticById.get(result.person.id) ?? 0
              const highestPD = Math.max(result.pd, optimisticPD)
              const gapPD = Math.max(0, fullTimePD - highestPD)

              return (
                <li key={result.person.id} className="grid gap-2 py-3">
                  <div className="grid grid-cols-2 items-end gap-x-4 gap-y-2 @min-[28rem]:grid-cols-[minmax(0,1fr)_6rem_6rem]">
                    <h3 className="col-span-2 min-w-0 text-sm font-semibold wrap-anywhere @min-[28rem]:col-span-1 @min-[28rem]:self-center">
                      {personName(result)}
                    </h3>
                    <div className="tabular-nums @min-[28rem]:text-right">
                      <p className="text-xs text-muted-foreground @min-[28rem]:sr-only">
                        Realistic
                      </p>
                      <p className="text-base font-semibold text-realistic">
                        {result.pd.toFixed(2)}{' '}
                        <span className="text-xs font-normal text-muted-foreground">
                          PD
                        </span>
                      </p>
                    </div>
                    <div className="text-right tabular-nums">
                      <p className="text-xs text-muted-foreground @min-[28rem]:sr-only">
                        Optimistic
                      </p>
                      <p className="text-base font-semibold text-optimistic-foreground">
                        {optimisticPD.toFixed(2)}{' '}
                        <span className="text-xs font-normal text-muted-foreground">
                          PD
                        </span>
                      </p>
                    </div>
                  </div>
                  <CapacityBar
                    realisticPD={result.pd}
                    optimisticPD={optimisticPD}
                    fullTimePD={fullTimePD}
                    maxPD={maxPD}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground tabular-nums">
                    <p>
                      {result.workingDays} / {fullTimePD} working days ·{' '}
                      {result.grossHours.toFixed(1)}h gross
                    </p>
                    <p>
                      {highestPD > fullTimePD
                        ? `${(highestPD - fullTimePD).toFixed(2)} PD above full time`
                        : `${gapPD.toFixed(2)} PD gap to full time`}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      {maxPD > fullTimePD && fullTimePD > 0 && (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          All bars share a scale up to {((maxPD / fullTimePD) * 100).toFixed(1)}
          %. The dashed marker is 100% full time.
        </p>
      )}
    </section>
  )
}
