import * as React from "react";

import { cn } from "@/lib/utils";

type GlassIntensity = "light" | "medium" | "strong";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: GlassIntensity;
  border?: boolean;
  glow?: boolean;
}

const intensityClasses: Record<GlassIntensity, string> = {
  light: "bg-white/8 dark:bg-white/8",
  medium: "bg-white/12 dark:bg-white/12",
  strong: "bg-white/18 dark:bg-white/18",
};

const glowClasses: Record<GlassIntensity, string> = {
  light: "shadow-[0_10px_30px_rgba(8,15,13,0.12)]",
  medium: "shadow-[0_18px_50px_rgba(8,15,13,0.18)]",
  strong: "shadow-[0_24px_64px_rgba(8,15,13,0.24)]",
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, intensity = "medium", border = true, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-[1.5rem] backdrop-blur-[var(--glass-blur)] transition-all duration-300",
          intensityClasses[intensity],
          border && "border border-white/20 dark:border-white/12",
          glow ? "shadow-[0_20px_60px_rgba(16,185,129,0.15)]" : glowClasses[intensity],
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/40 before:opacity-80",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

GlassCard.displayName = "GlassCard";

export { GlassCard };

