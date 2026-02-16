import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useResponsive } from '../utils/responsive';

const SearchScreen = ({ navigation, route }) => {
  const r = useResponsive();
  const styles = useMemo(() => createStyles(r), [r.width, r.height]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  useEffect(() => {
    loadUserTestStatus();
  }, []);

  const loadUserTestStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('skillAssessmentCompleted');
      setTestStatus(status);
    } catch (error) {
      console.error('Error loading test status:', error);
    }
  };

  const handleSearch = async (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Fetch all jobs from backend
      const backendJobs = await api.get('/api/jobs', { auth: false });
      
      if (backendJobs && backendJobs.length > 0) {
        // Transform backend jobs
        const transformedJobs = backendJobs.map(job => ({
          id: job._id,
          _id: job._id, // Keep _id for API calls
          title: job.title,
          location: job.location,
          salary: job.salary,
          type: job.type,
          category: job.category,
          description: job.description,
          requirements: job.requirements || [],
          benefits: job.benefits || [],
          postedBy: job.postedBy?.name || 'Unknown',
          contact: job.postedBy?.phone || '',
          urgency: job.urgency || 'normal',
          timeAgo: job.createdAt ? getTimeAgo(new Date(job.createdAt)) : 'Recently',
        }));

        // Filter by quiz status
        let filteredByQuiz = transformedJobs;
        if (testStatus !== 'passed') {
          filteredByQuiz = transformedJobs.filter(job => job.type === 'Daily Work');
        }

        // Search filter
        const searchLower = text.toLowerCase();
        const filtered = filteredByQuiz.filter(job => 
          job.title.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower) ||
          job.category.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
        );

        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching jobs:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handleJobPress = (job) => {
    navigation.navigate('JobDetailsScreen', { job });
  };

  const handleViewDetails = (job) => {
    // Navigate to job details screen where user can apply
    navigation.navigate('JobDetailsScreen', { job });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Jobs</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs by title, company, or location..."
          value={searchText}
          onChangeText={handleSearch}
          autoFocus={true}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results */}
      <ScrollView 
        style={styles.resultsContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Searching jobs...</Text>
          </View>
        ) : searchText.length > 0 && searchResults.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search" size={48} color="#D1D5DB" />
            <Text style={styles.noResultsTitle}>No jobs found</Text>
            <Text style={styles.noResultsText}>
              Try adjusting your search terms or browse categories
            </Text>
          </View>
        ) : searchText.length === 0 ? (
          <View style={styles.initialContainer}>
            <Ionicons name="search" size={48} color="#D1D5DB" />
            <Text style={styles.initialTitle}>Search for jobs</Text>
            <Text style={styles.initialText}>
              Enter keywords to find jobs that match your skills and interests
            </Text>
          </View>
        ) : (
          searchResults.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={styles.jobCard}
              onPress={() => handleJobPress(job)}
            >
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleViewDetails(job);
                  }}
                >
                  <Text style={styles.applyButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.jobCompany}>{job.postedBy}</Text>
              
              <View style={styles.jobDetails}>
                <View style={styles.jobDetail}>
                  <Ionicons name="location" size={14} color="#6B7280" />
                  <Text style={styles.jobDetailText}>{job.location}</Text>
                </View>
                <View style={styles.jobDetail}>
                  <Ionicons name="cash" size={14} color="#6B7280" />
                  <Text style={styles.jobDetailText}>{job.salary}</Text>
                </View>
                <View style={styles.jobDetail}>
                  <Ionicons name="construct" size={14} color="#6B7280" />
                  <Text style={styles.jobDetailText}>{job.type}</Text>
                </View>
                <View style={styles.jobDetail}>
                  <Ionicons name="time" size={14} color="#6B7280" />
                  <Text style={styles.jobDetailText}>{job.timeAgo}</Text>
                </View>
              </View>
              
              {job.urgency === 'urgent' && (
                <View style={styles.urgentBadge}>
                  <Ionicons name="flash" size={12} color="#EF4444" />
                  <Text style={styles.urgentText}>Urgent</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

function createStyles(r) {
  const pad = r.horizontalPadding;
  const sp = r.spacing;
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: sp.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pad,
    paddingTop: r.isTablet ? 48 : 40,
    paddingBottom: sp.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: pad,
    marginVertical: sp.md,
    paddingHorizontal: sp.md,
    paddingVertical: sp.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  resultsContainer: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: pad,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  noResultsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  initialContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  initialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  initialText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
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
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  jobTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginRight: 12,
  },
  applyButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  jobCompany: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobDetailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  urgentText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: 4,
  },
});
}

export default SearchScreen; 