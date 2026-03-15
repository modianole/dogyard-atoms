import { useState } from "react";
import { MapPin, Dog, Home, LogIn, LogOut, User, Menu, X, UtensilsCrossed, BarChart3, AlertTriangle, Users, Star, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

const icons = [Home, Star, MapPin, BarChart3, AlertTriangle, UtensilsCrossed, MapPin, Users, Store];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
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
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("#top")}>
            <span className="text-2xl font-display font-bold tracking-tight text-foreground">DogYard</span>
            <span className="text-xl">🐾</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
            >
              {language === "he" ? <>🇮🇱 HEB</> : <>🇺🇸 ENG</>}
            </button>

            <div className="hidden md:flex items-center gap-2">
              <button onClick={handleAuthClick} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground btn-spring hover:opacity-90 transition-opacity">
                {user ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>{user ? t.auth.logout : t.nav.login}</span>
              </button>
            </div>

            <button className="p-2 rounded-lg hover:bg-secondary transition-colors" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: language === "he" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: language === "he" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`fixed top-0 ${language === "he" ? "right-0 border-l" : "left-0 border-r"} h-full w-72 bg-card border-border shadow-large z-[70] flex flex-col`}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-display font-bold text-foreground text-lg">{t.nav.menu}</span>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-3">
                {menuLabels.map((label, i) => {
                  const Icon = icons[i];
                  return (
                    <button key={i} onClick={() => scrollTo(menuHrefs[i])} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-card-foreground hover:bg-muted transition-colors mb-1">
                      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-border space-y-2">
                <button onClick={() => scrollTo("#dog")} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Dog className="w-4 h-4" />
                  {t.nav.myDog}
                </button>
                <button onClick={handleAuthClick} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground btn-spring hover:opacity-90 transition-opacity">
                  {user ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  {user ? t.auth.logout : t.nav.login}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
