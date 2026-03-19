import { useParams, useNavigate } from "react-router-dom";
import { useGarden } from "@/hooks/useGardens";
import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin, Navigation, Info, ShieldCheck, Droplets, Sun, Lightbulb, Car } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PeakHoursChart from "@/components/PeakHoursChart";

const GardenDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: garden, isLoading, error } = useGarden(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !garden) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">הגינה לא נמצאה</h1>
        <Button onClick={() => navigate("/")}>חזרה לדף הבית</Button>
      </div>
    );
  }

  const handleNavigate = () => {
    // Open Google Maps for walking directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${garden.lat},${garden.lng}&travelmode=walking`;
    window.open(url, "_blank");
  };

  const amenities = [
    { icon: <ShieldCheck className="w-5 h-5" />, label: "גדר", value: garden.has_fence },
    { icon: <Droplets className="w-5 h-5" />, label: "ברזייה", value: garden.has_water },
    { icon: <Sun className="w-5 h-5" />, label: "צל", value: garden.has_shade },
    { icon: <Lightbulb className="w-5 h-5" />, label: "תאורה", value: garden.has_lighting },
    { icon: <Car className="w-5 h-5" />, label: "חניה", value: garden.has_parking },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-10 container max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
          <span>חזרה</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-muted mb-4">
              {garden.image_url ? (
                <img src={garden.image_url} alt={garden.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <MapPin className="w-12 h-12 text-primary/40" />
                </div>
              )}
            </div>

            <h1 className="text-3xl font-display font-bold mb-2">{garden.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="w-4 h-4" />
              <span>{garden.location}</span>
            </div>

            <Button
              onClick={handleNavigate}
              className="w-full h-12 text-lg gap-2 bg-primary hover:bg-primary/90"
            >
              <Navigation className="w-5 h-5" />
              ניווט רגלי לגינה
            </Button>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                מתקנים בגינה
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border ${
                      item.value ? "bg-primary/5 border-primary/20 text-primary" : "bg-muted/50 border-border text-muted-foreground"
                    }`}
                  >
                    {item.icon}
                    <span className="text-xs mt-2 font-medium">{item.label}</span>
                    <span className="text-[10px] mt-0.5">{item.value ? "יש" : "אין"}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">שעות עומס פופולריות</h2>
              <div className="bg-card border border-border rounded-2xl p-4">
                <PeakHoursChart />
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GardenDetails;
