import { supabase } from '../lib/supabase';
import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../types';

export class SupabaseAuthService {
  // Check if Supabase is available
  private isSupabaseAvailable(): boolean {
    return supabase !== null;
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!this.isSupabaseAvailable()) {
      return { success: false, error: 'Supabase is not configured' };
    }

    try {
      const { data, error } = await supabase!.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Get user profile
        const profile = await this.getUserProfile(data.user.id);
        if (profile) {
          return {
            success: true,
            user: profile,
            token: data.session?.access_token,
            message: 'Login successful'
          };
        } else {
          return { success: false, error: 'Failed to fetch user profile' };
        }
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Signup user
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    if (!this.isSupabaseAvailable()) {
      console.log('Supabase not available for signup');
      return { success: false, error: 'Supabase is not configured' };
    }

    console.log('Starting Supabase signup with credentials:', credentials);

    try {
      // Create auth user with metadata
      const { data: authData, error: authError } = await supabase!.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            role: 'Wildlife Ranger',
            ranger_id: credentials.rangerId,
            team: credentials.team,
            park: 'Masai Mara National Reserve',
            avatar: credentials.name.split(' ').map(n => n[0]).join('').toUpperCase(),
          }
        }
      });

      console.log('Supabase signup response:', { authData, authError });

      if (authError) {
        console.log('Supabase signup error:', authError);
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        console.log('User created successfully, creating temporary user object...');
        
        // For now, create a temporary user object from auth data
        // This will work until we set up the database schema
        const tempUser: User = {
          id: authData.user.id,
          email: authData.user.email || '',
          name: credentials.name,
          role: 'Wildlife Ranger',
          rangerId: credentials.rangerId,
          team: credentials.team,
          park: 'Masai Mara National Reserve',
          avatar: credentials.name.split(' ').map(n => n[0]).join('').toUpperCase(),
          joinDate: new Date().toISOString().split('T')[0],
          isActive: true,
        };

        console.log('Created temporary user:', tempUser);
        
        return {
          success: true,
          user: tempUser,
          token: authData.session?.access_token,
          message: 'Account created successfully'
        };
      }

      console.log('No user data in response');
      return { success: false, error: 'Signup failed' };
    } catch (error) {
      console.error('Supabase signup exception:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Logout user
  async logout(): Promise<AuthResponse> {
    if (!this.isSupabaseAvailable()) {
      return { success: false, error: 'Supabase is not configured' };
    }

    try {
      const { error } = await supabase!.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      return { success: false, error: 'Logout failed' };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    if (!this.isSupabaseAvailable()) {
      return null;
    }

    try {
      const { data: { user } } = await supabase!.auth.getUser();
      if (user) {
        return await this.getUserProfile(user.id);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Get user profile from database
  async getUserProfile(userId: string): Promise<User | null> {
    if (!this.isSupabaseAvailable()) {
      return null;
    }

    try {
      const { data, error } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        email: '', // Will be filled from auth user if needed
        name: data.name,
        role: data.role,
        rangerId: data.ranger_id,
        team: data.team,
        park: data.park,
        avatar: data.avatar,
        joinDate: data.join_date,
        isActive: data.is_active,
      };
    } catch (error) {
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    if (!this.isSupabaseAvailable()) {
      return false;
    }

    const { data: { session } } = await supabase!.auth.getSession();
    return !!session;
  }

  // Get current session
  async getCurrentSession() {
    if (!this.isSupabaseAvailable()) {
      return null;
    }

    const { data: { session } } = await supabase!.auth.getSession();
    return session;
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password: string): { isValid: boolean; message?: string } {
    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    if (password.length > 50) {
      return { isValid: false, message: 'Password must be less than 50 characters' };
    }
    return { isValid: true };
  }

  // Validate ranger ID format
  validateRangerId(rangerId: string): boolean {
    const rangerIdRegex = /^[A-Z]{3}-\d{3}$/;
    return rangerIdRegex.test(rangerId);
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!this.isSupabaseAvailable()) {
      return { data: { subscription: null } };
    }

    return supabase!.auth.onAuthStateChange(callback);
  }

  // Refresh session
  async refreshSession() {
    if (!this.isSupabaseAvailable()) {
      return { data: null, error: 'Supabase is not configured' };
    }

    const { data, error } = await supabase!.auth.refreshSession();
    return { data, error };
  }

  // Reset password
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isSupabaseAvailable()) {
      return { success: false, error: 'Supabase is not configured' };
    }

    try {
      const { error } = await supabase!.auth.resetPasswordForEmail(email, {
        redirectTo: 'safarimap://reset-password',
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to send reset email' };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isSupabaseAvailable()) {
      return { success: false, error: 'Supabase is not configured' };
    }

    try {
      const { error } = await supabase!.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update password' };
    }
  }
}

// Export singleton instance
export const supabaseAuthService = new SupabaseAuthService();
