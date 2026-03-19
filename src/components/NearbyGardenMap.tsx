import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { X, Navigation, Star, MapPin, ChevronLeft } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNearbyGardens } from "@/hooks/useGardens";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Fix default marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
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
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  const { data: gardens = [], isLoading: loadingGardens } = useNearbyGardens(
    userPos?.[0],
    userPos?.[1],
    5000 // 5km radius
  );

  const handleLocate = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (open && !userPos) handleLocate();
  }, [open, userPos]);

  if (!open) return null;

  const nearest = gardens[0];

  const handleGardenClick = (id: string) => {
    onClose();
    navigate(`/garden/${id}`);
  };

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
          <div
            className="px-4 py-3 bg-primary/10 border-b border-border flex items-center justify-between cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={() => handleGardenClick(nearest.id)}
          >
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-card-foreground">
                {nearest.name}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-warning fill-warning" />
                <span className="text-xs text-muted-foreground">{nearest.rating || 0}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary">צפה בפרטים</span>
              <ChevronLeft className="w-4 h-4 text-primary" />
            </div>
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
                  <div className="text-right p-1 flex flex-col items-center" dir="rtl">
                    <strong className="mb-1">{g.name}</strong>
                    <div className="flex items-center gap-1 mb-2">
                      <span>⭐ {g.rating || 0}</span>
                    </div>
                    <Button
                      size="sm"
                      className="h-7 text-xs px-2"
                      onClick={() => handleGardenClick(g.id)}
                    >
                      לדף הגינה
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {gardens.length > 0 && (
          <div className="max-h-[200px] overflow-y-auto border-t border-border">
            {gardens.slice(0, 5).map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleGardenClick(g.id)}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-card-foreground">{g.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-warning fill-warning" />
                      <span className="text-[10px] text-muted-foreground">{g.rating || 0}</span>
                    </div>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}

        {(locating || loadingGardens) && (
          <div className="absolute inset-0 bg-card/80 flex items-center justify-center z-[1000]">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground font-medium">מנתח גינות קרובות...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyGardenMap;
