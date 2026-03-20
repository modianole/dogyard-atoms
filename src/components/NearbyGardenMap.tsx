import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useApiIsLoaded,
  useMapsLibrary
} from "@vis.gl/react-google-maps";
import { X, MapPin, Star, ChevronLeft, LocateFixed, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const TEL_AVIV_CENTER = { lat: 32.0735, lng: 34.7745 };

interface Garden {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
  address?: string;
  placeId: string;
}

const NearbyGardenMapContent = ({ onClose }: { onClose: () => void }) => {
  const [userPos, setUserPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(TEL_AVIV_CENTER);
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [selectedGarden, setSelectedGarden] = useState<Garden | null>(null);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  const apiIsLoaded = useApiIsLoaded();
  const placesLibrary = useMapsLibrary("places");
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);

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
          toast.info("משתמש במיקום ברירת מחדל (GPS כבוי)");
          setLocating(false);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (!userPos) handleLocate();
  }, [handleLocate, userPos]);

  useEffect(() => {
    if (apiIsLoaded && placesLibrary && !placesService) {
      const mapElement = document.createElement('div');
      const service = new google.maps.places.PlacesService(mapElement);
      setPlacesService(service);
    }

    if (placesService && mapCenter) {
      const request: google.maps.places.PlaceSearchRequest = {
        location: mapCenter,
        radius: 5000,
        keyword: 'dog park גינת כלבים',
      };

      placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const formattedGardens = results.map(place => ({
            id: place.place_id!,
            name: place.name!,
            lat: place.geometry!.location!.lat(),
            lng: place.geometry!.location!.lng(),
            rating: place.rating,
            address: place.vicinity,
            placeId: place.place_id!
          }));
          setGardens(formattedGardens);
        }
      });
    }
  }, [apiIsLoaded, placesLibrary, mapCenter, placesService]);

  const handleGardenClick = (placeId: string) => {
    onClose();
    navigate(`/garden/${placeId}`);
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-background/95 backdrop-blur-md" onClick={onClose} />
        <div className="relative bg-card p-8 rounded-3xl border border-destructive/20 shadow-2xl max-w-sm text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-black mb-2">חסר API Key של גוגל</h2>
          <Button onClick={onClose} variant="outline" className="w-full">סגור</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full h-full md:h-auto md:max-w-4xl md:max-h-[90vh] bg-card md:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card shrink-0" dir="rtl">
          <h2 className="text-xl md:text-2xl font-display font-black text-card-foreground text-right">מפת גינות הכלבים</h2>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={handleLocate} disabled={locating} className="h-10 w-10 rounded-full">
              <LocateFixed className={`w-5 h-5 ${locating ? 'animate-spin' : ''}`} />
            </Button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted bg-muted/30">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="flex-1 relative min-h-[300px]">
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
                <div className="bg-blue-500 w-5 h-5 rounded-full border-4 border-white shadow-lg animate-pulse" />
              </AdvancedMarker>
            )}
            {gardens.map((garden) => (
              <AdvancedMarker
                key={garden.id}
                position={{ lat: garden.lat, lng: garden.lng }}
                onClick={() => setSelectedGarden(garden)}
              >
                <div className={`p-2 rounded-2xl shadow-xl border-2 ${selectedGarden?.id === garden.id ? 'bg-primary border-white text-white' : 'bg-white border-primary/20 text-primary'}`}>
                  <MapPin className="w-5 h-5" />
                </div>
              </AdvancedMarker>
            ))}
            {selectedGarden && (
              <InfoWindow
                position={{ lat: selectedGarden.lat, lng: selectedGarden.lng }}
                onCloseClick={() => setSelectedGarden(null)}
              >
                <div className="text-right p-1 min-w-[150px]" dir="rtl">
                  <strong className="text-lg font-black mb-1 text-primary">{selectedGarden.name}</strong>
                  <div className="flex items-center gap-1 mb-3 bg-warning/20 text-warning-foreground px-2 py-0.5 rounded-full text-xs font-black w-fit">
                    <Star className="w-3.5 h-3.5 fill-warning" />
                    <span>{selectedGarden.rating || '---'}</span>
                  </div>
                  <Button className="w-full h-9 font-black bg-primary rounded-xl text-xs" onClick={() => handleGardenClick(selectedGarden.placeId)}>לפרופיל הגינה</Button>
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
