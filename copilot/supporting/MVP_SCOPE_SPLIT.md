# DogYard — MVP Scope Split

> **Supporting Document / Not the active checklist**  
> מסמך זה נשמר להחלטות scope בלבד.  
> את רשימת המשימות הפעילה יש לנהל ב־`copilot/MVP_EXECUTION_CHECKLIST.md`.

**Created:** 2026-04-07  
**Goal:** להפריד בצורה ברורה בין מה שחייב להישאר ב־`main` לצורך ה־MVP לבין מה שצריך להישאר ב־feature branches עד לאחר ה־launch.  
**Related docs:** `copilot/FEATURES_BY_BRANCH.md`, `copilot/MVP_ROADMAP.md`, `copilot/BRANCH_TASKS_CHECKLIST.md`, `copilot/MVP_EXECUTION_CHECKLIST.md`

---

## עיקרון בסיס

`main` הוא **release branch של ה־MVP** — לא branch ניסיוני.

כל דבר שנמצא ב־`main` צריך לעמוד בשלושה תנאים:

1. הוא באמת חשוב ל־MVP
2. הוא עובד בפועל מקצה לקצה
3. הוא לא מסכן את היציבות של ה־launch

---

## מה נשאר ב־`main`

### Core product
- [x] `Home`
- [x] `Map`
- [x] `GardenDetails`
- [x] `Auth`
- [x] `ResetPassword`
- [x] `Profile`
- [x] `Settings`
- [x] `Privacy`
- [x] `Terms`
- [x] `AdminImport`

### Core user value
- [x] חיפוש וצפייה בגינות
- [x] צפייה בפרטי גינה
- [x] כניסה/יציאה מהמערכת
- [x] ניהול פרופיל בסיסי
- [x] ניהול כלבים

### Release / compliance
- [x] Android release flow
- [x] Legal pages
- [x] Firebase / Crashlytics / build stability

---

## מה נשאר ב־`main` רק אם נסגר כראוי

### `AddGarden`

**אפשר להשאיר ב־`main` רק אם:**
- [ ] schema תואם
- [ ] submit עובד באמת
- [ ] location נשמר נכון
- [ ] אין broken flow למשתמש

**אם לא — להוציא מה־launch / להסתיר route / CTA.**

### Basic community bits

**אפשר להשאיר ב־`main` רק אם:**
- [ ] profile + dogs יציבים
- [ ] check-in בסיסי עובד
- [ ] אין תלות ב־social feed עתידי

---

## מה לא חייב להיות ב־MVP

### נשאר ב־feature branches / post-MVP
- [ ] `CommunitySection` כ־feature marketing/community מלא
- [ ] social feed
- [ ] advanced notifications
- [ ] hazard reporting מלא
- [ ] restaurant ordering מלא
- [ ] owner/admin restaurant portal מלא
- [ ] order workflow מלא

---

## החלטה מומלצת לכל branch

### `feature/add-garden`
**החלטה:** conditional  
אם מתקנים את הפער מול schema במהירות — אפשר להכניס.  
אם לא — לדחות ל־post-MVP.

### `feature/community-social`
**החלטה:** merge חלקי בלבד  
להשאיר ב־`main` רק את מה שתומך ישירות ב־`Profile` / `Dogs` / basic check-in.

### `feature/hazard-reporting`
**החלטה:** לדחות מה־launch  
ה־UI קיים, אבל flow לא שלם.

### `feature/restaurant-ordering`
**החלטה:** לדחות מה־launch  
יש הרבה בסיס, אבל זה עדיין לא MVP-safe.

---

## מה צריך להסתיר או להוציא אם לא נסגר בזמן

- [ ] route של `AddGarden`
- [ ] CTA ל־hazard אם אין form אמיתי
- [ ] כל entry point למסעדות אם אין order flow אמיתי
- [ ] community sections שלא מחוברים באמת
- [ ] `Notifications` אם הוא יוצר ציפייה לא נכונה למשתמש

---

## Release baseline של `main`

לפני launch, `main` צריך להכיל רק את זה:

- מוצר core יציב
- routes לא שבורים
- build release תקין
- DB flows אמיתיים
- legal/compliance
- UX סביר גם ב־empty/error states

אם feature מסוים לא עומד בזה — הוא **לא שייך ל־`main`**.

---

## החלטת מוצר מומלצת

### כן ל־MVP launch
- גילוי גינות
- פרטי גינה
- התחברות
- פרופיל וכלבים
- הגדרות
- legal
- admin import / data population

### לא ל־MVP launch
- hazard workflow מלא
- restaurant commerce
- social/community advanced layer
- notifications אמיתיות

---

## Next action

1. לעבור על `copilot/BRANCH_TASKS_CHECKLIST.md`
2. להחליט אילו routes להסתיר או להשאיר
3. לבצע hardening על `main`
4. לבנות release candidate רק אחרי scope freeze



