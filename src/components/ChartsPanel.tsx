import { createMemo, type Component } from "solid-js";
import { SolidApexCharts } from "solid-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { TeamResult, DailyPT } from "../utils/calculator";

interface Props {
  realisticResult: TeamResult;
  optimisticResult: TeamResult;
  realisticCumulative: DailyPT[];
  optimisticCumulative: DailyPT[];
}

// One distinct hue per person — shared across both charts so color = person identity
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

const ChartsPanel: Component<Props> = (props) => {
  const names = createMemo(() =>
    props.realisticResult.persons.map((r) => r.person.name || "Unnamed"),
  );

  const personColors = createMemo(() =>
    props.realisticResult.persons.map((_, i) => PERSON_COLORS[i % PERSON_COLORS.length]),
  );

  // One series per person, x-axis = [Realistic, Optimistic]
  const barSeries = createMemo(() =>
    props.realisticResult.persons.map((r, i) => ({
      name: r.person.name || "Unnamed",
      data: [
        parseFloat(r.pt.toFixed(2)),
        parseFloat((props.optimisticResult.persons[i]?.pt ?? 0).toFixed(2)),
      ],
    })),
  );

  const barOptions = createMemo<ApexOptions>(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
      background: "transparent",
    },
    colors: personColors(),
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

  const donutSeries = createMemo(() =>
    props.realisticResult.persons.map((r) => parseFloat(r.pt.toFixed(2))),
  );

  const donutOptions = createMemo<ApexOptions>(() => ({
    chart: {
      type: "donut",
      toolbar: { show: false },
      fontFamily: "inherit",
      background: "transparent",
    },
    labels: names(),
    colors: personColors(),
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

  const cumulativeSeries = createMemo(() => [
    {
      name: "Realistic",
      data: props.realisticCumulative.map((d) => d.cumPT),
    },
    {
      name: "Optimistic",
      data: props.optimisticCumulative.map((d) => d.cumPT),
    },
  ]);

  const cumulativeOptions = createMemo<ApexOptions>(() => ({
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
      background: "transparent",
      animations: { enabled: false },
    },
    colors: ["#2563eb", "#93c5fd"], // blue-600 solid, blue-300 dashed
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
    <>
    <div class="grid grid-cols-2 gap-4 mt-6">
      <div class="bg-gray-50 rounded-xl border border-gray-100 p-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          PT per Person
        </p>
        <SolidApexCharts
          type="bar"
          series={barSeries()}
          options={barOptions()}
          width="100%"
          height={220}
        />
      </div>
      <div class="bg-gray-50 rounded-xl border border-gray-100 p-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Team Share (Realistic)
        </p>
        <SolidApexCharts
          type="donut"
          series={donutSeries()}
          options={donutOptions()}
          width="100%"
          height={220}
        />
      </div>
    </div>

    <div class="bg-gray-50 rounded-xl border border-gray-100 p-4 mt-4">
      <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
        Cumulative PT over Time
      </p>
      <SolidApexCharts
        type="line"
        series={cumulativeSeries()}
        options={cumulativeOptions()}
        width="100%"
        height={220}
      />
    </div>
    </>
  );
};

export default ChartsPanel;
