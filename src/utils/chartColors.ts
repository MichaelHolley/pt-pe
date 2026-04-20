const CHART_COLORS = [
  "#9333ea", // purple-600
  "#c084fc", // purple-400
  "#7c3aed", // violet-600
  "#6d28d9", // violet-700
  "#a855f7", // purple-500
  "#4f46e5", // indigo-600
  "#7e22ce", // purple-700
  "#d8b4fe", // purple-300
];

export function getChartColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => CHART_COLORS[i % CHART_COLORS.length]);
}
