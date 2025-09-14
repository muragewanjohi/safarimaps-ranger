# Google Maps Integration Setup

## 1. Install Dependencies

Run these commands in your project root:

```bash
# Core Google Maps dependencies
npx expo install expo-location expo-permissions
npx expo install react-native-maps

# For additional map features
npx expo install expo-camera expo-media-library
```

## 2. Get Google Maps API Keys

### For Development:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Geocoding API
   - Directions API

### Create API Keys:
1. Go to "Credentials" → "Create Credentials" → "API Key"
2. Create separate keys for:
   - **Android**: Restrict to Android apps, add your package name
   - **iOS**: Restrict to iOS apps, add your bundle identifier
   - **Web**: For development (restrict to localhost)

## 3. Configure Environment Variables

Add to your `.env` file:
```env
# Google Maps API Keys
EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY=AIzaSyDmK6lC70JoC8fWSx7fPFN_EhAco5nSba4, 
EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY=AIzaSyDmK6lC70JoC8fWSx7fPFN_EhAco5nSba4,
EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY=AIzaSyDmK6lC70JoC8fWSx7fPFN_EhAco5nSba4
```

## 4. Update app.config.js

Add Google Maps configuration to your `app.config.js`:

```javascript
export default {
  expo: {
    // ... existing config
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY,
      EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY,
      EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY,
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY
        }
      }
    },
    plugins: [
      'expo-router',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission: 'Allow SafariMap to use your location for wildlife tracking and park navigation.'
        }
      ]
    ]
  }
};
```

## 5. Platform-Specific Setup

### Android (android/app/src/main/AndroidManifest.xml):
```xml
<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="your_android_api_key_here"/>
</application>
```

### iOS (ios/YourApp/AppDelegate.mm):
```objc
#import <GoogleMaps/GoogleMaps.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"your_ios_api_key_here"];
  // ... rest of your code
}
```

## 6. Permissions

The app will request these permissions:
- **Location**: For tracking wildlife and navigation
- **Camera**: For taking photos of wildlife
- **Media Library**: For saving photos

## 7. Testing

After setup, test on:
- **iOS Simulator**: Use web API key
- **Android Emulator**: Use Android API key
- **Physical Devices**: Use respective platform keys

## 8. Security Notes

- Never commit API keys to version control
- Use environment variables
- Restrict API keys to specific platforms and apps
- Monitor API usage in Google Cloud Console
