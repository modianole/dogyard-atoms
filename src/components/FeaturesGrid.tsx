import { motion } from "framer-motion";
import { MapPin, Star, UserCheck, Bell, Dog, MessageCircle } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "מפת גינות",
    description: "מעל 100 גינות בתל אביב על המפה",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Star,
    title: "דירוג הגינות",
    description: "דרגו ניקיון, תאורה ומים",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: UserCheck,
    title: "צ׳ק-אין",
    description: "בדקו מי בגינה עכשיו",
    color: "text-info",
    bg: "bg-info/10",
  },
  {
    icon: Bell,
    title: "התראות",
    description: "פקח? מפגע? דווחו בזמן אמת",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    icon: Dog,
    title: "פרופיל כלב",
    description: "הכירו את הכלבים בגינה",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: MessageCircle,
    title: "צ׳אט קבוצתי",
    description: "תיאמו מפגשים עם החבר׳ה",
    color: "text-muted-foreground",
    bg: "bg-secondary",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as const } },
};

const FeaturesGrid = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            🐾 מה תמצאו ב-DogYard?
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            כל מה שצריך כדי למצוא את הגינה הטובה ביותר ולהתחבר עם קהילת בעלי הכלבים
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ y: -4 }}
              className="bg-card rounded-[12px] shadow-soft p-6 flex flex-col items-center text-center gap-3 cursor-default transition-shadow hover:shadow-medium"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-display font-bold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
