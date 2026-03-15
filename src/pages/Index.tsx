import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import TopGardens from "@/components/TopGardens";
import PeakHoursChart from "@/components/PeakHoursChart";
import HazardReport from "@/components/HazardReport";
import RestaurantMenu from "@/components/RestaurantMenu";
import AddGarden from "@/components/AddGarden";
import RestaurantAdmin from "@/components/RestaurantAdmin";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <Navbar />
      <FeaturesGrid />
      <TopGardens />
      <PeakHoursChart />
      <HazardReport />
      <RestaurantMenu />
      <AddGarden />
      <RestaurantAdmin />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Index;
