import { motion } from "framer-motion";
import { AlertTriangle, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const HazardReport = () => {
  const { t } = useLanguage();

  return (
    <section id="hazard" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-3xl mx-auto bg-gradient-to-l from-primary/10 via-primary/5 to-transparent rounded-[16px] border border-primary/20 p-8 md:p-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">⚠️</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">{t.hazard.title}</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t.hazard.subtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="w-full sm:w-auto h-12 px-8 rounded-lg bg-destructive text-destructive-foreground font-bold text-sm btn-spring hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {t.hazard.reportBtn}
            </button>
            <button className="w-full sm:w-auto h-12 px-8 rounded-lg border border-border text-foreground font-medium text-sm btn-spring hover:bg-secondary transition-colors flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              {t.hazard.callBtn}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HazardReport;
