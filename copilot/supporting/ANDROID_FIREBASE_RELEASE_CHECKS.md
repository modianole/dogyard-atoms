# Android Firebase + Release Signing Checks

Last updated: 2026-04-18

## What This Covers
- Local verification that Firebase/Crashlytics wiring exists in `android/app/build.gradle`.
- Local verification that `applicationId` matches `android/app/google-services.json` package name.
- Safe fallback path for unsigned local release validation.

## Quick Verify (PowerShell)
```powershell
cd "C:\Users\user\StudioProjects\dogyard-atoms"
npm run verify:android:firebase
```

Expected result:
- `OK: Android Firebase/Crashlytics wiring looks consistent.`

## Required Release Signing Inputs
Set either environment variables or `android/local.properties` values:
- `DOGYARD_KEYSTORE_PATH`
- `DOGYARD_KEYSTORE_PASSWORD`
- `DOGYARD_KEY_ALIAS`
- `DOGYARD_KEY_PASSWORD`

## Local Validation Without Real Signing
For local pipeline validation only:
```powershell
cd "C:\Users\user\StudioProjects\dogyard-atoms\android"
cmd /c gradlew.bat assembleRelease -PDOGYARD_DISABLE_RELEASE_SIGNING=true
```

This is not a store-publishable signature path.

## Troubleshooting Signals
If `npm run verify:android:firebase` fails:
1. Missing `DOGYARD_KEY_PASSWORD` resolver in `android/app/build.gradle`.
2. Duplicate `hasReleaseSigning` declaration in `android/app/build.gradle`.
3. Missing Firebase markers (`crashlytics`, `analytics`, or `google-services` plugin).
4. Mismatch between `applicationId` and `google-services.json` package name.

