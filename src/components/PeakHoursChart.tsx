import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePeakHours } from "@/hooks/usePeakHours";
import { useGardens } from "@/hooks/useGardens";
import { useMemo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

const fallbackHours = [
  { hour: 0, count: 5 }, { hour: 1, count: 2 }, { hour: 2, count: 1 },
  { hour: 3, count: 1 }, { hour: 4, count: 2 }, { hour: 5, count: 8 },
  { hour: 6, count: 22 }, { hour: 7, count: 45 }, { hour: 8, count: 55 },
  { hour: 9, count: 30 }, { hour: 10, count: 18 }, { hour: 11, count: 12 },
  { hour: 12, count: 10 }, { hour: 13, count: 10 }, { hour: 14, count: 15 },
  { hour: 15, count: 25 }, { hour: 16, count: 40 }, { hour: 17, count: 50 },
  { hour: 18, count: 65 }, { hour: 19, count: 55 }, { hour: 20, count: 35 },
  { hour: 21, count: 22 }, { hour: 22, count: 12 }, { hour: 23, count: 8 }
];

const PeakHoursChart = () => {
  const [showTime, setShowTime] = useState(false);
  const { t, isRTL } = useLanguage();
  const { data: gardens } = useGardens();

  const now = new Date();
  const currentHour = now.getHours();
  const currentTimeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  const firstGardenId = gardens?.[0]?.id;
  const { data: peakData } = usePeakHours(firstGardenId);

  const hours = useMemo(() => {
    const raw = (!peakData || peakData.length === 0)
      ? fallbackHours
      : peakData.map(p => ({ hour: p.hour, count: p.visitor_count }));

    return Array.from({ length: 24 }, (_, i) => {
      const found = raw.find(r => Number(r.hour) === i);
      return { hour: i, count: found ? found.count : 0 };
    });
  }, [peakData]);

  const maxCount = Math.max(...hours.map(h => h.count), 1);

  return (
    <section className="py-12 px-4 bg-transparent select-none" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto">
        <GlassCard intensity="medium" className="p-6 md:p-10 border-white/10 shadow-2xl overflow-visible">
          {/* Header */}
          <div className={`mb-10 border-b border-white/10 pb-4 ${isRTL ? "text-right" : "text-left"}`}>
            <h2 className="text-4xl font-black text-white mb-1 tracking-tight">{t.peakHours.title}</h2>
            <p className="text-sm text-white/40">{t.peakHours.subtitle}</p>
          </div>

          <div className="relative h-80 w-full pt-10">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-12">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full border-t border-white/5" />
              ))}
            </div>

            {/* Bars Area */}
            <div className="relative h-full flex items-end justify-between gap-1 md:gap-2 pb-12">
              {hours.map((h, i) => {
                const isCurrent = h.hour === currentHour;
                // Moderated height factor (0.8)
                const totalHeight = (h.count / maxCount) * 100 * 0.8;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center h-full group relative justify-end">

                    {/* NOW Indicator - Interactive & localized */}
                    {isCurrent && (
                      <div className="absolute inset-0 flex flex-col items-center pointer-events-none z-30 -top-12">
                        <button
                          onClick={() => setShowTime(!showTime)}
                          className="bg-emerald-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full mb-1 animate-bounce uppercase shadow-lg active:scale-95 transition-all pointer-events-auto hover:brightness-110 border-none ring-1 ring-emerald-400/30"
                        >
                          {showTime ? currentTimeString : t.peakHours.now}
                        </button>
                        <div className="flex-1 w-[1.5px] border-l-[1.5px] border-dashed border-emerald-500/50" />
                      </div>
                    )}

                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-[10px] font-black px-3 py-1.5 rounded shadow-2xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 whitespace-nowrap scale-90 group-hover:scale-100 origin-bottom">
                      {h.count} {t.peakHours.dogs}
                    </div>

                    <div
                      className={`w-full max-w-[24px] flex flex-col justify-end transition-all duration-500 rounded-t-[1px]
                        ${isCurrent ? "scale-x-110 ring-1 ring-emerald-500/20" : ""}`}
                      style={{ height: `${Math.max(totalHeight, 3)}%` }}
                    >
                      <div className={`w-full ${isCurrent ? 'bg-emerald-400/90' : 'bg-[#38bdf8]/75'} rounded-t-sm`} style={{ height: '35%' }} />
                      <div className={`w-full ${isCurrent ? 'bg-emerald-500/90' : 'bg-[#2dd4bf]/75'} ${totalHeight < 5 ? 'rounded-b-sm' : ''}`} style={{ height: '65%' }} />

                      {isCurrent && (
                        <div className="absolute -bottom-1.5 w-full h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse" />
                      )}
                    </div>

                    <div className="absolute -bottom-8 w-full text-center">
                      <span className={`text-[10px] md:text-[11px] font-bold transition-colors
                        ${isCurrent ? "text-emerald-400 scale-150 font-black" : "text-white/20"}
                        ${h.hour % 4 === 0 || isCurrent ? "opacity-100" : "opacity-0"}`}>
                        {String(h.hour).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend - Localized */}
          <div className={`flex justify-center gap-8 mt-10 pt-6 border-t border-white/5 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#2dd4bf]/60 rounded-sm" />
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{t.peakHours.normal}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#38bdf8]/60 rounded-sm" />
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{t.peakHours.peakLabel}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default PeakHoursChart;
