import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const appFilePath = path.join(rootDir, "src", "App.tsx");
const matrixPath = path.join(rootDir, "scripts", "qa-launch-routes.matrix.json");

const failures = [];
const passes = [];

const assertRule = (ok, successText, failureText) => {
  if (ok) {
    passes.push(successText);
  } else {
    failures.push(failureText);
  }
};

if (!fs.existsSync(appFilePath)) {
  console.error(`ERROR: Missing file: ${appFilePath}`);
  process.exit(1);
}

if (!fs.existsSync(matrixPath)) {
  console.error(`ERROR: Missing file: ${matrixPath}`);
  process.exit(1);
}

const appCode = fs.readFileSync(appFilePath, "utf8");
const matrix = JSON.parse(fs.readFileSync(matrixPath, "utf8"));

for (const routePath of matrix.requiredPublicRoutes) {
  const expected = `<Route path="${routePath}"`;
  assertRule(
    appCode.includes(expected),
    `PASS public route present: ${routePath}`,
    `FAIL missing public route: ${routePath}`,
  );
}

for (const routePath of matrix.requiredProtectedRoutes) {
  const pathToken = `<Route path="${routePath}"`;
  assertRule(
    appCode.includes(pathToken),
    `PASS protected route present: ${routePath}`,
    `FAIL missing protected route: ${routePath}`,
  );
}

assertRule(
  appCode.includes('<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />'),
  "PASS /profile is wrapped by ProtectedRoute",
  "FAIL /profile must be wrapped by ProtectedRoute",
);

assertRule(
  appCode.includes('<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />'),
  "PASS /settings is wrapped by ProtectedRoute",
  "FAIL /settings must be wrapped by ProtectedRoute",
);

for (const [flagName, routes] of Object.entries(matrix.flaggedRoutes)) {
  const flagToken = flagName === "VITE_ENABLE_ADMIN_ROUTES"
    ? "ENABLE_ADMIN_ROUTES"
    : "ENABLE_DOG_SHARE_ROUTE";

  for (const routePath of routes) {
    const expectedToken = `{${flagToken} ? <Route path="${routePath}"`;
    assertRule(
      appCode.includes(expectedToken),
      `PASS flagged route is gated by ${flagName}: ${routePath}`,
      `FAIL flagged route is not gated by ${flagName}: ${routePath}`,
    );
  }
}

const fallbackToken = `<Route path="${matrix.requiredFallbackRoute}" element={<NotFound />} />`;
assertRule(
  appCode.includes(fallbackToken),
  "PASS fallback route to NotFound exists",
  "FAIL missing fallback route to NotFound",
);

for (const passMessage of passes) {
  console.log(passMessage);
}

if (failures.length > 0) {
  for (const failureMessage of failures) {
    console.error(failureMessage);
  }
  process.exit(1);
}

console.log(`OK: launch route matrix verified (${passes.length} checks).`);

