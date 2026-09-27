
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, User, Phone, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";
import { GlassCard } from "@/components/ui/GlassCard";

const Settings = () => {
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
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

      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

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

  const syncWithGoogle = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata) {
      const googleName = user.user_metadata.full_name || user.user_metadata.name;
      if (googleName) {
        setFormData(prev => ({ ...prev, display_name: googleName }));
        toast.info("השם עודכן לפי חשבון הגוגל שלך");
      }
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);

    // Explicitly update by user_id to avoid RLS upsert complications
    const { data, error } = await supabase
      .from("profiles")
      .update({
        display_name: formData.display_name,
        phone: formData.phone,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    setSaving(false);
    if (error) {
      console.error("Update error:", error);
      toast.error("שגיאה בעדכון הפרופיל. נא לוודא שאתה מחובר.");
    } else {
      toast.success("הפרופיל עודכן בהצלחה");
      navigate("/profile");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;

  return (
    <div className="min-h-full pb-6 px-4" dir="rtl">
      <main className="max-w-2xl mx-auto pt-4 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronRight className="w-5 h-5" />
          <span>חזרה לפרופיל</span>
        </button>

        <div className="flex justify-between items-end">
          <h1 className="text-3xl font-black">הגדרות</h1>
          <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={syncWithGoogle}>
            <RefreshCw className="w-3 h-3" /> סנכרן מגוגל
          </Button>
        </div>

        <GlassCard intensity="medium">
          <Card className="border-none bg-transparent shadow-none text-right">
            <CardHeader>
              <CardTitle className="text-lg">פרטי בעלים</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> שם מלא / כינוי
                </Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                  placeholder="איך תרצה להופיע בגינה?"
                  className="bg-background/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> מספר טלפון (קריטי לשיתוף כלב)
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="למשל: 0501234567"
                  className="bg-background/40"
                  dir="ltr"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  הטלפון ישמש ליצירת קשר עם שותפים שתזמין ללהקה (בני זוג, דוג-ווקרים).
                </p>
              </div>

              <Button
                className="w-full mt-6 gap-2 rounded-full"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="w-4 h-4" />
                {saving ? "שומר שינויים..." : "שמור ועדכן"}
              </Button>
            </CardContent>
          </Card>
        </GlassCard>
      </main>
    </div>
  );
};

export default Settings;
