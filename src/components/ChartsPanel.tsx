import { createMemo, type Component } from "solid-js";
import type { TeamResult, DailyPT } from "../utils/calculator";
import BarChart from "./charts/BarChart";
import DonutChart from "./charts/DonutChart";
import CumulativeLineChart from "./charts/CumulativeLineChart";

// One distinct hue per person — shared across bar and donut so color = person identity
const PERSON_COLORS = [
  "#14b8a6", // teal-500
  "#f59e0b", // amber-500
  "#ec4899", // pink-500
  "#10b981", // emerald-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
  "#6366f1", // indigo-500
];

interface Props {
  realisticResult: TeamResult;
  optimisticResult: TeamResult;
  realisticCumulative: DailyPT[];
  optimisticCumulative: DailyPT[];
}

const ChartsPanel: Component<Props> = (props) => {
  const personColors = createMemo(() =>
    props.realisticResult.persons.map((_, i) => PERSON_COLORS[i % PERSON_COLORS.length]),
  );

  return (
    <>
      <div class="grid grid-cols-2 gap-4 mt-6">
        <div class="bg-gray-50 rounded-xl border border-gray-100 p-4">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            PT per Person
          </p>
          <BarChart
            realisticResult={props.realisticResult}
            optimisticResult={props.optimisticResult}
            personColors={personColors()}
          />
        </div>
        <div class="bg-gray-50 rounded-xl border border-gray-100 p-4">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Team Share (Realistic)
          </p>
          <DonutChart realisticResult={props.realisticResult} personColors={personColors()} />
        </div>
      </div>

      <div class="bg-gray-50 rounded-xl border border-gray-100 p-4 mt-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Cumulative PT over Time
        </p>
        <CumulativeLineChart
          realisticCumulative={props.realisticCumulative}
          optimisticCumulative={props.optimisticCumulative}
        />
      </div>
    </>
  );
};

export default ChartsPanel;
