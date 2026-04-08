import { createMemo, type Component } from "solid-js";
import { SolidApexCharts } from "solid-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { TeamResult } from "../../utils/calculator";

interface Props {
  realisticResult: TeamResult;
  optimisticResult: TeamResult;
  personColors: string[];
}

const BarChart: Component<Props> = (props) => {
  const series = createMemo(() =>
    props.realisticResult.persons.map((r, i) => ({
      name: r.person.name || "Unnamed",
      data: [
        parseFloat(r.pt.toFixed(2)),
        parseFloat((props.optimisticResult.persons[i]?.pt ?? 0).toFixed(2)),
      ],
    })),
  );

  const options = createMemo<ApexOptions>(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
      background: "transparent",
    },
    colors: props.personColors,
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 4,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(1),
      offsetY: -20,
      style: { fontSize: "11px", colors: ["#6b7280"] },
    },
    xaxis: {
      categories: ["Realistic", "Optimistic"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9ca3af", fontSize: "12px" } },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => val.toFixed(1),
        style: { colors: "#9ca3af", fontSize: "11px" },
      },
      title: { text: "PT", style: { color: "#9ca3af", fontSize: "11px" } },
    },
    grid: { borderColor: "#f3f4f6", strokeDashArray: 4 },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#6b7280" },
      markers: { size: 6 },
    },
    tooltip: { y: { formatter: (val: number) => `${val.toFixed(2)} PT` } },
  }));

  return (
    <SolidApexCharts type="bar" series={series()} options={options()} width="100%" height={220} />
  );
};

export default BarChart;
