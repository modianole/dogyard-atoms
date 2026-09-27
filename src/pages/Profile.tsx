
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GlassCard } from "@/components/ui/GlassCard";
import BrandLogo from "@/components/BrandLogo";
import {
  LogOut, Plus, Settings, User, Trash2, Dog,
  Share2, Copy, Shield, Users, Heart, Camera,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Tables, Enums } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Profile = () => {
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [dogs, setDogs] = useState<Tables<"dogs">[]>([]);
  const [activeDogIndex, setActiveDogIndex] = useState(0);
  const [dogMembers, setDogMembers] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [isAddingDog, setIsAddingDog] = useState(false);
  const [isSharingDog, setIsSharingDog] = useState(false);
  const [shareRole, setShareRole] = useState<Enums<"dog_share_role">>("viewer");
  const [shareLink, setShareLink] = useState("");
  const [creatingInvite, setCreatingInvite] = useState(false);
  const [addingDog, setAddingDog] = useState(false);

  const [newDog, setNewDog] = useState({
    name: "",
    breed: "",
    gender: "male" as Enums<"dog_gender">,
    size: "medium" as Enums<"dog_size">
  });

  const navigate = useNavigate();
  const activeDog = dogs[activeDogIndex];

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        navigate("/auth");
        return;
      }
      setCurrentUserId(user.id);

      // 1. Fetch User Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setProfile(profileData || null);

      // 2. Fetch Dogs (Owned or Shared)
      const { data: ownedDogs } = await supabase
        .from("dogs")
        .select("*")
        .eq("owner_id", user.id);

      const { data: sharedMemberships } = await supabase
        .from("dog_profile_members")
        .select("dog_id, dogs(*)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .neq("role", "owner");

      const sharedDogs = (sharedMemberships || []).map(m => m.dogs).filter(Boolean) as Tables<"dogs">[];
      const allDogs = [...(ownedDogs || []), ...sharedDogs];
      setDogs(allDogs);

      // 3. Fetch Members for the Active Dog
      if (allDogs.length > 0) {
        const currentDog = allDogs[activeDogIndex] || allDogs[0];
        const { data: members } = await supabase
          .from("dog_profile_members")
          .select("role, profiles(display_name, avatar_url, phone)")
          .eq("dog_id", currentDog.id)
          .eq("status", "active");
        setDogMembers(members || []);
      }

    } catch (error) {
      console.error("Profile fetch failed", error);
      toast.error("טעינת הנתונים נכשלה");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeDogIndex]);

  const handleAddDog = async () => {
    const dogName = newDog.name.trim();
    if (!dogName) return toast.error("נא להזין שם לכלב");

    setAddingDog(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("פג תוקף החיבור, נא להתחבר מחדש");
        navigate("/auth");
        return;
      }

      // Explicitly include owner_id and ensure enums match English values
      const { error } = await supabase.from("dogs").insert({
        name: dogName,
        breed: newDog.breed.trim() || null,
        gender: newDog.gender,
        size: newDog.size,
        owner_id: user.id
      });

      if (error) {
        console.error("Supabase error adding dog:", error);
        toast.error(`שגיאה: ${error.message || "לא ניתן להוסיף את הכלב כרגע"}`);
      } else {
        toast.success(`${dogName} הצטרף ללהקה!`);
        setIsAddingDog(false);
        setNewDog({ name: "", breed: "", gender: "male", size: "medium" });
        await fetchData();
      }
    } catch (e: any) {
      console.error("Unexpected error:", e);
      toast.error(`שגיאה בלתי צפויה: ${e.message || "נסו שוב"}`);
    } finally {
      setAddingDog(false);
    }
  };

  const handleCreateShareLink = async () => {
    if (!activeDog) return;
    setCreatingInvite(true);
    const { data, error } = await supabase.rpc("create_dog_share_invite", {
      p_dog_id: activeDog.id,
      p_role: shareRole
    });

    if (error) toast.error("שגיאה ביצירת קישור");
    else {
      setShareLink(`${window.location.origin}/dog-share/accept?token=${data}`);
      toast.success("קישור שיתוף נוצר");
    }
    setCreatingInvite(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">טוען...</div>;

  // Empty state: No dogs yet
  if (dogs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4" dir="rtl">
        <GlassCard intensity="strong" glow className="w-full max-w-[320px] p-8 flex flex-col items-center text-center space-y-6">
          <div className="w-36 h-36 flex items-center justify-center">
            <BrandLogo className="w-full h-full animate-pulse" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black italic tracking-tight">ברוכים הבאים!</h1>
            <p className="text-sm text-muted-foreground leading-snug">כדי להתחיל, בואו נוסיף את הכלב הראשון שלכם ללהקה.</p>
          </div>
          <Button
            size="lg"
            className="rounded-full px-8 w-full gap-3 text-2xl font-black bg-[#10b981] hover:bg-[#059669] text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105 h-16 border-b-4 border-[#059669] active:border-b-0 active:translate-y-1"
            onClick={() => setIsAddingDog(true)}
          >
            <Plus className="w-8 h-8 stroke-[3]" /> הוסף כלב
          </Button>
          <AddDogDialog open={isAddingDog} onOpenChange={setIsAddingDog} onAdd={handleAddDog} newDog={newDog} setNewDog={setNewDog} loading={addingDog} />
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-20 px-4 pt-4" dir="rtl">
      <main className="mx-auto max-w-2xl space-y-6">

        {/* Dog Profile Header */}
        <div className="relative">
          {dogs.length > 1 && (
            <div className="flex justify-between items-center mb-4">
               <Button variant="ghost" size="sm" onClick={() => setActiveDogIndex(prev => (prev > 0 ? prev - 1 : dogs.length - 1))}>
                <ChevronRight className="ml-1 w-4 h-4" /> הקודם
              </Button>
              <span className="text-xs font-medium bg-primary/20 text-primary px-3 py-1 rounded-full">
                {activeDogIndex + 1} מתוך {dogs.length} כלבים
              </span>
              <Button variant="ghost" size="sm" onClick={() => setActiveDogIndex(prev => (prev < dogs.length - 1 ? prev + 1 : 0))}>
                הבא <ChevronLeft className="mr-1 w-4 h-4" />
              </Button>
            </div>
          )}

          <GlassCard intensity="strong" glow className="overflow-hidden">
            <div className="h-32 bg-gradient-to-l from-primary/30 to-secondary/30 relative">
               <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 left-4 rounded-full shadow-lg"
                onClick={() => navigate("/settings")}
               >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
            <div className="px-6 pb-6 text-center">
              <div className="relative -mt-16 mb-4 flex justify-center">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  <AvatarImage src={activeDog.image_url || ""} />
                  <AvatarFallback className="bg-muted text-4xl">
                    <Dog className="w-16 h-16 opacity-50" />
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-1/2 translate-x-16 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-background">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <h1 className="text-3xl font-black mb-1">{activeDog.name}</h1>
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                {activeDog.breed || "גזע לא צוין"} • {activeDog.gender === "male" ? "זכר" : "נקבה"}
              </p>

              <div className="flex gap-2 justify-center mt-6">
                <Button variant="outline" className="rounded-full gap-2" onClick={() => setIsSharingDog(true)}>
                  <Share2 className="w-4 h-4" /> שיתוף הכלב
                </Button>
                <Button variant="outline" size="icon" className="rounded-full" onClick={() => setIsAddingDog(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* The Pack Section (Owners/Members) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold italic">הלהקה של {activeDog.name}</h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {dogMembers.map((member, idx) => (
              <GlassCard key={idx} intensity="low" className="p-3 flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={member.profiles?.avatar_url} />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div className="flex-grow text-right">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{member.profiles?.display_name || "משתמש"}</span>
                    {member.role === "owner" && <Shield className="w-3 h-3 text-yellow-500" title="בעלים" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {member.role === "owner" ? "בעלים ראשי" : member.role === "editor" ? "שותף / דוג-ווקר" : "צופה"}
                  </p>
                </div>
                {member.profiles?.phone && (
                   <span className="text-xs bg-muted px-2 py-1 rounded-full">{member.profiles.phone}</span>
                )}
              </GlassCard>
            ))}
          </div>
        </section>

        {/* System Actions */}
        <div className="pt-6 space-y-3">
          <Button variant="ghost" className="w-full text-muted-foreground gap-2" onClick={() => supabase.auth.signOut().then(() => navigate("/auth"))}>
            <LogOut className="w-4 h-4" /> התנתק מהמערכת
          </Button>
        </div>

        {/* Dialogs */}
        <AddDogDialog open={isAddingDog} onOpenChange={setIsAddingDog} onAdd={handleAddDog} newDog={newDog} setNewDog={setNewDog} loading={addingDog} />
        <ShareDogDialog
          open={isSharingDog}
          onOpenChange={setIsSharingDog}
          activeDog={activeDog}
          shareRole={shareRole}
          setShareRole={setShareRole}
          shareLink={shareLink}
          onCreate={handleCreateShareLink}
          loading={creatingInvite}
        />
      </main>
    </div>
  );
};

// Sub-components to keep code clean
const AddDogDialog = ({ open, onOpenChange, onAdd, newDog, setNewDog, loading }: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px] bg-transparent border-none p-0 shadow-2xl overflow-visible" dir="rtl">
      <GlassCard intensity="strong" glow className="p-8 space-y-6 relative overflow-visible border-white/20">
        {/* Logo and Header */}
        <div className="flex flex-col items-center gap-4 -mt-4">
          <div className="p-2 bg-background/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10">
            <BrandLogo className="w-28 h-28 drop-shadow-2xl" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl font-black italic tracking-tighter text-white drop-shadow-md">
              הוספת כלב חדש
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="grid gap-5">
          <div className="space-y-2">
            <Label className="text-sm font-bold mr-1 text-white/90">שם הכלב</Label>
            <Input
              value={newDog.name}
              onChange={e => setNewDog({...newDog, name: e.target.value})}
              placeholder="איך קוראים לו?"
              className="bg-black/40 border-white/10 focus:border-green-500/50 h-12 text-lg rounded-2xl text-white placeholder:text-white/30 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold mr-1 text-white/90">גזע</Label>
            <Input
              value={newDog.breed}
              onChange={e => setNewDog({...newDog, breed: e.target.value})}
              placeholder="למשל: האסקי, מעורב..."
              className="bg-black/40 border-white/10 focus:border-green-500/50 h-12 rounded-2xl text-white placeholder:text-white/30 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold mr-1 text-white/90">מגדר</Label>
              <Select value={newDog.gender} onValueChange={v => setNewDog({...newDog, gender: v})}>
                <SelectTrigger className="bg-black/40 border-white/10 h-12 rounded-2xl text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/10 text-white">
                  <SelectItem value="male">זכר</SelectItem>
                  <SelectItem value="female">נקבה</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold mr-1 text-white/90">גודל</Label>
              <Select value={newDog.size} onValueChange={v => setNewDog({...newDog, size: v})}>
                <SelectTrigger className="bg-black/40 border-white/10 h-12 rounded-2xl text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/10 text-white">
                  <SelectItem value="small">קטן</SelectItem>
                  <SelectItem value="medium">בינוני</SelectItem>
                  <SelectItem value="large">גדול</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button
            onClick={onAdd}
            className="w-full rounded-2xl text-2xl font-black bg-[#10b981] hover:bg-[#059669] text-white shadow-[0_10px_25px_rgba(16,185,129,0.4)] h-16 transition-all hover:scale-[1.03] border-b-4 border-[#065f46] active:border-b-0 active:translate-y-1"
            disabled={loading}
          >
            {loading ? "שומר..." : "בוא נצא לדרך!"}
          </Button>
        </DialogFooter>
      </GlassCard>
    </DialogContent>
  </Dialog>
);

const ShareDogDialog = ({ open, onOpenChange, activeDog, shareRole, setShareRole, shareLink, onCreate, loading }: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]" dir="rtl">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">שתפו את {activeDog?.name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>תפקיד השותף</Label>
          <Select value={shareRole} onValueChange={setShareRole}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="editor">שותף (עריכת פרופיל)</SelectItem>
              <SelectItem value="viewer">צופה (דוג-ווקר / חבר)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {shareLink ? (
          <div className="space-y-2">
            <Label>הקישור מוכן:</Label>
            <div className="flex gap-2">
              <Input value={shareLink} readOnly dir="ltr" className="text-xs" />
              <Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(shareLink); toast.success("הועתק!"); }}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={onCreate} className="w-full" disabled={loading}>
            {loading ? "יוצר קישור..." : "צור קישור הזמנה"}
          </Button>
        )}
      </div>
    </DialogContent>
  </Dialog>
);

export default Profile;
