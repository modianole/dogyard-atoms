# DogYard — Features by Branch

**Created:** 2026-04-07  
**Purpose:** מיפוי פיצ'רים ל־`MVP` ולשאר ה־branches הפעילים בפרויקט.  
**Source of truth:** קבצי ה־UI, ה־routes, ה־hooks, ה־Supabase schema ורשימת ה־git branches.

## מסמכים משלימים

- `copilot/supporting/MVP_ROADMAP.md` — Roadmap לפי `P0 / P1 / P2`
- `copilot/supporting/BRANCH_TASKS_CHECKLIST.md` — Checklist אופרטיבי לכל branch
- `copilot/supporting/MVP_SCOPE_SPLIT.md` — מה נשאר ב־`main` ומה נדחה ל־feature branches
- `copilot/MVP_EXECUTION_CHECKLIST.md` — רשימת הביצוע המדויקת עד ל־launch

---

## מקרא סטטוסים

- ✅ **קיים / מחובר** — הפיצ'ר מחובר בפועל ל־UI או ל־route ועובד ברמת מימוש בסיסית.
- 🟡 **חלקי** — יש UI ו/או backend, אבל החיבור/הזרימה עדיין לא מלאה.
- ⚪ **מוכן להרחבה** — יש בסיס קוד/סכמה שמרמז על כיוון branch, אך לא זרימה מלאה במוצר.
- 🔴 **לא ממומש עדיין** — קיים בתכנון או בסכמה בלבד.

---

## רשימת branches שזוהו

- `main`
- `feature/add-garden`
- `feature/community-social`
- `feature/hazard-reporting`
- `feature/restaurant-ordering`

---

## 1) MVP / `main`

זהו בסיס המוצר הנוכחי שעליו נכון לבנות את ה־MVP.

### פיצ'רים ב־MVP

| תחום | פיצ'ר | סטטוס | מקורות |
|---|---|---:|---|
| ניווט ואפליקציה | מעטפת אפליקציה, ראוטינג, `Navbar`, `BottomNav`, `Footer` | ✅ | `src/App.tsx`, `src/components/Navbar.tsx`, `src/components/layout/BottomNav` |
| דף בית | Hero, Top Gardens, Peak Hours | ✅ | `src/pages/Index.tsx`, `src/components/HeroSection.tsx`, `src/components/TopGardens.tsx`, `src/components/PeakHoursChart.tsx` |
| מפה | רשימת גינות + Google Maps markers + מעבר לפרטי גינה | ✅ | `src/pages/Map.tsx` |
| פרטי גינה | פרטי גינה, amenities, share, navigation, peak hours | ✅ | `src/pages/GardenDetails.tsx` |
| התחברות | `Auth`, `ResetPassword`, טיפול ב־deep links ל־Supabase auth | ✅ | `src/App.tsx`, `src/pages/Auth.tsx`, `src/pages/ResetPassword.tsx` |
| פרופיל משתמש | טעינת פרופיל, ניהול כלבים, התנתקות | ✅ | `src/pages/Profile.tsx`, `supabase/migrations/20260319000000_create_dogs_table.sql` |
| הגדרות | עדכון `display_name` ו־`phone` | ✅ | `src/pages/Settings.tsx` |
| התראות | עמוד placeholder להתראות | 🟡 | `src/pages/Notifications.tsx` |
| מסמכים משפטיים | `Privacy`, `Terms` | ✅ | `src/App.tsx`, `src/pages/Privacy.tsx`, `src/pages/Terms.tsx` |
| ייבוא אדמיני | סריקה וייבוא גינות מגוגל פלייסס | ✅ | `src/pages/AdminImport.tsx` |
| הוספת גינה | טופס הוספה + העלאת תמונה ל־Storage | 🟡 | `src/components/AddGarden.tsx`, `src/App.tsx` |

### הערות ל־MVP

1. `Add Garden` מחובר בפועל, אבל כרגע מוגדר שם `status: 'pending'` בהכנסה ל־`gardens`, בעוד שב־schema הנוכחי עמודת `status` הוסרה — לכן זה מסווג כ־🟡 חלקי.
2. `Notifications` קיים כעמוד מוצר, אך עדיין ללא feed אמיתי.
3. יש שכבת backend טובה ב־Supabase עבור reviews, peak hours, roles, profiles, restaurants, hazards ועוד — אבל לא הכול מחובר עדיין ל־UX מלא.

---

## 2) `feature/add-garden`

### מטרת ה־branch
להעמיק את תהליך הוספת הגינה על־ידי משתמשים, כולל העלאת תמונות, ולידציה, moderation ואישור מנהל.

### פיצ'רים משויכים

- טופס הוספת גינה עם שדות שם + מיקום.
- העלאת תמונה ל־bucket `garden-images`.
- דרישת התחברות לפני שליחה.
- invalidate ל־query של `gardens` לאחר הוספה.
- flow של "נשלח לבדיקה" לאחר submit.

### סטטוס
🟡 **חלקי / קיים חלקית על `main`**

### מה כבר קיים בקוד

- `src/components/AddGarden.tsx`
- route ב־`src/App.tsx` תחת `/add-garden`
- bucket והרשאות ל־`garden-images` ב־`supabase/migrations/20260315175015_255e41cc-6a55-43d9-9898-9e642025deed.sql`

### מה עדיין חסר כדי לסגור branch מלא

- התאמה מלאה ל־schema הנוכחי של `gardens`.
- moderation/admin approval אמיתי ולא רק הודעת UI.
- geocoding אמיתי במקום `lat/lng` רנדומליים.
- ולידציה עסקית ברורה יותר (duplicate detection / exact location).

---

## 3) `feature/community-social`

### מטרת ה־branch
להרחיב את האפליקציה מקטלוג גינות ל־social layer: מי נמצא בגינה, check-in, נוכחות כלבים, פרופילי משתמשים ותחושת קהילה.

### פיצ'רים משויכים

- `Check-in` לגינה עם סטטוסים `arrived` / `on_way`.
- הצגת מבקרים פעילים בגינה.
- פרופיל משתמש עם רשימת כלבים.
- רכיב `CommunitySection` לדף נחיתה/מיתוג חברתי.
- בסיס להתראות על חברים/מבקרים בעתיד.

### סטטוס
🟡 **חלקי עם בסיס חזק ב־`main`**

### מה כבר קיים בקוד

- `src/pages/GardenDetails.tsx` — check-in + visitors + בחירת כלבים.
- `src/pages/Profile.tsx` — פרופיל אישי וניהול כלבים.
- `src/components/CommunitySection.tsx` — רכיב UI קהילתי.
- `supabase/migrations/20260316100000_check_in_logic.sql` — view של `active_garden_visitors`.
- `supabase/migrations/20260319000000_create_dogs_table.sql` — טבלת `dogs`.

### מה עדיין חסר כדי לסגור branch מלא

- `CommunitySection` לא מחובר כרגע לדף הבית.
- אין social feed / friend graph / comments.
- אין התראות קהילתיות אמיתיות, רק placeholder ב־`Notifications`.
- אין דף קהילה ייעודי עם activity stream.

---

## 4) `feature/hazard-reporting`

### מטרת ה־branch
לאפשר למשתמשים לדווח על מפגעים בגינות, לעקוב אחר סטטוס דיווחים, ולייצר מסלול טיפול אדמיני.

### פיצ'רים משויכים

- UI לדיווח על מפגע.
- קריאה לפעולה מתוך `GardenDetails`.
- backend table ל־`hazard_reports`.
- bucket ייעודי ל־`hazard-images`.
- תמיכה עתידית בסטטוסים `open / in_progress / resolved`.

### סטטוס
🟡 **חלקי**

### מה כבר קיים בקוד

- `src/components/HazardReport.tsx` — מעטפת UI עם CTA לדיווח/טלפון.
- `src/pages/GardenDetails.tsx` — שילוב רכיב hazard בתוך פרטי גינה.
- `supabase/migrations/20260315175015_255e41cc-6a55-43d9-9898-9e642025deed.sql` — `hazard_reports` + `hazard-images`.

### מה עדיין חסר כדי לסגור branch מלא

- form אמיתי לשליחת דיווח.
- upload תמונה בפועל ל־`hazard-images`.
- קישור דיווח ל־`garden_id` + geolocation.
- dashboard/ניהול סטטוס למנהלים.
- feed או רשימת מפגעים פתוחים.

---

## 5) `feature/restaurant-ordering`

### מטרת ה־branch
להוסיף שכבת מסחר מקומית סביב הגינות: תפריטים, מבצעים, הזמנות, ותפעול מצד מסעדות/אדמינים.

### פיצ'רים משויכים

- שליפת מסעדות + menu items + deals מה־DB.
- תפריט מסעדה עם קטגוריות, popular items, cart.
- מבצעים (`deals`) והצגת מחירים.
- ממשק אדמין/בעלים לניהול תפריט ומבצעים.
- בסיס backend להזמנות (`orders`).

### סטטוס
🟡 **חלקי עם schema חזק**

### מה כבר קיים בקוד

- `src/components/RestaurantMenu.tsx` — UI עשיר לתפריט, cart, deals, fallback mock.
- `src/components/RestaurantAdmin.tsx` — UI לניהול מסעדה/מבצעים.
- `src/hooks/useRestaurants.ts` — שליפה מ־Supabase של `restaurants`, `menu_items`, `deals`.
- `supabase/migrations/20260315175015_255e41cc-6a55-43d9-9898-9e642025deed.sql` — tables עבור `restaurants`, `menu_items`, `deals`, `orders`.

### מה עדיין חסר כדי לסגור branch מלא

- `RestaurantMenu` לא מחובר כרגע ל־route ב־`src/App.tsx`.
- כפתור `sendOrder` עדיין לא יוצר `order` בפועל.
- `RestaurantAdmin` שומר כרגע רק state מקומי — לא persist ל־DB.
- אין owner portal מלא, order tracking, status updates או checkout אמיתי.

---

## סיכום קצר לפי עדיפות

### P0 — מה נחשב MVP מיידי
- Home + Map + Garden Details
- Auth + Reset Password
- Profile + Dogs
- Settings
- Legal pages
- Admin Import

### P1 — מה כדאי לסגור מיד אחרי ה־MVP
- `feature/add-garden`
- `feature/community-social`
- `feature/hazard-reporting`

### P2 — הרחבה עסקית / monetization
- `feature/restaurant-ordering`

---

## המלצת עבודה

אם רוצים לנהל את זה כענפים ברורים:

1. **להשאיר את `main` כ־MVP baseline בלבד**.
2. **להגדיר לכל branch Definition of Done**:
   - UI מחובר ל־route
   - כתיבה/קריאה אמיתית ל־Supabase
   - הרשאות/RLS תקינות
   - לפחות flow אחד בדוק מקצה לקצה
3. **לסגור קודם את ה־partial flows שכבר קיימים ב־`main`** לפני הוספת פיצ'רים חדשים.

---

## קבצי מקור עיקריים שנבדקו

- `src/App.tsx`
- `src/pages/Index.tsx`
- `src/pages/Map.tsx`
- `src/pages/GardenDetails.tsx`
- `src/pages/Profile.tsx`
- `src/pages/Settings.tsx`
- `src/pages/Notifications.tsx`
- `src/pages/AdminImport.tsx`
- `src/components/AddGarden.tsx`
- `src/components/CommunitySection.tsx`
- `src/components/HazardReport.tsx`
- `src/components/RestaurantMenu.tsx`
- `src/components/RestaurantAdmin.tsx`
- `src/hooks/useRestaurants.ts`
- `supabase/migrations/20260315175015_255e41cc-6a55-43d9-9898-9e642025deed.sql`
- `supabase/migrations/20260316100000_check_in_logic.sql`
- `supabase/migrations/20260319000000_create_dogs_table.sql`


