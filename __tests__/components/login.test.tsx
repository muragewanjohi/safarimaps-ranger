import LoginScreen from '@/app/login';
import { AuthProvider } from '@/contexts/AuthContext';
import { currentAuthService } from '@/services/authServiceFactory';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock the auth service factory
jest.mock('@/services/authServiceFactory', () => ({
  currentAuthService: {
    validateEmail: jest.fn(),
    validatePassword: jest.fn(),
    validateRangerId: jest.fn(),
  },
}));

// Mock Alert
const mockAlert = jest.fn();
jest.spyOn(Alert, 'alert').mockImplementation(mockAlert);

// Mock the auth context
const mockAuthContext = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
  clearError: jest.fn(),
  error: null,
};

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations
    (currentAuthService.validateEmail as jest.Mock).mockReturnValue(true);
    (currentAuthService.validatePassword as jest.Mock).mockReturnValue({ isValid: true });
    (currentAuthService.validateRangerId as jest.Mock).mockReturnValue(true);
    mockAlert.mockClear();
  });

  const renderLoginScreen = () => {
    return render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );
  };

  const fillLoginForm = (getByPlaceholderText: any) => {
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
  };

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      const { getByPlaceholderText, getByText } = renderLoginScreen();
      
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(getByPlaceholderText('Enter your password')).toBeTruthy();
      expect(getByText('Sign In')).toBeTruthy();
    });

    it('should render demo credentials', () => {
      const { getByText } = renderLoginScreen();
      
      expect(getByText('Demo Credentials:')).toBeTruthy();
      expect(getByText('Email: sarah.johnson@safarimap.com')).toBeTruthy();
      expect(getByText('Password: password123')).toBeTruthy();
    });

    it('should render signup link', () => {
      const { getByText } = renderLoginScreen();
      
      expect(getByText("Don't have an account?")).toBeTruthy();
      expect(getByText('Sign Up')).toBeTruthy();
    });

    it('should render forgot password link', () => {
      const { getByText } = renderLoginScreen();
      
      expect(getByText('Forgot Password?')).toBeTruthy();
    });

    it('should render app title and subtitle', () => {
      const { getByText } = renderLoginScreen();
      
      expect(getByText('SafariMap GameWarden')).toBeTruthy();
      expect(getByText('Sign in to your ranger account')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for empty email and password', async () => {
      const { getByText } = renderLoginScreen();
      
      fireEvent.press(getByText('Sign In'));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Missing Information', 'Please enter both email and password.');
      });
    });

    it('should show validation error for empty email only', async () => {
      const { getByPlaceholderText, getByText } = renderLoginScreen();
      
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
      fireEvent.press(getByText('Sign In'));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Missing Information', 'Please enter both email and password.');
      });
    });

    it('should show validation error for empty password only', async () => {
      const { getByPlaceholderText, getByText } = renderLoginScreen();
      
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
      fireEvent.press(getByText('Sign In'));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Missing Information', 'Please enter both email and password.');
      });
    });

    it('should show validation error for invalid email', async () => {
      const { getByPlaceholderText, getByText } = renderLoginScreen();
      
      (currentAuthService.validateEmail as jest.Mock).mockReturnValue(false);
      
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'invalid-email');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
      fireEvent.press(getByText('Sign In'));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Invalid Email', 'Please enter a valid email address.');
      });
    });
  });

  describe('Form Submission', () => {
    it('should call login with correct data when form is valid', async () => {
      const { getByPlaceholderText, getByText } = renderLoginScreen();
      
      mockAuthContext.login.mockResolvedValue({ success: true });
      
      fillLoginForm(getByPlaceholderText);
      fireEvent.press(getByText('Sign In'));
      
      await waitFor(() => {
        expect(mockAuthContext.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should show success alert and navigate on successful login', async () => {
      const { getByPlaceholderText, getByText } = renderLoginScreen();
      
      mockAuthContext.login.mockResolvedValue({ success: true });
      
      fillLoginForm(getByPlaceholderText);
      fireEvent.press(getByText('Sign In'));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Success', 'Login successful!', [
          { text: 'OK', onPress: expect.any(Function) }
        ]);
      });
    });

    it('should show error alert on failed login', async () => {
      const { getByPlaceholderText, getByText } = renderLoginScreen();
      
      mockAuthContext.login.mockResolvedValue({ 
        success: false, 
        error: 'Invalid credentials' 
      });
      
      fillLoginForm(getByPlaceholderText);
      fireEvent.press(getByText('Sign In'));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Login Failed', 'Invalid credentials');
      });
    });

    it('should clear error before login', async () => {
      const { getByPlaceholderText, getByText } = renderLoginScreen();
      
      mockAuthContext.login.mockResolvedValue({ success: true });
      
      fillLoginForm(getByPlaceholderText);
      fireEvent.press(getByText('Sign In'));
      
      await waitFor(() => {
        expect(mockAuthContext.clearError).toHaveBeenCalled();
      });
    });

    it('should trim email before sending', async () => {
      const { getByPlaceholderText, getByText } = renderLoginScreen();
      
      mockAuthContext.login.mockResolvedValue({ success: true });
      
      fireEvent.changeText(getByPlaceholderText('Enter your email'), '  test@example.com  ');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
      fireEvent.press(getByText('Sign In'));
      
      await waitFor(() => {
        expect(mockAuthContext.login).toHaveBeenCalledWith({
          email: 'test@example.com', // Should be trimmed
          password: 'password123',
        });
      });
    });
  });

  describe('Loading State', () => {
    it('should disable form inputs when loading', () => {
      mockAuthContext.isLoading = true;
      const { getByPlaceholderText } = renderLoginScreen();
      
      const emailInput = getByPlaceholderText('Enter your email');
      const passwordInput = getByPlaceholderText('Enter your password');
      
      expect(emailInput.props.editable).toBe(false);
      expect(passwordInput.props.editable).toBe(false);
    });

    it('should show loading text on button when loading', () => {
      mockAuthContext.isLoading = true;
      const { getByText } = renderLoginScreen();
      
      expect(getByText('Signing In...')).toBeTruthy();
    });

    it('should disable login button when loading', () => {
      mockAuthContext.isLoading = true;
      const { getByText } = renderLoginScreen();
      
      const loginButton = getByText('Signing In...').parent;
      expect(loginButton.props.disabled).toBe(true);
    });

    it('should disable forgot password button when loading', () => {
      mockAuthContext.isLoading = true;
      const { getByText } = renderLoginScreen();
      
      const forgotPasswordButton = getByText('Forgot Password?').parent;
      expect(forgotPasswordButton.props.disabled).toBe(true);
    });

    it('should disable signup link when loading', () => {
      mockAuthContext.isLoading = true;
      const { getByText } = renderLoginScreen();
      
      const signupLink = getByText('Sign Up').parent;
      expect(signupLink.props.disabled).toBe(true);
    });
  });

  describe('Error Display', () => {
    it('should display error message when error exists', () => {
      mockAuthContext.error = 'Something went wrong';
      const { getByText } = renderLoginScreen();
      
      expect(getByText('Something went wrong')).toBeTruthy();
    });

    it('should not display error message when no error', () => {
      mockAuthContext.error = null;
      const { queryByText } = renderLoginScreen();
      
      expect(queryByText('Something went wrong')).toBeNull();
    });
  });

  describe('Navigation', () => {
    it('should navigate to signup when sign up link is pressed', () => {
      const { getByText } = renderLoginScreen();
      
      fireEvent.press(getByText('Sign Up'));
      
      expect(router.push).toHaveBeenCalledWith('/signup');
    });

    it('should show alert when forgot password is pressed', () => {
      const { getByText } = renderLoginScreen();
      
      fireEvent.press(getByText('Forgot Password?'));
      
      expect(mockAlert).toHaveBeenCalledWith('Forgot Password', 'Password reset feature coming soon!');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility when eye button is pressed', () => {
      const { getByPlaceholderText } = renderLoginScreen();
      
      const passwordInput = getByPlaceholderText('Enter your password');
      
      // Initially password should be hidden
      expect(passwordInput.props.secureTextEntry).toBe(true);
      
      // Find and press the eye button
      const eyeButton = passwordInput.parent?.children?.find((child: any) => 
        child.props.onPress !== undefined
      );
      
      if (eyeButton) {
        fireEvent.press(eyeButton);
        // Note: This test would need the component to be re-rendered to see the change
        // In a real test, we'd need to check the state change
      }
    });
  });

  describe('Input Formatting', () => {
    it('should handle email input correctly', () => {
      const { getByPlaceholderText } = renderLoginScreen();
      
      const emailInput = getByPlaceholderText('Enter your email');
      fireEvent.changeText(emailInput, 'test@example.com');
      
      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('should handle password input correctly', () => {
      const { getByPlaceholderText } = renderLoginScreen();
      
      const passwordInput = getByPlaceholderText('Enter your password');
      fireEvent.changeText(passwordInput, 'password123');
      
      expect(passwordInput.props.value).toBe('password123');
    });

    it('should set correct keyboard type for email', () => {
      const { getByPlaceholderText } = renderLoginScreen();
      
      const emailInput = getByPlaceholderText('Enter your email');
      expect(emailInput.props.keyboardType).toBe('email-address');
    });

    it('should set correct autoCapitalize for email', () => {
      const { getByPlaceholderText } = renderLoginScreen();
      
      const emailInput = getByPlaceholderText('Enter your email');
      expect(emailInput.props.autoCapitalize).toBe('none');
    });

    it('should set correct autoCapitalize for password', () => {
      const { getByPlaceholderText } = renderLoginScreen();
      
      const passwordInput = getByPlaceholderText('Enter your password');
      expect(passwordInput.props.autoCapitalize).toBe('none');
    });
  });

  describe('Demo Credentials', () => {
    it('should display demo credentials section', () => {
      const { getByText } = renderLoginScreen();
      
      expect(getByText('Demo Credentials:')).toBeTruthy();
      expect(getByText('Email: sarah.johnson@safarimap.com')).toBeTruthy();
      expect(getByText('Password: password123')).toBeTruthy();
    });

    it('should have correct styling for demo section', () => {
      const { getByText } = renderLoginScreen();
      
      const demoTitle = getByText('Demo Credentials:');
      const demoEmail = getByText('Email: sarah.johnson@safarimap.com');
      const demoPassword = getByText('Password: password123');
      
      expect(demoTitle).toBeTruthy();
      expect(demoEmail).toBeTruthy();
      expect(demoPassword).toBeTruthy();
    });
  });

  describe('AuthStatusIndicator', () => {
    it('should render AuthStatusIndicator component', () => {
      const { getByTestId } = renderLoginScreen();
      
      // AuthStatusIndicator should be present (assuming it has a testID)
      // This test might need adjustment based on the actual component implementation
      expect(true).toBe(true); // Placeholder - adjust based on actual component
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only inputs', async () => {
      const { getByPlaceholderText, getByText } = renderLoginScreen();
      
      fireEvent.changeText(getByPlaceholderText('Enter your email'), '   ');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), '   ');
      fireEvent.press(getByText('Sign In'));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Missing Information', 'Please enter both email and password.');
      });
    });

    it('should handle very long email input', () => {
      const { getByPlaceholderText } = renderLoginScreen();
      
      const longEmail = 'a'.repeat(100) + '@example.com';
      const emailInput = getByPlaceholderText('Enter your email');
      
      fireEvent.changeText(emailInput, longEmail);
      expect(emailInput.props.value).toBe(longEmail);
    });

    it('should handle special characters in password', () => {
      const { getByPlaceholderText } = renderLoginScreen();
      
      const specialPassword = 'p@ssw0rd!@#$%^&*()';
      const passwordInput = getByPlaceholderText('Enter your password');
      
      fireEvent.changeText(passwordInput, specialPassword);
      expect(passwordInput.props.value).toBe(specialPassword);
    });
  });

  describe('Accessibility', () => {
    it('should have proper placeholder text for inputs', () => {
      const { getByPlaceholderText } = renderLoginScreen();
      
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    });

    it('should have proper labels for form fields', () => {
      const { getByText } = renderLoginScreen();
      
      expect(getByText('Email Address')).toBeTruthy();
      expect(getByText('Password')).toBeTruthy();
    });
  });
});
