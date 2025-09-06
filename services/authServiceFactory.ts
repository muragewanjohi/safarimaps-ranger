import { AppConfig } from '../config/appConfig';
import { authService } from './authService';
import { supabaseAuthService } from './supabaseAuthService';

// Create a unified interface that both services implement
export interface UnifiedAuthService {
  login: (credentials: any) => Promise<any>;
  signup: (credentials: any) => Promise<any>;
  logout: () => Promise<any>;
  getCurrentUser: () => Promise<any>;
  getUserProfile?: (userId: string) => Promise<any>;
  isAuthenticated: () => Promise<boolean>;
  onAuthStateChange?: (callback: any) => any;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => any;
  validateRangerId: (rangerId: string) => boolean;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

// Factory to get the appropriate auth service based on configuration
export function getAuthService(): UnifiedAuthService {
  if (AppConfig.USE_SUPABASE) {
    return supabaseAuthService;
  }
  return authService;
}

// Export the current auth service
export const currentAuthService = getAuthService();
