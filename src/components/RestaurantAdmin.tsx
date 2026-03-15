import { useState } from "react";
import { motion } from "framer-motion";
import { Store, Plus, Trash2, Zap, Save, UtensilsCrossed } from "lucide-react";
import type { MenuItem, Deal } from "@/types/restaurant";

interface NewItem {
  name: string;
  description: string;
  price: string;
  category: string;
}

interface NewDeal {
  title: string;
  description: string;
  originalPrice: string;
  dealPrice: string;
  items: string;
}

const emptyItem: NewItem = { name: "", description: "", price: "", category: "מנות עיקריות" };
const emptyDeal: NewDeal = { title: "", description: "", originalPrice: "", dealPrice: "", items: "" };

const CATEGORIES = ["מנות עיקריות", "שתייה", "חטיפים", "סלטים", "קינוחים"];

const RestaurantAdmin = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [menuItems, setMenuItems] = useState<NewItem[]>([{ ...emptyItem }]);
  const [deals, setDeals] = useState<NewDeal[]>([]);
  const [saved, setSaved] = useState(false);

  const addItem = () => setMenuItems((prev) => [...prev, { ...emptyItem }]);
  const removeItem = (i: number) => setMenuItems((prev) => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof NewItem, value: string) => {
    setMenuItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));
  };

  const addDeal = () => setDeals((prev) => [...prev, { ...emptyDeal }]);
  const removeDeal = (i: number) => setDeals((prev) => prev.filter((_, idx) => idx !== i));
  const updateDeal = (i: number, field: keyof NewDeal, value: string) => {
    setDeals((prev) => prev.map((deal, idx) => (idx === i ? { ...deal, [field]: value } : deal)));
  };

  const handleSave = () => {
    // In the future this will save to Lovable Cloud
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <section id="restaurant-admin" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
            <Store className="w-3.5 h-3.5" />
            לבעלי מסעדות
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            ניהול תפריט המסעדה שלך 🍽️
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            הזינו את פרטי המסעדה, התפריט והמבצעים — ובעלי כלבים בגינה הקרובה יראו אתכם
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Restaurant details */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              פרטי המסעדה
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">שם המסעדה</label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="למשל: קפה דוג"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">טלפון</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03-555-1234"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">הערת משלוח</label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="למשל: משלוח חינם לגינת מאיר!"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                פריטי תפריט
              </h3>
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                הוסף פריט
              </button>
            </div>

            <div className="space-y-4">
              {menuItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative p-4 rounded-xl border border-border bg-background"
                >
                  <button
                    onClick={() => removeItem(i)}
                    className="absolute top-3 left-3 p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">שם הפריט</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(i, "name", e.target.value)}
                        placeholder="המבורגר קלאסי"
                        className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">מחיר (₪)</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(i, "price", e.target.value)}
                        placeholder="52"
                        className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">קטגוריה</label>
                      <select
                        value={item.category}
                        onChange={(e) => updateItem(i, "category", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">תיאור</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(i, "description", e.target.value)}
                        placeholder="200 גרם בקר, חסה, עגבנייה"
                        className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Deals */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                מבצעים
              </h3>
              <button
                onClick={addDeal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-bold hover:bg-accent/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                הוסף מבצע
              </button>
            </div>

            {deals.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                אין מבצעים עדיין. לחצו ״הוסף מבצע״ כדי ליצור אחד
              </p>
            )}

            <div className="space-y-4">
              {deals.map((deal, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative p-4 rounded-xl border-2 border-accent/20 bg-accent/5"
                >
                  <button
                    onClick={() => removeDeal(i)}
                    className="absolute top-3 left-3 p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">שם המבצע</label>
                      <input
                        type="text"
                        value={deal.title}
                        onChange={(e) => updateDeal(i, "title", e.target.value)}
                        placeholder="☕ קפה + סנדוויץ׳"
                        className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">תיאור</label>
                      <input
                        type="text"
                        value={deal.description}
                        onChange={(e) => updateDeal(i, "description", e.target.value)}
                        placeholder="קפה הפוך + סנדוויץ׳ לבחירה"
                        className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">מחיר מקורי (₪)</label>
                      <input
                        type="number"
                        value={deal.originalPrice}
                        onChange={(e) => updateDeal(i, "originalPrice", e.target.value)}
                        placeholder="46"
                        className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">מחיר מבצע (₪)</label>
                      <input
                        type="number"
                        value={deal.dealPrice}
                        onChange={(e) => updateDeal(i, "dealPrice", e.target.value)}
                        placeholder="29"
                        className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">פריטים כלולים (מופרדים בפסיק)</label>
                      <input
                        type="text"
                        value={deal.items}
                        onChange={(e) => updateDeal(i, "items", e.target.value)}
                        placeholder="קפה הפוך, סנדוויץ׳ לבחירה"
                        className="w-full px-3 py-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 ${
              saved
                ? "bg-accent text-accent-foreground"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            <Save className="w-5 h-5" />
            {saved ? "נשמר בהצלחה! ✓" : "שמור תפריט"}
          </motion.button>

          <p className="text-center text-xs text-muted-foreground">
            בקרוב — חיבור ל-Cloud לשמירה אמיתית וניהול מרחוק
          </p>
        </div>
      </div>
    </section>
  );
};

export default RestaurantAdmin;
