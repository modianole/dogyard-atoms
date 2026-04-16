import communityImage from "@/assets/community-dogs.jpg";
import { useLanguage } from "@/context/LanguageContext";

const statColors = ["text-accent", "text-info", "text-primary"];

const CommunitySection = () => {
  const { t } = useLanguage();

  return (
    <section id="community" className="relative py-28 overflow-hidden">
      <img src={communityImage} alt="Dog community" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Glow orbs */}
      <div className="absolute w-[300px] h-[300px] rounded-full opacity-[0.1] blur-[100px] top-10 left-1/4" style={{ background: 'hsl(24, 95%, 53%)' }} />
      <div className="absolute w-[200px] h-[200px] rounded-full opacity-[0.08] blur-[80px] bottom-10 right-1/4" style={{ background: 'hsl(142, 70%, 45%)' }} />

      <div className="relative container mx-auto px-4 text-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mb-3">{t.community.title}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-12">{t.community.subtitle}</p>
        </div>

        <div className="flex items-center justify-center gap-8 md:gap-16">
          {t.community.stats.map((stat: any, i: number) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 glass rounded-2xl px-6 py-5 border-gradient transition-transform hover:scale-105"
            >
              <span className={`text-3xl md:text-5xl font-display font-black ${statColors[i]} tabular-nums`}>{stat.value}</span>
              <span className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;

