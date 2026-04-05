import { createSignal, For, type Component } from "solid-js";
import type { Person } from "../utils/calculator";

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
        const y = cur.getFullYear();
        const m = String(cur.getMonth() + 1).padStart(2, "0");
        const d = String(cur.getDate()).padStart(2, "0");
        dates.push(`${y}-${m}-${d}`);
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
    <div class="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
      <div class="flex items-center justify-between gap-4">
        <input
          type="text"
          value={props.person.name}
          placeholder="Name"
          onInput={(e) => update({ name: e.currentTarget.value })}
          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {props.canRemove && (
          <button
            onClick={props.onRemove}
            class="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none"
            title="Remove person"
          >
            ×
          </button>
        )}
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Hours per day
        </span>
        <div class="flex gap-3">
          <For each={WEEKDAYS}>
            {(day) => (
              <label class="flex flex-col items-center gap-1">
                <span class="text-xs text-gray-500">{day.label}</span>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={props.person.hoursPerDay[day.value as keyof typeof props.person.hoursPerDay]}
                  onInput={(e) => {
                    const hours = Math.min(24, Math.max(0, Number(e.currentTarget.value)));
                    update({ hoursPerDay: { ...props.person.hoursPerDay, [day.value]: hours } });
                  }}
                  class="border border-gray-300 rounded-lg px-2 py-2 text-sm w-14 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            )}
          </For>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Blocked dates
        </span>
        <div class="flex flex-wrap gap-2 items-center">
          <label class="flex flex-col gap-1">
            <span class="text-xs text-gray-400">From</span>
            <input
              type="date"
              value={rangeStart()}
              onInput={(e) => setRangeStart(e.currentTarget.value)}
              class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-xs text-gray-400">To</span>
            <input
              type="date"
              value={rangeEnd()}
              min={rangeStart()}
              onInput={(e) => setRangeEnd(e.currentTarget.value)}
              class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <button
            onClick={addBlockedRange}
            class="mt-5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            + Block
          </button>
        </div>
        {props.person.blockedDates.length > 0 && (
          <div class="flex flex-wrap gap-1.5 mt-1">
            <For each={props.person.blockedDates}>
              {(date) => (
                <span class="flex items-center gap-1 bg-orange-100 border border-orange-200 text-orange-700 text-xs px-2 py-1 rounded-full">
                  {date}
                  <button
                    onClick={() => removeBlockedDate(date)}
                    class="hover:text-red-600 leading-none font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
            </For>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonCard;
