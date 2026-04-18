import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
  border?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className = '',
  intensity = 'medium',
  border = true,
  glow = false
}: GlassCardProps) {
  const intensityClasses = {
    light: 'bg-white/8',
    medium: 'bg-white/12',
    strong: 'bg-white/18'
  };

  return (
    <div
      className={`
        ${intensityClasses[intensity]}
        backdrop-blur-2xl
        rounded-[1.25rem]
        ${border ? 'border border-white/25' : ''}
        ${glow ? 'shadow-[0_8px_32px_rgba(16,185,129,0.15)]' : 'shadow-[0_8px_32px_rgba(0,0,0,0.1)]'}
        transition-all duration-500
        ${className}
      `}
      style={{
        boxShadow: glow
          ? '0 8px 32px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
      }}
    >
      {children}
    </div>
  );
}
