
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const buildGradlePath = path.join(rootDir, "android", "app", "build.gradle");
const googleServicesPath = path.join(rootDir, "android", "app", "google-services.json");

const failures = [];
const notes = [];

const ensureFile = (filePath, label) => {
  if (!fs.existsSync(filePath)) {
    failures.push(`${label} missing: ${filePath}`);
    return false;
  }
  return true;
};

const hasBuildGradle = ensureFile(buildGradlePath, "Android app Gradle config");
const hasGoogleServices = ensureFile(googleServicesPath, "google-services config");

let buildGradle = "";
if (hasBuildGradle) {
  buildGradle = fs.readFileSync(buildGradlePath, "utf8");

  const requiredMarkers = [
    "apply plugin: 'com.google.firebase.crashlytics'",
    "implementation 'com.google.firebase:firebase-crashlytics'",
    "implementation 'com.google.firebase:firebase-analytics'",
    "apply plugin: 'com.google.gms.google-services'",
  ];

  for (const marker of requiredMarkers) {
    if (!buildGradle.includes(marker)) {
      failures.push(`Missing Firebase marker in build.gradle: ${marker}`);
    }
  }

  const hasSigningPasswordResolver = buildGradle.includes("def releaseKeyPassword = resolveBuildSecret('DOGYARD_KEY_PASSWORD', 'DOGYARD_KEY_PASSWORD')");
  if (!hasSigningPasswordResolver) {
    failures.push("Missing release key password resolver in build.gradle (DOGYARD_KEY_PASSWORD).");
  }

  const hasReleaseSigningDeclarations = (buildGradle.match(/def hasReleaseSigning\s*=/g) || []).length;
  if (hasReleaseSigningDeclarations > 1) {
    failures.push("Duplicate hasReleaseSigning declarations detected in build.gradle.");
  }

  const danglingClosingBraces = (buildGradle.match(/^\s*}\s*$/gm) || []).length;
  if (danglingClosingBraces < 3) {
    notes.push("Gradle file has fewer closing braces than expected; please verify syntax manually.");
  }
}

let googleServices = null;
if (hasGoogleServices) {
  try {
    googleServices = JSON.parse(fs.readFileSync(googleServicesPath, "utf8"));
  } catch (error) {
    failures.push(`google-services.json is not valid JSON: ${error.message}`);
  }
}

if (buildGradle && googleServices) {
  const appIdMatch = buildGradle.match(/applicationId\s+"([^"]+)"/);
  const appId = appIdMatch?.[1] || null;
  const packageName = googleServices?.client?.[0]?.client_info?.android_client_info?.package_name || null;

  if (!appId) {
    failures.push("Could not detect applicationId in android/app/build.gradle.");
  }

  if (!packageName) {
    failures.push("Could not detect package_name in android/app/google-services.json.");
  }

  if (appId && packageName && appId !== packageName) {
    failures.push(`applicationId (${appId}) does not match google-services package_name (${packageName}).`);
  }
}

if (notes.length > 0) {
  for (const note of notes) {
    console.log(`WARN: ${note}`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`ERROR: ${failure}`);
  }
  process.exit(1);
}

console.log("OK: Android Firebase/Crashlytics wiring looks consistent.");

