import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../utils/api';
import { useResponsive } from '../utils/responsive';

const ForgotPasswordScreen = ({ navigation }) => {
  const r = useResponsive();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const styles = useMemo(() => createStyles(r), [r]);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/auth/forgot-password', {
        email: email.trim().toLowerCase()
      });
      Alert.alert('Success', 'OTP sent to your email');
      setStep(2);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim() || !newPassword.trim()) {
      Alert.alert('Error', 'Please enter OTP and new password');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/auth/reset-password', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword: newPassword.trim()
      });
      Alert.alert('Success', 'Password reset successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={r.rsf(24)} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Forgot Password</Text>
        </View>

        <Text style={styles.subtitle}>
          {step === 1 ? 'Enter your email to receive OTP' : 'Enter OTP and set new password'}
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={step === 1}
          />
        </View>

        {step === 2 && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>OTP</Text>
              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                placeholder="6-digit OTP"
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
              />
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={step === 1 ? handleSendOtp : handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {step === 1 ? 'Send OTP' : 'Reset Password'}
            </Text>
          )}
        </TouchableOpacity>

        {step === 2 && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSendOtp}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

function createStyles(r) {
  const pad = r.horizontalPadding;
  const sp = r.spacing;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContent: {
      flexGrow: 1,
      padding: pad,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: sp.lg,
    },
    backButton: {
      marginRight: sp.sm,
    },
    title: {
      fontSize: r.rsf(22),
      fontWeight: '700',
      color: '#1F2937',
    },
    subtitle: {
      fontSize: r.rsf(14),
      color: '#6B7280',
      marginBottom: sp.lg,
    },
    inputGroup: {
      marginBottom: sp.md,
    },
    label: {
      fontSize: r.rsf(14),
      fontWeight: '600',
      marginBottom: sp.xs,
    },
    input: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 10,
      padding: sp.md,
      fontSize: r.rsf(16),
    },
    primaryButton: {
      backgroundColor: '#4F46E5',
      paddingVertical: sp.md,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: sp.sm,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: r.rsf(16),
      fontWeight: '600',
    },
    secondaryButton: {
      paddingVertical: sp.md,
      alignItems: 'center',
    },
    secondaryButtonText: {
      color: '#4F46E5',
      fontSize: r.rsf(14),
      fontWeight: '600',
    },
  });
}

export default ForgotPasswordScreen;
