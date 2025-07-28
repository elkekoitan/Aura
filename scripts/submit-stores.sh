#!/bin/bash

# Aura Fashion App - Store Submission Script
# This script submits the app to iOS App Store and Google Play Store

set -e

echo "🌟 Starting Aura Fashion App Store Submission..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Please install it first:"
    echo "npm install -g @expo/eas-cli"
    exit 1
fi

# Login to EAS (if not already logged in)
echo "🔐 Checking EAS authentication..."
eas whoami || eas login

# Function to submit to iOS App Store
submit_ios() {
    echo "🍎 Submitting to iOS App Store..."
    echo "⚠️  Make sure you have:"
    echo "   - Valid Apple Developer account"
    echo "   - App Store Connect app created"
    echo "   - Certificates and provisioning profiles set up"
    echo ""
    read -p "Continue with iOS submission? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        eas submit --platform ios --latest
        echo "✅ iOS submission completed!"
    else
        echo "⏭️  Skipping iOS submission"
    fi
}

# Function to submit to Google Play Store
submit_android() {
    echo "🤖 Submitting to Google Play Store..."
    echo "⚠️  Make sure you have:"
    echo "   - Google Play Console account"
    echo "   - App created in Play Console"
    echo "   - Service account key configured"
    echo ""
    read -p "Continue with Android submission? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        eas submit --platform android --latest
        echo "✅ Android submission completed!"
    else
        echo "⏭️  Skipping Android submission"
    fi
}

# Main submission flow
echo "📱 Choose submission platform:"
echo "1) iOS App Store only"
echo "2) Google Play Store only"
echo "3) Both stores"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        submit_ios
        ;;
    2)
        submit_android
        ;;
    3)
        submit_ios
        submit_android
        ;;
    4)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Exiting..."
        exit 1
        ;;
esac

echo ""
echo "🎉 Store submission process completed!"
echo ""
echo "📋 Next steps:"
echo "1. Monitor submission status in respective store consoles"
echo "2. Respond to any review feedback"
echo "3. Prepare marketing materials and app store optimization"
echo "4. Plan your app launch strategy"
echo ""
echo "🔗 Useful links:"
echo "- App Store Connect: https://appstoreconnect.apple.com"
echo "- Google Play Console: https://play.google.com/console"
echo "- EAS Dashboard: https://expo.dev"
