import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TopGardens from "@/components/TopGardens";
import PeakHoursChart from "@/components/PeakHoursChart";
import RestaurantMenu from "@/components/RestaurantMenu";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <Navbar />
      <TopGardens />
      <PeakHoursChart />
      <RestaurantMenu />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Index;
