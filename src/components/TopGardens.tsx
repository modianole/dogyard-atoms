import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const ratings = [4.7, 4.6, 4.6, 4.5, 4.4, 4.4];
const reviews = [28, 92, 15, 85, 78, 62];

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
  const { t } = useLanguage();

  return (
    <section id="gardens" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{t.gardens.title}</h2>
          <p className="text-muted-foreground">{t.gardens.subtitle}</p>
        </div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {t.gardens.items.map((garden: any, i: number) => (
            <motion.div key={i} variants={item} whileHover={{ y: -4 }} className="bg-card rounded-[12px] shadow-soft p-5 flex flex-col gap-3 cursor-pointer transition-shadow hover:shadow-medium">
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold text-primary tabular-nums">{ratings[i]}</span>
                <div className="flex-1 ms-3">
                  <h3 className="font-display font-bold text-foreground text-sm">{garden.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{garden.area}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{garden.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <StarRating rating={ratings[i]} />
                <span className="text-xs text-muted-foreground">({reviews[i]})</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-8">
          <button className="px-6 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors btn-spring">
            {t.gardens.allGardens}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopGardens;
