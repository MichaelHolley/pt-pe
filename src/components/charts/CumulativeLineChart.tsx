import { createMemo, type Component } from "solid-js";
import { SolidApexCharts } from "solid-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { DailyPT } from "../../utils/calculator";

interface Props {
  realisticCumulative: DailyPT[];
  optimisticCumulative: DailyPT[];
}

const CumulativeLineChart: Component<Props> = (props) => {
  const series = createMemo(() => [
    {
      name: "Realistic",
      data: props.realisticCumulative.map((d) => d.cumPT),
    },
    {
      name: "Optimistic",
      data: props.optimisticCumulative.map((d) => d.cumPT),
    },
  ]);

  const options = createMemo<ApexOptions>(() => ({
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
      background: "transparent",
      animations: { enabled: false },
    },
    colors: ["#9333ea", "#d8b4fe"], // purple-600 solid, purple-300 dashed
    stroke: {
      width: [2, 2],
      dashArray: [0, 6],
      curve: "stepline",
    },
    xaxis: {
      categories: props.realisticCumulative.map((d) => d.date),
      tickAmount: 8,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9ca3af", fontSize: "11px" } },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => val.toFixed(1),
        style: { colors: "#9ca3af", fontSize: "11px" },
      },
      title: { text: "Cumulative PT", style: { color: "#9ca3af", fontSize: "11px" } },
    },
    grid: { borderColor: "#f3f4f6", strokeDashArray: 4 },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#6b7280" },
      markers: { size: 6 },
    },
    tooltip: {
      shared: true,
      y: { formatter: (val: number) => `${val.toFixed(2)} PT` },
    },
    markers: { size: 0 },
  }));

  return (
    <SolidApexCharts type="line" series={series()} options={options()} width="100%" height={220} />
  );
};

export default CumulativeLineChart;
