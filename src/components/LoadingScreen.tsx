import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

import BrandLogo from "@/components/BrandLogo";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const { t } = useLanguage();
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const closeTimer = window.setTimeout(() => setClosing(true), 1200);
    const completeTimer = window.setTimeout(() => onComplete(), 1850);

    return () => {
      window.clearTimeout(closeTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[#07110d] transition-opacity duration-700",
        closing ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.2),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(20,184,166,0.16),_transparent_30%)]" />
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="relative z-10 flex max-w-sm flex-col items-center gap-6 px-8 text-center text-white">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl">
          <div className="absolute inset-0 rounded-full border border-emerald-300/30 animate-ping" />
          <BrandLogo className="h-12 w-12" rounded />
          <Leaf className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 p-1 text-white shadow-lg" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-4xl font-black tracking-tight">{t.appName}</h1>
          <p className="text-sm text-white/70 md:text-base">{t.loadingScreen}</p>
        </div>

        <div className="h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
          <div className="glass-loader-bar h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

