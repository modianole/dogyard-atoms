import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/LanguageContext";
import { App as CapacitorApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index.tsx";
import Install from "./pages/Install.tsx";
import Download from "./pages/Download.tsx";
import Auth from "./pages/Auth.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Privacy from "./pages/Privacy.tsx";
import NotFound from "./pages/NotFound.tsx";
import GardenDetails from "./pages/GardenDetails.tsx";

// Components to be used as pages
import FeaturesGrid from "./components/FeaturesGrid";
import HazardReport from "./components/HazardReport";
import AddGarden from "./components/AddGarden";
import RestaurantAdmin from "./components/RestaurantAdmin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { toast } from "sonner";

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-grow pt-20">
      {children}
    </main>
    <Footer />
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Handle deep links for Google Auth and password reset
    const setupDeepLinks = async () => {
      CapacitorApp.addListener('appUrlOpen', async (event) => {
        console.log('App opened with URL:', event.url);
        const url = new URL(event.url);

        // If it's an auth callback (from Google or reset password)
        if (url.host === 'auth-callback' || url.pathname.includes('reset-password')) {
          // Close the external browser if it's still open
          await Browser.close();

          // Supabase tokens are usually in the hash (#access_token=...)
          // but sometimes they might be in the query params (?access_token=...)
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
              console.log("Session set successfully from deep link");
              toast.success("התחברת בהצלחה!");
              window.location.assign("/");
            } else if (error) {
              console.error("Error setting session:", error.message);
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
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/install" element={<Install />} />
            <Route path="/download" element={<Download />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Garden Routes */}
            <Route path="/garden/:id" element={<GardenDetails />} />

            {/* New dedicated routes for Menu items */}
            <Route path="/features" element={<PageWrapper><FeaturesGrid /></PageWrapper>} />
            <Route path="/hazard" element={<PageWrapper><HazardReport /></PageWrapper>} />
            <Route path="/add-garden" element={<PageWrapper><AddGarden /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><RestaurantAdmin /></PageWrapper>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
