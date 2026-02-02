import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../utils/api';

const BankAccountScreen = ({ navigation }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validatingIfsc, setValidatingIfsc] = useState(false);

  const [formData, setFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: 'savings',
    upiId: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const response = await api.get('/api/bank-accounts', { auth: true });
      if (response.success) {
        setAccounts(response.accounts);
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBankAccounts();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (formData.accountNumber.length < 9) {
      newErrors.accountNumber = 'Account number must be at least 9 digits';
    }

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }

    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) {
      newErrors.ifscCode = 'Invalid IFSC code format';
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateIfscCode = async (ifsc) => {
    if (ifsc.length !== 11) return;

    setValidatingIfsc(true);
    try {
      const response = await api.post('/api/bank-accounts/validate-ifsc', 
        { ifscCode: ifsc },
        { auth: true }
      );

      if (response.success && response.valid) {
        setFormData(prev => ({ ...prev, bankName: response.bankName }));
        Alert.alert('✓ Valid IFSC', `Bank: ${response.bankName}`);
      }
    } catch (error) {
      console.error('Error validating IFSC:', error);
    } finally {
      setValidatingIfsc(false);
    }
  };

  const handleAddAccount = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/api/bank-accounts', formData, { auth: true });

      if (response.success) {
        Alert.alert('✓ Success', 'Bank account added successfully!');
        setModalVisible(false);
        resetForm();
        fetchBankAccounts();
      } else {
        Alert.alert('Error', response.message || 'Failed to add bank account');
      }
    } catch (error) {
      console.error('Error adding bank account:', error);
      Alert.alert('Error', error.message || 'Failed to add bank account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetPrimary = async (accountId) => {
    try {
      const response = await api.put(`/api/bank-accounts/${accountId}/set-primary`, {}, { auth: true });

      if (response.success) {
        Alert.alert('✓ Success', 'Primary account updated');
        fetchBankAccounts();
      }
    } catch (error) {
      console.error('Error setting primary:', error);
      Alert.alert('Error', error.message || 'Failed to set primary account');
    }
  };

  const handleDeleteAccount = (accountId, accountName) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete ${accountName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await api.del(`/api/bank-accounts/${accountId}`, { auth: true });
              if (response.success) {
                Alert.alert('✓ Deleted', 'Bank account deleted successfully');
                fetchBankAccounts();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      accountHolderName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      bankName: '',
      branchName: '',
      accountType: 'savings',
      upiId: ''
    });
    setErrors({});
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'failed': return '#EF4444';
      case 'under_review': return '#3B82F6';
      default: return '#9CA3AF';
    }
  };

  const getVerificationStatusText = (status) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      case 'under_review': return 'Under Review';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" translucent={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Accounts</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
        }
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={24} color="#4F46E5" />
          <Text style={styles.infoText}>
            Add your bank account to receive payments directly to your account
          </Text>
        </View>

        {/* Bank Accounts List */}
        {accounts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={80} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Bank Accounts</Text>
            <Text style={styles.emptySubtitle}>
              Add your bank account to receive payments
            </Text>
            <TouchableOpacity style={styles.addButtonLarge} onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Bank Account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          accounts.map((account) => (
            <View key={account._id} style={styles.accountCard}>
              {/* Primary Badge */}
              {account.isPrimary && (
                <View style={styles.primaryBadge}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.primaryBadgeText}>Primary</Text>
                </View>
              )}

              {/* Account Details */}
              <View style={styles.accountHeader}>
                <View style={styles.bankIcon}>
                  <Ionicons name="business" size={28} color="#4F46E5" />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountHolderName}>{account.accountHolderName}</Text>
                  <Text style={styles.bankName}>{account.bankName}</Text>
                  <Text style={styles.accountNumber}>
                    {account.maskedAccountNumber || `XXXX${account.accountNumber.slice(-4)}`}
                  </Text>
                </View>
                <View style={[
                  styles.verificationBadge,
                  { backgroundColor: getVerificationStatusColor(account.verificationStatus) }
                ]}>
                  <Ionicons
                    name={account.isVerified ? 'checkmark-circle' : 'time'}
                    size={16}
                    color="#FFFFFF"
                  />
                  <Text style={styles.verificationText}>
                    {getVerificationStatusText(account.verificationStatus)}
                  </Text>
                </View>
              </View>

              {/* Account Details Grid */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>IFSC Code</Text>
                  <Text style={styles.detailValue}>{account.ifscCode}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text style={styles.detailValue}>
                    {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
                  </Text>
                </View>
              </View>

              {account.upiId && (
                <View style={styles.upiContainer}>
                  <Ionicons name="wallet" size={16} color="#6B7280" />
                  <Text style={styles.upiText}>UPI: {account.upiId}</Text>
                </View>
              )}

              {/* Payment Stats */}
              {account.totalPaymentsReceived > 0 && (
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{account.totalPaymentsReceived}</Text>
                    <Text style={styles.statLabel}>Payments</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>₹{account.totalAmountReceived.toLocaleString('en-IN')}</Text>
                    <Text style={styles.statLabel}>Received</Text>
                  </View>
                </View>
              )}

              {/* Actions */}
              <View style={styles.actionsContainer}>
                {!account.isPrimary && account.isVerified && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleSetPrimary(account._id)}
                  >
                    <Ionicons name="star-outline" size={18} color="#4F46E5" />
                    <Text style={styles.actionButtonText}>Set Primary</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteAccount(account._id, account.accountHolderName)}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Account Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Bank Account</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {/* Account Holder Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Account Holder Name *</Text>
                <TextInput
                  style={[styles.input, errors.accountHolderName && styles.inputError]}
                  value={formData.accountHolderName}
                  onChangeText={(text) => setFormData({ ...formData, accountHolderName: text })}
                  placeholder="Enter account holder name"
                  autoCapitalize="words"
                />
                {errors.accountHolderName && (
                  <Text style={styles.errorText}>{errors.accountHolderName}</Text>
                )}
              </View>

              {/* Account Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Account Number *</Text>
                <TextInput
                  style={[styles.input, errors.accountNumber && styles.inputError]}
                  value={formData.accountNumber}
                  onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
                  placeholder="Enter account number"
                  keyboardType="numeric"
                  maxLength={18}
                />
                {errors.accountNumber && (
                  <Text style={styles.errorText}>{errors.accountNumber}</Text>
                )}
              </View>

              {/* Confirm Account Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Account Number *</Text>
                <TextInput
                  style={[styles.input, errors.confirmAccountNumber && styles.inputError]}
                  value={formData.confirmAccountNumber}
                  onChangeText={(text) => setFormData({ ...formData, confirmAccountNumber: text })}
                  placeholder="Re-enter account number"
                  keyboardType="numeric"
                  maxLength={18}
                />
                {errors.confirmAccountNumber && (
                  <Text style={styles.errorText}>{errors.confirmAccountNumber}</Text>
                )}
              </View>

              {/* IFSC Code */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>IFSC Code *</Text>
                <View style={styles.ifscContainer}>
                  <TextInput
                    style={[styles.input, styles.ifscInput, errors.ifscCode && styles.inputError]}
                    value={formData.ifscCode}
                    onChangeText={(text) => {
                      const upperText = text.toUpperCase();
                      setFormData({ ...formData, ifscCode: upperText });
                      if (upperText.length === 11) {
                        validateIfscCode(upperText);
                      }
                    }}
                    placeholder="e.g. SBIN0001234"
                    autoCapitalize="characters"
                    maxLength={11}
                  />
                  {validatingIfsc && (
                    <ActivityIndicator size="small" color="#4F46E5" style={styles.ifscLoader} />
                  )}
                </View>
                {errors.ifscCode && (
                  <Text style={styles.errorText}>{errors.ifscCode}</Text>
                )}
              </View>

              {/* Bank Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bank Name *</Text>
                <TextInput
                  style={[styles.input, errors.bankName && styles.inputError]}
                  value={formData.bankName}
                  onChangeText={(text) => setFormData({ ...formData, bankName: text })}
                  placeholder="Enter bank name"
                />
                {errors.bankName && (
                  <Text style={styles.errorText}>{errors.bankName}</Text>
                )}
              </View>

              {/* Branch Name (Optional) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Branch Name (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.branchName}
                  onChangeText={(text) => setFormData({ ...formData, branchName: text })}
                  placeholder="Enter branch name"
                />
              </View>

              {/* Account Type */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Account Type</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.accountType === 'savings' && styles.radioButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, accountType: 'savings' })}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        formData.accountType === 'savings' && styles.radioTextActive
                      ]}
                    >
                      Savings
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.accountType === 'current' && styles.radioButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, accountType: 'current' })}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        formData.accountType === 'current' && styles.radioTextActive
                      ]}
                    >
                      Current
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* UPI ID (Optional) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>UPI ID (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.upiId}
                  onChangeText={(text) => setFormData({ ...formData, upiId: text })}
                  placeholder="yourname@upi"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleAddAccount}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>Add Account</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#4F46E5',
    lineHeight: 20,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
    gap: 4,
  },
  primaryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bankIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountHolderName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  bankName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verificationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailsGrid: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  upiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  upiText: {
    fontSize: 13,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 12,
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalScroll: {
    padding: 20,
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
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  ifscContainer: {
    position: 'relative',
  },
  ifscInput: {
    marginBottom: 0,
  },
  ifscLoader: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  radioText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  radioTextActive: {
    color: '#4F46E5',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default BankAccountScreen;
