#!/bin/bash

# סקריפט אוטומציה לסנכרון מהיר בין ה-Web ל-Android
echo "🚀 Starting DogYard Sync Process..."

# חזרה לתיקיית השורש של הפרויקט (שם נמצא ה-package.json)
cd ../..

# 1. בנייה של קוד ה-Frontend
echo "📦 Building Web assets..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # 2. סנכרון ל-Android
    echo "🔄 Syncing with Capacitor..."
    npx cap sync android
    
    echo "✨ All set! Your Android project is now up to date."
    echo "💡 Pro tip: If you are using Live Reload, just keep 'npm run dev' running."
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
