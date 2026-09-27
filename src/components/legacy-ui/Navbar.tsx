import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, X, Menu, Map as MapIcon, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toggleLanguage, isRTL } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMapPage = location.pathname === "/map";
  const isHomePage = location.pathname === "/" || location.pathname === "" || location.pathname.length <= 1;

  const logoSrc = "/logo.png";

  return (
    <>
      <nav className={cn(
        "w-full h-20 z-[50] transition-all duration-300 border-b border-white/10 shadow-lg",
        isHomePage ? "relative" : "fixed top-0 left-0 right-0",
        "bg-white/80 dark:bg-black/80 backdrop-blur-2xl"
      )}>
        <div className="container mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <img src={logoSrc} alt="Logo" className={cn("w-auto object-contain", isMapPage ? "h-14" : "h-20 md:h-28")} />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl bg-slate-500/10 dark:bg-white/10 text-foreground"
            >
              {mounted && (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
            </button>

            <button onClick={() => setOpen(!open)} className="p-3 rounded-2xl bg-slate-500/10 dark:bg-white/10 text-foreground">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" onClick={() => setOpen(false)} />
          <div className={cn(
            "fixed top-0 h-full w-80 z-[300] shadow-2xl flex flex-col bg-white dark:bg-slate-950 border-white/10",
            isRTL ? "right-0" : "left-0"
          )}>
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <img src={logoSrc} alt="Logo" className="h-20 w-auto object-contain" />
              <button onClick={() => setOpen(false)} className="text-foreground/70"><X /></button>
            </div>
            <div className="flex-1 p-4 space-y-4">
               <button onClick={() => {navigate("/"); setOpen(false);}} className="w-full p-4 rounded-2xl bg-slate-500/5 dark:bg-white/5 text-right font-bold">{isRTL ? "דף הבית" : "Home"}</button>
               <button onClick={() => {navigate("/map"); setOpen(false);}} className="w-full p-4 rounded-2xl bg-slate-500/5 dark:bg-white/5 text-right font-bold">{isRTL ? "מפת גינות" : "Map"}</button>
               {user && (
                 <button onClick={async () => {await signOut(); setOpen(false);}} className="w-full p-4 rounded-2xl bg-red-500/10 text-red-600 text-right font-bold">{isRTL ? "התנתק" : "Logout"}</button>
               )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
