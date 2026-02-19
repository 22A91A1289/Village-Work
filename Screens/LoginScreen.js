import React, { useState, useMemo } from 'react';
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
import { useResponsive } from '../utils/responsive';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const r = useResponsive();
  const styles = useMemo(() => createStyles(r), [r.width, r.height]);
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

      // Update auth state and navigate to worker app
      // The AppNavigator will automatically switch to the authenticated stack
      login();
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Please try again.';
      const hint =
        message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')
          ? ' Check that the backend is running and reachable (same Wi‑Fi, correct API URL).'
          : '';
      Alert.alert('Login Failed', message + hint);
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
          showsVerticalScrollIndicator={true}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="construct" size={r.rsf(40)} color="#4F46E5" />
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
                  <Text style={styles.loginButtonText}>Logging in...</Text>
                </View>
              ) : (
                <>
                  <Ionicons name="log-in" size={20} color="#FFFFFF" />
                  <Text style={styles.loginButtonText}>Login</Text>
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

function createStyles(r) {
  const pad = r.horizontalPadding;
  const sp = r.spacing;
  const logoSize = r.rs(80);
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: sp.lg,
    },
    header: {
      alignItems: 'center',
      paddingTop: r.isTablet ? 48 : 40,
      paddingBottom: sp.lg,
    },
    backButton: {
      position: 'absolute',
      left: pad,
      top: r.isTablet ? 48 : 40,
      flexDirection: 'row',
      alignItems: 'center',
      padding: sp.sm,
      borderRadius: 12,
      backgroundColor: '#F3F4F6',
    },
    backText: {
      marginLeft: sp.sm,
      fontSize: r.rsf(16),
      color: '#374151',
      fontWeight: '600',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: sp.lg,
    },
    logo: {
      width: logoSize,
      height: logoSize,
      borderRadius: logoSize / 2,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: sp.md,
    },
    brandTitle: {
      fontSize: r.rsf(28),
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: sp.xs,
    },
    brandSubtitle: {
      fontSize: r.rsf(16),
      color: '#6B7280',
    },
    formContainer: {
      paddingHorizontal: pad,
      marginBottom: sp.lg,
    },
    welcomeText: {
      fontSize: r.rsf(24),
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: sp.sm,
    },
    subtitleText: {
      fontSize: r.rsf(16),
      color: '#6B7280',
      marginBottom: sp.xl,
    },
    inputGroup: {
      marginBottom: sp.lg,
    },
    inputLabel: {
      fontSize: r.rsf(14),
      fontWeight: '600',
      color: '#374151',
      marginBottom: sp.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      paddingHorizontal: sp.md,
      paddingVertical: sp.md,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    textInput: {
      flex: 1,
      marginLeft: sp.md,
      fontSize: r.rsf(16),
      color: '#1F2937',
    },
    eyeButton: {
      padding: sp.xs,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: sp.xl,
    },
    forgotPasswordText: {
      fontSize: r.rsf(14),
      color: '#4F46E5',
      fontWeight: '500',
    },
    loginButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4F46E5',
      paddingVertical: sp.md,
      borderRadius: 12,
      marginBottom: sp.md,
    },
    loginButtonDisabled: {
      backgroundColor: '#9CA3AF',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spinning: {
      marginRight: sp.sm,
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: r.rsf(16),
      fontWeight: '600',
      marginLeft: sp.sm,
    },
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    signUpText: {
      fontSize: r.rsf(14),
      color: '#6B7280',
    },
    signUpLink: {
      fontSize: r.rsf(14),
      color: '#4F46E5',
      fontWeight: '600',
    },
  });
}

export default LoginScreen; 