import type { JSX, Component } from "solid-js";

type Color = "blue" | "amber";

interface Props {
  children: JSX.Element;
  color?: Color;
  class?: string;
}

const COLOR_CLASSES: Record<Color, string> = {
  blue: "text-blue-500 bg-blue-50",
  amber: "border border-amber-200 text-amber-700 bg-amber-50",
};

const Badge: Component<Props> = (props) => {
  return (
    <span
      class={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${COLOR_CLASSES[props.color ?? "blue"]}${props.class ? ` ${props.class}` : ""}`}
    >
      {props.children}
    </span>
  );
};

export default Badge;
