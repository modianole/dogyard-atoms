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

### הגדרות IP/URL לפיתוח

- `VITE_DEV_HOST` — כתובת ה־LAN שעליה Vite מאזין בפיתוח. ברירת המחדל כרגע: `192.168.10.1`
- `VITE_DEV_PORT` — פורט שרת הפיתוח. ברירת המחדל: `8080`
- `CAPACITOR_ANDROID_SERVER_URL` — כתובת שרת dev מלאה עבור Android רק בזמן פיתוח

דוגמאות:

```sh
# דפדפן / LAN
$env:VITE_DEV_HOST="192.168.10.1"
$env:VITE_DEV_PORT="8080"
npm run dev

# Android מול dev server מקומי
$env:CAPACITOR_ANDROID_SERVER_URL="http://192.168.10.1:8080"
npx cap sync android
```

> בפרודקשן לא מוגדר `server.url` ב־Capacitor, ולכן האפליקציה נטענת מה־assets המקומיים ב־`dist`.

---

## 📱 בנייה לאנדרואיד

### Debug Build
```sh
# 1. בניית קבצי Web
npm run build

# 2. סנכרון ל-Android
npx cap sync android

# 3. פתיחה ב-Android Studio
npx cap open android
```

### Release Build (לחנות Google Play)
```sh
npm run build
npx cap sync android
cd android
.\gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
# AAB: android/app/build/outputs/bundle/release/app-release.aab
```

> מומלץ לעבוד מהשורש `dogyard-atoms` ולהיכנס ל-`android` רק עבור פקודות Gradle.

---

## 🔑 Keystore & Signing

הגדרות החתימה נמצאות ב-`android/app/build.gradle`.

ל־release publishing יש להגדיר **אחד מהבאים**:
- משתני סביבה: `DOGYARD_KEYSTORE_PATH`, `DOGYARD_KEYSTORE_PASSWORD`, `DOGYARD_KEY_ALIAS`, `DOGYARD_KEY_PASSWORD`
- או ערכים תואמים בתוך `android/local.properties` (קובץ מקומי שלא נכנס ל־Git)

> ⚠️ **אל תעלה את ה-keystore ל-Git!**

אם ערכי החתימה אינם מוגדרים, ה־build עדיין יכול להצליח מקומית לצורכי בדיקה, אך הוא **לא מוכן להפצה לחנות**.

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

- [copilot/PROFESSIONAL_REVIEW.md](./copilot/PROFESSIONAL_REVIEW.md) - סקירה מקצועית
- [copilot/MVP_ACTION_PLAN.md](./copilot/MVP_ACTION_PLAN.md) - תוכנית פעולה
- [copilot/TASKS_CHECKLIST.md](./copilot/TASKS_CHECKLIST.md) - רשימת משימות

### Legal pages בתוך האפליקציה
- `/#/privacy` או `/privacy` לפי סביבת הריצה
- `/#/terms` או `/terms` לפי סביבת הריצה

הקבצים נמצאים ב-`src/pages/Privacy.tsx` ו-`src/pages/Terms.tsx`

---

נבנה באהבה לכלבים 🐕
