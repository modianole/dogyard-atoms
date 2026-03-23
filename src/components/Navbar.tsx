import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, X, Menu, Map as MapIcon, ShieldCheck, PlusCircle, LayoutDashboard, User, Bell, Settings as SettingsIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { toggleLanguage, language, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMapPage = location.pathname === "/map";

  // בדיקה רחבה וחסינה לכל סוגי הנתיבים בדף הבית (כולל index.html של Capacitor)
  const path = location.pathname.toLowerCase();
  const isHomePage =
    path === "/" ||
    path === "" ||
    path.includes("index.html") ||
    path.length <= 1;

  const menuItems = [
    { label: isRTL ? "דף הבית" : "Home", icon: Home, path: "/" },
    { label: isRTL ? "מפת גינות" : "Gardens Map", icon: MapIcon, path: "/map" },
    { label: isRTL ? "דיווח מפגע" : "Report Hazard", icon: ShieldCheck, path: "/hazard" },
    { label: isRTL ? "הוספת גינה" : "Add Garden", icon: PlusCircle, path: "/add-garden" },
    { label: isRTL ? "התראות" : "Notifications", icon: Bell, path: "/notifications" },
    { label: isRTL ? "פרופיל" : "Profile", icon: User, path: "/profile" },
    { label: isRTL ? "הגדרות" : "Settings", icon: SettingsIcon, path: "/settings" },
    { label: isRTL ? "ניהול" : "Admin", icon: LayoutDashboard, path: "/admin" },
  ];

  const handleNavigate = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  // בדף הבית נשתמש ב-relative כדי שיופיע מתחת להאדר. בשאר הדפים הוא יישאר fixed בראש המסך.
  const navClasses = `${
    isHomePage
      ? "relative"
      : "fixed top-0 left-0 right-0"
  } w-full h-20 z-[50] transition-all duration-300 ${
    isMapPage
      ? "bg-black/40 backdrop-blur-md border-b border-white/5 h-16"
      : "bg-black/80 backdrop-blur-xl border-b border-white/10"
  }`;

  return (
    <>
      <nav className={navClasses}>
        <div className="container mx-auto h-full flex items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.png" alt="Logo" className={isMapPage ? "h-8 w-auto" : "h-10 w-auto"} />
            <span className="text-white font-black text-xl hidden sm:block tracking-tighter">DOGYARD</span>
          </div>

          <div className="flex items-center gap-4">
            {!isMapPage && (
              <button
                onClick={() => navigate("/map")}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm bg-primary text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden md:inline">{isRTL ? "מפה" : "Map"}</span>
              </button>
            )}

            <button
              onClick={toggleLanguage}
              className="text-white text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-colors border border-white/10"
            >
              {language === "he" ? "HE" : "EN"}
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 text-white transition-all active:scale-90"
              aria-label="Menu"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} h-full w-80 bg-card border-x border-white/10 z-[300] shadow-2xl flex flex-col`}
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-muted/30">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                  <span className="text-white font-black text-lg">DOGYARD</span>
                </div>
                <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                  <X />
                </button>
              </div>

              <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${location.pathname === item.path ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                  >
                    <item.icon className={`w-6 h-6 ${location.pathname === item.path ? "text-white" : "text-primary"}`} />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="p-8 border-t border-white/10 bg-black/40 space-y-4">
                {user ? (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{user.email}</p>
                      <p className="text-xs text-white/40">מחובר למערכת</p>
                    </div>
                  </div>
                ) : null}

                <button
                  onClick={async () => { if (user) await signOut(); else navigate("/auth"); setOpen(false); }}
                  className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg transition-all active:scale-95 ${user ? "bg-white/10 hover:bg-destructive hover:shadow-destructive/20" : "bg-primary hover:bg-primary/90 shadow-primary/20"}`}
                >
                  {user ? (isRTL ? "התנתק" : "Logout") : (isRTL ? "התחברות" : "Login")}
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
