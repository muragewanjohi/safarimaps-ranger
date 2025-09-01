// App Configuration
export const AppConfig = {
  // Data Source Configuration
  USE_MOCK_DATA: false, // Switch to Supabase
  USE_SUPABASE: true,
  
  // Supabase Configuration
  SUPABASE: {
    URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // API Configuration
  API: {
    BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.safarimap.com',
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
  },
  
  // Mock Data Configuration
  MOCK: {
    API_DELAY: 500, // Simulate network delay in milliseconds
    ENABLE_LOGGING: true, // Log mock API calls
  },
  
  // App Settings
  APP: {
    NAME: 'SafariMap GameWarden',
    VERSION: '1.0.0',
    ENVIRONMENT: process.env.NODE_ENV || 'development',
  },
  
  // Feature Flags
  FEATURES: {
    ENABLE_REALTIME: true,
    ENABLE_PHOTO_UPLOAD: true,
    ENABLE_OFFLINE_MODE: true,
    ENABLE_PUSH_NOTIFICATIONS: true,
    ENABLE_ANALYTICS: false, // Set to true in production
  },
  
  // UI Configuration
  UI: {
    PRIMARY_COLOR: '#2E7D32',
    SECONDARY_COLOR: '#4CAF50',
    ERROR_COLOR: '#ff6b6b',
    WARNING_COLOR: '#ff9500',
    SUCCESS_COLOR: '#4caf50',
    ANIMATION_DURATION: 300,
  },
  
  // Storage Configuration
  STORAGE: {
    OFFLINE_DATA_KEY: 'safarimap_offline_data',
    USER_PREFERENCES_KEY: 'safarimap_user_prefs',
    CACHE_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  }
};

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const env = AppConfig.APP.ENVIRONMENT;
  
  switch (env) {
    case 'production':
      return {
        ...AppConfig,
        USE_MOCK_DATA: false,
        FEATURES: {
          ...AppConfig.FEATURES,
          ENABLE_ANALYTICS: true,
        },
        MOCK: {
          ...AppConfig.MOCK,
          ENABLE_LOGGING: false,
        }
      };
      
    case 'staging':
      return {
        ...AppConfig,
        USE_MOCK_DATA: false,
        API: {
          ...AppConfig.API,
          BASE_URL: 'https://staging-api.safarimap.com',
        }
      };
      
    case 'development':
    default:
      return AppConfig;
  }
};

// Export the current configuration
export const currentConfig = getEnvironmentConfig();
