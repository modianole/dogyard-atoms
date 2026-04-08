# Docker Security Checklist

מטרת המסמך: לוודא שרק מה שנחוץ באמת ל־web container נכנס ל־build context ולאימג'.

> הפרויקט הזה נבנה כ־`Vite SPA` ומוגש דרך `nginx`. לכן הקונטיינר צריך להכיל רק את תוצרי ה־frontend הסטטיים ואת קבצי ההגשה המינימליים.

---

## 1. כלל ברזל

אם קובץ/ערך לא נדרש ישירות כדי:
- להתקין תלויות frontend
- לבנות את `dist`
- להגיש את `dist` דרך `nginx`

הוא **לא אמור להיכנס** ל־container.

---

## 2. דברים שאסור להכניס לקונטיינר לעולם

### Secrets / Credentials
- [ ] סיסמאות מכל סוג
- [ ] טוקנים פרטיים
- [ ] JWT secrets
- [ ] API keys סודיים
- [ ] private certificates
- [ ] private SSH keys
- [ ] מפתחות הצפנה
- [ ] קבצי service account
- [ ] קבצי הרשאות של ספקי ענן
- [ ] קבצי credential exports
- [ ] קבצי `.env`
- [ ] קבצי `.env.*` עם ערכים אמיתיים
- [ ] כל קובץ config שמכיל secret inline

### Database access
- [ ] פרטי גישה למסדי נתונים
- [ ] DB passwords
- [ ] connection strings עם username/password
- [ ] service-role keys
- [ ] admin tokens
- [ ] migration secrets

### Local / machine-specific config
- [ ] הגדרות שרת מקומי
- [ ] כתובות LAN מקומיות
- [ ] `local.properties`
- [ ] Android Studio / IDE local config
- [ ] קבצי override מקומיים
- [ ] קבצים שנוצרים רק על מחשב מפתח

### Dev-only / test-only content
- [ ] קבצי בדיקות
- [ ] fixtures
- [ ] Playwright / Vitest config אם לא נדרשים לבילד
- [ ] mock data לא רלוונטי ל־runtime
- [ ] debug logs
- [ ] crash dumps
- [ ] profiler output
- [ ] build reports
- [ ] מסמכי עבודה פנימיים
- [ ] notes / archives / temporary exports

### Native / unrelated stacks
- [ ] קוד Android
- [ ] קבצי Gradle
- [ ] keystore files
- [ ] Firebase Android config אם לא נדרש ל־web build
- [ ] backend migrations אם הקונטיינר הוא web-only
- [ ] קבצי Supabase local tooling

---

## 3. חריג חשוב: `VITE_*`

ב־Vite, כל ערך תחת `VITE_*` הוא **public-by-design** ויכול להגיע ל־client bundle.

לכן:
- [ ] לא לשים secrets אמיתיים תחת `VITE_*`
- [ ] לא לשים service-role keys תחת `VITE_*`
- [ ] לא לשים database passwords תחת `VITE_*`
- [ ] לא לשים private admin tokens תחת `VITE_*`

מותר רק אם זה **browser-safe public config**, למשל:
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Google Maps browser key מוגבל ל־referrer/domain
- [ ] admin identifier public-like שאינו סוד כשלעצמו

---

## 4. Checklist לפני `docker build`

### Build context minimization
- [ ] `Dockerfile` מעתיק רק whitelist של קבצים נחוצים
- [ ] `.dockerignore` חוסם directories של פיתוח
- [ ] `.dockerignore` חוסם files רגישים
- [ ] לא משתמשים ב־`COPY . .` בלי סיבה טובה
- [ ] אין קבצי local config שנכנסים בטעות ל־context

### Configuration review
- [ ] כל build arg נבדק אם הוא public או secret
- [ ] כל secret אמיתי נשאר מחוץ ל־image
- [ ] אין `ENV` בתוך ה־Dockerfile עם secret אמיתי
- [ ] אין hardcoded credentials בקוד

### Runtime review
- [ ] ה־final image לא מכיל source files לא נחוצים
- [ ] ה־final image לא מכיל test files
- [ ] ה־final image לא מכיל docs פנימיים
- [ ] ה־final image לא מכיל Android / Supabase tooling
- [ ] ה־final image מכיל רק static assets + nginx config

---

## 5. Checklist מותאם לריפו הזה

### קבצים/אזורים שחייבים להישאר מחוץ לקונטיינר
- [ ] `.env`
- [ ] `.env.*`
- [ ] `dogyard.keystore`
- [ ] `local.properties`
- [ ] `android/local.properties`
- [ ] `android/app/google-services.json`
- [ ] `android/`
- [ ] `supabase/`
- [ ] `src/test/`
- [ ] `playwright.config.ts`
- [ ] `playwright-fixture.ts`
- [ ] `vitest.config.ts`
- [ ] `copilot/`
- [ ] `tmp/`
- [ ] `The Prompte/`
- [ ] `.idea/`
- [ ] `.git/`
- [ ] `build/reports/`
- [ ] `android/hs_err_*.log`
- [ ] `android/replay_pid*.log`
- [ ] `*.pem`
- [ ] `*.key`
- [ ] `*.crt`
- [ ] `*.p12`
- [ ] `*.jks`
- [ ] `*.keystore`

### קבצים שכן נחוצים ל־web container build
- [ ] `package.json`
- [ ] `package-lock.json`
- [ ] `index.html`
- [ ] `vite.config.ts`
- [ ] `postcss.config.js`
- [ ] `tailwind.config.ts`
- [ ] `components.json`
- [ ] `tsconfig.json`
- [ ] `tsconfig.app.json`
- [ ] `tsconfig.node.json`
- [ ] `src/`
- [ ] `public/`
- [ ] `nginx.conf`

---

## 6. בדיקות אימות מומלצות

- [ ] להריץ `docker compose config` ולוודא שלא עוברים secrets אסורים
- [ ] להריץ `docker build` ולוודא שאין קבצים חשודים ב־context
- [ ] לבדוק את `Dockerfile` שלא מעתיק root שלם בלי צורך
- [ ] לבדוק ש־browser keys מוגבלים ב־Google Cloud / ספק חיצוני
- [ ] לבדוק ש־Supabase service role key לא מופיע בשום מקום ב־frontend

---

## 7. החלטת אבטחה מומלצת לפרויקט הזה

ה־container צריך להישאר **web-only**:
- לבנות את אפליקציית Vite
- להגיש `dist` דרך `nginx`

הוא **לא** אמור להכיל:
- backend secrets
- Android artifacts
- local dev configuration
- database administration files
- test infrastructure
- internal documentation

---

## 8. כלל סיום

אם יש ספק אם משהו צריך להיכנס לקונטיינר — ברירת המחדל היא **לא**.

