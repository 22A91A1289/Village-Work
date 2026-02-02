import React, { useEffect } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  StyleSheet, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGoogleAuth, getUserInfo, formatGoogleUser } from '../utils/googleAuth';
import { api } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Google Sign-In Button Component
 * 
 * Handles Google OAuth authentication and backend integration
 * 
 * @param {Function} onSuccess - Callback when sign-in succeeds
 * @param {Function} onError - Callback when sign-in fails
 * @param {boolean} isSignUp - Whether this is for sign up (vs login)
 */
const GoogleSignInButton = ({ onSuccess, onError, isSignUp = false }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { request, response, promptAsync } = useGoogleAuth();

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response);
    } else if (response?.type === 'error') {
      handleError('Google authentication failed');
    } else if (response?.type === 'cancel') {
      setIsLoading(false);
      console.log('Google sign-in cancelled by user');
    }
  }, [response]);

  const handleGoogleResponse = async (authResponse) => {
    try {
      setIsLoading(true);
      const { authentication } = authResponse;
      
      if (!authentication?.accessToken) {
        throw new Error('No access token received');
      }

      console.log('✅ Google access token received');

      // Fetch user info from Google
      const googleUserInfo = await getUserInfo(authentication.accessToken);
      console.log('✅ Google user info:', googleUserInfo.email);

      // Format user data
      const userData = formatGoogleUser(googleUserInfo);

      // Send to backend
      const endpoint = isSignUp ? '/api/auth/google-signup' : '/api/auth/google-login';
      const backendResponse = await api.post(endpoint, {
        googleId: userData.googleId,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        verified: userData.verified,
        role: 'worker', // Mobile app is worker-only
      });

      console.log('✅ Backend response:', backendResponse);

      // Save auth data
      await AsyncStorage.setItem('authToken', backendResponse.token);
      await AsyncStorage.setItem('authUser', JSON.stringify(backendResponse.user));
      await AsyncStorage.setItem('userRole', 'worker');
      
      // Set default skill level if new user
      const existingSkillLevel = await AsyncStorage.getItem('userSkillLevel');
      if (!existingSkillLevel) {
        await AsyncStorage.setItem('userSkillLevel', 'new');
        await AsyncStorage.setItem('skillAssessmentCompleted', 'pending');
      }

      setIsLoading(false);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(backendResponse);
      }

    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      handleError(error.message || 'Google sign-in failed');
    }
  };

  const handleError = (errorMessage) => {
    setIsLoading(false);
    Alert.alert('Google Sign-In Failed', errorMessage);
    if (onError) {
      onError(errorMessage);
    }
  };

  const handlePress = async () => {
    try {
      setIsLoading(true);
      
      if (!request) {
        throw new Error('Google sign-in not configured');
      }

      // Open Google sign-in prompt
      await promptAsync();
    } catch (error) {
      console.error('Error initiating Google sign-in:', error);
      handleError('Failed to open Google sign-in');
    }
  };

  return (
    <TouchableOpacity
      style={styles.googleButton}
      onPress={handlePress}
      disabled={!request || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#4285F4" />
      ) : (
        <>
          <Ionicons name="logo-google" size={20} color="#4285F4" />
          <Text style={styles.googleButtonText}>
            {isSignUp ? 'Sign up with Google' : 'Continue with Google'}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C4043',
  },
});

export default GoogleSignInButton;
