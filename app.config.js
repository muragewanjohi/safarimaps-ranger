import 'dotenv/config';

export default {
  expo: {
    name: 'SafariMap GameWarden',
    slug: 'safarimap-gamewarden',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
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
      }
    },
    android: {
      package: 'com.safarimap.gamewarden',
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
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY,
      EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY,
      EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY,
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

