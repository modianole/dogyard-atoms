import { MapPin, Star, UserCheck, Bell, Dog, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const icons = [MapPin, Star, UserCheck, Bell, Dog, MessageCircle];
const iconColors = ["text-accent", "text-warning", "text-info", "text-destructive", "text-primary", "text-muted-foreground"];
const iconBgs = ["bg-accent/15", "bg-warning/15", "bg-info/15", "bg-destructive/15", "bg-primary/15", "bg-secondary"];

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
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.07] blur-[120px] -top-40 left-1/2 -translate-x-1/2" style={{ background: 'hsl(24, 95%, 53%)' }} />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mb-3">{t.features.title}</h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">{t.features.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {featureKeys.map((f, i) => {
            const Icon = icons[i];
            return (
              <div
                key={i}
                className="glass rounded-2xl p-6 flex flex-col items-center text-center gap-3 cursor-default transition-all duration-300 group border-gradient hover:scale-[1.02]"
              >
                <div className={`w-14 h-14 rounded-2xl ${iconBgs[i]} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-7 h-7 ${iconColors[i]}`} />
                </div>
                <h3 className="font-display font-bold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
