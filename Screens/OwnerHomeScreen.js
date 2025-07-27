
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StatusBar,
  Alert,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

// Updated job categories based on actual work requirements
const jobCategories = {
  daily: {
    title: 'Daily Work',
    icon: 'today',
    color: '#10B981',
    description: 'Physical labor and routine tasks - Choose based on your needs',
    jobs: [
      { 
        name: 'Farm Labor', 
        icon: 'leaf', 
        color: '#10B981',
        experienceRequired: 'flexible',
        trainingProvided: true,
        description: 'Agricultural work - Can hire experienced or train new workers'
      },
      { 
        name: 'Construction Helper', 
        icon: 'hammer', 
        color: '#F59E0B',
        experienceRequired: 'flexible',
        trainingProvided: true,
        description: 'Construction support - Experienced workers preferred, helpers welcome'
      },
      { 
        name: 'Sweeper', 
        icon: 'brush', 
        color: '#3B82F6',
        experienceRequired: 'none',
        trainingProvided: false,
        description: 'Cleaning work - No experience required'
      },
      { 
        name: 'Maid/Housekeeping', 
        icon: 'people', 
        color: '#8B5CF6',
        experienceRequired: 'flexible',
        trainingProvided: true,
        description: 'Household work - Experienced preferred, training available'
      },
      { 
        name: 'Loading/Unloading', 
        icon: 'cube', 
        color: '#EF4444',
        experienceRequired: 'none',
        trainingProvided: false,
        description: 'Physical work - No prior experience needed'
      },
      { 
        name: 'Gardening', 
        icon: 'flower', 
        color: '#10B981',
        experienceRequired: 'flexible',
        trainingProvided: true,
        description: 'Garden maintenance - Experienced gardeners or train new workers'
      },
    ]
  },
  technical: {
    title: 'Technical Work',
    icon: 'build',
    color: '#6366F1',
    description: 'Skilled work requiring specific expertise',
    jobs: [
      { 
        name: 'Electrician Helper', 
        icon: 'flash', 
        color: '#EF4444',
        experienceRequired: 'basic',
        trainingProvided: true,
        description: 'Electrical work - Assist experienced electricians'
      },
      { 
        name: 'Plumber Helper', 
        icon: 'water', 
        color: '#06B6D4',
        experienceRequired: 'basic',
        trainingProvided: true,
        description: 'Plumbing work - Start as helper, gain experience'
      },
      { 
        name: 'Carpenter Assistant', 
        icon: 'construct', 
        color: '#A855F7',
        experienceRequired: 'basic',
        trainingProvided: true,
        description: 'Carpentry work - Learn from experienced carpenters'
      },
      { 
        name: 'Mechanic Trainee', 
        icon: 'car-sport', 
        color: '#F97316',
        experienceRequired: 'basic',
        trainingProvided: true,
        description: 'Vehicle repair - Start as trainee, learn from experts'
      },
      { 
        name: 'Mason Helper', 
        icon: 'home', 
        color: '#F59E0B',
        experienceRequired: 'basic',
        trainingProvided: true,
        description: 'Construction work - Learn masonry skills'
      },
      { 
        name: 'Welder Trainee', 
        icon: 'flame', 
        color: '#DC2626',
        experienceRequired: 'basic',
        trainingProvided: true,
        description: 'Welding work - Learn welding with safety training'
      },
    ]
  }
};

// Updated job postings based on actual requirements
const myPostedJobs = [
  {
    id: 1,
    title: 'Farm Labor - Experienced Workers Preferred',
    category: 'Farm Labor',
    location: 'Rajam, Srikakulam',
    salary: '₹450/day',
    applicants: 12,
    status: 'Active',
    postedDate: '2 hours ago',
    description: 'Rice field harvesting work. Experienced farm workers preferred, but willing to train new workers.',
    stream: 'daily',
    experienceLevel: 'experienced',
    trainingProvided: true,
    requirements: [
      'Physical fitness required',
      'Experience in farming preferred',
      'Available for full day',
      'Willing to work outdoors'
    ],
    benefits: [
      'On-job training for new workers',
      'Daily payment',
      'Lunch provided',
      'Skill development opportunities'
    ],
    postedBy: 'Ramesh Naidu',
    contact: '9876543210',
  },
  {
    id: 2,
    title: 'Construction Helper - Experience Required',
    category: 'Construction Helper',
    location: 'Kothavalasa',
    salary: '₹600/day',
    applicants: 8,
    status: 'Active',
    postedDate: '1 day ago',
    description: 'House construction work. Looking for experienced construction helpers or workers with basic knowledge.',
    stream: 'daily',
    experienceLevel: 'experienced',
    trainingProvided: true,
    requirements: [
      'Construction experience preferred',
      'Basic understanding of tools',
      'Hardworking attitude',
      'Safety conscious'
    ],
    benefits: [
      'Skill enhancement',
      'Career growth opportunities',
      'Safety equipment provided',
      'Weekly bonus'
    ],
    postedBy: 'Suresh Kumar',
    contact: '9876501234',
  },
  {
    id: 3,
    title: 'Plumber Helper - Basic Skills Required',
    category: 'Plumber Helper',
    location: 'Vizianagaram',
    salary: '₹700/day',
    applicants: 5,
    status: 'Active',
    postedDate: '3 days ago',
    description: 'Assist experienced plumber. Basic plumbing knowledge required, will provide additional training.',
    stream: 'technical',
    experienceLevel: 'experienced',
    trainingProvided: true,
    requirements: [
      'Basic plumbing knowledge',
      'Tool handling experience',
      'Willingness to learn',
      'Physical fitness'
    ],
    benefits: [
      'Advanced training provided',
      'Tool usage training',
      'Future job opportunities',
      'Certification support'
    ],
    postedBy: 'Anil Kumar',
    contact: '9876501234',
  },
  {
    id: 4,
    title: 'Electrician Helper - Experience Preferred',
    category: 'Electrician Helper',
    location: 'Srikakulam',
    salary: '₹650/day',
    applicants: 3,
    status: 'Active',
    postedDate: '1 day ago',
    description: 'Home electrical work. Experienced electrician helpers preferred, basic electrical knowledge required.',
    stream: 'technical',
    experienceLevel: 'experienced',
    trainingProvided: true,
    requirements: [
      'Electrical work experience',
      'Safety consciousness',
      'Basic electrical knowledge',
      'Tool handling skills'
    ],
    benefits: [
      'Professional training',
      'Safety certification',
      'Career advancement',
      'Tool kit provided'
    ],
    postedBy: 'Prakash Rao',
    contact: '9876501234',
  },
  {
    id: 5,
    title: 'Garden Maintenance - Experienced Gardeners',
    category: 'Gardening',
    location: 'Vizianagaram',
    salary: '₹400/day',
    applicants: 6,
    status: 'Active',
    postedDate: '4 hours ago',
    description: 'Garden maintenance work. Experienced gardeners preferred, will train new workers.',
    stream: 'daily',
    experienceLevel: 'experienced',
    trainingProvided: true,
    requirements: [
      'Gardening experience preferred',
      'Knowledge of plants and tools',
      'Physical fitness',
      'Love for outdoor work'
    ],
    benefits: [
      'Plant care training',
      'Gardening certification',
      'Flexible timings',
      'Skill development'
    ],
    postedBy: 'Lakshmi Devi',
    contact: '9998887777',
  },
  {
    id: 6,
    title: 'Welder Trainee - Basic Skills Required',
    category: 'Welder Trainee',
    location: 'Srikakulam',
    salary: '₹800/day',
    applicants: 4,
    status: 'Active',
    postedDate: '6 hours ago',
    description: 'Welding work with experienced professionals. Basic metalwork knowledge required, comprehensive training provided.',
    stream: 'technical',
    experienceLevel: 'experienced',
    trainingProvided: true,
    requirements: [
      'Basic metalwork knowledge',
      'Safety consciousness',
      'Physical fitness',
      'Interest in welding'
    ],
    benefits: [
      'Complete welding training',
      'Safety certification',
      'Professional equipment training',
      'Future job guarantee'
    ],
    postedBy: 'Ravi Shankar',
    contact: '9998887777',
  },
];

const OwnerHomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedJobType, setSelectedJobType] = useState(null);
  const [notifications, setNotifications] = useState(4);
  const [activeJobs, setActiveJobs] = useState(
    myPostedJobs.filter(job => job.status === 'Active').length
  );
  const [totalApplications, setTotalApplications] = useState(
    myPostedJobs.reduce((sum, job) => sum + job.applicants, 0)
  );

  const fetchLocation = async () => {
    try {
      setLoadingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        setLoadingLocation(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      let reverse = await Location.reverseGeocodeAsync(loc.coords);
      if (reverse.length > 0) {
        const place = reverse[0];
        const city =
          place.city ||
          place.district ||
          place.subregion ||
          place.region ||
          place.name ||
          'Unknown Location';
        setLocation(city.trim());
      } else {
        setLocation('Unknown Location');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not fetch location');
      setLocation('Unknown Location');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleCategorySelect = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setSelectedJobType(null);
  };

  const handleJobSelect = (job, categoryKey) => {
    setSelectedJobType(job.name);
  };

  const handleJobPress = (job) => {
    navigation.navigate('JobManagement', { job });
  };

  const handleViewApplications = (job) => {
    navigation.navigate('Applications', { job });
  };

  const handleActiveJobsPress = () => {
    const activeJobsList = myPostedJobs.filter(job => job.status === 'Active');
    navigation.navigate('ActiveJobs', { jobs: activeJobsList });
  };

  const handleApplicationsPress = () => {
    navigation.navigate('AllApplications', { jobs: myPostedJobs });
  };

  const handleNotificationPress = () => {
    setNotifications(0);
    navigation.navigate('Notifications');
  };

  const handlePostNewJob = (job, categoryKey) => {
    navigation.navigate('PostJob', {
      categoryName: job.name,
      categoryIcon: job.icon,
      categoryColor: job.color,
      stream: categoryKey,
      jobDetails: job,
    });
  };

  const getFilteredJobs = () => {
    if (!selectedJobType) return myPostedJobs;
    return myPostedJobs.filter(job => job.category === selectedJobType);
  };

  const renderJobCategories = () => {
    if (selectedJobType) {
      const filteredJobs = getFilteredJobs();
      const selectedJob = jobCategories[selectedCategory].jobs.find(job => job.name === selectedJobType);
      
      return (
        <View>
          <View style={styles.backHeader}>
            <TouchableOpacity
              onPress={() => setSelectedJobType(null)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#4F46E5" />
            </TouchableOpacity>
            <Ionicons name={selectedJob.icon} size={24} color={selectedJob.color} style={styles.headerIcon} />
            <Text style={styles.pageTitle}>
              {selectedJobType} Jobs
            </Text>
          </View>

          {/* Job Type Info Card */}
          <View style={styles.jobTypeInfo}>
            <Text style={styles.jobTypeDescription}>{selectedJob.description}</Text>
            <View style={styles.jobTypeFeatures}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.featureText}>
                  {selectedJob.experienceRequired === 'none' ? 'No Experience Required' : 
                   selectedJob.experienceRequired === 'flexible' ? 'Experience Preferred' : 'Basic Skills Required'}
                </Text>
              </View>
              {selectedJob.trainingProvided && (
                <View style={styles.featureItem}>
                  <Ionicons name="school" size={16} color="#4F46E5" />
                  <Text style={styles.featureText}>Training Available</Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handlePostNewJob(selectedJob, selectedCategory)}
            style={styles.postJobButton}
          >
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            <Text style={styles.postJobButtonText}>
              Post New {selectedJobType} Job
            </Text>
          </TouchableOpacity>

          <View style={styles.jobListContainer}>
            <Text style={styles.jobListTitle}>
              Your Posted Jobs ({filteredJobs.length})
            </Text>
            
            {filteredJobs.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="briefcase-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateTitle}>
                  No {selectedJobType} jobs posted yet
                </Text>
                <Text style={styles.emptyStateSubtitle}>
                  Post your first job to find qualified workers
                </Text>
              </View>
            ) : (
              filteredJobs.map((job) => (
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
                        <Text style={styles.jobDate}> • {job.postedDate}</Text>
                      </View>
                    </View>
                    <View style={styles.badgeContainer}>
                      <View style={[styles.statusBadge, { backgroundColor: job.status === 'Active' ? '#10B981' : '#6B7280' }]}>
                        <Text style={styles.statusText}>{job.status}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text style={styles.jobDescription}>{job.description}</Text>
                  
                  {/* Job features */}
                  <View style={styles.jobFeatures}>
                    <View style={styles.featureTag}>
                      <Ionicons name="person-add" size={12} color="#10B981" />
                      <Text style={styles.featureTagText}>
                        {job.experienceLevel === 'experienced' ? 'Experienced Workers' : 'Helpers Welcome'}
                      </Text>
                    </View>
                    {job.trainingProvided && (
                      <View style={styles.featureTag}>
                        <Ionicons name="school" size={12} color="#4F46E5" />
                        <Text style={styles.featureTagText}>Training Available</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.jobFooter}>
                    <View style={styles.salaryContainer}>
                      <Text style={styles.salary}>{job.salary}</Text>
                      <View style={styles.applicantsContainer}>
                        <Ionicons name="people" size={16} color="#6B7280" />
                        <Text style={styles.applicantsText}>{job.applicants} applicants</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleViewApplications(job);
                      }}
                      style={styles.viewApplicationsButton}
                    >
                      <Text style={styles.viewApplicationsText}>View Applications</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      );
    }

    if (selectedCategory) {
      const category = jobCategories[selectedCategory];
      return (
        <View>
          <View style={styles.backHeader}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#4F46E5" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>
              {category.title}
            </Text>
          </View>
          
          {/* Category Description */}
          <View style={styles.categoryDescription}>
            <Text style={styles.categoryDescriptionText}>{category.description}</Text>
          </View>
          
          <View style={styles.jobTypesGrid}>
            {category.jobs.map((job, index) => {
              const jobCount = myPostedJobs.filter(postedJob => postedJob.category === job.name).length;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleJobSelect(job, selectedCategory)}
                  style={styles.jobTypeCard}
                >
                  <View style={[styles.jobTypeIconContainer, { backgroundColor: job.color + '20' }]}>
                    <Ionicons name={job.icon} size={28} color={job.color} />
                  </View>
                  <Text style={styles.jobTypeName}>{job.name}</Text>
                  <Text style={styles.jobTypeDescription}>{job.description}</Text>
                  <View style={styles.jobTypeFeatures}>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                      <Text style={styles.featureText}>
                        {job.experienceRequired === 'none' ? 'No Experience' : 
                         job.experienceRequired === 'flexible' ? 'Experience Preferred' : 'Basic Skills'}
                      </Text>
                    </View>
                    {job.trainingProvided && (
                      <View style={styles.featureItem}>
                        <Ionicons name="school" size={12} color="#4F46E5" />
                        <Text style={styles.featureText}>Training</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.jobTypeCount}>{jobCount} jobs posted</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>Choose Job Category</Text>
        <Text style={styles.sectionSubtitle}>Select based on your work requirements and experience needs</Text>
        <View style={styles.categoriesGrid}>
          {Object.entries(jobCategories).map(([key, category]) => (
            <TouchableOpacity
              key={key}
              onPress={() => handleCategorySelect(key)}
              style={styles.categoryCard}
            >
              <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '20' }]}>
                <Ionicons name={category.icon} size={32} color={category.color} />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categorySubtitle}>
                {myPostedJobs.filter(job => job.stream === key).length} jobs
              </Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Enhanced Header with proper centering */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={fetchLocation} style={styles.locationButton}>
            <Ionicons name="location" size={16} color="#6B7280" />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Your Location</Text>
              <Text style={styles.locationText}>
                {loadingLocation ? 'Locating...' : location || 'Unknown'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={styles.brandTitle}>VWork</Text>
          <Text style={styles.brandSubtitle}>Quality Work Opportunities</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#374151" />
            {notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Enhanced Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity onPress={handleActiveJobsPress} style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={styles.statIconContainer}>
              <Ionicons name="briefcase" size={18} color="#4F46E5" />
            </View>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </View>
          <Text style={styles.statNumber}>{activeJobs}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleApplicationsPress} style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={styles.statIconContainer}>
              <Ionicons name="people" size={18} color="#10B981" />
            </View>
            <Text style={styles.statLabel}>Applications</Text>
          </View>
          <Text style={styles.statNumber}>{totalApplications}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {!selectedJobType && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search jobs by requirements, location..."
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {renderJobCategories()}

        {/* My Posted Jobs - Only show on home view */}
        {!selectedCategory && !selectedJobType && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Posted Jobs</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllJobs')}>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {myPostedJobs.slice(0, 3).map((job) => (
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
                      <Text style={styles.jobCategory}> • {job.category}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: job.status === 'Active' ? '#10B981' : '#6B7280' }]}>
                    <Text style={styles.statusText}>{job.status}</Text>
                  </View>
                </View>
                <Text style={styles.jobDescription}>{job.description}</Text>
                
                {/* Beginner-friendly features */}
                <View style={styles.jobFeatures}>
                  <View style={styles.featureTag}>
                    <Ionicons name="person-add" size={12} color="#10B981" />
                    <Text style={styles.featureTagText}>Beginner Friendly</Text>
                  </View>
                  {job.trainingProvided && (
                    <View style={styles.featureTag}>
                      <Ionicons name="school" size={12} color="#4F46E5" />
                      <Text style={styles.featureTagText}>Training Provided</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.jobFooter}>
                  <View style={styles.salaryContainer}>
                    <Text style={styles.salary}>{job.salary}</Text>
                    <View style={styles.applicantsContainer}>
                      <Ionicons name="people" size={16} color="#6B7280" />
                      <Text style={styles.applicantsText}>{job.applicants} applicants</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleViewApplications(job);
                    }}
                    style={styles.viewApplicationsButton}
                  >
                    <Text style={styles.viewApplicationsText}>View Applications</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
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
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInfo: {
    marginLeft: 6,
  },
  locationLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  brandTitle: {
    fontSize: 18, // Reduced from 22
    fontWeight: '800',
    color: '#4F46E5',
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#10B981',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '600',
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#10B981',
    paddingHorizontal: 20,
    marginBottom: 16,
    fontWeight: '500',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    marginHorizontal: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 11,
    color: '#10B981',
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryDescriptionText: {
    fontSize: 14,
    color: '#10B981',
    textAlign: 'center',
    fontWeight: '500',
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  headerIcon: {
    marginRight: 8,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  jobTypeInfo: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  jobTypeDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  jobTypeFeatures: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  jobTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  jobTypeCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  jobTypeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  jobTypeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  jobTypeCount: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  postJobButton: {
    backgroundColor: '#4F46E5',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postJobButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  jobListContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  jobListTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  emptyStateTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 4,
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 17,
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
  jobDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  jobDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  jobFeatures: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  featureTagText: {
    fontSize: 11,
    color: '#10B981',
    marginLeft: 4,
    fontWeight: '600',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salaryContainer: {
    alignItems: 'flex-start',
  },
  salary: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  applicantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  applicantsText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  viewApplicationsButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  viewApplicationsText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default OwnerHomeScreen;
