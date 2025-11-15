@echo off
REM Android Emulator Startup Script
REM Usage: start-emulator.bat

set EMULATOR_PATH=%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe
set AVD_NAME=Medium_Phone_API_36.1

if exist "%EMULATOR_PATH%" (
    echo Starting Android Emulator: %AVD_NAME%
    start "" "%EMULATOR_PATH%" -avd %AVD_NAME%
    echo Emulator is starting... You can close this window.
) else (
    echo Error: Emulator not found at %EMULATOR_PATH%
    echo Please check your Android SDK installation.
    pause
)

