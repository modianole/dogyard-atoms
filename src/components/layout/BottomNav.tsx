
import { Home, Map, User, Settings, ShieldAlert, Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useNearestShalter } from "@/hooks/useNearestShalter";
import ProtectedSpacePromptDialog from "@/components/ProtectedSpacePromptDialog";

const BottomNav = () => {
  const location = useLocation();
  const { isRTL } = useLanguage();
  const {
    goToNearestShalter,
    navigateFromManualAddress,
    navigateFromGarden,
    loading: shalterLoading,
    gpsPromptOpen,
    setGpsPromptOpen,
    openLocationSettingsAndRetry,
  } = useNearestShalter();

  const navItems = [
    { label: isRTL ? "בית" : "Home", icon: Home, path: "/" },
    { label: isRTL ? "מפה" : "Map", icon: Map, path: "/map" },
    { label: isRTL ? "הגדרות" : "Settings", icon: Settings, path: "/settings" },
    { label: isRTL ? "פרופיל" : "Profile", icon: User, path: "/profile" },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* 🛡️ Nearest Shelter — center prominent button */}
        <button
          onClick={goToNearestShalter}
          disabled={shalterLoading}
          className="group flex flex-col items-center justify-center flex-1 h-full gap-1.5 rounded-2xl bg-white/95 border border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm disabled:opacity-60 px-2.5 py-1.5 mx-1"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100 transition-colors group-hover:bg-white">
            {shalterLoading
              ? <Loader2 className="w-4 h-4 animate-spin text-red-500" />
              : <ShieldAlert className="w-4 h-4" />
            }
          </span>
          <span className="text-[9px] font-black leading-tight text-red-700 text-center tracking-tight">
            {isRTL ? "למרחב המוגן" : "Protected Space"}
          </span>
        </button>
      </div>
      </nav>

      <ProtectedSpacePromptDialog
        open={gpsPromptOpen}
        onOpenChange={setGpsPromptOpen}
        loading={shalterLoading}
        onTurnOn={() => { void openLocationSettingsAndRetry(); }}
        onManualAddress={navigateFromManualAddress}
        onGarden={navigateFromGarden}
      />
    </>
  );
};

export default BottomNav;
