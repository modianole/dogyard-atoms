import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGardens } from "@/hooks/useGardens";

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < full ? "fill-warning text-warning" : i === full && hasHalf ? "fill-warning/50 text-warning" : "text-border fill-border"}`} />
      ))}
    </div>
  );
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as const } } };

const TopGardens = () => {
  const { t, language } = useLanguage();
  const { data: gardens, isLoading } = useGardens();
  const isEn = language === "en";

  if (isLoading) {
    return (
      <section id="gardens" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-muted rounded-xl" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gardens" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{t.gardens.title}</h2>
          <p className="text-muted-foreground">{t.gardens.subtitle}</p>
        </div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {(gardens ?? []).slice(0, 6).map((garden) => (
            <motion.div key={garden.id} variants={item} whileHover={{ y: -4 }} className="bg-card rounded-[12px] shadow-soft p-5 flex flex-col gap-3 cursor-pointer transition-shadow hover:shadow-medium">
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold text-primary tabular-nums">{Number(garden.rating ?? 0).toFixed(1)}</span>
                <div className="flex-1 ms-3">
                  <h3 className="font-display font-bold text-foreground text-sm">{isEn ? (garden.name_en || garden.name) : garden.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{isEn ? (garden.location_en || garden.location) : garden.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {garden.has_fence && <span className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">🏗️ {isEn ? "Fenced" : "מגודר"}</span>}
                {garden.has_water && <span className="px-2 py-0.5 text-[10px] bg-info/10 text-info rounded-full">💧 {isEn ? "Water" : "מים"}</span>}
                {garden.has_shade && <span className="px-2 py-0.5 text-[10px] bg-accent/10 text-accent rounded-full">🌳 {isEn ? "Shade" : "צל"}</span>}
                {garden.has_lighting && <span className="px-2 py-0.5 text-[10px] bg-warning/10 text-warning rounded-full">💡 {isEn ? "Lit" : "תאורה"}</span>}
              </div>
              <div className="flex items-center justify-between mt-auto">
                <StarRating rating={Number(garden.rating ?? 0)} />
                <span className="text-xs text-muted-foreground">({garden.reviews_count ?? 0})</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-8">
          <button className="px-8 py-3.5 rounded-lg border border-border text-base font-medium text-foreground hover:bg-secondary transition-colors btn-spring md:px-6 md:py-2.5 md:text-sm">
            {t.gardens.allGardens}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopGardens;
