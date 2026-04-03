import { useEffect, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import { AlertTriangle, RefreshCcw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = "YOUR_MAP_ID";
const DEFAULT_CENTER = { lat: 32.0853, lng: 34.7818 };

interface GardenWithStats {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number | null;
  location: string | null;
}

const MapPageContent = () => {
  const map = useMap();
  const [gardens, setGardens] = useState<GardenWithStats[]>([]);
  const [selectedGarden, setSelectedGarden] = useState<GardenWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchGardens = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gardens")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map(g => ({
        id: g.id,
        name: g.name.replace(/[0-9]/g, '').trim(),
        lat: parseFloat(g.lat.toString()),
        lng: parseFloat(g.lng.toString()),
        rating: g.rating,
        location: g.location
      }));

      setGardens(formatted);
    } catch (error: any) {
      console.error("Map Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGardens(); }, [fetchGardens]);

  const handleSelectGarden = (garden: GardenWithStats) => {
    setSelectedGarden(garden);
    if (map) map.panTo({ lat: garden.lat, lng: garden.lng });
  };

  return (
    <div className="h-full flex flex-col bg-background" dir="rtl">
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
        <aside className="w-full md:w-80 lg:w-96 bg-card border-l border-border flex flex-col h-[40vh] md:h-full z-10 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center shrink-0">
            <div>
              <h1 className="text-xl font-black text-right">גינות בסביבה</h1>
              <p className="text-[10px] text-muted-foreground font-bold text-right">{loading ? "מרענן..." : `נמצאו ${gardens.length} גינות`}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={fetchGardens} disabled={loading} className="rounded-full">
              <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border bg-background">
            {gardens.map((garden) => (
              <div
                key={garden.id}
                onClick={() => handleSelectGarden(garden)}
                className={`p-4 hover:bg-muted/50 transition-all cursor-pointer flex items-center gap-4 ${selectedGarden?.id === garden.id ? 'bg-primary/5 border-r-4 border-primary' : ''}`}
              >
                <div className="w-12 h-12 rounded-full border border-primary/10 overflow-hidden bg-white flex-shrink-0 flex items-center justify-center p-2 shadow-sm">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/616/616408.png"; }}
                  />
                </div>

                <div className="flex-1 min-w-0 text-right">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-black text-sm truncate leading-tight">{garden.name}</h3>
                    {garden.rating && (
                      <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] font-black">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        {garden.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium truncate">{garden.location}</p>
                  {selectedGarden?.id === garden.id && (
                    <Button size="sm" className="w-full rounded-xl font-black text-[10px] h-7 shadow-md mt-2" onClick={(e) => { e.stopPropagation(); navigate(`/garden/${garden.id}`); }}>
                      צפה בפרטים
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 relative h-[60vh] md:h-full">
          <Map
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={13}
            disableDefaultUI={true}
            style={{ width: '100%', height: '100%' }}
            mapId={MAP_ID}
          >
            {gardens.map((garden) => (
              <AdvancedMarker key={garden.id} position={{ lat: garden.lat, lng: garden.lng }} onClick={() => handleSelectGarden(garden)}>
                <div className="relative flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-lg">
                  <div className={`w-9 h-9 ${garden.rating && garden.rating >= 4.7 ? "bg-[#FFD700]" : "bg-primary"} rounded-full rounded-br-none rotate-45 flex items-center justify-center border-2 border-white shadow-xl`}>
                    <div className="-rotate-45 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-black/10">
                      <span className="text-[10px] font-black text-gray-900">{garden.rating ? garden.rating.toFixed(1) : "—"}</span>
                    </div>
                  </div>
                </div>
              </AdvancedMarker>
            ))}
          </Map>
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
