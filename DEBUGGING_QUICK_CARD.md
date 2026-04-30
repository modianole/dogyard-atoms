# 🐾 Frontend Debugging Quick Reference Card

## 🚀 START HERE

```bash
# Terminal 1: Start dev server
npm run dev
# → Opens localhost:8080

# Terminal 2: Run tests in watch mode (optional)
npm run test:watch

# Terminal 3: Check types continuously (optional)
npx tsc --noEmit --watch
```

**URL:** http://localhost:8080

---

## 🧬 Browser Console Helpers (Auto-loaded in Dev)

> **Copy and paste into DevTools console while running `npm run dev`**

### Quick Commands

```javascript
// Help & Overview
debugHelp()               // Print all available commands

// 🔐 Authentication
debugAuth()               // Check current session & user
debugLogout()             // Sign out

// 🗺️ Garden Data  
debugGardens()            // Fetch all gardens
debugNearbyGardens(32.073, 34.778, 5000)  // Get gardens near coordinates

// 🛡️ Protected Spaces
debugProtectedSpaces()    // Check all protected spaces

// 🌐 Configuration
debugEnv()                // Show environment variables
debugRouting()            // Show all routes & feature flags

// 📊 Testing
debugReactQuery()         // Enable React Query logging
runDiagnostics()          // Full system diagnostic

// 👀 Monitoring
debugAuthListener()       // Watch for auth state changes (calls stop() to end)
```

---

## 🎯 Common Debugging Scenarios

### Scenario 1: "User can't login"

```javascript
// Check in console:
debugAuth()

// Then check:
// 1. Is VITE_SUPABASE_URL correct?
// 2. Does session have access_token?
// 3. Check Network tab for /auth/v1/token errors
```

**Fix checklist:**
- ✅ `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- ✅ Verify Supabase project is active
- ✅ Check browser cookies aren't blocked

---

### Scenario 2: "Admin routes show 'Access Denied'"

```javascript
// Check in console:
debugEnv()  // Look at ADMIN_USER_ID and ADMIN_EMAIL

// Then check:
// 1. Are feature flags enabled?
// 2. Does current user email match config?
```

**Fix checklist:**
- ✅ `VITE_ENABLE_ADMIN_ROUTES=true` in `.env`
- ✅ `VITE_ADMIN_EMAIL` or `VITE_ADMIN_USER_ID` is set
- ✅ Logged-in user email matches exactly
- ✅ If changed, do: `npm run dev` again (picks up new .env)

---

### Scenario 3: "Map is blank / no gardens showing"

```javascript
// Check in console:
debugGardens()         // Fetch all gardens
debugNearbyGardens()   // Get gardens nearby

// Then check:
// 1. Network tab for /postgrest/rest/v1/gardens
// 2. Look for Supabase RLS policy errors
```

**Fix checklist:**
- ✅ Supabase connection working (test in console)
- ✅ Database has gardens data
- ✅ RLS hasn't blocked SELECT access
- ✅ Coordinates (lat/lng) are valid

---

### Scenario 4: "Build fails or TypeScript errors"

```bash
# In terminal:
npm run build             # Full build check

# Or check types only:
npx tsc --noEmit         # TypeScript check

# Or lint:
npx eslint src --ext .ts,.tsx
```

---

## 📱 DevTools Tips

### Application Tab
- **Storage** → LocalStorage
  - `sb-*` keys = Supabase auth session
  - `language` = Current language setting
  - Look for corruption/old data

### Network Tab
- Filter by `supabase` or `postgrest`
- Check response status (200 = good, 401/403 = auth/RLS issue)
- Look for `CORS` errors

### Console Tab
- Paste `debugHelp()` for quick commands
- Look for errors starting with `[vite]` or from libraries
- Filter: `console.log` often has useful context

### Performance Tab
- Record a session
- Check what's slow (often data fetching)
- Look for memory leaks in React components

---

## 🧪 Running Tests

```bash
# Run tests once
npm test

# Watch mode (re-runs on file change)
npm run test:watch

# With coverage report  
npm test -- --coverage

# Single test file
npm test src/hooks/useAuth
```

---

## 🔄 Development Workflow

### 1. Make a change
```typescript
// src/pages/Map.tsx or any file
```

### 2. Save (auto-reload in browser)
```
[File saved] → Vite rebuilds → Browser HMR (hot update)
```

### 3. Check results
- Open DevTools (F12)
- Run `debugHelp()` to verify state
- Check Network tab for errors

### 4. If broken:
```bash
# Stop dev server (Ctrl+C)
npm run dev              # Restart clean
```

---

## 📋 Environment Variables Checklist

### Required for Build
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

### Required for Google Maps (Admin)
```env
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

### Dev Server (Optional)
```env
VITE_DEV_HOST=127.0.0.1
VITE_DEV_PORT=8080
```

### Feature Gates (Optional)
```env
VITE_ENABLE_ADMIN_ROUTES=false
VITE_ENABLE_DOG_SHARE_ROUTE=false
```

### Admin Access Control (If enabling admin routes)
```env
VITE_ADMIN_USER_ID=5e29...  # OR
VITE_ADMIN_EMAIL=admin@example.com
```

---

## 🛠️ Handy npm Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run tests once |
| `npm run test:watch` | Watch mode tests |
| `npm run qa:routes` | Verify routing matrix |
| `npm run verify:android:firebase` | Check Android Firebase config |

---

## 🐛 Debug Node CLI Tool

```bash
# Check environment setup
node scripts/debug.mjs check-env

# Verify build files exist
node scripts/debug.mjs check-build

# Test auth flow configuration
node scripts/debug.mjs test-auth-flow

# Test garden data queries
node scripts/debug.mjs test-garden-data

# Show help
node scripts/debug.mjs help
```

---

## 📞 Emergency Fixes

### "Everything is broken"
```bash
# Clean reinstall
rm -r node_modules .vite dist
npm install --legacy-peer-deps
npm run build
npm run dev
```

### "Dev server won't start"
```bash
# Clear Vite cache
rm -r node_modules/.vite
npm run dev
```

### "TypeScript errors everywhere"
```bash
# Make sure you have latest types
npm install
npx tsc --noEmit
```

---

## 💡 Pro Tips

1. **Always check `.env`** — Most issues are missing env vars
2. **Look at DevTools Network tab first** — Shows what requests fail
3. **Use `debugHelp()`** — Built-in helpers for all the common checks
4. **Console helpers auto-load** — Just type `debugAuth()` in console
5. **HMR is fast** — Save & check browser instantly, no rebuild needed
6. **Tests are safe** — Run `npm test` to verify changes

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `src/App.tsx` | Routing, auth, providers |
| `src/hooks/useAuth.ts` | Auth state management |
| `src/hooks/useGardens.ts` | Garden data queries |
| `src/pages/AdminImport.tsx` | Google Places scanning |
| `src/integrations/supabase/client.ts` | Supabase initialization |
| `FRONTEND_DEBUGGING_GUIDE.md` | Full debugging guide |

---

**Last Updated:** April 25, 2026  
**Status:** Ready for debugging 🚀

