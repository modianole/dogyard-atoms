import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, X, Menu, Map as MapIcon, Info, ShieldCheck, PlusCircle, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { toggleLanguage, language, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // נסתיר את הנבבר רק אם אנחנו בתוך המודאל של המפה (לפי ה-ID של המודאל)
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const mapModal = document.querySelector('.z-\\[10000\\]');
      setIsMapOpen(!!mapModal);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const menuItems = [
    { label: isRTL ? "דף הבית" : "Home", icon: Home, path: "/" },
    { label: isRTL ? "מפת גינות" : "Gardens Map", icon: MapIcon, path: "/map" },
    { label: isRTL ? "דיווח מפגע" : "Report Hazard", icon: ShieldCheck, path: "/hazard" },
    { label: isRTL ? "הוספת גינה" : "Add Garden", icon: PlusCircle, path: "/add-garden" },
    { label: isRTL ? "ניהול" : "Admin", icon: LayoutDashboard, path: "/admin" },
  ];

  const handleNavigate = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  if (isMapOpen) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-b border-white/10 z-[100]">
        <div className="container mx-auto h-full flex items-center justify-between px-6">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <span className="text-white font-black text-xl hidden sm:block tracking-tighter">DOGYARD</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Map Access */}
            <button
              onClick={() => navigate("/map")}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${location.pathname === "/map" ? "bg-primary text-white" : "bg-white/5 text-white hover:bg-white/10"}`}
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden md:inline">{isRTL ? "מפה" : "Map"}</span>
            </button>

            {/* Language Switch */}
            <button onClick={toggleLanguage} className="text-white text-xs font-bold glass px-3 py-2 rounded-xl">
              {language === "he" ? "HE" : "EN"}
            </button>

            {/* Menu Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white"
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
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-[200]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} h-full w-80 bg-card border-x border-white/10 z-[300] shadow-2xl flex flex-col`}
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                <button onClick={() => setOpen(false)} className="text-white"><X /></button>
              </div>

              <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                {menuItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${location.pathname === item.path ? "bg-primary text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                  >
                    <item.icon className="w-6 h-6" />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="p-8 border-t border-white/10 bg-black/40">
                <button
                  onClick={async () => { if (user) await signOut(); else navigate("/auth"); setOpen(false); }}
                  className="w-full py-4 bg-primary rounded-2xl text-white font-black text-lg shadow-lg shadow-primary/20"
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
