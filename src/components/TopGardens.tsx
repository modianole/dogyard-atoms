import { MapPin, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGardens } from "@/hooks/useGardens";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const BubblyStar = ({ className, filled = true }: { className?: string; filled?: boolean }) => (
  <Star
    className={cn(className, "filter drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.2)]")}
    style={{
      color: filled ? "#FFD700" : "#94a3b8",
      fill: filled ? "#FFD700" : "transparent",
      opacity: filled ? 1 : 0.3
    }}
    strokeWidth={filled ? 0.5 : 2}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <BubblyStar key={i} filled={i < full} className="h-3.5 w-3.5" />
      ))}
    </div>
  );
};

const TopGardens = () => {
  const { t, language, isRTL } = useLanguage();
  const { data: gardens, isLoading } = useGardens();
  const isEn = language === "en";

  if (isLoading) {
    return (
      <section id="gardens" className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded-xl mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-muted rounded-2xl" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gardens" className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute w-[300px] h-[300px] rounded-full opacity-[0.05] blur-[100px] top-20 right-0" style={{ background: 'hsl(142, 70%, 45%)' }} />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mb-2">{t.gardens.title}</h2>
          <p className="text-muted-foreground">{t.gardens.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {(gardens ?? []).slice(0, 6).map((garden, i) => (
            <GlassCard key={garden.id}
              className="flex cursor-pointer flex-col gap-3 rounded-2xl p-5 transition-all duration-300 group hover:-translate-y-1 hover:scale-[1.01] animate-in fade-in zoom-in-95"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5 rounded-xl bg-[#FFD700]/15 px-2.5 py-1 border border-[#FFD700]/30 shadow-[0_2px_8px_rgba(255,215,0,0.1)]">
                  <BubblyStar className="w-3.5 h-3.5" />
                  <span className="text-sm font-black text-[#E6B800] dark:text-[#FFD700] tabular-nums">
                    {Number(garden.rating ?? 0).toFixed(1)}
                  </span>
                </div>
                <div className="flex-1 ms-3">
                  <h3 className="font-display font-bold text-foreground text-sm">{isEn ? (garden.name_en || garden.name) : garden.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{isEn ? (garden.location_en || garden.location) : garden.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {garden.has_fence && <span className="px-2.5 py-1 text-[10px] bg-primary/10 text-primary rounded-lg font-medium">🏗️ {isEn ? "Fenced" : "מגודר"}</span>}
                {garden.has_water && <span className="px-2.5 py-1 text-[10px] bg-info/10 text-info rounded-lg font-medium">💧 {isEn ? "Water" : "מים"}</span>}
                {garden.has_shade && <span className="px-2.5 py-1 text-[10px] bg-accent/10 text-accent rounded-lg font-medium">🌳 {isEn ? "Shade" : "צל"}</span>}
                {garden.has_lighting && <span className="px-2.5 py-1 text-[10px] bg-warning/10 text-warning rounded-lg font-medium">💡 {isEn ? "Lit" : "תאורה"}</span>}
              </div>
              <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-3">
                <StarRating rating={Number(garden.rating ?? 0)} />
                <span className="text-xs text-muted-foreground opacity-50">({garden.reviews_count ?? 0})</span>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="rounded-2xl bg-white/10 px-8 py-3.5 text-base font-bold text-foreground backdrop-blur-xl transition-all duration-300 hover:bg-white/20 md:px-6 md:py-2.5 md:text-sm active:scale-95">
            {t.gardens.allGardens}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopGardens;
