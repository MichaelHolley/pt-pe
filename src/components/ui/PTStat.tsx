import type { Component } from "solid-js";

type Variant = "realistic" | "optimistic" | "neutral";

interface Props {
  label: string;
  value: string;
  variant?: Variant;
}

const VALUE_CLASSES: Record<Variant, string> = {
  realistic: "text-blue-600",
  optimistic: "text-blue-400",
  neutral: "text-gray-600",
};

const PTStat: Component<Props> = (props) => {
  return (
    <div class="flex flex-col items-center bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
      <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
        {props.label}
      </span>
      <div class="flex items-baseline gap-1">
        <span class={`text-3xl font-bold ${VALUE_CLASSES[props.variant ?? "neutral"]}`}>
          {props.value}
        </span>
        <span class="text-base font-semibold text-gray-400">PT</span>
      </div>
    </div>
  );
};

export default PTStat;
