import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../utils/api';
import { useLanguage } from '../contexts/LanguageContext';

// Helper function to calculate time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const NotificationsScreen = ({ navigation }) => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications', { auth: true });
      if (response && response.success) {
        setNotifications(response.notifications || []);
        setUnreadCount(response.unreadCount || 0);
      } else {
        // If API doesn't return success, set empty array
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // On error, set empty array to prevent undefined errors
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const handleNotificationPress = async (notification) => {
    try {
      // Mark as read
      if (!notification.read) {
        await api.put(`/api/notifications/${notification._id}/read`, {}, { auth: true });
        setNotifications(prev =>
          (prev || []).map(n =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      // Navigate to relevant screen based on notification type
      if (notification.actionUrl) {
        // Parse actionUrl and navigate accordingly
        if (notification.actionUrl === 'MyApplications') {
          navigation.navigate('MyApplicationsScreen');
        } else if (notification.actionUrl === 'JobDetails' && notification.data?.jobId) {
          // Fetch complete job details before navigating
          try {
            const jobs = await api.get('/api/jobs', { auth: false });
            const jobDetails = jobs.find(job => job._id === notification.data.jobId);
            
            if (jobDetails) {
              // Navigate with complete job data
              navigation.navigate('JobDetailsScreen', { 
                job: {
                  _id: jobDetails._id,
                  title: jobDetails.title,
                  location: jobDetails.location,
                  salary: jobDetails.salary,
                  type: jobDetails.type,
                  category: jobDetails.category,
                  description: jobDetails.description,
                  requirements: jobDetails.requirements || [],
                  benefits: jobDetails.benefits || [],
                  postedBy: jobDetails.postedBy?.name || 'Unknown',
                  contact: jobDetails.postedBy?.phone || '',
                  timeAgo: jobDetails.createdAt ? getTimeAgo(new Date(jobDetails.createdAt)) : 'Recently',
                  urgency: jobDetails.urgency || 'normal',
                  status: jobDetails.status || 'active'
                }
              });
            } else {
              Alert.alert('Job Not Found', 'This job is no longer available.');
            }
          } catch (error) {
            console.error('Error fetching job details:', error);
            Alert.alert('Error', 'Unable to load job details. Please try again.');
          }
        } else if (notification.actionUrl === 'QuizScreen') {
          navigation.navigate('QuizScreen', { category: notification.data?.category });
        } else if (notification.actionUrl === 'ChatList') {
          navigation.navigate('ChatListScreen');
        } else if (notification.actionUrl === 'Home') {
          navigation.navigate('WorkerTabNavigator');
        }
      }
    } catch (error) {
      console.error('Error handling notification press:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await api.put('/api/notifications/mark-all-read', {}, { auth: true });
      if (response && response.success) {
        setNotifications(prev => (prev || []).map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      Alert.alert('Error', 'Failed to mark all as read');
    }
  };

  const handleClearRead = async () => {
    Alert.alert(
      'Clear Read Notifications',
      'Are you sure you want to delete all read notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await api.del('/api/notifications/clear-read', { auth: true });
              if (response && response.success) {
                setNotifications(prev => (prev || []).filter(n => !n.read));
              }
            } catch (error) {
              console.error('Error clearing read notifications:', error);
              Alert.alert('Error', 'Failed to clear notifications');
            }
          }
        }
      ]
    );
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    const icons = {
      application_status: 'document-text',
      new_job: 'briefcase',
      quiz_reminder: 'school',
      message: 'chatbubble',
      payment: 'card',
      system: 'information-circle',
      job_alert: 'megaphone'
    };
    return icons[type] || 'notifications';
  };

  const getNotificationColor = (type) => {
    const colors = {
      application_status: '#10B981',
      new_job: '#3B82F6',
      quiz_reminder: '#8B5CF6',
      message: '#06B6D4',
      payment: '#F59E0B',
      system: '#6B7280',
      job_alert: '#EF4444'
    };
    return colors[type] || '#4F46E5';
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) + '20' }]}>
        <Ionicons
          name={item.icon || getNotificationIcon(item.type)}
          size={24}
          color={item.iconColor || getNotificationColor(item.type)}
        />
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        
        <Text style={styles.notificationTime}>
          {getTimeAgo(item.createdAt)}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
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
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        
        <View style={styles.headerRight}>
          {notifications && notifications.length > 0 && unreadCount > 0 ? (
            <TouchableOpacity onPress={handleMarkAllRead}>
              <Text style={styles.markAllButton}>
                Mark all read
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Stats Bar */}
      {notifications && notifications.length > 0 && (
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>
            {unreadCount} unread • {notifications.length} total
          </Text>
          <TouchableOpacity onPress={handleClearRead}>
            <Text style={styles.clearButton}>Clear read</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications List */}
      {!notifications || notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptySubtitle}>
            You're all caught up! Check back later for updates.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications || []}
          renderItem={renderNotification}
          keyExtractor={(item) => item._id || item.id}
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
    width: 100,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 100,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  markAllButton: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  disabledButton: {
    color: '#D1D5DB',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  listContent: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  unreadCard: {
    backgroundColor: '#F8FAFF',
    borderColor: '#4F46E5',
    borderWidth: 1.5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
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

export default NotificationsScreen;
