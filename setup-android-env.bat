@echo off
REM Android Build Environment Setup Script
REM Run this before building Android apps: setup-android-env.bat

REM Set Java Home (Android Studio bundled JDK)
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%PATH%

REM Set Android SDK paths
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%

REM Add Android SDK tools to PATH
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%PATH%

echo Android build environment configured:
echo   JAVA_HOME: %JAVA_HOME%
echo   ANDROID_HOME: %ANDROID_HOME%
echo.
echo You can now run: npx expo run:android


