import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import { useGardens } from "@/hooks/useGardens";
import { usePeakHours } from "@/hooks/usePeakHours";
import { cn } from "@/lib/utils";

const fallbackHours = [
  { hour: "06", visitor_count: 2 },
  { hour: "08", visitor_count: 9 },
  { hour: "10", visitor_count: 5 },
  { hour: "12", visitor_count: 3 },
  { hour: "14", visitor_count: 6 },
  { hour: "16", visitor_count: 11 },
  { hour: "18", visitor_count: 15 },
  { hour: "20", visitor_count: 7 },
  { hour: "22", visitor_count: 2 },
];

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
  const { t, language, isRTL } = useLanguage();
  const isEn = language === "en";
  const { data: gardens, isLoading: gardensLoading } = useGardens();
  const firstGardenId = gardens?.[0]?.id;
  const { data: peakData } = usePeakHours(firstGardenId);

  const chartSource = peakData && peakData.length > 0 ? peakData : fallbackHours;
  const chartItems = chartSource.map((row: any) => ({
    hour: String(row.hour).padStart(2, "0"),
    count: Number(row.visitor_count || 0),
  }));
  const maxCount = Math.max(...chartItems.map((it) => it.count), 1);
  const currentHour = String(new Date().getHours()).padStart(2, "0");

  return (
    <div className="relative min-h-screen space-y-8 pb-8 md:space-y-10" dir={isRTL ? "rtl" : "ltr"}>
      {/* Single full-page background image */}
      <img
        src="/TLV VIEW background.jpg"
        alt="TLV VIEW background"
        className="pointer-events-none fixed inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,12,10,0.82),rgba(5,14,11,0.65),rgba(4,12,10,0.88))]" />

      {/* Hero content */}
      <section className="relative flex min-h-[520px] items-center px-4 pt-24 md:min-h-[620px] md:px-10 md:pt-28">
        <GlassCard intensity="light" className={cn("w-full max-w-3xl p-6 text-white md:p-10", isRTL ? "mr-auto text-right" : "ml-auto text-left")}>
          <p className="mb-3 text-sm font-semibold text-white/80 md:text-base">{t.hero.badge}</p>
          <h1 className="font-display text-4xl font-black leading-tight md:text-6xl">
            {t.hero.title1}
            <br />
            <span className="text-emerald-300">{t.hero.titleHighlight}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/85 md:text-xl">{t.hero.subtitle}</p>

          <div className={cn("mt-7 flex", isRTL ? "justify-start" : "justify-end")}>
            <button
              onClick={() => navigate("/map")}
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-lg font-black text-white shadow-[0_16px_40px_rgba(16,185,129,0.35)] transition hover:brightness-110 active:scale-95"
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
            <h2 className="font-display text-3xl font-black text-foreground md:text-4xl">{t.gardens.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">{t.gardens.subtitle}</p>
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
                  <span className="rounded-lg bg-primary/15 px-2 py-1 text-xs font-black text-primary">
                    {(garden.rating ?? 0).toFixed(1)}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <GardenStars rating={Number(garden.rating ?? 0)} />
                  <span className="text-xs text-muted-foreground">({garden.reviews_count ?? 0})</span>
                </div>
              </GlassCard>
            ))}

            {gardensLoading &&
              [1, 2, 3].map((skeleton) => (
                <GlassCard key={skeleton} intensity="light" className="h-28 animate-pulse" />
              ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/map")}
              className="rounded-2xl bg-white/10 px-6 py-3 text-sm font-bold text-foreground backdrop-blur-xl transition hover:bg-white/20"
            >
              {t.gardens.allGardens}
            </button>
          </div>
        </section>

        <section>
          <div className={cn("mb-4", isRTL ? "text-right" : "text-left")}>
            <h2 className="font-display text-2xl font-black text-foreground md:text-3xl">{t.peakHours.title}</h2>
            <p className="text-sm text-muted-foreground">{t.peakHours.subtitle}</p>
          </div>

          <GlassCard intensity="medium" className="p-4 md:p-6">
            <div className="flex h-56 items-end justify-between gap-1 border-b border-white/10 px-2 md:gap-2">
              {chartItems.map((item) => {
                const isCurrent = item.hour === currentHour;
                const height = (item.count / maxCount) * 100;
                return (
                  <div key={item.hour} className="flex flex-1 flex-col items-center justify-end">
                    <div
                      className={cn(
                        "w-full rounded-t-md transition-all",
                        isCurrent ? "bg-emerald-400" : item.count > 7 ? "bg-primary" : "bg-info/60",
                      )}
                      style={{ height: `${height}%` }}
                    />
                    <span className="mt-2 text-[10px] text-muted-foreground">{item.hour}</span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </section>
      </main>
    </div>
  );
};

export default Index;
