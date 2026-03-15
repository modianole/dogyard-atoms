import { useState } from "react";
import { MapPin, Dog, Home, LogIn, User, Menu, X, UtensilsCrossed, BarChart3, AlertTriangle, Users, Star, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuSections = [
  { label: "דף הבית", icon: Home, href: "#top" },
  { label: "מה אנחנו מציעים", icon: Star, href: "#features" },
  { label: "גינות מובילות", icon: MapPin, href: "#gardens" },
  { label: "שעות עומס", icon: BarChart3, href: "#peak-hours" },
  { label: "דיווח מפגע", icon: AlertTriangle, href: "#hazard" },
  { label: "הזמנה מהמסעדה", icon: UtensilsCrossed, href: "#restaurant" },
  { label: "הוספת גינה", icon: MapPin, href: "#add-garden" },
  { label: "הקהילה שלנו", icon: Users, href: "#community" },
  { label: "ניהול מסעדה", icon: Store, href: "#restaurant-admin" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const scrollTo = (href: string) => {
    setOpen(false);
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("#top")}>
            <span className="text-2xl font-display font-bold tracking-tight text-foreground">DogYard</span>
            <span className="text-xl">🐾</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <User className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground btn-spring hover:opacity-90 transition-opacity">
                <LogIn className="w-4 h-4" />
                <span>כניסה</span>
              </button>
            </div>

            <button
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Side panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60]"
              onClick={() => setOpen(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 bg-card border-l border-border shadow-large z-[70] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-display font-bold text-foreground text-lg">תפריט</span>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto py-4 px-3">
                {menuSections.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollTo(item.href)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-card-foreground hover:bg-muted transition-colors text-right mb-1"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Bottom actions */}
              <div className="p-4 border-t border-border space-y-2">
                <button
                  onClick={() => scrollTo("#dog")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Dog className="w-4 h-4" />
                  הכלב שלי
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground btn-spring hover:opacity-90 transition-opacity">
                  <LogIn className="w-4 h-4" />
                  כניסה
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
