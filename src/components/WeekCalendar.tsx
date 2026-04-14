import { For, type Component } from "solid-js";
import { toISO } from "../utils/dateUtils";

interface Props {
  startDate: string;
  endDate: string;
  globalBlockedDates: string[];
  onToggle: (date: string) => void;
}

const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getMondayOf(dateISO: string): Date {
  const d = new Date(dateISO + "T00:00:00");
  const dow = d.getDay(); // 0=Sun
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  return d;
}

function buildWeeks(startISO: string, endISO: string): string[][] {
  const monday = getMondayOf(startISO);
  const end = new Date(endISO + "T00:00:00");
  const weeks: string[][] = [];

  while (monday <= end) {
    const week: string[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(toISO(d));
    }
    weeks.push(week);
    monday.setDate(monday.getDate() + 7);
  }
  return weeks;
}

function weekLabel(mondayISO: string): string {
  const d = new Date(mondayISO + "T00:00:00");
  return `${MONTH_ABBR[d.getMonth()]} ${d.getDate()}`;
}

const WeekCalendar: Component<Props> = (props) => {
  const weeks = () => {
    if (!props.startDate || !props.endDate || props.startDate > props.endDate) return [];
    return buildWeeks(props.startDate, props.endDate);
  };

  const blockedSet = () => new Set(props.globalBlockedDates);

  return (
    <div class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">Timeframe</span>
        {props.globalBlockedDates.length > 0 && (
          <span class="text-xs text-red-500">
            {props.globalBlockedDates.length} blocked day
            {props.globalBlockedDates.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th class="w-14 pr-2 text-right text-gray-400 font-normal pb-1" />
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
                <th class="text-center text-gray-400 font-medium pb-1 w-10">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <For each={weeks()}>
              {(week) => {
                const label = weekLabel(week[0]);
                return (
                  <tr>
                    <td class="pr-2 text-right text-gray-400 whitespace-nowrap py-0.5">{label}</td>
                    <For each={week}>
                      {(dateISO) => {
                        const inRange = () =>
                          dateISO >= props.startDate && dateISO <= props.endDate;
                        const blocked = () => blockedSet().has(dateISO);
                        const day = () => new Date(dateISO + "T00:00:00").getDate();

                        return (
                          <td class="p-0.5 text-center">
                            <button
                              disabled={!inRange()}
                              onClick={() => props.onToggle(dateISO)}
                              class={`w-9 h-8 rounded text-xs font-medium transition-colors ${
                                !inRange()
                                  ? "text-gray-200 cursor-default"
                                  : blocked()
                                    ? "bg-red-100 text-red-600 border border-red-300 hover:bg-red-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 border border-transparent"
                              }`}
                            >
                              {day()}
                            </button>
                          </td>
                        );
                      }}
                    </For>
                  </tr>
                );
              }}
            </For>
          </tbody>
        </table>
      </div>
      {props.globalBlockedDates.length > 0 && (
        <p class="text-xs text-gray-400 mt-2">Click a red day to unblock it</p>
      )}
    </div>
  );
};

export default WeekCalendar;
