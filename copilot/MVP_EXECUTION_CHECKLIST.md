# DogYard — MVP Execution Checklist

**Created:** 2026-04-07  
**Purpose:** רשימת משימות מדויקת, אופרטיבית ומדורגת בדרך ל־MVP.  
**Primary use:** זהו מסמך העבודה המרכזי לביצוע בפועל עד עלייה לאוויר.  
**Related docs:** `copilot/supporting/MVP_SCOPE_SPLIT.md`, `copilot/supporting/MVP_ROADMAP.md`, `copilot/supporting/BRANCH_TASKS_CHECKLIST.md`, `copilot/supporting/FEATURES_BY_BRANCH.md`

> **Single Source of Truth:** זהו המסמך היחיד שאמור להתעדכן מעכשיו עבור משימות MVP.  
> `copilot/supporting/MVP_ACTION_PLAN.md` נשאר כמסמך הנחיה/רקע.  
> `copilot/archive/TASKS_CHECKLIST.md` נשאר כיומן התקדמות היסטורי.

---

## מה ההבדל בין המסמכים

### `copilot/MVP_EXECUTION_CHECKLIST.md`
- רשימת העבודה הפעילה
- מסודר לפי פאזות ביצוע
- כולל `P0 / P1 / P2`
- כולל `Acceptance Criteria`
- זה המסמך שמעדכנים מעכשיו

### `copilot/supporting/MVP_ACTION_PLAN.md`
- מסמך אסטרטגיה והנחיות מפורטות
- כולל דוגמאות קוד, הסברים ורקע
- לא מתאים לניהול שוטף של סטטוס

### `copilot/archive/TASKS_CHECKLIST.md`
- יומן היסטורי של מה כבר הושלם
- כולל proof of work, artifacts, וספירת התקדמות ישנה
- לא מתאים יותר להיות רשימת העבודה הראשית

---

## Phase 0 — Imported Status from Legacy Docs

### הושלם כבר ואומת
- [x] **P0** — תיקון זיכרון Gradle (`android/gradle.properties`)
- [x] **P0** — Network security configuration ל־production
- [x] **P0** — Debug/Release build variants + signing setup
- [x] **P0** — יצירת keystore ל־release signing
- [x] **P0** — Capacitor production configuration ללא `server.url` קשיח
- [x] **P0** — Privacy Policy ו־Terms of Service
- [x] **P0** — Firebase project + Crashlytics setup
- [x] **P0** — ProGuard rules + minification
- [x] **P0** — `npm run build` עבר
- [x] **P0** — `assembleDebug` עבר
- [x] **P0** — `assembleRelease` עבר
- [x] **P0** — `app-release.aab` נבנה
- [x] **P0** — `README.md` עודכן
- [x] **P0** — אייקונים `192x192` ו־`512x512` קיימים

### עדיין לא הושלם מהמסמכים הישנים
- [ ] **P0** — בדיקות ידניות על Android 7 / 12+ / 15
- [ ] **P0** — בדיקת Location בפועל
- [ ] **P1** — בדיקת Bluetooth בפועל
- [ ] **P0** — screenshots / feature graphic / store assets סופיים

---

## חוקי עבודה

- `P0` = חייב להיסגר **לפני launch**
- `P1` = אפשר לסגור **מיד אחרי launch**
- `P2` = nice to have / post-MVP
- כל משימה נסגרת רק אם יש **Acceptance Criteria** ברור
- אם feature לא עומד בקריטריוני MVP — הוא יוצא מ־`main` או מוסתר מה־launch

---

## Phase 1 — Scope Freeze

### 1.1 החלטה סופית על scope של `main`
- [ ] **P0** — לאשר ש־`main` כולל רק: `Home`, `Map`, `GardenDetails`, `Auth`, `ResetPassword`, `Profile`, `Settings`, `Privacy`, `Terms`  
  **Refs:** `src/App.tsx`, `copilot/supporting/MVP_SCOPE_SPLIT.md`  
  **Acceptance:** יש רשימת routes סופית שאושרה ל־launch.

- [ ] **P0** — `AdminImport` נעול זמנית לכולם עד הקשחת הרשאות לחשבון בעלים יחיד והגדרת מזהה אמיתי ב־env  
  **Refs:** `src/App.tsx`, `src/hooks/useDeveloperAccess.ts`, `.env`  
  **Acceptance:** `/admin/import` לא נגיש לאף משתמש כרגע; פתיחה מחדש רק אחרי עדכון `VITE_ADMIN_USER_ID`/`VITE_ADMIN_EMAIL` ובדיקת אבטחה.

- [ ] **P0** — להחליט אם `AddGarden` נשאר ב־launch או יוצא ממנו  
  **Refs:** `src/components/AddGarden.tsx`, `src/App.tsx`  
  **Acceptance:** קיימת החלטה אחת ברורה: או flow תקין לייצור, או route/entry מוסתר מה־launch.

- [ ] **P0** — להחליט אם `Notifications` נשאר כעמוד placeholder או מוסר זמנית  
  **Refs:** `src/pages/Notifications.tsx`, navigation components  
  **Acceptance:** המשתמש לא נחשף למסך שמייצר ציפייה לפיצ'ר שלא באמת קיים.

- [ ] **P0** — לאשר ש־`hazard-reporting` ו־`restaurant-ordering` לא נכנסים ל־launch  
  **Refs:** `copilot/supporting/MVP_SCOPE_SPLIT.md`, `copilot/supporting/FEATURES_BY_BRANCH.md`  
  **Acceptance:** אין route או CTA פרודקשני לפיצ'רים לא־מוגמרים.

---

## Phase 2 — Core Flow Stabilization

### 2.1 Home + Map + Garden Details
- [ ] **P0** — לבדוק ש־`Map` טוען גינות אמיתיות מ־Supabase ללא שגיאת runtime  
  **Refs:** `src/pages/Map.tsx`  
  **Acceptance:** המפה נטענת, markers מוצגים, ורשימת הגינות מופיעה בלי crash.

- [ ] **P0** — לבדוק ש־בחירת גינה במפה מובילה תקין ל־`/garden/:id`  
  **Refs:** `src/pages/Map.tsx`, `src/pages/GardenDetails.tsx`  
  **Acceptance:** מעבר לפרטי גינה עובד לפחות עבור גינה אחת קיימת.

- [ ] **P0** — לבדוק ש־`GardenDetails` מטפל נכון בגינה חסרה/מזהה לא תקין  
  **Refs:** `src/pages/GardenDetails.tsx`  
  **Acceptance:** אין crash; המשתמש רואה empty/error state ברור.

- [ ] **P0** — לבדוק ש־`PeakHoursChart` ו־visitors לא שוברים את המסך כשאין נתונים  
  **Refs:** `src/pages/GardenDetails.tsx`, `src/components/PeakHoursChart.tsx`  
  **Acceptance:** המסך יציב גם עם DB חלקי או ריק.

### 2.2 Auth
- [ ] **P0** — לבדוק login מלא  
  **Refs:** `src/pages/Auth.tsx`, `src/App.tsx`  
  **Acceptance:** משתמש יכול להתחבר ולהגיע חזרה לאפליקציה בלי לולאות/שגיאות.

- [ ] **P0** — לבדוק logout מלא  
  **Refs:** `src/pages/Profile.tsx`  
  **Acceptance:** לאחר logout אין גישה ל־flows שמחייבים משתמש.

- [ ] **P0** — לבדוק reset password דרך deeplink/callback  
  **Refs:** `src/pages/ResetPassword.tsx`, `src/App.tsx`  
  **Acceptance:** איפוס סיסמה עובד ומסיים ב־session תקין או הודעת שגיאה ברורה.

### 2.3 Profile + Dogs
- [ ] **P0** — לבדוק טעינת פרופיל עבור משתמש חדש וקיים  
  **Refs:** `src/pages/Profile.tsx`, `supabase` profile tables  
  **Acceptance:** אין מסך שבור גם אם יש משתמש חדש בלי נתונים מלאים.

- [ ] **P0** — לבדוק יצירת כלב חדש  
  **Refs:** `src/pages/Profile.tsx`, `supabase/migrations/20260319000000_create_dogs_table.sql`  
  **Acceptance:** כלב נשמר ב־DB ומופיע מיד במסך.

- [ ] **P0** — לבדוק מחיקת כלב  
  **Refs:** `src/pages/Profile.tsx`  
  **Acceptance:** מחיקה מסירה את הכלב מה־DB ומה־UI ללא refresh ידני בעייתי.

### 2.4 Settings
- [ ] **P0** — לבדוק שמירת `display_name` ו־`phone`  
  **Refs:** `src/pages/Settings.tsx`  
  **Acceptance:** הנתונים נשמרים בפועל ומופיעים לאחר חזרה ל־`Profile`.

### 2.5 AddGarden — decision gate
- [ ] **P0** — לבדוק mismatch מול schema בטופס הוספת גינה  
  **Refs:** `src/components/AddGarden.tsx`, `supabase/migrations/20260318234137_d4a06778-df6c-4603-9f38-4d84b5deb859.sql`  
  **Acceptance:** הוחלט אם מתקנים מייד או מוציאים מה־launch.

- [ ] **P0** — אם מחליטים להשאיר: להסיר שדות שבורים ולהוכיח submit תקין  
  **Refs:** `src/components/AddGarden.tsx`  
  **Acceptance:** שליחת גינה עובדת בפועל מול ה־DB ללא שגיאת column mismatch.

- [ ] **P0** — אם מחליטים לדחות: להסתיר route / CTA / entry point  
  **Refs:** `src/App.tsx`, relevant nav/CTA components  
  **Acceptance:** המשתמש לא מגיע לזרימה חצי־שבורה בגרסת ה־launch.

---

## Phase 3 — MVP-Safe UX Hardening

- [ ] **P0** — לעבור על כל ה־empty states במסכים המרכזיים  
  **Refs:** `Map`, `GardenDetails`, `Profile`, `Notifications`  
  **Acceptance:** אין מסך ריק/מביך/שבור למשתמש.

- [ ] **P0** — לעבור על כל מסכי ה־loading  
  **Refs:** core pages  
  **Acceptance:** בכל flow מרכזי יש loading state ברור ולא flicker/blank screen.

- [ ] **P0** — לעבור על שגיאות משתמש לא מחובר  
  **Refs:** `Profile`, `Settings`, `AddGarden`, `GardenDetails` check-in  
  **Acceptance:** כל flow מוגן מפנה ל־`/auth` או מציג הודעה ברורה.

- [ ] **P0** — לוודא שאין UI שמבטיח פיצ'ר שלא עובד בפועל  
  **Refs:** `Notifications`, `HazardReport`, restaurant-related components  
  **Acceptance:** מה שמופיע למשתמש קיים באמת או מסומן בבירור כלא זמין.

---

## Phase 4 — Manual QA Before Launch

### 4.1 Smoke test matrix
- [ ] **P0** — `/` נפתח ללא crash
- [ ] **P0** — `/map` נפתח ומציג גינות
- [ ] **P0** — `/garden/:id` נפתח מגינה אמיתית
- [ ] **P0** — `/auth` עובד
- [ ] **P0** — `/reset-password` עובד
- [ ] **P0** — `/profile` עובד עם משתמש מחובר
- [ ] **P0** — `/settings` שומר שינויים
- [ ] **P0** — `/privacy` ו־`/terms` נגישים
- [ ] **P0** — `/admin/import` חסום לכולם זמנית (security lock)

### 4.2 Auth states
- [ ] **P0** — אורח (לא מחובר) יכול לגלוש במסכים הציבוריים
- [ ] **P0** — אורח לא נשבר במסכים שדורשים משתמש
- [ ] **P0** — משתמש מחובר עובר נכון בין profile/settings/map

### 4.3 Device sanity
- [ ] **P0** — בדיקה על אמולטור Android
- [ ] **P0** — בדיקה אחת לפחות על build release
- [ ] **P0** — בדיקה של הרשאות/התנהגות כשאין GPS/נתונים

**Acceptance של הפאזה:** כל ה־smoke tests עוברים ללא blocker.

---

## Phase 5 — Release Readiness

- [ ] **P0** — `npm run build` עובר  
  **Acceptance:** web assets נבנים ללא שגיאות blocker.

- [ ] **P0** — `android/:app:assembleDebug` עובר  
  **Acceptance:** debug build תקין.

- [ ] **P0** — `android/:app:assembleRelease` או `bundleRelease` עובר  
  **Acceptance:** יש artifact תקין ל־release.

- [ ] **P0** — לוודא שאין `server.url` של dev ב־production assets  
  **Refs:** `capacitor.config.ts`, generated Android assets  
  **Acceptance:** release נטען מ־bundled assets בלבד.

- [ ] **P0** — לוודא שאין secrets קשיחים ב־repo  
  **Acceptance:** סודות נמצאים ב־env / local config בלבד.

- [ ] **P0** — לוודא Crashlytics / Firebase מוגדרים נכון ל־Android build  
  **Refs:** `android/build.gradle`, `android/app/build.gradle`  
  **Acceptance:** build לא נופל בגלל plugin/config mismatch.

---

## Phase 6 — Store & Compliance

- [ ] **P0** — לוודא `Privacy` ו־`Terms` נגישים מהאפליקציה  
  **Acceptance:** קיימים routes וקישורים עובדים.

- [ ] **P0** — להכין app icon סופי ו־store assets  
  **Acceptance:** יש סט אייקונים וסקרינשוטים ל־store listing.

- [ ] **P0** — להכין תיאור קצר ותיאור מלא לחנות  
  **Acceptance:** copy מוכן ל־Play Console.

- [ ] **P0** — לוודא גרסת release חתומה ומוכנה לפרסום  
  **Acceptance:** APK/AAB חתום וקיים בנתיב build output.

---

## Go / No-Go Gate

אין launch לפני שכל אלה מסומנים:

- [ ] Scope של `main` סגור
- [ ] אין route שבור או חצי־ממומש
- [ ] core flows עברו QA ידני
- [ ] release build עבר
- [ ] legal pages זמינים
- [ ] assets בסיסיים לחנות מוכנים
- [ ] כל פיצ'ר deferred הוצא בפועל מה־launch

---

## Post-Launch Backlog

### P1
- [ ] `feature/add-garden` — geocoding + moderation אמיתי
- [ ] `feature/community-social` — community section מחובר + שדרוג check-in
- [ ] `feature/hazard-reporting` — form אמיתי + persistence
- [ ] שיפור notifications מעבר ל־placeholder
- [ ] שיפור UX/error handling

### P2
- [ ] `feature/restaurant-ordering`
- [ ] social feed מלא
- [ ] hazard/admin dashboards
- [ ] owner/restaurant portal מלא
- [ ] advanced analytics / telemetry

---

## Suggested Execution Order

1. לסגור scope של `main`
2. להחליט fate של `AddGarden`
3. לבצע hardening ל־core flows
4. להריץ smoke tests ידניים
5. לבנות release candidate
6. להכין store assets
7. לצאת ל־launch



