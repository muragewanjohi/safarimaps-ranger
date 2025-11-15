# Android Emulator Startup Script
# Usage: .\start-emulator.ps1

$emulatorPath = "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe"
$avdName = "Medium_Phone_API_36.1"

if (Test-Path $emulatorPath) {
    Write-Host "Starting Android Emulator: $avdName" -ForegroundColor Green
    Start-Process -FilePath $emulatorPath -ArgumentList "-avd", $avdName
    Write-Host "Emulator is starting... You can close this window." -ForegroundColor Yellow
} else {
    Write-Host "Error: Emulator not found at $emulatorPath" -ForegroundColor Red
    Write-Host "Please check your Android SDK installation." -ForegroundColor Red
}

