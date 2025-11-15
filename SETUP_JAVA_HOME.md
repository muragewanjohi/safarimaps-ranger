# Setting JAVA_HOME Permanently on Windows

## Method 1: Using Windows GUI (Recommended)

1. **Open System Properties:**
   - Press `Win + R` to open Run dialog
   - Type `sysdm.cpl` and press Enter
   - OR Right-click "This PC" → Properties → Advanced system settings

2. **Open Environment Variables:**
   - Click the "Environment Variables" button at the bottom

3. **Add JAVA_HOME:**
   - Under "User variables" (or "System variables" if you want it for all users), click "New..."
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Android\Android Studio\jbr`
   - Click "OK"

4. **Update PATH:**
   - Find "Path" in the same section (User or System variables)
   - Click "Edit..."
   - Click "New" and add: `%JAVA_HOME%\bin`
   - Click "OK" on all dialogs

5. **Restart your terminal/PowerShell** for changes to take effect

## Method 2: Using PowerShell (Run as Administrator)

Open PowerShell as Administrator and run:

```powershell
# Set JAVA_HOME for current user
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Android\Android Studio\jbr', 'User')

# Add Java to PATH for current user
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
if ($currentPath -notlike '*%JAVA_HOME%\bin*') {
    [System.Environment]::SetEnvironmentVariable('Path', "$currentPath;%JAVA_HOME%\bin", 'User')
}

# Set ANDROID_HOME for current user
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')
[System.Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', "$env:LOCALAPPDATA\Android\Sdk", 'User')
```

Then restart your terminal.

## Method 3: Using Command Prompt (Run as Administrator)

```cmd
setx JAVA_HOME "C:\Program Files\Android\Android Studio\jbr"
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
setx ANDROID_SDK_ROOT "%LOCALAPPDATA%\Android\Sdk"
```

**Note:** `setx` only affects new terminal windows. Close and reopen your terminal.

## Verify the Setup

After setting the variables, open a **new** terminal and run:

```powershell
echo $env:JAVA_HOME
java -version
echo $env:ANDROID_HOME
```

You should see:
- JAVA_HOME pointing to the Android Studio JDK
- Java version information
- ANDROID_HOME pointing to your SDK location


