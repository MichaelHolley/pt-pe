import { Show, type Component } from "solid-js";

interface Props {
  count: number;
  class?: string;
}

const OutOfRangeBadge: Component<Props> = (props) => (
  <Show when={props.count > 0}>
    <span
      class={`text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5${props.class ? ` ${props.class}` : ""}`}
    >
      {props.count} out of range
    </span>
  </Show>
);

export default OutOfRangeBadge;
