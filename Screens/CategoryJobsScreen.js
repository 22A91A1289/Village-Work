
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getJobsByCategory } from '../data/jobData';

const CategoryJobsScreen = ({ route, navigation }) => {
  const { categoryName, categoryIcon } = route.params;
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Get jobs for this category from shared data
  const categoryJobs = getJobsByCategory(categoryName);

  const handleJobPress = (job) => {
    navigation.navigate('JobDetailsScreen', { job });
  };

  const handleApplyJob = (jobId) => {
    // Handle job application
    console.log('Applied for job:', jobId);
  };

  const getFilteredJobs = () => {
    switch (selectedFilter) {
      case 'training':
        return categoryJobs.filter(job => job.trainingProvided);
      case 'urgent':
        return categoryJobs.filter(job => job.urgency === 'urgent');
      case 'entry':
        return categoryJobs.filter(job => job.experienceLevel === 'beginner');
      default:
        return categoryJobs;
    }
  };

  const filteredJobs = getFilteredJobs();

  const filters = [
    { key: 'all', label: 'All Jobs', icon: 'apps' },
    { key: 'entry', label: 'Entry Level', icon: 'person-add' },
    { key: 'training', label: 'With Training', icon: 'school' },
    { key: 'urgent', label: 'Urgent', icon: 'flash' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerTitleContainer}>
            <Ionicons name={categoryIcon} size={24} color="#4F46E5" />
            <Text style={styles.headerTitle}>{categoryName} Jobs</Text>
          </View>
          <Text style={styles.headerSubtitle}>Perfect for beginners</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Category Info Card */}
      <View style={styles.categoryInfoCard}>
        <View style={styles.categoryInfoHeader}>
          <Ionicons name="information-circle" size={20} color="#4F46E5" />
          <Text style={styles.categoryInfoTitle}>About {categoryName} Jobs</Text>
        </View>
        <Text style={styles.categoryInfoText}>
          All {categoryName.toLowerCase()} positions are designed for beginners. No prior experience required - we provide training!
        </Text>
        <View style={styles.categoryFeatures}>
          <View style={styles.categoryFeature}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.categoryFeatureText}>Training Provided</Text>
          </View>
          <View style={styles.categoryFeature}>
            <Ionicons name="school" size={16} color="#10B981" />
            <Text style={styles.categoryFeatureText}>Skill Development</Text>
          </View>
          <View style={styles.categoryFeature}>
            <Ionicons name="trending-up" size={16} color="#10B981" />
            <Text style={styles.categoryFeatureText}>Career Growth</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="briefcase" size={18} color="#4F46E5" />
          <Text style={styles.statNumber}>{filteredJobs.length}</Text>
          <Text style={styles.statLabel}>Available Jobs</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="school" size={18} color="#10B981" />
          <Text style={styles.statNumber}>{filteredJobs.filter(job => job.trainingProvided).length}</Text>
          <Text style={styles.statLabel}>With Training</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="person-add" size={18} color="#F59E0B" />
          <Text style={styles.statNumber}>{filteredJobs.filter(job => job.experienceLevel === 'beginner').length}</Text>
          <Text style={styles.statLabel}>Entry Level</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key)}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.activeFilter
              ]}
            >
              <Ionicons 
                name={filter.icon} 
                size={16} 
                color={selectedFilter === filter.key ? '#FFFFFF' : '#6B7280'}
                style={styles.filterIcon}
              />
              <Text style={[
                styles.filterText,
                selectedFilter === filter.key && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Job List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.jobList}>
        {filteredJobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            onPress={() => handleJobPress(job)}
            style={styles.jobCard}
          >
            <View style={styles.jobHeader}>
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.jobMeta}>
                  <Ionicons name="location" size={14} color="#6B7280" />
                  <Text style={styles.jobLocation}>{job.location}</Text>
                  <Text style={styles.jobTime}> • {job.timeAgo}</Text>
                </View>
              </View>
              <View style={styles.jobHeaderRight}>
                {job.urgency === 'urgent' && (
                  <View style={styles.urgentBadge}>
                    <Ionicons name="flash" size={12} color="#DC2626" />
                    <Text style={styles.urgentText}>Urgent</Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.jobDescription}>{job.description}</Text>

            {/* Beginner-Friendly Features */}
            <View style={styles.jobFeatures}>
              <View style={styles.featureTag}>
                <Ionicons name="person-add" size={12} color="#10B981" />
                <Text style={styles.featureText}>Beginner Friendly</Text>
              </View>
              {job.trainingProvided && (
                <View style={styles.featureTag}>
                  <Ionicons name="school" size={12} color="#4F46E5" />
                  <Text style={styles.featureText}>Training Provided</Text>
                </View>
              )}
              {job.mentorshipAvailable && (
                <View style={styles.featureTag}>
                  <Ionicons name="people" size={12} color="#F59E0B" />
                  <Text style={styles.featureText}>Mentorship Available</Text>
                </View>
              )}
            </View>

            {/* Benefits Section */}
            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>What you'll get:</Text>
              <View style={styles.benefitsList}>
                {job.benefits.slice(0, 2).map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Requirements */}
            <View style={styles.requirementsSection}>
              <Text style={styles.requirementsTitle}>Simple requirements:</Text>
              <View style={styles.requirementsList}>
                {job.requirements.slice(0, 2).map((requirement, index) => (
                  <View key={index} style={styles.requirementItem}>
                    <Ionicons name="checkmark" size={12} color="#6B7280" />
                    <Text style={styles.requirementText}>{requirement}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.jobFooter}>
              <View style={styles.salaryContainer}>
                <Text style={styles.salaryLabel}>Daily Payment</Text>
                <Text style={styles.salary}>{job.salary}</Text>
              </View>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleApplyJob(job.id);
                }}
              >
                <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
                <Text style={styles.applyText}>Apply Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* Learn More Card */}
        <View style={styles.learnMoreCard}>
          <Ionicons name="school" size={32} color="#4F46E5" />
          <Text style={styles.learnMoreTitle}>Want to learn more skills?</Text>
          <Text style={styles.learnMoreText}>
            Join our skill development programs and increase your earning potential!
          </Text>
          <TouchableOpacity style={styles.learnMoreButton}>
            <Text style={styles.learnMoreButtonText}>Learn More</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 15,
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
  searchButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 2,
    fontWeight: '600',
  },
  categoryInfoCard: {
    backgroundColor: '#EBF4FF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  categoryInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginLeft: 8,
  },
  categoryInfoText: {
    fontSize: 14,
    color: '#3730A3',
    lineHeight: 20,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  categoryFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  categoryFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    flex: 1,
  },
  categoryFeatureText: {
    fontSize: 12,
    color: '#047857',
    marginLeft: 4,
    fontWeight: '600',
    flexWrap: 'wrap',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activeFilter: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  jobList: {
    flex: 1,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  jobTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobHeaderRight: {
    alignItems: 'flex-end',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgentText: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '600',
    marginLeft: 2,
  },
  jobDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  featureText: {
    fontSize: 10,
    color: '#047857',
    marginLeft: 3,
    fontWeight: '600',
  },
  benefitsSection: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 6,
  },
  benefitsList: {
    gap: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 12,
    color: '#92400E',
    marginLeft: 6,
  },
  requirementsSection: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  requirementsList: {
    gap: 4,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salaryContainer: {
    alignItems: 'flex-start',
  },
  salaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  salary: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  applyButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  learnMoreCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  learnMoreTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  learnMoreText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  learnMoreButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  learnMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CategoryJobsScreen;
