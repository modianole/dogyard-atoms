# 🐛 Frontend Debugging Guide - DogYard

## Quick Start

### 1. Start Dev Server
```bash
$env:VITE_DEV_HOST="127.0.0.1"
$env:VITE_DEV_PORT="8080"
npm run dev
```

**Open in browser:** `http://localhost:8080`

---

## 🔧 Debugging Tools & Commands

### Type Checking
```bash
# Check TypeScript errors (strict checks disabled, but still validate)
npx tsc --noEmit
```

### Linting
```bash
# Check ESLint (unused vars are allowed, but lint patterns)
npx eslint src/ --ext .ts,.tsx
```

### Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Route Validation
```bash
# Verify route matrix matches App.tsx
npm run qa:routes
```

### Build Check
```bash
# Production build validation
npm run build

# Check bundle size
npm run build -- --stats
```

---

## 🎯 Common Frontend Issues & Fixes

### Issue 1: Auth Flow Broken
**Symptoms:** User cannot login, or stuck in loading state

**Debug Steps:**
1. Open DevTools → **Application** tab
2. Check `localStorage`:
   - Look for `sb-*` keys (Supabase session)
   - Look for `auth:next` key (post-login redirect)
3. Check **Network** tab:
   - Verify Supabase URL is correct (`VITE_SUPABASE_URL`)
   - Verify auth requests to `https://<project>.supabase.co/auth/v1/...`

**File to check:** `src/hooks/useAuth.ts`, `src/integrations/supabase/client.ts`

---

### Issue 2: Admin Routes Not Loading
**Symptoms:** `/admin/import` or `/admin/gardens` shows "Access Denied"

**Debug Steps:**
1. Check **Environment Variables**:
   - `VITE_ENABLE_ADMIN_ROUTES=true` (for route to exist)
   - `VITE_ADMIN_USER_ID` or `VITE_ADMIN_EMAIL` (for access control)
2. Check **Console** for auth/developer access logs
3. Verify user email matches configured admin email:
   ```javascript
   // In DevTools console:
   const { data } = await supabase.auth.getUser();
   console.log(data.user?.email);
   ```

**Files to check:** `src/hooks/useDeveloperAccess.ts`, `src/components/DeveloperRoute.tsx`

---

### Issue 3: Maps Not Showing / Google Places Errors
**Symptoms:** Map is blank, or admin import scan fails

**Debug Steps:**
1. Check **Network** tab for Google Maps API calls:
   - Verify `VITE_GOOGLE_MAPS_API_KEY` is set
   - Look for `googleapis.com` requests
2. Check **Console** for CORS errors
3. Verify API key quota in Google Cloud Console

**Files to check:** `src/pages/AdminImport.tsx`

---

### Issue 4: RTL/Language Toggle Issues
**Symptoms:** Text direction flips unexpectedly, language doesn't toggle

**Debug Steps:**
1. Check `localStorage` for `language` key
2. Verify `src/context/LanguageContext.tsx` is properly initialized
3. Check CSS direction: Open DevTools → Elements → check `dir` attribute on `<html>` or parent divs

**Files to check:** `src/context/LanguageContext.tsx`, `src/components/GlassSidebar.tsx`

---

### Issue 5: Garden Data Not Loading
**Symptoms:** Map shows no markers, or list is empty

**Debug Steps:**
1. Open **Network** tab and look for Supabase queries:
   - `postgrest/rest/v1/gardens`
   - `postgrest/rest/v1/nearby_gardens`
2. Check **Console** for React Query errors:
   ```javascript
   // DevTools console:
   sessionStorage.setItem("debug", "react-query")
   ```
3. Verify Supabase RLS policies allow `SELECT`:
   ```sql
   -- In Supabase SQL Editor:
   SELECT * FROM public.gardens LIMIT 1;
   ```

**Files to check:** `src/hooks/useGardens.ts`, `src/pages/Map.tsx`

---

## 📊 DevTools Tips

### Browser DevTools Console Helpers

```javascript
// ========== Authentication ==========
// Check current session
const { data } = await supabase.auth.getSession();
console.log("Current Session:", data);

// Check current user
const { data: user } = await supabase.auth.getUser();
console.log("Current User:", user);

// ========== Garden Data ==========
// Fetch gardens directly
const { data, error } = await supabase.from("gardens").select("*").limit(5);
console.log("Gardens:", data, error);

// ========== React Query ==========
// Enable React Query DevTools logging
sessionStorage.setItem("debug", "react-query");

// ========== Admin Access ==========
// Check admin config
console.log("Admin User ID:", import.meta.env.VITE_ADMIN_USER_ID);
console.log("Admin Email:", import.meta.env.VITE_ADMIN_EMAIL);

// ========== Feature Flags ==========
console.log("Admin Routes Enabled:", import.meta.env.VITE_ENABLE_ADMIN_ROUTES);
console.log("Dog Share Enabled:", import.meta.env.VITE_ENABLE_DOG_SHARE_ROUTE);
```

---

## 🚨 Critical Issues Checklist

- [ ] **Supabase Credentials Missing**
  - Error: Cannot find module or blank page
  - Fix: Verify `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

- [ ] **Google Maps API Key Missing**
  - Error: Admin import shows warning banner
  - Fix: Set `VITE_GOOGLE_MAPS_API_KEY` in `.env`

- [ ] **Auth Not Persisting**
  - Error: Logged in but page refresh logs out
  - Fix: Check `localStorage` and Supabase auth config in `src/integrations/supabase/client.ts`

- [ ] **Admin Routes Not Gated**
  - Error: Anyone can access `/admin/import`
  - Fix: Set `VITE_ENABLE_ADMIN_ROUTES=true` AND `VITE_ADMIN_USER_ID` or `VITE_ADMIN_EMAIL`

- [ ] **Build Fails**
  - Error: `npm run build` errors
  - Fix: Check TypeScript types and ensure no strict mode violations

---

## 📝 Debugging Workflow

### 1. **Identify Issue**
   - Reproduce in dev server (`npm run dev`)
   - Check browser DevTools (Console, Network, Application)

### 2. **Narrow Scope**
   - Is it a data problem? (Check Supabase queries)
   - Is it auth? (Check `useAuth` and session)
   - Is it UI? (Check CSS and component state)
   - Is it routing? (Check `App.tsx` route definitions)

### 3. **Add Logging**
   ```typescript
   // In component
   console.log("🔍 <ComponentName> rendered", { prop1, prop2 });
   console.log("📊 Data:", data);
   console.error("❌ Error:", error);
   ```

### 4. **Test in Isolation**
   - Create a test file in `src/` to reproduce issue
   - Use `npm test -- src/test.tsx` to run it

### 5. **Verify Fix**
   - Run `npm run build` to ensure production works
   - Run `npm run qa:routes` to verify routing
   - Check all related tests pass

---

## 🔗 Key Files for Debugging

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main routing, feature flags, deep-link auth |
| `src/hooks/useAuth.ts` | Auth state and session management |
| `src/hooks/useGardens.ts` | Garden data fetching and normalization |
| `src/integrations/supabase/client.ts` | Supabase client initialization |
| `src/components/ProtectedRoute.tsx` | Auth guard for protected pages |
| `src/components/DeveloperRoute.tsx` | Admin access control |
| `src/pages/AdminImport.tsx` | Google Places scanning and import |
| `src/pages/AdminGardens.tsx` | Garden moderation |
| `src/context/LanguageContext.tsx` | Bilingual/RTL support |

---

## 🎓 Frontend Architecture Overview

```
Request Flow:
  Browser → src/main.tsx (entry)
         → src/App.tsx (providers, routing)
         → src/pages/* (page components)
         → src/hooks/* (data & auth)
         → src/integrations/supabase/client.ts (Supabase calls)
         → supabase (backend)

Auth Flow:
  /auth page → OAuth redirect to Supabase
           → /auth/callback or deep-link appUrlOpen
           → setSession() in App.tsx
           → useAuth() observes session change
           → ProtectedRoute allows access

Admin Flow:
  App.tsx checks VITE_ENABLE_ADMIN_ROUTES
  → If true, /admin/import and /admin/gardens routes exist
  → DeveloperRoute checks useDeveloperAccess()
  → If admin email/ID matches, allowed; else "Access Denied"
  → AdminImport scans Google Places, upserts to DB
  → AdminGardens shows pending gardens for approval
```

---

## 📞 Quick Commands Reference

```bash
# Development
npm run dev                 # Start dev server
npm test                    # Run tests
npm run test:watch         # Watch mode

# Quality & Build
npm run qa:routes          # Verify routing
npm run build              # Production build
npm run lint               # Check linting (if available)

# Debugging Helpers
npm run verify:android:firebase  # Check Firebase config
```

---

**Last Updated:** April 25, 2026
**Project:** dogyard-atoms (Vite + React + Capacitor + Supabase)

