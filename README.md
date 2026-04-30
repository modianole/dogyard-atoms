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

- `VITE_DEV_HOST` — כתובת ה־LAN שעליה Vite מאזין בפיתוח. ברירת המחדל כרגע: `127.0.0.1`
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

> ⚠️ `android/app/google-services.json`, `android/local.properties`, ו-`*.keystore` חייבים להישאר מקומיים בלבד (לא ב-Git).

---

## 🌐 Backend - Supabase

- הגדרות ב-`.env`
- Migrations ב-`supabase/migrations/`

### 🔧 דוגמת `.env` (ללא סודות אמיתיים)

העתיקו ל-`.env` מקומי והחליפו לערכים אמיתיים אצלכם בלבד:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY

# Dev server (optional)
VITE_DEV_HOST=127.0.0.1
VITE_DEV_PORT=8080
CAPACITOR_ANDROID_SERVER_URL=http://192.168.1.10:8080

# Feature flags (optional)
VITE_ENABLE_ADMIN_ROUTES=false
VITE_ENABLE_DOG_SHARE_ROUTE=false

# Admin gating (set only for the intended admin account)
VITE_ADMIN_USER_ID=YOUR_ADMIN_USER_ID
VITE_ADMIN_EMAIL=admin@example.com
```

> ⚠️ אין להכניס ל-Repo מפתחות אמיתיים, סיסמאות, או tokens פרטיים.

---

## 📋 Scripts

| פקודה | תיאור |
|-------|--------|
| `npm run dev` | שרת פיתוח (Vite) |
| `npm run build` | Build לייצור |
| `npm test` | הרצת טסטים (Vitest) |
| `npm run test:watch` | הרצת טסטים במצב watch |
| `npm run qa:routes` | בדיקת מטריצת ראוטים מול `src/App.tsx` |
| `npm run play` | סנכרון והרצה על Android דרך Capacitor |
| `npm run verify:android:firebase` | בדיקת חיבור Firebase בקונפיג אנדרואיד |
| `npm run docker:reset` | איפוס והרצת שירותי Docker לפי הסקריפט המקומי |
| `npm run docker:watch` | כמו `docker:reset` עם watch |

### QA לראוטים לפני השקה

בדיקה מהירה לראוטים קריטיים:

```sh
npm run qa:routes
```

הבדיקה קוראת את:
- `scripts/qa-launch-routes.mjs`
- `scripts/qa-launch-routes.matrix.json`

ומוודאת בין היתר ראוטים ציבוריים/מוגנים, gate לפי feature flags, ו-fallback ל-`NotFound`.

---

## 📄 מסמכים

- [copilot/PROFESSIONAL_REVIEW.md](./copilot/PROFESSIONAL_REVIEW.md) - סקירה מקצועית
- [copilot/MVP_ACTION_PLAN.md](./copilot/MVP_ACTION_PLAN.md) - תוכנית פעולה
- [copilot/TASKS_CHECKLIST.md](./copilot/TASKS_CHECKLIST.md) - רשימת משימות
- [copilot/GO_NO_GO.md](./copilot/GO_NO_GO.md) - קריטריוני Go/No-Go לשחרור
- [copilot/ROLLBACK_RUNBOOK.md](./copilot/ROLLBACK_RUNBOOK.md) - נוהל Rollback
- [copilot/POST_MORTEM_TEMPLATE.md](./copilot/POST_MORTEM_TEMPLATE.md) - תבנית Post-Mortem
- [copilot/STORE_DESCRIPTION_HE_EN.md](./copilot/STORE_DESCRIPTION_HE_EN.md) - תיאור חנות בעברית/אנגלית

### Legal pages בתוך האפליקציה
- `/#/privacy` או `/privacy` לפי סביבת הריצה
- `/#/terms` או `/terms` לפי סביבת הריצה

הקבצים נמצאים ב-`src/pages/Privacy.tsx` ו-`src/pages/Terms.tsx`

---

## 🔐 דף ניהול אדמין

נתיבי האדמין המוגדרים בקוד:
- `/admin/import` — מסך ייבוא וסריקה מגוגל (גינות + מרחבים מוגנים)
- `/admin/gardens` — מסך אישור גינות בהמתנה

> ⚠️ הנתיבים עצמם מגודרים ב-feature flag `VITE_ENABLE_ADMIN_ROUTES`, והגישה בפועל נשלטת גם ע"י הרשאות משתמש (deny-by-default כאשר לא מוגדר חשבון אדמין).

דף הייבוא כולל שני מסופים:

### מסוף 1: גינות כלבים (גוש דן)
סורק את כל אזורי גוש דן (תל אביב, רמת גן, גבעתיים, חולון, בת ים, הרצליה) בחיפוש אחר:
- "גינת כלבים"
- "מתחם כלבים"
- "dog park"
- "dog garden"

כל תוצאה שומרת:
- `name` / `location` בעברית
- `name_en` / `location_en` באנגלית, כאשר Google מחזיר אותם
- `google_place_id` לצורך ייבוא חוזר בלי כפילויות

### מסוף 2: מרחבים מוגנים (ממ"ד)
סורק את האזורים תל אביב, רמת גן, גבעתיים והרצליה בחיפוש אחר:
- "ממ"ד"
- "מרחב מוגן"
- "מקלט ציבורי"
- "public shelter"
- "bomb shelter"

גם כאן נשמרים שדות עברית/אנגלית ו-`google_place_id` לצורך `upsert` בטוח.

### דאטה בייס
- **gardens**: טבלה לגינות כלבים עם `name_en`, `location_en`, `status`, `google_place_id`
- **protected_spaces**: טבלה חדשה למרחבים מוגנים עם `name_en`, `location_en`, `type`, `google_place_id`

### מיגרציות חדשות
- `supabase/migrations/20260408100000_create_protected_spaces.sql`
- `supabase/migrations/20260408100100_add_gardens_indexes_and_status.sql`
- `supabase/migrations/20260408102000_add_google_place_ids.sql`

---

נבנה באהבה לכלבים 🐕
