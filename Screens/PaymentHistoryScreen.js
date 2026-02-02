import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../utils/api';
import { useLanguage } from '../contexts/LanguageContext';

const PaymentHistoryScreen = ({ navigation }) => {
  const { t } = useLanguage();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    pendingPayments: 0,
    completedPayments: 0
  });

  const fetchPayments = async (status = null) => {
    try {
      const url = status ? `/api/payments/history?status=${status}` : '/api/payments/history';
      const response = await api.get(url, { auth: true });
      if (response.success) {
        setPayments(response.payments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchEarningsSummary = async () => {
    try {
      const response = await api.get('/api/payments/earnings/summary', { auth: true });
      if (response.success) {
        setEarnings(response.summary);
      }
    } catch (error) {
      console.error('Error fetching earnings summary:', error);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchEarningsSummary();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPayments(filter !== 'all' ? filter : null);
    fetchEarningsSummary();
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setLoading(true);
    fetchPayments(newFilter !== 'all' ? newFilter : null);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const paymentDate = new Date(date);
    const diffMs = now - paymentDate;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return paymentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderPayment = ({ item }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={[
          styles.paymentIcon,
          { backgroundColor: item.status === 'completed' ? '#10B98120' : '#F59E0B20' }
        ]}>
          <Ionicons
            name={item.status === 'completed' ? 'checkmark-done' : 'time-outline'}
            size={28}
            color={item.status === 'completed' ? '#10B981' : '#F59E0B'}
          />
        </View>
        
        <View style={styles.paymentMainInfo}>
          <Text style={styles.paymentTitle} numberOfLines={1}>
            {item.jobDetails?.title || item.job?.title || 'Job Payment'}
          </Text>
          <Text style={styles.paymentCategory}>
            {item.jobDetails?.category || item.job?.category || 'Work'}
          </Text>
          <Text style={styles.paymentDate}>
            {item.status === 'completed' && item.paidAt
              ? `Paid on ${new Date(item.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
              : `Completed ${getTimeAgo(item.jobDetails?.completedDate || item.createdAt)}`
            }
          </Text>
        </View>

        <View style={styles.paymentAmountSection}>
          <Text style={[
            styles.paymentAmount,
            { color: item.status === 'completed' ? '#10B981' : '#F59E0B' }
          ]}>
            ₹{item.amount.toLocaleString('en-IN')}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'completed' ? '#10B981' : '#F59E0B' }
          ]}>
            <Text style={styles.statusText}>
              {item.status === 'completed' ? 'Paid' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Method (if completed) */}
      {item.status === 'completed' && item.paymentMethod && (
        <View style={styles.paymentFooter}>
          <Ionicons name="card-outline" size={14} color="#9CA3AF" />
          <Text style={styles.paymentMethod}>
            via {item.paymentMethod.replace('_', ' ').toUpperCase()}
          </Text>
          {item.transactionId && (
            <Text style={styles.transactionId}>
              • ID: {item.transactionId}
            </Text>
          )}
        </View>
      )}
    </View>
  );

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
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Payment History</Text>
        </View>
        
        <View style={styles.headerRight} />
      </View>

      {/* Earnings Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
          <Text style={styles.summaryValue}>
            ₹{earnings.totalEarnings.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardSecondary]}>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>
            ₹{earnings.pendingPayments.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardSecondary]}>
          <Text style={styles.summaryLabel}>Received</Text>
          <Text style={[styles.summaryValue, { color: '#10B981' }]}>
            ₹{earnings.completedPayments.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => handleFilterChange('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'pending' && styles.activeFilterTab]}
          onPress={() => handleFilterChange('pending')}
        >
          <Text style={[styles.filterText, filter === 'pending' && styles.activeFilterText]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'completed' && styles.activeFilterTab]}
          onPress={() => handleFilterChange('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>
            Received
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payments List */}
      {payments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="wallet-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>
            {filter === 'all' ? 'No Payments Yet' : `No ${filter === 'completed' ? 'Received' : 'Pending'} Payments`}
          </Text>
          <Text style={styles.emptySubtitle}>
            {filter === 'all' 
              ? 'Complete jobs to start earning. Your payments will appear here.'
              : `You don't have any ${filter === 'completed' ? 'received' : 'pending'} payments.`
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPayment}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4F46E5']}
              tintColor="#4F46E5"
            />
          }
        />
      )}
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
  headerLeft: {
    width: 50,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 50,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryCardSecondary: {
    padding: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  paymentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentMainInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  paymentCategory: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  paymentAmountSection: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  paymentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 6,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  transactionId: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
    lineHeight: 24,
  },
});

export default PaymentHistoryScreen;
