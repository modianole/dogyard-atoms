# 🛠️ DogYard MVP - Action Plan & Implementation Guide

**Created**: April 4, 2026  
**Status**: Ready for Implementation  
**Estimated Duration**: 4-6 weeks

---

## 📋 PHASE 1: CRITICAL FIXES (Week 1-2)

### Task 1.1: Fix Network Security Configuration
**Priority**: 🔴 CRITICAL  
**Effort**: 2-3 hours  
**Blocking**: Google Play Store submission

#### Changes Required:
```groovy
File: android/app/src/main/res/xml/network_security_config.xml

CURRENT (DEVELOPMENT):
<base-config cleartextTrafficPermitted="true">
    <trust-anchors>
        <certificates src="system" />
        <certificates src="user" />
    </trust-anchors>
</base-config>

CHANGE TO (PRODUCTION):
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

#### Verification:
```bash
# Test with release build
./gradlew assembleRelease

# Check network calls use HTTPS
# Verify API endpoints updated
```

---

### Task 1.2: Fix Development vs Release Build Variants
**Priority**: 🔴 CRITICAL  
**Effort**: 3-4 hours  

#### Changes Required:
```groovy
File: android/app/build.gradle

ADD AFTER line 19 (buildTypes section):

buildTypes {
    debug {
        debuggable = true
        versionNameSuffix "-dev"
        signingConfig signingConfigs.debug
    }
    release {
        debuggable = false
        minifyEnabled = true
        shrinkResources = true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        signingConfig signingConfigs.release
    }
}

ADD SIGNING CONFIGURATION:

signingConfigs {
    release {
        storeFile file("$System.env.KEYSTORE_PATH")
        storePassword "$System.env.KEYSTORE_PASSWORD"
        keyAlias "$System.env.KEY_ALIAS"
        keyPassword "$System.env.KEY_PASSWORD"
    }
    debug {
        keyAlias "androiddebugkey"
        keyPassword "android"
        storeFile file("$System.env.HOME/.android/debug.keystore")
        storePassword "android"
    }
}
```

#### Generate Keystore:
```powershell
# On Windows PowerShell
$KEYSTORE_PATH = "C:\path\to\dogyard.keystore"
$ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"

# Generate keystore (valid for 10000 days)
& "$ANDROID_HOME\tools\keytool" -genkey -v `
    -keystore $KEYSTORE_PATH `
    -alias dogyard-release-key `
    -keyalg RSA -keysize 2048 -validity 10000 `
    -dname "CN=DogYard App,O=DogYard Inc,L=Israel,C=IL"

# Note: Save password securely!
```

#### Verification:
```bash
# Build release APK
./gradlew bundleRelease

# Verify signed
# Check APK signature
```

---

### Task 1.3: Fix Build Configuration Issues
**Priority**: 🟠 HIGH  
**Effort**: 2 hours  

#### Changes Required:
```groovy
File: android/app/build.gradle

UPDATE buildTypes.release:

buildTypes {
    release {
        debuggable = false
        minifyEnabled = true
        shrinkResources = true
        versionNameSuffix = ""
        
        // Add ProGuard rules for Capacitor and Kotlin
        proguardFiles(
            getDefaultProguardFile('proguard-android-optimize.txt'),
            'proguard-rules.pro'
        )
    }
}
```

#### Update ProGuard Rules:
```
File: android/app/proguard-rules.pro

# Add to end of file:

# Capacitor rules
-keep class com.capacitorjs.** { *; }
-keep interface com.capacitorjs.** { *; }
-keep public class * extends com.capacitorjs.** { *; }

# Kotlin rules
-keep class kotlin.** { *; }
-keep interface kotlin.** { *; }

# DogYard app rules
-keep class com.dogyard.** { *; }
-keep interface com.dogyard.** { *; }
-keep public class com.dogyard.** { *; }

# Jetpack Compose
-keep class androidx.compose.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}
```

---

### Task 1.4: Create Privacy Policy & Terms of Service
**Priority**: 🔴 CRITICAL  
**Effort**: 4-6 hours  

#### Files to Create:

**File 1: PRIVACY_POLICY.md**
```markdown
# Privacy Policy - דוג פארק / Dog Park

**Effective Date**: [DATE]
**Last Updated**: [DATE]

## Overview
We respect your privacy. This policy explains how DogYard App collects, uses, and protects your information.

## 1. Information We Collect

### Location Data
- **GPS/Precise Location**: Collected when you use location-based features
- **Purpose**: Find nearby dog parks and other dog owners
- **Storage**: Encrypted on servers with Supabase
- **Retention**: 30 days unless actively using feature
- **User Control**: You can disable in app settings

### Device Information
- Device type, OS version, app version
- Crash logs and performance data
- Analytics events (feature usage)

### Bluetooth Data
- Connected device names and signal strength
- **Purpose**: Pet tracker connectivity
- **Storage**: Not stored, real-time only

### Cookies & Similar Technologies
- Session management
- Analytics tracking (Google Analytics)

## 2. How We Use Your Data
- Provide location-based features
- Improve app performance and reliability
- Fix bugs and security issues
- Understand user behavior (anonymized)
- Send push notifications (with permission)

## 3. Data Sharing
We do NOT sell your data. We share data only with:
- **Supabase** (backend database)
- **Google Analytics** (anonymized analytics)
- **Firebase** (crash reporting)

## 4. Security
- All data transmitted over HTTPS
- Encryption at rest in database
- Regular security audits
- No hardcoded API keys

## 5. Your Rights
- **Access**: Request copy of your data
- **Delete**: Request deletion of your account
- **Opt-out**: Disable location/analytics tracking

## 6. Contact Us
- Email: privacy@dogyard.app
- Address: [Your Address]

---

[Add Hebrew translation below - עברית]

# מדיניות הפרטיות - דוג פארק

[Hebrew translation of above]
```

**File 2: TERMS_OF_SERVICE.md**
```markdown
# Terms of Service - DogYard App

**Effective Date**: [DATE]

## 1. Acceptance of Terms
By using DogYard App, you accept these terms.

## 2. License Grant
You receive a non-exclusive license to use this app for personal use only.

## 3. Restrictions
You may NOT:
- Reverse engineer or disassemble the app
- Use the app for illegal activities
- Interfere with app operations
- Copy or distribute the app
- Scrape or automate data collection

## 4. User Content
- You own content you create
- You grant us license to use it in the app
- You're responsible for your content

## 5. Limitation of Liability
TO THE MAXIMUM EXTENT PERMITTED:
- We are NOT liable for indirect/consequential damages
- Our liability is limited to $100
- Some jurisdictions don't allow limitations

## 6. Disclaimer of Warranties
THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES.
We don't guarantee:
- Accuracy of location data
- Continuous availability
- Fitness for particular purpose

## 7. Third-Party Services
We use Supabase, Google, and Firebase services.
Review their terms at their websites.

## 8. Termination
We may terminate your access if you violate these terms.

## 9. Changes to Terms
We may update these terms. Check periodically.

## 10. Governing Law
These terms are governed by Israeli law.

## 11. Contact
Questions? Email: legal@dogyard.app

---

[Hebrew translation below]
```

#### Steps:
1. ✅ Create both files above
2. ✅ Get legal review
3. ✅ Host on website or in-app
4. ✅ Provide URL for Play Store listing
5. ✅ Create Hebrew translation

---

### Task 1.5: Fix API Endpoint Configuration
**Priority**: 🟠 HIGH  
**Effort**: 2-3 hours  

#### Changes Required:

**File: android/app/src/main/assets/capacitor.config.json**

```json
{
    "appId": "com.dogyard.app",
    "appName": "דוג פארק - Dog Park",
    "webDir": "dist",
    "server": {
        "androidScheme": "https",
        "url": "https://api.dogyard.app",  // CHANGE FROM http://10.0.2.2:8080
        "cleartext": false                   // CHANGE FROM true
    },
    "android": {},
    "plugins": {
        "SplashScreen": {
            "launchShowDuration": 3000,
            "backgroundColor": "#f97316",
            "showSpinner": true,
            "androidSpinnerStyle": "large",
            "iosSpinnerStyle": "small",
            "spinnerColor": "#ffffff"
        }
    }
}
```

#### For Development:
Create separate config file:
```json
// capacitor.config.development.json
// Use this during dev with 10.0.2.2:8080
```

---

## 📋 PHASE 2: HIGH PRIORITY (Week 3-4)

### Task 2.1: Add Firebase Crashlytics
**Priority**: 🟠 HIGH  
**Effort**: 4-5 hours  

#### Steps:
1. Create Firebase project: https://console.firebase.google.com
2. Add Android app to project
3. Download google-services.json
4. Save to `android/app/google-services.json`
5. Update `android/app/build.gradle`:

```groovy
// Add at top
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services'
apply plugin: 'com.google.firebase.crashlytics'

// Add to dependencies
dependencies {
    // ... existing ...
    
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:33.1.0')
    implementation 'com.google.firebase:firebase-crashlytics'
    implementation 'com.google.firebase:firebase-analytics'
}
```

6. Initialize in MainActivity:
```kotlin
class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Crashlytics already initializes automatically
    }
}
```

---

### Task 2.2: Implement Error Handling
**Priority**: 🟠 HIGH  
**Effort**: 6-8 hours  

#### Create Error Handler:
```kotlin
// File: app/src/main/java/com/dogyard/app/ErrorHandler.kt

object ErrorHandler {
    fun handle(exception: Exception, context: String = "") {
        Log.e("DogYard", "Error in $context", exception)
        
        // Send to Crashlytics
        FirebaseCrashlytics.getInstance().recordException(exception)
        
        // User notification
        showErrorToUser(exception)
    }
    
    private fun showErrorToUser(exception: Exception) {
        val message = when (exception) {
            is LocationException -> "Unable to access location"
            is NetworkException -> "Network error. Check your connection"
            is BluetoothException -> "Bluetooth connection failed"
            else -> "Something went wrong. Please try again"
        }
        // Show Toast or Snackbar to user
    }
}
```

---

### Task 2.3: Add Unit Tests
**Priority**: 🟠 HIGH  
**Effort**: 8-10 hours  

#### Create Test Structure:
```
android/app/src/test/
├── java/com/dogyard/app/
│   ├── ErrorHandlerTest.kt
│   ├── LocationServiceTest.kt
│   ├── BluetoothServiceTest.kt
│   └── UtilityTest.kt
```

#### Example Test:
```kotlin
// File: src/test/java/com/dogyard/app/ErrorHandlerTest.kt

class ErrorHandlerTest {
    @Test
    fun testErrorHandling() {
        val exception = Exception("Test error")
        assertDoesNotThrow {
            ErrorHandler.handle(exception, "test")
        }
    }
}
```

---

### Task 2.4: Create App Assets
**Priority**: 🟠 HIGH  
**Effort**: 8-12 hours  

#### Icon & Splash Assets Needed:
```
✅ App Icon:
   - 512x512 PNG (for Play Store)
   - 192x192, 144x144, 96x96, 72x72, 48x48 PNG (for device)
   - Must be square
   - Max 25% transparency
   - No rounded corners

✅ Rounded Icon:
   - Same sizes as above
   - Rounded version

✅ Adaptive Icon (Android 8+):
   - ic_launcher_foreground.xml (vector)
   - ic_launcher_background.xml (color)

✅ Splash Screen:
   - 1280x1920 PNG
   - Orange background (#f97316)
   - DogYard logo/text

✅ Screenshots (for Play Store):
   - 1080x1920 or 1440x2560
   - At least 2 different screens
   - Show key features
   - Include app name/tagline
   - High quality
```

#### Tools to Use:
- Adobe XD / Figma (design)
- ImageMagick (resize)
- Android Asset Studio (generate)
- AppMockUp (screenshots)

---

### Task 2.5: Write Documentation
**Priority**: 🟠 HIGH  
**Effort**: 6-8 hours  

#### File: README.md
```markdown
# DogYard App - דוג פארק

## Overview
DogYard is an Android app that helps dog owners find dog parks and connect with other pet lovers using location-based features and Bluetooth connectivity.

## Technology Stack
- **Framework**: Capacitor (hybrid web/native)
- **Frontend**: Web-based with Jetpack Compose
- **Backend**: Supabase
- **Android SDK**: 24-35
- **Languages**: Kotlin, JavaScript

## Development Setup

### Prerequisites
- Android SDK (API 24-35)
- Android Studio latest
- Node.js 16+
- Gradle 8.7+

### Installation
```bash
# Clone repository
git clone <repo-url>
cd dogyard-atoms

# Install dependencies
npm install

# Build web assets
npm run build

# Build Android app
cd android
./gradlew build
```

## Building & Running

### Development
```bash
./gradlew installDebug
```

### Release
```bash
./gradlew bundleRelease
```

## Project Structure
```
android/
├── app/                    # Main app module
├── build/                  # Build output
├── gradle/                 # Gradle configuration
├── variables.gradle        # Version management
└── build.gradle            # Root build config
```

## Features
- 📍 Find nearby dog parks using GPS
- 👥 Connect with other dog owners
- 🔵 Bluetooth pet tracker support
- 🔔 Push notifications
- 🌐 Web-based hybrid architecture

## API Documentation
[Link to API docs]

## Security
- All traffic over HTTPS
- API key management via environment variables
- Regular security audits

## Testing
```bash
./gradlew test              # Unit tests
./gradlew connectedAndroidTest  # Integration tests
```

## Deployment

### Google Play Store
1. Build release APK: `./gradlew bundleRelease`
2. Sign with keystore
3. Upload to Google Play Console
4. Fill store listing
5. Submit for review

## Troubleshooting

### Common Issues
- [List common issues and solutions]

## Support
Email: dev@dogyard.app

## License
[Your license]
```

---

## 📋 PHASE 3: POLISH & SUBMISSION (Week 5)

### Task 3.1: Final Security Audit
**Priority**: 🟠 HIGH  
**Effort**: 4 hours  

#### Checklist:
```
Security Audit Checklist:
[ ] No API keys hardcoded in code
[ ] No passwords in git history
[ ] HTTPS enforcement in place
[ ] ProGuard minification enabled
[ ] SSL certificate pinning (optional)
[ ] Permissions minimally scoped
[ ] User data encryption at rest
[ ] Network traffic encryption
[ ] No sensitive logs in release build
[ ] Obfuscation enabled
[ ] Security warnings from Play Console addressed
```

---

### Task 3.2: Cross-Device Testing
**Priority**: 🟠 HIGH  
**Effort**: 8 hours  

#### Test Matrix:
```
Required Testing:
[ ] Android 7.0 (API 24) - Minimum
[ ] Android 10.0 (API 29) - Mid-range
[ ] Android 12.0+ (API 31+) - Modern (permissions!)
[ ] Android 15 (API 35) - Target/Compile

Test Categories:
[ ] App launches without crashes
[ ] Location feature works
[ ] Bluetooth connectivity works
[ ] Network calls work
[ ] All permissions granted/denied
[ ] Orientation changes
[ ] Screen size variations (phone/tablet)
[ ] RAM variations (2GB, 4GB, 8GB)
[ ] Battery usage reasonable
[ ] No ANRs (Application Not Responding)
```

---

### Task 3.3: Create Play Store Listing
**Priority**: 🟠 HIGH  
**Effort**: 6 hours  

#### What You Need:

1. **App Title** (max 50 chars)
   ```
   דוג פארק - Dog Park
   ```

2. **Short Description** (max 80 chars)
   ```
   Find dog parks & connect with pet owners nearby
   ```

3. **Full Description** (max 4000 chars)
   ```
   DogYard helps dog owners discover dog parks and connect with 
   other pet lovers in their area. Using GPS, find nearby dog parks 
   and Bluetooth to connect with pet trackers and other users.
   
   Key Features:
   • 🗺️ Discover nearby dog parks using GPS
   • 👥 Connect with other dog owners
   • 🔵 Support for Bluetooth pet trackers
   • 🔔 Notifications for park updates
   
   Privacy & Security:
   • All your data is encrypted
   • Location data retained for 30 days only
   • No data selling or sharing
   • Read our full privacy policy in-app
   
   [Add Hebrew translation below]
   ```

4. **Screenshots** (1080x1920 or 1440x2560)
   - Screenshot 1: Main app view
   - Screenshot 2: Dog park listing
   - Add text overlay: "Find Dog Parks"

5. **Feature Graphic** (1024x500)
   - High quality PNG
   - Show app logo and tagline

6. **Category**: Lifestyle / Social

---

### Task 3.4: Build Final Release
**Priority**: 🔴 CRITICAL  
**Effort**: 2 hours  

#### Steps:
```bash
# Increment version
# Edit android/variables.gradle:
# versionCode: 1 → 2
# versionName: "1.0" → "1.0.0"

# Clean build
./gradlew clean

# Build release AAB (recommended for Play Store)
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab

# Verify signature
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
```

---

## ✅ PRE-SUBMISSION CHECKLIST

Before uploading to Google Play:

```
[ ] Security
    [ ] Network security config fixed
    [ ] HTTPS enforced
    [ ] API keys secured
    [ ] Signed release APK created
    [ ] ProGuard rules applied
    [ ] No debug symbols in release

[ ] Functionality
    [ ] All features tested
    [ ] No crashes on startup
    [ ] Location works
    [ ] Bluetooth works
    [ ] Network calls work
    [ ] No ANRs

[ ] Testing
    [ ] Tested on API 24
    [ ] Tested on API 31+
    [ ] Tested on API 35
    [ ] Low RAM device tested
    [ ] High RAM device tested
    [ ] Orientation changes
    [ ] Multiple languages (Hebrew/English)

[ ] Store Requirements
    [ ] Privacy Policy written & published
    [ ] Terms of Service written & published
    [ ] Content Rating Questionnaire completed
    [ ] App icon 512x512 PNG ready
    [ ] Screenshots prepared (min 2)
    [ ] Feature graphic ready
    [ ] App description written
    [ ] Store listing complete
    [ ] APK/AAB signed
    [ ] Version code incremented

[ ] Documentation
    [ ] README.md complete
    [ ] Build instructions clear
    [ ] Troubleshooting documented
    [ ] Architecture documented

[ ] Performance
    [ ] APK size < 50MB
    [ ] Build time < 5 min
    [ ] Startup time < 3 sec
    [ ] No battery drain issues
    [ ] No memory leaks detected
```

---

## 📞 Resources & References

### Documentation
- [Android Developer Docs](https://developer.android.com/)
- [Google Play Console Guide](https://support.google.com/googleplay/)
- [Capacitor Documentation](https://capacitorjs.com/)
- [Jetpack Compose Guide](https://developer.android.com/develop/ui/compose)

### Tools
- [Android Studio](https://developer.android.com/studio)
- [Google Play Console](https://play.google.com/console)
- [Firebase Console](https://console.firebase.google.com)
- [Play Store Pre-launch Reports](https://support.google.com/googleplay/android-developer/answer/7003961)

### Security References
- [OWASP Mobile Security Top 10](https://owasp.org/www-project-mobile-top-10/)
- [Android Security & Privacy Best Practices](https://developer.android.com/training/articles/security-tips)

---

**Document Version**: 1.0  
**Status**: Ready for Implementation  
**Last Updated**: April 4, 2026

