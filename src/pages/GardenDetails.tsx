
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, MapPin, Navigation, Info, ShieldCheck,
  Droplets, Sun, Lightbulb, Car, Dog, Users, Clock, CheckCircle2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import PeakHoursChart from "@/components/PeakHoursChart";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

interface VisitorWithDog extends Tables<"active_garden_visitors"> {
  profiles: { display_name: string; avatar_url: string | null } | null;
  dogs: Tables<"dogs"> | null;
}

const GardenDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [garden, setGarden] = useState<Tables<"gardens"> | null>(null);
  const [myDogs, setMyDogs] = useState<Tables<"dogs">[]>([]);
  const [activeVisitors, setActiveVisitors] = useState<VisitorWithDog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const [checkInStatus, setCheckInStatus] = useState<"arrived" | "on_way">("arrived");

  const fetchData = async () => {
    if (!id) return;

    // 1. Fetch Garden Details
    const { data: gardenData } = await supabase
      .from("gardens")
      .select("*")
      .eq("id", id)
      .single();

    if (gardenData) setGarden(gardenData);

    // 2. Fetch Active Visitors (Dogs currently in park)
    const { data: visitorsData } = await supabase
      .from("active_garden_visitors")
      .select(`
        *,
        profiles:user_id (display_name, avatar_url),
        dogs:dog_id (*)
      `)
      .eq("garden_id", id);

    if (visitorsData) setActiveVisitors(visitorsData as any);

    // 3. Fetch User's Dogs
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: dogsData } = await supabase
        .from("dogs")
        .select("*")
        .eq("owner_id", user.id);
      if (dogsData) setMyDogs(dogsData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCheckIn = async () => {
    if (selectedDogs.length === 0) {
      toast.error("נא לבחור לפחות כלב אחד");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Stay for 1 hour

    const checkIns = selectedDogs.map(dogId => ({
      user_id: user.id,
      garden_id: id!,
      dog_id: dogId,
      status: checkInStatus,
      expires_at: expiresAt.toISOString(),
    }));

    const { error } = await supabase.from("check_ins").insert(checkIns);

    if (error) {
      toast.error("שגיאה בביצוע צ'ק-אין");
    } else {
      toast.success(checkInStatus === "arrived" ? "תהנו בגינה!" : "נחכה לכם בגינה!");
      setIsCheckInOpen(false);
      fetchData();
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;
  if (!garden) return <div className="min-h-screen flex items-center justify-center">הגינה לא נמצאה</div>;

  const amenities = [
    { icon: <ShieldCheck className="w-5 h-5" />, label: "גדר", value: garden.has_fence },
    { icon: <Droplets className="w-5 h-5" />, label: "ברזייה", value: garden.has_water },
    { icon: <Sun className="w-5 h-5" />, label: "צל", value: garden.has_shade },
    { icon: <Lightbulb className="w-5 h-5" />, label: "תאורה", value: garden.has_lighting },
    { icon: <Car className="w-5 h-5" />, label: "חניה", value: garden.has_parking },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      <div className="pt-20 container max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronRight className="w-5 h-5" />
          <span>חזרה למפה</span>
        </button>

        {/* Header Section */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted mb-6">
          {garden.image_url ? (
            <img src={garden.image_url} alt={garden.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <Dog className="w-16 h-16 text-primary/20" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white text-right" dir="rtl">
            <h1 className="text-3xl font-bold">{garden.name}</h1>
            <div className="flex items-center gap-2 mt-2 opacity-90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{garden.location}</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${garden.lat},${garden.lng}&travelmode=walking`)}
            variant="outline"
            className="h-14 gap-2 rounded-2xl border-primary text-primary hover:bg-primary/5"
          >
            <Navigation className="w-5 h-5" />
            ניווט רגלי
          </Button>

          <Dialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 gap-2 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                <CheckCircle2 className="w-5 h-5" />
                אני כאן / בדרך
              </Button>
            </DialogTrigger>
            <DialogContent className="text-right" dir="rtl">
              <DialogHeader>
                <DialogTitle>מי יוצא לגינה?</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex gap-4 p-2 bg-muted/50 rounded-xl">
                  <Button
                    variant={checkInStatus === "arrived" ? "default" : "ghost"}
                    className="flex-1"
                    onClick={() => setCheckInStatus("arrived")}
                  >
                    כבר כאן
                  </Button>
                  <Button
                    variant={checkInStatus === "on_way" ? "default" : "ghost"}
                    className="flex-1"
                    onClick={() => setCheckInStatus("on_way")}
                  >
                    בדרך
                  </Button>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-bold">בחר כלבים:</p>
                  {myDogs.length > 0 ? (
                    myDogs.map(dog => (
                      <div key={dog.id} className="flex items-center justify-between p-3 border rounded-xl">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={dog.image_url || ""} />
                            <AvatarFallback><Dog className="w-4 h-4" /></AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{dog.name}</span>
                        </div>
                        <Checkbox
                          checked={selectedDogs.includes(dog.id)}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedDogs([...selectedDogs, dog.id]);
                            else setSelectedDogs(selectedDogs.filter(id => id !== dog.id));
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">עליך להוסיף כלב בפרופיל קודם</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCheckIn} className="w-full" disabled={myDogs.length === 0}>
                  אשר צ'ק-אין
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                מי נמצא בגינה עכשיו? ({activeVisitors.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeVisitors.length > 0 ? (
                  activeVisitors.map((visitor) => (
                    <Card key={visitor.id} className="border-none bg-muted/30">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-background">
                          <AvatarImage src={visitor.dogs?.image_url || ""} />
                          <AvatarFallback><Dog /></AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                          <h4 className="font-bold">{visitor.dogs?.name || "כלב דוגיארד"}</h4>
                          <p className="text-[10px] text-muted-foreground">של {visitor.profiles?.display_name || "משתמש"}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${visitor.current_status === 'arrived' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {visitor.current_status === 'arrived' ? 'כבר כאן' : 'בדרך'}
                          </span>
                          <div className="flex items-center gap-1 text-[8px] text-muted-foreground mt-1">
                            <Clock className="w-2 h-2" />
                            עד {new Date(visitor.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted/20 p-8 rounded-2xl text-center col-span-full border-dashed border-2">
                    אין כלבים בגינה כרגע. תהיה הראשון!
                  </p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                מתקנים בגינה
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                      item.value ? "bg-primary/5 border-primary/20 text-primary" : "bg-muted/50 border-border text-muted-foreground opacity-50"
                    }`}
                  >
                    {item.icon}
                    <span className="text-xs mt-2 font-bold">{item.label}</span>
                    <span className="text-[10px] mt-0.5">{item.value ? "קיים" : "חסר"}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">שעות עומס פופולריות</h2>
              <PeakHoursChart />
            </section>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default GardenDetails;
