# Android Build Environment Setup Script
# Run this before building Android apps: .\setup-android-env.ps1

# Set Java Home (Android Studio bundled JDK)
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Set Android SDK paths
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME

# Add Android SDK tools to PATH
$env:PATH = "$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin;$env:PATH"

Write-Host "Android build environment configured:" -ForegroundColor Green
Write-Host "  JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Cyan
Write-Host "  ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now run: npx expo run:android" -ForegroundColor Yellow


