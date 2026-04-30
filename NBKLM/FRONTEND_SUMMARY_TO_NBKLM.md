# 🐾 DogYard - FRONTEND Features Summary (MAIN Branch)
**For NotebookLM Analysis**

---

## 📱 APP OVERVIEW

**App**: DogYard - Social platform for dog owners in Israel  
**Tech**: React 18 + TypeScript + Vite + Capacitor (Android)  
**Backend**: Supabase (Auth, Postgres)  
**Languages**: Hebrew (RTL default) + English  
**Status**: MVP - MAIN Branch  
**Date**: April 25, 2026

---

## 🗺️ ROUTE MAP (14 Routes)

### Public Routes (No Auth Required)
| Route | Page | Feature |
|-------|------|---------|
| `/` | **Index** | Landing + Hero + Top 6 Gardens |
| `/map` | **Map** | Interactive Google Maps with markers |
| `/garden/:id` | **GardenDetails** | Full profile + amenities + check-in |
| `/auth` | **Auth** | Login/Signup + Google OAuth |
| `/auth/callback` | **AuthCallback** | OAuth redirect handler |
| `/reset-password` | **ResetPassword** | Password reset form |
| `/privacy` | **Privacy** | Legal page |
| `/terms` | **Terms** | Legal page |
| `/*` | **NotFound** | 404 fallback |

### Protected Routes (Auth Required ✅)
| Route | Page | Feature |
|-------|------|---------|
| `/profile` | **Profile** | User profile + dog management + sharing |
| `/settings` | **Settings** | Update display name + phone |

### Admin Routes (Auth + Admin Email/ID ✅)
| Route | Page | Feature | Flag |
|-------|------|---------|------|
| `/admin/import` | **AdminImport** | Bulk import gardens + protected spaces | `VITE_ENABLE_ADMIN_ROUTES` |
| `/admin/gardens` | **AdminGardens** | Approve/reject pending gardens | `VITE_ENABLE_ADMIN_ROUTES` |
| `/dog-share/accept` | **DogShareAccept** | Accept dog share invitation | `VITE_ENABLE_DOG_SHARE_ROUTE` |

---

## 🎨 GLOBAL UI COMPONENTS

### Header Bar (All Pages)
```
[☰ Menu] ---- [🐾 Logo] ---- [Language] [Auth Button]
```
- Menu → Opens GlassSidebar
- Logo → Navigate to `/`
- Language → Toggle EN/עברית
- Auth → Login or Profile link

### Bottom Navigation Bar (All Pages)
```
[Home] [Map] [Profile] | [🛡️ Shelter] | [Settings] [Language]
```
- **Red Center Button**: `🛡️ Shelter` → Find nearest emergency shelter
- Uses GPS + navigation
- Shows alternative options if GPS off

### Sidebar Navigation (GlassSidebar)
- Home, Map, Profile, Settings
- Language toggle
- Logout button

### Glass-Morphism Design
- All cards: `bg-white/8 backdrop-blur-2xl border border-white/10`
- Rounded corners: `rounded-2xl` to `rounded-3xl`
- Colors: Emerald-300 accents (primary), Teal (secondary)

---

## 📄 PAGES BREAKDOWN

### 🏠 HOME PAGE (`/`)
**Feature**: Discovery + Hero Landing

**Sections:**
1. **Hero** (Full screen image with overlay)
   - Title: "גינות כלבים" + "מקום בטוח"
   - Button: "👀 לגינות כלבים" → `/map`

2. **Top 6 Gardens Grid** (3-column responsive)
   - Garden name (formatted)
   - Location
   - Rating (5-star display)
   - Click: → `/garden/:id`

3. **Peak Hours Chart** (Bar chart)
   - Visitor count by hour
   - Uses first garden's data

**Data**: `useGardens()` + `usePeakHours()`

---

### 🗺️ MAP PAGE (`/map`)
**Feature**: Interactive Map + Discovery

**Sections:**
1. **Google Maps**
   - Center: Tel Aviv (32.0853, 34.7818)
   - Markers for all gardens
   - Click marker → Select + pan

2. **Garden List** (Desktop sidebar / Mobile modal)
   - Searchable
   - Sortable
   - Click → Select + highlight

3. **Selected Garden Card**
   - Name, location, rating
   - Button: "טען גינה" → `/garden/:id`

**Buttons:**
- [🔄 Refresh] → Refetch gardens
- [📍 Open] → Navigate to garden details
- [⚠️ Report] → Hazard report dialog

---

### 🎯 GARDEN DETAILS (`/garden/:id`)
**Feature**: Full Profile + Check-In System

**Sections:**
1. **Header**
   - Name, location, rating
   - [← Back] [🔗 Share] [⚠️ Report]

2. **Amenities Grid** (Icons + status)
   - ✅ Fence | 💧 Water | ☀️ Shade | 💡 Lighting | 🚗 Parking

3. **Active Visitors List** (Real-time)
   - User avatar + name
   - Dog avatar (if checked in with dog)
   - Status timestamp

4. **Peak Hours Chart** (Bar graph)

5. **Check-In Dialog**
   - Dropdown: Select dog(s)
   - Radio: "Arrived" / "On the way"
   - [✓ Confirm Check-In]

**Buttons:**
- [✓ Check-In] → Open check-in dialog
- [🔗 Share] → Share location
- [⚠️ Report] → Report hazard
- [←] Back button

---

### 👤 PROFILE (`/profile`) ✅ PROTECTED
**Feature**: User Profile + Dog Management + Sharing

**Sections:**
1. **User Info**
   - Avatar (upload capable)
   - Email address
   - Display name

2. **My Dogs**
   - List of dogs owned
   - Dog card: name, breed, gender, size
   - [➕ Add Dog] [✎ Edit] [🗑️ Delete]

3. **Add Dog Dialog**
   - Form: name, breed, gender (dropdown), size (dropdown)
   - [💾 Save Dog]

4. **Shared Dogs** (if `VITE_ENABLE_DOG_SHARE_ROUTE=true`)
   - Dogs shared with me
   - Role: "editor" / "viewer"
   - Member count

**Buttons:**
- [📸 Upload] → Create avatar
- [➕ Add Dog] → Open add dog dialog
- [✎ Edit] → Prefill form for editing
- [🗑️ Delete] → Confirm + delete
- [📤 Share] → Open share dialog
- [🔗 Copy] → Copy invite link
- [🚪 Logout] → Sign out (in sidebar)

---

### ⚙️ SETTINGS (`/settings`) ✅ PROTECTED
**Feature**: Update Profile Fields

**Form:**
- Display Name (text input)
- Phone (tel input)

**Buttons:**
- [💾 Save] → Update profile

---

### 🔐 AUTH (`/auth`)
**Feature**: Login / Signup

**Tabs:**
1. **LOGIN**
   - Email + Password
   - [🔑 Log In] → `signInWithPassword()`
   - [Forgot password?] → Switch to reset mode
   - [🔑 Sign in with Google] → OAuth

2. **SIGN UP**
   - Name + Email + Password
   - [👤 Sign Up] → Create account
   - [🔑 Continue with Google] → OAuth

3. **FORGOT PASSWORD**
   - Email only
   - [📧 Send Reset Link] → Email

**Buttons:**
- [🔑 Log In] → Login mutation
- [👤 Sign Up] → Signup mutation
- [Google] → OAuth flow (opens browser)
- [Tab Toggle] → Switch modes

---

### 💾 ADMIN: IMPORT (`/admin/import`) ✅ ADMIN
**Feature**: Bulk Import from Google Places

**Tabs:**

1. **Dog Gardens (🐶)**
   - Searches: Gush Dan sectors (Tel Aviv, Ramat Gan, Herzliya, etc.)
   - Queries: "גינת כלבים", "dog park", "dog garden"
   - [🔍 Scan & Import] → Start scan
   - Results table: name (he/en), location, rating, status

2. **Protected Spaces (🛡️)**
   - Searches: Tel Aviv, Ramat Gan, Givatayim, Herzliya
   - Queries: "ממ"ד", "מקלט", "public shelter"
   - [🔍 Scan & Import] → Start scan
   - Results table: name (he/en), capacity, type

**Buttons:**
- [🔍 Scan & Import] → Google Places API scan + Supabase upsert
- [🔄 Refresh] → Re-scan
- [🧹 Clear] → Reset results

---

### 📋 ADMIN: GARDENS (`/admin/gardens`) ✅ ADMIN
**Feature**: Approve Pending Gardens

**List:**
- Cards with: name, location, status, created_at
- [✅ Approve] → Update status → "approved"
- [❌ Reject] → Delete/reject

**Empty State:**
- Message: "אין גינות הממתינות לאישור"
- [← Back to Map] → Navigate to `/map`

---

## 🔘 BUTTON REFERENCE (Complete)

### Navigation Buttons
| Button | Icon | Action | Page |
|--------|------|--------|------|
| Menu | ☰ | Open sidebar | Header |
| Logo | 🐾 | → / | Header |
| Home | 🏠 | → / | BottomNav |
| Map | 🗺️ | → /map | BottomNav |
| Profile | 👤 | → /profile | BottomNav |
| Settings | ⚙️ | → /settings | BottomNav |
| Language | EN/עב | Toggle language | Everywhere |
| Back | ← | Go back | Page-specific |

### Action Buttons
| Button | Icon | Action | Page |
|--------|------|--------|------|
| **Check-In** | ✓ | Open check-in dialog | GardenDetails |
| **Share** | 🔗 | Share garden/dog | GardenDetails, Profile |
| **Report** | ⚠️ | Report hazard | GardenDetails, Map |
| **Refresh** | 🔄 | Refetch data | Map, AdminImport |
| **Add Dog** | ➕ | Open add dog dialog | Profile |
| **Edit** | ✎ | Open edit dialog | Profile |
| **Delete** | 🗑️ | Delete with confirm | Profile |
| **Copy Link** | 📋 | Copy to clipboard | Profile |
| **Upload Avatar** | 📸 | File picker | Profile |
| **Approve** | ✅ | Approve garden | AdminGardens |
| **Reject** | ❌ | Reject garden | AdminGardens |

### CTA Buttons
| Button | Icon | Action | Page |
|--------|------|--------|------|
| **Hero CTA** | 👀 | → /map | Home |
| **Login** | 🔑 | Sign in | Auth |
| **Sign Up** | 👤 | Create account | Auth |
| **Google** | 🔑 | OAuth login | Auth |
| **Shelter** | 🛡️ | Find shelter (red) | BottomNav |
| **Save** | 💾 | Submit form | Settings, Profile |
| **Logout** | 🚪 | Sign out | Sidebar |
| **Scan & Import** | 🔍 | Admin import | AdminImport |

---

## ⭐ KEY FEATURES

### 1. **Bilingual UI** (Hebrew RTL + English LTR)
- Toggle button in header/bottom-nav/sidebar
- Saved to localStorage
- All text auto-flips direction
- Icons adjust for RTL layout

### 2. **Authentication**
- Email/password login
- Google OAuth (opens external browser)
- Password reset via email
- Session persistence (localStorage)
- Capacitor deep-link handling (mobile)

### 3. **Garden Discovery**
- Home page: Top 6 featured gardens
- Map page: Interactive Google Maps with all gardens
- Garden details: Full profile + amenities + active visitors
- Peak hours analytics: Visitor trends by hour

### 4. **Check-In System**
- Select dog(s) when checking in
- Status: "Arrived" or "On the way"
- Real-time active visitor list
- Shows who's currently at garden

### 5. **User Profiles & Dogs**
- Display name + phone + avatar
- Manage multiple dogs (add/edit/delete)
- Dog sharing (if feature enabled)
- Invite links + role-based access

### 6. **Admin Features** (if feature flags enabled)
- **Import**: Bulk scan Google Places + auto-import to DB
- **Approval**: Review + approve/reject pending gardens
- **Protected Spaces**: Import emergency shelters

### 7. **Shelter Navigation** (Emergency)
- Red button in bottom navigation
- Request GPS permission
- Show nearest protected space
- Alternative: Manual address or garden selection

### 8. **Hazard Reporting** (future)
- Report issues at gardens
- Severity levels
- Community-driven safety

---

## 🎯 FEATURE MATRIX

| Feature | Pages | Requires Auth | Requires Admin |
|---------|-------|---|---|
| View gardens | Home, Map, Details | ❌ | ❌ |
| Check-in | GardenDetails | ✅ (if dog owner) | ❌ |
| User profile | Profile | ✅ | ❌ |
| Dog management | Profile | ✅ | ❌ |
| Dog sharing | Profile | ✅ | ❌ (if flag) |
| Settings | Settings | ✅ | ❌ |
| Hazard report | GardenDetails | ❌ | ❌ |
| Shelter nav | BottomNav | ❌ | ❌ |
| Language toggle | Everywhere | ❌ | ❌ |
| Admin import | AdminImport | ✅ | ✅ |
| Admin approve | AdminGardens | ✅ | ✅ |

---

## 🔐 PROTECTION & GATING

### Authentication Guard: `ProtectedRoute` HOC
- Pages: `/profile`, `/settings`, `/dog-share/accept`
- If not logged in → Redirect to `/auth`

### Admin Guard: `DeveloperRoute` HOC
- Pages: `/admin/*`
- Checks: `VITE_ADMIN_USER_ID` or `VITE_ADMIN_EMAIL`
- If not admin → Deny access (deny-by-default)

### Feature Flags (Environment Variables)
```
VITE_ENABLE_ADMIN_ROUTES=true      # Enable /admin/*
VITE_ENABLE_DOG_SHARE_ROUTE=true   # Enable /dog-share/accept
```

---

## 🎨 DESIGN SYSTEM

### Colors & Styling
- **Primary**: Emerald-300 / Emerald-500 (green)
- **Secondary**: Teal-400 / Teal-500
- **Danger**: Red-600 (shelter button)
- **Background**: Black/transparent with gradient overlay
- **Text**: White on dark (high contrast)

### Components
- GlassCard (glass-morphism container)
- Button (rounded, gradient, shadow)
- Dialog (modal forms)
- Avatar (profile pictures)
- Icon (lucide-react)
- Toast (sonner notifications)

### Responsive Breakpoints
- Mobile: `sm:`
- Tablet: `md:`
- Desktop: `lg:`
- Full-width: `max-w-6xl` container

---

## 🚀 WHAT WORKS TODAY

✅ Home page landing  
✅ Google Maps integration  
✅ Garden listing + filtering  
✅ Authentication (login/signup/OAuth)  
✅ User profiles + dog management  
✅ Check-in system  
✅ Admin import + approval  
✅ Bilingual UI (Hebrew/English)  
✅ RTL support  
✅ Mobile responsive  
✅ Shelter emergency navigation  
✅ Peak hours analytics  
✅ Language toggling  

---

## 🔄 DATA FLOW

```
User → Auth (/auth)
       ↓
     Session stored → useAuth()
       ↓
Protected routes unlock
       ↓
useGardens() → Fetch from Supabase → Display on Index/Map
       ↓
Click garden → /garden/:id
       ↓
useCheckIn() → Submit check-in → Active visitors update
       ↓
Real-time polling updates visitor list
```

---

## 📦 ENVIRONMENT SETUP

### Required .env Variables
```env
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_GOOGLE_MAPS_API_KEY=...

# Optional: Feature flags
VITE_ENABLE_ADMIN_ROUTES=true
VITE_ENABLE_DOG_SHARE_ROUTE=true

# Optional: Admin access
VITE_ADMIN_USER_ID=user-id-here
VITE_ADMIN_EMAIL=admin@example.com

# Optional: Dev server
VITE_DEV_HOST=192.168.x.x
VITE_DEV_PORT=8080
```

---

## 🧪 DEBUGGING QUICK REFERENCE

| Issue | Check |
|-------|-------|
| Can't log in | Supabase URL + key in `.env` |
| Map not loading | Google Maps API key |
| Garden card blank | Check `formatGardenName()` |
| Check-in fails | User has dog in DB |
| Admin route denied | `VITE_ADMIN_USER_ID` or `VITE_ADMIN_EMAIL` |
| Language toggle broken | `LanguageContext` provider in App.tsx |
| Bottom nav wrong | Check RTL logic in `BottomNav.tsx` |
| Route not found | Verify in `App.tsx` Routes definition |

---

**🎉 Ready for analysis! Upload to NotebookLM now.**

