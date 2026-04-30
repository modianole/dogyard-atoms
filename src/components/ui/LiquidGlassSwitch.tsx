import React from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassSwitchProps {
  checked: boolean;
  onChange: () => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const LiquidGlassSwitch = ({
  checked,
  onChange,
  iconLeft,
  iconRight,
}: LiquidGlassSwitchProps) => {
  return (
    <div
      onClick={onChange}
      className={cn(
        "relative flex h-12 w-24 cursor-pointer items-center rounded-full p-1 transition-all duration-500",
        "bg-white/10 backdrop-blur-xl border border-white/20 shadow-inner",
        "dark:bg-black/20 dark:border-white/10"
      )}
    >
      {/* The "Liquid" thumb */}
      <div
        className={cn(
          "absolute h-10 w-10 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_0_20px_rgba(52,211,153,0.4)]",
          checked ? "translate-x-12 rtl:-translate-x-12" : "translate-x-0"
        )}
      />

      {/* Icons */}
      <div className="relative flex w-full items-center justify-between px-2.5 z-10 pointer-events-none">
        <div className={cn("transition-colors duration-300", !checked ? "text-white" : "text-white/40")}>
          {iconLeft}
        </div>
        <div className={cn("transition-colors duration-300", checked ? "text-white" : "text-white/40")}>
          {iconRight}
        </div>
      </div>
    </div>
  );
};
