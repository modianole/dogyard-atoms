import type { Restaurant } from "@/types/restaurant";

import hamburgerImg from "@/assets/food/hamburger.jpg";
import caesarSaladImg from "@/assets/food/caesar-salad.jpg";
import fishChipsImg from "@/assets/food/fish-chips.jpg";
import lemonadeImg from "@/assets/food/lemonade.jpg";
import beerImg from "@/assets/food/beer.jpg";
import sausageBunImg from "@/assets/food/sausage-bun.jpg";
import friesImg from "@/assets/food/fries.jpg";
import chocolateCakeImg from "@/assets/food/chocolate-cake.jpg";
import cheeseToastImg from "@/assets/food/cheese-toast.jpg";
import shakshuka from "@/assets/food/shakshuka.jpg";
import tunaSandwichImg from "@/assets/food/tuna-sandwich.jpg";
import latteImg from "@/assets/food/latte.jpg";
import espressoImg from "@/assets/food/espresso.jpg";
import cappuccinoImg from "@/assets/food/cappuccino.jpg";
import smoothieImg from "@/assets/food/smoothie.jpg";
import croissantImg from "@/assets/food/croissant.jpg";

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "r2",
    name: "קפה דוג",
    gardenId: 4,
    phone: "03-555-5678",
    deliveryNote: "מגיעים תוך 15 דקות!",
    deals: [
      {
        id: "d1",
        title: "☕ מבצע קפה + סנדוויץ׳",
        description: "קפה הפוך + סנדוויץ׳ טונה או גבינה לבחירה",
        originalPrice: 46,
        dealPrice: 29,
        items: ["קפה הפוך", "סנדוויץ׳ לבחירה"],
      },
    ],
    menu: [
      { id: "m9", name: "טוסט גבינות", description: "שלוש גבינות על לחם מחמצת", price: 36, category: "מנות עיקריות", isPopular: true, image: cheeseToastImg },
      { id: "m10", name: "שקשוקה", description: "רוטב עגבניות ביתי עם ביצים", price: 42, category: "מנות עיקריות", image: shakshuka },
      { id: "m14", name: "סנדוויץ׳ טונה", description: "טונה, ביצה קשה, ירקות ומיונז", price: 32, category: "מנות עיקריות", image: tunaSandwichImg },
      { id: "m11", name: "קפה הפוך", description: "קפה עם חלב מוקצף", price: 14, category: "שתייה", isPopular: true, image: latteImg },
      { id: "m15", name: "אספרסו", description: "אספרסו כפול", price: 12, category: "שתייה", image: espressoImg },
      { id: "m16", name: "קפוצ׳ינו", description: "קפוצ׳ינו עם קצף חלב", price: 16, category: "שתייה", image: cappuccinoImg },
      { id: "m13", name: "סמוזי פירות", description: "מנגו, בננה, תות", price: 24, category: "שתייה", isPopular: true, image: smoothieImg },
      { id: "m12", name: "מאפה בוקר", description: "קרואסון חמאה טרי", price: 16, category: "חטיפים", image: croissantImg },
    ],
  },
  {
    id: "r1",
    name: "ביסטרו הגינה",
    gardenId: 1,
    phone: "03-555-1234",
    deliveryNote: "משלוח חינם לגינת מאיר!",
    menu: [
      { id: "m1", name: "המבורגר קלאסי", description: "200 גרם בקר, חסה, עגבנייה, מלפפון חמוץ", price: 52, category: "מנות עיקריות", isPopular: true, image: hamburgerImg },
      { id: "m2", name: "סלט קיסר", description: "חסה רומית, קרוטונים, פרמזן, רוטב קיסר", price: 38, category: "סלטים", image: caesarSaladImg },
      { id: "m3", name: "פיש אנד צ׳יפס", description: "פילה דג בציפוי פריך עם צ׳יפס", price: 58, category: "מנות עיקריות", image: fishChipsImg },
      { id: "m4", name: "לימונדה טבעית", description: "לימון סחוט עם נענע", price: 18, category: "שתייה", image: lemonadeImg },
      { id: "m5", name: "בירה מהחבית", description: "גולדסטאר / טובורג", price: 28, category: "שתייה", isPopular: true, image: beerImg },
      { id: "m6", name: "נקניקייה במאפה", description: "נקניקייה ביתית בלחמנייה עם חרדל", price: 32, category: "חטיפים", image: sausageBunImg },
      { id: "m7", name: "צ׳יפס ביתי", description: "צ׳יפס קריספי עם מלח גס", price: 22, category: "חטיפים", image: friesImg },
      { id: "m8", name: "עוגת שוקולד", description: "עוגת שוקולד חמה עם גלידה", price: 34, category: "קינוחים", image: chocolateCakeImg },
    ],
  },
];
