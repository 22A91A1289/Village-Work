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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminDashboard = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalWorkers: 1247,
    pendingSkillTests: 23,
    pendingPayments: 45,
    totalRevenue: 284500,
    activeJobs: 156,
    completedJobs: 892,
    pendingWorkCompletions: 12,
    pendingProfileUpdates: 8,
  });

  const platformStats = [
    {
      title: 'Total Workers',
      value: stats.totalWorkers,
      icon: 'people',
      color: '#4F46E5',
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: 'briefcase',
      color: '#10B981',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: 'card',
      color: '#F59E0B',
    },
    {
      title: 'Completed Jobs',
      value: stats.completedJobs,
      icon: 'checkmark-circle',
      color: '#3B82F6',
    },
  ];

  const pendingActions = [
    {
      id: 1,
      title: 'Work Completion',
      subtitle: `${stats.pendingWorkCompletions} jobs completed, ready for payment`,
      icon: 'checkmark-circle',
      color: '#10B981',
      badge: stats.pendingWorkCompletions,
      onPress: () => Alert.alert('Work Completion', 'Review completed work and approve payments'),
    },
    {
      id: 2,
      title: 'Skill Test Reviews',
      subtitle: `${stats.pendingSkillTests} workers completed skill tests`,
      icon: 'document-text',
      color: '#F59E0B',
      badge: stats.pendingSkillTests,
      onPress: () => Alert.alert('Skill Tests', 'Review skill test results and update worker profiles'),
    },
    {
      id: 3,
      title: 'Worker Profile Updates',
      subtitle: `${stats.pendingProfileUpdates} workers need profile verification`,
      icon: 'person',
      color: '#8B5CF6',
      badge: stats.pendingProfileUpdates,
      onPress: () => Alert.alert('Profile Updates', 'Review and update worker profiles'),
    },
    {
      id: 4,
      title: 'Payment Processing',
      subtitle: `${stats.pendingPayments} payments ready for processing`,
      icon: 'card',
      color: '#EF4444',
      badge: stats.pendingPayments,
      onPress: () => navigation.navigate('AdminPayments'),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Work completed',
      description: 'Construction work by Venkata Siva - Ready for payment',
      time: '2 minutes ago',
      icon: 'checkmark-circle',
      color: '#10B981',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Skill test passed',
      description: 'Electrical certification - Anil Kumar scored 85%',
      time: '15 minutes ago',
      icon: 'shield-checkmark',
      color: '#F59E0B',
      status: 'pending',
    },
    {
      id: 3,
      title: 'Profile update needed',
      description: 'Rajesh Kumar - Experience verification required',
      time: '1 hour ago',
      icon: 'person',
      color: '#8B5CF6',
      status: 'pending',
    },
    {
      id: 4,
      title: 'Payment processed',
      description: '₹3,500 paid to Suresh for plumbing work',
      time: '2 hours ago',
      icon: 'card',
      color: '#3B82F6',
      status: 'completed',
    },
  ];

  const handleActionPress = (action) => {
    if (action.onPress) {
      action.onPress();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Platform Management</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#374151" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>5</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          {platformStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={styles.statNumber}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.title}</Text>
            </View>
          ))}
        </View>

        {/* Pending Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Actions</Text>
          <Text style={styles.sectionSubtitle}>Requires your attention</Text>
          {pendingActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => handleActionPress(action)}
            >
              <View style={styles.actionLeft}>
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <View style={styles.actionContent}>
                  <View style={styles.actionTitleRow}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    {action.badge > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{action.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: `${activity.color}15` }]}>
                <Ionicons name={activity.icon} size={16} color={activity.color} />
              </View>
              <View style={styles.activityContent}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityText}>{activity.title}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: activity.status === 'pending' ? '#FEF3C7' : '#D1FAE5' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: activity.status === 'pending' ? '#92400E' : '#065F46' }
                    ]}>
                      {activity.status === 'pending' ? 'Pending' : 'Completed'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    alignItems: 'flex-end',
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
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  activityText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  activityDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default AdminDashboard; 