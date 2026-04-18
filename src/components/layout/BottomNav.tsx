 import { Home, Map, User, Settings, ShieldAlert, Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useNearestShalter } from "@/hooks/useNearestShalter";
import { useAuth } from "@/hooks/useAuth";
import ProtectedSpacePromptDialog from "@/components/ProtectedSpacePromptDialog";

const BottomNav = () => {
  const location = useLocation();
  const { isRTL, toggleLanguage, language } = useLanguage();
  const { user } = useAuth();
  const {
    goToNearestShalter,
    navigateFromManualAddress,
    navigateFromGarden,
    loading: shalterLoading,
    gpsPromptOpen,
    setGpsPromptOpen,
    openLocationSettingsAndRetry,
  } = useNearestShalter();

  // Right-thumb layout for RTL (Hebrew): right side = primary actions
  // Order RTL: [Settings | Profile | 🛡️Shelter | Map | Home]
  // Order LTR: [Home | Map | 🛡️Shelter | Profile | Settings]

  const leftItems = isRTL
    ? [
        { label: "הגדרות", icon: Settings, path: "/settings" },
        { label: "פרופיל", icon: User, path: "/profile" },
      ]
    : [
        { label: "Home", icon: Home, path: "/" },
        { label: "Map", icon: Map, path: "/map" },
      ];

  const rightItems = isRTL
    ? [
        { label: "מפה", icon: Map, path: "/map" },
        { label: "בית", icon: Home, path: "/" },
      ]
    : [
        { label: "Profile", icon: User, path: "/profile" },
        { label: "Settings", icon: Settings, path: "/settings" },
      ];

  const NavItem = ({ item }: { item: typeof leftItems[0] }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        className={cn(
          "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors duration-200 min-w-[56px]",
          isActive ? "text-emerald-400" : "text-white/55 hover:text-white/90"
        )}
      >
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-2xl transition-all",
          isActive ? "bg-emerald-400/20 ring-1 ring-emerald-400/40" : ""
        )}>
          <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
        </div>
        <span className="text-[10px] font-semibold leading-none">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]">
        {/* Glass bar */}
        <div className="mx-2 mb-2 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_-4px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between h-[68px] px-1">

            {/* Left items */}
            <div className="flex items-center flex-1">
              {leftItems.map((item) => <NavItem key={item.path} item={item} />)}
            </div>

            {/* Center — Shelter CTA (prominent, thumb-friendly) */}
            <button
              onClick={goToNearestShalter}
              disabled={shalterLoading}
              className="group flex flex-col items-center justify-center gap-1 mx-1 px-3 py-2 rounded-2xl bg-red-600/90 hover:bg-red-500 border border-red-400/30 shadow-[0_4px_20px_rgba(220,38,38,0.4)] transition-all active:scale-95 disabled:opacity-60 min-w-[72px]"
            >
              <span className="flex h-8 w-8 items-center justify-center">
                {shalterLoading
                  ? <Loader2 className="w-5 h-5 animate-spin text-white" />
                  : <ShieldAlert className="w-5 h-5 text-white" />
                }
              </span>
              <span className="text-[9px] font-black text-white leading-tight text-center">
                {isRTL ? "מוגן" : "Shelter"}
              </span>
            </button>

            {/* Right items — thumb zone for RTL */}
            <div className="flex items-center flex-1 justify-end">
              {rightItems.map((item) => <NavItem key={item.path} item={item} />)}

              {/* Language toggle — far right edge */}
              <button
                onClick={toggleLanguage}
                className="flex flex-col items-center justify-center gap-1 min-w-[44px] h-full px-1 text-white/55 hover:text-white/90 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/8">
                  <span className="text-[11px] font-bold">{language === "he" ? "EN" : "עב"}</span>
                </div>
              </button>
            </div>
          </div>
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
