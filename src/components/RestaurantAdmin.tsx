import { useState, useEffect } from "react";
import { Store, Plus, Trash2, Zap, UtensilsCrossed, Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NewItem { name: string; description: string; price: string; category: string; }
interface NewDeal { title: string; description: string; originalPrice: string; dealPrice: string; items: string; }

const emptyItem: NewItem = { name: "", description: "", price: "", category: "מנות עיקריות" };
const emptyDeal: NewDeal = { title: "", description: "", originalPrice: "", dealPrice: "", items: "" };
const CATEGORIES = ["מנות עיקריות", "שתייה", "חטיפים", "סלטים", "קינוחים"];

const RestaurantAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [menuItems, setMenuItems] = useState<NewItem[]>([{ ...emptyItem }]);
  const [deals, setDeals] = useState<NewDeal[]>([]);
  const [saved, setSaved] = useState(false);
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !data || data.role !== 'admin') {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
    };

    if (!authLoading) checkAdminStatus();
  }, [user, authLoading]);

  if (authLoading || isAdmin === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{isRTL ? "גישה חסומה" : "Access Denied"}</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {isRTL
            ? "רק מנהלי מערכת מורשים לערוך תפריטים ומבצעים. אם אתה בעל עסק, אנא צור קשר עם התמיכה."
            : "Only administrators are authorized to edit menus and deals. If you are a business owner, please contact support."}
        </p>
        <Button onClick={() => navigate("/")}>{isRTL ? "חזרה לדף הבית" : "Back Home"}</Button>
      </div>
    );
  }

  const catTranslations = t.restaurant.categories as Record<string, string>;

  const addItem = () => setMenuItems((prev) => [...prev, { ...emptyItem }]);
  const removeItem = (i: number) => setMenuItems((prev) => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof NewItem, value: string) => setMenuItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));

  const addDeal = () => setDeals((prev) => [...prev, { ...emptyDeal }]);
  const removeDeal = (i: number) => setDeals((prev) => prev.filter((_, idx) => idx !== i));
  const updateDeal = (i: number, field: keyof NewDeal, value: string) => setDeals((prev) => prev.map((deal, idx) => (idx === i ? { ...deal, [field]: value } : deal)));

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all";
  const inputSmClass = "w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all";

  return (
    <section id="restaurant-admin" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
            <Store className="w-3.5 h-3.5" />
            {t.admin.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">{t.admin.title}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">{t.admin.subtitle}</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft transition-all hover:border-primary/20">
            <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              {t.admin.restaurantDetails}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t.admin.restaurantName}</label>
                <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} placeholder={t.admin.restaurantNamePlaceholder} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t.admin.phone}</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03-555-1234" className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t.admin.deliveryNote}</label>
                <input type="text" value={deliveryNote} onChange={(e) => setDeliveryNote(e.target.value)} placeholder={t.admin.deliveryNotePlaceholder} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft transition-all hover:border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                {t.admin.menuItems}
              </h3>
              <button onClick={addItem} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all active:scale-95">
                <Plus className="w-3.5 h-3.5" />
                {t.admin.addItem}
              </button>
            </div>
            <div className="space-y-4">
              {menuItems.map((item, i) => (
                <div key={i} className="relative p-4 rounded-xl border border-border bg-background transition-all hover:shadow-md animate-in fade-in zoom-in-95 duration-200">
                  <button onClick={() => removeItem(i)} className="absolute top-3 start-3 p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.itemName}</label>
                      <input type="text" value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} placeholder={t.admin.itemNamePlaceholder} className={inputSmClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.price}</label>
                      <input type="number" value={item.price} onChange={(e) => updateItem(i, "price", e.target.value)} placeholder="52" className={inputSmClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.category}</label>
                      <select value={item.category} onChange={(e) => updateItem(i, "category", e.target.value)} className={inputSmClass}>
                        {CATEGORIES.map((cat) => <option key={cat} value={cat}>{catTranslations[cat] || cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.description}</label>
                      <input type="text" value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} placeholder={t.admin.descriptionPlaceholder} className={inputSmClass} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft transition-all hover:border-accent/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                {t.admin.deals}
              </h3>
              <button onClick={addDeal} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-bold hover:bg-accent/20 transition-all active:scale-95">
                <Plus className="w-3.5 h-3.5" />
                {t.admin.addDeal}
              </button>
            </div>
            {deals.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">{t.admin.noDeals}</p>}
            <div className="space-y-4">
              {deals.map((deal, i) => (
                <div key={i} className="relative p-4 rounded-xl border-2 border-accent/20 bg-accent/5 transition-all hover:bg-accent/10 animate-in fade-in zoom-in-95 duration-200">
                  <button onClick={() => removeDeal(i)} className="absolute top-3 start-3 p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.dealName}</label>
                      <input type="text" value={deal.title} onChange={(e) => updateDeal(i, "title", e.target.value)} placeholder={t.admin.dealNamePlaceholder} className={inputSmClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.dealDesc}</label>
                      <input type="text" value={deal.description} onChange={(e) => updateDeal(i, "description", e.target.value)} placeholder={t.admin.dealDescPlaceholder} className={inputSmClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.originalPrice}</label>
                      <input type="number" value={deal.originalPrice} onChange={(e) => updateDeal(i, "originalPrice", e.target.value)} placeholder="46" className={inputSmClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.dealPrice}</label>
                      <input type="number" value={deal.dealPrice} onChange={(e) => updateDeal(i, "dealPrice", e.target.value)} placeholder="29" className={inputSmClass} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.includedItems}</label>
                      <input type="text" value={deal.items} onChange={(e) => updateDeal(i, "items", e.target.value)} placeholder={t.admin.includedItemsPlaceholder} className={inputSmClass} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSave}
            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${saved ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"}`}>
            <Lock className="w-5 h-5" />
            {saved ? t.admin.saved : t.admin.save}
          </button>
          <p className="text-center text-xs text-muted-foreground">{isRTL ? "רק מנהלי מערכת יכולים לשמור שינויים." : "Only admins can save changes."}</p>
        </div>
      </div>
    </section>
  );
};

export default RestaurantAdmin;
