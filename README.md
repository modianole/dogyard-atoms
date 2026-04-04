# 🐾 דוג יארד - DogYard

אפליקציה חברתית לבעלי כלבים בישראל.  
מציאת גינות כלבים, דיווח על מפגעים והזמנת אוכל ישירות לגינה.

**Tech Stack**: React + TypeScript + Capacitor + Supabase + Firebase

---

## 🚀 פיתוח מקומי

```sh
# התקנת תלויות
npm install --legacy-peer-deps

# הרצה במצב פיתוח (דפדפן)
npm run dev
```

---

## 📱 בנייה לאנדרואיד

### Debug Build
```sh
# 1. בניית קבצי Web
npm run build

# 2. סנכרון ל-Android
npx cap sync

# 3. פתיחה ב-Android Studio
npx cap open android
```

### Release Build (לחנות Google Play)
```sh
npm run build
npx cap sync
cd android
.\gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔑 Keystore & Signing

הקובץ `dogyard.keystore` נמצא בשורש הפרויקט.  
הגדרות החתימה נמצאות ב-`android/app/build.gradle`.

> ⚠️ **אל תעלה את ה-keystore ל-Git!**

---

## 🔥 Firebase

- **Crashlytics**: דיווח קריסות אוטומטי  
- **Analytics**: מעקב אחר שימוש  
- קובץ `google-services.json` נמצא ב-`android/app/`

---

## 🌐 Backend - Supabase

- הגדרות ב-`.env`
- Migrations ב-`supabase/migrations/`

---

## 📋 Scripts

| פקודה | תיאור |
|-------|--------|
| `npm run dev` | שרת פיתוח |
| `npm run build` | Build לייצור |
| `npm test` | הרצת טסטים |
| `npx cap sync` | סנכרון ל-Native |

---

## 📄 מסמכים

- [PROFESSIONAL_REVIEW.md](./PROFESSIONAL_REVIEW.md) - סקירה מקצועית
- [MVP_ACTION_PLAN.md](./MVP_ACTION_PLAN.md) - תוכנית פעולה
- [TASKS_CHECKLIST.md](./TASKS_CHECKLIST.md) - רשימת משימות

---

נבנה באהבה לכלבים 🐕
