
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { LogIn, MapPin, Menu, UserRound } from "lucide-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlassCard } from "@/components/ui/GlassCard";
import { LanguageProvider } from "@/context/LanguageContext";
import { useLanguage } from "@/context/LanguageContext";
import { ThemeProvider } from "@/components/theme-provider";
import { App as CapacitorApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import BrandLogo from "@/components/BrandLogo";
import GlassSidebar from "@/components/GlassSidebar";
import LoadingScreen from "@/components/LoadingScreen";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Pages
import Index from "./pages/Index.tsx";
import Map from "./pages/Map.tsx";
import Profile from "./pages/Profile.tsx";
import Settings from "./pages/Settings.tsx";
import Auth from "./pages/Auth.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import NotFound from "./pages/NotFound.tsx";
import GardenDetails from "./pages/GardenDetails.tsx";
import DogShareAccept from "./pages/DogShareAccept.tsx";
import AuthCallback from "./pages/AuthCallback.tsx";
import AdminImport from "./pages/AdminImport.tsx";
import AdminGardens from "./pages/AdminGardens.tsx";
// Note: Notifications.tsx is a placeholder and removed from MVP launch

import BottomNav from "./components/layout/BottomNav";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const isHomePage =
    location.pathname === "/" ||
    location.pathname === "" ||
    location.pathname.includes("index.html") ||
    location.pathname.length <= 1;

  const isMapPage = location.pathname === "/map";

  useEffect(() => {
    const splashKey = "glass-shell:splash-shown";
    if (!sessionStorage.getItem(splashKey)) {
      sessionStorage.setItem(splashKey, "1");
      setShowLoading(true);
    }
  }, []);

  return (
    <div className={cn("glass-app-shell relative min-h-screen w-full overflow-x-hidden", isMapPage && "h-screen overflow-hidden")}>
      {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}
      <GlassSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[10%] h-64 w-64 rounded-full bg-emerald-400/14 blur-[120px]" />
        <div className="absolute bottom-[12%] right-[10%] h-72 w-72 rounded-full bg-teal-400/10 blur-[140px]" />
        <div className="absolute left-1/2 top-[28%] h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-300/8 blur-[110px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className={cn("px-3 pt-3 md:px-6 md:pt-5", isHomePage && "pointer-events-none absolute left-0 right-0 top-0 z-20 bg-transparent")}>
          <GlassCard intensity="strong" className={cn("mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-white", isHomePage && "pointer-events-auto")}>
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label={t.shell.openMenu}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white transition hover:bg-white/14"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link to="/" className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <BrandLogo className="h-7 w-7" rounded />
                </div>
                <div className={cn("hidden sm:block", isRTL && "text-right")}>
                  <p className="font-display text-lg font-black leading-none">{t.appName}</p>
                  <p className="text-xs text-white/65">{t.shell.newExperience}</p>
                </div>
              </Link>
            </div>

            <div className={cn("flex items-center gap-2 sm:gap-3", isRTL && "flex-row-reverse")}>
              <div className="hidden items-center gap-2 rounded-full bg-white/8 px-3 py-2 text-sm text-white/80 sm:flex">
                <MapPin className="h-4 w-4 text-emerald-300" />
                <span>{t.shell.city}</span>
              </div>

              {/* Language & user moved to bottom nav — keep only user avatar here for desktop */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="hidden md:block rounded-full bg-white/8 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/14"
              >
                {language === "he" ? "EN" : "עב"}
              </button>

              <Link
                to={user ? "/profile" : "/auth"}
                className={cn(
                  "flex items-center gap-2 rounded-full bg-white/8 px-3 py-2 text-sm text-white transition hover:bg-white/14",
                  isRTL && "flex-row-reverse",
                )}
              >
                {user ? <UserRound className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                <span className="hidden sm:inline">{user ? t.shell.accountLabel : t.auth.loginBtn}</span>
              </Link>
            </div>
          </GlassCard>
        </header>

        <main
          className={cn(
            "relative flex-grow pb-24 md:pb-8",
            isMapPage ? "overflow-hidden px-3 pt-3 md:px-6" : isHomePage ? "pt-0" : "overflow-y-auto px-3 pt-4 md:px-6",
          )}
        >
          <div className={cn(isHomePage || isMapPage ? "w-full" : "mx-auto max-w-6xl")}>
            {children}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    const setupDeepLinks = async () => {
      CapacitorApp.addListener('appUrlOpen', async (event) => {
        const url = new URL(event.url);
        if (url.host === 'auth-callback' || url.pathname.includes('reset-password')) {
          await Browser.close();
          const hash = url.hash.substring(1);
          const params = new URLSearchParams(hash || url.search);
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          if (access_token && refresh_token) {
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (!error && data.session) {
              toast.success("התחברת בהצלחה!");
              const nextPath = sessionStorage.getItem("auth:next") || "/";
              sessionStorage.removeItem("auth:next");
              window.location.assign(nextPath);
            } else if (error) {
              toast.error("שגיאה בתהליך ההתחברות");
            }
          }
        }
      });
    };

    setupDeepLinks();
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/map" element={<Map />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/dog-share/accept" element={<DogShareAccept />} />
          <Route path="/garden/:id" element={<GardenDetails />} />
          <Route path="/admin/import" element={<AdminImport />} />
          <Route path="/admin/gardens" element={<AdminGardens />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="vite-ui-theme">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
