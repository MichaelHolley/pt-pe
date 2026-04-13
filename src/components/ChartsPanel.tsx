import { createMemo, type Component } from "solid-js";
import type { TeamResult, DailyPT } from "../utils/calculator";
import BarChart from "./charts/BarChart";
import DonutChart from "./charts/DonutChart";
import CumulativeLineChart from "./charts/CumulativeLineChart";

// One distinct purple variant per person — shared across bar and donut so color = person identity
const PERSON_COLORS = [
  "#9333ea", // purple-600
  "#c084fc", // purple-400
  "#7c3aed", // violet-600
  "#6d28d9", // violet-700
  "#a855f7", // purple-500
  "#4f46e5", // indigo-600
  "#7e22ce", // purple-700
  "#d8b4fe", // purple-300
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
