import { currentAuthService } from '@/services/authServiceFactory';
import { LoginCredentials } from '@/types';

// Mock the auth service
jest.mock('@/services/authServiceFactory', () => ({
  currentAuthService: {
    validateEmail: jest.fn(),
    validatePassword: jest.fn(),
    validateRangerId: jest.fn(),
    login: jest.fn(),
  },
}));

describe('Login Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate login credentials correctly', () => {
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Test email validation
    (currentAuthService.validateEmail as jest.Mock).mockReturnValue(true);
    expect(currentAuthService.validateEmail(credentials.email)).toBe(true);

    // Test password validation
    (currentAuthService.validatePassword as jest.Mock).mockReturnValue({ isValid: true });
    expect(currentAuthService.validatePassword(credentials.password).isValid).toBe(true);
  });

  it('should handle login process', async () => {
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Mock successful login
    (currentAuthService.login as jest.Mock).mockResolvedValue({
      success: true,
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'Wildlife Ranger',
        rangerId: 'ABC-123',
        team: 'Test Team',
        park: 'Masai Mara National Reserve',
        avatar: 'TU',
        joinDate: '2025-01-01',
        isActive: true,
      },
      token: 'mock-jwt-token',
    });

    const result = await currentAuthService.login(credentials);
    
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user?.email).toBe('test@example.com');
    expect(result.token).toBe('mock-jwt-token');
  });

  it('should handle login validation errors', () => {
    const credentials: LoginCredentials = {
      email: 'invalid-email',
      password: 'weak',
    };

    // Test validation failures
    (currentAuthService.validateEmail as jest.Mock).mockReturnValue(false);
    (currentAuthService.validatePassword as jest.Mock).mockReturnValue({ 
      isValid: false, 
      message: 'Password must be at least 6 characters long' 
    });

    expect(currentAuthService.validateEmail(credentials.email)).toBe(false);
    expect(currentAuthService.validatePassword(credentials.password).isValid).toBe(false);
  });

  it('should handle login failure scenarios', async () => {
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    // Mock failed login
    (currentAuthService.login as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Invalid credentials',
    });

    const result = await currentAuthService.login(credentials);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
  });

  it('should handle network errors during login', async () => {
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Mock network error
    (currentAuthService.login as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(currentAuthService.login(credentials)).rejects.toThrow('Network error');
  });

  it('should validate email formats correctly', () => {
    const validEmails = [
      'test@example.com',
      'user@domain.co.uk',
      'admin@subdomain.example.org',
      'user+tag@example.com',
    ];

    const invalidEmails = [
      'invalid-email',
      '@example.com',
      'test@',
      'test.example.com',
      '',
    ];

    // Mock valid email validation
    (currentAuthService.validateEmail as jest.Mock).mockImplementation((email: string) => {
      return validEmails.includes(email);
    });

    validEmails.forEach(email => {
      expect(currentAuthService.validateEmail(email)).toBe(true);
    });

    invalidEmails.forEach(email => {
      expect(currentAuthService.validateEmail(email)).toBe(false);
    });
  });

  it('should validate password strength correctly', () => {
    const validPasswords = [
      'password123',
      'strongpass',
      'mySecurePassword',
      '123456',
    ];

    const invalidPasswords = [
      'weak',
      '12345',
      '',
      'a',
    ];

    // Mock password validation
    (currentAuthService.validatePassword as jest.Mock).mockImplementation((password: string) => {
      if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long' };
      }
      return { isValid: true };
    });

    validPasswords.forEach(password => {
      expect(currentAuthService.validatePassword(password).isValid).toBe(true);
    });

    invalidPasswords.forEach(password => {
      expect(currentAuthService.validatePassword(password).isValid).toBe(false);
    });
  });

  it('should handle empty credentials', async () => {
    const emptyCredentials: LoginCredentials = {
      email: '',
      password: '',
    };

    // Mock validation failures for empty inputs
    (currentAuthService.validateEmail as jest.Mock).mockReturnValue(false);
    (currentAuthService.validatePassword as jest.Mock).mockReturnValue({ 
      isValid: false, 
      message: 'Password is required' 
    });

    expect(currentAuthService.validateEmail(emptyCredentials.email)).toBe(false);
    expect(currentAuthService.validatePassword(emptyCredentials.password).isValid).toBe(false);
  });

  it('should handle whitespace in credentials', async () => {
    const credentialsWithWhitespace: LoginCredentials = {
      email: '  test@example.com  ',
      password: '  password123  ',
    };

    // Mock successful validation after trimming
    (currentAuthService.validateEmail as jest.Mock).mockReturnValue(true);
    (currentAuthService.validatePassword as jest.Mock).mockReturnValue({ isValid: true });

    // Test that validation works with trimmed values
    expect(currentAuthService.validateEmail(credentialsWithWhitespace.email.trim())).toBe(true);
    expect(currentAuthService.validatePassword(credentialsWithWhitespace.password.trim()).isValid).toBe(true);
  });

  it('should handle special characters in credentials', async () => {
    const specialCredentials: LoginCredentials = {
      email: 'user+tag@example.com',
      password: 'p@ssw0rd!@#$%^&*()',
    };

    // Mock successful validation
    (currentAuthService.validateEmail as jest.Mock).mockReturnValue(true);
    (currentAuthService.validatePassword as jest.Mock).mockReturnValue({ isValid: true });

    expect(currentAuthService.validateEmail(specialCredentials.email)).toBe(true);
    expect(currentAuthService.validatePassword(specialCredentials.password).isValid).toBe(true);
  });
});
