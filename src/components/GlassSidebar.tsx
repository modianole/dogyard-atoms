import { Home, Map, Settings, User, Languages, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";

import BrandLogo from "@/components/BrandLogo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassSwitch } from "@/components/ui/LiquidGlassSwitch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface GlassSidebarProps { open: boolean; onOpenChange: (open: boolean) => void; }

const GlassSidebar = ({ open, onOpenChange }: GlassSidebarProps) => {
  const location = useLocation();
  const { isRTL, language, toggleLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const items = [
    { icon: Home, label: t.nav.home, path: "/" },
    { icon: Map, label: t.nav.gardensNearby, path: "/map" },
    { icon: User, label: isRTL ? "פרופיל" : "Profile", path: "/profile" },
    { icon: Settings, label: isRTL ? "הגדרות" : "Settings", path: "/settings" },
  ];

  const isDark = theme === "dark";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isRTL ? "right" : "left"} className="w-[22rem] border-0 bg-transparent p-0 shadow-none sm:max-w-[22rem]">
        <GlassCard intensity="strong" className="flex h-full flex-col rounded-none p-6 sm:rounded-none bg-hsla(var(--glass-bg)) text-foreground">
          <SheetHeader className={cn("mb-8", isRTL ? "text-right" : "text-left")}>
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/30">
                <BrandLogo className="h-8 w-8" rounded />
              </div>
              <div>
                <SheetTitle className="font-display text-2xl font-black text-inherit">{t.appName}</SheetTitle>
                <SheetDescription className="text-muted-foreground">{t.shell.newExperience}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <nav className="space-y-2">
            {items.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => onOpenChange(false)}
                className={cn("flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200", isRTL && "flex-row-reverse text-right",
                  location.pathname === item.path
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                    : "glass-item text-foreground/80 hover:bg-emerald-500/10 hover:text-foreground"
                )}>
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-6 pt-8">
            <div className={cn("flex items-center justify-between gap-4 p-4 rounded-3xl glass-item", isRTL && "flex-row-reverse")}>
              <div className={cn("flex flex-col gap-1", isRTL && "text-right")}>
                <span className="text-xs font-bold uppercase tracking-tighter opacity-60">{isDark ? "Dark" : "Light"}</span>
                <span className="text-[10px] opacity-40">{isRTL ? "תאורה" : "Mode"}</span>
              </div>
              <LiquidGlassSwitch
                checked={isDark}
                onChange={() => setTheme(isDark ? "light" : "dark")}
                iconLeft={<Sun className="h-4 w-4" />}
                iconRight={<Moon className="h-4 w-4" />}
              />
            </div>

            <div className={cn("flex items-center justify-between gap-4 p-4 rounded-3xl glass-item", isRTL && "flex-row-reverse")}>
              <div className={cn("flex flex-col gap-1", isRTL && "text-right")}>
                <span className="text-xs font-bold uppercase tracking-tighter opacity-60">{language === "he" ? "HE" : "EN"}</span>
                <span className="text-[10px] opacity-40">{isRTL ? "שפה" : "Lang"}</span>
              </div>
              <LiquidGlassSwitch
                checked={language === "en"}
                onChange={toggleLanguage}
                iconLeft={<span className="text-xs font-bold">עב</span>}
                iconRight={<span className="text-xs font-bold">EN</span>}
              />
            </div>

            <div className={cn("flex items-center gap-3 rounded-2xl glass-item p-4", isRTL && "flex-row-reverse text-right")}>
              <Avatar className="h-11 w-11 border border-hsla(var(--glass-border)) bg-white/20 dark:bg-white/10">
                <AvatarFallback className="bg-transparent text-inherit">{user?.email?.charAt(0).toUpperCase() || "D"}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-inherit">{user?.email || t.shell.guestLabel}</p>
                <p className="text-xs opacity-50">{user ? t.shell.accountLabel : t.auth.loginBtn}</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </SheetContent>
    </Sheet>
  );
};

export default GlassSidebar;
