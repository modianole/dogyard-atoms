import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/components/theme-provider";
import { App as CapacitorApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import GlassSidebar from "@/components/GlassSidebar";
import LoadingScreen from "@/components/LoadingScreen";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTheme } from "next-themes";

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
import HazardReport from "@/components/HazardReport";

import BottomNav from "./components/layout/BottomNav";
import ProtectedRoute from "./components/ProtectedRoute";
import DeveloperRoute from "./components/DeveloperRoute";

const GlobalBackground = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? (resolvedTheme ?? theme ?? "dark") : (theme ?? "dark");
  const isDark = activeTheme === "dark";

  // החלפת תמונה לפי מצב העיצוב
  const backgroundSrc = isDark
    ? "/TLV VIEW background.jpg"
    : "/TLV_VIEW_DAY.png";

  return (
    <div className="fixed inset-0 -z-20 h-full w-full overflow-hidden bg-background">
      <img
        src={backgroundSrc}
        alt="Background"
        className="h-full w-full object-cover object-center transition-all duration-1000"
        style={{ opacity: isDark ? 0.6 : 0.8 }}
      />
      <div className={cn(
        "absolute inset-0 transition-colors duration-1000",
        isDark ? "bg-black/40" : "bg-white/10"
      )} />
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const isHomePage = location.pathname === "/" || location.pathname === "";
  const isMapPage = location.pathname === "/map";

  useEffect(() => {
    const splashKey = "glass-shell:splash-shown";
    if (!sessionStorage.getItem(splashKey)) {
      sessionStorage.setItem(splashKey, "1");
      setShowLoading(true);
    }
  }, []);

  return (
    <div className={cn(
      "glass-app-shell relative min-h-screen w-full overflow-x-hidden",
      isMapPage && "h-screen overflow-hidden"
    )}>
      {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}
      <GlobalBackground />
      <GlassSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className={cn("relative z-10 flex flex-col", isMapPage ? "h-full" : "min-h-screen")}>
        <main className={cn(
          "relative flex-grow",
          isMapPage ? "h-full overflow-hidden p-0" : "pb-24 md:pb-8 pt-4",
          !isMapPage && !isHomePage && "overflow-y-auto px-3 md:px-6",
        )}>
          <div className={cn(isMapPage ? "h-full w-full" : "mx-auto max-w-6xl")}>
            {children}
          </div>
        </main>
      </div>

      <BottomNav onOpenMenu={() => setSidebarOpen(true)} />
    </div>
  );
};

const queryClient = new QueryClient();

// Feature flags
const ENABLE_ADMIN_ROUTES = (import.meta.env.VITE_ENABLE_ADMIN_ROUTES === "true");
const ENABLE_DOG_SHARE_ROUTE = (import.meta.env.VITE_ENABLE_DOG_SHARE_ROUTE === "true");

const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const setupDeepLinks = async () => {
      CapacitorApp.addListener('appUrlOpen', async (event) => {
        const url = new URL(event.url);

        // Handle auth-callback and reset-password
        if (url.host === 'auth-callback' || url.pathname.includes('reset-password') || url.pathname.includes('auth/callback')) {
          await Browser.close();

          const hash = url.hash.substring(1);
          const params = new URLSearchParams(hash || url.search);

          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const code = params.get('code');

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            if (!error) navigate("/", { replace: true });
          } else if (code) {
            // If we have a code, we can either navigate to /auth/callback inside the app
            // or exchange it right here. Let's navigate to keep logic centralized.
            navigate(`/auth/callback?code=${code}`, { replace: true });
          }
        }
      });
    };
    setupDeepLinks();
    return () => { CapacitorApp.removeAllListeners(); };
  }, [navigate]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/map" element={<Map />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/hazard-report" element={<HazardReport />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
          <Route path="/garden/:id" element={<GardenDetails />} />
          {ENABLE_DOG_SHARE_ROUTE ? <Route path="/dog-share/accept" element={<DogShareAccept />} /> : null}
          {ENABLE_ADMIN_ROUTES ? <Route path="/admin/import" element={<DeveloperRoute><AdminImport /></DeveloperRoute>} /> : null}
          {ENABLE_ADMIN_ROUTES ? <Route path="/admin/gardens" element={<DeveloperRoute><AdminGardens /></DeveloperRoute>} /> : null}
          <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="vite-ui-theme" enableSystem={false}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
