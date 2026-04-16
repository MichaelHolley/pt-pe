import type { Component } from "solid-js";

interface Props {
  name: string;
}

const Avatar: Component<Props> = (props) => {
  return (
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
      <span class="text-sm font-bold text-blue-500 select-none uppercase">
        {props.name?.[0] || "?"}
      </span>
    </div>
  );
};

export default Avatar;
