import * as React from "react";
import { cn } from "@/lib/utils";

type GlassIntensity = "light" | "medium" | "strong";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: GlassIntensity;
  border?: boolean;
  glow?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, intensity = "medium", border = true, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-surface relative overflow-hidden rounded-[1.5rem] transition-all duration-300",
          glow && "shadow-[0_20px_60px_rgba(16,185,129,0.2)]",
          !border && "border-none",
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
