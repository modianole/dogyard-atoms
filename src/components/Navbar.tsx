import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Dog, Home, LogIn, LogOut, User, Menu, X, UtensilsCrossed, BarChart3, AlertTriangle, Users, Star, Store, ChevronDown, Heart, History, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import CheckInToggle from "./CheckInToggle";
import { useGardens } from "@/hooks/useGardens";

const OrangePawLogo = () => (
  <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 shrink-0">
    <svg viewBox="0 0 100 100" className="w-full h-full fill-[#f97316]" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 45c-12 0-22 8-22 20 0 10 10 18 22 18s22-8 22-18c0-12-10-20-22-20z" />
      <path d="M28 35c-4 0-8 4-8 9s4 9 8 9 8-4 8-9-4-9-8-9z" />
      <path d="M40 22c-5 0-9 5-9 11s4 11 9 11 9-5 9-11-4-11-9-11z" />
      <path d="M60 22c-5 0-9 5-9 11s4 11 9 11 9-5 9-11-4-11-9-11z" />
      <path d="M72 35c-4 0-8 4-8 9s4 9 8 9 8-4 8-9-4-9-8-9z" />
    </svg>
  </div>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedGardenId, setSelectedGardenId] = useState<string | null>(null);
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const { data: gardens } = useGardens();
  const navigate = useNavigate();

  const gardenOptions = useMemo(() => {
    if (!gardens) return [];
    return [
      { id: gardens[0]?.id, name: gardens[0]?.name, type: "favorite", icon: Heart },
      { id: gardens[1]?.id, name: gardens[1]?.name, type: "recent", icon: History },
      ...gardens.slice(2, 5).map(g => ({ id: g.id, name: g.name, type: "other", icon: MapPin }))
    ].filter(g => g.id);
  }, [gardens]);

  const activeGardenId = selectedGardenId || gardenOptions[0]?.id;
  const activeGardenName = gardenOptions.find(g => g.id === activeGardenId)?.name || (isRTL ? "בחר גינה" : "Select Garden");

  const navigateTo = (path: string) => {
    setOpen(false);
    if (path.startsWith("#")) {
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.querySelector(path);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const el = document.querySelector(path);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }
  };

  const handleAuthClick = async () => {
    setOpen(false);
    if (user) await signOut();
    else navigate("/auth");
  };

  const navItems = [
    { label: t.nav.home, icon: Home, path: "#top" },
    { label: t.nav.features, icon: Star, path: "/features" },
    { label: t.nav.topGardens, icon: MapPin, path: "#gardens" },
    { label: t.nav.peakHours, icon: BarChart3, path: "#peak-hours" },
    { label: t.nav.hazardReport, icon: AlertTriangle, path: "/hazard" },
    { label: t.nav.orderFood, icon: UtensilsCrossed, path: "#restaurant" },
    { label: t.nav.addGarden, icon: MapPin, path: "/add-garden" },
    { label: t.nav.community, icon: Users, path: "#community" },
    { label: t.nav.restaurantAdmin, icon: Store, path: "/admin" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-[100] glass-strong h-20 shadow-lg pointer-events-auto border-b border-white/5">
        <div className="container mx-auto h-full flex items-center justify-between px-4 md:px-6">

          <div className="flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0" onClick={() => navigateTo("#top")}>
            <OrangePawLogo />
            <span className="text-xl md:text-2xl font-display font-black tracking-tighter text-[#f97316]">DogYard</span>
          </div>

          <div className={`flex items-center gap-2 md:gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>

            {/* Intelligent Garden Picker + Check-In */}
            {user && activeGardenId && (
              <div className="flex items-center gap-1 glass p-1 rounded-full border-white/10 bg-black/40 relative">
                <div className="hidden lg:block">
                  <CheckInToggle gardenId={activeGardenId} />
                </div>

                <button
                  onClick={() => setPickerOpen(!pickerOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-white/5 transition-colors text-[10px] md:text-xs font-bold text-white/90"
                >
                  <ChevronDown className={`w-3 h-3 text-[#f97316] transition-transform ${pickerOpen ? "rotate-180" : ""}`} />
                  <span className="truncate max-w-[80px] md:max-w-[120px]">{activeGardenName}</span>
                </button>

                <AnimatePresence>
                  {pickerOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full mt-2 right-0 w-64 glass-strong border-white/10 p-2 z-[300] rounded-2xl shadow-2xl"
                    >
                      {gardenOptions.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => { setSelectedGardenId(g.id); setPickerOpen(false); }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeGardenId === g.id ? "bg-[#f97316]/20 text-[#f97316]" : "hover:bg-white/5 text-muted-foreground"}`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden text-right" dir="rtl">
                            <g.icon className="w-4 h-4 shrink-0" />
                            <span className="text-sm font-bold truncate">{g.name}</span>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold glass border-white/5 hover:bg-white/10 transition-colors">
                {language === "he" ? "🇮🇱 HE" : "🇺🇸 EN"}
              </button>

              <button
                className="p-2.5 md:p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                onClick={() => setOpen(!open)}
              >
                {open ? <X className="w-6 h-6 text-[#f97316]" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[400]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} h-full w-80 glass-strong shadow-2xl z-[500] flex flex-col`}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-2" onClick={() => navigateTo("#top")}>
                  <OrangePawLogo />
                  <span className="font-display font-black text-xl text-[#f97316]">DogYard</span>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-white/5">
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4">
                {user && activeGardenId && (
                  <div className="mb-8 flex flex-col items-center gap-4 lg:hidden p-4 rounded-3xl bg-white/5">
                    <CheckInToggle gardenId={activeGardenId} />
                    <button onClick={() => setPickerOpen(!pickerOpen)} className="text-xs text-white/60 flex items-center gap-1 font-bold">
                      <ChevronDown className="w-3 h-3 text-[#f97316]" />
                      {activeGardenName}
                    </button>
                  </div>
                )}

                <div className="space-y-1">
                  {navItems.map((item, i) => (
                    <button key={i} onClick={() => navigateTo(item.path)} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-bold text-white hover:text-[#f97316] transition-all group">
                      <item.icon className="w-5 h-5 text-white/40 group-hover:text-[#f97316]" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-black/40 space-y-3">
                <button onClick={toggleLanguage} className="w-full sm:hidden flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold glass mb-2">
                  {language === "he" ? "🇮🇱 עברית" : "🇺🇸 English"}
                </button>
                <button onClick={handleAuthClick} className="w-full py-4 rounded-2xl text-lg font-black bg-[#f97316] text-white">
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
