
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/components/theme-provider";
import { App as CapacitorApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { supabase } from "@/integrations/supabase/client";
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

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNav from "./components/layout/BottomNav";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const isHomePage =
    location.pathname === "/" ||
    location.pathname === "" ||
    location.pathname.includes("index.html") ||
    location.pathname.length <= 1;

  const isMapPage = location.pathname === "/map";

  return (
    <div className={`min-h-screen w-full bg-background flex flex-col ${isMapPage ? "h-screen overflow-hidden" : ""}`}>
      {!isHomePage && <Navbar />}

      <main className={`flex-grow relative ${isHomePage ? "" : isMapPage ? "pt-16 pb-16 md:pb-0" : "pt-20 pb-20 md:pb-0"} ${isMapPage ? "overflow-hidden" : "overflow-y-auto"}`}>
        {children}
      </main>

      <BottomNav />
      {!isMapPage && <Footer className="hidden md:block" />}
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
