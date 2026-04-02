
import { useEffect, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";
import { AlertTriangle, RefreshCcw, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DEFAULT_CENTER = { lat: 32.0853, lng: 34.7818 };

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
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { isRTL } = useLanguage();

  const fetchGardens = useCallback(async () => {
    setLoading(true);
    setErrorDetails(null);
    console.log("🚀 Refreshing gardens data...");

    try {
      const { data, error } = await supabase
        .from("gardens")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log(`✅ Fetched ${data?.length || 0} gardens from Supabase`);

      const formatted: GardenWithStats[] = (data || []).map(g => ({
        id: g.id,
        name: g.name,
        lat: parseFloat(g.lat.toString()),
        lng: parseFloat(g.lng.toString()),
        rating: g.rating,
        image_url: g.image_url,
        active_visitors: 0
      }));

      setGardens(formatted);

      if (formatted.length > 0 && gardens.length === 0) {
        setMapCenter({ lat: formatted[0].lat, lng: formatted[0].lng });
      }

      toast.success(isRTL ? `נטענו ${formatted.length} גינות` : `Loaded ${formatted.length} gardens`);
    } catch (error: any) {
      console.error("❌ Map Fetch Error:", error);
      setErrorDetails(error.message);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [isRTL]);

  useEffect(() => { fetchGardens(); }, [fetchGardens]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertTriangle className="w-16 h-16 text-yellow-500" />
        <h2 className="text-2xl font-black">מפתח API חסר!</h2>
        <Button onClick={() => window.location.reload()}>רענן דף</Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
        <aside className="w-full md:w-80 lg:w-96 bg-card border-t md:border-t-0 md:border-l border-border flex flex-col h-[35vh] md:h-full z-10 overflow-hidden order-2 md:order-1 shadow-2xl">
          <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{isRTL ? "גינות בסביבה" : "Gardens Nearby"}</h1>
              <p className="text-xs text-muted-foreground">{loading ? "מרענן..." : `נמצאו ${gardens.length} גינות`}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={fetchGardens} disabled={loading}>
              <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {gardens.length === 0 && !loading && (
              <div className="p-12 text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-20" />
                לא נמצאו גינות.
              </div>
            )}
            {gardens.map((garden) => (
              <div key={garden.id} onClick={() => { setMapCenter({ lat: garden.lat, lng: garden.lng }); setSelectedGarden(garden); }}
                className={`p-4 hover:bg-muted/50 cursor-pointer ${selectedGarden?.id === garden.id ? 'bg-primary/10 border-l-4 border-primary' : ''}`}>
                <h3 className="font-bold text-sm truncate">{garden.name}</h3>
                <p className="text-[10px] text-muted-foreground">{garden.lat.toFixed(3)}, {garden.lng.toFixed(3)}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 relative order-1 md:order-2 h-[65vh] md:h-full bg-muted">
          <Map defaultCenter={DEFAULT_CENTER} center={mapCenter} defaultZoom={13} onCameraChanged={(ev) => setMapCenter(ev.detail.center)} disableDefaultUI={true} style={{ width: '100%', height: '100%' }}>
            {gardens.map((garden) => (
              <Marker key={garden.id} position={{ lat: garden.lat, lng: garden.lng }} onClick={() => setSelectedGarden(garden)} />
            ))}
          </Map>
          {loading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const MapPage = () => (
  <APIProvider apiKey={GOOGLE_MAPS_API_KEY || ""}>
    <MapPageContent />
  </APIProvider>
);

export default MapPage;
