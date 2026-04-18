# TODO — Master Checklist (Consolidated)

**Last updated:** 2026-04-18  
**Purpose:** רשימת משימות מאוחדת ומסודרת מכל מסמכי הפרויקט הפעילים, עם דה-דופליקציה בסיסית וסדר ביצוע.

## Legend
- [ ] פתוח
- [~] בתהליך
- [x] הושלם
- [!] חסימה קריטית

---

## 1) P0 — Launch Blockers (Must Close Before Release)

### 1.1 Scope & Route Freeze
- [x] לאשר ש-`main` כולל רק את ה-routes שאושרו ל-launch (`/`, `/map`, `/garden/:id`, `/auth`, `/reset-password`, `/profile`, `/settings`, `/privacy`, `/terms`) — מסלולים מחוץ ל-launch (`/admin/*`, `/dog-share/accept`) הוגבלו בדגלי env ב-`src/App.tsx`.
- [x] להשאיר `AdminImport` חסום עד לקשיחות הרשאות מלאה והגדרת `VITE_ADMIN_USER_ID`/`VITE_ADMIN_EMAIL` אמיתי — נדרש גם `VITE_ENABLE_ADMIN_ROUTES=true` וגם strict admin config.
- [x] להכריע סופית על `AddGarden`: להשאיר עם flow פרודקשן תקין או להסתיר מה-launch — הוחלט להסתיר מה-launch (אין route חשוף).
- [x] להכריע סופית על `Notifications` placeholder: להסיר חשיפה משתמש או לסמן זמינות ברורה — הוסר מחשיפה למשתמש (ללא route ב-`src/App.tsx`).
- [x] לאשר ש-`hazard-reporting` ו-`restaurant-ordering` לא חשופים ב-launch — אין routes ייעודיים פעילים ב-launch shell.

### 1.2 Core Flow Stabilization (App)
- [~] לאמת ש-`Map` טוען גינות אמיתיות מ-Supabase ללא runtime errors — הוסף סינון רשומות לא תקינות ב-`src/pages/Map.tsx` + נוספו unit tests ל-`formatGardenName` ב-`src/test/format-garden-name.test.ts`; נדרש אימות אינטגרציה מול DB אמיתי.
- [~] לאמת ניווט תקין מ-`Map` אל `GardenDetails` (`/garden/:id`) — wiring קיים (`navigate(`/garden/${garden.id}`)` + route), נדרש אימות ידני מקצה לקצה.
- [x] לאמת טיפול תקין ב-garden id לא תקין/חסר בלי crash — נוסף guard לפרמטר מזהה ב-`src/pages/GardenDetails.tsx`.
- [x] לאמת `PeakHoursChart`/visitors יציבים גם כשאין נתונים — fallback + numeric coercion מחוזקים ב-`src/components/PeakHoursChart.tsx`.
- [~] לאמת login מלא (כולל חזרה תקינה לאפליקציה) — הוסף שימור `next` בטוח ב-`ProtectedRoute` + `Auth`, חולץ ל-`src/lib/authRedirect.ts` ונוספו unit tests ב-`src/test/auth-redirect.test.ts`; נדרש אימות E2E עם Supabase Auth אמיתי.
- [~] לאמת logout מלא (אין גישה ל-flows מוגנים אחרי יציאה) — flow קיים (`supabase.auth.signOut` + redirect), נדרש אימות ידני למסכים מוגנים.
- [~] לאמת reset password דרך callback/deeplink — routes ו-`appUrlOpen` wiring קיימים; נדרש אימות ידני בדפדפן וב-Capacitor.
- [~] לאמת טעינת `Profile` למשתמש חדש וקיים — `src/pages/Profile.tsx` הוקשח ל-`profiles.maybeSingle()` + handling לשגיאות/טעינה; נדרש אימות ידני מול משתמש חדש וקיים ב-Supabase אמיתי.
- [~] לאמת יצירת כלב חדש ושמירה ב-DB — נוספו normalizing לשם/גזע + lock למניעת כפילויות + refresh אחרי insert; נדרש אימות ידני מול DB אמיתי.
- [~] לאמת מחיקת כלב מה-DB ומה-UI — נוספה מניעת delete כפול + refresh אחרי delete; נדרש אימות ידני מול DB אמיתי.
- [~] לאמת שמירת `display_name` ו-`phone` ב-`Settings` — עודכן `src/pages/Settings.tsx` ל-`upsert` לפי `user_id` (כולל משתמש חדש ללא row), נדרש אימות ידני מול Supabase אמיתי.
- [x] לאמת התאמה בין `AddGarden` ל-schema בפועל (או להסיר מה-launch) — הוסר מחשיפת launch (אין route חשוף).

### 1.3 UX Hardening
- [~] לעבור על empty states במסכים המרכזיים (Map/GardenDetails/Profile/Flows מוגנים) — קיימים חלקית; נדרש מעבר ידני מלא.
- [~] לעבור על loading states בכל ה-core flows — קיימים חלקית; נדרש מעבר ידני מלא.
- [x] לוודא כל טיפול ב-unauthenticated user מפנה/מודיע ברור — נוסף שימור `auth:next` והפניה מסודרת ל-`/auth?next=...` ב-`src/components/ProtectedRoute.tsx`.
- [x] להסיר/למנוע UI שמבטיח feature לא עובד בפועל — כפתורי שיתוף כלב מוסתרים כברירת מחדל כש-`VITE_ENABLE_DOG_SHARE_ROUTE=false` ב-`src/pages/Profile.tsx`.

### 1.4 Manual QA Matrix
- [ ] `/` נפתח ללא crash.
- [ ] `/map` נפתח ומציג גינות.
- [ ] `/garden/:id` נפתח מגינה אמיתית.
- [ ] `/auth` עובד.
- [ ] `/reset-password` עובד.
- [ ] `/profile` עובד למשתמש מחובר.
- [ ] `/settings` שומר שינויים.
- [ ] `/privacy` ו-`/terms` נגישים.
- [x] `/admin/import` חסום זמנית כברירת מחדל עד פתיחה מבוקרת — route זמין רק כש-`VITE_ENABLE_ADMIN_ROUTES=true` (בנוסף לבדיקת הרשאות אדמין).
- [ ] בדיקת אורח (public screens) עוברת.
- [~] בדיקת redirect ל-auth במסכים מוגנים עוברת — נוסף כיסוי unit ב-`src/test/protected-route.test.tsx` (13/13 tests עוברים), נדרש אימות ידני מקצה לקצה.
- [ ] בדיקת device sanity: אמולטור + לפחות בדיקת release אחת + התנהגות ללא GPS/נתונים.
- [~] נוסף עזר QA ל-matrix של routes: `npm run qa:routes` (מממש `scripts/qa-launch-routes.mjs` + `scripts/qa-launch-routes.matrix.json`) ומאמת קיום routes, עטיפת `ProtectedRoute`, וגייטינג env ל-`/admin/*` ו-`/dog-share/accept`.

### 1.5 Build, Security, Release Gate
- [x] `npm run build` עובר ללא blocker — אומת מקומית ב-2026-04-17 (Vite build הצליח).
- [x] `npx cap sync android` עובר ללא blocker — אומת מקומית ב-2026-04-17.
- [x] `assembleRelease`/`bundleRelease` עובר ויוצר artifact תקין — אומת מקומית ב-2026-04-17 עם `-PDOGYARD_DISABLE_RELEASE_SIGNING=true` ונוצרו `app-release.apk` + `app-release.aab`.
- [x] לוודא שאין `server.url` דבג בנכסי production — אומת ב-`capacitor.config.ts` + `android/app/src/main/assets/capacitor.config.json` לאחר sync (ללא `server.url`).
- [~] לוודא שאין secrets קשיחים ב-repo — נמצאה ודולפה מחרוזת Google API key ב-`scripts/import-protected-spaces.mjs`, הוסרה לטובת env vars; סריקת patterns בסיסית נוספת נקייה, נדרש סבב audit מלא לפני סגירה.
- [~] לוודא Crashlytics/Firebase מוגדרים תקין בבילד אנדרואיד — תוקן `android/app/build.gradle` (נוסף resolver ל-`DOGYARD_KEY_PASSWORD`, הוסר duplicate של `hasReleaseSigning`), `npm run verify:android:firebase` עובר; נדרש עדיין אימות runtime ב-device/Crashlytics dashboard.
- [x] להוסיף forced HTTPS + HSTS ב-`nginx.conf` — נוסף redirect מבוקר עם `FORCE_HTTPS` + כותרת `Strict-Transport-Security`; תוקן parsing ב-Nginx template ואומת בקונטיינרים.
- [x] לסנכרן ולהעלות את שני שירותי Docker (`app`, `app-2`) ולאמת טעינת UI — אומת `healthy` + `HTTP 200` ב-`8082/8083` + אותו bundle JS בשני השירותים.
- [~] לפתור חסם release signing מקומי: keystore password שגוי מונע חתימת release רגילה; נוסף override בטוח לולידציה מקומית (`DOGYARD_DISABLE_RELEASE_SIGNING=true`), עדיין נדרש תיקון סודות חתימה אמיתיים לפרסום. ראה runbook קצר: `copilot/supporting/ANDROID_FIREBASE_RELEASE_CHECKS.md`.

### 1.6 Store & Compliance
- [ ] להכין screenshots סופיים לחנות.
- [ ] להכין feature graphic סופי.
- [ ] להכין תיאור קצר+מלא לחנות (he/en) ולעדכן ב-Play Console.
- [ ] לוודא release חתום מוכן לפרסום.

---

## 2) P0 — Security Open Items

### 2.1 Secret Rotation Closure
- [ ] לאשר שה-Google key הישן אכן disabled/deleted (אישור חיצוני מ-GCP).
- [ ] לאשר ש-CI/CD secrets עודכנו ונבדקו בריצה הבאה.
- [ ] להשלים את כל צ'קליסט סבב מפתחות ב-`SECURITY_RUNBOOK_API_KEY_ROTATION.md` (8 פריטים פתוחים).

### 2.2 CVE / Hardening
- [ ] להכריע האם לאמץ Docker Hardened Images (DHI) לפרודקשן.
- [ ] לתעד מפתחות מסובבים ב-vault ארגוני (1Password/LastPass וכו').
- [ ] לבצע `npm audit` remediation עבור dependencies קריטיות לפי `CO.md`.

---

## 3) P0 — Decisions Required (Owner/User)

- [ ] החלטת Go/No-Go עסקית סופית לפני שחרור.
- [ ] החלטת merge/branching לפיצ'רים deferred.
- [ ] סגירת כלל המשימות החיצוניות (Play Console / Supabase Dashboard / GCP / Firebase).

---

## 4) P1 — Post-Launch (Planned)

- [ ] `feature/add-garden`: geocoding + moderation אמיתי.
- [ ] `feature/community-social`: שדרוג community + check-in.
- [ ] `feature/hazard-reporting`: form אמיתי + persistence.
- [ ] Notifications אמיתיות מעבר ל-placeholder.
- [ ] שיפור UX/error handling על בסיס פידבק משתמשים.

---

## 5) P2 — Backlog (Future)

- [ ] `feature/restaurant-ordering`.
- [ ] social feed מלא.
- [ ] hazard/admin dashboards.
- [ ] owner/restaurant portal מלא.
- [ ] advanced analytics / telemetry.

---

## 6) Cloud / DevOps Track (Open)

### 6.1 Platform Decisions
- [ ] בחירת Cloud Platform (AWS/GCP/Azure/DO).
- [ ] בחירת TLS strategy (Ingress+cert-manager או חלופה).
- [ ] בחירת Container Registry.
- [ ] בחירת Monitoring stack.
- [ ] בחירת Domain סופי.

### 6.2 Pre-Launch Cloud Gate
- [ ] לסגור את כל חסמי K8s הקריטיים (`app-deployment`, `network-policy`, probes, resources).
- [ ] לאמת health probes בפועל.
- [ ] לאמת Admin RLS policies ב-production.
- [ ] לוודא HTTPS certificate + HSTS.
- [ ] staging deployment עובר smoke tests.
- [ ] להריץ load baseline.
- [ ] להכין 24h monitoring + runbook + on-call.
- [ ] לאמת backup/restore של DB.

### 6.3 Cloud Deployment Checklist (status: TODO in source)
- [ ] Fix K8s manifest.
- [ ] Add health probes.
- [ ] Add resource limits.
- [ ] Fix NetworkPolicy.
- [ ] Create ENV contract.
- [x] Update `compose.yaml` — נוספה העברת דגלי build עבור `VITE_ENABLE_ADMIN_ROUTES` ו-`VITE_ENABLE_DOG_SHARE_ROUTE` לשני השירותים.
- [ ] Hardening (Nginx + TLS).
- [ ] Verify RLS policies.
- [ ] GitHub Actions workflow.
- [ ] Setup K8s cluster.
- [ ] Kustomize overlays.
- [ ] Staging deployment.
- [ ] Functional testing.
- [ ] Load testing.
- [ ] Monitoring setup.
- [ ] Runbook authoring.
- [ ] DNS & domain.
- [ ] GO LIVE.

---

## 7) Quick Execution Order (Recommended)

1. [x] לסגור Scope + הכרעות (`AddGarden`, `Notifications`, `AdminImport lock`).
2. [~] לסגור Core flows + QA matrix (web + Android sanity).
3. [ ] לסגור Release Gate (build/sync/release signing + security checks).
4. [ ] לסגור Store assets והגשות Play Console.
5. [ ] לסגור Security external confirmations (old keys/CI/vault/audit).
6. [ ] אם רלוונטי ליעד הנוכחי: לסגור Cloud blockers עד staging-ready.

---

## Sources Used
- `copilot/MVP_EXECUTION_CHECKLIST.md`
- `copilot/GO_NO_GO.md`
- `copilot/CO.md`
- `copilot/Person tasks.md`
- `SECURITY_RUNBOOK_SECRET_ROTATION.md`
- `SECURITY_RUNBOOK_API_KEY_ROTATION.md`
- `SECURITY_CVE_REMEDIATION.md`
- `copilot/הדרך לענן ול-MVP 9426/README_CLOUD_READY.md`
- `copilot/הדרך לענן ול-MVP 9426/CLOUD_DEPLOYMENT_CHECKLIST.md`

