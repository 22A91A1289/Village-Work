
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const JobManagementScreen = ({ route, navigation }) => {
//   const { job } = route.params;
//   const [isActive, setIsActive] = useState(job.status === 'Active');

//   const handleToggleStatus = () => {
//     Alert.alert(
//       `${isActive ? 'Deactivate' : 'Activate'} Job`,
//       `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this job?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Confirm', 
//           onPress: () => {
//             setIsActive(!isActive);
//             Alert.alert('Success', `Job ${isActive ? 'deactivated' : 'activated'} successfully`);
//           }
//         }
//       ]
//     );
//   };

//   const handleDeleteJob = () => {
//     Alert.alert(
//       'Delete Job',
//       'Are you sure you want to delete this job? This action cannot be undone.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Delete', 
//           style: 'destructive',
//           onPress: () => {
//             Alert.alert('Success', 'Job deleted successfully');
//             navigation.goBack();
//           }
//         }
//       ]
//     );
//   };

//   const handleViewApplications = () => {
//     navigation.navigate('Applications', { job });
//   };

//   const handleEditJob = () => {
//     Alert.alert('Edit Job', 'Edit functionality will be implemented');
//   };

//   const handleShareJob = () => {
//     Alert.alert('Share Job', 'Share functionality will be implemented');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#374151" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Job Management</Text>
//         <TouchableOpacity onPress={handleShareJob} style={styles.shareButton}>
//           <Ionicons name="share" size={24} color="#374151" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
//         {/* Job Info Card */}
//         <View style={styles.jobCard}>
//           <View style={styles.jobHeader}>
//             <Text style={styles.jobTitle}>{job.title}</Text>
//             <View style={[styles.statusBadge, { 
//               backgroundColor: isActive ? '#10B981' : '#6B7280' 
//             }]}>
//               <Text style={styles.statusText}>{isActive ? 'Active' : 'Inactive'}</Text>
//             </View>
//           </View>
          
//           <View style={styles.jobDetails}>
//             <View style={styles.detailRow}>
//               <Ionicons name="location" size={18} color="#6B7280" />
//               <Text style={styles.detailText}>{job.location}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Ionicons name="cash" size={18} color="#6B7280" />
//               <Text style={styles.detailText}>{job.salary}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Ionicons name="time" size={18} color="#6B7280" />
//               <Text style={styles.detailText}>Posted {job.postedDate}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Ionicons name="briefcase" size={18} color="#6B7280" />
//               <Text style={styles.detailText}>{job.category}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Description */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Job Description</Text>
//           <Text style={styles.description}>{job.description}</Text>
//         </View>

//         {/* Statistics */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Job Statistics</Text>
//           <View style={styles.statsContainer}>
//             <View style={styles.statCard}>
//               <Ionicons name="people" size={24} color="#4F46E5" />
//               <Text style={styles.statNumber}>{job.applicants}</Text>
//               <Text style={styles.statLabel}>Applicants</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Ionicons name="eye" size={24} color="#10B981" />
//               <Text style={styles.statNumber}>156</Text>
//               <Text style={styles.statLabel}>Views</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Ionicons name="heart" size={24} color="#EF4444" />
//               <Text style={styles.statNumber}>23</Text>
//               <Text style={styles.statLabel}>Saved</Text>
//             </View>
//           </View>
//         </View>

//         {/* Recent Applications */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Recent Applications</Text>
//             <TouchableOpacity onPress={handleViewApplications}>
//               <Text style={styles.viewAllText}>View All</Text>
//             </TouchableOpacity>
//           </View>
          
//           <View style={styles.applicantsList}>
//             {/* Sample recent applicants */}
//             <View style={styles.applicantRow}>
//               <View style={styles.applicantAvatar}>
//                 <Text style={styles.applicantInitial}>R</Text>
//               </View>
//               <View style={styles.applicantInfo}>
//                 <Text style={styles.applicantName}>Ravi Kumar</Text>
//                 <Text style={styles.applicantTime}>Applied 2 hours ago</Text>
//               </View>
//               <TouchableOpacity style={styles.applicantAction}>
//                 <Ionicons name="chevron-forward" size={16} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
            
//             <View style={styles.applicantRow}>
//               <View style={styles.applicantAvatar}>
//                 <Text style={styles.applicantInitial}>S</Text>
//               </View>
//               <View style={styles.applicantInfo}>
//                 <Text style={styles.applicantName}>Suresh Babu</Text>
//                 <Text style={styles.applicantTime}>Applied 1 day ago</Text>
//               </View>
//               <TouchableOpacity style={styles.applicantAction}>
//                 <Ionicons name="chevron-forward" size={16} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {/* Actions */}
//         <View style={styles.actionsContainer}>
//           <TouchableOpacity style={styles.primaryButton} onPress={handleViewApplications}>
//             <Ionicons name="people" size={20} color="#FFFFFF" />
//             <Text style={styles.primaryButtonText}>View Applications</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity style={styles.secondaryButton} onPress={handleEditJob}>
//             <Ionicons name="create" size={20} color="#4F46E5" />
//             <Text style={styles.secondaryButtonText}>Edit Job</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.secondaryButton, { backgroundColor: isActive ? '#FEF2F2' : '#F0FDF4' }]} 
//             onPress={handleToggleStatus}
//           >
//             <Ionicons 
//               name={isActive ? "pause" : "play"} 
//               size={20} 
//               color={isActive ? '#EF4444' : '#10B981'} 
//             />
//             <Text style={[styles.secondaryButtonText, { 
//               color: isActive ? '#EF4444' : '#10B981' 
//             }]}>
//               {isActive ? 'Deactivate' : 'Activate'}
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteJob}>
//             <Ionicons name="trash" size={20} color="#EF4444" />
//             <Text style={styles.deleteButtonText}>Delete Job</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     paddingBottom: 15,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: '#F3F4F6',
//   },
//   shareButton: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: '#F3F4F6',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1F2937',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   jobCard: {
//     backgroundColor: '#FFFFFF',
//     margin: 20,
//     padding: 20,
//     borderRadius: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     borderWidth: 1,
//     borderColor: '#F3F4F6',
//   },
//   jobHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   jobTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1F2937',
//     flex: 1,
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 12,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   jobDetails: {
//     gap: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   detailText: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginLeft: 12,
//   },
//   section: {
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 20,
//     marginBottom: 20,
//     padding: 20,
//     borderRadius: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     borderWidth: 1,
//     borderColor: '#F3F4F6',
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 12,
//   },
//   viewAllText: {
//     fontSize: 14,
//     color: '#4F46E5',
//     fontWeight: '600',
//   },
//   description: {
//     fontSize: 16,
//     color: '#6B7280',
//     lineHeight: 24,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   statCard: {
//     flex: 1,
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     padding: 16,
//     borderRadius: 12,
//     marginHorizontal: 4,
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginTop: 8,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   applicantsList: {
//     gap: 12,
//   },
//   applicantRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     padding: 12,
//     borderRadius: 12,
//   },
//   applicantAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#4F46E5',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   applicantInitial: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   applicantInfo: {
//     flex: 1,
//   },
//   applicantName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   applicantTime: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   applicantAction: {
//     padding: 8,
//   },
//   actionsContainer: {
//     padding: 20,
//     gap: 12,
//   },
//   primaryButton: {
//     backgroundColor: '#4F46E5',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     borderRadius: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   primaryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   secondaryButton: {
//     backgroundColor: '#EBF4FF',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#DBEAFE',
//   },
//   secondaryButtonText: {
//     color: '#4F46E5',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   deleteButton: {
//     backgroundColor: '#FEF2F2',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#FECACA',
//   },
//   deleteButtonText: {
//     color: '#EF4444',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
// });

// export default JobManagementScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const JobManagementScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const [isActive, setIsActive] = useState(job.status === 'Active');

  const handleToggleStatus = () => {
    Alert.alert(
      `${isActive ? 'Pause' : 'Resume'} Job`,
      `Are you sure you want to ${isActive ? 'pause' : 'resume'} this job posting?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setIsActive(!isActive);
            Alert.alert('Success', `Job ${isActive ? 'paused' : 'resumed'} successfully`);
          },
        },
      ]
    );
  };

  const handleDeleteJob = () => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Job deleted successfully');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleViewApplications = () => {
    navigation.navigate('Applications', { job });
  };

  const handleEditJob = () => {
    Alert.alert('Edit Job', 'Edit functionality will be implemented');
  };

  const handleShareJob = () => {
    Alert.alert('Share Job', 'Share functionality will be implemented');
  };

  const handleBoostJob = () => {
    Alert.alert('Boost Job', 'Boost your job visibility to get more applications');
  };

  const getApplicationsColor = (count) => {
    if (count === 0) return '#EF4444';
    if (count < 5) return '#F59E0B';
    return '#10B981';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#4F46E5" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Job Management</Text>
        
        <TouchableOpacity onPress={handleShareJob} style={styles.shareButton}>
          <Ionicons name="share-outline" size={20} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Job Info Card */}
        <View style={styles.jobCard}>
          <View style={styles.jobHeader}>
            <View style={styles.jobTitleContainer}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={styles.jobSubInfo}>
                <Ionicons name="location-outline" size={14} color="#6B7280" />
                <Text style={styles.locationText}>{job.location}</Text>
                <Text style={styles.categoryText}> • {job.category}</Text>
              </View>
            </View>
            
            <View style={[
              styles.statusBadge,
              { backgroundColor: isActive ? '#10B981' : '#6B7280' }
            ]}>
              <Text style={styles.statusText}>{isActive ? 'Active' : 'Paused'}</Text>
            </View>
          </View>

          <View style={styles.jobDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="cash" size={16} color="#059669" />
              <Text style={styles.detailText}>{job.salary}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.detailText}>Posted {job.postedDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="briefcase-outline" size={16} color="#6B7280" />
              <Text style={styles.detailText}>{job.stream === 'daily' ? 'Daily Work' : 'Technical Work'}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStatsCard}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statItem, { borderLeftColor: '#4F46E5' }]}>
              <Text style={styles.statNumber}>{job.applicants}</Text>
              <Text style={styles.statLabel}>Applications</Text>
            </View>
            <View style={[styles.statItem, { borderLeftColor: '#10B981' }]}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={[styles.statItem, { borderLeftColor: '#F59E0B' }]}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>
        </View>

        {/* Job Features */}
        {(job.trainingProvided || job.experienceLevel) && (
          <View style={styles.featuresCard}>
            <Text style={styles.sectionTitle}>Job Features</Text>
            <View style={styles.featuresContainer}>
              {job.trainingProvided && (
                <View style={styles.featureTag}>
                  <Ionicons name="school" size={14} color="#047857" />
                  <Text style={styles.featureText}>Training Provided</Text>
                </View>
              )}
              <View style={styles.featureTag}>
                <Ionicons name="trending-up" size={14} color="#6366F1" />
                <Text style={styles.featureText}>{job.stream === 'daily' ? 'Daily Work' : 'Technical Skills'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {/* Applications Status */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Applications Status</Text>
            <TouchableOpacity onPress={handleViewApplications}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[
            styles.applicationsStatusCard,
            { borderLeftColor: getApplicationsColor(job.applicants) }
          ]}>
            <View style={styles.statusInfo}>
              <Text style={[
                styles.applicationCount,
                { color: getApplicationsColor(job.applicants) }
              ]}>
                {job.applicants} Applications
              </Text>
              <Text style={styles.statusDescription}>
                {job.applicants === 0 
                  ? 'No applications yet. Consider boosting your job visibility.'
                  : job.applicants < 5 
                    ? 'Few applications received. You may want to boost visibility.'
                    : 'Good response! Review applications to find the right candidates.'
                }
              </Text>
            </View>
            
            {job.applicants < 5 && (
              <TouchableOpacity onPress={handleBoostJob} style={styles.boostButton}>
                <Text style={styles.boostButtonText}>Boost</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Sample recent applicants */}
          {job.applicants > 0 && (
            <View style={styles.recentApplicants}>
              <Text style={styles.recentTitle}>Recent Applications</Text>
              <View style={styles.applicantsList}>
                <View style={styles.applicantRow}>
                  <View style={styles.applicantAvatar}>
                    <Text style={styles.applicantInitial}>R</Text>
                  </View>
                  <View style={styles.applicantInfo}>
                    <Text style={styles.applicantName}>Ravi Kumar</Text>
                    <Text style={styles.applicantTime}>Applied 2 hours ago</Text>
                  </View>
                  <TouchableOpacity style={styles.applicantAction}>
                    <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                  </TouchableOpacity>
                </View>

                <View style={styles.applicantRow}>
                  <View style={styles.applicantAvatar}>
                    <Text style={styles.applicantInitial}>S</Text>
                  </View>
                  <View style={styles.applicantInfo}>
                    <Text style={styles.applicantName}>Suresh Babu</Text>
                    <Text style={styles.applicantTime}>Applied 1 day ago</Text>
                  </View>
                  <TouchableOpacity style={styles.applicantAction}>
                    <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={handleViewApplications} style={styles.primaryButton}>
            <Ionicons name="people" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>View Applications ({job.applicants})</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity onPress={handleEditJob} style={styles.secondaryButton}>
              <Ionicons name="create-outline" size={16} color="#4F46E5" />
              <Text style={styles.secondaryButtonText}>Edit Job</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleToggleStatus} style={[
              styles.secondaryButton,
              { backgroundColor: isActive ? '#FEF3C7' : '#DBEAFE', borderColor: isActive ? '#FCD34D' : '#93C5FD' }
            ]}>
              <Ionicons 
                name={isActive ? "pause" : "play"} 
                size={16} 
                color={isActive ? '#92400E' : '#1D4ED8'} 
              />
              <Text style={[
                styles.secondaryButtonText,
                { color: isActive ? '#92400E' : '#1D4ED8' }
              ]}>
                {isActive ? 'Pause Job' : 'Resume Job'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleDeleteJob} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
            <Text style={styles.deleteButtonText}>Delete Job</Text>
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
  shareButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
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
    marginBottom: 16,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  jobSubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  jobDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
  },
  quickStatsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderLeftWidth: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  featuresCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  featureText: {
    fontSize: 12,
    color: '#047857',
    marginLeft: 6,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  applicationsStatusCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusInfo: {
    flex: 1,
  },
  applicationCount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  boostButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  boostButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  recentApplicants: {
    marginTop: 16,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  applicantsList: {
    gap: 12,
  },
  applicantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
  },
  applicantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  applicantInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  applicantTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  applicantAction: {
    padding: 8,
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#EBF4FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default JobManagementScreen;
