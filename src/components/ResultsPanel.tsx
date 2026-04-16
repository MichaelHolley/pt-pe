import { For, type Component } from "solid-js";
import type { TeamResult, DailyPT } from "../utils/calculator";
import ChartsPanel from "./ChartsPanel";
import PTStat from "./ui/PTStat";

interface Props {
  realisticResult: TeamResult;
  optimisticResult: TeamResult;
  realisticCumulative: DailyPT[];
  optimisticCumulative: DailyPT[];
}

const ResultsPanel: Component<Props> = (props) => {
  const delta = () => props.optimisticResult.totalPT - props.realisticResult.totalPT;

  return (
    <section class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500">Results</h2>
        <span class="text-xs text-gray-400">1 PT = 8 hours</span>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-6">
        <PTStat
          label="Realistic"
          value={props.realisticResult.totalPT.toFixed(2)}
          variant="realistic"
        />
        <PTStat
          label="Optimistic"
          value={props.optimisticResult.totalPT.toFixed(2)}
          variant="optimistic"
        />
        <PTStat
          label="Difference"
          value={`${delta() >= 0 ? "+" : ""}${delta().toFixed(2)}`}
          variant="neutral"
        />
      </div>

      <div class="flex flex-col gap-3">
        <For each={props.realisticResult.persons}>
          {(r, i) => {
            const opt = () => props.optimisticResult.persons[i()];
            return (
              <div class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-gray-800">
                    {r.person.name || "Unnamed"}
                  </span>
                  <span class="text-xs text-gray-500">
                    {r.workingDays} working days · {r.grossHours.toFixed(1)}h gross
                  </span>
                </div>
                <div class="flex items-baseline gap-3">
                  <div class="flex items-baseline gap-1">
                    <span class="text-lg font-bold text-blue-600">{r.pt.toFixed(2)}</span>
                    <span class="text-xs text-gray-400">PT</span>
                  </div>
                  <span class="text-gray-300">–</span>
                  <div class="flex items-baseline gap-1">
                    <span class="text-lg font-bold text-blue-400">{opt()?.pt.toFixed(2)}</span>
                    <span class="text-xs text-gray-400">PT</span>
                  </div>
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
