import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UtensilsCrossed, Phone, Star, ShoppingBag, Zap, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRestaurants, type DbMenuItem } from "@/hooks/useRestaurants";

const RestaurantMenu = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const { data: restaurants, isLoading } = useRestaurants();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{ item: DbMenuItem; qty: number }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const categoryEmoji: Record<string, string> = { "מנות עיקריות": "🍽️", "סלטים": "🥗", "שתייה": "☕", "חטיפים": "🥨", "קינוחים": "🍰" };
  const catTranslations = t.restaurant.categories as Record<string, string>;

  const getName = (item: { name?: string; name_en?: string | null; title?: string; title_en?: string | null }) => {
    if (isEn) return item.name_en || item.title_en || item.name || item.title || "";
    return item.name || item.title || "";
  };
  const getDesc = (item: { description?: string | null; description_en?: string | null }) => isEn ? (item.description_en || item.description) : item.description;

  if (isLoading) {
    return (
      <section id="restaurant" className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-muted rounded mx-auto" />
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
    <section id="restaurant" className="py-20 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            {t.restaurant.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">{t.restaurant.title}</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">{t.restaurant.subtitle}</p>
        </motion.div>

        {(restaurants?.length ?? 0) > 1 && (
          <div className="flex justify-center gap-2 mb-10">
            {restaurants!.map((r, idx) => (
              <button key={r.id} onClick={() => { setSelectedIdx(idx); setActiveCategory(null); setCart([]); }}
                className={`relative px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${selectedIdx === idx ? "bg-foreground text-background shadow-large scale-105" : "bg-card text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20"}`}>
                {getName(r)}
                {r.deals.length > 0 && selectedIdx !== idx && (
                  <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[9px] font-bold flex items-center justify-center">!</span>
                )}
              </button>
            ))}
          </div>
        )}

        {deals.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mb-10">
            {deals.map(deal => (
              <div key={deal.id} className="relative rounded-2xl overflow-hidden bg-gradient-to-l from-accent via-accent to-accent/80 p-6 shadow-large">
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-accent-foreground/5 rounded-full" />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent-foreground/5 rounded-full" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-accent-foreground" />
                      <span className="text-accent-foreground/80 text-xs font-bold uppercase tracking-wider">{t.restaurant.specialDeal}</span>
                    </div>
                    <h3 className="font-display font-bold text-xl text-accent-foreground mb-1">{getName(deal)}</h3>
                    <p className="text-sm text-accent-foreground/70">{getDesc(deal)}</p>
                    <div className="flex items-center gap-2 mt-3">
                      {(deal.items ?? []).map((item, i) => (
                        <span key={i} className="px-2.5 py-1 bg-accent-foreground/15 backdrop-blur-sm rounded-full text-xs text-accent-foreground font-medium">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 ms-6">
                    <span className="text-accent-foreground/50 line-through text-sm">₪{deal.original_price}</span>
                    <div className="w-20 h-20 rounded-full bg-accent-foreground flex items-center justify-center">
                      <span className="text-2xl font-display font-black text-accent">₪{deal.deal_price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {selectedRestaurant.delivery_note && (
          <div className="max-w-2xl mx-auto mb-8 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
              🛵 {isEn ? (selectedRestaurant.delivery_note_en || selectedRestaurant.delivery_note) : selectedRestaurant.delivery_note}
            </span>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button onClick={() => setActiveCategory(null)}
            className={`px-6 py-3 rounded-2xl text-base font-bold transition-all duration-200 md:px-5 md:py-2.5 md:text-sm ${!activeCategory ? "bg-foreground text-background shadow-md" : "bg-card text-muted-foreground hover:bg-muted border border-border"}`}>
            🍴 {t.restaurant.all}
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-base font-bold transition-all duration-200 md:px-5 md:py-2.5 md:text-sm ${activeCategory === cat ? "bg-foreground text-background shadow-md" : "bg-card text-muted-foreground hover:bg-muted border border-border"}`}>
              {categoryEmoji[cat] || "•"} {catTranslations[cat] || cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto">
          <button onClick={() => scroll("right")} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-medium border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
          <button onClick={() => scroll("left")} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-medium border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {filteredItems.map((item, i) => {
              const qty = getCartQty(item.id);
              return (
                <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="flex-shrink-0 w-[220px] snap-start bg-card rounded-2xl border border-border hover:shadow-medium transition-all duration-300 group overflow-hidden">
                  <div className="h-2 bg-gradient-to-l from-primary/60 to-primary" />
                  <div className="p-4">
                    <div className="w-full h-28 rounded-xl overflow-hidden mb-3 bg-muted/50">
                      {item.image_url ? (
                        <img src={item.image_url} alt={getName(item)} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">{categoryEmoji[item.category] || "🍽️"}</div>
                      )}
                    </div>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-display font-bold text-card-foreground text-sm leading-tight">{getName(item)}</h3>
                      {item.is_popular && (
                        <span className="flex-shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-warning/15 text-warning">
                          <Star className="w-2.5 h-2.5 fill-warning" />
                          {t.restaurant.popular}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{getDesc(item)}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-lg text-foreground">₪{item.price}</span>
                      {qty === 0 ? (
                        <button onClick={() => addToCart(item)} className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform btn-spring md:w-9 md:h-9">
                          <Plus className="w-5 h-5 md:w-4 md:h-4" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-1">
                          <button onClick={() => removeFromCart(item.id)} className="w-9 h-9 rounded-lg text-primary hover:bg-primary/20 flex items-center justify-center transition-colors md:w-7 md:h-7"><Minus className="w-4 h-4 md:w-3.5 md:h-3.5" /></button>
                          <span className="text-sm font-bold text-primary min-w-[1ch] text-center">{qty}</span>
                          <button onClick={() => addToCart(item)} className="w-9 h-9 rounded-lg text-primary hover:bg-primary/20 flex items-center justify-center transition-colors md:w-7 md:h-7"><Plus className="w-4 h-4 md:w-3.5 md:h-3.5" /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {cartCount > 0 && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
              <div className="p-4 bg-foreground rounded-2xl shadow-large flex items-center justify-between backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="font-bold text-background text-sm">{cartCount} {t.restaurant.items}</span>
                    <span className="text-background/60 text-xs ms-2">· ₪{cartTotal}</span>
                  </div>
                </div>
                <button className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-base hover:opacity-90 transition-opacity btn-spring md:px-6 md:py-2.5 md:text-sm">
                  {t.restaurant.sendOrder}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
