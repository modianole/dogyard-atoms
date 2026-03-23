
import { useEffect, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { MapPin, Star, Search, Dog, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DEFAULT_CENTER = { lat: 32.0853, lng: 34.7818 }; // Tel Aviv Center

interface GardenWithStats {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number | null;
  image_url: string | null;
  active_visitors: number;
}

const MapPageContent = () => {
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  const [gardens, setGardens] = useState<GardenWithStats[]>([]);
  const [selectedGarden, setSelectedGarden] = useState<GardenWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  const fetchGardens = useCallback(async () => {
    setLoading(true);
    try {
      const { data: gardensData, error: gardensError } = await supabase
        .from("gardens")
        .select("*");

      if (gardensError) throw gardensError;

      const { data: checkinsData, error: checkinsError } = await supabase
        .from("active_garden_visitors")
        .select("garden_id");

      if (checkinsError) throw checkinsError;

      const formatted: GardenWithStats[] = gardensData.map(g => ({
        id: g.id,
        name: g.name,
        lat: g.lat,
        lng: g.lng,
        rating: g.rating,
        image_url: g.image_url,
        active_visitors: checkinsData?.filter(c => c.garden_id === g.id).length || 0
      }));

      setGardens(formatted);
    } catch (error) {
      console.error("Error fetching map data:", error);
      toast.error(isRTL ? "שגיאה בטעינת נתוני המפה" : "Error loading map data");
    } finally {
      setLoading(false);
    }
  }, [isRTL]);

  useEffect(() => {
    fetchGardens();
  }, [fetchGardens]);

  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(pos);
        },
        () => toast.error(isRTL ? "לא ניתן לגשת למיקום שלך" : "Could not access location")
      );
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
        {/* Sidebar for Mobile & Desktop */}
        <aside className="w-full md:w-80 lg:w-96 bg-card border-t md:border-t-0 md:border-l border-border flex flex-col h-[35vh] md:h-full z-10 overflow-hidden order-2 md:order-1 shadow-2xl">
          <div className="p-4 border-b border-border bg-muted/30">
            <h1 className="text-xl font-bold">{isRTL ? "גינות בסביבה" : "Gardens Nearby"}</h1>
            <p className="text-xs text-muted-foreground">
              {loading
                ? (isRTL ? "טוען גינות..." : "Loading gardens...")
                : (isRTL ? `נמצאו ${gardens.length} גינות פעילות` : `Found ${gardens.length} active gardens`)}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border custom-scrollbar pb-24 md:pb-0">
            {gardens.map((garden) => (
              <div
                key={garden.id}
                onClick={() => {
                  setMapCenter({ lat: garden.lat, lng: garden.lng });
                  setSelectedGarden(garden);
                }}
                className={`p-4 hover:bg-muted/50 transition-all cursor-pointer group ${selectedGarden?.id === garden.id ? 'bg-primary/10 border-r-4 border-primary' : ''}`}
              >
                <div className={`flex gap-4 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? "rtl" : "ltr"}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{garden.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold text-foreground">{garden.rating || '---'}</span>
                      </div>
                      {garden.active_visitors > 0 && (
                        <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                          <Dog className="w-3 h-3" />
                          <span className="text-[10px] font-bold">{garden.active_visitors} {isRTL ? "כלבים" : "dogs"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-primary/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/garden/${garden.id}`);
                    }}
                  >
                    <Navigation className="w-5 h-5 text-primary" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Map Container */}
        <div className="flex-1 overflow-hidden relative order-1 md:order-2 h-[65vh] md:h-full">
          <Map
            defaultCenter={DEFAULT_CENTER}
            center={mapCenter}
            onCameraChanged={(ev) => setMapCenter(ev.detail.center)}
            defaultZoom={14}
            mapId="DOGYARD_APP_MAP"
            disableDefaultUI={true}
            zoomControl={false}
            style={{ width: '100%', height: '100%' }}
          >
            {gardens.map((garden) => (
              <AdvancedMarker
                key={garden.id}
                position={{ lat: garden.lat, lng: garden.lng }}
                onClick={() => setSelectedGarden(garden)}
              >
                <div className={`relative p-2 rounded-full shadow-lg border-2 transition-all duration-300 ${selectedGarden?.id === garden.id ? 'bg-primary border-white scale-125 z-50' : 'bg-white border-primary/20 hover:scale-110'}`}>
                  <MapPin className={`w-5 h-5 ${selectedGarden?.id === garden.id ? 'text-white' : 'text-primary'}`} />
                  {garden.active_visitors > 0 && (
                    <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xl">
                      {garden.active_visitors}
                    </div>
                  )}
                </div>
              </AdvancedMarker>
            ))}
          </Map>

          {/* Map Controls */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3 pointer-events-none items-end">
             <Button
              onClick={handleGetUserLocation}
              className="bg-white text-primary border border-primary/20 rounded-2xl shadow-2xl w-14 h-14 p-0 flex items-center justify-center hover:bg-muted pointer-events-auto active:scale-90 transition-all"
            >
              <Navigation className="w-6 h-6" />
            </Button>

            <div className="flex w-full justify-between items-center gap-3">
              <Button
                onClick={fetchGardens}
                className="bg-primary text-white font-black rounded-2xl shadow-2xl px-8 h-14 flex items-center gap-2 pointer-events-auto hover:bg-primary/90 active:scale-95 transition-all text-lg"
              >
                <Search className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                {isRTL ? "חפש גינות" : "Search Gardens"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const MapPage = () => {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY || ""}>
      <MapPageContent />
    </APIProvider>
  );
};

export default MapPage;
