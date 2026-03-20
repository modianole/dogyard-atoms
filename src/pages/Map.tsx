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
import { LocateFixed, MapPin, Star, ChevronRight, Search, AlertCircle, RefreshCw, Terminal, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DEFAULT_CENTER = { lat: 32.0853, lng: 34.7818 }; // Tel Aviv Center

const MapPageContent = () => {
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  const [gardens, setGardens] = useState<any[]>([]);
  const [selectedGarden, setSelectedGarden] = useState<any | null>(null);
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState<string>("init");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const apiIsLoaded = useApiIsLoaded();
  const placesLibrary = useMapsLibrary("places");
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);

  // Diagnostic Logs
  const [diag, setDiag] = useState({
    apiKeyPresent: !!GOOGLE_MAPS_API_KEY,
    apiLoaded: false,
    libraryLoaded: false,
    serviceReady: false,
    lastStatus: ""
  });

  useEffect(() => {
    setDiag(prev => ({ ...prev, apiLoaded: apiIsLoaded, libraryLoaded: !!placesLibrary }));
  }, [apiIsLoaded, placesLibrary]);

  const searchGardens = useCallback((location: google.maps.LatLngLiteral) => {
    if (!placesService) return;

    setSearching(true);
    setStatus("searching");

    const request: google.maps.places.PlaceSearchRequest = {
      location: location,
      radius: 5000,
      keyword: 'גינת כלבים dog park'
    };

    placesService.nearbySearch(request, (results, status) => {
      setSearching(false);
      setDiag(prev => ({ ...prev, lastStatus: status }));

      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setStatus("success");
        const formatted = results.map(place => ({
          id: place.place_id!,
          name: place.name!,
          lat: place.geometry!.location!.lat(),
          lng: place.geometry!.location!.lng(),
          rating: place.rating,
          placeId: place.place_id!,
          photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 200 })
        }));
        setGardens(formatted);
      } else {
        setStatus("error");
        setErrorDetails(status);
      }
    });
  }, [placesService]);

  useEffect(() => {
    if (apiIsLoaded && placesLibrary && !placesService) {
      const mapElement = document.createElement('div');
      const service = new google.maps.places.PlacesService(mapElement);
      setPlacesService(service);
      setDiag(prev => ({ ...prev, serviceReady: true }));
    }
  }, [apiIsLoaded, placesLibrary, placesService]);

  useEffect(() => {
    if (placesService) {
      searchGardens(DEFAULT_CENTER);
    }
  }, [placesService, searchGardens]);

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />

      {/* DIAGNOSTIC PANEL - Always visible for now to debug */}
      <div className="pt-20 px-4">
        <div className="bg-card/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-5 gap-4 shadow-2xl">
          <div className="flex items-center gap-2">
            {diag.apiKeyPresent ? <CheckCircle2 className="text-green-500 w-4 h-4" /> : <XCircle className="text-red-500 w-4 h-4" />}
            <span className="text-[10px] text-white uppercase font-bold">API Key</span>
          </div>
          <div className="flex items-center gap-2">
            {diag.apiLoaded ? <CheckCircle2 className="text-green-500 w-4 h-4" /> : <RefreshCw className="text-yellow-500 w-4 h-4 animate-spin" />}
            <span className="text-[10px] text-white uppercase font-bold">Maps API</span>
          </div>
          <div className="flex items-center gap-2">
            {diag.libraryLoaded ? <CheckCircle2 className="text-green-500 w-4 h-4" /> : <RefreshCw className="text-yellow-500 w-4 h-4 animate-spin" />}
            <span className="text-[10px] text-white uppercase font-bold">Places Lib</span>
          </div>
          <div className="flex items-center gap-2">
            {diag.serviceReady ? <CheckCircle2 className="text-green-500 w-4 h-4" /> : <XCircle className="text-red-500 w-4 h-4" />}
            <span className="text-[10px] text-white uppercase font-bold">Service</span>
          </div>
          <div className="bg-black/40 px-3 py-1 rounded-lg flex items-center justify-between col-span-2 md:col-span-1 border border-white/5">
            <span className="text-[10px] text-muted-foreground font-bold">STATUS:</span>
            <span className={`text-[10px] font-black ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {diag.lastStatus || status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 overflow-hidden relative">
        {/* Sidebar */}
        <aside className="w-full md:w-80 lg:w-96 bg-card border border-white/10 rounded-3xl flex flex-col h-[35vh] md:h-full z-10 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/10 bg-white/5">
            <h1 className="text-xl font-black text-white leading-none tracking-tighter">גינות כלבים</h1>
            <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest font-bold">
              {searching ? "מחפש גינות..." : `נמצאו ${gardens.length} גינות`}
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
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 shadow-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-white truncate leading-tight">{garden.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-3 h-3 text-warning fill-warning" />
                      <span className="text-[10px] font-black text-muted-foreground">{garden.rating || '---'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {status === 'error' && (
              <div className="p-8 text-center bg-red-500/10 m-4 rounded-2xl border border-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-red-400 mb-1">שגיאה מגוגל: {errorDetails}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">וודא שה-Places API מופעל ושיש חשבון חיוב פעיל ב-Console.</p>
              </div>
            )}
          </div>
        </aside>

        {/* Map Container */}
        <div className="flex-1 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
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
          </Map>

          <div className="absolute bottom-6 right-6 z-[1000]">
            <Button
              onClick={() => searchGardens(mapCenter)}
              disabled={searching}
              className="bg-primary text-white font-black rounded-2xl shadow-2xl px-6 h-14 flex items-center gap-3 hover:scale-105 transition-all shadow-primary/30"
            >
              <Search className={`w-5 h-5 ${searching ? 'animate-spin' : ''}`} />
              חפש גינות כאן
            </Button>
          </div>
        </div>
      </main>
      <Footer />
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
