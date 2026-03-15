import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl font-display font-bold text-primary-foreground">DogYard</span>
          <span className="text-lg">🐾</span>
        </div>
        <p className="text-sm text-primary-foreground/50">{t.footer.rights}</p>
      </div>
    </footer>
  );
};

export default Footer;
