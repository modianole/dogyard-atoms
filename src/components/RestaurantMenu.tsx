import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, Phone, Star, ShoppingBag, ChevronDown, Zap } from "lucide-react";
import { MOCK_RESTAURANTS } from "@/data/mockRestaurants";
import type { Restaurant, MenuItem, Deal } from "@/types/restaurant";

const RestaurantMenu = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(MOCK_RESTAURANTS[0]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{ item: MenuItem; qty: number }[]>([]);

  const categories = useMemo(() => {
    const cats = [...new Set(selectedRestaurant.menu.map((i) => i.category))];
    return cats;
  }, [selectedRestaurant]);

  const filteredItems = useMemo(() => {
    if (!activeCategory) return selectedRestaurant.menu;
    return selectedRestaurant.menu.filter((i) => i.category === activeCategory);
  }, [selectedRestaurant, activeCategory]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) return prev.map((c) => (c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { item, qty: 1 }];
    });
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full text-xs font-medium bg-primary/10 text-primary">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            הזמנה מהמסעדה
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            רעבים? הזמינו מהמסעדה ליד הגינה
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            בחרו מסעדה קרובה לגינה שלכם והזמינו ישירות
          </p>
        </motion.div>

        {/* Restaurant selector */}
        {MOCK_RESTAURANTS.length > 1 && (
          <div className="flex justify-center gap-3 mb-8">
            {MOCK_RESTAURANTS.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRestaurant(r);
                  setActiveCategory(null);
                  setCart([]);
                }}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  selectedRestaurant.id === r.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-card-foreground hover:bg-muted border border-border"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        )}

        {/* Delivery note */}
        {selectedRestaurant.deliveryNote && (
          <div className="max-w-2xl mx-auto mb-6 text-center">
            <span className="inline-block px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium">
              {selectedRestaurant.deliveryNote}
            </span>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !activeCategory
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              הכל
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu items */}
          <div className="grid gap-3">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:shadow-soft transition-shadow group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-bold text-card-foreground">{item.name}</h3>
                    {item.isPopular && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning/15 text-warning">
                        <Star className="w-2.5 h-2.5 fill-warning" />
                        פופולרי
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                </div>
                <div className="flex items-center gap-3 mr-4">
                  <span className="font-display font-bold text-foreground whitespace-nowrap">
                    ₪{item.price}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-9 h-9 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cart summary */}
          {cartCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky bottom-4 mt-8 p-4 bg-primary rounded-xl shadow-large flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                <span className="font-bold text-primary-foreground">
                  {cartCount} פריטים · ₪{cartTotal}
                </span>
              </div>
              <button className="px-6 py-2 bg-primary-foreground text-primary rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                שלח הזמנה
              </button>
            </motion.div>
          )}

          {/* Phone */}
          {selectedRestaurant.phone && (
            <div className="text-center mt-6">
              <a
                href={`tel:${selectedRestaurant.phone}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                {selectedRestaurant.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RestaurantMenu;
