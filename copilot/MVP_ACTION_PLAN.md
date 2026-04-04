# 🛠️ DogYard MVP - Action Plan & Implementation Guide

**Created**: April 4, 2026  
**Status**: Ready for Implementation  
**Estimated Duration**: 4-6 weeks

---

## 📋 PHASE 1: CRITICAL FIXES (Week 1-2)

### Task 1.1: Fix Network Security Configuration
**Priority**: 🔴 CRITICAL  
**Effort**: 2-3 hours

#### Changes Required:
File: `android/app/src/main/res/xml/network_security_config.xml`

CURRENT (DEVELOPMENT):
```xml
<base-config cleartextTrafficPermitted="true">
    <trust-anchors>
        <certificates src="system" />
        <certificates src="user" />
    </trust-anchors>
</base-config>
```

CHANGE TO (PRODUCTION):
```xml
<base-config cleartextTrafficPermitted="false">
    <trust-anchors>
        <certificates src="system" />
    </trust-anchors>
</base-config>

KEEP ONLY FOR DEV:
<domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">10.0.2.2</domain>
    <domain includeSubdomains="true">localhost</domain>
</domain-config>
```

---

### Task 1.2: Fix Development vs Release Build Variants
**Priority**: 🔴 CRITICAL  
**Effort**: 3-4 hours

#### Changes Required:
File: `android/app/build.gradle`

ADD signingConfigs section before buildTypes:
```groovy
signingConfigs {
    release {
        // Will use environment variables for security
        storeFile file("${System.getenv('KEYSTORE_PATH') ?: 'keystore.jks'}")
        storePassword System.getenv('KEYSTORE_PASSWORD')
        keyAlias System.getenv('KEY_ALIAS')
        keyPassword System.getenv('KEY_PASSWORD')
    }
}

buildTypes {
    debug {
        debuggable = true
        versionNameSuffix "-dev"
    }
    release {
        debuggable = false
        minifyEnabled = true
        shrinkResources = true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        signingConfig signingConfigs.release
    }
}
```

---

### Task 1.3: Generate Keystore (Windows PowerShell)
**Priority**: 🔴 CRITICAL  
**Effort**: 15 minutes

```powershell
# Set variables
$KEYSTORE_PATH = "C:\Users\user\StudioProjects\dogyard-atoms\dogyard.keystore"
$ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"

# Generate keystore (valid for 10000 days = ~27 years)
& "$ANDROID_HOME\tools\keytool" -genkey -v `
    -keystore $KEYSTORE_PATH `
    -alias dogyard-release-key `
    -keyalg RSA -keysize 2048 -validity 10000 `
    -dname "CN=DogYard App,O=DogYard Inc,L=Tel Aviv,C=IL"

# Set environment variables for build
[Environment]::SetEnvironmentVariable("KEYSTORE_PATH", $KEYSTORE_PATH, [EnvironmentVariableTarget]::User)
[Environment]::SetEnvironmentVariable("KEY_ALIAS", "dogyard-release-key", [EnvironmentVariableTarget]::User)

# Password will be entered interactively during keytool execution
# Save it securely!
```

---

### Task 1.4: Create Privacy Policy & Terms of Service
**Priority**: 🔴 CRITICAL  
**Effort**: 4-6 hours

Create file: `copilot/PRIVACY_POLICY.md`

```markdown
# Privacy Policy - דוג פארק / Dog Park

**Effective Date**: April 4, 2026

## Overview
DogYard respects your privacy. This policy explains how we collect and protect your information.

## Information We Collect

### Location Data
- **Purpose**: Find nearby dog parks
- **Storage**: Encrypted in Supabase database
- **Retention**: 30 days default
- **User Control**: Can be disabled in settings

### Device Information
- Device type, OS version, app version
- Crash logs via Firebase Crashlytics
- Analytics events via Firebase Analytics

### Bluetooth Data
- Connected device names and signal strength
- Not permanently stored

## How We Use Your Data
- Provide location-based features
- Improve app performance
- Fix bugs and security issues
- Anonymized analytics

## Data Sharing
We do NOT sell your data. We share with:
- **Supabase** (backend database)
- **Firebase** (crash & analytics)
- **Google** (anonymized analytics)

## Security
- All data transmitted over HTTPS
- Encryption at rest in database
- Regular security reviews

## Your Rights
- **Access**: Request copy of your data
- **Delete**: Request account deletion
- **Opt-out**: Disable tracking in settings

## Contact
Email: privacy@dogyard.app

---

# מדיניות הפרטיות - דוג פארק

[Hebrew translation - can be auto-translated]
```

Create file: `copilot/TERMS_OF_SERVICE.md`

```markdown
# Terms of Service - DogYard App

**Effective Date**: April 4, 2026

## 1. Acceptance of Terms
By using DogYard App, you accept these terms.

## 2. License Grant
You receive a non-exclusive license to use this app for personal use only.

## 3. Restrictions
You may NOT:
- Reverse engineer the app
- Use for illegal activities
- Interfere with app operations
- Copy or distribute the app
- Scrape data automatically

## 4. Disclaimer
THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES.

## 5. Limitation of Liability
Our liability is limited to $100.

## 6. Third-Party Services
We use Supabase, Google, and Firebase.
Review their terms on their websites.

## 7. Termination
We may terminate access if terms are violated.

## 8. Changes to Terms
We may update these terms. Check periodically.

## 9. Governing Law
These terms are governed by Israeli law.

## 10. Contact
Questions? Email: legal@dogyard.app

---

[Hebrew translation below]
```

---

### Task 1.5: Fix API Endpoint Configuration
**Priority**: 🟠 HIGH  
**Effort**: 1 hour

File: `android/app/src/main/assets/capacitor.config.json`

```json
{
    "appId": "com.dogyard.app",
    "appName": "דוג פארק - Dog Park",
    "webDir": "dist",
    "server": {
        "androidScheme": "https",
        "url": "https://api.dogyard.app",
        "cleartext": false
    },
    "android": {},
    "plugins": {
        "SplashScreen": {
            "launchShowDuration": 3000,
            "backgroundColor": "#f97316",
            "showSpinner": true,
            "androidSpinnerStyle": "large",
            "spinnerColor": "#ffffff"
        }
    }
}
```

---

## 📋 PHASE 2: HIGH PRIORITY (Week 3-4)

### Task 2.1: Add Firebase Crashlytics
**Priority**: 🟠 HIGH  
**Effort**: 4-5 hours

1. Create Firebase project: https://console.firebase.google.com
2. Add Android app to project
3. Download `google-services.json`
4. Save to `android/app/google-services.json`
5. Update `android/app/build.gradle`

```groovy
// Add at top of file
apply plugin: 'com.google.gms.google-services'
apply plugin: 'com.google.firebase.crashlytics'

dependencies {
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:33.1.0')
    implementation 'com.google.firebase:firebase-crashlytics'
    implementation 'com.google.firebase:firebase-analytics'
}
```

---

### Task 2.2: Update ProGuard Rules
**Priority**: 🟠 HIGH  
**Effort**: 1 hour

File: `android/app/proguard-rules.pro`

Add to end:
```
# Capacitor
-keep class com.capacitorjs.** { *; }

# Kotlin
-keep class kotlin.** { *; }

# DogYard
-keep class com.dogyard.** { *; }

# Firebase
-keep class com.google.firebase.** { *; }

# Jetpack Compose
-keep class androidx.compose.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}
```

---

### Task 2.3: Create App Assets
**Priority**: 🟠 HIGH  
**Effort**: 8-12 hours

Required assets:
- 512x512 PNG icon (Play Store)
- 192x192, 144x144, 96x96, 72x72, 48x48 PNG (device)
- Splash screen 1280x1920 PNG
- Screenshots (1080x1920 or 1440x2560)

Use tools:
- Figma or Adobe XD for design
- Android Asset Studio for sizing
- ImageMagick for batch resize

---

## ✅ PRE-SUBMISSION CHECKLIST

Before uploading to Play Store:

```
[ ] Security configured (HTTPS, no cleartext)
[ ] Privacy Policy published
[ ] Terms of Service published
[ ] Keystore generated and signed
[ ] Firebase Crashlytics configured
[ ] ProGuard minification enabled
[ ] App tested on Android 7, 12, 15
[ ] No crashes on startup
[ ] All features working
[ ] App icon 512x512 ready
[ ] Screenshots prepared
[ ] Version code incremented
[ ] Release APK/AAB built and signed
```

---

**Document Version**: 1.0  
**Status**: Ready for Implementation  
**Last Updated**: April 4, 2026

