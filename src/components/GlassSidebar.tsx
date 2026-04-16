import { Home, Map, Settings, User, Languages } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import BrandLogo from "@/components/BrandLogo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GlassCard } from "@/components/ui/GlassCard";
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

interface GlassSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlassSidebar = ({ open, onOpenChange }: GlassSidebarProps) => {
  const location = useLocation();
  const { isRTL, language, toggleLanguage, t } = useLanguage();
  const { user } = useAuth();

  const items = [
    { icon: Home, label: t.nav.home, path: "/" },
    { icon: Map, label: t.nav.gardensNearby, path: "/map" },
    { icon: User, label: isRTL ? "פרופיל" : "Profile", path: "/profile" },
    { icon: Settings, label: isRTL ? "הגדרות" : "Settings", path: "/settings" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isRTL ? "right" : "left"}
        className="w-[22rem] border-0 bg-transparent p-0 shadow-none sm:max-w-[22rem]"
      >
        <GlassCard intensity="strong" className="flex h-full flex-col rounded-none p-6 text-white sm:rounded-none">
          <SheetHeader className={cn("mb-8 text-white", isRTL ? "text-right" : "text-left")}>
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <BrandLogo className="h-8 w-8" rounded />
              </div>
              <div>
                <SheetTitle className="font-display text-2xl font-black text-white">{t.appName}</SheetTitle>
                <SheetDescription className="text-white/60">{t.shell.newExperience}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <nav className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200",
                    isRTL && "flex-row-reverse text-right",
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_18px_40px_rgba(16,185,129,0.22)]"
                      : "bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4 pt-8">
            <button
              type="button"
              onClick={toggleLanguage}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10",
                isRTL && "flex-row-reverse text-right",
              )}
            >
              <Languages className="h-4 w-4" />
              <span className="flex-1">{t.shell.switchLanguage}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold">
                {language === "he" ? "EN" : "עב"}
              </span>
            </button>

            <div className={cn("flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 p-4", isRTL && "flex-row-reverse text-right")}>
              <Avatar className="h-11 w-11 border border-white/15 bg-white/10">
                <AvatarFallback className="bg-transparent text-white">
                  {user?.email?.charAt(0).toUpperCase() || "D"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.email || t.shell.guestLabel}
                </p>
                <p className="text-xs text-white/55">{user ? t.shell.accountLabel : t.auth.loginBtn}</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </SheetContent>
    </Sheet>
  );
};

export default GlassSidebar;

