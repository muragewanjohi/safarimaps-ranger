import { AuthService } from '@/services/authService';

describe('AuthService', () => {
  let authService: AuthService;

  // Mock data
  const createMockUser = (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'Wildlife Ranger',
    rangerId: 'RGR-001',
    team: 'Alpha Team',
    park: 'Masai Mara National Reserve',
    avatar: 'TU',
    joinDate: '2023-01-01',
    isActive: true,
    ...overrides,
  });

  const createMockLoginCredentials = (overrides = {}) => ({
    email: 'sarah.johnson@safarimap.com',
    password: 'password123',
    ...overrides,
  });

  const createMockSignupCredentials = (overrides = {}) => ({
    name: 'Test User',
    email: `testuser${Date.now()}@safarimap.com`,
    password: 'password123',
    confirmPassword: 'password123',
    rangerId: `RGR-${String(Date.now()).slice(-3)}`,
    team: 'Alpha Team',
    ...overrides,
  });

  beforeEach(() => {
    authService = AuthService.getInstance();
    // Reset the singleton's state before each test for proper isolation
    authService.reset();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton pattern)', () => {
      const instance1 = AuthService.getInstance();
      const instance2 = AuthService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@numbers.com',
      ];

      validEmails.forEach(email => {
        expect(authService.validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user.domain.com',
        '',
        '   ',
        'user@.com',
      ];

      invalidEmails.forEach(email => {
        expect(authService.validateEmail(email)).toBe(false);
      });
    });
  });

  describe('validatePassword', () => {
    it('should accept valid passwords', () => {
      const validPasswords = [
        'password123',
        'SecurePass!',
        '123456789',
        'VeryLongPassword123!@#',
      ];

      validPasswords.forEach(password => {
        const result = authService.validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.message).toBeUndefined();
      });
    });

    it('should reject passwords that are too short', () => {
      const shortPasswords = ['12345', 'abc', ''];

      shortPasswords.forEach(password => {
        const result = authService.validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('at least 6 characters');
      });
    });

    it('should reject passwords that are too long', () => {
      const longPassword = 'a'.repeat(51);
      const result = authService.validatePassword(longPassword);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('less than 50 characters');
    });
  });

  describe('validateRangerId', () => {
    it('should accept valid ranger ID format', () => {
      const validRangerIds = [
        'ABC-123',
        'XYZ-789',
        'RGR-001',
        'ADM-999',
      ];

      validRangerIds.forEach(rangerId => {
        expect(authService.validateRangerId(rangerId)).toBe(true);
      });
    });

    it('should reject invalid ranger ID format', () => {
      const invalidRangerIds = [
        'ABC123',    // Missing dash
        'ABC-12',    // Only 2 numbers
        'AB-123',    // Only 2 letters
        'ABC-1234',  // 4 numbers
        'ABCD-123',  // 4 letters
        'abc-123',   // Lowercase
        '123-ABC',   // Numbers first
        '',
        '   ',
      ];

      invalidRangerIds.forEach(rangerId => {
        expect(authService.validateRangerId(rangerId)).toBe(false);
      });
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const credentials = createMockLoginCredentials();
      const result = await authService.login(credentials);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.message).toBe('Login successful');
      expect(result.user?.email).toBe(credentials.email);
    });

    it('should reject login with invalid email', async () => {
      const credentials = { ...createMockLoginCredentials(), email: 'invalid-email' };
      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });

    it('should reject login with invalid password', async () => {
      const credentials = { ...createMockLoginCredentials(), password: 'wrongpassword' };
      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid password');
    });

    it('should reject login with empty credentials', async () => {
      const emptyCredentials = { email: '', password: '' };
      const result = await authService.login(emptyCredentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });
  });

  describe('signup', () => {
    it('should successfully create account with valid credentials', async () => {
      const credentials = createMockSignupCredentials();
      const result = await authService.signup(credentials);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.message).toBe('Account created successfully');
      expect(result.user?.name).toBe(credentials.name);
      expect(result.user?.rangerId).toBe(credentials.rangerId);
    });

    it('should reject signup with existing email', async () => {
      // Use an email that already exists in mock data
      const credentials = { 
        ...createMockSignupCredentials(), 
        email: 'sarah.johnson@safarimap.com',
        rangerId: 'RGR-999'
      };
      const result = await authService.signup(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User with this email already exists');
    });

    it('should reject signup with existing ranger ID', async () => {
      // Use a ranger ID that already exists in mock data
      const credentials = { 
        ...createMockSignupCredentials(), 
        rangerId: 'RGR-001',
        email: 'newranger@safarimap.com'
      };
      const result = await authService.signup(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Ranger ID already exists');
    });

    it('should reject signup with mismatched passwords', async () => {
      const credentials = { ...createMockSignupCredentials(), confirmPassword: 'different' };
      const result = await authService.signup(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });

    it('should reject signup with weak password', async () => {
      const credentials = { 
        ...createMockSignupCredentials(), 
        password: '123',
        confirmPassword: '123' // Ensure both passwords match
      };
      const result = await authService.signup(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Password must be at least 6 characters long');
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      // First login to set current user
      const credentials = createMockLoginCredentials();
      await authService.login(credentials);

      // Then logout
      const result = await authService.logout();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Logged out successfully');
    });

    it('should clear user state after logout', async () => {
      // First login to set current user
      const credentials = createMockLoginCredentials();
      await authService.login(credentials);

      // Verify user is logged in
      const isAuthBefore = await authService.isAuthenticated();
      expect(isAuthBefore).toBe(true);

      // Logout
      await authService.logout();

      // Verify user is logged out
      const isAuthAfter = await authService.isAuthenticated();
      expect(isAuthAfter).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when logged in', async () => {
      const credentials = createMockLoginCredentials();
      await authService.login(credentials);

      const currentUser = await authService.getCurrentUser();
      expect(currentUser).toBeDefined();
      expect(currentUser?.email).toBe(credentials.email);
    });

    it('should return null when not logged in', async () => {
      const currentUser = await authService.getCurrentUser();
      expect(currentUser).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is logged in', async () => {
      const credentials = createMockLoginCredentials();
      await authService.login(credentials);

      const isAuth = await authService.isAuthenticated();
      expect(isAuth).toBe(true);
    });

    it('should return false when user is not logged in', async () => {
      const isAuth = await authService.isAuthenticated();
      expect(isAuth).toBe(false);
    });
  });

  describe('getAuthToken', () => {
    it('should return auth token when logged in', async () => {
      const credentials = createMockLoginCredentials();
      await authService.login(credentials);

      const token = authService.getAuthToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token).toContain('mock_jwt_token');
    });

    it('should return null when not logged in', () => {
      const token = authService.getAuthToken();
      expect(token).toBeNull();
    });
  });
});
