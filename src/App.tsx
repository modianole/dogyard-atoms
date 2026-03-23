
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/LanguageContext";
import { App as CapacitorApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Pages
import Index from "./pages/Index.tsx";
import Map from "./pages/Map.tsx";
import Profile from "./pages/Profile.tsx";
import Settings from "./pages/Settings.tsx";
import Notifications from "./pages/Notifications.tsx";
import Install from "./pages/Install.tsx";
import Download from "./pages/Download.tsx";
import Auth from "./pages/Auth.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Privacy from "./pages/Privacy.tsx";
import NotFound from "./pages/NotFound.tsx";
import GardenDetails from "./pages/GardenDetails.tsx";

// Components
import FeaturesGrid from "./components/FeaturesGrid";
import HazardReport from "./components/HazardReport";
import AddGarden from "./components/AddGarden";
import RestaurantAdmin from "./components/RestaurantAdmin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNav from "./components/layout/BottomNav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // בדיקה רחבה יותר למובייל/Capacitor
  // אם הנתיב הוא ריק, רק סלאש, או מכיל index.html - זה דף הבית
  const isHomePage =
    location.pathname === "/" ||
    location.pathname === "" ||
    location.pathname.includes("index.html") ||
    location.pathname.length <= 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* לא נרנדר את הנבבר כאן אם זה דף הבית, כי הוא מרונדר בתוך Index.tsx מתחת להאדר */}
      {!isHomePage && <Navbar />}

      <main className={`flex-grow ${isHomePage ? "" : "pt-20 pb-20 md:pb-0"}`}>
        {children}
      </main>

      <BottomNav />
      <Footer className="hidden md:block" />
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
              window.location.assign("/");
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/install" element={<Install />} />
          <Route path="/download" element={<Download />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Garden Routes */}
          <Route path="/garden/:id" element={<GardenDetails />} />

          {/* Feature Routes */}
          <Route path="/features" element={<FeaturesGrid />} />
          <Route path="/hazard" element={<HazardReport />} />
          <Route path="/add-garden" element={<AddGarden />} />
          <Route path="/admin" element={<RestaurantAdmin />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
