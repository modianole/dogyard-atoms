🎯 FEATURES MATRIX - DogYard App

FEATURE | PAGES | BUTTONS | API CALLS | STATE MANAGED BY
---|---|---|---|---
Authentication | Auth, AuthCallback | Login, SignUp, Google, Reset Password | supabase.auth | useAuth() hook
Language Toggle | All pages | Language button (EN/עב) | None (localStorage) | LanguageContext
Dark/Light Theme | All pages | (implicit) | None (localStorage) | ThemeProvider
Navigation | All pages | Menu, Logo, Links, BottomNav | None | React Router
Garden Discovery | Index, Map | Click map markers, garden cards | GET /gardens | useGardens()
Garden Details | GardenDetails | View details, amenities | GET /gardens/:id | Supabase
Check-in System | GardenDetails | Check-In button, Dog select | INSERT /check_ins | useCheckIn() mutation
Active Visitors | GardenDetails | View avatars + names | GET /active_garden_visitors | Supabase select
Peak Hours Chart | Index, GardenDetails | (display only) | GET /peak_hours analytics | usePeakHours()
User Profile | Profile | View/Edit avatar, name, phone | GET/UPDATE /profiles | Profile state
Dog Management | Profile | Add, Edit, Delete dogs | GET/INSERT/UPDATE/DELETE /dogs | Dogs state
Dog Sharing | Profile | Share, Copy link, View role | INSERT/UPDATE /dog_shares | Shared dogs state
Hazard Reporting | GardenDetails, Map | Report button, submit form | INSERT /hazard_reports | HazardReport dialog
Shelter Navigation | BottomNav | Shelter (red) button | GPS + nav to nearest shelter | useNearestShalter()
Settings | Settings | Save display name + phone | UPDATE /profiles | Settings form state
Admin Import | AdminImport | Scan & Import button | Google Places API → Supabase | AdminImport state
Admin Approval | AdminGardens | Approve, Reject buttons | UPDATE /gardens.status | AdminGardens state
Protected Spaces | AdminImport | (part of import) | Google Places → Supabase | Import results
Deep Link Auth | Auth flow | (automatic) | setSession() on URI | Capacitor listener
Protected Routes | Profile, Settings | (automatic guard) | None | ProtectedRoute HOC
Admin Routes | Admin pages | (automatic guard) | None | DeveloperRoute HOC
Feature Flags | Admin pages | (conditional render) | None (env vars) | isFeatureEnabled()
RTL Support | All pages | (automatic) | None (dir attribute) | isRTL logic
Mobile Responsive | All pages | Buttons, grids adjust | None | Tailwind breakpoints
Offline Support | (not implemented) | N/A | N/A | Future
Real-time Updates | GardenDetails | (polling) | Polling via React Query | usePeakHours polling
Pagination | Lists | (not implemented) | N/A | Future
Search/Filter | Map, Lists | (basic filtering) | GET query params | Map state
Notifications | All pages | (Toast notifications) | sonner library | toast() calls
Data Export | (not implemented) | N/A | N/A | Future
User Preferences | Settings | Save settings | UPDATE /profiles | Form state
Email Verification | Auth | Magic link, password reset | Firebase/Supabase | Auth email
OAuth Integration | Auth | Google button | Google OAuth provider | Supabase OAuth
Deep Linking | Mobile | Capacitor URL handler | appUrlOpen event | CapacitorApp listener
Firebase Analytics | All pages | (passive tracking) | Firebase SDK | Auto tracked
Firebase Crashlytics | All pages | (error trapping) | Firebase SDK | Auto tracked

