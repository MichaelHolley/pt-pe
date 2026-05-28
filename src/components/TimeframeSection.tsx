import { Show, type Component } from "solid-js";
import WeekCalendar from "./WeekCalendar";

interface Props {
  startDate: string;
  endDate: string;
  conservativeEnabled: boolean;
  conservativeEfficiency: number;
  realisticEfficiency: number;
  optimisticEfficiency: number;
  globalBlockedDates: string[];
  onStartDate: (v: string) => void;
  onEndDate: (v: string) => void;
  onConservativeEnabled: (v: boolean) => void;
  onConservativeEfficiency: (v: number) => void;
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
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={props.conservativeEnabled}
              onClick={() => props.onConservativeEnabled(!props.conservativeEnabled)}
              class={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${props.conservativeEnabled ? "bg-conservative" : "bg-gray-300"}`}
            >
              <span
                class={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${props.conservativeEnabled ? "translate-x-4.5" : "translate-x-0.5"}`}
              />
            </button>
            <span
              class={`text-sm font-medium ${props.conservativeEnabled ? "text-conservative" : "text-gray-400"}`}
            >
              Conservative %
            </span>
          </div>
          <Show when={props.conservativeEnabled}>
            <div class="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="100"
                value={props.conservativeEfficiency}
                onInput={(e) =>
                  props.onConservativeEfficiency(
                    Math.min(100, Math.max(1, Number(e.currentTarget.value))),
                  )
                }
                class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <span class="text-sm text-gray-500">%</span>
            </div>
          </Show>
        </div>
        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium text-gray-700">Realistic %</span>
          <div class="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="100"
              value={props.realisticEfficiency}
              onInput={(e) =>
                props.onRealisticEfficiency(
                  Math.min(100, Math.max(1, Number(e.currentTarget.value))),
                )
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
                props.onOptimisticEfficiency(
                  Math.min(100, Math.max(1, Number(e.currentTarget.value))),
                )
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
