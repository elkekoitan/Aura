#!/bin/bash

# Aura Fashion - Android Build Script for Google Play Store
# This script builds the Android app for production release

set -e  # Exit on any error

echo "🤖 Starting Aura Fashion Android Build Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    print_error "EAS CLI is not installed. Installing..."
    npm install -g @expo/eas-cli
fi

# Check if user is logged in to EAS
print_status "Checking EAS authentication..."
if ! eas whoami &> /dev/null; then
    print_warning "Not logged in to EAS. Please log in:"
    eas login
fi

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf dist/
rm -rf .expo/

# Install dependencies
print_status "Installing dependencies..."
npm install

# Set production environment
export NODE_ENV=production
export EXPO_PUBLIC_APP_ENV=production

print_status "Building for production environment..."

# Validate app.json configuration
print_status "Validating app configuration..."
if ! npx expo config --type public > /dev/null; then
    print_error "Invalid app.json configuration"
    exit 1
fi

# Build Android APK for testing
print_status "Building Android APK for testing..."
eas build --platform android --profile preview --non-interactive

print_success "APK build completed!"

# Build Android App Bundle (AAB) for Google Play Store
print_status "Building Android App Bundle for Google Play Store..."
eas build --platform android --profile production --non-interactive

print_success "AAB build completed!"

# Display build information
print_status "Build Summary:"
echo "✅ Android APK: Ready for device testing"
echo "✅ Android AAB: Ready for Google Play Store submission"
echo ""
echo "📱 Next Steps:"
echo "1. Download and test the APK on your Android device"
echo "2. If testing passes, submit the AAB to Google Play Console"
echo "3. Complete the store listing with screenshots and descriptions"
echo ""
echo "🔗 Useful Commands:"
echo "• View builds: eas build:list"
echo "• Download build: eas build:download [build-id]"
echo "• Submit to store: eas submit --platform android"

print_success "Android build process completed successfully! 🎉"
