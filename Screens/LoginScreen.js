import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuth } from '../utils/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const result = await api.post('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password: password,
      });

      // Check if this is an employer account
      if (result.user?.role === 'owner') {
        // Don't save auth for employers - redirect to web
        Alert.alert(
          'Employer Account Detected',
          'This mobile app is for workers only. Employers should use the Web Dashboard at http://localhost:3000',
          [{ text: 'OK' }]
        );
        return;
      }

      // Save auth for worker accounts (persistent login)
      await setAuth(result.token, result.user);
      await AsyncStorage.setItem('userRole', 'worker');
      
      // Set default skill level if not exists
      const existingSkillLevel = await AsyncStorage.getItem('userSkillLevel');
      if (!existingSkillLevel) {
        await AsyncStorage.setItem('userSkillLevel', 'new');
        await AsyncStorage.setItem('skillAssessmentCompleted', 'pending');
      }

      // Navigate to worker app - session persists until logout
      navigation.reset({ index: 0, routes: [{ name: 'WorkerTabNavigator' }] });
    } catch (err) {
      Alert.alert('Login Failed', err?.message || 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPasswordScreen');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUpScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="construct" size={40} color="#4F46E5" />
              </View>
              <Text style={styles.brandTitle}>WORKNEX</Text>
              <Text style={styles.brandSubtitle}>STUDENT EMPLOYMENT PLATFORM</Text>
            </View>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>Sign in to your worker account</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Ionicons name="reload" size={20} color="#FFFFFF" style={styles.spinning} />
                  <Text style={styles.loginButtonText}>Signing In...</Text>
                </View>
              ) : (
                <>
                  <Ionicons name="log-in" size={20} color="#FFFFFF" />
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  roleContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  roleSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  roleButtons: {
    gap: 12,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  roleButtonActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#F8FAFC',
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleContent: {
    flex: 1,
  },
  roleButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  roleButtonTitleActive: {
    color: '#4F46E5',
  },
  roleButtonSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  roleButtonSubtitleActive: {
    color: '#4F46E5',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeButton: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinning: {
    marginRight: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  demoContainer: {
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
});

export default LoginScreen; 