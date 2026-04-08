import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, X, Menu, Map as MapIcon, User, Settings as SettingsIcon, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toggleLanguage, language, isRTL } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Wait for mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isMapPage = location.pathname === "/map";

  const path = location.pathname.toLowerCase();
  const isHomePage =
    path === "/" ||
    path === "" ||
    path.includes("index.html") ||
    path.length <= 1;

  const menuItems = [
    { label: isRTL ? "דף הבית" : "Home", icon: Home, path: "/" },
    { label: isRTL ? "מפת גינות" : "Gardens Map", icon: MapIcon, path: "/map" },
    { label: isRTL ? "פרופיל" : "Profile", icon: User, path: "/profile" },
    { label: isRTL ? "הגדרות" : "Settings", icon: SettingsIcon, path: "/settings" },
  ];

  const handleNavigate = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const navClasses = `${
    isHomePage
      ? "relative"
      : "fixed top-0 left-0 right-0"
  } w-full h-20 z-[50] transition-all duration-300 ${
    isMapPage
      ? "bg-black/40 backdrop-blur-md border-b border-white/5 h-16"
      : "bg-background/80 backdrop-blur-xl border-b border-border/50"
  }`;

  const logoSrc = "/logo.png";

  return (
    <>
      <nav className={navClasses}>
        <div className="container mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <img
              src={logoSrc}
              alt="DogYard Logo"
              className={`${isMapPage ? "h-24" : "h-40"} w-auto object-contain transition-opacity duration-300`}
            />
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
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 bg-foreground/10 hover:bg-foreground/20 rounded-xl transition-all border border-border/50 text-foreground active:scale-90"
              aria-label="Toggle theme"
            >
              {mounted && (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
            </button>

            <button
              onClick={toggleLanguage}
              className="text-foreground text-xs font-bold bg-foreground/10 hover:bg-foreground/20 px-3 py-2 rounded-xl transition-colors border border-border/50"
            >
              {language === "he" ? "HE" : "EN"}
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="p-3 bg-foreground/10 hover:bg-foreground/20 rounded-2xl border border-border/50 text-foreground transition-all active:scale-90"
              aria-label="Menu"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
          />
          <div
            className={`fixed top-0 ${isRTL ? "right-0 animate-in slide-in-from-right" : "left-0 animate-in slide-in-from-left"} h-full w-80 bg-card border-x border-border z-[300] shadow-2xl flex flex-col duration-300`}
          >
            <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate("/")}>
                <img src={logoSrc} alt="Logo" className="h-36 w-auto object-contain" />
              </div>
              <button onClick={() => setOpen(false)} className="text-foreground/70 hover:text-foreground transition-colors p-2 rounded-lg hover:bg-foreground/5">
                <X />
              </button>
            </div>

            <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
              {menuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${location.pathname === item.path ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"}`}
                >
                  <item.icon className={`w-6 h-6 ${location.pathname === item.path ? "text-white" : "text-primary"}`} />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="p-8 border-t border-border bg-card/40 space-y-4">
              {user ? (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-foreground/5 border border-border mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                    <p className="text-xs text-foreground/40">מחובר למערכת</p>
                  </div>
                </div>
              ) : null}

              <button
                onClick={async () => { if (user) await signOut(); else navigate("/auth"); setOpen(false); }}
                className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg transition-all active:scale-95 ${user ? "bg-foreground/10 text-foreground hover:bg-destructive hover:text-white" : "bg-primary hover:bg-primary/90 shadow-primary/20"}`}
              >
                {user ? (isRTL ? "התנתק" : "Logout") : (isRTL ? "התחברות" : "Login")}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
