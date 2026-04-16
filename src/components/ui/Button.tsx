import type { JSX, Component } from "solid-js";

type Variant = "primary" | "ghost" | "danger";

interface Props {
  onClick?: () => void;
  children: JSX.Element;
  variant?: Variant;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  class?: string;
  title?: string;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed",
  ghost:
    "flex items-center justify-center rounded-full text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed",
  danger:
    "flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed",
};

const Button: Component<Props> = (props) => {
  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.title}
      class={`${VARIANT_CLASSES[props.variant ?? "primary"]}${props.class ? ` ${props.class}` : ""}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
