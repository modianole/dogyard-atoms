import { motion } from "framer-motion";
import communityImage from "@/assets/community-dogs.jpg";
import { useLanguage } from "@/context/LanguageContext";

const statColors = ["text-accent", "text-info", "text-primary"];

const CommunitySection = () => {
  const { t } = useLanguage();

  return (
    <section id="community" className="relative py-24 overflow-hidden">
      <img src={communityImage} alt="Dog community" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-foreground/60" />

      <div className="relative container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-3">{t.community.title}</h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-10">{t.community.subtitle}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }} className="flex items-center justify-center gap-8 md:gap-16">
          {t.community.stats.map((stat: any, i: number) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className={`text-3xl md:text-5xl font-display font-bold ${statColors[i]} tabular-nums`}>{stat.value}</span>
              <span className="text-xs md:text-sm text-primary-foreground/70 font-medium">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
