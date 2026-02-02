import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
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

const WorkHistoryScreen = ({ navigation }) => {
  const { t } = useLanguage();
  const [workHistory, setWorkHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalEarnings: 0,
    avgRating: 0,
    completionRate: 0
  });

  useEffect(() => {
    fetchWorkHistory();
  }, []);

  const fetchWorkHistory = async () => {
    try {
      const response = await api.get('/api/applications/work-history', { auth: true });
      if (response.success) {
        setWorkHistory(response.history);
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching work history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWorkHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'accepted':
        return '#3B82F6';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'accepted':
        return 'In Progress';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const completedDate = new Date(date);
    const diffMs = now - completedDate;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return completedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderJobCard = (item) => (
    <TouchableOpacity
      key={item._id}
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetailsScreen', { job: item.job })}
      activeOpacity={0.7}
    >
      {/* Job Header */}
      <View style={styles.jobHeader}>
        <View style={styles.jobMainInfo}>
          <Text style={styles.jobTitle} numberOfLines={2}>
            {item.job?.title || 'Job'}
          </Text>
          <Text style={styles.jobCategory}>
            {item.job?.category || 'Work'}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) }
        ]}>
          <Text style={styles.statusText}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      {/* Job Details */}
      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {item.completedAt 
              ? `Completed ${getTimeAgo(item.completedAt)}`
              : `Applied ${getTimeAgo(item.createdAt)}`
            }
          </Text>
        </View>
        
        {item.job?.location && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText} numberOfLines={1}>
              {item.job.location}
            </Text>
          </View>
        )}

        {item.job?.workDuration && (
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              {item.job.workDuration}
            </Text>
          </View>
        )}
      </View>

      {/* Payment Info */}
      {item.payment && (
        <View style={styles.paymentInfo}>
          <View style={styles.paymentLeft}>
            <Ionicons 
              name={item.payment.status === 'completed' ? 'checkmark-circle' : 'time'} 
              size={20} 
              color={item.payment.status === 'completed' ? '#10B981' : '#F59E0B'} 
            />
            <Text style={[
              styles.paymentAmount,
              { color: item.payment.status === 'completed' ? '#10B981' : '#F59E0B' }
            ]}>
              ₹{item.payment.amount.toLocaleString('en-IN')}
            </Text>
          </View>
          <Text style={styles.paymentStatus}>
            {item.payment.status === 'completed' ? 'Paid' : 'Pending'}
          </Text>
        </View>
      )}

      {/* Rating (if applicable) */}
      {item.rating && (
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          {item.review && (
            <Text style={styles.reviewText} numberOfLines={1}>
              • {item.review}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Work History</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
        }
      >
        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalJobs}</Text>
            <Text style={styles.statLabel}>Jobs Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#10B981' }]}>
              ₹{stats.totalEarnings.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          {stats.avgRating > 0 && (
            <View style={styles.statCard}>
              <View style={styles.ratingStatValue}>
                <Ionicons name="star" size={20} color="#F59E0B" />
                <Text style={styles.statValue}>{stats.avgRating.toFixed(1)}</Text>
              </View>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          )}
        </View>

        {/* Work History List */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>
            {workHistory.length > 0 ? 'Your Work History' : 'No Work History Yet'}
          </Text>

          {workHistory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={80} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Completed Jobs</Text>
              <Text style={styles.emptySubtitle}>
                Complete jobs to build your work history. Your past work will appear here.
              </Text>
              <TouchableOpacity
                style={styles.browseJobsButton}
                onPress={() => navigation.navigate('WorkerTabNavigator')}
              >
                <Text style={styles.browseJobsButtonText}>Browse Jobs</Text>
              </TouchableOpacity>
            </View>
          ) : (
            workHistory.map(renderJobCard)
          )}
        </View>
      </ScrollView>
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
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  ratingStatValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  historySection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  jobCategory: {
    fontSize: 13,
    color: '#6B7280',
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
  jobDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  paymentStatus: {
    fontSize: 12,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  reviewText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
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
    marginBottom: 24,
  },
  browseJobsButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseJobsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default WorkHistoryScreen;
