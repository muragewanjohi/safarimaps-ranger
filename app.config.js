import 'dotenv/config';

export default {
  expo: {
    name: 'SafariMap GameWarden',
    slug: 'safarimap-gamewarden',
    version: '1.0.1', // or your desired new version
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      bundleIdentifier: 'com.safarimap.gamewarden',
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY
      },
      buildNumber: '2', // increment this for iOS
    },
    android: {
      package: 'com.safarimap.gamewarden',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY
        }
      },
      versionCode: 2, // increment this for Android
    },
    web: {
      favicon: './assets/images/favicon.png'
    },
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY,
      EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY,
      EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY,
      eas: {
        projectId: '1ada1c2a-6f91-4733-8760-30e1296a75d4'
      },
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

