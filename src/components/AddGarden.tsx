import { useState } from "react";
import { MapPin, Plus, ImagePlus, Trees } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const AddGarden = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
    if (!name.trim() || !location.trim()) {
      toast({ title: t.addGarden.errorTitle, description: t.addGarden.errorDesc, variant: "destructive" });
      return;
    }

    if (!user) {
      toast({ title: isRTL ? "יש להתחבר" : "Login required", description: isRTL ? "יש להתחבר כדי להוסיף גינה" : "Please log in to add a garden", variant: "destructive" });
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
      });

      if (error) throw error;

      toast({ title: t.addGarden.successTitle, description: `${name} — ${location}` });
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

  return (
    <section id="add-garden" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{t.addGarden.title}</h2>
          <p className="text-muted-foreground">{t.addGarden.subtitle}</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-card rounded-2xl shadow-soft p-6 space-y-5"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Trees className="w-4 h-4 text-primary" />
              {t.addGarden.gardenName}
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.addGarden.gardenNamePlaceholder} dir={isRTL ? "rtl" : "ltr"} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {t.addGarden.location}
            </label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t.addGarden.locationPlaceholder} dir={isRTL ? "rtl" : "ltr"} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <ImagePlus className="w-4 h-4 text-primary" />
              {t.addGarden.photo}
            </label>
            <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 cursor-pointer transition-colors overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImagePlus className="w-8 h-8" />
                  <span className="text-sm">{t.addGarden.uploadPhoto}</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground btn-spring hover:opacity-90 transition-opacity disabled:opacity-50">
            <Plus className="w-4 h-4" />
            {submitting ? (isRTL ? "שולח..." : "Submitting...") : t.addGarden.submit}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default AddGarden;
