import type { Component } from "solid-js";

interface Props {
  totalPT: number;
  visible: boolean;
}

const FloatingFooter: Component<Props> = (props) => {
  return (
    <div
      class={`fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 pointer-events-none transition-all duration-200 ${
        props.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div class="bg-gray-900 text-white rounded-full px-6 py-3 shadow-xl flex items-baseline gap-2 pointer-events-auto">
        <span class="text-2xl font-bold text-blue-400">{props.totalPT.toFixed(2)}</span>
        <span class="text-base font-medium text-gray-300">PT achievable</span>
      </div>
    </div>
  );
};

export default FloatingFooter;
