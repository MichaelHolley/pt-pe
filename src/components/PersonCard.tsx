import { For, type Component } from "solid-js";
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
  const update = (patch: Partial<Person>) => props.onUpdate({ ...props.person, ...patch });

  const toggleWeekday = (day: number) => {
    const current = props.person.blockedWeekdays;
    const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
    update({ blockedWeekdays: next });
  };

  const addBlockedDate = (date: string) => {
    if (!date || props.person.blockedDates.includes(date)) return;
    update({ blockedDates: [...props.person.blockedDates, date].sort() });
  };

  const removeBlockedDate = (date: string) => {
    update({ blockedDates: props.person.blockedDates.filter((d) => d !== date) });
  };

  let dateInputRef: HTMLInputElement | undefined;

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
        <label class="flex items-center gap-2 shrink-0">
          <span class="text-sm text-gray-600">h/week</span>
          <input
            type="number"
            min="1"
            max="80"
            value={props.person.hoursPerWeek}
            onInput={(e) => update({ hoursPerWeek: Math.max(1, Number(e.currentTarget.value)) })}
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
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
          Blocked weekdays
        </span>
        <div class="flex gap-2">
          <For each={WEEKDAYS}>
            {(day) => {
              const active = () => props.person.blockedWeekdays.includes(day.value);
              return (
                <button
                  onClick={() => toggleWeekday(day.value)}
                  class={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    active()
                      ? "bg-red-100 border-red-300 text-red-700"
                      : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {day.label}
                </button>
              );
            }}
          </For>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Blocked dates
        </span>
        <div class="flex gap-2 items-center">
          <input
            ref={dateInputRef}
            type="date"
            class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              if (dateInputRef?.value) {
                addBlockedDate(dateInputRef.value);
                dateInputRef.value = "";
              }
            }}
            class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            + Add
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
