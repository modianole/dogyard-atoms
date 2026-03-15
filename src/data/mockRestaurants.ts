import type { Restaurant } from "@/types/restaurant";

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "r1",
    name: "ביסטרו הגינה",
    gardenId: 1,
    phone: "03-555-1234",
    deliveryNote: "משלוח חינם לגינת מאיר!",
    menu: [
      { id: "m1", name: "המבורגר קלאסי", description: "200 גרם בקר, חסה, עגבנייה, מלפפון חמוץ", price: 52, category: "מנות עיקריות", isPopular: true },
      { id: "m2", name: "סלט קיסר", description: "חסה רומית, קרוטונים, פרמזן, רוטב קיסר", price: 38, category: "סלטים" },
      { id: "m3", name: "פיש אנד צ׳יפס", description: "פילה דג בציפוי פריך עם צ׳יפס", price: 58, category: "מנות עיקריות" },
      { id: "m4", name: "לימונדה טבעית", description: "לימון סחוט עם נענע", price: 18, category: "שתייה" },
      { id: "m5", name: "בירה מהחבית", description: "גולדסטאר / טובורג", price: 28, category: "שתייה", isPopular: true },
      { id: "m6", name: "נקניקייה במאפה", description: "נקניקייה ביתית בלחמנייה עם חרדל", price: 32, category: "חטיפים" },
      { id: "m7", name: "צ׳יפס ביתי", description: "צ׳יפס קריספי עם מלח גס", price: 22, category: "חטיפים" },
      { id: "m8", name: "עוגת שוקולד", description: "עוגת שוקולד חמה עם גלידה", price: 34, category: "קינוחים" },
    ],
  },
  {
    id: "r2",
    name: "קפה דוג",
    gardenId: 4,
    phone: "03-555-5678",
    deliveryNote: "מגיעים תוך 15 דקות!",
    menu: [
      { id: "m9", name: "טוסט גבינות", description: "שלוש גבינות על לחם מחמצת", price: 36, category: "מנות עיקריות", isPopular: true },
      { id: "m10", name: "שקשוקה", description: "רוטב עגבניות ביתי עם ביצים", price: 42, category: "מנות עיקריות" },
      { id: "m11", name: "קפה הפוך", description: "קפה עם חלב מוקצף", price: 14, category: "שתייה" },
      { id: "m12", name: "מאפה בוקר", description: "קרואסון חמאה טרי", price: 16, category: "חטיפים" },
      { id: "m13", name: "סמוזי פירות", description: "מנגו, בננה, תות", price: 24, category: "שתייה", isPopular: true },
    ],
  },
];
