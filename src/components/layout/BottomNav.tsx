import { Home, Map, MapPin, Menu } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface BottomNavProps {
  onOpenMenu: () => void;
}

const BottomNav = ({ onOpenMenu }: BottomNavProps) => {
  const { isRTL, t } = useLanguage();
  const navigate = useNavigate();

  const NavItem = ({ item }: { item: { label: string; icon: typeof Home; path: string } }) => {
    const Icon = item.icon;
    return (
      <NavLink
        to={item.path}
        end={item.path === "/"}
        className={({ isActive }) =>
          cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors duration-200 min-w-[56px]",
            isActive
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-muted-foreground hover:text-foreground",
          )
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-2xl transition-all",
                isActive ? "bg-emerald-500/15 ring-1 ring-emerald-500/40" : "",
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
            </div>
            <span className="text-[10px] font-semibold leading-none">{item.label}</span>
          </>
        )}
      </NavLink>
    );
  };

  const ActionItem = ({
    label,
    icon: Icon,
    onClick,
  }: {
    label: string;
    icon: typeof Home;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors duration-200 min-w-[56px] text-muted-foreground hover:text-foreground"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl transition-all">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-semibold leading-none">{label}</span>
    </button>
  );

  const rtlItems = [
    { type: "action" as const, label: t.nav.menu, icon: Menu, onClick: onOpenMenu },
    { type: "action" as const, label: "לגינה הקרובה", icon: MapPin, onClick: () => navigate("/map") },
    { type: "link" as const, label: "מפות", icon: Map, path: "/map" },
    { type: "link" as const, label: t.nav.home, icon: Home, path: "/" },
  ];

  const ltrItems = [
    { type: "link" as const, label: "Home", icon: Home, path: "/" },
    { type: "link" as const, label: "Maps", icon: Map, path: "/map" },
    { type: "action" as const, label: "Nearest", icon: MapPin, onClick: () => navigate("/map") },
    { type: "action" as const, label: "Menu", icon: Menu, onClick: onOpenMenu },
  ];

  const items = isRTL ? rtlItems : ltrItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-2 mb-2 rounded-3xl glass-surface border-hsla(var(--glass-border)) shadow-lg">
        <div className="flex items-center h-[68px] px-1">
          {items.map((item) =>
            item.type === "link" ? (
              <NavItem key={`${item.type}-${item.path}`} item={item} />
            ) : (
              <ActionItem key={`${item.type}-${item.label}`} label={item.label} icon={item.icon} onClick={item.onClick} />
            ),
          )}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
