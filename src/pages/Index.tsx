import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import { useGardens } from "@/hooks/useGardens";
import { cn } from "@/lib/utils";
import PeakHoursChart from "@/components/PeakHoursChart";

const BubblyStar = ({ className, filled = true }: { className?: string; filled?: boolean }) => (
  <Star
    className={cn(className, "filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)] transition-all duration-300")}
    style={{
      color: filled ? "#FFD700" : "#94a3b8",
      fill: filled ? "#FFD700" : "transparent",
      opacity: filled ? 1 : 0.4
    }}
    strokeWidth={filled ? 0.5 : 2}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const GardenStars = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <BubblyStar key={i} filled={i < full} className="h-4 w-4" />
      ))}
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t, language, isRTL } = useLanguage();
  const isEn = language === "en";
  const { data: gardens } = useGardens();
  const isDark = theme === "dark";

  return (
    <div className="relative space-y-8 pb-8 md:space-y-10" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero content */}
      <section className="relative flex min-h-[480px] items-center px-4 pt-12 md:min-h-[580px] md:px-10">
        <GlassCard intensity={isDark ? "medium" : "strong"} className={cn("w-full max-w-3xl p-6 md:p-10", isRTL ? "mr-auto text-right" : "ml-auto text-left")}>
          <p className={cn("mb-3 text-sm font-semibold md:text-base", isDark ? "text-emerald-400" : "text-emerald-700")}>{t.hero.badge}</p>
          <h1 className="font-display text-4xl font-black leading-tight md:text-6xl text-foreground">
            {t.hero.title1}
            <br />
            <span className="text-emerald-600 dark:text-emerald-400">{t.hero.titleHighlight}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-xl text-muted-foreground">{t.hero.subtitle}</p>

          <div className={cn("mt-7 flex", isRTL ? "justify-start" : "justify-end")}>
            <button
              onClick={() => navigate("/map")}
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-lg font-black text-white shadow-xl transition hover:brightness-110 active:scale-95"
            >
              <MapPin className="h-5 w-5" />
              {t.hero.cta}
            </button>
          </div>
        </GlassCard>
      </section>

      <main className="space-y-8 px-3 md:space-y-10 md:px-6">
        <section>
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-black md:text-5xl text-foreground mb-3">{t.gardens.title}</h2>
            <p className="mt-1 text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">{t.gardens.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {(gardens ?? []).slice(0, 6).map((garden) => (
              <GlassCard key={garden.id} intensity="medium" className="flex flex-col gap-4 p-6 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-xl font-bold text-foreground">
                      {isEn ? (garden.name_en || garden.name) : garden.name}
                    </h3>
                    <p className="truncate text-sm text-muted-foreground mt-1 opacity-70">
                      {isEn ? (garden.location_en || garden.location) : garden.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#FFD700]/30 to-[#FFD700]/10 px-3 py-1 border border-[#FFD700]/40 shadow-[0_2px_10px_rgba(255,215,0,0.2)] backdrop-blur-sm">
                    <BubblyStar className="w-4 h-4" />
                    <span className="text-sm font-black text-slate-900 dark:text-[#FFD700]">
                      {(garden.rating ?? 0).toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                  <GardenStars rating={Number(garden.rating ?? 0)} />
                  <span className="text-xs font-bold opacity-40 text-muted-foreground">({garden.reviews_count ?? 0} reviews)</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Peak Hours Section */}
        <PeakHoursChart />
      </main>
    </div>
  );
};

export default Index;
