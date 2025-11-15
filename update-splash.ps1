# Update splash screen logo in all drawable density folders
$logoPath = "assets\images\logo.png"
$basePath = "android\app\src\main\res"
$folders = @("drawable-hdpi", "drawable-mdpi", "drawable-xhdpi", "drawable-xxhdpi", "drawable-xxxhdpi")

Write-Host "Updating splash screen logos..." -ForegroundColor Cyan

foreach ($folder in $folders) {
    $targetDir = Join-Path $basePath $folder
    $targetFile = Join-Path $targetDir "splashscreen_logo.png"
    
    if (Test-Path $targetDir) {
        if (Test-Path $logoPath) {
            Copy-Item -Path $logoPath -Destination $targetFile -Force
            Write-Host "Updated: $targetFile" -ForegroundColor Green
        } else {
            Write-Host "Logo file not found: $logoPath" -ForegroundColor Red
        }
    } else {
        Write-Host "Folder not found: $targetDir" -ForegroundColor Yellow
    }
}

Write-Host "`nDone!" -ForegroundColor Cyan

