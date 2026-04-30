📊 PAGE DEPENDENCY & HOOK MAPPING

This document maps each page to the hooks, components, and Supabase tables it uses.
Useful for debugging: if a page breaks, check its dependencies.

================== 🏠 HOME PAGE (Index.tsx) ==================

Route: /
Component: pages/Index.tsx
Protected: No
Feature Flag: None

HOOKS USED:
- useLanguage() → { t, language, isRTL }
- useGardens() → { data: gardens[], isLoading }
- usePeakHours(gardenId) → { data: peakData[] }

COMPONENTS USED:
- GlassCard (x2) → Hero + garden cards
- Button (implicit in cards)
- Star icons (lucide-react)

SUPABASE TABLES:
- gardens → SELECT * (all gardens for grid)
- check_ins (implied) → For peak hours calculation

BUTTONS:
- [Hero CTA] → Navigate to /map
- [Garden Card] → Navigate to /garden/:gardenId

ERRORS POSSIBLE:
- useGardens() fails → Show fallback empty grid
- usePeakHours() fails → Show fallback chart data
- formatGardenName() errors → Garden name displays raw

================== 🗺️ MAP PAGE (Map.tsx) ==================

Route: /map
Component: pages/Map.tsx
Protected: No
Feature Flag: None

HOOKS USED:
- useMap() → { map } (from @vis.gl/react-google-maps)
- useLanguage() → { language, isRTL }
- useNavigate() → For router navigation

COMPONENTS USED:
- APIProvider (Google Maps)
- Map (Google Maps)
- AdvancedMarker (for each garden)
- GlassCard (info card)
- Button (Open, Refresh)

SUPABASE TABLES:
- gardens → SELECT * (for map markers)
- (hazard_reports if reporting added)

BUTTONS:
- [Marker Click] → Select garden
- [Refresh] → Refetch gardens
- [Open Garden] → Navigate to /garden/:id

ERRORS POSSIBLE:
- Google Maps API key missing → Map fails to load
- Supabase query fails → No markers shown
- formatGardenName() errors → Marker names display raw

================== 🎯 GARDEN DETAILS PAGE (GardenDetails.tsx) ==================

Route: /garden/:id
Component: pages/GardenDetails.tsx
Protected: No (but requires valid :id)
Feature Flag: None

HOOKS USED:
- useParams() → { id }
- useNavigate() → For routing
- useLanguage() → { t, isRTL }
- (useCheckIn potentially in future)

COMPONENTS USED:
- GlassCard (x multiple)
- Dialog (Check-in form)
- Avatar (for active visitors)
- PeakHoursChart (bar chart)
- Checkbox (dog selection)
- Button (Check-in, Share, Report)

SUPABASE TABLES:
- gardens → SELECT * WHERE id = :id
- active_garden_visitors → SELECT * WHERE garden_id = :id
- dogs → SELECT * WHERE owner_id = current_user.id
- check_ins (if viewing history)

STATE MANAGED:
- garden → { name, location, lat, lng, amenities }
- activeVisitors → { user, dog, timestamp, status }
- selectedDogs → string[] (dog IDs)
- checkInStatus → "arrived" | "on_way"
- loading, error

BUTTONS:
- [Back] → Go back
- [Check-In] → Open dialog
- [Dog Dropdown] → Select dog
- [Confirm Check-In] → Submit mutation
- [Share] → Share location
- [Report] → Report hazard

ERRORS POSSIBLE:
- Garden :id not found → Show 404 or empty state
- activeVisitors query fails → Show empty visitors list
- User not logged in but has no dogs → Show "Add dog first" message
- Check-in mutation fails → Show error toast

================== 👤 PROFILE PAGE (Profile.tsx) ==================

Route: /profile
Component: pages/Profile.tsx
Protected: ✅ Yes (ProtectedRoute wrapper)
Feature Flag: VITE_ENABLE_DOG_SHARE_ROUTE (for shared dogs section)

HOOKS USED:
- useNavigate() → For routing
- useAuth() → { user } (to redirect if not logged in)

COMPONENTS USED:
- Avatar (with upload)
- Dialog (Add/Edit dog, Share dog)
- Input (name, breed, etc.)
- Select (gender, size dropdowns)
- Card (dog cards)
- Button (Add, Edit, Delete, Share)

SUPABASE TABLES:
- profiles → SELECT * WHERE user_id = current_user.id
- dogs → SELECT * WHERE owner_id = current_user.id
- dog_shares → SELECT * (if flag enabled)
- auth.users → Current user info

STATE MANAGED:
- profile → { display_name, avatar_url, ... }
- dogs → Array of dog objects
- newDog → { name, breed, gender, size }
- selectedDogForShare → dog object
- shareLink → string (URL)

BUTTONS:
- [Upload Avatar] → File picker
- [Add Dog] → Open add-dog dialog
- [Edit Dog] → Open edit dialog with prefilled data
- [Delete Dog] → Confirm + delete
- [Share Dog] → Open share dialog
- [Copy Link] → Copy to clipboard
- [Logout] → Sign out (in sidebar)

ERRORS POSSIBLE:
- User not logged in → Redirect to /auth
- profiles table empty → First-time user, create profile
- dogs table query fails → Show empty list
- Avatar upload fails → Show error toast
- Dog delete fails → Show error toast

================== ⚙️ SETTINGS PAGE (Settings.tsx) ==================

Route: /settings
Component: pages/Settings.tsx
Protected: ✅ Yes (ProtectedRoute wrapper)
Feature Flag: None

HOOKS USED:
- useNavigate()
- useAuth() (implied, for user ID)

COMPONENTS USED:
- Input (display_name, phone)
- Button (Save)
- Card (form container)

SUPABASE TABLES:
- profiles → SELECT & UPDATE WHERE user_id = current_user.id

STATE MANAGED:
- profile → { display_name, phone, ... }
- formData → { display_name, phone }
- loading, saving

BUTTONS:
- [Save] → Update profile mutation

ERRORS POSSIBLE:
- User not logged in → Redirect to /auth
- profiles record doesn't exist → Upsert creates new
- Update mutation fails → Show error toast

================== 🔐 AUTH PAGE (Auth.tsx) ==================

Route: /auth
Component: pages/Auth.tsx
Protected: No
Feature Flag: None

HOOKS USED:
- useLanguage() → { t, isRTL }
- useAuth() → { user, loading }
- useNavigate()
- useSearchParams() → For next URL
- Capacitor.isNativePlatform() → Check if mobile

COMPONENTS USED:
- GlassCard
- Input (email, password, name)
- Button (Login, Signup, Google)
- BrandLogo

SUPABASE FUNCTIONS CALLED:
- supabase.auth.signInWithPassword({ email, password })
- supabase.auth.signUp({ email, password, ... })
- supabase.auth.signInWithOAuth({ provider: "google" })
- supabase.auth.resetPasswordForEmail(email)

STATE MANAGED:
- isLogin → boolean (toggle tab)
- email, password, name → form inputs
- loading → boolean (request in progress)
- forgotPassword → boolean (mode toggle)

BUTTONS:
- [Log In] → signInWithPassword()
- [Sign Up] → signUp()
- [Google OAuth] → signInWithOAuth()
- [Send Reset Link] → resetPasswordForEmail()
- [Tab Toggle] → Switch between modes

ERRORS POSSIBLE:
- Invalid email format → Show error toast
- Password too weak → Show error toast
- User already exists → Show error toast
- OAuth callback fails → Show error toast
- Already logged in → Redirect to saved next URL or /

================== 🏡 GARDEN DETAILS (GardenDetails.tsx) ==================

Already mapped above (same as /garden/:id)

================== 💾 ADMIN: IMPORT (AdminImport.tsx) ==================

Route: /admin/import
Component: pages/AdminImport.tsx
Protected: ✅ Yes (DeveloperRoute wrapper)
Feature Flag: ✅ VITE_ENABLE_ADMIN_ROUTES

HOOKS USED:
- useMapsLibrary() → { PlacesService }
- useAuth() → { user }
- useDeveloperAccess() → { isDeveloper } (or denied by DeveloperRoute)
- useNavigate()

COMPONENTS USED:
- APIProvider (Google Maps)
- Tabs (Dog Gardens / Protected Spaces)
- Button (Scan & Import, Refresh, Clear)
- Progress indicators
- Results table

SUPABASE FUNCTIONS CALLED:
- supabase.from("gardens").upsert(records, { onConflict: "google_place_id" })
- supabase.from("protected_spaces").upsert(records, { onConflict: "google_place_id" })

EXTERNAL API:
- Google Places API → Search & Get Place Details

STATE MANAGED:
- importMode → "dog_gardens" | "protected_spaces"
- scanning → boolean
- results → Array of ImportRecord
- error → string | null

BUTTONS:
- [Scan & Import] → Start scan + import
- [Clear Results] → Reset results
- [Refresh] → Re-scan

ERRORS POSSIBLE:
- User not authenticated → Redirect to /auth
- User not admin → Deny access (deny-by-default)
- Google API key missing → API calls fail
- Supabase upsert fails → Results show errors
- Network error → Show error message

================== 📋 ADMIN: GARDENS (AdminGardens.tsx) ==================

Route: /admin/gardens
Component: pages/AdminGardens.tsx
Protected: ✅ Yes (DeveloperRoute wrapper)
Feature Flag: ✅ VITE_ENABLE_ADMIN_ROUTES

HOOKS USED:
- useNavigate()
- useDeveloperAccess() (via DeveloperRoute)

COMPONENTS USED:
- Card (garden cards)
- Button (Approve, Reject)
- Icon (ShieldCheck)

SUPABASE FUNCTIONS CALLED:
- supabase.from("gardens").select(...).neq("status", "approved")
- supabase.from("gardens").update({ status: "approved" }).eq("id", gardenId)

STATE MANAGED:
- gardens → Array of pending gardens
- loading → boolean
- processingId → string | null

BUTTONS:
- [Approve] → Update status to "approved"
- [Reject] → Delete or mark rejected
- [Back to Map] → Navigate to /map

ERRORS POSSIBLE:
- User not admin → Deny access
- Query fails → Show error toast
- Update fails → Show error toast
- No pending gardens → Show empty state

================== 🐕 DOG SHARE ACCEPT (DogShareAccept.tsx) ==================

Route: /dog-share/accept
Component: pages/DogShareAccept.tsx
Protected: No (but requires :id param)
Feature Flag: ✅ VITE_ENABLE_DOG_SHARE_ROUTE

HOOKS USED:
- useSearchParams() → Get :id
- useAuth() → { user }
- useNavigate()

COMPONENTS USED:
- Card (dog profile)
- Button (Accept, Decline, View)
- Avatar

SUPABASE TABLES:
- dog_shares → SELECT WHERE token = :id
- dogs → SELECT * WHERE id = share.dog_id
- profiles → SELECT for dog owner info

STATE MANAGED:
- invitation → dog_share object
- accepting → boolean
- error → string | null

BUTTONS:
- [Accept] → Accept share + update DB
- [Decline] → Reject invitation
- [View Dog] → View dog profile

ERRORS POSSIBLE:
- Invalid :id → Show 404 or error
- Invitation expired → Show message
- Accept fails → Show error toast
- Not logged in → Redirect to /auth

================== 🔙 OTHER PAGES ==================

AUTH CALLBACK: /auth/callback (AuthCallback.tsx)
- Auto-processes OAuth redirect
- No manual buttons
- Calls setSession() + redirects to /

RESET PASSWORD: /reset-password (ResetPassword.tsx)
- Form for password reset token (from email)
- [Reset] button → Confirm new password

PRIVACY: /privacy (Privacy.tsx)
- Static legal page
- No data queries
- No buttons (except maybe back link)

TERMS: /terms (Terms.tsx)
- Static legal page
- No data queries
- No buttons (except maybe back link)

NOT FOUND: /*  (NotFound.tsx)
- 404 fallback route
- [Back Home] button → Navigate to /

================== 🔗 GLOBAL DEPENDENCIES ==================

All pages use:
- LanguageContext → useLanguage()
- ThemeProvider → For dark/light mode
- React Router → useNavigate(), useParams()
- React Query (QueryClientProvider)
- Sonner → toast() notifications
- Supabase client → import from integrations/supabase/client

Navigation:
- BottomNav.tsx → Links on all pages
- GlassSidebar.tsx → Menu drawer on all pages
- ProtectedRoute.tsx → Guards protected pages
- DeveloperRoute.tsx → Guards admin pages

================== 🚨 DEBUGGING CHECKLIST ==================

If a page breaks:
☐ Check if all required HOOKS are called
☐ Verify Supabase tables are accessible
☐ Check .env file for API keys  
☐ Test in console if external APIs work (Google Maps, Supabase)
☐ Verify ProtectedRoute/DeveloperRoute wrappers in App.tsx
☐ Check feature flags (VITE_ENABLE_*)
☐ Test language switching (useLanguage hook)
☐ Check loading + error states
☐ Test with mock data if API fails
☐ Verify button click handlers fire
☐ Check navigation paths are correct
☐ Test deep-linking if mobile

