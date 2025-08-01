
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AllApplicationsScreen = ({ route, navigation }) => {
  const { jobs } = route.params;
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate sample applications based on jobs
  const generateApplications = () => {
    const applications = [];
    jobs.forEach(job => {
      // Generate random applications for each job
      const applicantCount = job.applicants || 0;
      for (let i = 0; i < applicantCount; i++) {
        applications.push({
          id: `${job.id}-${i}`,
          jobId: job.id,
          jobTitle: job.title,
          jobCategory: job.category,
          jobExperience: job.experienceLevel,
          applicantName: `Applicant ${i + 1}`,
          experience: Math.floor(Math.random() * 5) + 1,
          rating: (Math.random() * 2 + 3).toFixed(1),
          status: ['pending', 'shortlisted', 'rejected'][Math.floor(Math.random() * 3)],
          appliedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: job.location,
          phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        });
      }
    });
    return applications;
  };

  const allApplications = useMemo(() => generateApplications(), [jobs]);

  const filters = [
    { key: 'all', label: 'All', icon: 'list' },
    { key: 'helper', label: 'Helper Jobs', icon: 'hammer' },
    { key: 'worker', label: 'Worker Jobs', icon: 'build' },
    { key: 'pending', label: 'Pending', icon: 'time' },
    { key: 'shortlisted', label: 'Shortlisted', icon: 'checkmark-circle' },
  ];

  const getFilteredApplications = () => {
    let filtered = allApplications;

    // Apply filter
    switch (selectedFilter) {
      case 'helper':
        filtered = allApplications.filter(app => app.jobExperience === 'helper');
        break;
      case 'worker':
        filtered = allApplications.filter(app => app.jobExperience === 'worker');
        break;
      case 'pending':
        filtered = allApplications.filter(app => app.status === 'pending');
        break;
      case 'shortlisted':
        filtered = allApplications.filter(app => app.status === 'shortlisted');
        break;
      default:
        filtered = allApplications;
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredApplications = useMemo(() => getFilteredApplications(), [allApplications, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'shortlisted': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getExperienceBadgeColor = (level) => {
    return level === 'helper' ? '#10B981' : '#3B82F6';
  };

  const renderApplicationCard = ({ item }) => (
    <View style={styles.applicationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.applicantInfo}>
          <Text style={styles.applicantName}>{item.applicantName}</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.experienceBadge, { backgroundColor: getExperienceBadgeColor(item.jobExperience) }]}>
              <Text style={styles.badgeText}>
                {item.jobExperience === 'helper' ? 'Helper' : 'Worker'}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </View>

      <Text style={styles.jobTitle}>{item.jobTitle}</Text>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="briefcase" size={14} color="#6B7280" />
          <Text style={styles.detailText}>{item.experience} years experience</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="location" size={14} color="#6B7280" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={14} color="#6B7280" />
          <Text style={styles.detailText}>
            Applied {new Date(item.appliedDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="call" size={16} color="#4F46E5" />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble" size={16} color="#4F46E5" />
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
          <Ionicons name="person" size={16} color="#FFFFFF" />
          <Text style={[styles.actionText, { color: '#FFFFFF' }]}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Calculate statistics
  const stats = {
    total: allApplications.length,
    helpers: allApplications.filter(app => app.jobExperience === 'helper').length,
    workers: allApplications.filter(app => app.jobExperience === 'worker').length,
    pending: allApplications.filter(app => app.status === 'pending').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#4F46E5" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>All Applications</Text>
          <Text style={styles.headerSubtitle}>{filteredApplications.length} applications</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.statsHeader}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Applications</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{stats.helpers}</Text>
            <Text style={styles.statLabel}>Helper Applications</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#3B82F6' }]}>{stats.workers}</Text>
            <Text style={styles.statLabel}>Worker Applications</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search applications..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filters}
            keyExtractor={item => item.key}
            contentContainerStyle={styles.filterContainer}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedFilter === item.key && styles.activeFilter
                ]}
                onPress={() => setSelectedFilter(item.key)}
              >
                <Ionicons
                  name={item.icon}
                  size={14}
                  color={selectedFilter === item.key ? '#FFFFFF' : '#6B7280'}
                />
                <Text style={[
                  styles.filterText,
                  selectedFilter === item.key && styles.activeFilterText
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Applications List */}
        <View style={styles.applicationsSection}>
          {filteredApplications.map((item) => (
            <View key={item.id} style={styles.applicationCardWrapper}>
              {renderApplicationCard({ item })}
            </View>
          ))}
          {filteredApplications.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>No applications found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          )}
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
    paddingTop: 40,
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
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 40,
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
  statsHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 14, // Increased padding for better visibility
    borderRadius: 12,
    elevation: 2, // Increased elevation for better shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500', // Made text slightly bolder
  },
  filterContainer: {
    paddingHorizontal: 20, // Increased horizontal padding
    paddingBottom: 12,
    paddingTop: 6,
    paddingRight: 20, // Add extra padding on the right
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12, // Further reduced padding
    paddingVertical: 8, // Further reduced padding
    borderRadius: 16, // Reduced border radius
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 36, // Reduced height
    minWidth: 80, // Reduced minimum width
  },
  activeFilter: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
    elevation: 3,
  },
  filterText: {
    marginLeft: 4, // Reduced margin
    fontSize: 12, // Reduced font size
    color: '#6B7280',
    fontWeight: '600',
    flexShrink: 1,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  applicationsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  applicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  experienceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 12,
  },
  cardDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12, // Increased gap between buttons
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16, // Increased horizontal padding
    paddingVertical: 12, // Increased vertical padding
    borderRadius: 10, // Slightly increased border radius
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 44, // Added minimum height for better touch targets
  },
  primaryAction: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  actionText: {
    marginLeft: 8, // Increased margin for better spacing
    fontSize: 14,
    fontWeight: '600', // Made text slightly bolder
    color: '#4F46E5',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  applicationsSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  applicationCardWrapper: {
    marginBottom: 16,
  },
});

export default AllApplicationsScreen;
