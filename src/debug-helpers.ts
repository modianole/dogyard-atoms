/**
 * Browser Console Debugging Helpers
 *
 * Copy & paste these functions into DevTools console for quick testing
 *
 * Usage:
 * - Copy a function from this file
 * - Paste into DevTools console while dev server is running
 * - Call the function: debugAuth(), debugGardens(), etc.
 */

// ============================================================
// 🔐 AUTH DEBUGGING
// ============================================================

window.debugAuth = async function() {
  console.group("🔐 AUTH DEBUG");

  try {
    // Get current session
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    console.log("Current Session:", session);
    if (sessionError) console.error("Session Error:", sessionError);

    // Get current user
    const { data: user, error: userError } = await supabase.auth.getUser();
    console.log("Current User:", user);
    if (userError) console.error("User Error:", userError);

    // Check localStorage
    const storageKeys = Object.keys(localStorage).filter(k => k.includes("sb-") || k.includes("auth"));
    console.log("Auth Storage Keys:", storageKeys);
    storageKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`  ${key}:`, value?.substring(0, 50) + (value?.length > 50 ? "..." : ""));
    });

    // Check admin config
    console.log("Admin Config:", {
      ADMIN_USER_ID: import.meta.env.VITE_ADMIN_USER_ID || "not set",
      ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL || "not set",
    });

  } catch (err) {
    console.error("Error:", err);
  }

  console.groupEnd();
};

window.debugAuthListener = function() {
  console.group("🔐 AUTH STATE LISTENER");
  const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
    console.log(`[${new Date().toLocaleTimeString()}] Auth Event: ${event}`, session?.user?.email);
  });
  console.log("Listener active. Watch for auth changes...");
  console.groupEnd();
  return () => {
    subscription?.unsubscribe();
    console.log("Listener stopped");
  };
};

window.debugLogout = async function() {
  console.log("🚪 Logging out...");
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Logout error:", error);
  else console.log("✓ Logged out");
};

// ============================================================
// 🗺️ GARDEN DATA DEBUGGING
// ============================================================

window.debugGardens = async function() {
  console.group("🗺️ GARDEN DATA DEBUG");

  try {
    // Fetch all gardens
    const { data, error } = await supabase.from("gardens").select("*");
    if (error) {
      console.error("Query Error:", error);
    } else {
      console.log(`Total Gardens: ${data.length}`);
      console.log("Sample Gardens (first 3):", data.slice(0, 3));

      // Summary stats
      const statuses = {};
      data.forEach(g => {
        statuses[g.status || "unknown"] = (statuses[g.status || "unknown"] || 0) + 1;
      });
      console.log("Status Breakdown:", statuses);
    }

  } catch (err) {
    console.error("Error:", err);
  }

  console.groupEnd();
};

window.debugNearbyGardens = async function(lat = 32.073, lng = 34.778, radius = 5000) {
  console.group("📍 NEARBY GARDENS DEBUG");

  try {
    const { data, error } = await supabase.rpc("get_nearby_gardens", {
      user_lat: lat,
      user_lng: lng,
      radius_meters: radius,
    });

    if (error) {
      console.error("RPC Error:", error);
    } else {
      console.log(`Found ${data.length} gardens within ${radius}m of (${lat}, ${lng})`);
      console.log("Nearby Gardens:", data.slice(0, 5));
    }

  } catch (err) {
    console.error("Error:", err);
  }

  console.groupEnd();
};

window.debugProtectedSpaces = async function() {
  console.group("🛡️ PROTECTED SPACES DEBUG");

  try {
    const { data, error } = await supabase.from("protected_spaces").select("*");
    if (error) {
      console.error("Query Error:", error);
    } else {
      console.log(`Total Protected Spaces: ${data.length}`);

      const typeBreakdown = {};
      data.forEach(p => {
        typeBreakdown[p.type || "unknown"] = (typeBreakdown[p.type || "unknown"] || 0) + 1;
      });
      console.log("Type Breakdown:", typeBreakdown);
      console.log("Sample Spaces:", data.slice(0, 3));
    }

  } catch (err) {
    console.error("Error:", err);
  }

  console.groupEnd();
};

// ============================================================
// 🌐 ENVIRONMENT & ROUTING DEBUGGING
// ============================================================

window.debugEnv = function() {
  console.group("🌐 ENVIRONMENT DEBUG");

  console.log("Build Environment:", {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? "✓ set" : "✗ missing",
    ENABLE_ADMIN_ROUTES: import.meta.env.VITE_ENABLE_ADMIN_ROUTES === "true",
    ENABLE_DOG_SHARE_ROUTE: import.meta.env.VITE_ENABLE_DOG_SHARE_ROUTE === "true",
    ADMIN_USER_ID: import.meta.env.VITE_ADMIN_USER_ID || "not set",
    ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL || "not set",
  });

  console.log("Current Location:", {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  });

  console.log("Language Setting:", localStorage.getItem("language") || "default (Hebrew)");

  console.groupEnd();
};

window.debugRouting = function() {
  console.group("🛣️ ROUTING DEBUG");

  const routes = {
    "public": ["/", "/map", "/garden/:id", "/auth", "/reset-password", "/privacy", "/terms"],
    "protected": ["/profile", "/settings"],
    "admin (flagged)": ["/admin/import", "/admin/gardens"],
    "dog-share (flagged)": ["/dog-share/accept"],
  };

  console.table(routes);

  const adminEnabled = import.meta.env.VITE_ENABLE_ADMIN_ROUTES === "true";
  const dogShareEnabled = import.meta.env.VITE_ENABLE_DOG_SHARE_ROUTE === "true";

  console.log("Feature Flags:", {
    "Admin Routes Enabled": adminEnabled ? "✓ YES" : "✗ NO",
    "Dog Share Route Enabled": dogShareEnabled ? "✓ YES" : "✗ NO",
  });

  console.log("Current Route:", window.location.pathname);

  console.groupEnd();
};

// ============================================================
// 📊 REACT QUERY DEBUGGING
// ============================================================

window.debugReactQuery = function() {
  console.group("📊 REACT QUERY DEBUG");

  // Enable query logging
  sessionStorage.setItem("debug", "react-query");

  console.log("React Query Debug Enabled");
  console.log("Open DevTools → Application → Session Storage to see queries");

  console.log(`
To see detailed query info:
1. Look for 'react-query-*' keys in Session Storage
2. Or install React Query DevTools browser extension
3. Check Network tab for /postgrest/* requests
  `);

  console.groupEnd();
};

// ============================================================
// 🧪 AUTOMATED TESTS
// ============================================================

window.runDiagnostics = async function() {
  console.group("🧪 FULL DIAGNOSTIC SUITE");

  const results = {
    passed: [],
    failed: [],
  };

  // Test 1: Supabase Connection
  try {
    const { data } = await supabase.from("gardens").select("count()", { count: "exact" });
    results.passed.push("✓ Supabase connection OK");
  } catch (err) {
    results.failed.push(`✗ Supabase connection failed: ${err.message}`);
  }

  // Test 2: Auth Session
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      results.passed.push("✓ Auth session exists");
    } else {
      results.failed.push("⚠ No active auth session (expected for unauthenticated users)");
    }
  } catch (err) {
    results.failed.push(`✗ Auth session check failed: ${err.message}`);
  }

  // Test 3: RLS Policy Check
  try {
    const { data, error } = await supabase.from("gardens").select("*").limit(1);
    if (!error) {
      results.passed.push("✓ Read access to gardens table OK");
    } else {
      results.failed.push(`✗ Read access denied: ${error.message}`);
    }
  } catch (err) {
    results.failed.push(`✗ RLS check failed: ${err.message}`);
  }

  // Test 4: Environment Variables
  const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
  const hasKey = !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (hasUrl && hasKey) {
    results.passed.push("✓ Environment variables set");
  } else {
    results.failed.push("✗ Missing environment variables");
  }

  // Summary
  console.log("\n📋 DIAGNOSTIC RESULTS\n");
  console.log(`✓ Passed: ${results.passed.length}`);
  results.passed.forEach(r => console.log(`  ${r}`));

  if (results.failed.length > 0) {
    console.log(`\n✗ Failed: ${results.failed.length}`);
    results.failed.forEach(r => console.log(`  ${r}`));
  } else {
    console.log("\n🎉 All tests passed!");
  }

  console.groupEnd();
  return results;
};

// ============================================================
// 💡 HELP & SHORTCUTS
// ============================================================

window.debugHelp = function() {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║      DOGYARD FRONTEND DEBUGGING HELPERS              ║
╚═══════════════════════════════════════════════════════╝

🔐 AUTH
  debugAuth()              - Check current session & user
  debugAuthListener()      - Watch for auth state changes
  debugLogout()            - Sign out current user

🗺️ GARDEN DATA
  debugGardens()           - Fetch all gardens
  debugNearbyGardens()     - Find gardens near location
  debugProtectedSpaces()   - Check protected spaces

🌐 CONFIG
  debugEnv()               - Check environment variables
  debugRouting()           - View app routes & feature flags

📊 TOOLS
  debugReactQuery()        - Enable React Query logging
  runDiagnostics()         - Run full diagnostic suite

💡 HELP
  debugHelp()              - Show this message

EXAMPLE USAGE:
  > debugAuth()
  > debugGardens()
  > await runDiagnostics()

  `);
};

// Print help on load
console.log("%c🐾 DogYard Frontend Debugging Ready", "font-size: 16px; font-weight: bold; color: #00AA00");
console.log("%cType debugHelp() for available commands", "color: #0088FF; font-style: italic");

// Auto-run if in development
if (import.meta.env.DEV) {
  console.log("%c[DEV MODE] Debugging helpers loaded", "color: #FF8800");
}

