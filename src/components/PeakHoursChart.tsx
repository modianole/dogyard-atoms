import { BarChart3 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePeakHours } from "@/hooks/usePeakHours";
import { useGardens } from "@/hooks/useGardens";
import { useMemo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

const fallbackHours = [
  { hour: "06", visitor_count: 2 }, { hour: "07", visitor_count: 5 },
  { hour: "08", visitor_count: 11 }, { hour: "09", visitor_count: 6 },
  { hour: "10", visitor_count: 4 }, { hour: "11", visitor_count: 3 },
  { hour: "12", visitor_count: 2 }, { hour: "13", visitor_count: 2 },
  { hour: "14", visitor_count: 3 }, { hour: "15", visitor_count: 5 },
  { hour: "16", visitor_count: 11 }, { hour: "17", visitor_count: 12 },
  { hour: "18", visitor_count: 15 }, { hour: "19", visitor_count: 10 },
  { hour: "20", visitor_count: 6 }, { hour: "21", visitor_count: 4 },
  { hour: "22", visitor_count: 2 },
];

const PeakHoursChart = () => {
  const currentHour = new Date().getHours();
  const { t, isRTL } = useLanguage();
  const { data: gardens } = useGardens();
  const firstGardenId = gardens?.[0]?.id;
  const { data: peakData } = usePeakHours(firstGardenId);

  const hours = useMemo(() => {
    const data = (!peakData || peakData.length === 0) ? fallbackHours : peakData;
    return data.map(ph => ({
      hour: String(ph.hour).padStart(2, "0"),
      count: Number(ph.visitor_count || 0),
    }));
  }, [peakData]);

  const maxCount = useMemo(() => Math.max(...hours.map(h => h.count), 1), [hours]);

  return (
    <section id="peak-hours" className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute w-[350px] h-[350px] rounded-full opacity-[0.05] blur-[120px] bottom-0 left-0" style={{ background: 'hsl(210, 80%, 55%)' }} />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={isRTL ? "text-right" : "text-left"}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">📊</span>
                <h2 className="text-2xl md:text-3xl font-display font-black text-foreground">{t.peakHours.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{t.peakHours.subtitle}</p>
            </div>
            <div className="hidden md:flex w-12 h-12 rounded-2xl bg-primary/15 items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
          </div>

          <GlassCard intensity="medium" className="rounded-2xl p-6 animate-in fade-in zoom-in-95 duration-700">
            {/* Custom Bar Chart using Tailwind */}
            <div className="h-64 flex items-end justify-between gap-1 md:gap-2 px-2 border-b border-border/50">
              {hours.map((h, i) => {
                const isCurrent = h.hour === String(currentHour).padStart(2, "0");
                const height = (h.count / maxCount) * 100;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                      {h.count} {t.peakHours.dogs} ({h.hour}:00)
                    </div>

                    {/* The Bar */}
                    <div
                      className={`w-full rounded-t-sm md:rounded-t-md transition-all duration-500 delay-[${i * 30}ms]
                        ${isCurrent ? "bg-accent animate-pulse" : (h.count > 7 ? "bg-primary" : "bg-info/60")}
                        group-hover:brightness-110 shadow-sm`}
                      style={{ height: `${height}%` }}
                    />

                    {/* Hour Label */}
                    <span className="text-[9px] md:text-[10px] text-muted-foreground mt-2 rotate-45 md:rotate-0 origin-left">
                      {h.hour}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-muted-foreground">{t.peakHours.now}</span>
              </div>
              <div className={isRTL ? "flex-row-reverse flex items-center gap-2" : "flex items-center gap-2"}>
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">{t.peakHours.peakLabel}</span>
              </div>
              <div className={isRTL ? "flex-row-reverse flex items-center gap-2" : "flex items-center gap-2"}>
                <div className="w-3 h-3 rounded-full bg-info/60" />
                <span className="text-xs text-muted-foreground">{t.peakHours.normal}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default PeakHoursChart;
