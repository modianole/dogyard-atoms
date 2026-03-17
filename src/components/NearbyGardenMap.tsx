import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { X, Navigation, Star, MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const userIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "hue-rotate-[200deg] saturate-150",
});

interface Garden {
  id: string | number;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  distance?: number;
}

const GARDENS: Garden[] = [
  { id: 1, name: "גינת הכלבים מאיר", lat: 32.0735, lng: 34.7745, rating: 4.5 },
  { id: 2, name: "גינת הכלבים הירקון", lat: 32.0955, lng: 34.7875, rating: 4.2 },
  { id: 3, name: "גינת הכלבים פלורנטין", lat: 32.0565, lng: 34.7695, rating: 3.8 },
  { id: 4, name: "גינת הכלבים נווה צדק", lat: 32.0605, lng: 34.7665, rating: 4.7 },
  { id: 5, name: "גינת הכלבים רוטשילד", lat: 32.0645, lng: 34.7755, rating: 4.0 },
  { id: 6, name: "גינת הכלבים הצפון הישן", lat: 32.0865, lng: 34.7815, rating: 4.3 },
  { id: 7, name: "גינת הכלבים יפו", lat: 32.0495, lng: 34.7555, rating: 3.9 },
  { id: 8, name: "גינת הכלבים שרונה", lat: 32.0725, lng: 34.7855, rating: 4.6 },
];

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function FlyToUser({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 1.5 });
  }, [position, map]);
  return null;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const NearbyGardenMap = ({ open, onClose }: Props) => {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [gardens, setGardens] = useState<Garden[]>(GARDENS);
  const [loading, setLoading] = useState(false);
  const [nearest, setNearest] = useState<Garden | null>(null);

  const handleLocate = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);

        const withDist = GARDENS.map((g) => ({
          ...g,
          distance: getDistance(coords[0], coords[1], g.lat, g.lng),
        })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

        setGardens(withDist);
        setNearest(withDist[0]);
        setLoading(false);
      },
      () => setLoading(false),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (open) handleLocate();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-card rounded-xl shadow-large overflow-hidden animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-display font-bold text-card-foreground">הגינה הקרובה אליך</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {nearest && (
          <div className="px-4 py-3 bg-primary/10 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-card-foreground">
                {nearest.name}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-warning fill-warning" />
                <span className="text-xs text-muted-foreground">{nearest.rating}</span>
              </div>
            </div>
            {nearest.distance && (
              <span className="text-sm font-bold text-primary">
                {nearest.distance < 1
                  ? `${Math.round(nearest.distance * 1000)} מ׳`
                  : `${nearest.distance.toFixed(1)} ק״מ`}
              </span>
            )}
          </div>
        )}

        <div className="h-[400px]">
          <MapContainer
            center={userPos || [32.0735, 34.7745]}
            zoom={13}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyToUser position={userPos} />
            {userPos && <Marker position={userPos} icon={userIcon}><Popup>אתה כאן</Popup></Marker>}
            {gardens.map((g) => (
              <Marker key={g.id} position={[g.lat, g.lng]}>
                <Popup>
                  <div className="text-right" dir="rtl">
                    <strong>{g.name}</strong>
                    <div className="flex items-center gap-1 mt-1">
                      <span>⭐ {g.rating}</span>
                      {g.distance && (
                        <span className="mr-2 text-xs text-gray-500">
                          {g.distance < 1
                            ? `${Math.round(g.distance * 1000)} מ׳`
                            : `${g.distance.toFixed(1)} ק״מ`}
                        </span>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {gardens[0]?.distance && (
          <div className="max-h-[200px] overflow-y-auto border-t border-border">
            {gardens.slice(0, 5).map((g) => (
              <div key={g.id} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-card-foreground">{g.name}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-warning fill-warning" />
                    <span className="text-xs text-muted-foreground">{g.rating}</span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {g.distance! < 1
                    ? `${Math.round(g.distance! * 1000)} מ׳`
                    : `${g.distance!.toFixed(1)} ק״מ`}
                </span>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-card/80 flex items-center justify-center">
            <span className="text-muted-foreground font-medium">מאתר מיקום...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyGardenMap;
