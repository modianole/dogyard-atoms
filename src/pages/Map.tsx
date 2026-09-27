import { useEffect, useState, useCallback, useMemo } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import { AlertTriangle, RefreshCcw, Star, Navigation, ArrowRight, ExternalLink, X, Image as ImageIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { formatGardenName } from "@/hooks/useGardens";
import { Geolocation } from "@capacitor/geolocation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = "bf19694246835154";
const DEFAULT_CENTER = { lat: 32.0853, lng: 34.7818 };

const BubblyStar = ({ className, filled = true }: { className?: string; filled?: boolean }) => (
  <Star
    className={cn(className, "filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)] transition-all duration-300")}
    style={{
      color: filled ? "#FFD700" : "#94a3b8",
      fill: filled ? "#FFD700" : "transparent",
      opacity: filled ? 1 : 0.4
    }}
    strokeWidth={filled ? 0.5 : 2}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

interface GardenWithStats {
  id: string;
  name: string;
  name_en: string | null;
  lat: number;
  lng: number;
  rating: number | null;
  location: string | null;
  location_en: string | null;
  image_url: string | null;
  distance?: number;
}

const MapPageContent = () => {
  const map = useMap();
  const [gardens, setGardens] = useState<GardenWithStats[]>([]);
  const [selectedGarden, setSelectedGarden] = useState<GardenWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const { theme, resolvedTheme } = useTheme();
  const isDark = (resolvedTheme || theme) === "dark";
  const isEnglish = language === "en";

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getUserLocation = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000
      });
      const loc = { lat: coordinates.coords.latitude, lng: coordinates.coords.longitude };
      setUserLocation(loc);
      if (map) map.panTo(loc);
      return loc;
    } catch (e) {
      console.warn("Geolocation denied or unavailable", e);
      return null;
    }
  };

  const fetchGardens = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const loc = await getUserLocation();
      const { data, error } = await supabase.from("gardens").select("*");
      if (error) throw error;
      if (!data) return;

      let formatted = data.map(g => {
        const gardenLat = parseFloat(g.lat?.toString() || "0");
        const gardenLng = parseFloat(g.lng?.toString() || "0");
        let distance;
        if (loc) distance = calculateDistance(loc.lat, loc.lng, gardenLat, gardenLng);

        return {
          id: g.id,
          name: formatGardenName(g.name, g.location) || "גינת כלבים",
          name_en: g.name_en ? formatGardenName(g.name_en, g.location_en ?? g.location, "en") : null,
          lat: gardenLat,
          lng: gardenLng,
          rating: g.rating,
          location: g.location,
          location_en: g.location_en,
          image_url: g.image_url,
          distance
        };
      });

      formatted.sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) return a.distance - b.distance;
        return (b.rating || 0) - (a.rating || 0);
      });

      setGardens(formatted);
    } catch (error: any) {
      setErrorMessage(isEnglish ? "Unable to load gardens." : "לא הצלחנו לטעון גינות.");
    } finally {
      setLoading(false);
    }
  }, [isEnglish]);

  useEffect(() => { fetchGardens(); }, [fetchGardens]);

  const filteredGardens = useMemo(() => {
    if (!searchQuery.trim()) return gardens;
    const query = searchQuery.toLowerCase();
    return gardens.filter(g =>
      g.name.toLowerCase().includes(query) ||
      (g.name_en && g.name_en.toLowerCase().includes(query)) ||
      (g.location && g.location.toLowerCase().includes(query)) ||
      (g.location_en && g.location_en.toLowerCase().includes(query))
    );
  }, [gardens, searchQuery]);

  const handleSelectGarden = (garden: GardenWithStats) => {
    setSelectedGarden(garden);
    if (map) {
      map.panTo({ lat: garden.lat, lng: garden.lng });
      if (map.getZoom() < 16) {
        setTimeout(() => map.setZoom(16), 100);
      }
    }
  };

  return (
    <div className="relative h-full min-h-[100svh] overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <div className="absolute inset-0">
        {!GOOGLE_MAPS_API_KEY ? (
          <div className="flex h-full items-center justify-center bg-black/20 p-8 text-center text-white">
            <p>{isEnglish ? "Google Maps API key is missing" : "חסר מפתח API של Google Maps"}</p>
          </div>
        ) : (
          <Map
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={14}
            disableDefaultUI={true}
            style={{ width: '100%', height: '100%' }}
            mapId={MAP_ID}
            colorScheme={isDark ? "DARK" : "LIGHT"}
          >
            {userLocation && (
              <AdvancedMarker position={userLocation}>
                <div className="relative h-6 w-6">
                  <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping" />
                  <div className="h-6 w-6 rounded-full bg-blue-600 border-2 border-white shadow-lg" />
                </div>
              </AdvancedMarker>
            )}

            {filteredGardens.map((garden) => (
              <AdvancedMarker
                key={garden.id}
                position={{ lat: garden.lat, lng: garden.lng }}
                onClick={() => handleSelectGarden(garden)}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full rounded-br-none rotate-45 flex items-center justify-center border-2 border-white shadow-xl transition-all duration-300",
                  selectedGarden?.id === garden.id ? "bg-emerald-500 scale-110" : (garden.rating && garden.rating >= 4.7 ? "bg-[#FFD700]" : "bg-slate-700")
                )}>
                  <div className="-rotate-45">
                    <BubblyStar className="w-6 h-6" />
                  </div>
                </div>
              </AdvancedMarker>
            ))}
          </Map>
        )}
      </div>

      <div className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b to-transparent",
        isDark ? "from-black/60" : "from-white/80",
      )} />

      {/* Top Floating Panel (Selected Garden) */}
      <div className="absolute top-[100px] inset-x-0 z-30 flex justify-center px-4 transition-all duration-500 pointer-events-none">
        {selectedGarden && (
          <div className="pointer-events-auto w-full max-w-4xl">
            <GlassCard className="p-8 flex items-center gap-8 animate-in fade-in slide-in-from-top-4 border-white/20 shadow-2xl">
              <div className="w-32 h-32 rounded-[2rem] bg-white/5 flex-shrink-0 flex items-center justify-center shadow-xl overflow-hidden border border-white/10">
                {selectedGarden.image_url ? (
                  <img
                    src={selectedGarden.image_url}
                    alt={selectedGarden.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <img src="/logo.png" alt="" className="w-10 h-10 object-contain opacity-50" />
                  </div>
                )}
              </div>
              <div className={cn("flex-1 min-w-0", isRTL ? "text-right" : "text-left")}>
                <h3 className="font-black text-4xl truncate leading-tight mb-2 text-foreground">
                  {isEnglish ? (selectedGarden.name_en || selectedGarden.name) : selectedGarden.name}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold opacity-70 truncate">
                    {isEnglish ? selectedGarden.location_en : selectedGarden.location}
                  </span>
                  <div className="h-2 w-2 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />
                  <div className="flex items-center gap-2 rounded-2xl bg-[#FFD700]/20 px-4 py-1.5 border border-[#FFD700]/40 shadow-[0_4px_12px_rgba(255,215,0,0.15)]">
                    <BubblyStar className="w-5 h-5" />
                    <span className="text-xl font-black text-[#E6B800] dark:text-[#FFD700]">
                      {selectedGarden.rating?.toFixed(1) || "—"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGarden(null);
                  }}
                >
                  <X className="w-8 h-8" />
                </Button>
                <Button
                  size="icon"
                  className="h-16 w-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                  onClick={() => navigate(`/garden/${selectedGarden.id}`)}
                >
                  <ArrowRight className={cn("w-10 h-10", isRTL && "rotate-180")} />
                </Button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      <div className="absolute top-6 inset-x-0 z-20 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto">
          <GlassCard className="flex items-center gap-3 px-6 py-3 rounded-full border-white/20 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
               <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-60 leading-none mb-1">{isEnglish ? "Explore" : "גילוי"}</span>
              <div className="flex items-center gap-2 leading-none">
                <span className="text-base font-black text-foreground">{isEnglish ? "Live dog gardens map" : "מפת גינות חיה"}</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-black">
                  {loading ? "..." : gardens.length}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Main Sidebar */}
      <main className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-end px-3 pb-24 pt-20 md:items-start md:px-6 md:pb-8 md:pt-24">
        <div className="pointer-events-auto z-10 flex w-full max-w-md flex-col overflow-hidden rounded-[2rem] glass-surface shadow-2xl text-foreground md:h-[66%] md:w-[24rem] md:max-w-none">
          <div className={cn(
            "flex shrink-0 items-center justify-between border-b border-border/50 px-4 py-4",
            isDark ? "bg-black/20" : "bg-background/70",
          )}>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="text-lg font-black md:text-xl">{isEnglish ? "Nearby Parks" : "גינות קרובות אליך"}</h1>
              <p className="text-[10px] font-bold opacity-60">
                {isEnglish ? "Showing top results" : "מציג את התוצאות הכי רלוונטיות"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={getUserLocation} className="rounded-full glass-item">
                <Navigation className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={fetchGardens} disabled={loading} className="rounded-full glass-item">
                <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-border/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={isEnglish ? "Search by name or address..." : "חיפוש לפי שם או כתובת..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11 bg-white/5 border-white/10 rounded-xl font-medium focus-visible:ring-emerald-500/50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/30 bg-transparent scrollbar-hide">
            {filteredGardens.map((garden) => (
              <div key={garden.id} onClick={() => handleSelectGarden(garden)}
                className={cn("flex cursor-pointer items-center gap-4 border-l-4 border-transparent p-4 transition-all hover:bg-emerald-500/5", selectedGarden?.id === garden.id && "bg-emerald-500/10 border-l-emerald-500")}>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex-shrink-0 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                  {garden.image_url ? (
                    <img src={garden.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <img src="/logo.png" alt="" className="w-full h-full object-contain" />
                  )}
                </div>
                <div className={cn("flex-1 min-w-0", isRTL ? "text-right" : "text-left")}>
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-bold text-base truncate leading-tight text-foreground">{isEnglish ? (garden.name_en || garden.name) : garden.name}</h3>
                    {garden.distance !== undefined && <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{garden.distance < 1 ? `${(garden.distance * 1000).toFixed(0)}m` : `${garden.distance.toFixed(1)}km`}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[#FFD700] drop-shadow-sm">
                      <BubblyStar className="w-4 h-4" />
                      <span className="text-xs font-black">{garden.rating ? garden.rating.toFixed(1) : "—"}</span>
                    </div>
                    <span className="text-[11px] opacity-60 truncate text-muted-foreground">{isEnglish ? garden.location_en : garden.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
