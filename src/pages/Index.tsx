import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import { useGardens } from "@/hooks/useGardens";
import { cn } from "@/lib/utils";

const GardenStars = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < full ? "fill-warning text-warning" : "fill-muted text-muted",
          )}
        />
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
          <div className="mb-6 text-center">
            <h2 className="font-display text-3xl font-black md:text-4xl text-foreground">{t.gardens.title}</h2>
            <p className="mt-1 text-sm md:text-base text-muted-foreground">{t.gardens.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(gardens ?? []).slice(0, 6).map((garden) => (
              <GlassCard key={garden.id} intensity="medium" className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-lg font-bold text-foreground">
                      {isEn ? (garden.name_en || garden.name) : garden.name}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground">
                      {isEn ? (garden.location_en || garden.location) : garden.location}
                    </p>
                  </div>
                  <span className="rounded-lg bg-emerald-500/20 px-2 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {(garden.rating ?? 0).toFixed(1)}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <GardenStars rating={Number(garden.rating ?? 0)} />
                  <span className="text-xs opacity-60 text-muted-foreground">({garden.reviews_count ?? 0})</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
