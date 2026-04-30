# 🐾 DogYard - מפת מבנה האפליקציה
## Structure Map for NotebookLM Analysis

**Version**: 0.0.0 (MAIN branch)  
**Last Updated**: April 25, 2026  
**Language**: Hebrew + English (Bilingual)  
**Focus**: Pages, Buttons, Features - Debugging-Ready

---

## 📑 איך להשתמש במסמך זה ל-NotebookLM

1. העלה את הקובץ ל-NotebookLM
2. ממנו יוכל להציע לך:
   - תרשים זרימת דפים (Navigation Flow)
   - תרשים כפתורים ופעולות (Button Dependencies)
   - מטריצת פיצ'רים (Feature Matrix)
   - מפת ניתוב (Route Map)

---

## 🗺️ ROUTE MATRIX - כל הנתיבים

| Route | Type | Protected | Component | Feature Flag | Description |
|-------|------|-----------|-----------|--------------|-------------|
| `/` | Public | ❌ | `Index.tsx` | None | דף בית עם Hero + גינות מומלצות |
| `/map` | Public | ❌ | `Map.tsx` | None | מפה אינטראקטיבית של גינות כלבים |
| `/profile` | Protected | ✅ | `Profile.tsx` | None | פרופיל משתמש + ניהול כלבים |
| `/settings` | Protected | ✅ | `Settings.tsx` | None | הגדרות + שינוי שדות פרופיל |
| `/auth` | Public | ❌ | `Auth.tsx` | None | התחברות / הרשמה |
| `/auth/callback` | Public | ❌ | `AuthCallback.tsx` | None | OAuth callback handler |
| `/reset-password` | Public | ❌ | `ResetPassword.tsx` | None | איפוס סיסמה |
| `/garden/:id` | Public | ❌ | `GardenDetails.tsx` | None | פרטי גינה בודדת + check-in |
| `/privacy` | Public | ❌ | `Privacy.tsx` | None | עמוד פרטיות משפטי |
| `/terms` | Public | ❌ | `Terms.tsx` | None | תנאי שימוש משפטיים |
| `/dog-share/accept` | Public | ❌ | `DogShareAccept.tsx` | ✅ VITE_ENABLE_DOG_SHARE_ROUTE | קבלת הזמנה לשיתוף כלב |
| `/admin/import` | Admin | ✅ | `AdminImport.tsx` | ✅ VITE_ENABLE_ADMIN_ROUTES | ייבוא מGoogle Places (גינות + מרחבים מוגנים) |
| `/admin/gardens` | Admin | ✅ | `AdminGardens.tsx` | ✅ VITE_ENABLE_ADMIN_ROUTES | אישור גינות בהמתנה |
| `/*` (fallback) | Public | ❌ | `NotFound.tsx` | None | 404 Not Found page |

**Protection Rules:**
- `Protected` = `<ProtectedRoute>` wrapper (requires user auth)
- `Admin` = `<DeveloperRoute>` wrapper (requires admin access)
- Feature flags defined in `App.tsx` via `import.meta.env`

---

## 🎨 GLOBAL UI STRUCTURE

### 🔝 HEADER (appears on all pages except home)
Located in `App.tsx` Layout component - GlassCard container

| Button/Element | Action | Position | Icon | Visibility |
|---|---|---|---|---|
| Menu Icon | Open GlassSidebar | Left | `Menu` | Always |
| Logo + App Name | Navigate to `/` | Center-Left | `BrandLogo` | Always |
| Language Toggle | Switch he/en | Right (Desktop) | `EN` / `עב` | Desktop only |
| Auth Button | Login/Profile | Right | `LogIn` / `UserRound` | Always |
| City Badge | Display location | Right | `MapPin` | Desktop only |

### 📱 BOTTOM NAV (appears on all pages)
Located in `BottomNav.tsx` - Glass morphism bar

```
[Settings] [Profile]  |  [Shelter]  |  [Map] [Home] [Language]
```

RTL (עברית) order is reversed for thumb accessibility.

| Position | Icons | Path | Component |
|----------|-------|------|-----------|
| **Left (RTL: Right)** | Home, Map | `/`, `/map` | NavLink |
| **Center** | 🛡️ (Red) | Trigger | `goToNearestShalter()` |
| **Right (RTL: Left)** | Profile, Settings, Language | `/profile`, `/settings`, toggle | NavLink + toggle |

### 🔘 SIDEBAR NAVIGATION
Located in `GlassSidebar.tsx` - Sheet drawer (right RTL, left LTR)

| Label | Icon | Path | Visible |
|-------|------|------|---------|
| Home | `Home` | `/` | Always |
| Nearby Gardens | `Map` | `/map` | Always |
| Profile | `User` | `/profile` | Always |
| Settings | `Settings` | `/settings` | Always |

---

## 📄 PAGE BREAKDOWN - דפים פרטיים

### 1️⃣ HOME PAGE (Index.tsx)

**URL:** `/`  
**Protected:** No  
**Layout:** Hero image background + cards grid  

#### Sections:
1. **Hero Section**
   - Badge: "ממ"ים תל אביב"
   - Title: "גינות כלבים" + "מקום בטוח" (highlight in green)
   - CTA Button: "👀 לגינות כלבים" → Navigate to `/map`

2. **Top Gardens Grid** (6 cards in 3-column responsive)
   - Each card shows:
     - Garden name (formatted)
     - Location
     - Rating (5-star display)
     - CTA: "פתח" → Navigate to `/garden/:id`

3. **Peak Hours Chart**
   - Bar chart showing visitor traffic by hour
   - Data from first garden's peak hours
   - Fallback data if none available

#### Buttons:
| Button | Icon | Action |
|--------|------|--------|
| **CTA Hero** | `MapPin` | Navigate to `/map` |
| **Garden Card** | None | Navigate to `/garden/:id` |

---

### 2️⃣ MAP PAGE (Map.tsx)

**URL:** `/map`  
**Protected:** No  
**Layout:** Google Maps APIProvider + markers overlay  

#### Components:
1. **Interactive Map**
   - Center: Tel Aviv (32.0853, 34.7818)
   - Markers for all gardens
   - Click marker → Select garden → Pan to location

2. **Garden List (Right Sidebar on Desktop, Modal on Mobile)**
   - Searchable list of all gardens
   - Sorting options (distance, rating, etc.)
   - Selected garden highlighted

3. **Garden Info Card** (when selected)
   - Name, location, rating, reviews
   - Button: "טען גינה" → Navigate to `/garden/:id`

#### Buttons:
| Button | Icon | Action |
|--------|------|--------|
| **Refresh** | `RefreshCcw` | Re-fetch gardens |
| **Open Garden** | `Navigation` | Navigate to `/garden/:id` |
| **Report Hazard** | `AlertTriangle` | Trigger hazard report |

---

### 3️⃣ GARDEN DETAILS PAGE (GardenDetails.tsx)

**URL:** `/garden/:id`  
**Protected:** No  
**Layout:** Card-based with tabs  

#### Sections:
1. **Garden Header**
   - Name, location, rating

2. **Amenities Grid** (with icons)
   - Has Fence: `ShieldCheck`
   - Water: `Droplets`
   - Shade: `Sun`
   - Lighting: `Lightbulb`
   - Parking: `Car`

3. **Active Visitors List**
   - Shows who's currently checked in
   - User avatar + dog avatar
   - Status timestamp

4. **Peak Hours Chart**
   - Visitor count by hour

5. **Check-In Dialog**
   - Select dog(s) from "My Dogs" dropdown
   - Status radio: "Arrived" / "On the way"
   - Button: "צ'קין" → Trigger API call

#### Buttons:
| Button | Icon | Action |
|--------|------|--------|
| **Back** | `ChevronLeft` | Go back |
| **Check-In** | `CheckCircle2` | Open check-in dialog |
| **Share Garden** | `Share2` | Share location |
| **Report** | `AlertTriangle` | Report hazard |
| **Confirm Check-In** | `Check` | Submit check-in mutation |

---

### 4️⃣ PROFILE PAGE (Profile.tsx)

**URL:** `/profile`  
**Protected:** ✅ Yes  
**Layout:** Card-based sections  

#### Sections:
1. **User Info**
   - Avatar (with upload capability)
   - Display name
   - Email

2. **My Dogs Section**
   - List of dogs owned by user
   - Each dog card shows: name, breed, gender, size
   - Button: "Add Dog" (blue)

3. **Dog Details Modal**
   - Form: name, breed, gender dropdown, size dropdown
   - Button: "Save Dog"

4. **Shared Dogs Section** (if VITE_ENABLE_DOG_SHARE_ROUTE = true)
   - Dogs shared with this account
   - Role indicator: "editor" / "viewer"
   - Count of members sharing this dog

#### Buttons:
| Button | Icon | Action |
|--------|------|--------|
| **Edit Avatar** | None | Upload new image |
| **Add Dog** | `Plus` | Open add-dog dialog |
| **Delete Dog** | `Trash2` | Delete dog (confirm) |
| **Edit Dog** | None | Open edit dialog |
| **Share Dog** | `Share2` | Open share dialog |
| **Copy Link** | `Copy` | Copy share link to clipboard |
| **Logout** | `LogOut` | Sign out (in sidebar footer) |

---

### 5️⃣ SETTINGS PAGE (Settings.tsx)

**URL:** `/settings`  
**Protected:** ✅ Yes  
**Layout:** Form-based  

#### Form Fields:
- **Display Name** (text input)
- **Phone** (text input)

#### Buttons:
| Button | Icon | Action |
|--------|------|--------|
| **Save** | `Save` | Save profile changes |

---

### 6️⃣ AUTH PAGE (Auth.tsx)

**URL:** `/auth`  
**Protected:** No  
**Layout:** Glass card form  

#### Tabs:
1. **LOGIN Tab**
   - Email input
   - Password input
   - Button: "Log In" → `signInWithPassword()`
   - Link: "Forgot password?" → Switch to forgot-password mode
   - Button: "Sign up with Google" → `signInWithOAuth()` (opens browser)

2. **SIGN UP Tab**
   - Name input
   - Email input
   - Password input
   - Button: "Sign Up" → `signUp({ email, password, data: { full_name } })`
   - Button: "Continue with Google" → `signInWithOAuth()`

3. **FORGOT PASSWORD Mode**
   - Email input
   - Button: "Send Reset Link" → `resetPasswordForEmail()`
   - Message: "Check your email"

#### Buttons:
| Button | Icon | Action |
|--------|------|--------|
| **Login** | `ArrowRight` | Sign in with password |
| **Sign Up** | `ArrowRight` | Create account |
| **Google OAuth** | Google logo | Open OAuth flow |
| **Reset Password** | None | Send password reset email |
| **Toggle Tab** | None | Switch between Login/Signup |

---

### 7️⃣ GARDEN DETAILS (GardenDetails.tsx)

Already covered in detail above.

---

### 8️⃣ ADMIN: IMPORT PAGE (AdminImport.tsx)

**URL:** `/admin/import`  
**Protected:** ✅ Yes (Admin Only)  
**Feature Flag:** `VITE_ENABLE_ADMIN_ROUTES`  
**Layout:** Tabs + loading + results  

#### Tabs:
1. **Tab 1: Dog Gardens (גינות כלבים)**
   - Searches Google Places in Gush Dan sectors
   - Search queries: "גינת כלבים", "מתחם כלבים", "dog park", "dog garden"
   - Button: "Scan & Import" → Trigger scan mutation
   - Results table: name (he + en), location, rating, status

2. **Tab 2: Protected Spaces (מרחבים מוגנים)**
   - Searches Tel Aviv, Ramat Gan, Givatayim, Herzliya
   - Search queries: "ממ"ד", "מרחב מוגן", "מקלט", "public shelter"
   - Button: "Scan & Import" → Trigger scan mutation
   - Results table: name (he + en), capacity, type

#### Buttons:
| Button | Icon | Action |
|--------|------|--------|
| **Scan & Import** | `MapPin` | Start Google Places scan |
| **Clear Results** | None | Reset results |
| **Refresh** | `RefreshCcw` | Re-scan |

---

### 9️⃣ ADMIN: GARDEN MODERATION (AdminGardens.tsx)

**URL:** `/admin/gardens`  
**Protected:** ✅ Yes (Admin Only)  
**Feature Flag:** `VITE_ENABLE_ADMIN_ROUTES`  
**Layout:** List of pending gardens  

#### Sections:
1. **Header**
   - Title: "ניהול גינות"
   - Description: "אישור גינות חדשות במערכת"

2. **Garden Cards List**
   - Each card: name, location, status badge, created_at
   - If empty: "אין גינות הממתינות לאישור"

#### Buttons:
| Button | Icon | Action |
|--------|------|--------|
| **Approve** | `Check` | Update status to "approved" |
| **Reject** | `X` | Delete or mark rejected |
| **Back to Map** | None | Navigate to `/map` |

---

### 🔟 OTHER PAGES

| Page | URL | Description |
|------|-----|-------------|
| **Auth Callback** | `/auth/callback` | OAuth redirect handler |
| **Reset Password** | `/reset-password` | Password reset form |
| **Privacy** | `/privacy` | Legal privacy page |
| **Terms** | `/terms` | Legal terms page |
| **Dog Share Accept** | `/dog-share/accept` | Invitation acceptance (feature-flagged) |
| **Not Found** | `/*` | 404 page |

---

## 🔘 GLOBAL BUTTONS (Navigation & Actions)

### Header Buttons
```
[Menu] ---- [Logo] ---- [Language] [Auth]
```

### Bottom Navigation Bar
```
[Home] [Map] [Profile] | [🛡️ Shelter] | [Settings] [Language]
```

### Sidebar Navigation
```
[Home] / [Map] / [Profile] / [Settings] / [Language Toggle] / [Logout]
```

---

## 🎯 KEY FEATURES BY PAGE

### Global Features
- **Bilingual UI** (Hebrew RTL default, English LTR)
- **Language Toggle** (Bottom nav + header)
- **Authentication** (Supabase PKCE flow)
- **Deep-link Auth** (Capacitor app URL handler)
- **Glass-morphism Design** (all cards + nav bars)
- **Theme Support** (dark/light mode provider)

### Map Features
- **Google Maps Integration** (markers, pan, zoom)
- **Garden Search** (by name/location)
- **Real-time Visitor Count**
- **Hazard Reporting** (AlertTriangle icon)

### Profile & Dogs
- **User Profile Management** (name, phone, avatar)
- **Dog Management** (add, edit, delete)
- **Dog Sharing** (if feature-enabled)
- **Share Links** (copy to clipboard)

### Check-in System
- **Select Dogs** (multi-select dropdown)
- **Check-in Status** (Arrived / On the way)
- **Active Visitors** (real-time list with avatars)
- **Peak Hours Analytics** (bar chart)

### Admin Features
- **Google Places Import** (bulk scan + upsert)
- **Garden Moderation** (approve/reject pending)
- **Protected Spaces** (shelters import)
- **Import Logging** (results display)

### Protection & Gating
- **Protected Routes** (requires user auth)
- **Admin Routes** (requires VITE_ADMIN_USER_ID or VITE_ADMIN_EMAIL)
- **Feature Flags** (VITE_ENABLE_ADMIN_ROUTES, VITE_ENABLE_DOG_SHARE_ROUTE)
- **RLS Policies** (Supabase row-level security)

---

## 🔄 DATA FLOW PATTERNS

### 1. Authentication Flow
```
Auth.tsx → Supabase.auth.signInWithPassword() 
        → Session stored in localStorage 
        → useAuth() hook detects session 
        → Protected routes unlock 
        → Redirect to /
```

### 2. Garden List Flow
```
Map.tsx / Index.tsx → useGardens() 
                   → Supabase.from("gardens").select() 
                   → formatGardenName() 
                   → Display in grid/map
```

### 3. Check-in Flow
```
GardenDetails.tsx → Check-in dialog 
                 → Select dogs + status 
                 → useCheckIn() mutation 
                 → Supabase INSERT activeVisitors 
                 → Real-time update via polling
```

### 4. Admin Import Flow
```
AdminImport.tsx → Scan Google Places by sector 
               → useMapsLibrary() for place details 
               → Enrich with English names 
               → Supabase.upsert() with google_place_id 
               → Display results
```

---

## 💾 REACT QUERY CACHING KEYS

| Query Key | Query Function | Stale Time | Used In |
|-----------|---|---|---|
| `["gardens"]` | `useGardens()` | 0ms | Index, Map, search lists |
| `["nearby-gardens", lat, lng, radius]` | `useNearbyGardens()` | 5000ms | Map proximity search |
| `["peak-hours", gardenId]` | `usePeakHours()` | 30000ms | Index, GardenDetails |
| `["check-in"]` | `useCheckIn()` mutation | N/A (mutation) | GardenDetails check-in button |
| `["user"]` | `useAuth()` | 0ms | All pages (global) |
| `["admin-access"]` | `useDeveloperAccess()` | 0ms | Admin routes guard |

---

## 🛡️ PROTECTED ROUTE HIERARCHY

```
Public Routes
├── /
├── /map
├── /auth
├── /auth/callback
├── /reset-password
├── /privacy
├── /terms
├── /garden/:id
└── /404

Protected Routes (ProtectedRoute HOC)
├── /profile
├── /settings
└── /dog-share/accept (if VITE_ENABLE_DOG_SHARE_ROUTE=true)

Admin Routes (DeveloperRoute HOC + ProtectedRoute)
├── /admin/import (if VITE_ENABLE_ADMIN_ROUTES=true)
└── /admin/gardens (if VITE_ENABLE_ADMIN_ROUTES=true)

Feature-Flagged Routes
├── /dog-share/accept (VITE_ENABLE_DOG_SHARE_ROUTE)
├── /admin/import (VITE_ENABLE_ADMIN_ROUTES)
└── /admin/gardens (VITE_ENABLE_ADMIN_ROUTES)
```

---

## 🧪 DEBUGGING CHECKLIST

### Route Issues
- [ ] Check `App.tsx` Route definitions
- [ ] Verify Protected/Admin route guards
- [ ] Confirm feature flags in `.env`
- [ ] Test navigation with & without auth
- [ ] Verify RTL routing (should work same as LTR)

### Button Issues
- [ ] Check onClick handler in component
- [ ] Verify loading/disabled states
- [ ] Test on mobile (touch vs click)
- [ ] Check toast notifications on success/error
- [ ] Verify icon consistency

### Navigation Issues
- [ ] Check BottomNav active state (pathname matching)
- [ ] Test sidebar open/close on mobile
- [ ] Verify language toggle updates all components
- [ ] Check deep-link handling in Auth flow

### Page Load Issues
- [ ] Verify Supabase credentials in `.env`
- [ ] Check useGardens() React Query key
- [ ] Test error handling & fallback data
- [ ] Verify map API key if on Map page
- [ ] Check database indexes for performance

### Auth Issues
- [ ] Test login/signup flows
- [ ] Verify OAuth callback URL matches config
- [ ] Check Capacitor deep-link handling
- [ ] Test password reset email
- [ ] Verify session persistence on reload

### Admin Features
- [ ] Confirm `VITE_ENABLE_ADMIN_ROUTES=true` in `.env`
- [ ] Verify `VITE_ADMIN_USER_ID` or `VITE_ADMIN_EMAIL` set
- [ ] Test import scan with actual Google Places API
- [ ] Check database `upsert` logic with google_place_id
- [ ] Verify pending gardens display correctly

---

## 📦 Component Dependencies

### Header (App.tsx Layout)
- GlassCard, BrandLogo, Menu icon, Language toggle, Auth button

### Bottom Nav
- NavLink, Shelter button (red), Language toggle, ProtectedSpacePromptDialog

### Sidebar
- Sheet, BrandLogo, NavLink items, Language toggle, Logout button

### Cards (All Pages)
- GlassCard wrapper, Avatar, Button, Icon components

### Modals/Dialogs
- Dialog, DialogHeader, DialogContent, DialogFooter, Input, Select, Checkbox

---

**End of Map Document**

Use this with NotebookLM to generate:
- Navigation flow diagrams
- Button dependency graphs
- Feature matrix tables
- Route hierarchy trees
- Database schema relationships

