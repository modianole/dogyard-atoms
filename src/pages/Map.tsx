import { useEffect, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useApiIsLoaded,
  useMapsLibrary,
  MapCameraChangedEvent
} from "@vis.gl/react-google-maps";
import { LocateFixed, MapPin, Star, ChevronRight, Search, Map as MapIcon, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DEFAULT_CENTER = { lat: 32.0853, lng: 34.7818 }; // Tel Aviv Center

interface Garden {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
  userRatingsTotal?: number;
  address?: string;
  placeId: string;
  photoUrl?: string;
}

const MapPageContent = () => {
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  const [userPos, setUserPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [selectedGarden, setSelectedGarden] = useState<Garden | null>(null);
  const [locating, setLocating] = useState(false);
  const [searching, setSearching] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const apiIsLoaded = useApiIsLoaded();
  const placesLibrary = useMapsLibrary("places");
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);

  const searchGardens = useCallback((location: google.maps.LatLngLiteral) => {
    if (!placesService) return;

    setSearching(true);
    setErrorStatus(null);

    const request: google.maps.places.PlaceSearchRequest = {
      location: location,
      radius: 5000,
      keyword: 'גינת כלבים dog park'
    };

    placesService.nearbySearch(request, (results, status) => {
      setSearching(false);

      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const formattedGardens = results.map(place => ({
          id: place.place_id!,
          name: place.name!,
          lat: place.geometry!.location!.lat(),
          lng: place.geometry!.location!.lng(),
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          address: place.vicinity,
          placeId: place.place_id!,
          photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 })
        }));
        setGardens(formattedGardens);
        toast.success(`נמצאו ${results.length} גינות!`);
      } else {
        setErrorStatus(status);
        if (status === 'REQUEST_DENIED') {
          toast.error("גוגל דחה את הבקשה. בדוק אם ה-Places API מופעל.");
        } else if (status === 'ZERO_RESULTS') {
          toast.info("לא נמצאו גינות באזור זה.");
        }
      }
    });
  }, [placesService]);

  const handleLocate = useCallback(async () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserPos(newPos);
          setMapCenter(newPos);
          setLocating(false);
          searchGardens(newPos);
        },
        () => {
          toast.info("משתמש במיקום תל אביב");
          setLocating(false);
          searchGardens(DEFAULT_CENTER);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      searchGardens(DEFAULT_CENTER);
    }
  }, [searchGardens]);

  useEffect(() => {
    if (apiIsLoaded && !placesService && google.maps.places) {
      const mapElement = document.createElement('div');
      const service = new google.maps.places.PlacesService(mapElement);
      setPlacesService(service);
    }
  }, [apiIsLoaded, placesService]);

  useEffect(() => {
    if (placesService) {
      handleLocate();
    }
  }, [placesService, handleLocate]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow flex flex-col md:flex-row pt-20 overflow-hidden relative">
        {/* Error Overlay if Google Fails */}
        {errorStatus && errorStatus !== 'ZERO_RESULTS' && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[2000] bg-destructive/90 text-destructive-foreground px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <AlertCircle className="w-6 h-6" />
            <div className="text-right" dir="rtl">
              <p className="font-black">שגיאה מגוגל: {errorStatus}</p>
              <p className="text-xs opacity-90">וודא שהפעלת את ה-Places API וחיברת כרטיס אשראי ב-Console.</p>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <aside className="w-full md:w-80 lg:w-96 bg-card border-r border-white/10 flex flex-col h-[40vh] md:h-full z-10 shrink-0 shadow-2xl">
          <div className="p-5 border-b border-white/10 bg-black/20">
            <h1 className="text-2xl font-black text-white leading-none">מפת הגינות</h1>
            <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">
              {searching ? "מחפש גינות בסביבה..." : `נמצאו ${gardens.length} גינות`}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-hide">
            {gardens.map((garden) => (
              <div
                key={garden.id}
                onClick={() => {
                  setMapCenter({ lat: garden.lat, lng: garden.lng });
                  setSelectedGarden(garden);
                }}
                className={`p-4 hover:bg-white/5 transition-all cursor-pointer group ${selectedGarden?.id === garden.id ? 'bg-primary/10 border-r-4 border-primary' : ''}`}
              >
                <div className="flex gap-4 text-right" dir="rtl">
                  {garden.photoUrl ? (
                    <img src={garden.photoUrl} alt={garden.name} className="w-16 h-16 rounded-xl object-cover shadow-md shrink-0" />
                  ) : (
                    <div className="bg-primary/20 p-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-lg w-16 h-16 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="font-bold text-base text-white truncate">{garden.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-warning">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold">{garden.rating || '---'}</span>
                      </div>
                      {garden.userRatingsTotal && (
                        <span className="text-[10px] text-muted-foreground">({garden.userRatingsTotal})</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary opacity-50 self-center shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Map Container */}
        <div className="flex-1 relative bg-[#111]">
          <Map
            defaultCenter={DEFAULT_CENTER}
            center={mapCenter}
            onCameraChanged={(ev) => setMapCenter(ev.detail.center)}
            defaultZoom={14}
            mapId="DOGYARD_FULL_MAP"
            disableDefaultUI={true}
            zoomControl={true}
            style={{ width: '100%', height: '100%' }}
          >
            {userPos && (
              <AdvancedMarker position={userPos}>
                <div className="bg-blue-600 w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse" />
              </AdvancedMarker>
            )}

            {gardens.map((garden) => (
              <AdvancedMarker
                key={garden.id}
                position={{ lat: garden.lat, lng: garden.lng }}
                onClick={() => setSelectedGarden(garden)}
              >
                <div className={`p-2 rounded-xl shadow-2xl border-2 transition-all ${selectedGarden?.id === garden.id ? 'bg-primary border-white scale-110 text-white' : 'bg-white border-primary/20 text-primary'}`}>
                  <MapPin className="w-5 h-5" />
                </div>
              </AdvancedMarker>
            ))}

            {selectedGarden && (
              <InfoWindow
                position={{ lat: selectedGarden.lat, lng: selectedGarden.lng }}
                onCloseClick={() => setSelectedGarden(null)}
              >
                <div className="text-right p-1 min-w-[200px]" dir="rtl">
                  <h3 className="font-black text-primary leading-tight">{selectedGarden.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-3 h-3 text-warning fill-warning" />
                    <span className="text-xs font-bold">{selectedGarden.rating}</span>
                  </div>
                  <Button className="w-full h-8 text-xs font-black bg-primary text-white" onClick={() => navigate(`/garden/${selectedGarden.placeId}`)}>לפרופיל הגינה</Button>
                </div>
              </InfoWindow>
            )}
          </Map>

          <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-[1000]">
            <Button onClick={() => searchGardens(mapCenter)} disabled={searching} className="bg-primary text-white font-black rounded-2xl shadow-xl px-6 h-14 flex items-center gap-3">
              <Search className="w-5 h-5" />
              חפש באזור זה
            </Button>
            <Button onClick={handleLocate} disabled={locating} className="h-14 w-14 rounded-2xl shadow-xl bg-black/60 text-white border border-white/10 flex items-center justify-center">
              <LocateFixed className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const MapPage = () => {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center p-8 bg-card rounded-3xl border border-primary/20 max-w-sm">
          <h2 className="text-xl font-black text-primary mb-2">חסר מפתח API</h2>
          <p className="text-muted-foreground text-sm">הוסף VITE_GOOGLE_MAPS_API_KEY ל-.env</p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <MapPageContent />
    </APIProvider>
  );
};

export default MapPage;
