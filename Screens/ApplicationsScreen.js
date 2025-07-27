import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ApplicationsScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Generate sample applications for this specific job
  const generateJobApplications = () => {
    const applications = [];
    const applicantCount = job.applicants || 0;
    
    for (let i = 0; i < applicantCount; i++) {
      applications.push({
        id: `${job.id}-${i}`,
        name: `${job.experienceLevel === 'helper' ? 'Helper' : 'Worker'} ${i + 1}`,
        experience: job.experienceLevel === 'helper' ? 
          Math.floor(Math.random() * 2) : Math.floor(Math.random() * 5) + 2,
        rating: (Math.random() * 2 + 3).toFixed(1),
        status: ['pending', 'shortlisted', 'rejected'][Math.floor(Math.random() * 3)],
        appliedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        location: job.location,
        skills: job.category === 'technical' ? 
          ['Electrical Work', 'Tool Handling', 'Safety Protocols'] :
          ['Physical Labor', 'Team Work', 'Punctuality'],
        profileImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
      });
    }
    return applications;
  };

  const applications = useMemo(() => generateJobApplications(), [job]);

  const filters = [
    { key: 'all', label: 'All', count: applications.length },
    { key: 'pending', label: 'Pending', count: applications.filter(a => a.status === 'pending').length },
    { key: 'shortlisted', label: 'Shortlisted', count: applications.filter(a => a.status === 'shortlisted').length },
    { key: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length },
  ];

  const filteredApplications = applications.filter(app => 
    selectedFilter === 'all' || app.status === selectedFilter
  );

  const handleStatusChange = (applicantId, newStatus) => {
    Alert.alert(
      'Change Status',
      `Change application status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            // Here you would update the status in your backend
            console.log(`Changing ${applicantId} status to ${newStatus}`);
          }
        },
      ]
    );
  };

  const handleCall = (phone) => {
    Alert.alert('Call', `Call ${phone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => console.log(`Calling ${phone}`) },
    ]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'shortlisted': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderApplicationCard = ({ item }) => (
    <View style={styles.applicationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.applicantInfo}>
          <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
          <View style={styles.applicantDetails}>
            <Text style={styles.applicantName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{item.rating}</Text>
              <Text style={styles.experience}>• {item.experience} years exp</Text>
            </View>
            <Text style={styles.appliedDate}>
              Applied {item.appliedDate.toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.skillsContainer}>
        <Text style={styles.skillsLabel}>Skills:</Text>
        <View style={styles.skillsList}>
          {item.skills.map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleCall(item.phone)}
        >
          <Ionicons name="call" size={16} color="#4F46E5" />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('WorkerDetails', { worker: item })}
        >
          <Ionicons name="person" size={16} color="#4F46E5" />
          <Text style={styles.actionText}>View Profile</Text>
        </TouchableOpacity>

        <View style={styles.statusActions}>
          {item.status === 'pending' && (
            <>
              <TouchableOpacity 
                style={[styles.statusButton, styles.approveButton]}
                onPress={() => handleStatusChange(item.id, 'shortlisted')}
              >
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statusButton, styles.rejectButton]}
                onPress={() => handleStatusChange(item.id, 'rejected')}
              >
                <Ionicons name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#4F46E5" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Applications</Text>
          <Text style={styles.headerSubtitle}>{filteredApplications.length} candidates</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Job Header */}
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <View style={styles.jobBadges}>
          <View style={[styles.experienceBadge, { 
            backgroundColor: job.experienceLevel === 'helper' ? '#10B981' : '#3B82F6' 
          }]}>
            <Text style={styles.badgeText}>
              {job.experienceLevel === 'helper' ? 'Helper Level' : 'Worker Level'}
            </Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{job.category}</Text>
          </View>
        </View>
        <Text style={styles.jobDetails}>₹{job.salary}/day • {job.location}</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.activeFilterTab
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === filter.key && styles.activeFilterTabText
            ]}>
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Applications List */}
      <FlatList
        data={filteredApplications}
        keyExtractor={item => item.id}
        renderItem={renderApplicationCard}
        contentContainerStyle={styles.applicationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No applications found</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'all' ? 
                'No one has applied for this job yet' : 
                `No ${selectedFilter} applications`}
            </Text>
          </View>
        }
      />
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
  jobHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  jobBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  experienceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  jobDetails: {
    fontSize: 16,
    color: '#6B7280',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12, // Increased to match ActiveJobScreen
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12, // Increased to match ActiveJobScreen
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeFilterTab: {
    borderBottomColor: '#4F46E5',
    backgroundColor: '#F8FAFC',
  },
  filterTabText: {
    fontSize: 14, // Increased to match ActiveJobScreen
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  activeFilterTabText: {
    color: '#4F46E5',
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
    flexDirection: 'row',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  applicantDetails: {
    flex: 1,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  experience: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  appliedDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  skillsContainer: {
    marginBottom: 16,
  },
  skillsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  actionText: {
    marginLeft: 8, // Increased margin for better spacing
    fontSize: 14,
    fontWeight: '600', // Made text slightly bolder
    color: '#4F46E5',
  },
  statusActions: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
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
    textAlign: 'center',
  },
});

export default ApplicationsScreen;
