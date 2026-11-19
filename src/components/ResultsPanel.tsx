import { For, type Component } from "solid-js";
import type { TeamResult, DailyPD } from "../utils/calculator";
import ChartsPanel from "./ChartsPanel";
import PDStat from "./ui/PDStat";

interface Props {
  realisticResult: TeamResult;
  optimisticResult: TeamResult;
  realisticCumulative: DailyPD[];
  optimisticCumulative: DailyPD[];
}

const ResultsPanel: Component<Props> = (props) => {
  const delta = () => props.optimisticResult.totalPD - props.realisticResult.totalPD;

  return (
    <section class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500">Results</h2>
        <span class="text-xs text-gray-400">1 PD = 8 hours</span>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-6">
        <PDStat
          label="Realistic"
          value={props.realisticResult.totalPD.toFixed(2)}
          variant="realistic"
        />
        <PDStat
          label="Optimistic"
          value={props.optimisticResult.totalPD.toFixed(2)}
          variant="optimistic"
        />
        <PDStat
          label="Difference"
          value={`${delta() >= 0 ? "+" : ""}${delta().toFixed(2)}`}
          variant="neutral"
        />
      </div>

      <div class="flex flex-col gap-3">
        <For each={props.realisticResult.persons}>
          {(r, i) => {
            const opt = () => props.optimisticResult.persons[i()];
            const base = () => props.realisticResult.calendarWorkingDays;
            const pct = (v: number) => (base() > 0 ? (v / base()) * 100 : 0);
            return (
              <div class="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-gray-800">
                      {r.person.name || "Unnamed"}
                    </span>
                    <span class="text-xs text-gray-500">
                      {r.workingDays} / {base()} working days · {r.grossHours.toFixed(1)}h gross
                    </span>
                  </div>
                  <div class="flex items-baseline gap-1.5">
                    <span class="text-base font-bold text-primary">{r.pd.toFixed(2)}</span>
                    <span class="text-xs text-gray-400">–</span>
                    <span class="text-base font-bold text-secondary">{opt()?.pd.toFixed(2)}</span>
                    <span class="text-xs text-gray-400">PD</span>
                  </div>
                </div>
                <div
                  class="relative h-2 bg-gray-200 rounded-full overflow-hidden"
                  title={`Timeframe: ${base()} total working days (Mon–Fri)`}
                >
                  <div
                    class="absolute inset-y-0 left-0 bg-gray-400 rounded-full"
                    style={{ width: `${pct(r.workingDays)}%` }}
                    title={`Actual working days: ${r.workingDays} (after blocked dates)`}
                  />
                  <div
                    class="absolute inset-y-0 left-0 bg-secondary rounded-full"
                    style={{ width: `${pct(opt()?.pd ?? 0)}%` }}
                    title={`Optimistic: ${(opt()?.pd ?? 0).toFixed(2)} PD`}
                  />
                  <div
                    class="absolute inset-y-0 left-0 bg-primary rounded-full"
                    style={{ width: `${pct(r.pd)}%` }}
                    title={`Realistic: ${r.pd.toFixed(2)} PD`}
                  />
                </div>
              </div>
            );
          }}
        </For>
      </div>

      <ChartsPanel
        realisticResult={props.realisticResult}
        optimisticResult={props.optimisticResult}
        realisticCumulative={props.realisticCumulative}
        optimisticCumulative={props.optimisticCumulative}
      />
    </section>
  );
};

export default ResultsPanel;
