import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, MapPin, Navigation, Info, ShieldCheck,
  Droplets, Sun, Lightbulb, Car, Dog, Users, Clock, CheckCircle2,
  AlertTriangle, Share2, ChevronLeft
} from "lucide-react";
import PeakHoursChart from "@/components/PeakHoursChart";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";
import { useLanguage } from "@/context/LanguageContext";

interface VisitorWithDog extends Tables<"active_garden_visitors"> {
  profiles: { display_name: string; avatar_url: string | null } | null;
  dogs: Tables<"dogs"> | null;
}

const GardenDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [garden, setGarden] = useState<any | null>(null);
  const [myDogs, setMyDogs] = useState<Tables<"dogs">[]>([]);
  const [activeVisitors, setActiveVisitors] = useState<VisitorWithDog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const [checkInStatus, setCheckInStatus] = useState<"arrived" | "on_way">("arrived");

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const { data: gardenData, error: gardenError } = await supabase
        .from("gardens")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (gardenData) {
        setGarden(gardenData);

        const { data: visitorsData } = await supabase
          .from("active_garden_visitors")
          .select(`
            *,
            profiles:user_id (display_name, avatar_url),
            dogs:dog_id (*)
          `)
          .eq("garden_id", id);

        if (visitorsData) setActiveVisitors(visitorsData as any);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: dogsData } = await supabase
          .from("dogs")
          .select("*")
          .eq("owner_id", user.id);
        if (dogsData) setMyDogs(dogsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCheckIn = async () => {
    if (!garden?.id) {
       toast.error(t.gardenDetails.errorCheckIn);
       return;
    }
    if (selectedDogs.length === 0) {
      toast.error(isRTL ? "נא לבחור לפחות כלב אחד" : "Please select at least one dog");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const checkIns = selectedDogs.map(dogId => ({
      user_id: user.id,
      garden_id: id!,
      dog_id: dogId,
      status: checkInStatus,
      expires_at: expiresAt.toISOString(),
    }));

    const { error } = await supabase.from("check_ins").insert(checkIns);

    if (error) {
      toast.error(t.gardenDetails.errorCheckIn);
    } else {
      toast.success(checkInStatus === "arrived" ? t.gardenDetails.arrivedMsg : t.gardenDetails.onWayMsg);
      setIsCheckInOpen(false);
      fetchData();
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] font-bold">{t.gardenDetails.loading}</div>;

  if (!garden) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center" dir={isRTL ? "rtl" : "ltr"}>
      <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-black mb-2">{t.gardenDetails.notFound}</h1>
      <Button onClick={() => navigate("/")} className="rounded-2xl px-8">{t.gardenDetails.back}</Button>
    </div>
  );

  const amenities = [
    { icon: <ShieldCheck className="w-5 h-5" />, label: t.gardenDetails.fence, value: garden.has_fence },
    { icon: <Droplets className="w-5 h-5" />, label: t.gardenDetails.water, value: garden.has_water },
    { icon: <Sun className="w-5 h-5" />, label: t.gardenDetails.shade, value: garden.has_shade },
    { icon: <Lightbulb className="w-5 h-5" />, label: t.gardenDetails.lighting, value: garden.has_lighting },
    { icon: <Car className="w-5 h-5" />, label: t.gardenDetails.parking, value: garden.has_parking },
  ];

  // Logic for display name and location based on language
  const gardenName = !isRTL && garden.name_en ? garden.name_en : garden.name;
  const gardenLocation = !isRTL && garden.location_en ? garden.location_en : garden.location;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: gardenName, url: window.location.href });
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      toast.success(isRTL ? "הקישור הועתק" : "Link copied");
    } catch {
      toast.error(isRTL ? "שיתוף נכשל" : "Share failed");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 pb-12" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
          {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          <span className="font-bold">{t.gardenDetails.back}</span>
        </button>
        <Button variant="ghost" size="icon" onClick={handleShare} className="rounded-full bg-muted/50">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Hero */}
      <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden bg-muted mb-8 shadow-xl">
        {garden.image_url ? (
          <img src={garden.image_url} alt={gardenName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <Dog className="w-20 h-20 text-primary/20" />
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
           <h1 className="text-4xl font-black text-white">{gardenName}</h1>
           <div className="flex items-center gap-2 text-white/80 mt-1">
             <MapPin className="w-4 h-4 text-primary" />
             <span className="text-sm font-medium">{gardenLocation || t.gardenDetails.unknownAddress}</span>
           </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <Button
          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${garden.lat},${garden.lng}`)}
          variant="outline"
          className="h-16 rounded-3xl border-2 border-primary/20 text-primary font-black text-lg"
        >
          <Navigation className={`w-6 h-6 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t.gardenDetails.navBtn}
        </Button>

        <Dialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
          <DialogTrigger asChild>
            <Button className="h-16 rounded-3xl bg-primary text-white font-black text-lg shadow-lg">
              <CheckCircle2 className={`w-6 h-6 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t.gardenDetails.checkIn}
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2rem]" dir={isRTL ? "rtl" : "ltr"}>
            <DialogHeader><DialogTitle className={`${isRTL ? 'text-right' : 'text-left'} text-2xl font-black`}>{t.gardenDetails.checkInTitle}</DialogTitle></DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex gap-2 p-1 bg-muted rounded-2xl">
                <Button variant={checkInStatus === 'arrived' ? 'default' : 'ghost'} className="flex-1 rounded-xl" onClick={() => setCheckInStatus('arrived')}>{t.gardenDetails.statusHere}</Button>
                <Button variant={checkInStatus === 'on_way' ? 'default' : 'ghost'} className="flex-1 rounded-xl" onClick={() => setCheckInStatus('on_way')}>{t.gardenDetails.statusWay}</Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold opacity-70 mb-2">{t.gardenDetails.chooseDogs}</p>
                {myDogs.length > 0 ? myDogs.map(dog => (
                  <div key={dog.id} className="flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer" onClick={() => {
                     if (selectedDogs.includes(dog.id)) setSelectedDogs(selectedDogs.filter(x => x !== dog.id));
                     else setSelectedDogs([...selectedDogs, dog.id]);
                  }}>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2"><AvatarImage src={dog.image_url || ""}/><AvatarFallback><Dog/></AvatarFallback></Avatar>
                      <span className="font-black text-lg">{dog.name}</span>
                    </div>
                    <Checkbox checked={selectedDogs.includes(dog.id)} onCheckedChange={() => {}} />
                  </div>
                )) : (
                  <div className="text-center py-6">
                    <p className="text-sm mb-4">{t.gardenDetails.noDogs}</p>
                    <Button variant="link" onClick={() => navigate("/profile")}>{t.gardenDetails.addDogCta}</Button>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter><Button className="w-full h-14 rounded-2xl text-lg font-black" onClick={handleCheckIn}>{t.gardenDetails.confirmCheckIn}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Visitors */}
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><Users className="text-primary w-7 h-7"/> {t.gardenDetails.whoIsHere} ({activeVisitors.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeVisitors.length > 0 ? activeVisitors.map(v => (
                <Card key={v.id} className="border-none bg-muted/30 rounded-2xl">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="w-14 h-14 border-2 border-white"><AvatarImage src={v.dogs?.image_url || ""}/><AvatarFallback><Dog/></AvatarFallback></Avatar>
                    <div className="flex-grow">
                      <p className="font-black text-lg">{v.dogs?.name}</p>
                      <p className={`text-xs text-muted-foreground font-bold`}>{v.current_status === 'arrived' ? t.gardenDetails.statusHere : t.gardenDetails.statusWay}</p>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full p-8 bg-muted/20 rounded-3xl border-2 border-dashed text-center">
                  <p className="font-bold text-muted-foreground mb-1">{t.gardenDetails.noOneHere}</p>
                  <p className="text-xs opacity-60">{t.gardenDetails.beFirst}</p>
                </div>
              )}
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><Info className="text-primary w-7 h-7"/> {t.gardenDetails.amenities}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {amenities.map((a, i) => (
                <div key={i} className={`p-6 rounded-3xl border-2 flex flex-col items-center transition-all ${a.value ? 'bg-white border-primary/20 shadow-sm' : 'opacity-30 grayscale border-transparent bg-muted'}`}>
                  <div className={`p-3 rounded-full mb-3 ${a.value ? 'bg-primary/10 text-primary' : ''}`}>{a.icon}</div>
                  <span className="text-sm font-black">{a.label}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="rounded-[2.5rem] p-8 border-2 shadow-sm">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2"><Clock className="text-primary"/> {t.gardenDetails.peakHoursTitle}</h3>
            <PeakHoursChart />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GardenDetails;
