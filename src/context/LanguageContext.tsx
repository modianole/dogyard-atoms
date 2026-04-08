import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, Translations } from "@/i18n/translations";

type Language = "he" | "en";

interface LanguageContextType {
  language: Language;
  t: Translations;
  toggleLanguage: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "he",
  t: translations.he,
  toggleLanguage: () => {},
  isRTL: true,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem("dogyard-language");
    return storedLanguage === "en" || storedLanguage === "he" ? storedLanguage : "he";
  });

  const toggleLanguage = () => setLanguage((l) => (l === "he" ? "en" : "he"));
  const t = translations[language];
  const isRTL = language === "he";

  useEffect(() => {
    localStorage.setItem("dogyard-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL, language]);

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, isRTL }}>
      <div dir={isRTL ? "rtl" : "ltr"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};
