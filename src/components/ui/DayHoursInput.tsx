import type { Component } from "solid-js";

interface Props {
  label: string;
  value: number;
  onInput: (hours: number) => void;
}

const DayHoursInput: Component<Props> = (props) => {
  return (
    <div class="flex-1 flex flex-col items-center gap-1.5 bg-gray-50 rounded-xl px-1 py-2.5 border border-gray-100">
      <span class="text-[11px] font-medium text-gray-400">{props.label}</span>
      <input
        type="number"
        min="0"
        max="24"
        value={props.value}
        onInput={(e) => {
          const hours = Math.min(24, Math.max(0, Number(e.currentTarget.value)));
          props.onInput(hours);
        }}
        class="w-full text-center text-sm font-semibold text-gray-700 bg-transparent border-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
};

export default DayHoursInput;
