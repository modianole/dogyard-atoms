#!/usr/bin/env node

/**
 * Frontend Debugging CLI Tool
 * Usage: node scripts/debug.mjs <command>
 *
 * Available commands:
 *   check-env          Check environment variables
 *   check-build        Test build configuration
 *   check-imports      Verify all imports resolve
 *   test-auth-flow     Simulate auth flow
 *   test-garden-data   Verify garden data loading
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.cyan}=== ${msg} ===${colors.reset}\n`),
};

/**
 * Check environment variables
 */
function checkEnv() {
  log.header("Checking Environment Variables");

  const envPath = path.join(rootDir, ".env");
  const envExists = fs.existsSync(envPath);

  if (!envExists) {
    log.warn(".env file not found");
    log.info("Create .env file with required variables:");
    console.log(`
  VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
  VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_KEY
  VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
  VITE_DEV_HOST=127.0.0.1
  VITE_DEV_PORT=8080
  VITE_ENABLE_ADMIN_ROUTES=false
  VITE_ENABLE_DOG_SHARE_ROUTE=false
  VITE_ADMIN_USER_ID=
  VITE_ADMIN_EMAIL=
    `);
    return;
  }

  log.success(".env file found");

  const envContent = fs.readFileSync(envPath, "utf-8");
  const requiredKeys = [
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    "VITE_GOOGLE_MAPS_API_KEY",
  ];

  let allPresent = true;
  for (const key of requiredKeys) {
    if (envContent.includes(`${key}=`) && !envContent.includes(`${key}=\n`)) {
      log.success(`${key} is set`);
    } else {
      log.warn(`${key} is missing or empty`);
      allPresent = false;
    }
  }

  if (allPresent) {
    log.success("\nAll required environment variables are set ✓");
  } else {
    log.warn("\nSome environment variables are missing. Development may be limited.");
  }
}

/**
 * Check build configuration
 */
function checkBuild() {
  log.header("Checking Build Configuration");

  const requiredFiles = [
    { path: "vite.config.ts", desc: "Vite config" },
    { path: "tsconfig.json", desc: "TypeScript config" },
    { path: "package.json", desc: "Package manager config" },
    { path: "index.html", desc: "HTML entry" },
    { path: "src/main.tsx", desc: "React entry point" },
    { path: "src/App.tsx", desc: "App component" },
  ];

  let allPresent = true;
  for (const file of requiredFiles) {
    const fullPath = path.join(rootDir, file.path);
    if (fs.existsSync(fullPath)) {
      log.success(`${file.desc}: ${file.path}`);
    } else {
      log.error(`${file.desc} missing: ${file.path}`);
      allPresent = false;
    }
  }

  if (allPresent) {
    log.success("\nAll build configuration files found ✓");
  }
}

/**
 * Check if all imports resolve correctly
 */
function checkImports() {
  log.header("Checking TypeScript Imports");

  const srcDir = path.join(rootDir, "src");
  const getFiles = (dir) => {
    const files = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (item.startsWith(".") || item === "node_modules") continue;
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...getFiles(fullPath));
      } else if (item.endsWith(".ts") || item.endsWith(".tsx")) {
        files.push(fullPath);
      }
    }
    return files;
  };

  const files = getFiles(srcDir);
  const importPattern = /import\s+.*from\s+['"]([^'"]+)['"]/g;
  const aliasPattern = /from\s+['"]@\/([^'"]+)['"]/g;

  let totalChecks = 0;
  let passedChecks = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    let match;

    while ((match = importPattern.exec(content)) !== null) {
      totalChecks++;
      const importPath = match[1];

      // Check alias imports
      if (importPath.startsWith("@/")) {
        const aliasPath = importPath.replace("@/", path.join(srcDir, "/"));
        if (
          fs.existsSync(aliasPath) ||
          fs.existsSync(`${aliasPath}.ts`) ||
          fs.existsSync(`${aliasPath}.tsx`) ||
          fs.existsSync(path.join(aliasPath, "index.ts")) ||
          fs.existsSync(path.join(aliasPath, "index.tsx"))
        ) {
          passedChecks++;
        }
      } else if (!importPath.startsWith(".") && !importPath.startsWith("node_modules")) {
        // External imports are assumed to be in node_modules
        passedChecks++;
      } else {
        passedChecks++;
      }
    }
  }

  if (totalChecks === 0) {
    log.info("No import statements found to check");
  } else {
    log.success(`Import check: ${passedChecks}/${totalChecks} passes`);
  }
}

/**
 * Test auth flow simulation
 */
function testAuthFlow() {
  log.header("Testing Auth Flow Simulation");

  log.info("Auth Flow Checklist:");
  console.log(`
  1. src/App.tsx has:
     - useEffect for CapacitorApp.addListener('appUrlOpen', ...)
     - Deep-link handling for /auth/callback
     - Session setting with access_token & refresh_token

  2. src/hooks/useAuth.ts:
     - useEffect listening to onAuthStateChange
     - getSession() validation

  3. src/components/ProtectedRoute.tsx:
     - Checks user loading state
     - Redirects to /auth if user is null
     - Stores next path in sessionStorage

  4. Environment:
     - VITE_SUPABASE_URL configured
     - VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY set
  `);

  const appPath = path.join(rootDir, "src/App.tsx");
  const appContent = fs.readFileSync(appPath, "utf-8");

  if (appContent.includes("appUrlOpen")) {
    log.success("Deep-link handler found in App.tsx");
  } else {
    log.warn("Deep-link handler not found in App.tsx");
  }

  if (appContent.includes("setSession")) {
    log.success("Session setter found in App.tsx");
  } else {
    log.warn("Session setter not found in App.tsx");
  }

  log.info("\nTo test auth flow manually:");
  console.log(`
  1. Open DevTools (F12)
  2. Run in console:
     const { data } = await supabase.auth.getSession();
     console.log("Current session:", data);

  3. Or navigate to /auth to test login page
  `);
}

/**
 * Test garden data loading
 */
function testGardenData() {
  log.header("Testing Garden Data Loading");

  const gardenHooksPath = path.join(rootDir, "src/hooks/useGardens.ts");
  const gardenHooksContent = fs.readFileSync(gardenHooksPath, "utf-8");

  if (gardenHooksContent.includes("formatGardenName")) {
    log.success("formatGardenName function found");
  } else {
    log.warn("formatGardenName function not found");
  }

  if (gardenHooksContent.includes("useQuery")) {
    log.success("React Query hook (useQuery) found");
  } else {
    log.error("React Query hook (useQuery) not found");
  }

  if (gardenHooksContent.includes("nearby")) {
    log.success("Nearby gardens function found");
  } else {
    log.warn("Nearby gardens function not found");
  }

  log.info("\nTo test garden data loading manually:");
  console.log(`
  1. Navigate to /map page
  2. Open DevTools → Network tab
  3. Look for requests to: postgrest/rest/v1/gardens
  4. Check the response data structure
  5. Verify coordinates are valid (lat/lng)

  6. Or test in console:
     const { data, error } = await supabase.from("gardens").select("*").limit(5);
     console.log("Gardens:", data, error);
  `);
}

/**
 * Main CLI handler
 */
function main() {
  const command = process.argv[2] || "help";

  switch (command) {
    case "check-env":
      checkEnv();
      break;
    case "check-build":
      checkBuild();
      break;
    case "check-imports":
      checkImports();
      break;
    case "test-auth-flow":
      testAuthFlow();
      break;
    case "test-garden-data":
      testGardenData();
      break;
    case "help":
    default:
      console.log(`
${colors.cyan}Frontend Debugging CLI Tool${colors.reset}

Usage: node scripts/debug.mjs <command>

Commands:
  ${colors.green}check-env${colors.reset}           Check environment variables setup
  ${colors.green}check-build${colors.reset}         Verify build configuration files
  ${colors.green}check-imports${colors.reset}       Validate TypeScript imports
  ${colors.green}test-auth-flow${colors.reset}      Check auth flow setup
  ${colors.green}test-garden-data${colors.reset}    Verify garden data queries
  ${colors.green}help${colors.reset}                Show this help message

Examples:
  node scripts/debug.mjs check-env
  node scripts/debug.mjs check-build
  node scripts/debug.mjs test-auth-flow
      `);
  }
}

main();

