
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GlassCard } from "@/components/ui/GlassCard";
import { LogOut, Plus, Settings, User, Trash2, Dog, Share2, Copy } from "lucide-react";
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

const ENABLE_DOG_SHARE_ROUTE = import.meta.env.VITE_ENABLE_DOG_SHARE_ROUTE === "true";

const Profile = () => {
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [dogs, setDogs] = useState<Tables<"dogs">[]>([]);
  const [sharedDogRoles, setSharedDogRoles] = useState<Record<string, Enums<"dog_share_role">>>({});
  const [sharedMembersCount, setSharedMembersCount] = useState<Record<string, number>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingDog, setIsAddingDog] = useState(false);
  const [isSharingDog, setIsSharingDog] = useState(false);
  const [selectedDogForShare, setSelectedDogForShare] = useState<Tables<"dogs"> | null>(null);
  const [shareRole, setShareRole] = useState<Enums<"dog_share_role">>("viewer");
  const [shareLink, setShareLink] = useState("");
  const [creatingInvite, setCreatingInvite] = useState(false);
  const [addingDog, setAddingDog] = useState(false);
  const [deletingDogId, setDeletingDogId] = useState<string | null>(null);
  const [newDog, setNewDog] = useState({
    name: "",
    breed: "",
    gender: "male" as Enums<"dog_gender">,
    size: "medium" as Enums<"dog_size">
  });

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/auth");
        return;
      }

      setCurrentUserId(user.id);

      // `maybeSingle` allows first-login users without a profile row yet.
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        toast.error("שגיאה בטעינת הפרופיל");
      }
      setProfile(profileData || null);

      const { data: ownedDogsData, error: ownedDogsError } = await supabase
        .from("dogs")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (ownedDogsError) {
        toast.error("שגיאה בטעינת הכלבים");
      }

      const ownedDogs = ownedDogsData || [];

      const { data: membershipsData } = await supabase
        .from("dog_profile_members")
        .select("dog_id, role, status, dogs(*)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .neq("role", "owner");

      const sharedRolesMap: Record<string, Enums<"dog_share_role">> = {};
      const sharedDogs = (membershipsData || [])
        .map((membership: any) => {
          if (!membership?.dogs) return null;
          sharedRolesMap[membership.dog_id] = membership.role;
          return membership.dogs as Tables<"dogs">;
        })
        .filter(Boolean) as Tables<"dogs">[];

      const mergedDogs = [...ownedDogs, ...sharedDogs];
      const uniqueDogs = Array.from(new Map(mergedDogs.map((dog) => [dog.id, dog])).values());

      const membersCountMap: Record<string, number> = {};
      if (ownedDogs.length > 0) {
        const { data: membersData } = await supabase
          .from("dog_profile_members")
          .select("dog_id")
          .in("dog_id", ownedDogs.map((dog) => dog.id))
          .eq("status", "active")
          .neq("role", "owner");

        (membersData || []).forEach((member) => {
          membersCountMap[member.dog_id] = (membersCountMap[member.dog_id] || 0) + 1;
        });
      }

      setDogs(uniqueDogs);
      setSharedDogRoles(sharedRolesMap);
      setSharedMembersCount(membersCountMap);
    } catch (error) {
      console.error("Profile fetch failed", error);
      toast.error("טעינת הפרופיל נכשלה");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleAddDog = async () => {
    const normalizedName = newDog.name.trim();
    if (!normalizedName) {
      toast.error("נא להזין את שם הכלב");
      return;
    }

    if (addingDog) return;

    setAddingDog(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setAddingDog(false);
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("dogs").insert({
      name: normalizedName,
      breed: newDog.breed.trim() || null,
      gender: newDog.gender,
      size: newDog.size,
      owner_id: user.id
    });

    if (error) {
      toast.error("שגיאה בהוספת הכלב");
      console.error(error);
    } else {
      toast.success(`${normalizedName} נוסף ללהקה!`);
      setIsAddingDog(false);
      setNewDog({ name: "", breed: "", gender: "male", size: "medium" });
      await fetchData();
    }

    setAddingDog(false);
  };

  const handleDeleteDog = async (id: string) => {
    if (deletingDogId) return;
    if (!currentUserId) return;
    const dog = dogs.find((item) => item.id === id);
    if (!dog || dog.owner_id !== currentUserId) {
      toast.error("רק הבעלים יכול להסיר את הכלב");
      return;
    }

    setDeletingDogId(id);
    const { error } = await supabase.from("dogs").delete().eq("id", id);
    if (error) {
      toast.error("שגיאה במחיקת הכלב");
    } else {
      toast.success("הכלב הוסר בהצלחה");
      await fetchData();
    }
    setDeletingDogId(null);
  };

  const openShareDialog = (dog: Tables<"dogs">) => {
    setSelectedDogForShare(dog);
    setShareRole("viewer");
    setShareLink("");
    setIsSharingDog(true);
  };

  const handleCreateShareLink = async () => {
    if (!selectedDogForShare) return;

    setCreatingInvite(true);
    const { data, error } = await supabase.rpc("create_dog_share_invite", {
      p_dog_id: selectedDogForShare.id,
      p_role: shareRole,
      p_expires_in_hours: 48,
    });

    if (error || !data) {
      toast.error("לא הצלחנו ליצור קישור שיתוף כרגע");
      setCreatingInvite(false);
      return;
    }

    const inviteUrl = `${window.location.origin}/dog-share/accept?token=${data}`;
    setShareLink(inviteUrl);
    toast.success("קישור השיתוף נוצר בהצלחה");
    setCreatingInvite(false);
  };

  const copyShareLink = async () => {
    if (!shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("הקישור הועתק");
    } catch {
      toast.error("לא הצלחנו להעתיק את הקישור");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">טוען...</div>;

  return (
    <div className="min-h-full pb-6">
      <main className="mx-auto max-w-4xl space-y-6 px-1 pt-2 md:px-0">
        {/* Profile Header */}
        <GlassCard intensity="strong" glow>
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-2 border-primary">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="text-2xl">
                  {profile?.display_name?.charAt(0) || <User />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h1 className="text-2xl font-bold">{profile?.display_name || "משתמש דוגיארד"}</h1>
                <p className="text-muted-foreground">{profile?.phone || "אין מספר טלפון"}</p>
              </div>
              <Button variant="outline" size="icon" onClick={() => navigate("/settings")}>
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
        </GlassCard>

        {/* Dogs Section */}
        <GlassCard intensity="medium" className="space-y-4 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">הכלבים שלי ומשותפים ({dogs.length})</h2>
            <Dialog open={isAddingDog} onOpenChange={setIsAddingDog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="w-4 h-4" /> הוסף כלב
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>הוספת כלב חדש</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 text-right" dir="rtl">
                  <div className="grid gap-2">
                    <Label htmlFor="name">שם הכלב</Label>
                    <Input
                      id="name"
                      value={newDog.name}
                      onChange={(e) => setNewDog({...newDog, name: e.target.value})}
                      placeholder="למשל: ברונו"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="breed">גזע</Label>
                    <Input
                      id="breed"
                      value={newDog.breed}
                      onChange={(e) => setNewDog({...newDog, breed: e.target.value})}
                      placeholder="למשל: גולדן רטריבר"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>מגדר</Label>
                      <Select
                        value={newDog.gender || "male"}
                        onValueChange={(v: Enums<"dog_gender">) => setNewDog({...newDog, gender: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">זכר</SelectItem>
                          <SelectItem value="female">נקבה</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>גודל</Label>
                      <Select
                        value={newDog.size || "medium"}
                        onValueChange={(v: Enums<"dog_size">) => setNewDog({...newDog, size: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">קטן</SelectItem>
                          <SelectItem value="medium">בינוני</SelectItem>
                          <SelectItem value="large">גדול</SelectItem>
                          <SelectItem value="giant">ענק</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddDog} className="w-full" disabled={addingDog}>{addingDog ? "שומר..." : "שמור כלב"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dogs.length > 0 ? (
              dogs.map((dog) => (
                <Card key={dog.id} className="relative overflow-hidden group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      {dog.image_url ? (
                        <img src={dog.image_url} alt={dog.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <Dog className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {dog.name}
                        {sharedDogRoles[dog.id] && (
                          <span className="text-[10px] bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded-full">
                            משותף איתך ({sharedDogRoles[dog.id] === "viewer" ? "צפייה" : "עריכה"})
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{dog.breed || "גזע לא צוין"}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">
                          {dog.gender === "male" ? "זכר" : "נקבה"}
                        </span>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">
                          {dog.size === "small" ? "קטן" : dog.size === "medium" ? "בינוני" : dog.size === "large" ? "גדול" : "ענק"}
                        </span>
                        {dog.owner_id === currentUserId && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {sharedMembersCount[dog.id] || 0} שותפים
                          </span>
                        )}
                      </div>
                    </div>

                    {ENABLE_DOG_SHARE_ROUTE && dog.owner_id === currentUserId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary"
                        onClick={() => openShareDialog(dog)}
                        title="שתף פרופיל"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    )}

                    {dog.owner_id === currentUserId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={deletingDogId === dog.id}
                        className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteDog(dog.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-dashed border-2 flex flex-col items-center justify-center p-12 bg-muted/20 text-center col-span-full">
                <Dog className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground font-medium">עוד לא הוספת כלבים ללהקה שלך</p>
                <p className="text-xs text-muted-foreground mt-1">הוסף את הכלב הראשון שלך כדי להתחיל!</p>
              </Card>
            )}
          </div>
        </GlassCard>

        {ENABLE_DOG_SHARE_ROUTE ? <Dialog open={isSharingDog} onOpenChange={setIsSharingDog}>
          <DialogContent className="sm:max-w-[520px]" dir="rtl">
            <DialogHeader>
              <DialogTitle>
                שיתוף פרופיל כלב{selectedDogForShare ? `: ${selectedDogForShare.name}` : ""}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>הרשאת גישה</Label>
                <Select
                  value={shareRole}
                  onValueChange={(value: Enums<"dog_share_role">) => setShareRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">צפייה בלבד</SelectItem>
                    <SelectItem value="editor">עריכה ועדכון</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-xs text-muted-foreground">
                הקישור תקף ל-48 שעות. מי שמקבל את הקישור יוכל להצטרף לפרופיל הכלב לפי ההרשאה שבחרת.
              </p>

              {shareLink && (
                <div className="grid gap-2">
                  <Label>קישור שיתוף</Label>
                  <div className="flex gap-2">
                    <Input value={shareLink} readOnly dir="ltr" />
                    <Button type="button" variant="secondary" onClick={copyShareLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={handleCreateShareLink} disabled={creatingInvite} className="w-full">
                {creatingInvite ? "יוצר קישור..." : "צור קישור שיתוף"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> : null}

        {/* Actions */}
        <Button variant="destructive" className="w-full gap-2" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" /> התנתק מהמערכת
        </Button>
      </main>
    </div>
  );
};

export default Profile;
