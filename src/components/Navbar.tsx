import { useState } from "react";
import { MapPin, Dog, Home, LogIn, LogOut, User, Menu, X, UtensilsCrossed, BarChart3, AlertTriangle, Users, Star, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

const icons = [Home, Star, MapPin, BarChart3, AlertTriangle, UtensilsCrossed, MapPin, Users, Store];

const OrangePawLogo = () => (
  <div className="relative flex items-center justify-center w-12 h-12">
    <svg viewBox="0 0 100 100" className="w-10 h-10 fill-[#f97316]" xmlns="http://www.w3.org/2000/svg">
      {/* Central Pad */}
      <path d="M50 45c-12 0-22 8-22 20 0 10 10 18 22 18s22-8 22-18c0-12-10-20-22-20z" />
      {/* Toes */}
      <path d="M28 35c-4 0-8 4-8 9s4 9 8 9 8-4 8-9-4-9-8-9z" />
      <path d="M40 22c-5 0-9 5-9 11s4 11 9 11 9-5 9-11-4-11-9-11z" />
      <path d="M60 22c-5 0-9 5-9 11s4 11 9 11 9-5 9-11-4-11-9-11z" />
      <path d="M72 35c-4 0-8 4-8 9s4 9 8 9 8-4 8-9-4-9-8-9z" />
    </svg>
  </div>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { user, signOut } = useAuth();

  const menuLabels = [
    t.nav.home, t.nav.features, t.nav.topGardens, t.nav.peakHours,
    t.nav.hazardReport, t.nav.orderFood, t.nav.addGarden, t.nav.community, t.nav.restaurantAdmin,
  ];
  const menuHrefs = ["#top", "#features", "#gardens", "#peak-hours", "#hazard", "#restaurant", "#add-garden", "#community", "#restaurant-admin"];

  const scrollTo = (href: string) => {
    setOpen(false);
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleAuthClick = async () => {
    setOpen(false);
    if (user) {
      await signOut();
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-[120] glass-strong pointer-events-auto shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-20 px-6">
          <div className="flex items-center gap-3 cursor-pointer group order-1" onClick={() => scrollTo("#top")}>
            <OrangePawLogo />
            <span className="text-2xl font-display font-black tracking-tighter text-gradient-primary hidden sm:block">DogYard</span>
          </div>

          <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"} order-2`}>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold glass hover:bg-card/90 transition-all duration-300 border-none shadow-inner"
            >
              {language === "he" ? <span>🇮🇱 HEB</span> : <span>🇺🇸 ENG</span>}
            </button>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <button onClick={handleAuthClick} className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black bg-primary text-primary-foreground btn-futuristic glow-primary shadow-lg">
                  <LogOut className="w-5 h-5" />
                  <span>{t.auth.logout}</span>
                </button>
              ) : (
                <a href="/auth" className="relative z-[130] pointer-events-auto flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black bg-primary text-primary-foreground btn-futuristic glow-primary shadow-lg">
                  <LogIn className="w-5 h-5" />
                  <span>{t.nav.login}</span>
                </a>
              )}
            </div>

            <button
              className={`p-3 rounded-2xl bg-secondary/50 hover:bg-secondary transition-all duration-300 shadow-sm ${isRTL ? "order-first" : "order-last"}`}
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-foreground" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-background/70 backdrop-blur-xl z-[60]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} h-full w-80 glass-strong shadow-2xl z-[70] flex flex-col`}
            >
              <div className="flex items-center justify-between p-6 border-b border-border/30">
                <span className="font-display font-black text-2xl text-gradient-primary uppercase tracking-widest">{t.nav.menu}</span>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4">
                {menuLabels.map((label, i) => {
                  const Icon = icons[i];
                  return (
                    <button key={i} onClick={() => scrollTo(menuHrefs[i])} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-bold text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 mb-2 group border border-transparent hover:border-primary/20">
                      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="p-6 border-t border-border/30 space-y-3 bg-card/20">
                <button onClick={() => scrollTo("#dog")} className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-lg font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300 border border-border/50">
                  <Dog className="w-6 h-6" />
                  {t.nav.myDog}
                </button>
                {user ? (
                  <button onClick={handleAuthClick} className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-lg font-black bg-primary text-primary-foreground btn-futuristic glow-primary shadow-xl">
                    <LogOut className="w-6 h-6" />
                    {t.auth.logout}
                  </button>
                ) : (
                  <a href="/auth" className="relative z-[130] pointer-events-auto w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-lg font-black bg-primary text-primary-foreground btn-futuristic glow-primary shadow-xl">
                    <LogIn className="w-6 h-6" />
                    {t.nav.login}
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
