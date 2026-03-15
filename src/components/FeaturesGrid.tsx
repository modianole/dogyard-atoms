import { motion } from "framer-motion";
import { MapPin, Star, UserCheck, Bell, Dog, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const icons = [MapPin, Star, UserCheck, Bell, Dog, MessageCircle];
const colors = ["text-accent", "text-warning", "text-info", "text-destructive", "text-primary", "text-muted-foreground"];
const bgs = ["bg-accent/10", "bg-warning/10", "bg-info/10", "bg-destructive/10", "bg-primary/10", "bg-secondary"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as const } },
};

const FeaturesGrid = () => {
  const { t } = useLanguage();
  const featureKeys = [
    { title: t.features.gardenMap, desc: t.features.gardenMapDesc },
    { title: t.features.gardenRating, desc: t.features.gardenRatingDesc },
    { title: t.features.checkIn, desc: t.features.checkInDesc },
    { title: t.features.alerts, desc: t.features.alertsDesc },
    { title: t.features.dogProfile, desc: t.features.dogProfileDesc },
    { title: t.features.groupChat, desc: t.features.groupChatDesc },
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">{t.features.title}</h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">{t.features.subtitle}</p>
        </div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {featureKeys.map((f, i) => {
            const Icon = icons[i];
            return (
              <motion.div key={i} variants={item} whileHover={{ y: -4 }} className="bg-card rounded-[12px] shadow-soft p-6 flex flex-col items-center text-center gap-3 cursor-default transition-shadow hover:shadow-medium">
                <div className={`w-12 h-12 rounded-xl ${bgs[i]} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors[i]}`} />
                </div>
                <h3 className="font-display font-bold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
