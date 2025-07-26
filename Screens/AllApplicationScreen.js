
// import React, { useState } from 'react';
// import {
//   ScrollView,
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   TextInput,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const AllApplicationsScreen = ({ route, navigation }) => {
//   const { jobs } = route.params;
//   const [selectedFilter, setSelectedFilter] = useState('all');
//   const [searchText, setSearchText] = useState('');

//   const handleJobPress = (job) => {
//     navigation.navigate('Applications', { job });
//   };

//   const getFilteredJobs = () => {
//     let filtered = jobs;
    
//     // Apply filter
//     switch (selectedFilter) {
//       case 'daily':
//         filtered = filtered.filter(job => job.stream === 'daily');
//         break;
//       case 'technical':
//         filtered = filtered.filter(job => job.stream === 'technical');
//         break;
//       case 'active':
//         filtered = filtered.filter(job => job.status === 'Active');
//         break;
//       case 'training':
//         filtered = filtered.filter(job => job.trainingProvided);
//         break;
//       case 'recent':
//         filtered = filtered.filter(job => job.applicants > 0);
//         break;
//       default:
//         break;
//     }

//     // Apply search
//     if (searchText.trim()) {
//       filtered = filtered.filter(job => 
//         job.title.toLowerCase().includes(searchText.toLowerCase()) ||
//         job.location.toLowerCase().includes(searchText.toLowerCase()) ||
//         job.category.toLowerCase().includes(searchText.toLowerCase())
//       );
//     }

//     return filtered;
//   };

//   const filteredJobs = getFilteredJobs();
//   const totalApplications = filteredJobs.reduce((sum, job) => sum + job.applicants, 0);
//   const trainingJobs = filteredJobs.filter(job => job.trainingProvided).length;

//   const filters = [
//     { key: 'all', label: 'All', color: '#6B7280', icon: 'apps' },
//     { key: 'recent', label: 'With Apps', color: '#10B981', icon: 'person-add' },
//     { key: 'training', label: 'Training', color: '#4F46E5', icon: 'school' },
//     { key: 'daily', label: 'Daily', color: '#F59E0B', icon: 'today' },
//     { key: 'technical', label: 'Technical', color: '#EF4444', icon: 'build' },
//     { key: 'active', label: 'Active', color: '#8B5CF6', icon: 'flash' },
//   ];

//   const getUrgencyColor = (applicants) => {
//     if (applicants === 0) return '#EF4444';
//     if (applicants < 5) return '#F59E0B';
//     return '#10B981';
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
//       {/* Enhanced Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Ionicons name="arrow-back" size={20} color="#4F46E5" />
//           </TouchableOpacity>
//         </View>
        
//         <View style={styles.headerCenter}>
//           <Text style={styles.headerTitle}>All Applications</Text>
//           <Text style={styles.headerSubtitle}>Manage job responses</Text>
//         </View>
        
//         <View style={styles.headerRight}>
//           <TouchableOpacity style={styles.moreButton}>
//             <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Enhanced Stats */}
//       <View style={styles.statsContainer}>
//         <View style={styles.statCard}>
//           <View style={[styles.statIcon, { backgroundColor: '#4F46E515' }]}>
//             <Ionicons name="briefcase" size={16} color="#4F46E5" />
//           </View>
//           <Text style={styles.statNumber}>{filteredJobs.length}</Text>
//           <Text style={styles.statLabel}>Total Jobs</Text>
//         </View>

//         <View style={styles.statCard}>
//           <View style={[styles.statIcon, { backgroundColor: '#10B98115' }]}>
//             <Ionicons name="people" size={16} color="#10B981" />
//           </View>
//           <Text style={styles.statNumber}>{totalApplications}</Text>
//           <Text style={styles.statLabel}>Applications</Text>
//         </View>

//         <View style={styles.statCard}>
//           <View style={[styles.statIcon, { backgroundColor: '#F59E0B15' }]}>
//             <Ionicons name="school" size={16} color="#F59E0B" />
//           </View>
//           <Text style={styles.statNumber}>{trainingJobs}</Text>
//           <Text style={styles.statLabel}>With Training</Text>
//         </View>

//         <View style={styles.statCard}>
//           <View style={[styles.statIcon, { backgroundColor: '#8B5CF615' }]}>
//             <Ionicons name="trending-up" size={16} color="#8B5CF6" />
//           </View>
//           <Text style={styles.statNumber}>{Math.round(totalApplications / (filteredJobs.length || 1))}</Text>
//           <Text style={styles.statLabel}>Avg per Job</Text>
//         </View>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <View style={styles.searchBar}>
//           <Ionicons name="search" size={18} color="#9CA3AF" />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search jobs..."
//             value={searchText}
//             onChangeText={setSearchText}
//             placeholderTextColor="#9CA3AF"
//           />
//           {searchText.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchText('')}>
//               <Ionicons name="close-circle" size={18} color="#9CA3AF" />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {/* Enhanced Filters */}
//       <View style={styles.filtersContainer}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContent}>
//           {filters.map((filter) => (
//             <TouchableOpacity
//               key={filter.key}
//               onPress={() => setSelectedFilter(filter.key)}
//               style={[
//                 styles.filterButton,
//                 selectedFilter === filter.key && { backgroundColor: filter.color }
//               ]}
//             >
//               <Ionicons 
//                 name={filter.icon} 
//                 size={14} 
//                 color={selectedFilter === filter.key ? '#FFFFFF' : filter.color} 
//                 style={styles.filterIcon}
//               />
//               <Text style={[
//                 styles.filterText,
//                 selectedFilter === filter.key && { color: '#FFFFFF' }
//               ]}>
//                 {filter.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Job Cards */}
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         {filteredJobs.length === 0 ? (
//           <View style={styles.emptyState}>
//             <View style={styles.emptyIconContainer}>
//               <Ionicons name="briefcase-outline" size={40} color="#D1D5DB" />
//             </View>
//             <Text style={styles.emptyTitle}>No jobs found</Text>
//             <Text style={styles.emptySubtitle}>
//               {searchText ? 'Try different search terms' : 'Try adjusting your filters or post new jobs'}
//             </Text>
//           </View>
//         ) : (
//           filteredJobs.map((job) => (
//             <TouchableOpacity
//               key={job.id}
//               onPress={() => handleJobPress(job)}
//               style={styles.jobCard}
//             >
//               <View style={styles.jobHeader}>
//                 <View style={styles.jobInfo}>
//                   <Text style={styles.jobTitle}>{job.title}</Text>
//                   <View style={styles.jobMeta}>
//                     <Ionicons name="location-outline" size={12} color="#6B7280" />
//                     <Text style={styles.jobLocation}>{job.location}</Text>
//                     <Text style={styles.jobCategory}> • {job.category}</Text>
//                   </View>
//                 </View>

//                 <View style={styles.badgeContainer}>
//                   <View style={[
//                     styles.streamBadge,
//                     { backgroundColor: job.stream === 'daily' ? '#10B981' : '#6366F1' }
//                   ]}>
//                     <Text style={[styles.streamText, { color: '#FFFFFF' }]}>
//                       {job.stream === 'daily' ? 'Daily' : 'Technical'}
//                     </Text>
//                   </View>

//                   <View style={[
//                     styles.statusBadge,
//                     { backgroundColor: job.status === 'Active' ? '#10B981' : '#6B7280' }
//                   ]}>
//                     <Text style={styles.statusText}>{job.status}</Text>
//                   </View>
//                 </View>
//               </View>

//               <Text style={styles.jobDescription}>{job.description}</Text>

//               {/* Job Features */}
//               <View style={styles.jobFeatures}>
//                 {job.trainingProvided && (
//                   <View style={styles.featureTag}>
//                     <Ionicons name="school" size={10} color="#047857" />
//                     <Text style={styles.featureText}>Training Available</Text>
//                   </View>
//                 )}
                
//                 <View style={[
//                   styles.urgencyTag,
//                   { borderColor: getUrgencyColor(job.applicants) }
//                 ]}>
//                   <Text style={[styles.urgencyText, { color: getUrgencyColor(job.applicants) }]}>
//                     {job.applicants === 0 ? 'Urgent' : job.applicants < 5 ? 'Needs Workers' : 'Popular'}
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.jobFooter}>
//                 <View style={styles.jobDetails}>
//                   <Text style={styles.salary}>{job.salary}</Text>
//                   <View style={styles.metaInfo}>
//                     <View style={styles.metaItem}>
//                       <Ionicons name="people" size={12} color="#6B7280" />
//                       <Text style={styles.metaText}>{job.applicants} applicants</Text>
//                     </View>
//                     <View style={styles.metaItem}>
//                       <Ionicons name="time-outline" size={12} color="#6B7280" />
//                       <Text style={styles.metaText}>{job.postedDate}</Text>
//                     </View>
//                   </View>
//                 </View>

//                 <View style={styles.actionContainer}>
//                   <View style={[
//                     styles.applicantsBadge,
//                     { backgroundColor: getUrgencyColor(job.applicants) + '15' }
//                   ]}>
//                     <Text style={[
//                       styles.applicantsBadgeText,
//                       { color: getUrgencyColor(job.applicants) }
//                     ]}>
//                       {job.applicants > 0 ? `${job.applicants} apps` : 'No apps'}
//                     </Text>
//                   </View>
//                   <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))
//         )}
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
//   headerLeft: {
//     flex: 1,
//   },
//   headerCenter: {
//     flex: 2,
//     alignItems: 'center',
//   },
//   headerRight: {
//     flex: 1,
//     alignItems: 'flex-end',
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: '#F3F4F6',
//   },
//   moreButton: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: '#F3F4F6',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1F2937',
//     textAlign: 'center',
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: '#6B7280',
//     textAlign: 'center',
//     marginTop: 2,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 8,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     padding: 12,
//     borderRadius: 16,
//     marginHorizontal: 2,
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     borderWidth: 1,
//     borderColor: '#F3F4F6',
//   },
//   statIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 6,
//   },
//   statNumber: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1F2937',
//   },
//   statLabel: {
//     fontSize: 10,
//     color: '#6B7280',
//     marginTop: 2,
//     textAlign: 'center',
//   },
//   searchContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#1F2937',
//   },
//   filtersContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 16,
//   },
//   filtersContent: {
//     paddingVertical: 4,
//   },
//   filterButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//   },
//   filterIcon: {
//     marginRight: 6,
//   },
//   filterText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#6B7280',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//     marginTop: 60,
//   },
//   emptyIconContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#F3F4F6',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#6B7280',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   jobCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 18,
//     padding: 18,
//     marginHorizontal: 20,
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     borderWidth: 1,
//     borderColor: '#F3F4F6',
//   },
//   jobHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   jobInfo: {
//     flex: 1,
//   },
//   jobTitle: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   jobMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   jobLocation: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginLeft: 4,
//   },
//   jobCategory: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   badgeContainer: {
//     alignItems: 'flex-end',
//     gap: 6,
//   },
//   streamBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   streamText: {
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   statusText: {
//     fontSize: 11,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   jobDescription: {
//     fontSize: 14,
//     color: '#6B7280',
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   jobFeatures: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 12,
//     gap: 6,
//   },
//   featureTag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F0FDF4',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#BBF7D0',
//   },
//   featureText: {
//     fontSize: 11,
//     color: '#047857',
//     marginLeft: 4,
//     fontWeight: '600',
//   },
//   urgencyTag: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     borderWidth: 1,
//     backgroundColor: '#FEFEFE',
//   },
//   urgencyText: {
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   jobFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   jobDetails: {
//     flex: 1,
//   },
//   salary: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#059669',
//     marginBottom: 4,
//   },
//   metaInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   metaText: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginLeft: 4,
//   },
//   actionContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   applicantsBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   applicantsBadgeText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
// });

// export default AllApplicationsScreen;
// import React, { useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   FlatList,
//   TextInput,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const AllApplicationsScreen = ({ route, navigation }) => {
//   const { jobs } = route.params;
//   const [selectedFilter, setSelectedFilter] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');

//   // Generate sample applications based on jobs
//   const generateApplications = () => {
//     const applications = [];
//     jobs.forEach(job => {
//       // Generate random applications for each job
//       const applicantCount = job.applicants || 0;
//       for (let i = 0; i < applicantCount; i++) {
//         applications.push({
//           id: `${job.id}-${i}`,
//           jobId: job.id,
//           jobTitle: job.title,
//           jobCategory: job.category,
//           jobExperience: job.experienceLevel,
//           applicantName: `Applicant ${i + 1}`,
//           experience: Math.floor(Math.random() * 5) + 1,
//           rating: (Math.random() * 2 + 3).toFixed(1),
//           status: ['pending', 'shortlisted', 'rejected'][Math.floor(Math.random() * 3)],
//           appliedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
//           location: job.location,
//           phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
//         });
//       }
//     });
//     return applications;
//   };

//   const allApplications = useMemo(() => generateApplications(), [jobs]);

//   const filters = [
//     { key: 'all', label: 'All', icon: 'list' },
//     { key: 'helper', label: 'Helper Jobs', icon: 'hammer' },
//     { key: 'worker', label: 'Worker Jobs', icon: 'build' },
//     { key: 'pending', label: 'Pending', icon: 'time' },
//     { key: 'shortlisted', label: 'Shortlisted', icon: 'checkmark-circle' },
//   ];

//   const getFilteredApplications = () => {
//     let filtered = allApplications;

//     // Apply filter
//     switch (selectedFilter) {
//       case 'helper':
//         filtered = allApplications.filter(app => app.jobExperience === 'helper');
//         break;
//       case 'worker':
//         filtered = allApplications.filter(app => app.jobExperience === 'worker');
//         break;
//       case 'pending':
//         filtered = allApplications.filter(app => app.status === 'pending');
//         break;
//       case 'shortlisted':
//         filtered = allApplications.filter(app => app.status === 'shortlisted');
//         break;
//       default:
//         filtered = allApplications;
//     }

//     // Apply search
//     if (searchQuery) {
//       filtered = filtered.filter(app =>
//         app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     return filtered;
//   };

//   const filteredApplications = useMemo(() => getFilteredApplications(), [allApplications, selectedFilter, searchQuery]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return '#F59E0B';
//       case 'shortlisted': return '#10B981';
//       case 'rejected': return '#EF4444';
//       default: return '#6B7280';
//     }
//   };

//   const getExperienceBadgeColor = (level) => {
//     return level === 'helper' ? '#10B981' : '#3B82F6';
//   };

//   const renderApplicationCard = ({ item }) => (
//     <TouchableOpacity
//       style={styles.applicationCard}
//       onPress={() => navigation.navigate('Applications', { 
//         job: jobs.find(j => j.id === item.jobId) 
//       })}
//     >
//       <View style={styles.cardHeader}>
//         <View style={styles.applicantInfo}>
//           <Text style={styles.applicantName}>{item.applicantName}</Text>
//           <View style={styles.badgeContainer}>
//             <View style={[styles.experienceBadge, { backgroundColor: getExperienceBadgeColor(item.jobExperience) }]}>
//               <Text style={styles.badgeText}>
//                 {item.jobExperience === 'helper' ? 'Helper' : 'Worker'}
//               </Text>
//             </View>
//             <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
//               <Text style={styles.badgeText}>{item.status}</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.ratingContainer}>
//           <Ionicons name="star" size={16} color="#FFD700" />
//           <Text style={styles.rating}>{item.rating}</Text>
//         </View>
//       </View>

//       <Text style={styles.jobTitle}>{item.jobTitle}</Text>

//       <View style={styles.cardDetails}>
//         <View style={styles.detailRow}>
//           <Ionicons name="briefcase" size={14} color="#6B7280" />
//           <Text style={styles.detailText}>{item.experience} years experience</Text>
//         </View>
        
//         <View style={styles.detailRow}>
//           <Ionicons name="location" size={14} color="#6B7280" />
//           <Text style={styles.detailText}>{item.location}</Text>
//         </View>

//         <View style={styles.detailRow}>
//           <Ionicons name="calendar" size={14} color="#6B7280" />
//           <Text style={styles.detailText}>
//             Applied {new Date(item.appliedDate).toLocaleDateString()}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.cardActions}>
//         <TouchableOpacity style={styles.actionButton}>
//           <Ionicons name="call" size={16} color="#4F46E5" />
//           <Text style={styles.actionText}>Call</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity style={styles.actionButton}>
//           <Ionicons name="chatbubble" size={16} color="#4F46E5" />
//           <Text style={styles.actionText}>Message</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
//           <Ionicons name="person" size={16} color="#FFFFFF" />
//           <Text style={[styles.actionText, { color: '#FFFFFF' }]}>View Profile</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   // Calculate statistics
//   const stats = {
//     total: allApplications.length,
//     helpers: allApplications.filter(app => app.jobExperience === 'helper').length,
//     workers: allApplications.filter(app => app.jobExperience === 'worker').length,
//     pending: allApplications.filter(app => app.status === 'pending').length,
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header Stats */}
//       <View style={styles.statsHeader}>
//         <View style={styles.statItem}>
//           <Text style={styles.statNumber}>{stats.total}</Text>
//           <Text style={styles.statLabel}>Total Applications</Text>
//         </View>
//         <View style={styles.statItem}>
//           <Text style={[styles.statNumber, { color: '#10B981' }]}>{stats.helpers}</Text>
//           <Text style={styles.statLabel}>Helper Applications</Text>
//         </View>
//         <View style={styles.statItem}>
//           <Text style={[styles.statNumber, { color: '#3B82F6' }]}>{stats.workers}</Text>
//           <Text style={styles.statLabel}>Worker Applications</Text>
//         </View>
//         <View style={styles.statItem}>
//           <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{stats.pending}</Text>
//           <Text style={styles.statLabel}>Pending</Text>
//         </View>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={20} color="#6B7280" />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search applications..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       {/* Filter Buttons */}
//       <FlatList
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         data={filters}
//         keyExtractor={item => item.key}
//         contentContainerStyle={styles.filterContainer}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={[
//               styles.filterButton,
//               selectedFilter === item.key && styles.activeFilter
//             ]}
//             onPress={() => setSelectedFilter(item.key)}
//           >
//             <Ionicons
//               name={item.icon}
//               size={16}
//               color={selectedFilter === item.key ? '#FFFFFF' : '#6B7280'}
//             />
//             <Text style={[
//               styles.filterText,
//               selectedFilter === item.key && styles.activeFilterText
//             ]}>
//               {item.label}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />

//       {/* Applications List */}
//       <FlatList
//         data={filteredApplications}
//         keyExtractor={item => item.id}
//         renderItem={renderApplicationCard}
//         contentContainerStyle={styles.applicationsList}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
//             <Text style={styles.emptyText}>No applications found</Text>
//             <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   statsHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     marginBottom: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   statItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 16,
//     marginBottom: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 12,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#1F2937',
//   },
//   filterContainer: {
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//   },
//   filterButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 8,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//   },
//   activeFilter: {
//     backgroundColor: '#4F46E5',
//   },
//   filterText: {
//     marginLeft: 6,
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   activeFilterText: {
//     color: '#FFFFFF',
//   },
//   applicationsList: {
//     paddingHorizontal: 16,
//   },
//   applicationCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   applicantInfo: {
//     flex: 1,
//   },
//   applicantName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   badgeContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   experienceBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   badgeText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//     textTransform: 'capitalize',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rating: {
//     marginLeft: 4,
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   jobTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#4F46E5',
//     marginBottom: 12,
//   },
//   cardDetails: {
//     marginBottom: 16,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   detailText: {
//     marginLeft: 8,
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   cardActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#F3F4F6',
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     backgroundColor: '#F8FAFC',
//   },
//   primaryAction: {
//     backgroundColor: '#4F46E5',
//   },
//   actionText: {
//     marginLeft: 4,
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#4F46E5',
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 64,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#6B7280',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#9CA3AF',
//   },
// });

// export default AllApplicationsScreen;
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
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
    <TouchableOpacity
      style={styles.applicationCard}
      onPress={() => navigation.navigate('Applications', { 
        job: jobs.find(j => j.id === item.jobId) 
      })}
    >
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
    </TouchableOpacity>
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
        />
      </View>

      {/* Filter Buttons */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={filters}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.filterContainer}
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
              size={16}
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
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
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
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  filterContainer: {
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
    marginRight: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activeFilter: {
    backgroundColor: '#4F46E5',
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  applicationsList: {
    paddingHorizontal: 16,
  },
  applicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 8,
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
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  primaryAction: {
    backgroundColor: '#4F46E5',
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
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
});

export default AllApplicationsScreen;
