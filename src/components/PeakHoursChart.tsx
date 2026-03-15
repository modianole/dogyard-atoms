import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

const hours = [
  { hour: "06", normal: 2, peak: 0 },
  { hour: "07", normal: 5, peak: 0 },
  { hour: "08", normal: 8, peak: 3 },
  { hour: "09", normal: 6, peak: 0 },
  { hour: "10", normal: 4, peak: 0 },
  { hour: "11", normal: 3, peak: 0 },
  { hour: "12", normal: 2, peak: 0 },
  { hour: "13", normal: 2, peak: 0 },
  { hour: "14", normal: 3, peak: 0 },
  { hour: "15", normal: 5, peak: 0 },
  { hour: "16", normal: 7, peak: 4 },
  { hour: "17", normal: 0, peak: 12 },
  { hour: "18", normal: 0, peak: 15 },
  { hour: "19", normal: 0, peak: 10 },
  { hour: "20", normal: 6, peak: 0 },
  { hour: "21", normal: 4, peak: 0 },
  { hour: "22", normal: 2, peak: 0 },
];

const PeakHoursChart = () => {
  const currentHour = 17;

  return (
    <section id="peak-hours" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">📊</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  שעות העומס בגינות
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">מתי כדאי להגיע? ממוצע כלבים לפי שעה</p>
            </div>
            <div className="hidden md:block">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="bg-card rounded-[12px] shadow-soft p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={hours} barCategoryGap="20%">
                <XAxis
                  dataKey="hour"
                  tick={{ fill: "hsl(210, 12%, 50%)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  reversed
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(210, 15%, 90%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    direction: "rtl",
                  }}
                  formatter={(value: number) => [`${value} כלבים`, ""]}
                  labelFormatter={(label) => `שעה ${label}:00`}
                />
                <Bar dataKey="normal" stackId="a" radius={[0, 0, 0, 0]} fill="hsl(210, 80%, 55%)" />
                <Bar dataKey="peak" stackId="a" radius={[4, 4, 0, 0]}>
                  {hours.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.hour === String(currentHour).padStart(2, "0") ? "hsl(142, 70%, 45%)" : "hsl(24, 95%, 53%)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-xs text-muted-foreground">עכשיו</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">שעות שיא</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-info" />
                <span className="text-xs text-muted-foreground">רגיל</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PeakHoursChart;
