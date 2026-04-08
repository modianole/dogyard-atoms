# DogYard — Branch Tasks Checklist

> **Supporting Document / Not the active checklist**  
> מסמך זה נשמר כ־checklist משלים לפי branches.  
> את רשימת המשימות הפעילה יש לנהל ב־`copilot/MVP_EXECUTION_CHECKLIST.md`.

**Created:** 2026-04-07  
**Goal:** Checklist תפעולי לפי branch, כדי לדעת מה צריך להיסגר לפני merge או לפני launch.  
**Related docs:** `copilot/supporting/FEATURES_BY_BRANCH.md`, `copilot/supporting/MVP_ROADMAP.md`, `copilot/supporting/MVP_SCOPE_SPLIT.md`

---

## Definition of Done לכל branch

Branch לא נחשב מוכן לפני שכל אלה מתקיימים:

- [ ] ה־UI מחובר ל־route / entry point ברור
- [ ] יש קריאה/כתיבה אמיתית ל־Supabase במקום mock בלבד
- [ ] אין שדות שבורים מול schema
- [ ] יש error states בסיסיים
- [ ] הזרימה נבדקה ידנית מקצה לקצה
- [ ] לא נשארו TODO קריטיים שמונעים שימוש אמיתי

---

## `main` — MVP baseline

- [ ] להשאיר רק פיצ'רים שהם launch-ready
- [ ] להסיר/להסתיר flows חלקיים שאינם MVP
- [ ] לבדוק את כל ה־routes הקריטיים
- [ ] לוודא ש־release build עובר
- [ ] לוודא שהאמולטור/מכשיר מריץ את ה־core flows ללא crash

---

## `feature/add-garden`

### מה צריך להיסגר
- [ ] להסיר שימוש ב־`status: 'pending'` אם הוא כבר לא קיים ב־schema
- [ ] להחליט אם `AddGarden` נשאר ב־MVP או נדחה ל־post-MVP
- [ ] להחליף `lat/lng` רנדומליים ב־geocoding אמיתי
- [ ] להוסיף ולידציה לשם/מיקום/תמונה
- [ ] להוסיף מנגנון moderation ברור
- [ ] לבדוק upload ל־`garden-images`
- [ ] לבדוק invalidation/refresh של רשימת הגינות

### החלטת merge
- [ ] merge ל־`main` רק אם הזרימה production-ready
- [ ] אחרת להשאיר branch נפרד ל־post-MVP

---

## `feature/community-social`

### מה צריך להיסגר
- [ ] להחליט אם community שייך ל־MVP או לפאזה הבאה
- [ ] לחבר `CommunitySection` לדף הבית אם הוא נכנס למוצר
- [ ] לבדוק check-in עם `arrived` / `on_way`
- [ ] לבדוק ש־`active_garden_visitors` נטען תקין ב־`GardenDetails`
- [ ] לבדוק יצירה/מחיקה של כלבים ב־`Profile`
- [ ] להגדיר אם `Notifications` נשאר placeholder או מוסר מה־launch
- [ ] להגדיר state ברור למשתמש לא מחובר

### החלטת merge
- [ ] מה שחיוני ל־MVP: profile + dogs + basic check-in
- [ ] מה שלא חיוני: social feed / community stream / advanced notifications

---

## `feature/hazard-reporting`

### מה צריך להיסגר
- [ ] להחליט אם hazard reporting נכנס ל־MVP
- [ ] לבנות form אמיתי לדיווח
- [ ] לחבר insert ל־`hazard_reports`
- [ ] לאפשר upload ל־`hazard-images`
- [ ] להעביר `gardenId` / location לתוך הדיווח
- [ ] להציג success/error states ברורים
- [ ] להגדיר אם יש view של דיווחים פתוחים

### החלטת merge
- [ ] אם אין form אמיתי + persistence — לא למזג ל־`main`

---

## `feature/restaurant-ordering`

### מה צריך להיסגר
- [ ] להחליט אם branch זה entirely post-MVP
- [ ] לחבר `RestaurantMenu` ל־route אמיתי אם מחליטים להשיק אותו
- [ ] להחליף mock-only behavior ב־real order creation
- [ ] לחבר `sendOrder` ל־`orders`
- [ ] לחבר `RestaurantAdmin` ל־insert/update אמיתיים
- [ ] להגדיר roles והרשאות מסעדה/בעלים
- [ ] לבדוק checkout בסיסי והצגת סטטוס הזמנה

### החלטת merge
- [ ] ברירת מחדל: להשאיר branch זה מחוץ ל־MVP launch

---

## Quick merge policy

### מותר להיכנס ל־`main`
- פיצ'רים שהם core MVP
- תיקוני bug
- hardening
- legal/compliance
- build/release fixes

### לא נכנס ל־`main` לפני launch
- פיצ'רים עם mock בלבד
- flows בלי persistence אמיתי
- flows עם mismatch מול schema
- UI שנראה טוב אבל לא שלם תפעולית

---

## סדר עבודה מומלץ

1. לסגור את checklist של `main`
2. להחליט fate של `feature/add-garden`
3. למזג רק את החלק היציב מתוך `feature/community-social`
4. להשאיר `hazard` ו־`restaurant` מחוץ ל־launch אם אין E2E flow מלא


