import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuth } from '../utils/api';
import { useResponsive } from '../utils/responsive';
import { useAuth } from '../contexts/AuthContext';

const SignUpScreen = ({ navigation }) => {
  const { login } = useAuth();
  const r = useResponsive();
  const styles = useMemo(() => createStyles(r), [r.width, r.height]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const workCategories = [
    { value: 'electrician', label: 'Electrician', icon: 'flash' },
    { value: 'plumber', label: 'Plumber', icon: 'water' },
    { value: 'carpenter', label: 'Carpenter', icon: 'construct' },
    { value: 'painter', label: 'Painter', icon: 'color-palette' },
    { value: 'mechanic', label: 'Mechanic', icon: 'settings' },
    { value: 'dataEntry', label: 'Data Entry', icon: 'laptop' },
  ];

  const toggleCategory = (categoryValue) => {
    if (selectedCategories.includes(categoryValue)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryValue));
    } else {
      if (selectedCategories.length >= 5) {
        Alert.alert('Limit Reached', 'You can select up to 5 work categories');
        return;
      }
      setSelectedCategories([...selectedCategories, categoryValue]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignUp = async () => {
    // Validation
    if (!formData.fullName.trim() || !formData.email.trim() || 
        !formData.phone.trim() || !formData.password || 
        !formData.confirmPassword || !formData.location.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one work category');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Default experience level for all new workers
      const defaultExperience = 'new';

      // Mobile app is worker-only - always create worker accounts
      const result = await api.post('/api/auth/register', {
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'worker',
        location: formData.location.trim(),
        workCategories: selectedCategories,
        experienceLevel: defaultExperience,
        workPreferencesCompleted: true,
      });

      // Save auth token and user data
      await setAuth(result.token, { ...result.user, role: 'worker' });
      await AsyncStorage.setItem('userRole', 'worker');
      
      // Set default skill level
      await AsyncStorage.setItem('userSkillLevel', defaultExperience);
      await AsyncStorage.setItem('skillAssessmentCompleted', 'pending');
      await AsyncStorage.setItem('workPreferencesCompleted', 'true');

      // Update auth state and navigate to home
      login();
      navigation.reset({ 
        index: 0, 
        routes: [{ name: 'WorkerTabNavigator' }] 
      });
    } catch (error) {
      Alert.alert('Sign Up Failed', error?.message || 'Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={r.rsf(24)} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Join WORKNEX</Text>
            <Text style={styles.subtitleText}>Create your account to get started</Text>

            {/* User Type Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange('fullName', value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your location"
                  value={formData.location}
                  onChangeText={(value) => handleInputChange('location', value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Work Categories (Select up to 5)</Text>
              <Text style={styles.inputSubtext}>
                {selectedCategories.length > 0 
                  ? `${selectedCategories.length} selected` 
                  : 'Choose your work categories'}
              </Text>
              <View style={styles.categoriesGrid}>
                {workCategories.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryChip,
                      selectedCategories.includes(category.value) && styles.categoryChipSelected
                    ]}
                    onPress={() => toggleCategory(category.value)}
                  >
                    <Ionicons 
                      name={category.icon} 
                      size={20} 
                      color={selectedCategories.includes(category.value) ? '#4F46E5' : '#6B7280'} 
                    />
                    <Text style={[
                      styles.categoryChipText,
                      selectedCategories.includes(category.value) && styles.categoryChipTextSelected
                    ]}>
                      {category.label}
                    </Text>
                    {selectedCategories.includes(category.value) && (
                      <View style={styles.categoryCheckBadge}>
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Create a password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
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

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Ionicons name="reload" size={20} color="#FFFFFF" style={styles.spinning} />
                  <Text style={styles.signUpButtonText}>Creating Account...</Text>
                </View>
              ) : (
                <>
                  <Ionicons name="person-add" size={20} color="#FFFFFF" />
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.signInLink}>Sign In</Text>
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
      paddingBottom: sp.xl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: pad,
      paddingTop: r.isTablet ? 48 : 40,
      paddingBottom: sp.md,
    },
    backButton: {
      padding: sp.sm,
    },
    headerTitle: {
      fontSize: r.rsf(18),
      fontWeight: '600',
      color: '#1F2937',
    },
    formContainer: {
      paddingHorizontal: pad,
      paddingBottom: sp.xl,
    },
    welcomeText: {
      fontSize: r.rsf(28),
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: sp.sm,
      textAlign: 'center',
    },
    subtitleText: {
      fontSize: r.rsf(16),
      color: '#6B7280',
      marginBottom: sp.xl,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: sp.lg,
    },
    inputLabel: {
      fontSize: r.rsf(16),
      fontWeight: '500',
      color: '#374151',
      marginBottom: sp.xs,
    },
    inputSubtext: {
      fontSize: r.rsf(14),
      color: '#6B7280',
      marginBottom: sp.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 12,
      paddingHorizontal: sp.md,
      paddingVertical: sp.md,
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
    signUpButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4F46E5',
      paddingVertical: sp.md,
      borderRadius: 12,
      marginTop: sp.sm,
      marginBottom: sp.xl,
    },
    signUpButtonDisabled: {
      backgroundColor: '#9CA3AF',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spinning: {
      transform: [{ rotate: '360deg' }],
    },
    signUpButtonText: {
      color: '#FFFFFF',
      fontSize: r.rsf(16),
      fontWeight: '600',
      marginLeft: sp.sm,
    },
    signInContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    signInText: {
      fontSize: r.rsf(14),
      color: '#6B7280',
    },
    signInLink: {
      fontSize: r.rsf(14),
      color: '#4F46E5',
      fontWeight: '600',
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: sp.sm,
      marginTop: sp.sm,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: sp.md,
      paddingVertical: sp.sm,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      gap: sp.xs,
      position: 'relative',
    },
    categoryChipSelected: {
      borderColor: '#4F46E5',
      backgroundColor: '#EEF2FF',
    },
    categoryChipText: {
      fontSize: r.rsf(13),
      fontWeight: '600',
      color: '#374151',
    },
    categoryChipTextSelected: {
      color: '#4F46E5',
    },
    categoryCheckBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: r.rs(18),
      height: r.rs(18),
      borderRadius: r.rs(9),
      backgroundColor: '#4F46E5',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
  });
}

export default SignUpScreen; 