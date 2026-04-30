import { useCallback, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { CheckCircle2, Loader2, MapPin, Shield, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDeveloperAccess } from "@/hooks/useDeveloperAccess";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

type ImportMode = "dog_gardens" | "protected_spaces";

type Sector = {
  name: string;
  lat: number;
  lng: number;
};

type ImportRecord = {
  googlePlaceId: string;
  name: string;
  nameEn: string | null;
  location: string;
  locationEn: string | null;
  lat: number;
  lng: number;
  rating: number | null;
  reviewsCount: number | null;
  imageUrl: string | null;
  matchedQuery: string;
  matchedSector: string;
  googleTypes: string[];
};

// גוש דן: גינות כלבים
const GUSH_DAN_SECTORS: Sector[] = [
  { name: "תל אביב - הבימה", lat: 32.073, lng: 34.778 },
  { name: "תל אביב - דיזנגוף סנטר", lat: 32.075, lng: 34.775 },
  { name: "תל אביב - נמל תל אביב", lat: 32.095, lng: 34.775 },
  { name: "תל אביב - בבלי", lat: 32.095, lng: 34.795 },
  { name: "תל אביב - כיכר המדינה", lat: 32.086, lng: 34.789 },
  { name: "תל אביב - רמת אביב", lat: 32.118, lng: 34.794 },
  { name: "תל אביב - צהלה", lat: 32.132, lng: 34.825 },
  { name: "תל אביב - הדר יוסף", lat: 32.108, lng: 34.815 },
  { name: "תל אביב - יד אליהו", lat: 32.065, lng: 34.798 },
  { name: "תל אביב - פלורנטין", lat: 32.056, lng: 34.773 },
  { name: "תל אביב - יפו", lat: 32.048, lng: 34.752 },
  { name: "גבעתיים", lat: 32.068, lng: 34.812 },
  { name: "רמת גן", lat: 32.062, lng: 34.825 },
  { name: "חולון", lat: 32.022, lng: 34.785 },
  { name: "בת ים", lat: 32.015, lng: 34.755 },
  { name: "הרצליה", lat: 32.1656, lng: 34.8308 },
];

// אזורים מוגנים: ממ"ד, מקלטים בתל אביב, רמת גן, גבעתיים, הרצליה
const PROTECTED_SPACE_SECTORS: Sector[] = [
  { name: "תל אביב - מרכז", lat: 32.076, lng: 34.775 },
  { name: "תל אביב - צפון", lat: 32.11, lng: 34.79 },
  { name: "תל אביב - דרום", lat: 32.05, lng: 34.765 },
  { name: "תל אביב - מזרח", lat: 32.085, lng: 34.815 },
  { name: "רמת גן", lat: 32.062, lng: 34.825 },
  { name: "גבעתיים", lat: 32.068, lng: 34.812 },
  { name: "הרצליה", lat: 32.1656, lng: 34.8308 },
];

// שאילתות חיפוש
const DOG_GARDEN_QUERIES = ["גינת כלבים", "מתחם כלבים", "dog park", "dog garden"];
const PROTECTED_SPACE_QUERIES = ["ממ\"ד", "מרחב מוגן", "מקלט ציבורי", "public shelter", "bomb shelter"];

const isMostlyLatin = (value?: string | null) => !!value && /[A-Za-z]/.test(value);

const buildFallbackPlaceId = (place: google.maps.places.PlaceResult) => {
  const lat = place.geometry?.location?.lat() ?? 0;
  const lng = place.geometry?.location?.lng() ?? 0;
  const normalizedName = (place.name || "unknown").trim().toLowerCase();
  return `fallback:${normalizedName}:${lat.toFixed(6)}:${lng.toFixed(6)}`;
};

const inferProtectedSpaceType = (record: ImportRecord) => {
  const haystack = `${record.matchedQuery} ${record.googleTypes.join(" ")}`.toLowerCase();

  if (haystack.includes("ממ") || haystack.includes("safe_room")) {
    return "mamad";
  }

  if (haystack.includes("מקלט") || haystack.includes("shelter")) {
    return "public_shelter";
  }

  return "protected_space";
};

const AdminImportContent = () => {
  const { user } = useAuth();
  const { isDeveloper, loading: developerAccessLoading } = useDeveloperAccess();
  const navigate = useNavigate();
  const placesLibrary = useMapsLibrary("places");

  const [dogGardenResults, setDogGardenResults] = useState<ImportRecord[]>([]);
  const [protectedSpaceResults, setProtectedSpaceResults] = useState<ImportRecord[]>([]);
  const [dogGardenLoading, setDogGardenLoading] = useState(false);
  const [protectedSpaceLoading, setProtectedSpaceLoading] = useState(false);
  const [dogGardenImporting, setDogGardenImporting] = useState(false);
  const [protectedSpaceImporting, setProtectedSpaceImporting] = useState(false);
  const [dogGardenStatus, setDogGardenStatus] = useState("");
  const [protectedSpaceStatus, setProtectedSpaceStatus] = useState("");

  const setModeResults = (mode: ImportMode, results: ImportRecord[]) => {
    if (mode === "dog_gardens") {
      setDogGardenResults(results);
      return;
    }

    setProtectedSpaceResults(results);
  };

  const setModeLoading = (mode: ImportMode, value: boolean) => {
    if (mode === "dog_gardens") {
      setDogGardenLoading(value);
      return;
    }

    setProtectedSpaceLoading(value);
  };

  const setModeImporting = (mode: ImportMode, value: boolean) => {
    if (mode === "dog_gardens") {
      setDogGardenImporting(value);
      return;
    }

    setProtectedSpaceImporting(value);
  };

  const setModeStatus = (mode: ImportMode, value: string) => {
    if (mode === "dog_gardens") {
      setDogGardenStatus(value);
      return;
    }

    setProtectedSpaceStatus(value);
  };

  const fetchEnglishPlaceData = useCallback(async (placeId: string) => {
    if (!GOOGLE_MAPS_API_KEY || placeId.startsWith("fallback:")) {
      return null;
    }

    try {
      const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=en`, {
        headers: {
          "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "displayName,formattedAddress",
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as {
        displayName?: { text?: string };
        formattedAddress?: string;
      };

      return {
        nameEn: data.displayName?.text || null,
        locationEn: data.formattedAddress || null,
      };
    } catch {
      return null;
    }
  }, []);

  const runScan = useCallback(async (mode: ImportMode, sectors: Sector[], queries: string[]) => {
    if (!placesLibrary) {
      toast.error("Google Places עדיין נטען. נסו שוב בעוד כמה שניות.");
      return;
    }

    setModeLoading(mode, true);
    setModeResults(mode, []);
    setModeStatus(mode, "מאתחל סריקה...");

    const service = new google.maps.places.PlacesService(document.createElement("div"));
    const collected = new Map<string, ImportRecord>();

    try {
      for (const sector of sectors) {
        for (const query of queries) {
          setModeStatus(mode, `${sector.name} • ${query}`);

          const request: google.maps.places.TextSearchRequest = {
            query,
            location: new google.maps.LatLng(sector.lat, sector.lng),
            radius: 1500,
          };

          await new Promise<void>((resolve) => {
            service.textSearch(request, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                for (const place of results) {
                  const googlePlaceId = place.place_id || buildFallbackPlaceId(place);
                  const lat = place.geometry?.location?.lat() ?? 0;
                  const lng = place.geometry?.location?.lng() ?? 0;
                  const address = place.formatted_address || place.vicinity || sector.name;

                  // Extract first photo URL if available
                  const imageUrl = place.photos && place.photos.length > 0
                    ? place.photos[0].getUrl({ maxWidth: 800, maxHeight: 600 })
                    : null;

                  if (!collected.has(googlePlaceId)) {
                    collected.set(googlePlaceId, {
                      googlePlaceId,
                      name: place.name || query,
                      nameEn: isMostlyLatin(place.name) ? place.name || null : null,
                      location: address,
                      locationEn: isMostlyLatin(address) ? address : null,
                      lat,
                      lng,
                      rating: place.rating ?? null,
                      reviewsCount: place.user_ratings_total ?? null,
                      imageUrl,
                      matchedQuery: query,
                      matchedSector: sector.name,
                      googleTypes: place.types || [],
                    });
                  }
                }
              }

              window.setTimeout(resolve, 250);
            });
          });
        }

        setModeResults(mode, Array.from(collected.values()));
      }

      const baseResults = Array.from(collected.values());
      setModeStatus(mode, "מושך שמות וכתובות באנגלית...");

      const enriched = await Promise.all(
        baseResults.map(async (record) => {
          const englishData = await fetchEnglishPlaceData(record.googlePlaceId);
          return {
            ...record,
            nameEn: englishData?.nameEn || record.nameEn,
            locationEn: englishData?.locationEn || record.locationEn,
          };
        }),
      );

      setModeResults(mode, enriched);
      setModeStatus(mode, "");
      toast.success(`הסריקה הושלמה: ${enriched.length} תוצאות`);
    } catch (error) {
      console.error(error);
      toast.error("הסריקה נכשלה. נסו שוב.");
      setModeStatus(mode, "");
    } finally {
      setModeLoading(mode, false);
    }
  }, [fetchEnglishPlaceData, placesLibrary]);

  const handleBulkImport = async (mode: ImportMode) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!isDeveloper) {
      toast.error("אין הרשאה לביצוע פעולת אדמין זו.");
      return;
    }

    const results = mode === "dog_gardens" ? dogGardenResults : protectedSpaceResults;
    if (results.length === 0) {
      toast.info("אין תוצאות לייבוא.");
      return;
    }

    setModeImporting(mode, true);

    try {
      if (mode === "dog_gardens") {
        const payload: TablesInsert<"gardens">[] = results.map((record) => ({
          google_place_id: record.googlePlaceId,
          name: record.name,
          name_en: record.nameEn,
          location: record.location,
          location_en: record.locationEn,
          lat: record.lat,
          lng: record.lng,
          rating: record.rating ?? 0,
          reviews_count: record.reviewsCount ?? 0,
          image_url: record.imageUrl,
          status: "approved",
          created_by: user.id,
        }));

        const { error } = await supabase
          .from("gardens")
          .upsert(payload, { onConflict: "google_place_id" });

        if (error) throw error;
      } else {
        const payload: TablesInsert<"protected_spaces">[] = results.map((record) => ({
          google_place_id: record.googlePlaceId,
          name: record.name,
          name_en: record.nameEn,
          location: record.location,
          location_en: record.locationEn,
          lat: record.lat,
          lng: record.lng,
          rating: record.rating ?? 0,
          reviews_count: record.reviewsCount ?? 0,
          image_url: record.imageUrl,
          type: inferProtectedSpaceType(record),
          created_by: user.id,
        }));

        const { error } = await supabase
          .from("protected_spaces")
          .upsert(payload, { onConflict: "google_place_id" });

        if (error) throw error;
      }

      setModeResults(mode, []);
      toast.success(mode === "dog_gardens" ? "ייבוא הגינות הושלם בהצלחה" : "ייבוא המרחבים המוגנים הושלם בהצלחה");
    } catch (error: any) {
      console.error("Import failed", error);
      toast.error(`שגיאה בייבוא: ${error.message}`);
    } finally {
      setModeImporting(mode, false);
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
          <p className="text-muted-foreground">עמוד האדמין פתוח רק לחשבון המורשה שהוגדר.</p>
          <Button onClick={() => navigate("/")}>חזרה לעמוד הבית</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-24 min-h-screen text-right" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* כותרת ראשית */}
        <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 p-8 rounded-[2.5rem] border border-border shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
            <Shield className="text-primary w-9 h-9" /> ניהול ייבוא נתונים מגוגל
          </h1>
          <p className="text-muted-foreground">
            שני מסופים נפרדים: גינות כלבים בגוש דן + מרחבים מוגנים בתל אביב, רמת גן, גבעתיים והרצליה.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            ייבוא חוזר יעדכן רשומות קיימות לפי Google Place ID במקום ליצור כפילויות.
          </p>
        </div>

        {!GOOGLE_MAPS_API_KEY && (
          <Card className="p-4 border-destructive/30 bg-destructive/5 text-destructive font-bold">
            חסר `VITE_GOOGLE_MAPS_API_KEY` ולכן המסופים לא יוכלו לבצע סריקה.
          </Card>
        )}

        {/* Tabs למסופים שונים */}
        <Tabs defaultValue="dog-gardens" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 rounded-2xl h-14 p-1 bg-muted">
            <TabsTrigger value="dog-gardens" className="text-base font-bold rounded-xl">🦴 מסוף 1: גינות כלבים</TabsTrigger>
            <TabsTrigger value="protected-spaces" className="text-base font-bold rounded-xl">🛡️ מסוף 2: מרחבים מוגנים</TabsTrigger>
          </TabsList>

          {/* מסוף 1: גינות כלבים */}
          <TabsContent value="dog-gardens" className="space-y-6">
            <Card className="p-8 rounded-[2rem] border border-border shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-green-500 w-7 h-7" />
                <div>
                  <h2 className="text-2xl font-black">גינות כלבים בגוש דן</h2>
                  <p className="text-sm text-muted-foreground">כולל שליפת תמונות, שמות וכתובות באנגלית.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => runScan("dog_gardens", GUSH_DAN_SECTORS, DOG_GARDEN_QUERIES)}
                  disabled={!GOOGLE_MAPS_API_KEY || dogGardenLoading || dogGardenImporting}
                  className="w-full h-16 text-lg font-black rounded-3xl bg-green-600 hover:bg-green-700"
                >
                  {dogGardenLoading ? <Loader2 className="animate-spin ml-2" /> : null}
                  {dogGardenLoading ? "סורק גינות..." : "סרוק גינות כלבים"}
                </Button>

                <Button
                  onClick={() => handleBulkImport("dog_gardens")}
                  disabled={dogGardenResults.length === 0 || dogGardenImporting || dogGardenLoading}
                  className="w-full h-16 text-lg font-black rounded-3xl bg-blue-600 hover:bg-blue-700"
                >
                  {dogGardenImporting ? <Loader2 className="animate-spin ml-2" /> : null}
                  {dogGardenImporting ? "מייבא..." : `ייבא ${dogGardenResults.length} גינות`}
                </Button>
              </div>

              {dogGardenStatus && <p className="mt-4 text-sm font-bold text-green-700 animate-pulse">{dogGardenStatus}</p>}
            </Card>

            {/* רשימת תוצאות */}
            {dogGardenResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dogGardenResults.map((record) => (
                  <Card key={record.googlePlaceId} className="p-4 border-dashed flex gap-4 overflow-hidden">
                    {record.imageUrl && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={record.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-black truncate">{record.name}</p>
                          {record.nameEn && record.nameEn !== record.name && (
                            <p className="text-xs text-muted-foreground truncate" dir="ltr">{record.nameEn}</p>
                          )}
                        </div>
                        <CheckCircle2 className="text-green-500 w-4 h-4 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">{record.location}</p>
                      <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> {record.imageUrl ? "יש תמונה" : "אין תמונה"} • {record.matchedSector}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* מסוף 2: ממ"ד ומקלטים */}
          <TabsContent value="protected-spaces" className="space-y-6">
            <Card className="p-8 rounded-[2rem] border border-border shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-purple-500 w-7 h-7" />
                <div>
                  <h2 className="text-2xl font-black">ממ״דים, מרחבים מוגנים ומקלטים</h2>
                  <p className="text-sm text-muted-foreground">סריקה בדיוק סביב אותם אזורי יעד שביקשת: תל אביב, רמת גן, גבעתיים והרצליה.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => runScan("protected_spaces", PROTECTED_SPACE_SECTORS, PROTECTED_SPACE_QUERIES)}
                  disabled={!GOOGLE_MAPS_API_KEY || protectedSpaceLoading || protectedSpaceImporting}
                  className="w-full h-16 text-lg font-black rounded-3xl bg-purple-600 hover:bg-purple-700"
                >
                  {protectedSpaceLoading ? <Loader2 className="animate-spin ml-2" /> : null}
                  {protectedSpaceLoading ? "סורק מרחבים מוגנים..." : "סרוק מרחבים מוגנים"}
                </Button>

                <Button
                  onClick={() => handleBulkImport("protected_spaces")}
                  disabled={protectedSpaceResults.length === 0 || protectedSpaceImporting || protectedSpaceLoading}
                  className="w-full h-16 text-lg font-black rounded-3xl bg-indigo-600 hover:bg-indigo-700"
                >
                  {protectedSpaceImporting ? <Loader2 className="animate-spin ml-2" /> : null}
                  {protectedSpaceImporting ? "מייבא..." : `ייבא ${protectedSpaceResults.length} מרחבים`}
                </Button>
              </div>

              {protectedSpaceStatus && <p className="mt-4 text-sm font-bold text-purple-700 animate-pulse">{protectedSpaceStatus}</p>}
            </Card>

            {/* רשימת תוצאות */}
            {protectedSpaceResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {protectedSpaceResults.map((record) => (
                  <Card key={record.googlePlaceId} className="p-4 border-dashed flex gap-4 overflow-hidden">
                    {record.imageUrl && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={record.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-black truncate">{record.name}</p>
                        </div>
                        <CheckCircle2 className="text-purple-500 w-4 h-4 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">{record.location}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
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
