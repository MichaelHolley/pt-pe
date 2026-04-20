import { type Component } from "solid-js";
import type { TeamResult, DailyPT } from "../utils/calculator";
import BarChart from "./charts/BarChart";
import DonutChart from "./charts/DonutChart";
import CumulativeLineChart from "./charts/CumulativeLineChart";

interface Props {
  realisticResult: TeamResult;
  optimisticResult: TeamResult;
  realisticCumulative: DailyPT[];
  optimisticCumulative: DailyPT[];
}

const ChartsPanel: Component<Props> = (props) => {
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
          />
        </div>
        <div class="bg-gray-50 rounded-xl border border-gray-100 p-4">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Team Share (Realistic)
          </p>
          <DonutChart realisticResult={props.realisticResult} />
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
