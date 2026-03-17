import { useLanguage } from "@/context/LanguageContext";
import { Dog } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-background border-t border-border/50 py-10 overflow-hidden">
      <div className="absolute w-[200px] h-[100px] rounded-full opacity-[0.03] blur-[80px] bottom-0 left-1/2 -translate-x-1/2" style={{ background: 'hsl(24, 95%, 53%)' }} />
      
      <div className="container mx-auto px-4 text-center relative">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-accent/5 border border-accent/10">
            <Dog className="w-6 h-6 text-[#f97316] drop-shadow-[0_0_5px_rgba(249,115,22,0.4)]" />
          </div>
          <span className="text-xl font-display font-black text-gradient-primary tracking-tighter">DogYard</span>
        </div>
        <p className="text-sm text-muted-foreground opacity-70 font-medium tracking-wide italic">{t.footer.rights}</p>
      </div>
    </footer>
  );
};

export default Footer;
