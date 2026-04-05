import type { Component } from "solid-js";
import WeekCalendar from "./WeekCalendar";

interface Props {
  startDate: string;
  endDate: string;
  realisticEfficiency: number;
  optimisticEfficiency: number;
  globalBlockedDates: string[];
  onStartDate: (v: string) => void;
  onEndDate: (v: string) => void;
  onRealisticEfficiency: (v: number) => void;
  onOptimisticEfficiency: (v: number) => void;
  onToggleBlockedDate: (date: string) => void;
}

const TimeframeSection: Component<Props> = (props) => {
  return (
    <section class="bg-white rounded-xl border border-gray-200 p-6">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Timeframe</h2>
      <div class="flex flex-wrap gap-4 items-end">
        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium text-gray-700">Start date</span>
          <input
            type="date"
            value={props.startDate}
            onInput={(e) => props.onStartDate(e.currentTarget.value)}
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium text-gray-700">End date</span>
          <input
            type="date"
            value={props.endDate}
            onInput={(e) => props.onEndDate(e.currentTarget.value)}
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium text-gray-700">Realistic %</span>
          <div class="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="100"
              value={props.realisticEfficiency}
              onInput={(e) =>
                props.onRealisticEfficiency(Math.min(100, Math.max(1, Number(e.currentTarget.value))))
              }
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-500">%</span>
          </div>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium text-gray-700">Optimistic %</span>
          <div class="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="100"
              value={props.optimisticEfficiency}
              onInput={(e) =>
                props.onOptimisticEfficiency(Math.min(100, Math.max(1, Number(e.currentTarget.value))))
              }
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-500">%</span>
          </div>
        </label>
      </div>
      <WeekCalendar
        startDate={props.startDate}
        endDate={props.endDate}
        globalBlockedDates={props.globalBlockedDates}
        onToggle={props.onToggleBlockedDate}
      />
    </section>
  );
};

export default TimeframeSection;
