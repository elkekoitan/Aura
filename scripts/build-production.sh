#!/bin/bash

# Aura Fashion App - Production Build Script
# This script builds the app for iOS and Android store deployment

set -e

echo "🌟 Starting Aura Fashion App Production Build..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g @expo/eas-cli
fi

# Login to EAS (if not already logged in)
echo "🔐 Checking EAS authentication..."
eas whoami || eas login

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf .expo/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Type check
echo "🔍 Running TypeScript checks..."
npx tsc --noEmit

# Build for iOS
echo "🍎 Building for iOS App Store..."
eas build --platform ios --profile production --non-interactive

# Build for Android
echo "🤖 Building for Android Play Store..."
eas build --platform android --profile production --non-interactive

echo "✅ Production builds completed successfully!"
echo "📱 iOS and Android builds are ready for store submission."
echo ""
echo "Next steps:"
echo "1. Download builds from EAS dashboard"
echo "2. Test builds on physical devices"
echo "3. Submit to App Store and Play Store using:"
echo "   - eas submit --platform ios"
echo "   - eas submit --platform android"
