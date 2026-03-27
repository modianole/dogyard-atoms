import { useState, useMemo, useRef } from "react";
import { UtensilsCrossed, Phone, Star, ShoppingBag, Zap, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRestaurants, type DbMenuItem, type DbRestaurant } from "@/hooks/useRestaurants";

// Mock data to show when DB is empty
const MOCK_RESTAURANT: DbRestaurant = {
  id: "mock-1",
  name: "קפה הגן",
  name_en: "Garden Coffee",
  garden_id: null,
  phone: "03-1234567",
  delivery_note: "משלוחים ישירות לספסל בגינה!",
  delivery_note_en: "Delivery straight to your bench!",
  logo_url: null,
  is_active: true,
  deals: [
    {
      id: "deal-1",
      restaurant_id: "mock-1",
      title: "דיל בוקר מפנק",
      title_en: "Morning Special",
      description: "קפה ומאפה טרי להתחלה מתוקה של היום",
      description_en: "Coffee & Fresh Pastry to start your day",
      original_price: 35,
      deal_price: 28,
      items: ["קפה", "קרואסון"],
      is_active: true
    }
  ],
  menu_items: [
    {
      id: "m1",
      restaurant_id: "mock-1",
      name: "קפוצ'ינו גדול",
      name_en: "Large Cappuccino",
      description: "קפה עשיר עם חלב מוקצף בדיוק במידה",
      description_en: "Rich coffee with perfectly frothed milk",
      price: 16,
      category: "שתייה",
      category_en: "Drinks",
      image_url: "/src/assets/food/cappuccino.jpg",
      is_popular: true,
      is_available: true,
      sort_order: 1
    },
    {
      id: "m2",
      restaurant_id: "mock-1",
      name: "לאטה",
      name_en: "Latte",
      description: "חלב חם עם מנת אספרסו משובחת",
      description_en: "Hot milk with a premium espresso shot",
      price: 15,
      category: "שתייה",
      category_en: "Drinks",
      image_url: "/src/assets/food/latte.jpg",
      is_popular: false,
      is_available: true,
      sort_order: 2
    },
    {
      id: "m3",
      restaurant_id: "mock-1",
      name: "אספרסו כפול",
      name_en: "Double Espresso",
      description: "חזק, מעורר ומלא בטעם",
      description_en: "Strong, waking and full of flavor",
      price: 12,
      category: "שתייה",
      category_en: "Drinks",
      image_url: "/src/assets/food/espresso.jpg",
      is_popular: true,
      is_available: true,
      sort_order: 3
    },
    {
      id: "m4",
      restaurant_id: "mock-1",
      name: "קרואסון חמאה",
      name_en: "Butter Croissant",
      description: "פריך מבחוץ ונימוח מבפנים",
      description_en: "Crispy outside, soft inside",
      price: 14,
      category: "קינוחים",
      category_en: "Pastries",
      image_url: "/src/assets/food/croissant.jpg",
      is_popular: true,
      is_available: true,
      sort_order: 4
    },
    {
      id: "m5",
      restaurant_id: "mock-1",
      name: "עוגת שוקולד חמה",
      name_en: "Hot Chocolate Cake",
      description: "עשירה בשוקולד בלגי איכותי",
      description_en: "Rich with premium Belgian chocolate",
      price: 22,
      category: "קינוחים",
      category_en: "Desserts",
      image_url: "/src/assets/food/chocolate-cake.jpg",
      is_popular: false,
      is_available: true,
      sort_order: 5
    }
  ]
};

const RestaurantMenu = () => {
  const { t, language, isRTL } = useLanguage();
  const isEn = language === "en";
  const { data: dbRestaurants, isLoading } = useRestaurants();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{ item: DbMenuItem; qty: number }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Combine DB data with Mock data if DB is empty
  const restaurants = useMemo(() => {
    if (!dbRestaurants || dbRestaurants.length === 0) return [MOCK_RESTAURANT];
    return dbRestaurants;
  }, [dbRestaurants]);

  const selectedRestaurant = restaurants?.[selectedIdx];

  const menuItems = useMemo(() => {
    if (!selectedRestaurant) return [];
    return selectedRestaurant.menu_items.filter(i => i.is_available !== false);
  }, [selectedRestaurant]);

  const categories = useMemo(() => [...new Set(menuItems.map(i => i.category))], [menuItems]);

  const filteredItems = useMemo(() => {
    if (!activeCategory) return menuItems;
    return menuItems.filter(i => i.category === activeCategory);
  }, [menuItems, activeCategory]);

  const deals = useMemo(() => {
    if (!selectedRestaurant) return [];
    return selectedRestaurant.deals.filter(d => d.is_active !== false);
  }, [selectedRestaurant]);

  const addToCart = (item: DbMenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) return prev.map(c => (c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === itemId);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter(c => c.item.id !== itemId);
      return prev.map(c => (c.item.id === itemId ? { ...c, qty: c.qty - 1 } : c));
    });
  };

  const getCartQty = (itemId: string) => cart.find(c => c.item.id === itemId)?.qty || 0;
  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  const categoryEmoji: Record<string, string> = { "מנות עיקריות": "🍽️", "סלטים": "🥗", "שתייה": "☕", "חטיפים": "🥨", "קינוחים": "🍰", "Pastries": "🥐" };
  const catTranslations = t.restaurant.categories as Record<string, string>;

  const getName = (item: { name?: string; name_en?: string | null; title?: string; title_en?: string | null }) => {
    if (isEn) return item.name_en || item.title_en || item.name || item.title || "";
    return item.name || item.title || "";
  };
  const getDesc = (item: { description?: string | null; description_en?: string | null }) => isEn ? (item.description_en || item.description) : item.description;

  if (isLoading && (!dbRestaurants || dbRestaurants.length === 0)) {
    return (
      <section id="restaurant" className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-muted rounded-xl mx-auto" />
            <div className="flex gap-4 justify-center">
              {[1,2,3,4].map(i => <div key={i} className="h-48 w-52 bg-muted rounded-2xl" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!selectedRestaurant) return null;

  return (
    <section id="restaurant" className="py-24 bg-background overflow-hidden relative">
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[120px] top-0 right-0" style={{ background: 'hsl(24, 95%, 53%)' }} />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-xs font-bold glass text-primary animate-pulse-glow">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            {t.restaurant.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mb-3">{t.restaurant.title}</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">{t.restaurant.subtitle}</p>
        </div>

        {(restaurants?.length ?? 0) > 1 && (
          <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            {restaurants!.map((r, idx) => (
              <button key={r.id} onClick={() => { setSelectedIdx(idx); setActiveCategory(null); setCart([]); }}
                className={`relative px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-95 flex-shrink-0 ${selectedIdx === idx ? "bg-primary text-primary-foreground glow-primary" : "glass hover:bg-card/80 text-muted-foreground hover:text-foreground"}`}>
                {getName(r)}
                {r.deals.length > 0 && selectedIdx !== idx && (
                  <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-accent text-accent-foreground rounded-full text-[9px] font-bold flex items-center justify-center animate-glow-pulse">!</span>
                )}
              </button>
            ))}
          </div>
        )}

        {deals.length > 0 && (
          <div className="max-w-2xl mx-auto mb-10 animate-in fade-in zoom-in-95 duration-500">
            {deals.map(deal => (
              <div key={deal.id} className="relative rounded-2xl overflow-hidden p-6 border-gradient" style={{ background: 'linear-gradient(135deg, hsla(142, 70%, 45%, 0.15), hsla(142, 70%, 45%, 0.05))' }}>
                <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-20 blur-[40px]" style={{ background: 'hsl(142, 70%, 45%)' }} />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-15 blur-[30px]" style={{ background: 'hsl(142, 70%, 45%)' }} />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-accent" />
                      <span className="text-accent/80 text-xs font-bold uppercase tracking-wider">{t.restaurant.specialDeal}</span>
                    </div>
                    <h3 className="font-display font-black text-xl text-foreground mb-1">{getName(deal)}</h3>
                    <p className="text-sm text-muted-foreground">{getDesc(deal)}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {(deal.items ?? []).map((item, i) => (
                        <span key={i} className="px-2.5 py-1 glass rounded-lg text-xs text-foreground font-medium">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 ms-6">
                    <span className="text-muted-foreground line-through text-sm">₪{deal.original_price}</span>
                    <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center glow-accent">
                      <span className="text-2xl font-display font-black text-accent-foreground">₪{deal.deal_price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedRestaurant.delivery_note && (
          <div className="max-w-2xl mx-auto mb-8 text-center">
            <span className="inline-block px-4 py-2 rounded-2xl glass text-accent text-sm font-bold border-gradient animate-in fade-in duration-1000">
              🛵 {isEn ? (selectedRestaurant.delivery_note_en || selectedRestaurant.delivery_note) : selectedRestaurant.delivery_note}
            </span>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button onClick={() => setActiveCategory(null)}
            className={`px-6 py-3 rounded-2xl text-base font-bold transition-all duration-300 md:px-5 md:py-2.5 md:text-sm active:scale-95 ${!activeCategory ? "bg-primary text-primary-foreground glow-primary" : "glass hover:bg-card/80 text-muted-foreground"}`}>
            🍴 {t.restaurant.all}
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-base font-bold transition-all duration-300 md:px-5 md:py-2.5 md:text-sm active:scale-95 ${activeCategory === cat ? "bg-primary text-primary-foreground glow-primary" : "glass hover:bg-card/80 text-muted-foreground"}`}>
              {categoryEmoji[cat] || "•"} {catTranslations[cat] || cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto">
          <button onClick={() => scroll("right")} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-2xl glass flex items-center justify-center hover:bg-card/80 transition-all duration-200 hover:glow-primary active:scale-90">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
          <button onClick={() => scroll("left")} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-2xl glass flex items-center justify-center hover:bg-card/80 transition-all duration-200 hover:glow-primary active:scale-90">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {filteredItems.map((item, i) => {
              const qty = getCartQty(item.id);
              return (
                <div key={item.id}
                  className="flex-shrink-0 w-[220px] snap-start glass rounded-2xl hover:glow-primary transition-all duration-300 group overflow-hidden border-gradient animate-in fade-in zoom-in-95"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}>
                  <div className="h-1.5 bg-gradient-to-l from-primary/60 to-primary" />
                  <div className="p-4">
                    <div className="w-full h-28 rounded-xl overflow-hidden mb-3 bg-muted/30">
                      {item.image_url ? (
                        <img src={item.image_url} alt={getName(item)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">{categoryEmoji[item.category] || "🍽️"}</div>
                      )}
                    </div>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-display font-bold text-foreground text-sm leading-tight">{getName(item)}</h3>
                      {item.is_popular && (
                        <span className="flex-shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[9px] font-bold bg-warning/15 text-warning">
                          <Star className="w-2.5 h-2.5 fill-warning" />
                          {t.restaurant.popular}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{getDesc(item)}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-lg text-gradient-primary">₪{item.price}</span>
                      {qty === 0 ? (
                        <button onClick={() => addToCart(item)} className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-all duration-200 btn-futuristic glow-primary md:w-9 md:h-9 active:scale-90">
                          <Plus className="w-5 h-5 md:w-4 md:h-4" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 glass rounded-xl px-1">
                          <button onClick={() => removeFromCart(item.id)} className="w-9 h-9 rounded-lg text-primary hover:bg-primary/15 flex items-center justify-center transition-colors md:w-7 md:h-7 active:scale-90"><Minus className="w-4 h-4 md:w-3.5 md:h-3.5" /></button>
                          <span className="text-sm font-bold text-primary min-w-[1ch] text-center">{qty}</span>
                          <button onClick={() => addToCart(item)} className="w-9 h-9 rounded-lg text-primary hover:bg-primary/15 flex items-center justify-center transition-colors md:w-7 md:h-7 active:scale-90"><Plus className="w-4 h-4 md:w-3.5 md:h-3.5" /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {cartCount > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-4 glass-strong rounded-2xl shadow-large flex items-center justify-between glow-primary">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-bold text-foreground text-sm">{cartCount} {t.restaurant.items}</span>
                  <span className="text-muted-foreground text-xs ms-2">· ₪{cartTotal}</span>
                </div>
              </div>
              <button className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-base btn-futuristic glow-primary md:px-6 md:py-2.5 md:text-sm active:scale-95">
                {t.restaurant.sendOrder}
              </button>
            </div>
          </div>
        )}

        {selectedRestaurant.phone && (
          <div className="text-center mt-8">
            <a href={`tel:${selectedRestaurant.phone}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              {selectedRestaurant.phone}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default RestaurantMenu;
