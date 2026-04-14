import { createSignal, For, type Component } from "solid-js";
import type { Person } from "../utils/calculator";
import { toISO } from "../utils/dateUtils";

const WEEKDAYS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
];

interface Props {
  person: Person;
  onUpdate: (updated: Person) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const PersonCard: Component<Props> = (props) => {
  const [rangeStart, setRangeStart] = createSignal("");
  const [rangeEnd, setRangeEnd] = createSignal("");

  const update = (patch: Partial<Person>) => props.onUpdate({ ...props.person, ...patch });

  const addBlockedRange = () => {
    const from = rangeStart();
    if (!from) return;
    const to = rangeEnd() || from;
    const dates: string[] = [];
    const cur = new Date(from + "T00:00:00");
    const last = new Date(to + "T00:00:00");
    while (cur <= last) {
      const dow = cur.getDay();
      if (dow >= 1 && dow <= 5) {
        dates.push(toISO(cur));
      }
      cur.setDate(cur.getDate() + 1);
    }
    const next = [...new Set([...props.person.blockedDates, ...dates])].sort();
    update({ blockedDates: next });
    setRangeStart("");
    setRangeEnd("");
  };

  const removeBlockedDate = (date: string) => {
    update({
      blockedDates: props.person.blockedDates.filter((d) => d !== date),
    });
  };

  return (
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Card header */}
      <div class="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span class="text-sm font-bold text-blue-500 select-none uppercase">
            {props.person.name?.[0] || "?"}
          </span>
        </div>
        <input
          type="text"
          value={props.person.name}
          placeholder="Name"
          onInput={(e) => update({ name: e.currentTarget.value })}
          class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-800 placeholder-gray-300 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        />
        {props.canRemove && (
          <button
            onClick={props.onRemove}
            class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
            title="Remove person"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div class="px-6 py-5 flex flex-col gap-5">
        {/* Hours per day */}
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Hours per day
            </span>
            <span class="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
              {Object.values(props.person.hoursPerDay).reduce((a, b) => a + b, 0)}h / week
            </span>
          </div>
          <div class="flex gap-2">
            <For each={WEEKDAYS}>
              {(day) => (
                <div class="flex-1 flex flex-col items-center gap-1.5 bg-gray-50 rounded-xl px-1 py-2.5 border border-gray-100">
                  <span class="text-[11px] font-medium text-gray-400">{day.label}</span>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={
                      props.person.hoursPerDay[day.value as keyof typeof props.person.hoursPerDay]
                    }
                    onInput={(e) => {
                      const hours = Math.min(24, Math.max(0, Number(e.currentTarget.value)));
                      update({ hoursPerDay: { ...props.person.hoursPerDay, [day.value]: hours } });
                    }}
                    class="w-full text-center text-sm font-semibold text-gray-700 bg-transparent border-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              )}
            </For>
          </div>
        </div>

        {/* Blocked dates */}
        <div class="flex flex-col gap-3">
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Blocked dates
          </span>
          <div class="flex items-end gap-2">
            <label class="flex flex-col gap-1 flex-1">
              <span class="text-[11px] font-medium text-gray-400">From</span>
              <input
                type="date"
                value={rangeStart()}
                onInput={(e) => setRangeStart(e.currentTarget.value)}
                class="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all w-full"
              />
            </label>
            <label class="flex flex-col gap-1 flex-1">
              <span class="text-[11px] font-medium text-gray-400">To</span>
              <input
                type="date"
                value={rangeEnd()}
                min={rangeStart()}
                onInput={(e) => setRangeEnd(e.currentTarget.value)}
                class="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all w-full"
              />
            </label>
            <button
              onClick={addBlockedRange}
              class="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              Block
            </button>
          </div>
          {props.person.blockedDates.length > 0 && (
            <div class="flex flex-wrap gap-1.5">
              <For each={props.person.blockedDates}>
                {(date) => (
                  <span class="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-2.5 py-1 rounded-full font-medium">
                    {date}
                    <button
                      onClick={() => removeBlockedDate(date)}
                      class="hover:text-red-500 transition-colors leading-none ml-0.5"
                      aria-label={`Remove ${date}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </For>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
