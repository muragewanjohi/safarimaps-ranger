import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { currentAuthService } from '../services/authServiceFactory';
import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (credentials: SignupCredentials) => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
  clearError: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on app start and listen to auth changes
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await currentAuthService.getCurrentUser();
        const isAuth = await currentAuthService.isAuthenticated();
        if (currentUser && isAuth) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial auth check
    checkAuthStatus();

    // Listen to auth state changes (only for Supabase)
    let subscription: any = null;
    if (currentAuthService.onAuthStateChange) {
      const { data: { subscription: sub } } = currentAuthService.onAuthStateChange(
        async (event: string, session: any) => {
          console.log('Auth state changed:', event, session?.user?.id);
          
          if (event === 'SIGNED_IN' && session?.user) {
            const user = await currentAuthService.getUserProfile(session.user.id);
            if (user) {
              setUser(user);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            const user = await currentAuthService.getUserProfile(session.user.id);
            if (user) {
              setUser(user);
            }
          }
        }
      );
      subscription = sub;
    }

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await currentAuthService.login(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        setError(response.error || 'Login failed');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await currentAuthService.signup(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        setError(response.error || 'Signup failed');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await currentAuthService.logout();
      
      if (response.success) {
        setUser(null);
      } else {
        setError(response.error || 'Logout failed');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    clearError,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
