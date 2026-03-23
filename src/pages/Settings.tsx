
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, User, Phone, Save, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

const Settings = () => {
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    phone: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setFormData({
          display_name: data.display_name || "",
          phone: data.phone || ""
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: formData.display_name,
        phone: formData.phone,
        updated_at: new Date().toISOString()
      })
      .eq("id", profile.id);

    setSaving(false);
    if (error) {
      toast.error("שגיאה בעדכון הפרופיל");
    } else {
      toast.success("הפרופיל עודכן בהצלחה");
      navigate("/profile");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 pt-24 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronRight className="w-5 h-5" />
          <span>חזרה</span>
        </button>

        <h1 className="text-2xl font-bold">הגדרות פרופיל</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">מידע אישי</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-right" dir="rtl">
            <div className="space-y-2">
              <Label htmlFor="display_name" className="flex items-center gap-2">
                <User className="w-4 h-4" /> שם תצוגה
              </Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                placeholder="הכנס את שמך"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> מספר טלפון
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="למשל: 050-1234567"
              />
            </div>

            <Button
              className="w-full mt-6 gap-2"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? "שומר..." : "שמור שינויים"}
            </Button>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
};

export default Settings;
