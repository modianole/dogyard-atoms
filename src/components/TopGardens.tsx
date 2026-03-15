import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";

const gardens = [
  { name: "גינת צהלה", area: "רח׳ צהלה, תל אביב", rating: 4.7, reviews: 28, description: "גינה רחבת ידיים עם דשא ירוק ומתקנים מעולים" },
  { name: "גינת הכלבים הצפון הישן", area: "הצפון הישן, תל אביב", rating: 4.6, reviews: 92, description: "גינת כלבים מטופחת בצפון הישן, קהילה ותיקה ומסודרת" },
  { name: "גינת כלבים וכטנגוב", area: "רחוב וכטנגוב 6, תל אביב", rating: 4.6, reviews: 15, description: "גינה חדשה ומודרנית ברחוב וכטנגוב" },
  { name: "גינת הכלבים פארק הירקון (צפון)", area: "פארק הירקון, תל אביב", rating: 4.5, reviews: 85, description: "גינת כלבים גדולה ומרווחת בחלקו הצפוני של פארק הירקון" },
  { name: "גינת הכלבים יהושע", area: "גן יהושע (גן העיר), תל אביב", rating: 4.4, reviews: 78, description: "גינת כלבים מרווחת בגן יהושע עם שטח ריצה גדול" },
  { name: "גינת דיזנגוב", area: "רחוב דיזנגוב, תל אביב", rating: 4.4, reviews: 62, description: "גינה שקטה ונעימה ליד הבימה עם מתקני מים לכלבים" },
];

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < full ? "fill-warning text-warning" : i === full && hasHalf ? "fill-warning/50 text-warning" : "text-border fill-border"}`}
        />
      ))}
    </div>
  );
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] } },
};

const TopGardens = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            ⭐ גינות מובילות
          </h2>
          <p className="text-muted-foreground">הגינות הכי מדורגות בתל אביב</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
        >
          {gardens.map((garden) => (
            <motion.div
              key={garden.name}
              variants={item}
              whileHover={{ y: -4 }}
              className="bg-card rounded-[12px] shadow-soft p-5 flex flex-col gap-3 cursor-pointer transition-shadow hover:shadow-medium"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold text-primary tabular-nums">{garden.rating}</span>
                <div className="flex-1 mr-3">
                  <h3 className="font-display font-bold text-foreground text-sm">{garden.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{garden.area}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{garden.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <StarRating rating={garden.rating} />
                <span className="text-xs text-muted-foreground">({garden.reviews})</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-8">
          <button className="px-6 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors btn-spring">
            כל הגינות
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopGardens;
