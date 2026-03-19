import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/LanguageContext";
import { App as CapacitorApp } from "@capacitor/app";
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
    CapacitorApp.addListener('appUrlOpen', async (event) => {
      const url = new URL(event.url);

      // If it's an auth callback (from Google or reset password)
      if (url.host === 'auth-callback' || url.pathname.includes('reset-password')) {
        const hash = url.hash.substring(1); // remove '#'
        if (hash) {
          const { data, error } = await supabase.auth.setSession({
            access_token: new URLSearchParams(hash).get('access_token') || '',
            refresh_token: new URLSearchParams(hash).get('refresh_token') || '',
          });

          if (!error && data.session) {
            console.log("Session set successfully from deep link");
            window.location.assign("/");
          }
        }
      }
    });

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
