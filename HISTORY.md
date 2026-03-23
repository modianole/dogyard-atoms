# 📜 היסטוריית פיתוח ושינויים - Dogyard Atoms

## [19/03/2024] - השלמת תשתית הליבה (Dogs & Check-ins)

### 🛠 פיתוח Back-end (Supabase):
- **טבלת Dogs:** יצירת טבלת `dogs` עם Enums (גודל, מגדר) ו-RLS מלא.
- **Storage:** פתיחת Bucket לתמונות כלבים (`dog-images`).
- **Types:** סנכרון מלא של ה-Database עם TypeScript ב-Front-end.

### 🎨 פיתוח Front-end & UI:
- **Navigation:** הטמעת `BottomNav` קבוע למובייל (בית, מפה, דיווח, התראות, פרופיל).
- **Profile Page:** יצירת דף פרופיל לניהול כלבים (הוספה, מחיקה).
- **Map Integration:** עדכון דף המפה להצגת מונה כלבים (Live Visitors) בזמן אמת.
- **Garden Details:** הוספת מערכת צ'ק-אין חכמה ("מי כאן עכשיו") ובחירת כלבים.
- **Settings:** יצירת דף הגדרות לעריכת פרטי משתמש.
- **Index:** התאמת דף הבית לקישור ישיר למפה ופרופיל.

### 📱 אופטימיזציה למובייל:
- הוספת הגדרות CSS למניעת Overscroll ושיפור חוויית ה-Native.
- חיבור `BottomNav` לכל דפי האפליקציה הרלוונטיים.

---
## [22/05/2024] - תיקון שגיאת Build אנדרואיד וסנכרון פרויקט
- ProGuard Fix, patch-package integration, and Git sync.

---
*נוצר באופן אוטומטי על ידי קודי (Codi) - עוזר ה-AI של Android Studio.*
