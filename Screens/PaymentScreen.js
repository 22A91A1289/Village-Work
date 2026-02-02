import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { api } from '../utils/api';

const PaymentScreen = ({ route, navigation }) => {
  const { payment, worker } = route.params;
  const [loading, setLoading] = useState(false);
  const [showUPIOptions, setShowUPIOptions] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // UPI ID for receiving payments (you can make this dynamic from backend)
  const UPI_ID = 'worknex@paytm'; // Replace with actual UPI ID

  const upiApps = [
    { id: 'phonepe', name: 'PhonePe', color: '#5f259f', icon: 'phone-portrait' },
    { id: 'gpay', name: 'Google Pay', color: '#4285f4', icon: 'logo-google' },
    { id: 'paytm', name: 'Paytm', color: '#00b9f5', icon: 'card' },
    { id: 'bhim', name: 'BHIM UPI', color: '#097bed', icon: 'flash' },
    { id: 'other', name: 'Other UPI App', color: '#10b981', icon: 'apps' },
  ];

  const generateUPILink = (appId) => {
    const name = 'WorkNex';
    const amount = payment.amount;
    const note = `Payment for ${payment.jobDetails?.title || 'Work'}`;
    
    const baseParams = `pa=${UPI_ID}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    
    // Generate app-specific deep links
    const deepLinks = {
      phonepe: `phonepe://pay?${baseParams}`,
      gpay: `gpay://upi/pay?${baseParams}`,
      paytm: `paytmmp://pay?${baseParams}`,
      bhim: `bhim://pay?${baseParams}`,
      other: `upi://pay?${baseParams}`,
    };

    return deepLinks[appId] || deepLinks.other;
  };

  const handleUPIPayment = async (appId) => {
    const upiLink = generateUPILink(appId);
    
    try {
      const supported = await Linking.canOpenURL(upiLink);
      
      if (supported) {
        await Linking.openURL(upiLink);
        setShowUPIOptions(false);
        
        // Show confirmation modal after 2 seconds
        setTimeout(() => {
          setShowConfirmModal(true);
        }, 2000);
      } else {
        Alert.alert(
          'App Not Installed',
          `Please install ${upiApps.find(app => app.id === appId)?.name} or choose another UPI app.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening UPI app:', error);
      Alert.alert('Error', 'Failed to open payment app. Please try again.');
    }
  };

  const copyUPIId = async () => {
    await Clipboard.setStringAsync(UPI_ID);
    Alert.alert('Copied!', 'UPI ID copied to clipboard', [{ text: 'OK' }]);
  };

  const handleConfirmPayment = async () => {
    if (!transactionId.trim()) {
      Alert.alert('Required', 'Please enter the UPI Transaction ID');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.put(`/api/payments/${payment._id}/mark-paid`, {
        paymentMethod: 'upi',
        transactionId: transactionId.trim(),
        paidAt: new Date()
      }, { auth: true });

      if (response.success) {
        Alert.alert(
          'Success!',
          'Payment marked as completed. Worker will be notified.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error marking payment:', error);
      Alert.alert('Error', 'Failed to confirm payment. Please try again.');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleCashPayment = () => {
    Alert.alert(
      'Confirm Cash Payment',
      'Have you paid the worker in cash?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Paid',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await api.put(`/api/payments/${payment._id}/mark-paid`, {
                paymentMethod: 'cash',
                paidAt: new Date()
              }, { auth: true });

              if (response.success) {
                Alert.alert(
                  'Success!',
                  'Cash payment confirmed. Worker will be notified.',
                  [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
              }
            } catch (error) {
              console.error('Error marking payment:', error);
              Alert.alert('Error', 'Failed to confirm payment. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Make Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Payment Details Card */}
        <View style={styles.card}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount to Pay</Text>
            <Text style={styles.amount}>₹{payment.amount.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Job</Text>
            <Text style={styles.detailValue}>{payment.jobDetails?.title}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Worker</Text>
            <Text style={styles.detailValue}>{worker?.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Worker Phone</Text>
            <Text style={styles.detailValue}>{worker?.phone}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Payment Method</Text>
          
          {/* UPI Payment - FREE */}
          <TouchableOpacity 
            style={styles.paymentMethod}
            onPress={() => setShowUPIOptions(!showUPIOptions)}
          >
            <View style={styles.paymentMethodLeft}>
              <View style={[styles.methodIcon, { backgroundColor: '#4285f420' }]}>
                <Ionicons name="logo-google" size={28} color="#4285f4" />
              </View>
              <View>
                <Text style={styles.methodTitle}>UPI Payment</Text>
                <Text style={styles.methodSubtitle}>PhonePe, GPay, Paytm, BHIM</Text>
                <View style={styles.freeBadge}>
                  <Text style={styles.freeText}>100% FREE • NO CHARGES</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          {/* UPI Apps List */}
          {showUPIOptions && (
            <View style={styles.upiAppsContainer}>
              {upiApps.map((app) => (
                <TouchableOpacity
                  key={app.id}
                  style={styles.upiAppButton}
                  onPress={() => handleUPIPayment(app.id)}
                >
                  <View style={[styles.upiAppIcon, { backgroundColor: app.color + '20' }]}>
                    <Ionicons name={app.icon} size={24} color={app.color} />
                  </View>
                  <Text style={styles.upiAppName}>{app.name}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}

              {/* Copy UPI ID Option */}
              <TouchableOpacity
                style={[styles.upiAppButton, styles.copyUPIButton]}
                onPress={copyUPIId}
              >
                <View style={[styles.upiAppIcon, { backgroundColor: '#10b98120' }]}>
                  <Ionicons name="copy" size={24} color="#10b981" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.upiAppName}>Copy UPI ID</Text>
                  <Text style={styles.upiId}>{UPI_ID}</Text>
                </View>
                <Ionicons name="copy-outline" size={20} color="#10b981" />
              </TouchableOpacity>
            </View>
          )}

          {/* Cash Payment */}
          <TouchableOpacity 
            style={styles.paymentMethod}
            onPress={handleCashPayment}
          >
            <View style={styles.paymentMethodLeft}>
              <View style={[styles.methodIcon, { backgroundColor: '#10b98120' }]}>
                <Ionicons name="cash" size={28} color="#10b981" />
              </View>
              <View>
                <Text style={styles.methodTitle}>Cash Payment</Text>
                <Text style={styles.methodSubtitle}>Pay directly to worker</Text>
                <View style={styles.freeBadge}>
                  <Text style={styles.freeText}>100% FREE • NO CHARGES</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#3B82F6" />
          <Text style={styles.infoText}>
            All payment methods are 100% FREE with ZERO transaction charges. We don't take any commission!
          </Text>
        </View>
      </ScrollView>

      {/* Transaction ID Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Payment</Text>
            <Text style={styles.modalSubtitle}>
              Please enter the UPI Transaction ID/Reference Number
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Transaction ID"
              value={transactionId}
              onChangeText={setTransactionId}
              autoCapitalize="characters"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmPayment}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm Payment</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  amountContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  amount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  freeBadge: {
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  freeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  upiAppsContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  upiAppButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  upiAppIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  upiAppName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  copyUPIButton: {
    marginTop: 8,
  },
  upiId: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    marginLeft: 12,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    color: '#1F2937',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  confirmButton: {
    backgroundColor: '#10B981',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default PaymentScreen;
