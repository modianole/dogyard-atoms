import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TopGardens from "@/components/TopGardens";
import PeakHoursChart from "@/components/PeakHoursChart";
import RestaurantMenu from "@/components/RestaurantMenu";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";
import NearbyGardenMap from "@/components/NearbyGardenMap";

const Index = () => {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* HeroSection handles its own background video and layout */}
      <HeroSection onOpenMap={() => setMapOpen(true)} />

      {/* Navbar follows Hero and is sticky */}
      <Navbar />

      <main>
        <TopGardens />
        <PeakHoursChart />
        <RestaurantMenu />
        <CommunitySection />
      </main>

      <Footer />

      {/* Map Modal - Placed at the very end to ensure it covers everything including Navbar */}
      <NearbyGardenMap open={mapOpen} onClose={() => setMapOpen(false)} />
    </div>
  );
};

export default Index;
