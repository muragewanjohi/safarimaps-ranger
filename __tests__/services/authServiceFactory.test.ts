import { AppConfig } from '@/config/appConfig';
import { getAuthService } from '@/services/authServiceFactory';

// Mock the config
jest.mock('@/config/appConfig', () => ({
  AppConfig: {
    USE_SUPABASE: true,
  },
}));

// Mock the services
jest.mock('@/services/authService', () => ({
  authService: {
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    isAuthenticated: jest.fn(),
    validateEmail: jest.fn(),
    validatePassword: jest.fn(),
    validateRangerId: jest.fn(),
  },
}));

jest.mock('@/services/supabaseAuthService', () => ({
  supabaseAuthService: {
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    getUserProfile: jest.fn(),
    isAuthenticated: jest.fn(),
    onAuthStateChange: jest.fn(),
    validateEmail: jest.fn(),
    validatePassword: jest.fn(),
    validateRangerId: jest.fn(),
  },
}));

describe('AuthServiceFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthService', () => {
    it('should return supabaseAuthService when USE_SUPABASE is true', () => {
      // Mock AppConfig to return true for USE_SUPABASE
      (AppConfig as any).USE_SUPABASE = true;
      
      const service = getAuthService();
      
      // Check if the service has Supabase-specific methods
      expect(service.getUserProfile).toBeDefined();
      expect(service.onAuthStateChange).toBeDefined();
    });

    it('should return authService when USE_SUPABASE is false', () => {
      // Mock AppConfig to return false for USE_SUPABASE
      (AppConfig as any).USE_SUPABASE = false;
      
      const service = getAuthService();
      
      // Check if the service has mock-specific methods (no getUserProfile or onAuthStateChange)
      expect(service.getUserProfile).toBeUndefined();
      expect(service.onAuthStateChange).toBeUndefined();
    });
  });
});
