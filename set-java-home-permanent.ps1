# Set JAVA_HOME and ANDROID_HOME Permanently
# Run this script as Administrator: Right-click PowerShell → "Run as Administrator"

Write-Host "Setting JAVA_HOME and ANDROID_HOME permanently..." -ForegroundColor Cyan

# Set JAVA_HOME for current user
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Android\Android Studio\jbr', 'User')
Write-Host "✓ JAVA_HOME set to: C:\Program Files\Android\Android Studio\jbr" -ForegroundColor Green

# Set ANDROID_HOME for current user
$androidSdkPath = "$env:LOCALAPPDATA\Android\Sdk"
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $androidSdkPath, 'User')
[System.Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', $androidSdkPath, 'User')
Write-Host "✓ ANDROID_HOME set to: $androidSdkPath" -ForegroundColor Green

# Add Java bin to PATH if not already there
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
if ($currentPath -notlike '*%JAVA_HOME%\bin*' -and $currentPath -notlike '*Android Studio\jbr\bin*') {
    $newPath = "$currentPath;%JAVA_HOME%\bin"
    [System.Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
    Write-Host "✓ Added %JAVA_HOME%\bin to PATH" -ForegroundColor Green
} else {
    Write-Host "✓ Java bin already in PATH" -ForegroundColor Yellow
}

Write-Host "`n✓ Environment variables set successfully!" -ForegroundColor Green
Write-Host "`n⚠ IMPORTANT: Close and reopen your terminal for changes to take effect." -ForegroundColor Yellow
Write-Host "`nTo verify, open a new terminal and run:" -ForegroundColor Cyan
Write-Host "  echo `$env:JAVA_HOME" -ForegroundColor White
Write-Host "  java -version" -ForegroundColor White


