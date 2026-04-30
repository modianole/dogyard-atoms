# DogYard - Technical Reference Guide

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            🌐 CLIENT LAYER (Web/Mobile)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  Browser / Capacitor WebView                                                │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ React 18 + TypeScript + Vite                                         │  │
│  │  App.tsx                                                             │  │
│  │   ├─ Router (React Router v6)                                       │  │
│  │   ├─ Layout (Header + BottomNav)                                    │  │
│  │   ├─ Theme Provider (Tailwind + Next-Themes)                        │  │
│  │   ├─ Language Provider (Hebrew/English RTL)                         │  │
│  │   ├─ React Query Provider (@tanstack/react-query v5)                │  │
│  │   └─ Protected Routes (ProtectedRoute HOC)                          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Routes:                                                                    │
│  ├─ Public:     / (home), /map, /auth, /privacy, /terms, /download        │
│  ├─ Protected:  /profile, /settings, /garden/:id, /auth/callback          │
│  ├─ Admin:      /admin/import, /admin/gardens (feature-flagged)           │
│  └─ Fallback:   /404 (NotFound page)                                      │
└─────────────────────────────────────────────────────────────────────────────┘
                            ↓↓↓ API & State Management ↓↓↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                         🎣 STATE & HOOKS LAYER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Custom Hooks:                                                              │
│  ├─ useAuth()           → Supabase session + mobile deep-link handling     │
│  ├─ useGardens()        → Garden CRUD + spatial queries                    │
│  ├─ useCheckIn()        → Check-in mutations                               │
│  ├─ useRestaurants()    → Menu & order data                                │
│  ├─ usePeakHours()      → Aggregated visit analytics                       │
│  ├─ useDeveloperAccess()→ Admin gating logic                               │
│  ├─ useLanguage()       → i18n context                                     │
│  └─ use-*               → Misc (mobile viewport, toast, etc.)              │
│                                                                              │
│  React Query Patterns:                                                      │
│  ├─ useQuery()          → Fetch gardens, users, check-ins                  │
│  ├─ useMutation()       → Create/update/delete operations                  │
│  └─ Automatic caching & background refetch                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                            ↓↓↓ Backend API Layer ↓↓↓
┌─────────────────────────────────────────────────────────────────────────────┐
│              🛡️ SUPABASE (Auth, Database, RLS Policies)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Authentication:                                                            │
│  ├─ PKCE Flow (magic link, OAuth)                                          │
│  ├─ Session stored in localStorage                                         │
│  └─ Deep-link handling: appUrlOpen → setSession()                          │
│                                                                              │
│  Database Tables (Postgres):                                                │
│  ├─ auth.users           (Supabase managed)                                │
│  │                                                                           │
│  ├─ gardens              → Dog parks (mapped from Google Places)            │
│  │   ├─ id, name, name_en, location, location_en                           │
│  │   ├─ lat, lng, google_place_id (UNIQUE INDEX)                          │
│  │   ├─ rating, reviews_count, capacity                                    │
│  │   ├─ status ('pending' | 'approved')                                    │
│  │   └─ created_at, updated_at, image_url                                  │
│  │                                                                           │
│  ├─ protected_spaces     → Emergency shelters (ממ"דים) — NEW                │
│  │   ├─ id, name, name_en, location, location_en                           │
│  │   ├─ lat, lng, google_place_id (UNIQUE INDEX)                          │
│  │   ├─ type, capacity, is_accessible                                      │
│  │   └─ contact_phone, contact_email                                       │
│  │                                                                           │
│  ├─ user_profiles        → User details & preferences                      │
│  │   ├─ user_id (FK → auth.users)                                         │
│  │   └─ bio, avatar, preferences                                           │
│  │                                                                           │
│  ├─ dogs                 → User's dogs                                      │
│  │   ├─ user_id, name, breed, age                                         │
│  │   └─ image_url, health_notes                                           │
│  │                                                                           │
│  ├─ check_ins            → Visit tracking                                  │
│  │   ├─ user_id, garden_id, timestamp                                     │
│  │   ├─ duration, notes                                                    │
│  │   └─ Spatial index on (lat, lng)                                       │
│  │                                                                           │
│  ├─ hazard_reports       → Community reports                               │
│  │   ├─ user_id, garden_id, report_type                                   │
│  │   └─ description, severity                                             │
│  │                                                                           │
│  └─ [others]             → restaurants, dog_shares, etc.                   │
│                                                                              │
│  Row-Level Security (RLS):                                                  │
│  ├─ Public tables (SELECT)   → Available to all users                      │
│  ├─ Insert                   → Authenticated users only                    │
│  ├─ Update/Delete (admin ops)→ require has_role(auth.uid(), 'admin')       │
│  └─ Private data (email, etc)→ Owner-based or restricted                   │
│                                                                              │
│  Storage:                                                                   │
│  └─ Bucket: images → Avatar, garden photos, etc.                           │
└─────────────────────────────────────────────────────────────────────────────┘
                            ↓↓↓ External Integrations ↓↓↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                     🧩 EXTERNAL SERVICES                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Google Maps API                                                            │
│  ├─ Maps visualization (interactive map component)                         │
│  ├─ Geolocation (find nearest gardens)                                     │
│  └─ Places API (garden details, reviews, ratings)                          │
│                                                                              │
│  Google Places (Admin Import)                                               │
│  ├─ Terminal 1: Dog gardens search (Gush Dan region)                       │
│  │   └─ Queries: "גינת כלבים", "dog park", etc.                           │
│  ├─ Terminal 2: Protected spaces (ממ"דים)                                   │
│  │   └─ Queries: "ממ"ד", "מקלט", "bomb shelter"                            │
│  └─ Upsert by google_place_id (prevents duplicates)                        │
│                                                                              │
│  Firebase (Android Only)                                                    │
│  ├─ Crashlytics (auto crash reporting)                                     │
│  └─ Analytics (usage tracking)                                             │
│                                                                              │
│  Capacitor Plugins                                                          │
│  ├─ Geolocation (device GPS)                                               │
│  ├─ Browser (open external links)                                          │
│  ├─ App (deep-link handling, back button)                                  │
│  └─ SplashScreen (branded loading screen)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                            ↓↓↓ Mobile Build Layer ↓↓↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                    📱 ANDROID (Gradle + Capacitor)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Build Chain:                                                               │
│  Vite (React build) → dist/ → Capacitor sync → android/app/src/main/assets│
│                                                                              │
│  Gradle Configuration:                                                      │
│  ├─ minSdk: 24 (Android 7.0+)                                             │
│  ├─ targetSdk: 35 (Android 15)                                             │
│  ├─ Release signing: keystorePath + password                               │
│  └─ ProGuard/R8: Code obfuscation & optimization                          │
│                                                                              │
│  Plugins:                                                                   │
│  ├─ Firebase Gradle plugin (analytics, crashlytics)                        │
│  ├─ AGP (Android Gradle Plugin)                                            │
│  └─ Custom Capacitor bridge                                                │
│                                                                              │
│  Dev Server Bridging:                                                       │
│  └─ CAPACITOR_ANDROID_SERVER_URL env var                                   │
│     ├─ http://192.168.x.x:8080 (dev)                                      │
│     └─ dist/ assets (production)                                           │
│                                                                              │
│  Signing (Release):                                                         │
│  ├─ Keystore path + password                                               │
│  ├─ Key alias + password                                                   │
│  └─ Output: APK or AAB for Play Store                                      │
│                                                                              │
│  Firebase Integration:                                                      │
│  └─ google-services.json (app/src/)                                        │
│     ├─ Project ID, API key                                                 │
│     └─ Firebase console configuration                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App.tsx (Root)
├─ BrowserRouter
│  └─ Layout
│     ├─ Header
│     │  ├─ Menu Button
│     │  ├─ BrandLogo + Title
│     │  └─ Auth / Language Toggle
│     │
│     ├─ GlassSidebar (Drawer)
│     │  ├─ NavLink (home)
│     │  ├─ NavLink (map)
│     │  ├─ NavLink (profile)
│     │  ├─ NavLink (settings)
│     │  └─ [Admin links if VITE_ENABLE_ADMIN_ROUTES]
│     │
│     ├─ Routes
│     │  ├─ Index (/)
│     │  ├─ Map (/map) [Core UX]
│     │  │  ├─ Google Map
│     │  │  ├─ Marker clusters
│     │  │  ├─ Info windows
│     │  │  └─ Geolocation button
│     │  │
│     │  ├─ GardenDetails (/garden/:id)
│     │  │  ├─ Garden info card
│     │  │  ├─ Peak hours chart
│     │  │  ├─ Check-in button
│     │  │  ├─ Hazard reports
│     │  │  └─ Restaurant menu
│     │  │
│     │  ├─ Auth (/auth)
│     │  │  └─ Login / Sign-up form
│     │  │
│     │  ├─ Profile (/profile)
│     │  │  ├─ User avatar
│     │  │  ├─ Dog profiles
│     │  │  └─ Check-in history
│     │  │
│     │  ├─ Settings (/settings)
│     │  │  ├─ Language toggle
│     │  │  ├─ Preferences
│     │  │  └─ Logout button
│     │  │
│     │  ├─ AdminImport (/admin/import) [Feature-flagged]
│     │  │  ├─ Terminal 1: Dog Gardens
│     │  │  │  ├─ Region selector
│     │  │  │  ├─ Start scan button
│     │  │  │  └─ Results / status
│     │  │  │
│     │  │  └─ Terminal 2: Protected Spaces
│     │  │     ├─ Region selector
│     │  │     ├─ Start scan button
│     │  │     └─ Results / status
│     │  │
│     │  ├─ AdminGardens (/admin/gardens) [Feature-flagged]
│     │  │  ├─ Filter (pending only)
│     │  │  ├─ Garden list
│     │  │  └─ Approve/Reject buttons
│     │  │
│     │  ├─ DogShareAccept (/dog-share/accept) [Feature-flagged]
│     │  ├─ AuthCallback (/auth/callback)
│     │  ├─ Privacy (/privacy)
│     │  ├─ Terms (/terms)
│     │  └─ NotFound (404)
│     │
│     └─ BottomNav
│        ├─ NavLink (home icon)
│        ├─ NavLink (map icon)
│        ├─ NavLink (profile icon)
│        └─ NavLink (settings icon)
│
├─ TooltipProvider (Radix UI)
├─ ThemeProvider (Next-Themes)
├─ LanguageProvider (Custom)
├─ QueryClientProvider (React Query)
├─ Sonner (Toast notifications)
└─ ToastProvider (Shadcn toast)
```

---

## Data Flow Diagram

### User Discovers a Garden

```
User opens /map
   ↓
useGardens() hook queries Supabase
   ├─ Fetch all gardens with spatial index
   ├─ Filter by user geolocation (if permitted)
   └─ React Query caches result
   ↓
Map component renders markers
   ├─ Google Maps API draws map
   ├─ Marker clusters for density
   └─ Click marker → show info window
   ↓
User clicks on garden marker
   ↓
Navigate to /garden/:id
   ↓
GardenDetails page loads
   ├─ useGardens() fetches single garden details
   ├─ usePeakHours() fetches check-in analytics
   ├─ useRestaurants() fetches menu (if available)
   └─ Display garden info, chart, menu
   ↓
User clicks "Check In"
   ↓
useCheckIn() mutation fires
   ├─ INSERT into check_ins table
   ├─ Supabase RLS: auth.uid() IS NOT NULL
   └─ On success: toast notification + local UI update
   ↓
Check-in appears in user profile & analytics
```

### Admin Imports Gardens

```
Admin navigates to /admin/import
   ├─ useDeveloperAccess() checks: VITE_ADMIN_USER_ID or VITE_ADMIN_EMAIL
   ├─ Also checks Supabase RLS: has_role(auth.uid(), 'admin')
   └─ If denied → redirect to home
   ↓
Admin selects "Dog Gardens" terminal
   ↓
User selects region (Gush Dan)
   ↓
Click "Scan Google Places"
   ↓
Frontend calls Google Places API
   ├─ Query: "גינת כלבים" in Tel Aviv
   ├─ Query: "dog park" in Ramat Gan
   ├─ etc. (all Gush Dan cities)
   └─ Collect results with google_place_id
   ↓
For each result:
   ├─ Extract name (HE + EN if available)
   ├─ Extract location (HE + EN)
   ├─ Extract lat, lng
   └─ Collect in array
   ↓
Admin reviews results in UI (before save)
   ↓
Admin clicks "Import All"
   ↓
Frontend calls Supabase upsert:
   supabase.from('gardens').upsert(
     results,
     { onConflict: 'google_place_id' }
   )
   ├─ Duplicate google_place_id? → Update existing row
   ├─ New place? → Insert row
   ├─ RLS policy: has_role(auth.uid(), 'admin')
   └─ Status defaults to 'pending'
   ↓
Admin sees import summary
   └─ "Imported 15 new gardens, updated 3 existing"
```

### Admin Approves a Garden

```
Admin navigates to /admin/gardens
   ↓
Page queries pending gardens:
   SELECT * FROM gardens WHERE status = 'pending'
   ↓
List displays with garden info + action buttons
   ↓
Admin clicks "Approve" on a garden
   ↓
useMutation() fires UPDATE:
   UPDATE gardens
   SET status = 'approved'
   WHERE id = ?
   ├─ RLS policy: has_role(auth.uid(), 'admin')
   └─ On success: remove from list
   ↓
Garden now visible in /map for all users
```

---

## Key Hook Patterns

### useAuth()
```typescript
const { user, isLoading, error } = useAuth();

// user: Supabase User object or null
// isLoading: Initial session check in progress
// error: Auth error if any
```

### useGardens()
```typescript
const { 
  gardens, 
  loading, 
  error,
  // Methods:
  formatGardenName,
  nearbyGardens,
  // Mutations:
  addGarden,
  updateGarden,
  deleteGarden
} = useGardens();

// gardens: Array of garden objects
// nearbyGardens(lat, lng, radius): Find gardens near coordinates
// formatGardenName(garden): Normalize display name
```

### useCheckIn()
```typescript
const { 
  mutate: checkIn, 
  isPending, 
  error 
} = useCheckIn();

// checkIn({ gardenId }): Triggers INSERT
// isPending: Mutation in progress
// error: Check-in error if any
```

### useLanguage()
```typescript
const { 
  language,           // 'he' | 'en'
  t,                  // translations.he or translations.en
  toggleLanguage,     // () => void
  isRTL               // boolean
} = useLanguage();

// Usage in JSX:
<h1>{t.appName}</h1>        // Translates to "דוג יארד"
<div dir={isRTL ? 'rtl' : 'ltr'}>...</div>
```

---

## Supabase RLS Policy Examples

### Allow everyone to view gardens
```sql
CREATE POLICY "Gardens are viewable by everyone"
ON public.gardens
FOR SELECT
USING (true);
```

### Only authenticated users can insert
```sql
CREATE POLICY "Anyone can submit gardens"
ON public.gardens
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
```

### Only admins can approve
```sql
CREATE POLICY "Only admins can approve gardens"
ON public.gardens
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));
```

---

## Environment Variables & Feature Flags

| Var | Type | Purpose | Example |
|-----|------|---------|---------|
| `VITE_SUPABASE_URL` | String (Required) | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | String (Required) | Supabase anon key | `eyJ...` |
| `VITE_GOOGLE_MAPS_API_KEY` | String (Required) | Google Maps API key | `AIza...` |
| `VITE_DEV_HOST` | String (Optional) | Dev server host | `192.168.1.10` |
| `VITE_DEV_PORT` | String (Optional) | Dev server port | `8080` |
| `CAPACITOR_ANDROID_SERVER_URL` | String (Optional) | Android dev bridge | `http://192.168.1.10:8080` |
| `VITE_ENABLE_ADMIN_ROUTES` | Boolean (Optional) | Enable `/admin/*` routes | `true` or `false` |
| `VITE_ENABLE_DOG_SHARE_ROUTE` | Boolean (Optional) | Enable `/dog-share/accept` | `true` or `false` |
| `VITE_ADMIN_USER_ID` | String (Optional) | Admin user ID allowlist | UUID |
| `VITE_ADMIN_EMAIL` | String (Optional) | Admin email allowlist | `admin@example.com` |
| `VITE_DOCKER_URL` | String (Optional) | Docker container URL | `http://localhost:8000` |
| `VITE_CLOUD_URL` | String (Optional) | Cloud deployment URL | `https://cloud.example.com` |
| `DOGYARD_KEYSTORE_PATH` | String (Optional) | Android keystore path | `/path/to/dogyard.keystore` |
| `DOGYARD_KEYSTORE_PASSWORD` | String (Optional) | Keystore password | `*****` |
| `DOGYARD_KEY_ALIAS` | String (Optional) | Key alias | `dogyard` |
| `DOGYARD_KEY_PASSWORD` | String (Optional) | Key password | `*****` |

---

## Build Artifacts & Output

```
dist/                           (Web build output from Vite)
├─ index.html
├─ assets/
│  ├─ main.*.js               (React app bundle)
│  ├─ chunk.*.js              (Code-split chunks)
│  └─ main.*.css              (Tailwind styles)
└─ [static assets copied from public/]

android/app/build/outputs/     (Android build output from Gradle)
├─ apk/release/
│  └─ app-release.apk         (Debug-compatible APK)
└─ bundle/release/
   └─ app-release.aab         (Play Store Bundle)
```

---

## Performance Characteristics

### Web
- **First Load**: ~2-3s (depending on network)
- **Map Render**: <500ms (with clustering)
- **Garden Query**: <300ms (with Supabase indexing)
- **Check-in**: <500ms (with React Query caching)

### Android
- **Dev Mode** (via CAPACITOR_ANDROID_SERVER_URL):
  - Hot reload supported (requires server restart)
  - Network requests go to dev server
- **Release Mode**:
  - Bundled assets, fast cold start
  - All network requests through normal proxy

---

## Debugging Tips

### Check Supabase Logs
```sql
-- View recent auth events
SELECT * FROM auth.audit_log_entries 
ORDER BY created_at DESC 
LIMIT 20;

-- Check RLS policy violations
SELECT * FROM postgres_logs 
WHERE message LIKE '%permission denied%' 
LIMIT 10;
```

### Console Debugging (Browser Dev Tools)
```javascript
// Check Supabase client
console.log(supabase);

// Check auth session
supabase.auth.getSession().then(({ data, error }) => {
  console.log(data.session);
});

// Check Redux Query cache
window.__REACT_QUERY_DEVTOOLS__ // (if enabled)
```

### Android Debugging
```bash
# View device logs
adb logcat | grep -i "dogyard\|capacitor\|firebase"

# Install debug APK to device
npx cap run android --target=...

# Open Android Studio debugger
npx cap open android
```

---

## Common Tasks & Commands

### Update Database Schema
```bash
# Create new migration
touch supabase/migrations/$(date +%s)_description.sql

# Write SQL migration
# Deploy to local Supabase
supabase migration up

# Deploy to production (via CI/CD)
# OR manually via Supabase dashboard
```

### Add New Page
1. Create `src/pages/NewPage.tsx`
2. Register in `src/App.tsx`:
   ```tsx
   import NewPage from "./pages/NewPage.tsx";
   
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Add translation key in `src/i18n/translations.ts`
4. Add nav link in `GlassSidebar.tsx` or `BottomNav.tsx`

### Update Translations
1. Edit `src/i18n/translations.ts`
2. Add key under `translations.he` and `translations.en`
3. Use in JSX: `<p>{t.myKey}</p>`

### Run Tests
```bash
npm test                    # Single run
npm run test:watch         # Watch mode
npm test -- --ui           # UI mode
npm test -- --coverage     # With coverage report
```

### Build & Deploy
```bash
# Web
npm run build
# Outputs to dist/

# Android Debug
npm run play                # Full sync + run on connected device

# Android Release
npm run build
npx cap sync android
cd android
./gradlew bundleRelease
# Outputs AAB to: android/app/build/outputs/bundle/release/app-release.aab
# Upload to Google Play Console
```

---

## Security Checklist

- [ ] `.env` file added to `.gitignore` (never commit secrets)
- [ ] Keystore file protected (not in Git)
- [ ] Firebase `google-services.json` managed via CI/CD secrets (not in Git)
- [ ] Admin access gated by `VITE_ADMIN_USER_ID` or `VITE_ADMIN_EMAIL`
- [ ] RLS policies enabled on all public tables
- [ ] No hardcoded API keys in source code
- [ ] Supabase auth uses PKCE flow (enabled)
- [ ] Session stored securely in `localStorage` (suitable for web; for higher security, use httpOnly cookies via backend)

---

**Last Updated**: April 22, 2026  
**Project Version**: 0.0.0  
**Status**: MVP Active Development  


