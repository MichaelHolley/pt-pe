import { createMemo, type Component } from "solid-js";
import type { TeamResult, DailyPT } from "../utils/calculator";
import BarChart from "./charts/BarChart";
import DonutChart from "./charts/DonutChart";
import CumulativeLineChart from "./charts/CumulativeLineChart";

// One distinct hue per person — shared across bar and donut so color = person identity
const PERSON_COLORS = [
  "#0d9488", // teal-600
  "#7c3aed", // violet-600
  "#d97706", // amber-600
  "#e11d48", // rose-600
  "#059669", // emerald-600
  "#ea580c", // orange-600
  "#0284c7", // sky-600
  "#9333ea", // purple-600
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
