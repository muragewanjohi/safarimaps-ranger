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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword, rangerId, team } = formData;

    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address.');
      return false;
    }

    if (!currentAuthService.validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Validation Error', 'Please enter a password.');
      return false;
    }

    const passwordValidation = currentAuthService.validatePassword(password);
    if (!passwordValidation.isValid) {
      Alert.alert('Validation Error', passwordValidation.message || 'Invalid password.');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return false;
    }

    if (!rangerId.trim()) {
      Alert.alert('Validation Error', 'Please enter your Ranger ID.');
      return false;
    }

    if (!currentAuthService.validateRangerId(rangerId)) {
      Alert.alert('Validation Error', 'Ranger ID must be in format ABC-123 (3 letters, dash, 3 numbers).');
      return false;
    }

    if (!team.trim()) {
      Alert.alert('Validation Error', 'Please enter your team name.');
      return false;
    }

    return true;
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
        rangerId: formData.rangerId.trim().toUpperCase(),
        team: formData.team.trim()
      });
      
      console.log('Signup response:', response);
      
      if (response.success) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        Alert.alert('Signup Failed', response.error || 'Please check your information and try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Signup Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleLoginPress = () => {
    router.push('/login');
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
            <ThemedText style={styles.title}>Create Account</ThemedText>
            <ThemedText style={styles.subtitle}>Join the SafariMap GameWarden team</ThemedText>
          </View>

          {/* Signup Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
              <View style={styles.inputContainer}>
                <IconSymbol name="person.fill" size={20} color="#666" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
              <View style={styles.inputContainer}>
                <IconSymbol name="envelope.fill" size={20} color="#666" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Ranger ID</ThemedText>
              <View style={styles.inputContainer}>
                <IconSymbol name="badge.plus.radiowaves.right" size={20} color="#666" />
                <TextInput
                  style={styles.textInput}
                  placeholder="ABC-123"
                  placeholderTextColor="#999"
                  value={formData.rangerId}
                  onChangeText={(value) => handleInputChange('rangerId', value.toUpperCase())}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              <ThemedText style={styles.helpText}>Format: ABC-123 (3 letters, dash, 3 numbers)</ThemedText>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Team</ThemedText>
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
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Password</ThemedText>
              <View style={styles.inputContainer}>
                <IconSymbol name="lock.fill" size={20} color="#666" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
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
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              <ThemedText style={styles.helpText}>Minimum 6 characters</ThemedText>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Confirm Password</ThemedText>
              <View style={styles.inputContainer}>
                <IconSymbol name="lock.fill" size={20} color="#666" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
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
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
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

            {/* Test Button */}
            <TouchableOpacity
              style={[styles.signupButton, { backgroundColor: '#ff6b6b', marginTop: 10 }]}
              onPress={() => {
                console.log('Test button pressed!');
                Alert.alert('Test', 'Button is working!');
              }}
            >
              <ThemedText style={styles.signupButtonText}>Test Button</ThemedText>
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
