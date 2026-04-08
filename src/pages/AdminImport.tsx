import { useState, useCallback } from "react";
import { useMapsLibrary, APIProvider } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Save, Loader2, CheckCircle2, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDeveloperAccess } from "@/hooks/useDeveloperAccess";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// 20 נקודות ציון בתל אביב יפו
const TEL_AVIV_SECTORS = [
  { name: "הבימה", lat: 32.0730, lng: 34.7780 }, { name: "דיזנגוף סנטר", lat: 32.0750, lng: 34.7750 },
  { name: "נמל תל אביב", lat: 32.0950, lng: 34.7750 }, { name: "בבלי", lat: 32.0950, lng: 34.7950 },
  { name: "כיכר המדינה", lat: 32.0860, lng: 34.7890 }, { name: "רמת אביב א", lat: 32.1120, lng: 34.7920 },
  { name: "רמת אביב ג", lat: 32.1250, lng: 34.7950 }, { name: "צהלה", lat: 32.1320, lng: 34.8250 },
  { name: "הדר יוסף", lat: 32.1080, lng: 34.8150 }, { name: "יד אליהו", lat: 32.0650, lng: 34.7980 },
  { name: "פלורנטין", lat: 32.0560, lng: 34.7730 }, { name: "נווה צדק", lat: 32.0620, lng: 34.7650 },
  { name: "יפו עתיקה", lat: 32.0520, lng: 34.7520 }, { name: "עג'מי", lat: 32.0380, lng: 34.7500 },
  { name: "קרית שלום", lat: 32.0420, lng: 34.7750 }, { name: "שפירא", lat: 32.0480, lng: 34.7780 },
  { name: "נחלת יצחק", lat: 32.0780, lng: 34.8020 }, { name: "ארלוזורוב", lat: 32.0820, lng: 34.7900 },
  { name: "פארק דרום", lat: 32.0350, lng: 34.8020 }, { name: "אזורי חן", lat: 32.1280, lng: 34.7900 }
];

const GUSH_DAN_SECTORS = [
  { name: "גבעתיים", lat: 32.0680, lng: 34.8120 }, { name: "רמת גן", lat: 32.0620, lng: 34.8250 },
  { name: "חולון", lat: 32.0220, lng: 34.7850 }, { name: "בת ים", lat: 32.0150, lng: 34.7550 }
];

const SEARCH_QUERIES = ["גינת כלבים", "מתחם כלבים"];

const AdminImportContent = () => {
  const { user } = useAuth();
  const { isDeveloper, loading: developerAccessLoading } = useDeveloperAccess();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [activeStatus, setActiveStatus] = useState("");
  const placesLibrary = useMapsLibrary("places");

  const runScan = useCallback(async (sectors: any[]) => {
    if (!placesLibrary) return;
    setLoading(true);
    setResults([]);
    const service = new google.maps.places.PlacesService(document.createElement("div"));
    const allFound: any[] = [];
    const seenIds = new Set<string>();

    for (const sector of sectors) {
      for (const query of SEARCH_QUERIES) {
        setActiveStatus(sector.name);
        const request = {
          query: query,
          location: new google.maps.LatLng(sector.lat, sector.lng),
          radius: 1200,
        };

        await new Promise((resolve) => {
          service.textSearch(request, (res, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && res) {
              res.forEach(place => {
                const id = place.place_id || place.name;
                if (!seenIds.has(id)) {
                  seenIds.add(id);
                  allFound.push(place);
                }
              });
            }
            setTimeout(resolve, 300);
          });
        });
      }
      setResults([...allFound]);
    }
    setLoading(false);
    setActiveStatus("");
    toast.success(`נמצאו ${allFound.length} גינות.`);
  }, [placesLibrary]);

  const handleBulkImport = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!isDeveloper) {
      toast.error("אין הרשאה לביצוע פעולת אדמין זו.");
      return;
    }
    setImporting(true);

    const gardens = results.map(r => ({
      name: r.name,
      location: r.formatted_address || "ישראל",
      lat: r.geometry?.location?.lat() || 0,
      lng: r.geometry?.location?.lng() || 0,
      rating: r.rating || 0,
      reviews_count: r.user_ratings_total || 0
    }));

    try {
      // שימוש ב-insert פשוט ללא תנאי onConflict שגורם לשגיאה
      const { error } = await supabase.from("gardens").insert(gardens);

      if (error) throw error;

      toast.success(`הייבוא הושלם! ${gardens.length} גינות נשמרו.`);
      setResults([]);
      setTimeout(() => navigate("/map"), 1500);
    } catch (e: any) {
      console.error("❌ Import Failed:", e.message);
      toast.error(`שגיאה בייבוא: ${e.message}`);
    } finally {
      setImporting(false);
    }
  };

  if (developerAccessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!isDeveloper) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-black">גישה חסומה</h1>
          <p className="text-muted-foreground">עמוד האדמין פתוח רק לחשבון הבעלים שהוגדר.</p>
          <Button onClick={() => navigate("/")}>חזרה לעמוד הבית</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-24 min-h-screen text-right" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-2xl relative">
          <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
            <Zap className="text-primary" /> ניהול ייבוא גינות (131+)
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button onClick={() => runScan(TEL_AVIV_SECTORS)} disabled={loading || importing} className="h-20 text-xl font-black rounded-3xl">
              {loading && activeStatus ? <Loader2 className="animate-spin ml-2" /> : "סריקה מלאה: תל אביב יפו"}
            </Button>
            <Button onClick={() => runScan(GUSH_DAN_SECTORS)} disabled={loading || importing} variant="outline" className="h-20 text-xl font-black rounded-3xl border-2">
              סריקה: שאר גוש דן
            </Button>
          </div>

          {results.length > 0 && (
            <Button onClick={handleBulkImport} disabled={importing} className="w-full h-16 text-2xl font-black rounded-3xl bg-green-600 hover:bg-green-700">
              {importing ? <Loader2 className="animate-spin" /> : `ייבא ${results.length} גינות לשרת`}
            </Button>
          )}

          {loading && <p className="text-center mt-4 animate-pulse font-bold text-primary">סורק כעת: {activeStatus}...</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {results.map((r, i) => (
            <Card key={i} className="p-4 flex items-center justify-between bg-card/50">
              <span className="text-sm font-bold truncate">{r.name}</span>
              <CheckCircle2 className="text-green-500 w-4 h-4 opacity-30" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminImport = () => (
  <APIProvider apiKey={GOOGLE_MAPS_API_KEY || ""}>
    <AdminImportContent />
  </APIProvider>
);

export default AdminImport;
