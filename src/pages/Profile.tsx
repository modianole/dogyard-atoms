
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Plus, Settings, User, Trash2, Dog } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import Navbar from "@/components/Navbar";
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

const Profile = () => {
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [dogs, setDogs] = useState<Tables<"dogs">[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingDog, setIsAddingDog] = useState(false);
  const [newDog, setNewDog] = useState({
    name: "",
    breed: "",
    gender: "male" as Enums<"dog_gender">,
    size: "medium" as Enums<"dog_size">
  });

  const navigate = useNavigate();

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate("/auth");
      return;
    }

    // Fetch Profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileData) setProfile(profileData);

    // Fetch Dogs
    const { data: dogsData } = await supabase
      .from("dogs")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (dogsData) setDogs(dogsData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleAddDog = async () => {
    if (!newDog.name) {
      toast.error("נא להזין את שם הכלב");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("dogs").insert({
      name: newDog.name,
      breed: newDog.breed,
      gender: newDog.gender,
      size: newDog.size,
      owner_id: user.id
    });

    if (error) {
      toast.error("שגיאה בהוספת הכלב");
      console.error(error);
    } else {
      toast.success(`${newDog.name} נוסף ללהקה!`);
      setIsAddingDog(false);
      setNewDog({ name: "", breed: "", gender: "male", size: "medium" });
      fetchData();
    }
  };

  const handleDeleteDog = async (id: string) => {
    const { error } = await supabase.from("dogs").delete().eq("id", id);
    if (error) {
      toast.error("שגיאה במחיקת הכלב");
    } else {
      toast.success("הכלב הוסר בהצלחה");
      fetchData();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">טוען...</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-24 space-y-6">
        {/* Profile Header */}
        <Card className="border-none shadow-none bg-accent/50">
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

        {/* Dogs Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">הכלבים שלי ({dogs.length})</h2>
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
                  <Button onClick={handleAddDog} className="w-full">שמור כלב</Button>
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
                      <h3 className="font-bold text-lg">{dog.name}</h3>
                      <p className="text-sm text-muted-foreground">{dog.breed || "גזע לא צוין"}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">
                          {dog.gender === "male" ? "זכר" : "נקבה"}
                        </span>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">
                          {dog.size === "small" ? "קטן" : dog.size === "medium" ? "בינוני" : dog.size === "large" ? "גדול" : "ענק"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteDog(dog.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
        </div>

        {/* Actions */}
        <Button variant="destructive" className="w-full gap-2" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" /> התנתק מהמערכת
        </Button>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
