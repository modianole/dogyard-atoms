🔀 NAVIGATION FLOW - DogYard App

========== ONBOARDING FLOW ==========

1. User lands on → / (Home)
   ├─ Click "👀 לגינות כלבים" button
   └─ → /map

2. OR: User clicks "Menu" → GlassSidebar
   ├─ Click "מפה" (Map)
   └─ → /map

3. OR: User clicks BottomNav [Map]
   └─ → /map

========== DISCOVERY FLOW ==========

/ (Home)
├─ View: Hero section + top 6 gardens
├─ Click: Garden card
└─ → /garden/:id
   ├─ View: Amenities, visitors, peak hours
   ├─ Click: "Check-in" button
   ├─ Fill: Dog selection + status
   ├─ Submit: Check-in mutation
   └─ Show: Active visitors updated

/map (Map Page)
├─ View: Google Maps with markers
├─ Click: Marker
├─ View: Garden info card
├─ Click: "Open Garden" or "טען גינה"
└─ → /garden/:id

========== USER ACCOUNT FLOW ==========

GUEST (No Auth)
├─ Can view: / (home), /map, /garden/:id
├─ Cannot view: /profile, /settings
├─ Trying to access protected page:
│  └─ Redirect to: /auth
└─ Login:
   └─ → /profile (after success)

LOGIN PAGE (/auth)

Tab: Login
├─ Enter: Email + password
├─ Click: "[🔑 Log In]" button
├─ On success:
│  └─ Redirect to: / (home)
└─ On error:
   └─ Show toast error

Tab: Sign Up
├─ Enter: Name + email + password
├─ Click: "[👤 Sign Up]" button
├─ On success:
│  └─ Show success toast
└─ On error:
   └─ Show toast error

Option: Google OAuth
├─ Click: "[🔑 Sign in with Google]"
├─ (Opens browser external)
├─ Authorize in Google
├─ Redirected to: /auth/callback (URL: com.dogyard.app://auth-callback or web redirect)
├─ setSession() called
└─ Redirect to: / (or sessionStorage["auth:next"] if set)

Forgot Password
├─ In auth page: Click "Forgot password?"
├─ Switch to: Forgot Password mode
├─ Enter: Email address
├─ Click: "[📧 Send Reset Link]"
├─ Navigate to: /reset-password (user receives email)
└─ Complete password reset

========== PROFILE & DOGS FLOW ==========

/profile (Protected Route)

View User Info
├─ Display: Avatar, email
├─ Button: "[📸 Upload Avatar]"
├─ Upload: New image → Supabase storage

Dogs Section
├─ View: List of my dogs
├─ Click: "[➕ Add Dog]"
├─ Dialog opens:
│  ├─ Fill: Name, breed, gender, size
│  └─ Click: "[💾 Save]"
├─ Success:
│  └─ Dog added to list
├─ For each dog:
│  ├─ Button: "[✎ Edit]" → Edit dialog
│  ├─ Button: "[🗑️ Delete]" → Confirm + delete
│  └─ If sharing enabled:
│     ├─ Button: "[📤 Share]"
│     ├─ Dialog: Where to copy share link
│     └─ Send link to another user

Shared Dogs Section (if VITE_ENABLE_DOG_SHARE_ROUTE=true)
├─ View: Dogs shared with me
├─ Each card shows: Dog name + role
├─ Click: Dog card
└─ → /dog-share/accept (or view details)

Logout
├─ In sidebar footer:
├─ Click: "[🚪 Logout]"
├─ Confirm: Are you sure?
└─ Redirect to: / (home)

========== SETTINGS FLOW ==========

/settings (Protected Route)

Form
├─ Fields:
│  ├─ Display Name (text)
│  └─ Phone (tel)
├─ Button: "[💾 Save]"
└─ On success:
   └─ Show toast "Saved!"

========== ADMIN FLOWS ==========

REQUIREMENTS:
- ✅ VITE_ENABLE_ADMIN_ROUTES = "true"
- ✅ User has VITE_ADMIN_USER_ID or VITE_ADMIN_EMAIL set
- ✅ User logged in

ACCESS CHECK: useDeveloperAccess() hook
├─ If not admin:
│  └─ Deny access (deny-by-default)
└─ If admin:
   └─ Allow /admin/import and /admin/gardens

FLOW: /admin/import

Tab: DOG GARDENS (🐶)
├─ Click: "[🔍 Scan & Import]"
├─ Process:
│  ├─ Iterate Gush Dan sectors
│  ├─ Search Google Places for: "גינת כלבים", "מתחם כלבים", "dog park", "dog garden"
│  ├─ Fetch place details (name-en, location-en, rating)
│  └─ Upsert into /gardens table with google_place_id
├─ Display: Results table
├─ Status column: pending / approved / imported
└─ Next:
   └─ → Go to /admin/gardens to approve

Tab: PROTECTED SPACES (🛡️)
├─ Click: "[🔍 Scan & Import]"
├─ Process:
│  ├─ Iterate sectors: Tel Aviv, Ramat Gan, Givatayim, Herzliya
│  ├─ Search Google Places for: "ממ"ד", "מרחב מוגן", "מקלט", "public shelter"
│  ├─ Fetch place details
│  └─ Upsert into /protected_spaces table
├─ Display: Results table
└─ Show: Capacity, type

FLOW: /admin/gardens

Pending Gardens List
├─ Display: All gardens with status != "approved"
├─ Each row:
│  ├─ Info: Name, location, status, created_at
│  ├─ Button: "[✅ Approve]"
│  │  ├─ Click → UPDATE status to "approved"
│  │  ├─ Remove from list
│  │  └─ Show toast "Approved!"
│  └─ Button: "[❌ Reject]"
│     ├─ Click → DELETE garden (or mark rejected)
│     ├─ Remove from list
│     └─ Show toast "Rejected!"

Empty State
├─ Message: "אין גינות הממתינות לאישור"
├─ Button: "[← Back to Map]"
└─ → /map

========== CHECK-IN FLOW ==========

User at dog park → Wants to check in

GardenDetails (/garden/:id)
├─ Click: "[✓ Check-In]" button
├─ Dialog opens:
│  ├─ Show: Dropdown "Select your dog(s)"
│  ├─ Options: (fetched from /dogs table where owner_id = current_user)
│  ├─ Radio: "Arrived" / "On the way"
│  ├─ Button: "[✓ Confirm]"
│  └─ On submit:
│     ├─ INSERT into /active_garden_visitors
│     ├─ Requery visitors list
│     └─ Close dialog

Active Visitors Updates
├─ Real-time polling: usePeakHours()
├─ Displays: Avatars + names of current visitors
├─ Each visitor:
│  ├─ User avatar + name
│  ├─ Dog avatar (if has dog)
│  └─ Check-in status

========== SHELTER / EMERGENCY FLOW ==========

User in emergency → Needs protected space

BottomNav
├─ Click: "[🛡️ Shelter]" (red center button)
├─ GPS is OFF:
│  ├─ Dialog: "Turn on GPS?"
│  ├─ Button: "[📍 Turn On]" → Open location settings
│  ├─ Button: "[📍 Or use manual address]" → Address input
│  └─ Button: "[🏞️ Or choose nearby garden]" → List of gardens
└─ GPS is ON:
   ├─ Find: Nearest protected_spaces
   ├─ Open: Google Maps navigation
   └─ Show: Route + ETA

========== LANGUAGE SWITCHING FLOW ==========

Current language: Hebrew (עברית)
├─ Click: "[EN]" button (header/bottom-nav/sidebar)
├─ Language flips to: English
├─ All UI updates: Text = English
├─ Layout flips: LTR (left-to-right)
├─ Saved: localStorage["dogyard-language"] = "en"

Reload page:
└─ Remembers: English mode

Current language: English
├─ Click: "[עב]" button
├─ Language flips to: Hebrew
├─ All UI updates: Text = Hebrew
├─ Layout flips: RTL (right-to-left)
└─ Saved: localStorage["dogyard-language"] = "he"

========== ERROR & LOADING FLOWS ==========

Scenarios:

Network Error
├─ 1. API call fails
├─ 2. useQuery returns: error state
├─ 3. Component shows: "❌ לא הצלחנו לטעון. נסו לרענן."
└─ 4. Button: "[🔄 Refresh]" → Retry

Loading State
├─ 1. API call in progress
├─ 2. Show: Spinner (Loader2 icon)
├─ 3. Button: Disabled state
└─ 4. On complete:
   └─ Show: Data or error

Auth Error
├─ 1. Trying to access protected page without auth
├─ 2. useAuth() returns: user = null
├─ 3. ProtectedRoute redirects to: /auth
└─ 4. Login → Success → Redirect to attempted page

Admin Error
├─ 1. Trying to access /admin/import without VITE_ADMIN_*
├─ 2. useDeveloperAccess() returns: isDeveloper = false
├─ 3. Show: "Access Denied" or redirect to /404
└─ 4. Set VITE_ADMIN_USER_ID in .env → Retry

========== DEEP LINK FLOW (Mobile/Capacitor) ==========

Deep Link: com.dogyard.app://auth-callback?access_token=...&refresh_token=...

Flow:
├─ App receives: appUrlOpen event (Capacitor listener)
├─ Parse: URL + extract tokens
├─ Call: supabase.auth.setSession({ access_token, refresh_token })
├─ Session stored: localStorage
├─ User state: Updated in useAuth()
├─ Redirect: To saved sessionStorage["auth:next"] or /
└─ Show: "התחברת בהצלחה!"

========== SUMMARY OF KEY ROUTES ==========

PUBLIC:          / /map /auth /auth/callback /reset-password /garden/:id /privacy /terms /404
PROTECTED:       /profile /settings /dog-share/accept
ADMIN (if flag): /admin/import /admin/gardens

