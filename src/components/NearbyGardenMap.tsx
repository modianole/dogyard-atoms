import { useEffect, useState, useCallback, useMemo } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useApiIsLoaded,
  useMapsLibrary
} from "@vis.gl/react-google-maps";
import { X, MapPin, Star, LocateFixed, AlertTriangle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useGardens } from "@/hooks/useGardens";
import { useLanguage } from "@/context/LanguageContext";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const TEL_AVIV_CENTER = { lat: 32.0735, lng: 34.7745 };

const NearbyGardenMapContent = ({ onClose }: { onClose: () => void }) => {
  const [userPos, setUserPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(TEL_AVIV_CENTER);
  const [selectedGarden, setSelectedGarden] = useState<any | null>(null);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const isEnglish = language === "en";

  const { data: dbGardens, isLoading: loadingDb } = useGardens();
  const apiIsLoaded = useApiIsLoaded();
  const placesLibrary = useMapsLibrary("places");
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [googleGardens, setGoogleGardens] = useState<any[]>([]);

  const handleLocate = useCallback(async () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserPos(newPos);
          setMapCenter(newPos);
          setLocating(false);
        },
        () => {
          toast.info(isEnglish ? "Using default location (GPS disabled)" : "משתמש במיקום ברירת מחדל (GPS כבוי)");
          setLocating(false);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (!userPos) handleLocate();
  }, [handleLocate, userPos]);

  // Load Google Places as fallback/supplement
  useEffect(() => {
    if (apiIsLoaded && placesLibrary && !placesService) {
      const mapElement = document.createElement('div');
      const service = new google.maps.places.PlacesService(mapElement);
      setPlacesService(service);
    }

    if (placesService && mapCenter) {
      const request: google.maps.places.PlaceSearchRequest = {
        location: mapCenter,
        radius: 2000,
        keyword: 'dog park גינת כלבים',
      };

      placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const formatted = results.map(place => ({
            id: place.place_id,
            name: place.name,
            lat: place.geometry!.location!.lat(),
            lng: place.geometry!.location!.lng(),
            rating: place.rating,
            address: place.vicinity,
            isGoogleOnly: true
          }));
          setGoogleGardens(formatted);
        }
      });
    }
  }, [apiIsLoaded, placesLibrary, mapCenter, placesService]);

  // Merge DB gardens with Google gardens (DB takes priority)
  const allGardens = useMemo(() => {
    const merged = [...(dbGardens || [])];
    googleGardens.forEach(gg => {
      // Simple collision check: if there's a DB garden very close, don't show the google one
      const exists = merged.find(dg =>
        Math.abs(dg.lat - gg.lat) < 0.0001 && Math.abs(dg.lng - gg.lng) < 0.0001
      );
      if (!exists) merged.push(gg);
    });
    return merged;
  }, [dbGardens, googleGardens]);

  const handleGardenClick = (garden: any) => {
    if (garden.isGoogleOnly) {
      toast.info(isEnglish ? "This park is not yet in the full database. Showing basic info." : "גינה זו טרם נוספה למערכת המלאה. מציג מידע בסיסי.");
      // In the future, we could trigger an "Add this garden" flow
    }
    onClose();
    navigate(`/garden/${garden.id}`);
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-background/95 backdrop-blur-md" onClick={onClose} />
        <div className="relative bg-card p-8 rounded-3xl border border-destructive/20 shadow-2xl max-w-sm text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-black mb-2">{isEnglish ? "Google API key is missing" : "חסר API Key של גוגל"}</h2>
          <Button onClick={onClose} variant="outline" className="w-full">{isEnglish ? "Close" : "סגור"}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full h-full md:h-auto md:max-w-4xl md:max-h-[90vh] bg-card md:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card shrink-0" dir={isRTL ? "rtl" : "ltr"}>
          <div>
            <h2 className={`text-xl md:text-2xl font-display font-black text-card-foreground ${isRTL ? "text-right" : "text-left"}`}>{isEnglish ? "Dog parks map" : "מפת גינות הכלבים"}</h2>
            <p className={`text-xs text-muted-foreground ${isRTL ? "text-right" : "text-left"}`}>{isEnglish ? "Find the park closest to you" : "מצא את הגינה הקרובה אליך"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={handleLocate} disabled={locating} className="h-10 w-10 rounded-full border-primary/20">
              <LocateFixed className={`w-5 h-5 ${locating ? 'animate-spin' : 'text-primary'}`} />
            </Button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted bg-muted/30">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 relative min-h-[400px]">
          <Map
            defaultCenter={TEL_AVIV_CENTER}
            center={mapCenter}
            defaultZoom={14}
            mapId="DOGYARD_MAP_ID"
            disableDefaultUI={true}
            zoomControl={true}
            className="w-full h-full"
            onCameraChanged={(ev) => setMapCenter(ev.detail.center)}
          >
            {userPos && (
              <AdvancedMarker position={userPos}>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping" />
                  <div className="bg-blue-600 w-4 h-4 rounded-full border-2 border-white shadow-lg relative z-10" />
                </div>
              </AdvancedMarker>
            )}

            {allGardens.map((garden) => (
              <AdvancedMarker
                key={garden.id}
                position={{ lat: garden.lat, lng: garden.lng }}
                onClick={() => setSelectedGarden(garden)}
              >
                <div className={`p-2.5 rounded-2xl shadow-xl border-2 transition-all transform hover:scale-110 ${
                  selectedGarden?.id === garden.id
                    ? 'bg-primary border-white text-white scale-110'
                    : garden.isGoogleOnly
                      ? 'bg-muted border-muted-foreground/20 text-muted-foreground'
                      : 'bg-white border-primary/20 text-primary'
                }`}>
                  <MapPin className="w-5 h-5" />
                </div>
              </AdvancedMarker>
            ))}

            {selectedGarden && (
              <InfoWindow
                position={{ lat: selectedGarden.lat, lng: selectedGarden.lng }}
                onCloseClick={() => setSelectedGarden(null)}
              >
                <div className={`${isRTL ? "text-right" : "text-left"} p-2 min-w-[180px] space-y-3`} dir={isRTL ? "rtl" : "ltr"}>
                  <div>
                    <strong className="text-lg font-black block text-primary leading-tight">{isEnglish ? (selectedGarden.name_en || selectedGarden.name) : selectedGarden.name}</strong>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">{isEnglish ? (selectedGarden.location_en || selectedGarden.address || selectedGarden.location) : (selectedGarden.address || selectedGarden.location)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-700 px-2 py-0.5 rounded-lg text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-yellow-400" />
                      <span>{selectedGarden.rating?.toFixed(1) || '---'}</span>
                    </div>
                    {!selectedGarden.isGoogleOnly && (
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                        <Info className="w-3 h-3" />
                        {isEnglish ? "Full profile" : "מידע מלא"}
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full h-10 font-bold bg-primary hover:bg-primary/90 text-white rounded-xl text-sm shadow-md"
                    onClick={() => handleGardenClick(selectedGarden)}
                  >
                    {isEnglish ? "Open park profile" : "לפרופיל הגינה"}
                  </Button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
      </div>
    </div>,
    document.body
  );
};

const NearbyGardenMap = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const navbar = document.querySelector('nav');
      if (navbar) navbar.style.display = 'none';
    } else {
      document.body.style.overflow = 'unset';
      const navbar = document.querySelector('nav');
      if (navbar) navbar.style.display = 'flex';
    }
  }, [open]);

  if (!open) return null;

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY || ""}>
      <NearbyGardenMapContent onClose={onClose} />
    </APIProvider>
  );
};

export default NearbyGardenMap;
