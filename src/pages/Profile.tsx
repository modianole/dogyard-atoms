
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Plus, Settings, User } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import Navbar from "@/components/Navbar";
import { Tables } from "@/integrations/supabase/types";

const Profile = () => {
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

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
            <h2 className="text-xl font-semibold">הכלבים שלי</h2>
            <Button size="sm" variant="outline" className="gap-1">
              <Plus className="w-4 h-4" /> הוסף כלב
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Here we will map dogs from Supabase later */}
            <Card className="border-dashed border-2 flex items-center justify-center p-8 bg-muted/20">
              <p className="text-muted-foreground">עוד לא הוספת כלבים</p>
            </Card>
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
