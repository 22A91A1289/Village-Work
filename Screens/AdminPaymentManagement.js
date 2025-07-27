import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminPaymentManagement = ({ navigation }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentNotes, setPaymentNotes] = useState('');

  const pendingPayments = [
    {
      id: 1,
      employerName: 'Kumar Enterprises',
      workerName: 'Venkata Siva Rama Raju',
      jobTitle: 'Construction Work - Phase 1',
      amount: 15000,
      jobDuration: '5 days',
      employerPaymentStatus: 'pending',
      workerPaymentStatus: 'pending',
      submittedAt: '2024-01-15 10:30',
      paymentMethod: 'bank_transfer',
      commission: 750,
      platformFee: 300,
    },
    {
      id: 2,
      employerName: 'Tech Solutions',
      workerName: 'Ramesh Kumar',
      jobTitle: 'Electrical Installation',
      amount: 8500,
      jobDuration: '3 days',
      employerPaymentStatus: 'completed',
      workerPaymentStatus: 'pending',
      submittedAt: '2024-01-14 16:45',
      paymentMethod: 'upi',
      commission: 425,
      platformFee: 170,
    },
    {
      id: 3,
      employerName: 'Anil Construction',
      workerName: 'Anil Singh',
      jobTitle: 'Plumbing Repair Work',
      amount: 12000,
      jobDuration: '4 days',
      employerPaymentStatus: 'pending',
      workerPaymentStatus: 'pending',
      submittedAt: '2024-01-15 09:15',
      paymentMethod: 'cash',
      commission: 600,
      platformFee: 240,
    },
  ];

  const handleProcessPayment = (payment) => {
    setSelectedPayment(payment);
    setPaymentNotes('');
    setIsPaymentModalVisible(true);
  };

  const handleApprovePayment = () => {
    if (!paymentNotes.trim()) {
      Alert.alert('Error', 'Please provide payment notes');
      return;
    }

    Alert.alert(
      'Process Payment',
      `Process payment of ₹${selectedPayment.amount} for ${selectedPayment.workerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Process',
          onPress: () => {
            Alert.alert('Success', 'Payment processed successfully!');
            setIsPaymentModalVisible(false);
            setSelectedPayment(null);
          },
        },
      ]
    );
  };

  const handleRejectPayment = () => {
    Alert.alert(
      'Reject Payment',
      `Reject payment for ${selectedPayment.workerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Rejected', 'Payment has been rejected');
            setIsPaymentModalVisible(false);
            setSelectedPayment(null);
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'bank_transfer':
        return 'card';
      case 'upi':
        return 'phone-portrait';
      case 'cash':
        return 'wallet';
      default:
        return 'card';
    }
  };

  const PaymentModal = () => (
    <Modal
      visible={isPaymentModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setIsPaymentModalVisible(false)}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Process Payment</Text>
          <View style={{ width: 60 }} />
        </View>
        
        <ScrollView style={styles.modalContent}>
          {selectedPayment && (
            <>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Payment Details</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Employer:</Text>
                  <Text style={styles.infoValue}>{selectedPayment.employerName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Worker:</Text>
                  <Text style={styles.infoValue}>{selectedPayment.workerName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Job:</Text>
                  <Text style={styles.infoValue}>{selectedPayment.jobTitle}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Duration:</Text>
                  <Text style={styles.infoValue}>{selectedPayment.jobDuration}</Text>
                </View>
              </View>

              <View style={styles.amountSection}>
                <Text style={styles.sectionTitle}>Payment Breakdown</Text>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Total Amount:</Text>
                  <Text style={styles.amountValue}>₹{selectedPayment.amount}</Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Platform Commission:</Text>
                  <Text style={styles.amountValue}>₹{selectedPayment.commission}</Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Platform Fee:</Text>
                  <Text style={styles.amountValue}>₹{selectedPayment.platformFee}</Text>
                </View>
                <View style={[styles.amountRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Worker Receives:</Text>
                  <Text style={styles.totalValue}>
                    ₹{selectedPayment.amount - selectedPayment.commission - selectedPayment.platformFee}
                  </Text>
                </View>
              </View>

              <View style={styles.statusSection}>
                <Text style={styles.sectionTitle}>Payment Status</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Employer Payment:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(selectedPayment.employerPaymentStatus)}15` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(selectedPayment.employerPaymentStatus) }]}>
                      {selectedPayment.employerPaymentStatus.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Worker Payment:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(selectedPayment.workerPaymentStatus)}15` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(selectedPayment.workerPaymentStatus) }]}>
                      {selectedPayment.workerPaymentStatus.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Payment Notes</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={paymentNotes}
                  onChangeText={setPaymentNotes}
                  placeholder="Enter payment processing notes..."
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.rejectButton} onPress={handleRejectPayment}>
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.approveButton} onPress={handleApprovePayment}>
                  <Text style={styles.approveButtonText}>Process Payment</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Payment Management</Text>
          <Text style={styles.headerSubtitle}>{pendingPayments.length} pending payments</Text>
        </View>
        
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {pendingPayments.map((payment) => (
          <View key={payment.id} style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <View style={styles.paymentInfo}>
                <Text style={styles.employerName}>{payment.employerName}</Text>
                <Text style={styles.workerName}>{payment.workerName}</Text>
              </View>
              <View style={styles.amountContainer}>
                <Text style={styles.amount}>₹{payment.amount.toLocaleString()}</Text>
                <Text style={styles.duration}>{payment.jobDuration}</Text>
              </View>
            </View>

            <Text style={styles.jobTitle}>{payment.jobTitle}</Text>
            
            <View style={styles.paymentDetails}>
              <View style={styles.detailItem}>
                <Ionicons name={getPaymentMethodIcon(payment.paymentMethod)} size={16} color="#6B7280" />
                <Text style={styles.detailText}>{payment.paymentMethod.replace('_', ' ').toUpperCase()}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time" size={16} color="#6B7280" />
                <Text style={styles.detailText}>{payment.submittedAt}</Text>
              </View>
            </View>

            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Employer</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(payment.employerPaymentStatus)}15` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(payment.employerPaymentStatus) }]}>
                    {payment.employerPaymentStatus.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Worker</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(payment.workerPaymentStatus)}15` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(payment.workerPaymentStatus) }]}>
                    {payment.workerPaymentStatus.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.commissionInfo}>
              <Text style={styles.commissionLabel}>Platform Commission: ₹{payment.commission}</Text>
              <Text style={styles.commissionLabel}>Platform Fee: ₹{payment.platformFee}</Text>
            </View>

            <TouchableOpacity
              style={styles.processButton}
              onPress={() => handleProcessPayment(payment)}
            >
              <Ionicons name="card" size={16} color="#FFFFFF" />
              <Text style={styles.processButtonText}>Process Payment</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <PaymentModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  employerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  workerName: {
    fontSize: 14,
    color: '#6B7280',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
    color: '#6B7280',
  },
  jobTitle: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
    marginBottom: 12,
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  commissionInfo: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  commissionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  processButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 8,
  },
  processButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  paymentInfo: {
    marginBottom: 20,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  amountSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  statusSection: {
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statusLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminPaymentManagement; 