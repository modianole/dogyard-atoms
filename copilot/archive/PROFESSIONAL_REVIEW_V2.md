# 🔍 DogYard — Professional Review V2

**Date**: April 5, 2026  
**Reviewer**: Automated Code Analysis  
**Version**: 2.0 — Objective, post-implementation review

---

## 1. PROJECT OVERVIEW

| Field | Value |
|-------|-------|
| **App Name** | דוג יארד — DogYard |
| **App ID** | `com.dogyard.app` |
| **Type** | Capacitor hybrid (React web → Android native shell) |
| **Frontend** | React 18 + TypeScript + TailwindCSS + shadcn/ui (Radix) |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime) |
| **Maps** | Google Maps via `@vis.gl/react-google-maps` |
| **Native** | Capacitor 6 (Geolocation, App, Browser plugins) |
| **Build** | Vite 5 + Gradle 8.7 |
| **Min SDK** | 24 (Android 7.0) |
| **Target SDK** | 35 (Android 15) |
| **Language** | Hebrew (primary) + English (toggle) |

### What is DogYard?
A social platform for dog owners in Israel. Core value: find nearby dog parks, check in with your dog, see who else is at the park, report hazards, and order food from nearby restaurants — all in one app.

---

## 2. ARCHITECTURE ANALYSIS

### 2.1 Tech Stack — ✅ Good Choices
- **React + Capacitor** is a proven hybrid approach, allows one codebase for web + Android.
- **Supabase** handles auth, database, and real-time subscriptions — solid choice for an MVP.
- **TanStack Query** for data fetching — proper caching and invalidation patterns in place.
- **shadcn/ui (Radix)** — accessible, composable UI components.
- **i18n** — custom `LanguageContext` with Hebrew/English translations (425-line translations file).

### 2.2 Database Schema — ✅ Well Structured
Supabase tables (from generated types):

| Table | Purpose | Status |
|-------|---------|--------|
| `gardens` | Dog parks with lat/lng, amenities, rating | ✅ Populated |
| `check_ins` | User check-ins at gardens (arrived/on_way) | ✅ Working |
| `dogs` | User's dogs (name, breed, gender, size) | ✅ Working |
| `profiles` | User profiles (display name, avatar, phone) | ✅ Working |
| `reviews` | Garden reviews/ratings | ✅ Schema exists |
| `hazard_reports` | Safety hazard reports at gardens | ✅ Schema exists |
| `restaurants` | Restaurants linked to gardens | ✅ Schema exists |
| `menu_items` | Restaurant menu items | ✅ Schema exists |
| `deals` | Restaurant deals/specials | ✅ Schema exists |
| `orders` | Food orders | ✅ Schema exists |
| `user_roles` | Role-based access (admin/restaurant_owner/user) | ✅ Schema exists |
| `peak_hours` | Crowd data per garden per hour | ✅ Schema exists |

**Views**: `active_garden_visitors` — filters active check-ins.  
**Functions**: `get_nearby_gardens(lat, lng, radius)` — proximity search.  
**Enums**: `app_role`, `dog_size`, `dog_gender`, `hazard_status`, `check_in_status`, `order_status`.

### 2.3 Page Routes — 15 Routes

| Route | Page | Core Feature | Status |
|-------|------|-------------|--------|
| `/` | Index | Hero + Top Gardens + Peak Hours | ✅ Working |
| `/map` | Map | Google Maps with garden markers | ✅ Working |
| `/garden/:id` | GardenDetails | Full garden view, check-in, visitors, amenities, hazards | ✅ Working |
| `/auth` | Auth | Email/password + Google OAuth login | ✅ Working |
| `/reset-password` | ResetPassword | Password reset flow | ✅ Working |
| `/profile` | Profile | User profile + dog management (CRUD) | ✅ Working |
| `/settings` | Settings | Edit display name, phone | ✅ Working |
| `/notifications` | Notifications | Placeholder — no real notifications | ⚠️ Placeholder only |
| `/privacy` | Privacy | Hebrew + English privacy policy | ✅ Working |
| `/terms` | Terms | Hebrew + English terms of service | ✅ Working |
| `/install` | Install | PWA install instructions | ✅ Working |
| `/download` | Download | App download page | ✅ Working |
| `/admin/import` | AdminImport | Admin garden import tool | ✅ Working |
| `/features` | FeaturesGrid | Features showcase | ✅ Working |
| `/add-garden` | AddGarden | User-submitted garden form | ✅ Working |

### 2.4 Key Hooks

| Hook | Purpose | Quality |
|------|---------|---------|
| `useAuth` | Session management, auto-refresh, stale session cleanup | ✅ Solid |
| `useGardens` | Fetch all gardens + nearby gardens (RPC) | ✅ Good |
| `useCheckIn` | Check-in/check-out mutations with optimistic invalidation | ✅ Good |
| `usePeakHours` | Fetch peak hours data for charts | ✅ Good |
| `useRestaurants` | Fetch restaurants with menu items and deals | ✅ Good |

---

## 3. CRITICAL ISSUES 🔴

### 3.1 `vite.config.ts` IS BROKEN — BUILD FAILS
**Severity**: 🔴 BLOCKER  
The file references `DEV_HOST` and `DEV_PORT` variables that are **never defined**. Additionally:
- `plugins: [react()]` was removed — no React plugin
- `resolve.alias` for `@/` imports was removed
- `hmr` block has duplicate `host` key

**Impact**: `npm run build` fails completely. `npm run dev` fails. **No web build possible.**

### 3.2 `network_security_config.xml` — INSECURE & MALFORMED
**Severity**: 🔴 HIGH  
- Base config allows **all cleartext traffic globally** (`cleartextTrafficPermitted="true"`)
- Trusts **user-installed certificates** — should be `system` only
- **Missing closing `</trust-anchors>` tag** — malformed XML
- Lists production domains (`supabase.co`, `googleapis.com`) in cleartext exceptions — these always use HTTPS

### 3.3 `AndroidManifest.xml` — `usesCleartextTraffic="true"`
**Severity**: 🟠 HIGH  
This attribute overrides network security config. Should be removed since `networkSecurityConfig` is already specified.

### 3.4 Uncommitted Git Changes
**Severity**: 🟠 HIGH  
25+ files modified/deleted but **not committed**. Risk of data loss.

### 3.5 `logo.png.png` — Incorrect Filename
**Severity**: 🟡 MEDIUM  
File `public/logo.png.png` has double extension. Code references `/logo.png` — **the logo won't load**.

---

## 4. SECURITY ASSESSMENT

### ✅ Good
- `.env` file is gitignored and contains all secrets
- Supabase keys loaded via `import.meta.env.VITE_*`
- Keystore + `google-services.json` gitignored
- Release signing via env vars / `local.properties`
- ProGuard rules configured for Capacitor, Firebase, Kotlin
- Build gracefully falls back to debug signing when no release creds

### ⚠️ Needs Attention
- **CSP in `index.html` too permissive**: `'unsafe-inline' 'unsafe-eval'` + `http:` origins
- **`usesCleartextTraffic="true"`** in AndroidManifest
- **Network security config allows all cleartext**
- **Supabase client logs** credential status to console in production
- **console.log** statements in Auth flow — should be removed for release

---

## 5. BUILD & DEPLOYMENT STATUS

### 5.1 Web Build
| Check | Status |
|-------|--------|
| `npm run build` | ❌ **FAILS** — `vite.config.ts` broken |
| `npm run dev` | ❌ **FAILS** — same issue |

### 5.2 Android Build
| Check | Status |
|-------|--------|
| `assembleDebug` | ✅ Passed previously (with old dist) |
| `assembleRelease` | ✅ Passed previously |
| `bundleRelease` (AAB) | ✅ Passed previously (17.9MB) |
| Firebase | ✅ `google-services.json` present, Crashlytics configured |
| ProGuard | ✅ Configured |
| App Icons | ✅ All densities (hdpi → xxxhdpi) + adaptive |
| Splash Screen | ✅ All orientations and densities |

---

## 6. UX/UI ASSESSMENT

### ✅ Strengths
- RTL-first design, Hebrew default
- Dark theme with toggle
- Mobile-first with bottom nav
- Video hero section (3 rotating videos)
- Beautiful garden detail page with amenities, check-in, visitors
- Smart check-in UX — short press = arrived, long press = on my way

### ⚠️ Weaknesses
- Notifications page is a placeholder
- HazardReport is UI only — no submission logic
- No image upload for dogs/gardens
- Map uses hardcoded `MAP_ID = "YOUR_MAP_ID"`
- No loading skeletons
- Footer only visible on desktop

---

## 7. FEATURE COMPLETENESS FOR MVP

| Feature | Status |
|---------|--------|
| 🗺️ Garden map with markers | ✅ Done |
| 📍 Nearby gardens (GPS) | ✅ Done |
| 🐕 Dog management (CRUD) | ✅ Done |
| 🔐 Auth (Email + Google OAuth) | ✅ Done |
| ✅ Check-in / Check-out | ✅ Done |
| 👥 See who's at garden | ✅ Done |
| ⚠️ Hazard reporting | 🔴 UI only |
| 🔔 Push notifications | 🔴 Not implemented |
| 🍔 Food ordering | 🔴 Not implemented |
| ⭐ Garden reviews | 🔴 Not implemented |
| 📸 Image upload | 🔴 Not implemented |
| 📱 Privacy Policy | ✅ Done |
| 📱 Terms of Service | ✅ Done |
| 🌐 i18n (Hebrew + English) | ✅ Done |
| 🎨 App icon + Splash | ✅ Done |
| 🔥 Firebase Crashlytics | ✅ Done |

---

## 8. WHAT'S LEFT FOR MVP LAUNCH 🚀

### 🔴 MUST FIX (Blockers) — ~1 hour total

| # | Task | Effort |
|---|------|--------|
| 1 | **Fix `vite.config.ts`** — restore plugins, alias, server config | 15 min |
| 2 | **Fix `network_security_config.xml`** — `cleartextTrafficPermitted="false"`, fix XML | 10 min |
| 3 | **Remove `usesCleartextTraffic="true"`** from AndroidManifest | 2 min |
| 4 | **Rename `logo.png.png` → `logo.png`** | 2 min |
| 5 | **Remove `console.log` debug statements** from Supabase client + Auth | 10 min |
| 6 | **Commit all changes to git** | 5 min |
| 7 | **Rebuild**: `npm run build && npx cap sync android` | 5 min |
| 8 | **Rebuild release**: `./gradlew bundleRelease` | 3 min |

### 🟠 SHOULD FIX (Recommended)

| # | Task | Effort |
|---|------|--------|
| 9 | Set real Google Maps `MAP_ID` | 5 min |
| 10 | Tighten CSP — remove `unsafe-eval` | 15 min |
| 11 | Wire HazardReport to Supabase | 1-2 hrs |
| 12 | Fix duplicate Navbar in Profile/Settings/Notifications pages | 30 min |

### 🟡 POST-LAUNCH

| # | Feature | Effort |
|---|---------|--------|
| 13 | Push notifications (FCM) | 4-6 hrs |
| 14 | Garden reviews UI | 3-4 hrs |
| 15 | Image upload (Supabase Storage) | 3-4 hrs |
| 16 | Food ordering flow | 6-8 hrs |
| 17 | Play Store listing assets | 2-3 hrs |

---

## 9. SUMMARY

**The Good**: DogYard has a solid foundation — comprehensive database schema, clean React/Capacitor architecture, working auth with Google OAuth on mobile, smart check-in system, and proper i18n.

**The Bad**: `vite.config.ts` is broken (build fails), network security configuration is insecure and malformed, and 25+ files are uncommitted.

**The Path**: **8 small tasks (~1 hour)** separate the app from a deployable MVP. After those, the app has: map, gardens, check-in, auth, profiles, dogs, legal pages, and crashlytics. Missing features (notifications, reviews, food ordering) can come post-launch.

---

*Review V2 — April 5, 2026*

