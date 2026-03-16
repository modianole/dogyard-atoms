import { motion } from "framer-motion";
import { AlertTriangle, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const HazardReport = () => {
  const { t } = useLanguage();

  return (
    <section id="hazard" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-3xl mx-auto glass rounded-2xl border-gradient p-8 md:p-10 text-center relative overflow-hidden"
        >
          {/* Animated glow background */}
          <div className="absolute w-[200px] h-[200px] rounded-full opacity-[0.08] blur-[80px] -top-20 -right-20" style={{ background: 'hsl(0, 84%, 60%)' }} />
          <div className="absolute w-[150px] h-[150px] rounded-full opacity-[0.06] blur-[60px] -bottom-10 -left-10" style={{ background: 'hsl(24, 95%, 53%)' }} />

          <div className="relative">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-destructive/15 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-black text-foreground mb-2">{t.hazard.title}</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t.hazard.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-destructive text-destructive-foreground font-bold text-base md:h-12 md:text-sm btn-futuristic flex items-center justify-center gap-2" style={{ boxShadow: '0 0 20px hsla(0, 84%, 60%, 0.3)' }}>
                <AlertTriangle className="w-5 h-5" />
                {t.hazard.reportBtn}
              </button>
              <button className="w-full sm:w-auto h-14 px-8 rounded-2xl glass text-foreground font-bold text-base md:h-12 md:text-sm btn-futuristic border-gradient flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                {t.hazard.callBtn}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HazardReport;
