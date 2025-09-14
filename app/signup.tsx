import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { currentAuthService } from '@/services/authServiceFactory';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const { signup, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rangerId: '',
    team: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});

  // Clear any previous errors when component mounts
  React.useEffect(() => {
    clearError();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData]);
  };

  const validateField = (field: string, value: string) => {
    let error = '';

    switch (field) {
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email address is required';
        } else if (!currentAuthService.validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value.trim()) {
          error = 'Password is required';
        } else {
          const passwordValidation = currentAuthService.validatePassword(value);
          if (!passwordValidation.isValid) {
            error = passwordValidation.message || 'Invalid password';
          }
        }
        break;
      case 'confirmPassword':
        if (!value.trim()) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
    }

    setFieldErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = () => {
    const fields = ['name', 'email', 'password', 'confirmPassword'];
    let isValid = true;
    const newErrors: {[key: string]: string} = {};

    // Mark all fields as touched
    const newTouchedFields: {[key: string]: boolean} = {};
    fields.forEach(field => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);

    // Validate each field
    fields.forEach(field => {
      const fieldValue = formData[field as keyof typeof formData];
      const fieldValid = validateField(field, fieldValue);
      if (!fieldValid) {
        isValid = false;
        newErrors[field] = fieldErrors[field];
      }
    });

    if (!isValid) {
      setFieldErrors(newErrors);
    }

    return isValid;
  };

  const handleSignup = async () => {
    console.log('handleSignup called');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed, starting signup...');
    clearError();
    
    console.log('Starting signup process...');
    console.log('Form data:', formData);
    
    try {
      console.log('Calling signup function...');
      const response = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'Ranger',
        rangerId: formData.rangerId.trim() || undefined,
        team: formData.team.trim() || undefined
      });
      
      console.log('Signup response:', response);
      console.log('Response success value:', response.success);
      console.log('Response success type:', typeof response.success);
      
      // Only navigate if signup was truly successful
      if (response.success === true) {
        console.log('Signup successful, navigating to main app...');
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        // Stay on signup page and show error
        console.log('Signup failed, staying on signup page');
        console.log('Error message:', response.error);
        Alert.alert(
          'Signup Failed', 
          response.error || 'Please check your information and try again.',
          [{ text: 'OK' }] // No navigation, just dismiss the alert
        );
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Stay on signup page and show error
      Alert.alert(
        'Signup Error', 
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }] // No navigation, just dismiss the alert
      );
    }
  };

  const handleLoginPress = () => {
    router.push('/login');
  };

  const getInputContainerStyle = (field: string) => {
    const hasError = touchedFields[field] && fieldErrors[field];
    return [
      styles.inputContainer,
      hasError && styles.inputContainerError
    ];
  };

  const getInputLabelStyle = (field: string) => {
    const hasError = touchedFields[field] && fieldErrors[field];
    return [
      styles.inputLabel,
      hasError && styles.inputLabelError
    ];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <IconSymbol name="chevron.left" size={24} color="#666" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <ThemedText style={styles.title}>Create Ranger Account</ThemedText>
            <ThemedText style={styles.subtitle}>Join the SafariMap GameWarden team</ThemedText>
          </View>

          {/* Signup Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <ThemedText style={getInputLabelStyle('name')}>Full Name</ThemedText>
              <View style={getInputContainerStyle('name')}>
                <IconSymbol 
                  name="person.fill" 
                  size={20} 
                  color={touchedFields.name && fieldErrors.name ? "#ff6b6b" : "#666"} 
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  onBlur={() => handleFieldBlur('name')}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {touchedFields.name && fieldErrors.name && (
                <ThemedText style={styles.fieldErrorText}>{fieldErrors.name}</ThemedText>
              )}
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={getInputLabelStyle('email')}>Email Address</ThemedText>
              <View style={getInputContainerStyle('email')}>
                <IconSymbol 
                  name="envelope.fill" 
                  size={20} 
                  color={touchedFields.email && fieldErrors.email ? "#ff6b6b" : "#666"} 
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  onBlur={() => handleFieldBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {touchedFields.email && fieldErrors.email && (
                <ThemedText style={styles.fieldErrorText}>{fieldErrors.email}</ThemedText>
              )}
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Ranger ID (Optional)</ThemedText>
              <View style={styles.inputContainer}>
                <IconSymbol name="badge.plus.radiowaves.right" size={20} color="#666" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your ranger ID"
                  placeholderTextColor="#999"
                  value={formData.rangerId}
                  onChangeText={(value) => handleInputChange('rangerId', value)}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              <ThemedText style={styles.helpText}>Leave blank if you don't have a ranger ID yet</ThemedText>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Team (Optional)</ThemedText>
              <View style={styles.inputContainer}>
                <IconSymbol name="person.2.fill" size={20} color="#666" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your team name"
                  placeholderTextColor="#999"
                  value={formData.team}
                  onChangeText={(value) => handleInputChange('team', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              <ThemedText style={styles.helpText}>Leave blank if you're not part of a team yet</ThemedText>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={getInputLabelStyle('password')}>Password</ThemedText>
              <View style={getInputContainerStyle('password')}>
                <IconSymbol 
                  name="lock.fill" 
                  size={20} 
                  color={touchedFields.password && fieldErrors.password ? "#ff6b6b" : "#666"} 
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  onBlur={() => handleFieldBlur('password')}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <IconSymbol 
                    name={showPassword ? "eye.slash.fill" : "eye.fill"} 
                    size={20} 
                    color={touchedFields.password && fieldErrors.password ? "#ff6b6b" : "#666"} 
                  />
                </TouchableOpacity>
              </View>
              {touchedFields.password && fieldErrors.password ? (
                <ThemedText style={styles.fieldErrorText}>{fieldErrors.password}</ThemedText>
              ) : (
                <ThemedText style={styles.helpText}>Minimum 6 characters</ThemedText>
              )}
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={getInputLabelStyle('confirmPassword')}>Confirm Password</ThemedText>
              <View style={getInputContainerStyle('confirmPassword')}>
                <IconSymbol 
                  name="lock.fill" 
                  size={20} 
                  color={touchedFields.confirmPassword && fieldErrors.confirmPassword ? "#ff6b6b" : "#666"} 
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  onBlur={() => handleFieldBlur('confirmPassword')}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <IconSymbol 
                    name={showConfirmPassword ? "eye.slash.fill" : "eye.fill"} 
                    size={20} 
                    color={touchedFields.confirmPassword && fieldErrors.confirmPassword ? "#ff6b6b" : "#666"} 
                  />
                </TouchableOpacity>
              </View>
              {touchedFields.confirmPassword && fieldErrors.confirmPassword && (
                <ThemedText style={styles.fieldErrorText}>{fieldErrors.confirmPassword}</ThemedText>
              )}
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#ff6b6b" />
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            )}

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <ThemedText style={styles.signupButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </ThemedText>
            </TouchableOpacity>

          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <ThemedText style={styles.loginText}>Already have an account? </ThemedText>
            <TouchableOpacity onPress={handleLoginPress} disabled={isLoading}>
              <ThemedText style={styles.loginLink}>Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  logo: {
    width: 45,
    height: 45,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  inputContainerError: {
    borderColor: '#ff6b6b',
    backgroundColor: '#fff5f5',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  eyeButton: {
    padding: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  fieldErrorText: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 4,
    fontWeight: '500',
  },
  inputLabelError: {
    color: '#ff6b6b',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#ff6b6b',
    flex: 1,
  },
  signupButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },
});
