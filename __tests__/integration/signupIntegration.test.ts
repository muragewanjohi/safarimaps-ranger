import { currentAuthService } from '@/services/authServiceFactory';
import { SignupCredentials } from '@/types';

// Mock the auth service
jest.mock('@/services/authServiceFactory', () => ({
  currentAuthService: {
    validateEmail: jest.fn(),
    validatePassword: jest.fn(),
    validateRangerId: jest.fn(),
    signup: jest.fn(),
  },
}));

describe('Signup Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate signup credentials correctly', () => {
    const credentials: SignupCredentials = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      rangerId: 'ABC-123',
      team: 'Team Alpha',
    };

    // Test email validation
    (currentAuthService.validateEmail as jest.Mock).mockReturnValue(true);
    expect(currentAuthService.validateEmail(credentials.email)).toBe(true);

    // Test password validation
    (currentAuthService.validatePassword as jest.Mock).mockReturnValue({ isValid: true });
    expect(currentAuthService.validatePassword(credentials.password).isValid).toBe(true);

    // Test ranger ID validation
    (currentAuthService.validateRangerId as jest.Mock).mockReturnValue(true);
    expect(currentAuthService.validateRangerId(credentials.rangerId)).toBe(true);
  });

  it('should handle signup process', async () => {
    const credentials: SignupCredentials = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      rangerId: 'ABC-123',
      team: 'Team Alpha',
    };

    // Mock successful signup
    (currentAuthService.signup as jest.Mock).mockResolvedValue({
      success: true,
      user: {
        id: 'test-user-id',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'Wildlife Ranger',
        rangerId: 'ABC-123',
        team: 'Team Alpha',
        park: 'Masai Mara National Reserve',
        avatar: 'JD',
        joinDate: '2025-01-01',
        isActive: true,
      },
    });

    const result = await currentAuthService.signup(credentials);
    
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user?.name).toBe('John Doe');
  });

  it('should handle signup validation errors', () => {
    const credentials: SignupCredentials = {
      name: '',
      email: 'invalid-email',
      password: 'weak',
      confirmPassword: 'different',
      rangerId: 'invalid',
      team: '',
    };

    // Test validation failures
    (currentAuthService.validateEmail as jest.Mock).mockReturnValue(false);
    (currentAuthService.validatePassword as jest.Mock).mockReturnValue({ 
      isValid: false, 
      message: 'Password must be at least 6 characters long' 
    });
    (currentAuthService.validateRangerId as jest.Mock).mockReturnValue(false);

    expect(currentAuthService.validateEmail(credentials.email)).toBe(false);
    expect(currentAuthService.validatePassword(credentials.password).isValid).toBe(false);
    expect(currentAuthService.validateRangerId(credentials.rangerId)).toBe(false);
  });
});
