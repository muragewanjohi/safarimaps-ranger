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
            role: credentials.role || 'Ranger',
            ranger_id: credentials.rangerId || null,
            team: credentials.team || null,
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
        console.log('User created successfully, waiting for profile creation...');
        
        // Wait a moment for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the created profile (trigger should have created it)
        const { data: profile, error: profileError } = await supabase!
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        
        if (profileError || !profile) {
          console.log('Profile not found after user creation:', profileError);
          // Try to create profile manually as fallback
          const { data: profileResult, error: manualProfileError } = await supabase!
            .rpc('create_user_profile', {
              user_id: authData.user.id,
              user_name: credentials.name,
              user_email: credentials.email,
              user_role: credentials.role || 'Ranger',
              ranger_id: credentials.rangerId || null,
              team: credentials.team || null
            });
          
          if (manualProfileError || !profileResult) {
            console.log('Manual profile creation also failed:', manualProfileError);
            return { 
              success: false, 
              error: 'Failed to create user profile. Please try again.' 
            };
          }
          
          // Fetch the manually created profile
          const { data: manualProfile, error: fetchError } = await supabase!
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();
          
          if (fetchError || !manualProfile) {
            console.log('Failed to fetch manually created profile:', fetchError);
            return { 
              success: false, 
              error: 'Profile created but failed to fetch. Please try logging in.' 
            };
          }
          
          // Use the manually created profile
          const user: User = {
            id: manualProfile.id,
            email: manualProfile.email || authData.user.email || '',
            name: manualProfile.name,
            role: manualProfile.role,
            rangerId: manualProfile.ranger_id,
            team: manualProfile.team,
            park: 'Masai Mara National Reserve',
            avatar: manualProfile.avatar,
            joinDate: manualProfile.join_date,
            isActive: manualProfile.is_active,
          };

          console.log('Created user from manually created profile:', user);
          
          return {
            success: true,
            user: user,
            token: authData.session?.access_token,
            message: 'Account created successfully'
          };
        }
        
        console.log('Profile created by trigger:', profile);
        
        // Create user object from profile data
        const user: User = {
          id: profile.id,
          email: profile.email || authData.user.email || '',
          name: profile.name,
          role: profile.role,
          rangerId: profile.ranger_id,
          team: profile.team,
          park: 'Masai Mara National Reserve', // This will be updated when we implement park selection
          avatar: profile.avatar,
          joinDate: profile.join_date,
          isActive: profile.is_active,
        };

        console.log('Created user from trigger-created profile:', user);
        
        return {
          success: true,
          user: user,
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

      if (error || !data) {
        // If profile doesn't exist, try to create one
        console.log('Profile not found, attempting to create one...');
        return await this.createProfileForExistingUser(userId);
      }

      return {
        id: data.id,
        email: data.email || '',
        name: data.name,
        role: data.role,
        rangerId: data.ranger_id,
        team: data.team,
        park: 'Masai Mara National Reserve', // Default park
        avatar: data.avatar,
        joinDate: data.join_date,
        isActive: data.is_active,
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Create profile for existing user who doesn't have one
  private async createProfileForExistingUser(userId: string): Promise<User | null> {
    if (!this.isSupabaseAvailable()) {
      return null;
    }

    try {
      // Get user data from auth
      const { data: { user }, error: userError } = await supabase!.auth.getUser();
      
      if (userError || !user) {
        console.log('Could not fetch user data:', userError);
        return null;
      }

      // Create profile using the helper function
      const { data: profileResult, error: profileError } = await supabase!
        .rpc('create_user_profile', {
          user_id: userId,
          user_name: user.user_metadata?.name || 'New User',
          user_email: user.email || '',
          user_role: 'Visitor', // Default to visitor for existing users
          ranger_id: null,
          team: null
        });
      
      if (profileError || !profileResult) {
        console.log('Failed to create profile for existing user:', profileError);
        return null;
      }

      // Fetch the created profile
      const { data: profile, error: fetchError } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError || !profile) {
        console.log('Failed to fetch created profile:', fetchError);
        return null;
      }

      return {
        id: profile.id,
        email: profile.email || user.email || '',
        name: profile.name,
        role: profile.role,
        rangerId: profile.ranger_id,
        team: profile.team,
        park: 'Masai Mara National Reserve',
        avatar: profile.avatar,
        joinDate: profile.join_date,
        isActive: profile.is_active,
      };
    } catch (error) {
      console.error('Error creating profile for existing user:', error);
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
