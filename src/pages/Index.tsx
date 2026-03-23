
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import TopGardens from "@/components/TopGardens";
import PeakHoursChart from "@/components/PeakHoursChart";
import RestaurantMenu from "@/components/RestaurantMenu";
import CommunitySection from "@/components/CommunitySection";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* HeroSection handles its own background video and layout */}
      <HeroSection onOpenMap={() => navigate("/map")} />

      {/* Navbar is now placed after the HeroSection */}
      <Navbar />

      <main>
        <TopGardens />
        <PeakHoursChart />
        <RestaurantMenu />
        <CommunitySection />
      </main>
    </div>
  );
};

export default Index;
