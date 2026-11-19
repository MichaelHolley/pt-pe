import { Show, type Component } from "solid-js";

interface Props {
  count: number;
  onClear?: () => void;
  class?: string;
}

const OutOfRangeBadge: Component<Props> = (props) => (
  <Show when={props.count > 0}>
    <span
      class={`inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5${props.class ? ` ${props.class}` : ""}`}
    >
      {props.count} out of range
      <Show when={props.onClear}>
        <button
          type="button"
          onClick={() => props.onClear?.()}
          class="underline hover:text-orange-700 transition-colors"
        >
          Clear
        </button>
      </Show>
    </span>
  </Show>
);

export default OutOfRangeBadge;
