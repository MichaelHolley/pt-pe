import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Github, Plus } from 'lucide-react'
import { PersonCard } from '#/components/PersonCard'
import { ResultsPanel } from '#/components/ResultsPanel'
import { SectionTitle } from '#/components/SectionTitle'
import { TimeframeSection } from '#/components/TimeframeSection'
import { Button } from '#/components/ui/button'
import { calcTeamResultWithCumulative } from '#/lib/calculator'
import { addPerson, usePlanner } from '#/lib/store'

// State lives in localStorage, so rendering on the server would only produce a hydration mismatch.
export const Route = createFileRoute('/')({ ssr: false, component: Planner })

function Planner() {
  const {
    persons,
    startDate,
    endDate,
    realisticEfficiency,
    optimisticEfficiency,
    globalBlockedDates,
  } = usePlanner()

  const realistic = useMemo(
    () =>
      calcTeamResultWithCumulative(
        persons,
        startDate,
        endDate,
        realisticEfficiency,
        globalBlockedDates,
      ),
    [persons, startDate, endDate, realisticEfficiency, globalBlockedDates],
  )
  const optimistic = useMemo(
    () =>
      calcTeamResultWithCumulative(
        persons,
        startDate,
        endDate,
        optimisticEfficiency,
        globalBlockedDates,
      ),
    [persons, startDate, endDate, optimisticEfficiency, globalBlockedDates],
  )

  return (
    <div className="flex flex-col bg-muted/40 md:h-screen md:flex-row">
      <div className="flex flex-col gap-6 border-b px-6 py-8 md:h-screen md:w-[512px] md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">PT Planner</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Estimate achievable person-days for your team
            </p>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/MichaelHolley/pt-pe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github className="size-5" />
            </a>
          </Button>
        </header>

        <TimeframeSection />

        <section className="flex flex-col gap-3">
          <SectionTitle>Team</SectionTitle>
          {persons.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
          <Button
            variant="outline"
            onClick={addPerson}
            className="h-12 border-2 border-dashed text-muted-foreground hover:border-blue-300 hover:bg-blue-50/40 hover:text-blue-500"
          >
            <Plus /> Add Person
          </Button>
        </section>
      </div>

      <div className="min-w-0 flex-1 px-6 py-8 md:h-screen md:overflow-y-auto">
        <ResultsPanel
          realisticResult={realistic.teamResult}
          optimisticResult={optimistic.teamResult}
          realisticCumulative={realistic.cumulative}
          optimisticCumulative={optimistic.cumulative}
        />
      </div>
    </div>
  )
}
