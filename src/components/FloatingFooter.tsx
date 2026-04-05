import type { Component } from "solid-js";

interface Props {
  realisticPT: number;
  optimisticPT: number;
  visible: boolean;
  onScrollToResults: () => void;
}

const FloatingFooter: Component<Props> = (props) => {
  return (
    <div
      class={`fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 pointer-events-none transition-all duration-200 ${
        props.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div
        onClick={props.onScrollToResults}
        class="bg-gray-900 text-white rounded-full px-6 py-3 shadow-xl flex items-center gap-3 pointer-events-auto cursor-pointer hover:bg-gray-800 transition-colors"
      >
        <div class="flex flex-col items-center">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-500 leading-none mb-0.5">Realistic</span>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-blue-400">{props.realisticPT.toFixed(2)}</span>
            <span class="text-sm font-medium text-gray-400">PT</span>
          </div>
        </div>
        <span class="text-gray-600 font-medium">–</span>
        <div class="flex flex-col items-center">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-500 leading-none mb-0.5">Optimistic</span>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-green-400">{props.optimisticPT.toFixed(2)}</span>
            <span class="text-sm font-medium text-gray-400">PT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingFooter;
