import { AppConfig } from '../config/appConfig';
import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../types';

// Mock users for authentication
const mockUsers: User[] = [
  {
    id: 'user_001',
    email: 'sarah.johnson@safarimap.com',
    name: 'Sarah Johnson',
    role: 'Senior Wildlife Ranger',
    rangerId: 'RGR-001',
    team: 'Alpha Team',
    park: 'Masai Mara National Reserve',
    avatar: 'SJ',
    joinDate: '2019-03-15',
    isActive: true
  },
  {
    id: 'user_002',
    email: 'admin@safarimap.com',
    name: 'Admin User',
    role: 'System Administrator',
    rangerId: 'ADM-001',
    team: 'Management',
    park: 'Masai Mara National Reserve',
    avatar: 'AU',
    joinDate: '2018-01-01',
    isActive: true
  }
];

// Mock passwords (in real app, these would be hashed)
const mockPasswords: Record<string, string> = {
  'sarah.johnson@safarimap.com': 'password123',
  'admin@safarimap.com': 'admin123'
};

// Configuration
const USE_MOCK_AUTH = AppConfig.USE_MOCK_DATA; // Use app configuration
const API_DELAY = 1000; // Simulate network delay

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock JWT token
const generateMockToken = (userId: string): string => {
  return `mock_jwt_token_${userId}_${Date.now()}`;
};

// Authentication Service Class
export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private authToken: string | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Reset the service state (useful for testing)
   */
  reset(): void {
    this.currentUser = null;
    this.authToken = null;
    this.mockUsers = [
      {
        id: '1',
        email: 'sarah.johnson@safarimap.com',
        name: 'Sarah Johnson',
        rangerId: 'RGR-001',
        team: 'Alpha Team',
        role: 'ranger',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
      {
        id: '2',
        email: 'mike.chen@safarimap.com',
        name: 'Mike Chen',
        rangerId: 'RGR-002',
        team: 'Beta Team',
        role: 'ranger',
        createdAt: '2023-01-02T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      },
    ];
    this.mockPasswords = {
      'sarah.johnson@safarimap.com': 'password123',
      'mike.chen@safarimap.com': 'password123',
    };
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK_AUTH) {
      await delay(API_DELAY);
      
      // Find user by email
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Check password
      const storedPassword = mockPasswords[credentials.email];
      if (!storedPassword || storedPassword !== credentials.password) {
        return {
          success: false,
          error: 'Invalid password'
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is deactivated'
        };
      }

      // Generate token
      const token = generateMockToken(user.id);
      
      // Store user and token
      this.currentUser = user;
      this.authToken = token;

      return {
        success: true,
        user,
        token,
        message: 'Login successful'
      };
    }

    // Real API call would go here
    throw new Error('Real authentication API not implemented yet');
  }

  // Signup user
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    if (USE_MOCK_AUTH) {
      await delay(API_DELAY);

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === credentials.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      // Check if ranger ID already exists
      const existingRanger = mockUsers.find(u => u.rangerId === credentials.rangerId);
      if (existingRanger) {
        return {
          success: false,
          error: 'Ranger ID already exists'
        };
      }

      // Validate password match
      if (credentials.password !== credentials.confirmPassword) {
        return {
          success: false,
          error: 'Passwords do not match'
        };
      }

      // Validate password strength
      if (credentials.password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters long'
        };
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: credentials.email,
        name: credentials.name,
        role: 'Wildlife Ranger', // Default role for new signups
        rangerId: credentials.rangerId,
        team: credentials.team,
        park: 'Masai Mara National Reserve', // Default park
        avatar: credentials.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        joinDate: new Date().toISOString().split('T')[0],
        isActive: true
      };

      // Add to mock users
      mockUsers.push(newUser);
      mockPasswords[credentials.email] = credentials.password;

      // Generate token
      const token = generateMockToken(newUser.id);
      
      // Store user and token
      this.currentUser = newUser;
      this.authToken = token;

      return {
        success: true,
        user: newUser,
        token,
        message: 'Account created successfully'
      };
    }

    // Real API call would go here
    throw new Error('Real authentication API not implemented yet');
  }

  // Logout user
  async logout(): Promise<AuthResponse> {
    if (USE_MOCK_AUTH) {
      await delay(API_DELAY);
      
      this.currentUser = null;
      this.authToken = null;

      return {
        success: true,
        message: 'Logged out successfully'
      };
    }

    // Real API call would go here
    throw new Error('Real authentication API not implemented yet');
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  // Get auth token
  getAuthToken(): string | null {
    return this.authToken;
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    return this.currentUser !== null && this.authToken !== null;
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

  // Real API call method (for future use)
  private async apiCall<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<T> {
    try {
      const url = `${process.env.EXPO_PUBLIC_API_URL || 'https://api.safarimap.com'}${endpoint}`;
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` })
        }
      };

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'API call failed');
      }

      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Network error');
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    if (USE_MOCK_AUTH) {
      await delay(API_DELAY);
      
      // Check if user exists
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        return { success: false, error: 'No account found with this email address' };
      }

      // In a real app, this would send an email
      // For mock, we'll just return success
      return { success: true };
    }

    // Real API call would go here
    throw new Error('Real password reset API not implemented yet');
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
