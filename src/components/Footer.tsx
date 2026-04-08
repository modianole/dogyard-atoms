import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";

const Footer = ({ className = "" }: { className?: string }) => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className={`relative bg-background border-t border-border/50 py-10 overflow-hidden ${className}`}>
      <div className="absolute w-[200px] h-[100px] rounded-full opacity-[0.03] blur-[80px] bottom-0 left-1/2 -translate-x-1/2" style={{ background: 'hsl(24, 95%, 53%)' }} />
      
      <div className="container mx-auto px-4 text-center relative">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="/logo.png" alt="DogYard Logo" className="h-8 md:h-10 w-auto object-contain" />
        </div>
        <div className="flex items-center justify-center gap-4 mb-4 text-sm font-medium">
          <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            {isRTL ? "מדיניות פרטיות" : "Privacy Policy"}
          </Link>
          <span className="text-border">•</span>
          <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
            {isRTL ? "תנאי שימוש" : "Terms of Service"}
          </Link>
        </div>
        <p className="text-sm text-muted-foreground opacity-70 font-medium tracking-wide italic">{t.footer.rights}</p>
      </div>
    </footer>
  );
};

export default Footer;
