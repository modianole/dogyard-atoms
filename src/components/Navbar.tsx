import { useState } from "react";
import { MapPin, Dog, Home, LogIn, User, Menu, X, UtensilsCrossed, BarChart3, AlertTriangle, Users, Star, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuSections = [
  { label: "דף הבית", icon: Home, href: "#top" },
  { label: "מה אנחנו מציעים", icon: Star, href: "#features" },
  { label: "גינות מובילות", icon: MapPin, href: "#gardens" },
  { label: "שעות עומס", icon: BarChart3, href: "#peak-hours" },
  { label: "דיווח מפגע", icon: AlertTriangle, href: "#hazard" },
  { label: "הזמנה מהמסעדה", icon: UtensilsCrossed, href: "#restaurant" },
  { label: "הקהילה שלנו", icon: Users, href: "#community" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    setMobileOpen(false);
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("#top")}>
          <span className="text-2xl font-display font-bold tracking-tight text-foreground">DogYard</span>
          <span className="text-xl">🐾</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {/* Dropdown menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-foreground hover:bg-secondary transition-colors"
            >
              <Menu className="w-4 h-4" />
              תפריט
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-card rounded-xl border border-border shadow-large z-50 overflow-hidden"
                  >
                    <div className="py-2">
                      {menuSections.map((item, i) => (
                        <button
                          key={item.label}
                          onClick={() => scrollTo(item.href)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted transition-colors text-right"
                        >
                          <item.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <a href="#dog" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Dog className="w-4 h-4" />
            הכלב שלי
          </a>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <User className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground btn-spring hover:opacity-90 transition-opacity">
            <LogIn className="w-4 h-4" />
            <span>כניסה</span>
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-card border-b border-border"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {menuSections.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.href)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-right"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <div className="border-t border-border my-2" />
              <button
                onClick={() => scrollTo("#dog")}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-right"
              >
                <Dog className="w-4 h-4" />
                הכלב שלי
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 mt-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground btn-spring">
                <LogIn className="w-4 h-4" />
                כניסה
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
