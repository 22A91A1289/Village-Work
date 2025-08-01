import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const MobileOTPScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    // Countdown timer for resend OTP
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOTP = async () => {
    if (!mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }
    if (mobileNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP sending (replace with actual API in production)
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      setResendTimer(60); // 60 seconds timer
      Alert.alert('OTP Sent', `OTP has been sent to ${mobileNumber}`);
    }, 1500);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (index, key) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);

    // Simulate OTP verification (replace with actual API in production)
    // For demo: Any OTP starting with '1' is valid (e.g., 123456)
    setTimeout(async () => {
      setIsLoading(false);
      
      // Demo verification - accept any OTP for testing
      // In production, verify with backend API
      const isValid = otpString.length === 6; // Simple validation for demo
      
      if (isValid) {
        try {
          await AsyncStorage.setItem('mobileNumber', mobileNumber);
          await AsyncStorage.setItem('mobileVerified', 'true');
          await AsyncStorage.setItem('mobileVerificationDate', new Date().toISOString());
          
          Alert.alert(
            'Verification Successful! ✅',
            'Your mobile number has been verified.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  navigation.replace('VideoUploadScreen', { fromOnboarding: true });
                },
              },
            ]
          );
        } catch (error) {
          Alert.alert('Error', 'Failed to save verification data');
        }
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        otpInputRefs.current[0]?.focus();
      }
    }, 1500);
  };

  const handleResendOTP = () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setIsOtpSent(false);
    handleSendOTP();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Back Navigation Header */}
        <View style={styles.navigationHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="phone-portrait-outline" size={48} color="#4F46E5" />
              </View>
              <Text style={styles.title}>Mobile Verification</Text>
              <Text style={styles.subtitle}>
                {isOtpSent 
                  ? 'Enter the OTP sent to your mobile number'
                  : 'Enter your mobile number to verify your identity'}
              </Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            {!isOtpSent ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mobile Number</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.countryCode}>+91</Text>
                    <View style={styles.inputDivider} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      keyboardType="number-pad"
                      value={mobileNumber}
                      onChangeText={(text) => setMobileNumber(text.replace(/[^0-9]/g, ''))}
                      autoFocus
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]}
                  onPress={handleSendOTP}
                  disabled={isLoading || mobileNumber.length !== 10}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" style={styles.spinning} />
                  ) : (
                    <Ionicons name="send-outline" size={20} color="#FFFFFF" />
                  )}
                  <Text style={styles.verifyButtonText}>Send OTP</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Enter OTP</Text>
                  <Text style={styles.otpSubtext}>
                    OTP sent to +91 {mobileNumber}
                  </Text>
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (otpInputRefs.current[index] = ref)}
                        style={[styles.otpInput, digit && styles.otpInputFilled]}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(index, value)}
                        onKeyPress={({ nativeEvent }) => handleOtpKeyPress(index, nativeEvent.key)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                      />
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]}
                  onPress={handleVerifyOTP}
                  disabled={isLoading || otp.join('').length !== 6}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" style={styles.spinning} />
                  ) : (
                    <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                  )}
                  <Text style={styles.verifyButtonText}>Verify OTP</Text>
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                  <Text style={styles.resendText}>Didn't receive OTP? </Text>
                  <TouchableOpacity
                    onPress={handleResendOTP}
                    disabled={resendTimer > 0}
                  >
                    <Text style={[
                      styles.resendButton,
                      resendTimer > 0 && styles.resendButtonDisabled
                    ]}>
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.changeNumberButton}
                  onPress={() => {
                    setIsOtpSent(false);
                    setOtp(['', '', '', '', '', '']);
                    setMobileNumber('');
                  }}
                >
                  <Text style={styles.changeNumberText}>Change Mobile Number</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
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
  navigationHeader: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputGroup: {
    marginBottom: 24,
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
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 56,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  inputDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#D1D5DB',
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  otpSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  otpInputFilled: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  verifyButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  spinning: {
    marginRight: 8,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resendText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  resendButtonDisabled: {
    color: '#9CA3AF',
  },
  changeNumberButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  changeNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default MobileOTPScreen;

