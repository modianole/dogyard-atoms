import { useState } from "react";
import { MapPin, Plus, ImagePlus, Trees } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

const AddGarden = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { t, isRTL } = useLanguage();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      toast({ title: t.addGarden.errorTitle, description: t.addGarden.errorDesc, variant: "destructive" });
      return;
    }
    toast({ title: t.addGarden.successTitle, description: `${name} — ${location}` });
    setName("");
    setLocation("");
    setImagePreview(null);
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

          <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground btn-spring hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            {t.addGarden.submit}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default AddGarden;
