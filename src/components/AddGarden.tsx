import { useState } from "react";
import { MapPin, Plus, ImagePlus, Trees, AlertCircle, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const AddGarden = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!name.trim() || !location.trim()) {
      toast({ title: t.addGarden.errorTitle, description: t.addGarden.errorDesc, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      let image_url: string | null = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('garden-images')
          .upload(filePath, imageFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('garden-images')
          .getPublicUrl(filePath);
        image_url = publicUrl;
      }

      const { error } = await supabase.from('gardens').insert({
        name: name.trim(),
        location: location.trim(),
        lat: 32.07 + Math.random() * 0.05,
        lng: 34.77 + Math.random() * 0.05,
        image_url,
        created_by: user.id,
        status: 'pending'
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: isRTL ? "הבקשה נשלחה!" : "Request sent!",
        description: isRTL ? "הגינה תתווסף למפה לאחר בדיקת מנהל." : "The garden will be added to the map after admin review."
      });

      queryClient.invalidateQueries({ queryKey: ["gardens"] });
      setName("");
      setLocation("");
      setImagePreview(null);
      setImageFile(null);
    } catch (err: any) {
      toast({ title: isRTL ? "שגיאה" : "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-24 bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trees className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">{isRTL ? "תודה על השיתוף!" : "Thanks for sharing!"}</h2>
          <p className="text-muted-foreground mb-8">
            {isRTL
              ? "קיבלנו את הפרטים של הגינה. הצוות שלנו יבדוק אותם ויאשר את ההוספה בקרוב."
              : "We received the garden details. Our team will review them and approve the addition soon."}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold"
          >
            {isRTL ? "הוספת גינה נוספת" : "Add another garden"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="add-garden" className="py-12 bg-background relative overflow-hidden">
      <div className="absolute w-[250px] h-[250px] rounded-full opacity-[0.05] blur-[100px] top-10 left-10" style={{ background: 'hsl(142, 70%, 45%)' }} />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mb-2">{t.addGarden.title}</h2>
          <p className="text-muted-foreground">{t.addGarden.subtitle}</p>
        </div>

        {!user && (
          <div className="max-w-lg mx-auto mb-8">
            <Alert variant="default" className="bg-primary/5 border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertTitle>{isRTL ? "נדרשת התחברות" : "Login Required"}</AlertTitle>
              <AlertDescription className="flex flex-col gap-3">
                <p>
                  {isRTL
                    ? "עליך להיות מחובר למערכת כדי להוסיף גינה חדשה."
                    : "You must be logged in to add a new garden."}
                </p>
                <button
                  onClick={() => navigate("/auth")}
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-primary text-white font-bold text-sm w-fit"
                >
                  <LogIn className="w-4 h-4" />
                  {isRTL ? "התחבר עכשיו" : "Login Now"}
                </button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`max-w-lg mx-auto glass rounded-2xl border-gradient p-6 space-y-5 ${!user ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}
        >
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-2">
            <p className="text-xs text-primary font-medium flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" />
              {isRTL
                ? "שימו לב: כל גינה עוברת בדיקת מנהל לפני פרסומה."
                : "Note: All gardens undergo admin review before publication."}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground flex items-center gap-2">
              <Trees className="w-4 h-4 text-primary" />
              {t.addGarden.gardenName}
            </label>
            <Input
              disabled={!user}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.addGarden.gardenNamePlaceholder}
              dir={isRTL ? "rtl" : "ltr"}
              className="glass rounded-xl border-border/50 focus:glow-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {t.addGarden.location}
            </label>
            <Input
              disabled={!user}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t.addGarden.locationPlaceholder}
              dir={isRTL ? "rtl" : "ltr"}
              className="glass rounded-xl border-border/50 focus:glow-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground flex items-center gap-2">
              <ImagePlus className="w-4 h-4 text-primary" />
              {t.addGarden.photo}
            </label>
            <label className={`flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 bg-muted/20 ${user ? 'cursor-pointer' : 'cursor-not-allowed'} transition-all duration-300 overflow-hidden hover:glow-primary`}>
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImagePlus className="w-8 h-8" />
                  <span className="text-sm">{t.addGarden.uploadPhoto}</span>
                </div>
              )}
              <input disabled={!user} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting || !user}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold bg-primary text-primary-foreground btn-futuristic glow-primary disabled:opacity-50 md:py-3 md:text-sm"
          >
            {user ? (
              <>
                <Plus className="w-4 h-4" />
                {submitting ? (isRTL ? "שולח..." : "Submitting...") : t.addGarden.submit}
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                {isRTL ? "התחבר להוספת גינה" : "Login to add garden"}
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddGarden;
