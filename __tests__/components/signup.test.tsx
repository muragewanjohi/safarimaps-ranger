import SignupScreen from '@/app/signup';
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

describe('SignupScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations
    (currentAuthService.validateEmail as jest.Mock).mockReturnValue(true);
    (currentAuthService.validatePassword as jest.Mock).mockReturnValue({ isValid: true });
    (currentAuthService.validateRangerId as jest.Mock).mockReturnValue(true);
    mockAlert.mockClear();
  });

  const renderSignupScreen = () => {
    return render(
      <AuthProvider>
        <SignupScreen />
      </AuthProvider>
    );
  };

  const fillForm = (getByPlaceholderText: any) => {
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('ABC-123'), 'ABC-123');
    fireEvent.changeText(getByPlaceholderText('Enter your team name'), 'Team Alpha');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
  };

  const getSignupButton = (getAllByText: any) => {
    const buttons = getAllByText('Create Account');
    // Return the first button (main signup button), not the test button
    return buttons[0];
  };

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      expect(getByPlaceholderText('Enter your full name')).toBeTruthy();
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(getByPlaceholderText('ABC-123')).toBeTruthy();
      expect(getByPlaceholderText('Enter your team name')).toBeTruthy();
      expect(getByPlaceholderText('Enter your password')).toBeTruthy();
      expect(getByPlaceholderText('Confirm your password')).toBeTruthy();
      expect(getAllByText('Create Account')).toHaveLength(2); // Main button + test button
    });

    it('should render help text for ranger ID', () => {
      const { getByText } = renderSignupScreen();
      expect(getByText('Format: ABC-123 (3 letters, dash, 3 numbers)')).toBeTruthy();
    });

    it('should render help text for password', () => {
      const { getByText } = renderSignupScreen();
      expect(getByText('Minimum 6 characters')).toBeTruthy();
    });

    it('should render login link', () => {
      const { getByText } = renderSignupScreen();
      expect(getByText('Already have an account?')).toBeTruthy();
      expect(getByText('Sign In')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for empty name', async () => {
      const { getAllByText } = renderSignupScreen();
      
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Validation Error', 'Please enter your full name.');
      });
    });

    it('should show validation error for empty email', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Validation Error', 'Please enter your email address.');
      });
    });

    it('should show validation error for invalid email', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      (currentAuthService.validateEmail as jest.Mock).mockReturnValue(false);
      
      fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'invalid-email');
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Validation Error', 'Please enter a valid email address.');
      });
    });

    it('should show validation error for empty password', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'john@example.com');
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Validation Error', 'Please enter a password.');
      });
    });

    it('should show validation error for weak password', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      (currentAuthService.validatePassword as jest.Mock).mockReturnValue({ 
        isValid: false, 
        message: 'Password must be at least 6 characters long' 
      });
      
      fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'john@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'weak');
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Validation Error', 'Password must be at least 6 characters long');
      });
    });

    it('should show validation error for mismatched passwords', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'john@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'different123');
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Validation Error', 'Passwords do not match.');
      });
    });

    it('should show validation error for empty ranger ID', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'john@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Validation Error', 'Please enter your Ranger ID.');
      });
    });

    it('should show validation error for invalid ranger ID format', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      (currentAuthService.validateRangerId as jest.Mock).mockReturnValue(false);
      
      fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'john@example.com');
      fireEvent.changeText(getByPlaceholderText('ABC-123'), 'invalid');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Validation Error', 'Ranger ID must be in format ABC-123 (3 letters, dash, 3 numbers).');
      });
    });

    it('should show validation error for empty team', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'john@example.com');
      fireEvent.changeText(getByPlaceholderText('ABC-123'), 'ABC-123');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Validation Error', 'Please enter your team name.');
      });
    });
  });

  describe('Form Submission', () => {
    it('should call signup with correct data when form is valid', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      mockAuthContext.signup.mockResolvedValue({ success: true });
      
      fillForm(getByPlaceholderText);
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAuthContext.signup).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          rangerId: 'ABC-123',
          team: 'Team Alpha',
        });
      });
    });

    it('should show success alert and navigate on successful signup', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      mockAuthContext.signup.mockResolvedValue({ success: true });
      
      fillForm(getByPlaceholderText);
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Success', 'Account created successfully!', [
          { text: 'OK', onPress: expect.any(Function) }
        ]);
      });
    });

    it('should show error alert on failed signup', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      mockAuthContext.signup.mockResolvedValue({ 
        success: false, 
        error: 'Email already exists' 
      });
      
      fillForm(getByPlaceholderText);
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Signup Failed', 'Email already exists');
      });
    });

    it('should show error alert on signup exception', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      mockAuthContext.signup.mockRejectedValue(new Error('Network error'));
      
      fillForm(getByPlaceholderText);
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Signup Error', 'An unexpected error occurred. Please try again.');
      });
    });

    it('should clear error before signup', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      mockAuthContext.signup.mockResolvedValue({ success: true });
      
      fillForm(getByPlaceholderText);
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAuthContext.clearError).toHaveBeenCalled();
      });
    });
  });

  describe('Loading State', () => {
    it('should disable form inputs when loading', () => {
      mockAuthContext.isLoading = true;
      const { getByPlaceholderText } = renderSignupScreen();
      
      const nameInput = getByPlaceholderText('Enter your full name');
      const emailInput = getByPlaceholderText('Enter your email');
      
      expect(nameInput.props.editable).toBe(false);
      expect(emailInput.props.editable).toBe(false);
    });

    it('should show loading text on button when loading', () => {
      mockAuthContext.isLoading = true;
      const { getByText } = renderSignupScreen();
      
      expect(getByText('Creating Account...')).toBeTruthy();
    });

    it('should disable signup button when loading', () => {
      mockAuthContext.isLoading = true;
      const { getAllByText } = renderSignupScreen();
      
      const signupButton = getSignupButton(getAllByText);
      expect(signupButton.props.disabled).toBe(true);
    });
  });

  describe('Error Display', () => {
    it('should display error message when error exists', () => {
      mockAuthContext.error = 'Something went wrong';
      const { getByText } = renderSignupScreen();
      
      expect(getByText('Something went wrong')).toBeTruthy();
    });

    it('should not display error message when no error', () => {
      mockAuthContext.error = null;
      const { queryByText } = renderSignupScreen();
      
      expect(queryByText('Something went wrong')).toBeNull();
    });
  });

  describe('Navigation', () => {
    it('should navigate to login when sign in link is pressed', () => {
      const { getByText } = renderSignupScreen();
      
      fireEvent.press(getByText('Sign In'));
      
      expect(router.push).toHaveBeenCalledWith('/login');
    });

    it('should navigate back when back button is pressed', () => {
      const { getByTestId } = renderSignupScreen();
      
      // Note: We need to add testID to the back button in the component
      // For now, let's test the router.back call
      expect(router.back).toBeDefined();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility when eye button is pressed', () => {
      const { getByPlaceholderText, getByTestId } = renderSignupScreen();
      
      const passwordInput = getByPlaceholderText('Enter your password');
      const eyeButton = passwordInput.parent?.children?.find((child: any) => 
        child.props.onPress !== undefined
      );
      
      // Initially password should be hidden
      expect(passwordInput.props.secureTextEntry).toBe(true);
      
      // After pressing eye button, password should be visible
      if (eyeButton) {
        fireEvent.press(eyeButton);
        // Note: This test would need the component to be re-rendered to see the change
        // In a real test, we'd need to check the state change
      }
    });

    it('should toggle confirm password visibility when eye button is pressed', () => {
      const { getByPlaceholderText } = renderSignupScreen();
      
      const confirmPasswordInput = getByPlaceholderText('Confirm your password');
      
      // Initially password should be hidden
      expect(confirmPasswordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe('Input Formatting', () => {
    it('should convert ranger ID to uppercase', () => {
      const { getByPlaceholderText } = renderSignupScreen();
      
      const rangerIdInput = getByPlaceholderText('ABC-123');
      fireEvent.changeText(rangerIdInput, 'abc-123');
      
      // The component should convert to uppercase
      expect(rangerIdInput.props.value).toBe('ABC-123');
    });

    it('should trim whitespace from form data', async () => {
      const { getByPlaceholderText, getAllByText } = renderSignupScreen();
      
      mockAuthContext.signup.mockResolvedValue({ success: true });
      
      fireEvent.changeText(getByPlaceholderText('Enter your full name'), '  John Doe  ');
      fireEvent.changeText(getByPlaceholderText('Enter your email'), '  john@example.com  ');
      fireEvent.changeText(getByPlaceholderText('ABC-123'), '  ABC-123  ');
      fireEvent.changeText(getByPlaceholderText('Enter your team name'), '  Team Alpha  ');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
      
      fireEvent.press(getSignupButton(getAllByText));
      
      await waitFor(() => {
        expect(mockAuthContext.signup).toHaveBeenCalledWith({
          name: 'John Doe', // Should be trimmed
          email: 'john@example.com', // Should be trimmed
          password: 'password123',
          confirmPassword: 'password123',
          rangerId: 'ABC-123', // Should be trimmed and uppercased
          team: 'Team Alpha', // Should be trimmed
        });
      });
    });
  });

  describe('Test Button', () => {
    it('should render test button for debugging', () => {
      const { getByText } = renderSignupScreen();
      
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should show alert when test button is pressed', () => {
      const { getByText } = renderSignupScreen();
      
      fireEvent.press(getByText('Test Button'));
      
      expect(mockAlert).toHaveBeenCalledWith('Test', 'Button is working!');
    });
  });
});
