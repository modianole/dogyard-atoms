# 🐾 DogYard - Project Analysis & Overview

**Last Updated**: April 22, 2026  
**Status**: MVP Active Development  
**Version**: 0.0.0  

---

## 📊 Project Summary

**DogYard** is a bilingual (Hebrew/English, RTL-enabled) mobile-first social app for dog owners in Israel. It helps users discover dog parks (gardens), report hazards, and order food delivery directly to park locations. The app is built with a modern React + TypeScript frontend wrapped in Capacitor for Android, backed by Supabase for auth and data.

### Key Statistics
- **Total TS/TSX Files**: 122
- **Core Tech Stack**: React 18 + TypeScript + Vite + Capacitor 6
- **Backend**: Supabase (Auth, Postgres + RLS)
- **Mobile**: Android via Capacitor (Gradle-based)
- **Database Migrations**: 9 active migrations
- **UI Components**: shadcn-based + custom glass-morphism design

---

## 🏗️ Architecture Overview

### Frontend Structure (`src/`)

```
src/
├── App.tsx                 # Main router, layout, protected routes, feature-gated admin flows
├── main.tsx               # React entry point + CSS setup
├── vite-env.d.ts         # Vite type definitions
├── index.css / App.css   # Global & app styling
│
├── pages/                 # 17 page components
│   ├── Index.tsx          # Landing/home page
│   ├── Map.tsx            # Interactive garden map (core UX)
│   ├── Profile.tsx        # User profile
│   ├── Settings.tsx       # User settings + language toggle
│   ├── Auth.tsx           # Login/signup
│   ├── AuthCallback.tsx   # OAuth callback handler
│   ├── ResetPassword.tsx  # Password reset flow
│   ├── GardenDetails.tsx  # Single garden detail view
│   ├── AdminImport.tsx    # Admin: Google Places bulk import (gardens + protected_spaces)
│   ├── AdminGardens.tsx   # Admin: garden approval moderation
│   ├── DogShareAccept.tsx # Feature-flagged dog sharing acceptance
│   ├── Privacy.tsx        # Legal page
│   ├── Terms.tsx          # Legal page
│   ├── Notifications.tsx  # Placeholder (removed from MVP)
│   ├── Download.tsx       # App download page
│   ├── Install.tsx        # Install instructions
│   └── NotFound.tsx       # 404 fallback
│
├── components/            # Reusable UI & layout
│   ├── ui/               # shadcn-based components (buttons, dialogs, cards, etc.)
│   ├── layout/           # BottomNav, navigation structure
│   ├── legacy-ui/        # Deprecated components
│   ├── ProtectedRoute.tsx # Auth guard HOC
│   ├── GlassSidebar.tsx  # Drawer sidebar
│   ├── BrandLogo.tsx
│   ├── GlassCard.tsx     # Glass-morphism container
│   ├── LoadingScreen.tsx # Splash screen
│   ├── HeroSection.tsx   # Landing hero
│   ├── NearbyGardenMap.tsx
│   ├── PeakHoursChart.tsx
│   ├── RestaurantMenu.tsx
│   ├── HazardReport.tsx
│   ├── AddGarden.tsx
│   ├── CheckInToggle.tsx
│   ├── CommunitySection.tsx
│   └── theme-provider.tsx # Dark/light mode provider
│
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts        # Auth state & Capacitor integration
│   ├── useGardens.ts     # Garden queries + formatGardenName()
│   ├── useCheckIn.ts     # Check-in logic
│   ├── useRestaurants.ts
│   ├── usePeakHours.ts
│   ├── useNearestShalter.ts
│   ├── useDeveloperAccess.ts  # Admin gating logic
│   └── use-toast.ts / use-mobile.tsx
│
├── context/
│   └── LanguageContext.tsx  # Bilingual + RTL state management
│
├── integrations/
│   ├── supabase/
│   │   ├── client.ts     # Supabase initialization
│   │   └── types.ts      # Auto-generated DB types (from migrations)
│   └── lovable/          # Legacy integration
│
├── i18n/
│   └── translations.ts   # Hebrew/English translation strings
│
├── lib/
│   └── utils.ts         # Utility functions (cn/clsx, etc.)
│
├── data/                # Static data
│
├── plugins/             # Capacitor plugins config
│
├── types/
│   └── restaurant.ts    # Domain types
│
└── test/
    └── setup.ts         # Vitest/jsdom configuration
```

### Backend Structure (`supabase/`)

```
supabase/
├── config.toml          # Supabase local config
├── seed.sql             # Database seed data
├── migrations/          # 9 migration files (chronologically ordered)
│   ├── 20260315175015_255e41cc-*.sql    # Initial schema
│   ├── 20260316000000_performance_and_spatial.sql
│   ├── 20260316100000_check_in_logic.sql
│   ├── 20260318234137_d4a06778-*.sql
│   ├── 20260319000000_create_dogs_table.sql
│   ├── 20260408021000_dog_profile_sharing_mvp.sql
│   ├── 20260408100000_create_protected_spaces.sql  (NEW)
│   ├── 20260408100100_add_gardens_indexes_and_status.sql
│   └── 20260408102000_add_google_place_ids.sql
└── .temp/               # Temp state
```

### Android Structure (`android/`)

```
android/
├── app/                 # Main app module
│   ├── build.gradle     # App-level Gradle (signing, Firebase, proguard)
│   ├── google-services.json  # Firebase wiring
│   └── src/
├── build.gradle         # Root Gradle
├── gradle/              # Gradle wrapper
├── capacitor.settings.gradle
├── local.properties     # Local build config (ignored by Git)
└── play.bat             # Shortcut to run on connected device
```

---

## 🔑 Key Architectural Patterns

### 1. **Routing & Feature Flags** (`src/App.tsx`)
- Flat route structure defined in main `App.tsx` using React Router v6
- **Feature-gated routes**:
  - `VITE_ENABLE_ADMIN_ROUTES`: Gates `/admin/import` and `/admin/gardens`
  - `VITE_ENABLE_DOG_SHARE_ROUTE`: Gates `/dog-share/accept`
- Auth routes validated via `ProtectedRoute` HOC + `useDeveloperAccess` hook
- Deep-link handling for mobile via Capacitor `appUrlOpen` + Supabase `setSession`

### 2. **Bilingual & RTL** (`src/context/LanguageContext.tsx`)
- Default language: **Hebrew** (RTL)
- Centralized `LanguageContext` with `useLanguage()` hook
- Persisted in `localStorage` as `"dogyard-language"`
- All UI labels stored in `src/i18n/translations.ts`
- Document direction managed dynamically: `document.documentElement.dir`

### 3. **Authentication & Admin Access**
- **Supabase PKCE flow** with `localStorage` session persistence
- **Admin gating** (`useDeveloperAccess.ts`):
  - Deny-by-default unless `VITE_ADMIN_USER_ID` or `VITE_ADMIN_EMAIL` env vars match current user
  - Also controlled by Supabase RLS policies (role-based `has_role('admin')`)

### 4. **Data Access Layer**
- **Direct UI-to-Supabase** integration (no traditional backend API)
- React Query (`@tanstack/react-query`) for caching & mutation management
- `useGardens.ts`: Primary hook for garden CRUD + location queries
- `formatGardenName()`: Normalizes garden names for display

### 5. **Garden Moderation Flow**
- **Status field** in `gardens` table:
  - Default: `pending` (user-submitted or auto-imported)
  - Admin updates to: `approved` (visible in app)
- `/admin/gardens` page reads & filters pending gardens
- Update via Supabase RLS policy checking `has_role('admin')`

### 6. **Google Places Import** (`AdminImport.tsx`)
- **Two terminals** in the import UI:
  1. **Dog Gardens** → scans Gush Dan (Tel Aviv, Ramat Gan, etc.)
     - Queries: "גינת כלבים", "מתחם כלבים", "dog park", "dog garden"
     - Saves: `gardens` table
  2. **Protected Spaces** (מ"מ"ד) → scans select cities
     - Queries: "ממ"ד", "מרחב מוגן", "מקלט", "public shelter", "bomb shelter"
     - Saves: `protected_spaces` table
- **Idempotent upsert** by `google_place_id` (unique index)
- Fields preserved: `name`, `name_en`, `location`, `location_en`, `google_place_id`

### 7. **Mobile Wrapping** (Capacitor + Gradle)
- **Vite builds** to `dist/`; Capacitor copies to `android/app/src/main/assets/www/`
- **Dev server bridging**: `CAPACITOR_ANDROID_SERVER_URL` env var
- **Release signing**: Keys from env (`DOGYARD_KEYSTORE_*`) or `android/local.properties`
- **Firebase integration**: Crashlytics + Analytics via `google-services.json`

### 8. **UI Design System**
- **Glass-morphism theme**: Semi-transparent cards with blur backdrop
- **Tailwind CSS v3** with custom color tokens (via CSS variables)
- **Custom fonts**: Syne (display) + DM Sans (body) + Heebo (fallback)
- **shadcn-based components**: Buttons, dialogs, forms, etc.
- **Responsive**: Mobile-first, tablet & desktop support

---

## 📱 Database Schema (Key Tables)

### `gardens`
```sql
- id (UUID, PK)
- name, name_en (text)
- location, location_en (text)
- lat, lng (DOUBLE PRECISION)
- google_place_id (TEXT, UNIQUE INDEX)  ← NEW: prevents duplicates on re-import
- rating, reviews_count
- capacity
- image_url
- status (DEFAULT 'pending')  ← NEW: 'pending' | 'approved'
- created_at, updated_at
```

### `protected_spaces` (NEW)
```sql
- id (UUID, PK)
- name, name_en
- location, location_en
- lat, lng
- google_place_id (TEXT, UNIQUE INDEX)
- type (VARCHAR 50, e.g., 'ממ"ד', 'מקלט')
- capacity, is_accessible
- contact_phone, contact_email
- created_at, updated_at
```

### Row-Level Security (RLS)
- **Public tables** (`gardens`, `protected_spaces`): `SELECT` for all
- **Insert**: Authenticated users only
- **Update/Delete**: `admin` role only
- **Check-ins** & **user profiles**: Owner-based privacy

---

## 🚀 Development Workflows

### Local Setup
```bash
# Install dependencies (with legacy peer deps flag)
npm install --legacy-peer-deps

# Start dev server (Vite)
npm run dev
# Outputs: http://localhost:8080 (or custom VITE_DEV_HOST/PORT)

# Run tests
npm test                 # Single run (Vitest + jsdom)
npm run test:watch      # Watch mode

# QA: Validate route matrix
npm run qa:routes       # Checks src/App.tsx against scripts/qa-launch-routes.matrix.json

# Build for production
npm run build           # Creates dist/
```

### Android Development
```bash
# Debug sync & run
npx cap sync android    # Copies dist/ to Android assets
npx cap open android    # Opens Android Studio

# Quick play on connected device
npm run play            # Alias for: npx cap sync android && npx cap run android

# Release build
npm run build
npx cap sync android
cd android
./gradlew assembleRelease  # APK at: android/app/build/outputs/apk/release/
./gradlew bundleRelease    # AAB at: android/app/build/outputs/bundle/release/

# Verify Firebase config
npm run verify:android:firebase
```

### Environment Variables (`.env`)
```env
# Required
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=xxxxx
VITE_GOOGLE_MAPS_API_KEY=xxxxx

# Optional: Dev server
VITE_DEV_HOST=127.0.0.1
VITE_DEV_PORT=8080
CAPACITOR_ANDROID_SERVER_URL=http://192.168.1.10:8080

# Feature flags (default: false)
VITE_ENABLE_ADMIN_ROUTES=false
VITE_ENABLE_DOG_SHARE_ROUTE=false

# Admin gating (deny-by-default)
VITE_ADMIN_USER_ID=xxxxx
VITE_ADMIN_EMAIL=admin@example.com
```

---

## ✨ Notable Features

### Core Features
1. **Interactive Map** (`Map.tsx`): Google Maps integration with garden markers + clustering
2. **Garden Discovery**: List view + detail view with reviews, check-ins, peak hours
3. **User Authentication**: Supabase magic link + social login (via custom auth handler)
4. **Check-in System**: Track when users visit gardens
5. **User Profile**: Manage dog(s), preferences, privacy settings
6. **Bilingual UX**: Full Hebrew/English with RTL support

### Admin Features
1. **Google Places Import**: Bulk-scan & import gardens + protected spaces
2. **Moderation Dashboard**: Approve pending user-submitted gardens
3. **Protected Spaces**: New table for bomb shelters, emergency bunkers (ממ"דים)

### Mobile-Specific
1. **Geolocation**: Capacitor integration for GPS access
2. **Deep Linking**: Auth callback via `appUrlOpen`
3. **Splash Screen**: Customized with orange branding color
4. **Firebase Crashlytics**: Automatic crash reporting

---

## 🔐 Security & Compliance

### Row-Level Security (RLS)
- All public tables have explicit RLS policies
- Admin operations gated by `has_role('admin')` Postgres function
- No direct client access to sensitive data (emails, phone, etc. restricted)

### Admin Access Control
- Env-based allowlist: `VITE_ADMIN_USER_ID` or `VITE_ADMIN_EMAIL`
- Fallback: Empty checks (deny-by-default)
- Routes themselves also feature-flagged: `VITE_ENABLE_ADMIN_ROUTES`

### Secrets Management
- `.env` file never committed (listed in `.gitignore`)
- Keystore & credentials managed locally or via CI/CD secrets
- Firebase keys in `android/app/google-services.json` (build-time secret)

---

## 📚 Documentation Files

- **AGENTS.md**: Architecture reference for AI agents (DDD patterns, workflows)
- **CLAUDE.md**: Claude Code configuration (RuFlo v3, swarm rules, memory patterns)
- **README.md**: User-facing setup & build instructions (Hebrew + English)
- **copilot/**: Legacy Copilot decision logs & checklists (MVP, rollback, etc.)

---

## 🧪 Testing

- **Framework**: Vitest with jsdom environment
- **Files**: `src/**/*.{test,spec}.{ts,tsx}`
- **Setup**: `src/test/setup.ts` (DOM polyfills, test utilities)
- **Coverage**: Tracked in `coverage/` directory

---

## 🔄 CI/CD & Deployment

- **Cloud Build** (`cloudbuild.yaml`): Google Cloud Build pipeline
- **Docker**: `Dockerfile` + `compose.yaml` for local dev environment
- **Release**: Manual trigger of Gradle release build + Google Play Store upload

---

## 🎯 MVP Status & Roadmap

### Completed ✅
- Bilingual UI (Hebrew + English)
- Map-based garden discovery
- User authentication & profiles
- Check-in system with peak hours analytics
- Basic admin import (single mode)
- Protected spaces table + import (NEW)
- Google Places ID deduplication (NEW)
- Garden status moderation flow (NEW)

### In Progress 🔄
- Enhanced admin moderation UX
- Dog profile sharing feature
- Restaurant menu ordering (partially implemented)

### Future 📅
- Push notifications (placeholder component exists)
- Advanced analytics
- Community forum / hazard reporting enhancement

---

## 🛠️ Tech Debt & Known Issues

1. **TypeScript Strictness**: Intentionally relaxed (`noImplicitAny: false`, `strictNullChecks: false`)
   - Add explicit runtime checks on critical paths
2. **Unused Vars**: ESLint allows them (`@typescript-eslint/no-unused-vars: off`)
   - Rely on code review, not linting
3. **Legacy Components**: Some components in `legacy-ui/` not actively used
4. **Notifications**: Placeholder implementation (removed from MVP launch)
5. **Android Errors**: Occasional JVM crash logs in `hs_err_pid*.log` files (ignore for now)

---

## 📖 How to Use This Document

- **For Feature Development**: See the "Architecture Overview" → target the relevant `src/` folder
- **For Admin Features**: Focus on `AdminImport.tsx`, `AdminGardens.tsx`, migrations, and RLS policies
- **For Mobile Issues**: Check `android/` structure, Capacitor config, Firebase setup
- **For Bilingual Changes**: Update `src/i18n/translations.ts` + any JSX labels
- **For Database Changes**: Always run migration → update Supabase types → test in app

---

## 📞 Quick Reference

| Task | Location | Key File(s) |
|------|----------|-------------|
| Add a page | `src/pages/` | Register route in `src/App.tsx` |
| Customize UI | `src/components/ui/` | Use shadcn or extend with Tailwind |
| Change text | `src/i18n/translations.ts` | Single source of truth |
| Add API endpoint | `src/hooks/` | Use Supabase client directly |
| Modify DB schema | `supabase/migrations/` | Create new migration file |
| Update admin logic | `useDeveloperAccess.ts` | Gating + RLS policies |
| Build for Android | `npm run build` then `npm run play` | See README for details |

---

**Built with ❤️ for dogs 🐕**


