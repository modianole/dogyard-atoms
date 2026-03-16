import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { BarChart3 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePeakHours } from "@/hooks/usePeakHours";
import { useGardens } from "@/hooks/useGardens";
import { useMemo } from "react";
import { motion } from "framer-motion";

const fallbackHours = [
  { hour: "06", normal: 2, peak: 0 }, { hour: "07", normal: 5, peak: 0 },
  { hour: "08", normal: 8, peak: 3 }, { hour: "09", normal: 6, peak: 0 },
  { hour: "10", normal: 4, peak: 0 }, { hour: "11", normal: 3, peak: 0 },
  { hour: "12", normal: 2, peak: 0 }, { hour: "13", normal: 2, peak: 0 },
  { hour: "14", normal: 3, peak: 0 }, { hour: "15", normal: 5, peak: 0 },
  { hour: "16", normal: 7, peak: 4 }, { hour: "17", normal: 0, peak: 12 },
  { hour: "18", normal: 0, peak: 15 }, { hour: "19", normal: 0, peak: 10 },
  { hour: "20", normal: 6, peak: 0 }, { hour: "21", normal: 4, peak: 0 },
  { hour: "22", normal: 2, peak: 0 },
];

const PeakHoursChart = () => {
  const currentHour = new Date().getHours();
  const { t, isRTL } = useLanguage();
  const { data: gardens } = useGardens();
  const firstGardenId = gardens?.[0]?.id;
  const { data: peakData } = usePeakHours(firstGardenId);

  const hours = useMemo(() => {
    if (!peakData || peakData.length === 0) return fallbackHours;
    return peakData.map(ph => ({
      hour: String(ph.hour).padStart(2, "0"),
      normal: ph.visitor_count <= 7 ? ph.visitor_count : 0,
      peak: ph.visitor_count > 7 ? ph.visitor_count : 0,
    }));
  }, [peakData]);

  return (
    <section id="peak-hours" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute w-[350px] h-[350px] rounded-full opacity-[0.05] blur-[120px] bottom-0 left-0" style={{ background: 'hsl(210, 80%, 55%)' }} />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 border-gradient"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={hours} barCategoryGap="20%">
                <XAxis dataKey="hour" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} reversed={isRTL} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "hsl(220, 20%, 8%)", border: "1px solid hsl(220, 15%, 16%)", borderRadius: "12px", fontSize: "12px", direction: isRTL ? "rtl" : "ltr", boxShadow: "0 0 20px hsla(24, 95%, 53%, 0.2)" }}
                  formatter={(value: number) => [`${value} ${t.peakHours.dogs}`, ""]}
                  labelFormatter={(label) => `${t.peakHours.hour} ${label}:00`}
                />
                <Bar dataKey="normal" stackId="a" radius={[0, 0, 0, 0]} fill="hsl(210, 80%, 55%)" />
                <Bar dataKey="peak" stackId="a" radius={[6, 6, 0, 0]}>
                  {hours.map((entry, index) => (
                    <Cell key={index} fill={entry.hour === String(currentHour).padStart(2, "0") ? "hsl(142, 70%, 45%)" : "hsl(24, 95%, 53%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent animate-glow-pulse" />
                <span className="text-xs text-muted-foreground">{t.peakHours.now}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">{t.peakHours.peakLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-info" />
                <span className="text-xs text-muted-foreground">{t.peakHours.normal}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PeakHoursChart;
