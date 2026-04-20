import { createMemo, type Component } from "solid-js";
import { SolidApexCharts } from "solid-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { TeamResult } from "../../utils/calculator";
import { getChartColors } from "../../utils/chartColors";

interface Props {
  realisticResult: TeamResult;
}

const DonutChart: Component<Props> = (props) => {
  const names = createMemo(() =>
    props.realisticResult.persons.map((r) => r.person.name || "Unnamed"),
  );

  const series = createMemo(() =>
    props.realisticResult.persons.map((r) => parseFloat(r.pt.toFixed(2))),
  );

  const options = createMemo<ApexOptions>(() => ({
    chart: {
      type: "donut",
      toolbar: { show: false },
      fontFamily: "inherit",
      background: "transparent",
    },
    labels: names(),
    colors: getChartColors(props.realisticResult.persons.length),
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total PT",
              fontSize: "12px",
              color: "#9ca3af",
              formatter: () => props.realisticResult.totalPT.toFixed(1),
            },
            value: {
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1f2937",
              formatter: (val: string) => parseFloat(val).toFixed(1),
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      labels: { colors: "#6b7280" },
      markers: { size: 6 },
    },
    tooltip: { y: { formatter: (val: number) => `${val.toFixed(2)} PT` } },
  }));

  return (
    <SolidApexCharts type="donut" series={series()} options={options()} width="100%" height={220} />
  );
};

export default DonutChart;
