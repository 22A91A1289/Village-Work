
// import React, { useState } from 'react';
// import {
//   ScrollView,
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const ActiveJobsScreen = ({ route, navigation }) => {
//   const { jobs } = route.params;
//   const [selectedFilter, setSelectedFilter] = useState('all');

//   const handleJobPress = (job) => {
//     navigation.navigate('JobManagement', { job });
//   };

//   const handleViewApplications = (job) => {
//     navigation.navigate('Applications', { job });
//   };

//   const getFilteredJobs = () => {
//     switch (selectedFilter) {
//       case 'daily':
//         return jobs.filter(job => job.stream === 'daily');
//       case 'technical':
//         return jobs.filter(job => job.stream === 'technical');
//       case 'training':
//         return jobs.filter(job => job.trainingProvided);
//       case 'urgent':
//         return jobs.filter(job => job.applicants < 3);
//       default:
//         return jobs;
//   };

//   const filteredJobs = getFilteredJobs();

//   const filters = [
//     { key: 'all', label: 'All Jobs', icon: 'apps' },
//     { key: 'beginner', label: 'Beginner Jobs', icon: 'person-add' },
//     { key: 'training', label: 'With Training', icon: 'school' },
//     { key: 'daily', label: 'Daily Work', icon: 'today' },
//     { key: 'technical', label: 'Technical', icon: 'build' },
//     { key: 'urgent', label: 'Need Workers', icon: 'warning' },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#374151" />
//         </TouchableOpacity>
//         <View style={styles.headerCenter}>
//           <Text style={styles.headerTitle}>Active Jobs</Text>
//           <Text style={styles.headerSubtitle}>Beginner-friendly opportunities</Text>
//         </View>
//         <TouchableOpacity style={styles.addButton}>
//           <Ionicons name="add" size={24} color="#374151" />
//         </TouchableOpacity>
//       </View>

//       {/* Stats Cards */}
//       <View style={styles.statsContainer}>
//         <View style={styles.statCard}>
//           <View style={styles.statIconContainer}>
//             <Ionicons name="briefcase" size={18} color="#10B981" />
//           </View>
//           <Text style={styles.statNumber}>{filteredJobs.length}</Text>
//           <Text style={styles.statLabel}>Active Jobs</Text>
//         </View>
        
//         <View style={styles.statCard}>
//           <View style={styles.statIconContainer}>
//             <Ionicons name="people" size={18} color="#4F46E5" />
//           </View>
//           <Text style={styles.statNumber}>{filteredJobs.reduce((sum, job) => sum + job.applicants, 0)}</Text>
//           <Text style={styles.statLabel}>New Workers</Text>
//         </View>
        
//         <View style={styles.statCard}>
//           <View style={styles.statIconContainer}>
//             <Ionicons name="school" size={18} color="#F59E0B" />
//           </View>
//           <Text style={styles.statNumber}>{filteredJobs.filter(job => job.trainingProvided).length}</Text>
//           <Text style={styles.statLabel}>With Training</Text>
//         </View>
        
//         <View style={styles.statCard}>
//           <View style={styles.statIconContainer}>
//             <Ionicons name="person-add" size={18} color="#EF4444" />
//           </View>
//           <Text style={styles.statNumber}>{filteredJobs.filter(job => job.experienceLevel === 'beginner').length}</Text>
//           <Text style={styles.statLabel}>Beginner Jobs</Text>
//         </View>
//       </View>

//       {/* Beginner-Friendly Notice */}
//       <View style={styles.noticeCard}>
//         <Ionicons name="lightbulb" size={20} color="#F59E0B" />
//         <Text style={styles.noticeText}>
//           Most applicants are eager beginners. Consider their willingness to learn and provide training opportunities!
//         </Text>
//       </View>

//       {/* Filters */}
//       <View style={styles.filtersContainer}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {filters.map((filter) => (
//             <TouchableOpacity
//               key={filter.key}
//               onPress={() => setSelectedFilter(filter.key)}
//               style={[
//                 styles.filterButton,
//                 selectedFilter === filter.key && styles.activeFilter
//               ]}
//             >
//               <Ionicons 
//                 name={filter.icon} 
//                 size={16} 
//                 color={selectedFilter === filter.key ? '#FFFFFF' : '#6B7280'}
//                 style={styles.filterIcon}
//               />
//               <Text style={[
//                 styles.filterText,
//                 selectedFilter === filter.key && styles.activeFilterText
//               ]}>
//                 {filter.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Job List */}
//       <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
//         {filteredJobs.map((job) => (
//           <TouchableOpacity
//             key={job.id}
//             onPress={() => handleJobPress(job)}
//             style={styles.jobCard}
//           >
//             <View style={styles.jobHeader}>
//               <View style={styles.jobInfo}>
//                 <Text style={styles.jobTitle}>{job.title}</Text>
//                 <View style={styles.jobMeta}>
//                   <Ionicons name="location" size={14} color="#6B7280" />
//                   <Text style={styles.jobLocation}>{job.location}</Text>
//                   <Text style={styles.jobCategory}> • {job.category}</Text>
//                 </View>
//               </View>
//               <View style={styles.badgeContainer}>
//                 <View style={[styles.streamBadge, { 
//                   backgroundColor: job.stream === 'daily' ? '#DEF7EC' : '#EBF8FF' 
//                 }]}>
//                   <Text style={[styles.streamText, { 
//                     color: job.stream === 'daily' ? '#047857' : '#1E40AF' 
//                   }]}>
//                     {job.stream === 'daily' ? 'Daily' : 'Technical'}
//                   </Text>
//                 </View>
//               </View>
//             </View>
            
//             <Text style={styles.jobDescription}>{job.description}</Text>
            
//             {/* Beginner-Friendly Features */}
//             <View style={styles.jobFeatures}>
//               {job.experienceLevel === 'beginner' && (
//                 <View style={styles.featureTag}>
//                   <Ionicons name="person-add" size={12} color="#10B981" />
//                   <Text style={styles.featureText}>Beginner Friendly</Text>
//                 </View>
//               )}
//               {job.trainingProvided && (
//                 <View style={styles.featureTag}>
//                   <Ionicons name="school" size={12} color="#4F46E5" />
//                   <Text style={styles.featureText}>Training Provided</Text>
//                 </View>
//               )}
//               <View style={styles.featureTag}>
//                 <Ionicons name="heart" size={12} color="#EF4444" />
//                 <Text style={styles.featureText}>New Workers Welcome</Text>
//               </View>
//             </View>
            
//             <View style={styles.jobStats}>
//               <View style={styles.statItem}>
//                 <Ionicons name="cash" size={16} color="#059669" />
//                 <Text style={styles.salary}>{job.salary}</Text>
//               </View>
//               <View style={styles.statItem}>
//                 <Ionicons name="people" size={16} color="#6B7280" />
//                 <Text style={styles.applicantsText}>{job.applicants} new workers applied</Text>
//               </View>
//               <View style={styles.statItem}>
//                 <Ionicons name="time" size={16} color="#6B7280" />
//                 <Text style={styles.postedTime}>{job.postedDate}</Text>
//               </View>
//             </View>
            
//             <View style={styles.jobActions}>
//               <TouchableOpacity
//                 onPress={(e) => {
//                   e.stopPropagation();
//                   handleViewApplications(job);
//                 }}
//                 style={styles.viewApplicationsButton}
//               >
//                 <Ionicons name="eye" size={16} color="#4F46E5" />
//                 <Text style={styles.viewApplicationsText}>View New Workers</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity style={styles.moreButton}>
//                 <Ionicons name="ellipsis-horizontal" size={16} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         ))}
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
//   addButton: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: '#F3F4F6',
//   },
//   headerCenter: {
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1F2937',
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: '#10B981',
//     marginTop: 2,
//     fontWeight: '600',
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
//     padding: 10,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginHorizontal: 2,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     borderWidth: 1,
//     borderColor: '#F3F4F6',
//   },
//   statIconContainer: {
//     width: 26,
//     height: 26,
//     borderRadius: 6,
//     backgroundColor: '#F3F4F6',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 4,
//   },
//   statNumber: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#1F2937',
//   },
//   statLabel: {
//     fontSize: 9,
//     color: '#6B7280',
//     marginTop: 2,
//     textAlign: 'center',
//   },
//   noticeCard: {
//     backgroundColor: '#FFFBEB',
//     marginHorizontal: 20,
//     padding: 16,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#FED7AA',
//   },
//   noticeText: {
//     flex: 1,
//     fontSize: 14,
//     color: '#92400E',
//     marginLeft: 12,
//     fontWeight: '500',
//   },
//   filtersContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 16,
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
//   activeFilter: {
//     backgroundColor: '#4F46E5',
//     borderColor: '#4F46E5',
//   },
//   filterIcon: {
//     marginRight: 6,
//   },
//   filterText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#6B7280',
//   },
//   activeFilterText: {
//     color: '#FFFFFF',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   jobCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 18,
//     marginHorizontal: 20,
//     marginBottom: 16,
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
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   jobInfo: {
//     flex: 1,
//   },
//   jobTitle: {
//     fontSize: 16,
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
//   },
//   featureTag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F0FDF4',
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//     borderRadius: 6,
//     marginRight: 6,
//     marginBottom: 4,
//     borderWidth: 1,
//     borderColor: '#BBF7D0',
//   },
//   featureText: {
//     fontSize: 10,
//     color: '#047857',
//     marginLeft: 3,
//     fontWeight: '600',
//   },
//   jobStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   salary: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#059669',
//     marginLeft: 4,
//   },
//   applicantsText: {
//     fontSize: 11,
//     color: '#6B7280',
//     marginLeft: 4,
//   },
//   postedTime: {
//     fontSize: 11,
//     color: '#6B7280',
//     marginLeft: 4,
//   },
//   jobActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   viewApplicationsButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#EBF4FF',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     flex: 1,
//     marginRight: 8,
//   },
//   viewApplicationsText: {
//     color: '#4F46E5',
//     fontSize: 13,
//     fontWeight: '600',
//     marginLeft: 6,
//   },
//   moreButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: '#F3F4F6',
//   },
// });

// export default ActiveJobsScreen;
// import React, { useState } from 'react';
// import {
//   ScrollView,
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const ActiveJobsScreen = ({ route, navigation }) => {
//   const { jobs } = route.params;
//   const [selectedFilter, setSelectedFilter] = useState('all');

//   const handleJobPress = (job) => {
//     navigation.navigate('JobManagement', { job });
//   };

//   const handleViewApplications = (job) => {
//     navigation.navigate('Applications', { job });
//   };

//   const getFilteredJobs = () => {
//     switch (selectedFilter) {
//       case 'daily':
//         return jobs.filter(job => job.stream === 'daily');
//       case 'technical':
//         return jobs.filter(job => job.stream === 'technical');
//       case 'training':
//         return jobs.filter(job => job.trainingProvided);
//       case 'urgent':
//         return jobs.filter(job => job.applicants < 3);
//       case 'popular':
//         return jobs.filter(job => job.applicants >= 10);
//       default:
//         return jobs;
//     }
//   };

//   const filteredJobs = getFilteredJobs();

//   const filters = [
//     { key: 'all', label: 'All Jobs', icon: 'apps', color: '#6B7280' },
//     { key: 'urgent', label: 'Need Workers', icon: 'warning', color: '#EF4444' },
//     { key: 'popular', label: 'Popular', icon: 'trending-up', color: '#10B981' },
//     { key: 'training', label: 'With Training', icon: 'school', color: '#4F46E5' },
//     { key: 'daily', label: 'Daily Work', icon: 'today', color: '#F59E0B' },
//     { key: 'technical', label: 'Technical', icon: 'build', color: '#8B5CF6' },
//   ];

//   const getApplicationsColor = (count) => {
//     if (count === 0) return '#EF4444';
//     if (count < 5) return '#F59E0B';
//     return '#10B981';
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={20} color="#4F46E5" />
//         </TouchableOpacity>
        
//         <View style={styles.headerCenter}>
//           <Text style={styles.headerTitle}>Active Jobs</Text>
//           <Text style={styles.headerSubtitle}>Manage your job postings</Text>
//         </View>
        
//         <TouchableOpacity style={styles.addButton}>
//           <Ionicons name="add" size={20} color="#4F46E5" />
//         </TouchableOpacity>
//       </View>

//       {/* Stats Cards */}
//       <View style={styles.statsContainer}>
//         <View style={styles.statCard}>
//           <View style={[styles.statIcon, { backgroundColor: '#4F46E515' }]}>
//             <Ionicons name="briefcase" size={14} color="#4F46E5" />
//           </View>
//           <Text style={styles.statNumber}>{filteredJobs.length}</Text>
//           <Text style={styles.statLabel}>Active Jobs</Text>
//         </View>

//         <View style={styles.statCard}>
//           <View style={[styles.statIcon, { backgroundColor: '#10B98115' }]}>
//             <Ionicons name="people" size={14} color="#10B981" />
//           </View>
//           <Text style={styles.statNumber}>{filteredJobs.reduce((sum, job) => sum + job.applicants, 0)}</Text>
//           <Text style={styles.statLabel}>Applications</Text>
//         </View>

//         <View style={styles.statCard}>
//           <View style={[styles.statIcon, { backgroundColor: '#F59E0B15' }]}>
//             <Ionicons name="school" size={14} color="#F59E0B" />
//           </View>
//           <Text style={styles.statNumber}>{filteredJobs.filter(job => job.trainingProvided).length}</Text>
//           <Text style={styles.statLabel}>With Training</Text>
//         </View>

//         <View style={styles.statCard}>
//           <View style={[styles.statIcon, { backgroundColor: '#EF444415' }]}>
//             <Ionicons name="warning" size={14} color="#EF4444" />
//           </View>
//           <Text style={styles.statNumber}>{filteredJobs.filter(job => job.applicants < 3).length}</Text>
//           <Text style={styles.statLabel}>Need Workers</Text>
//         </View>
//       </View>

//       {/* Filters */}
//       <View style={styles.filtersContainer}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

//       {/* Job List */}
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         {filteredJobs.map((job) => (
//           <TouchableOpacity
//             key={job.id}
//             onPress={() => handleJobPress(job)}
//             style={styles.jobCard}
//           >
//             <View style={styles.jobHeader}>
//               <View style={styles.jobInfo}>
//                 <Text style={styles.jobTitle}>{job.title}</Text>
//                 <View style={styles.jobMeta}>
//                   <Ionicons name="location-outline" size={12} color="#6B7280" />
//                   <Text style={styles.jobLocation}>{job.location}</Text>
//                   <Text style={styles.jobCategory}> • {job.category}</Text>
//                 </View>
//               </View>

//               <View style={styles.badgeContainer}>
//                 <View style={[
//                   styles.streamBadge,
//                   { backgroundColor: job.stream === 'daily' ? '#10B981' : '#6366F1' }
//                 ]}>
//                   <Text style={[styles.streamText, { color: '#FFFFFF' }]}>
//                     {job.stream === 'daily' ? 'Daily' : 'Technical'}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             <Text style={styles.jobDescription}>{job.description}</Text>

//             {/* Job Features */}
//             <View style={styles.jobFeatures}>
//               {job.trainingProvided && (
//                 <View style={styles.featureTag}>
//                   <Ionicons name="school" size={10} color="#047857" />
//                   <Text style={styles.featureText}>Training Available</Text>
//                 </View>
//               )}
              
//               <View style={[
//                 styles.priorityTag,
//                 { 
//                   backgroundColor: job.applicants < 3 ? '#FEF2F2' : '#F0FDF4',
//                   borderColor: job.applicants < 3 ? '#FECACA' : '#BBF7D0'
//                 }
//               ]}>
//                 <Text style={[
//                   styles.priorityText,
//                   { color: job.applicants < 3 ? '#DC2626' : '#047857' }
//                 ]}>
//                   {job.applicants < 3 ? 'Needs Workers' : 'Getting Applications'}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.jobStats}>
//               <View style={styles.statItem}>
//                 <Ionicons name="cash" size={16} color="#059669" />
//                 <Text style={styles.salary}>{job.salary}</Text>
//               </View>
//               <View style={styles.statItem}>
//                 <Ionicons 
//                   name="people" 
//                   size={16} 
//                   color={getApplicationsColor(job.applicants)} 
//                 />
//                 <Text style={[
//                   styles.applicantsText,
//                   { color: getApplicationsColor(job.applicants) }
//                 ]}>
//                   {job.applicants} applications
//                 </Text>
//               </View>
//               <View style={styles.statItem}>
//                 <Ionicons name="time-outline" size={16} color="#6B7280" />
//                 <Text style={styles.postedTime}>{job.postedDate}</Text>
//               </View>
//             </View>

//             <View style={styles.jobActions}>
//               <TouchableOpacity
//                 onPress={(e) => {
//                   e.stopPropagation();
//                   handleViewApplications(job);
//                 }}
//                 style={styles.viewApplicationsButton}
//               >
//                 <Ionicons name="people" size={16} color="#4F46E5" />
//                 <Text style={styles.viewApplicationsText}>
//                   View Applications ({job.applicants})
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.moreButton}>
//                 <Ionicons name="ellipsis-horizontal" size={16} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         ))}
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
//   addButton: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: '#F3F4F6',
//   },
//   headerCenter: {
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1F2937',
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: '#6B7280',
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
//     padding: 10,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginHorizontal: 2,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     borderWidth: 1,
//     borderColor: '#F3F4F6',
//   },
//   statIcon: {
//     width: 24,
//     height: 24,
//     borderRadius: 6,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 4,
//   },
//   statNumber: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#1F2937',
//   },
//   statLabel: {
//     fontSize: 9,
//     color: '#6B7280',
//     marginTop: 2,
//     textAlign: 'center',
//   },
//   filtersContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 16,
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
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#6B7280',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   jobCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 18,
//     marginHorizontal: 20,
//     marginBottom: 16,
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
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   jobInfo: {
//     flex: 1,
//   },
//   jobTitle: {
//     fontSize: 16,
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
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#BBF7D0',
//   },
//   featureText: {
//     fontSize: 10,
//     color: '#047857',
//     marginLeft: 3,
//     fontWeight: '600',
//   },
//   priorityTag: {
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//     borderRadius: 6,
//     borderWidth: 1,
//   },
//   priorityText: {
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   jobStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   salary: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#059669',
//     marginLeft: 4,
//   },
//   applicantsText: {
//     fontSize: 11,
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   postedTime: {
//     fontSize: 11,
//     color: '#6B7280',
//     marginLeft: 4,
//   },
//   jobActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   viewApplicationsButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#EBF4FF',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     flex: 1,
//     marginRight: 8,
//   },
//   viewApplicationsText: {
//     color: '#4F46E5',
//     fontSize: 13,
//     fontWeight: '600',
//     marginLeft: 6,
//   },
//   moreButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: '#F3F4F6',
//   },
// });

// export default ActiveJobsScreen;
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ActiveJobsScreen = ({ route, navigation }) => {
  const { jobs } = route.params;
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { key: 'all', label: 'All Jobs', icon: 'list' },
    { key: 'helper', label: 'Helper Jobs', icon: 'hammer' },
    { key: 'worker', label: 'Worker Jobs', icon: 'build' },
    { key: 'technical', label: 'Technical', icon: 'settings' },
    { key: 'daily', label: 'Daily Work', icon: 'calendar' },
    { key: 'urgent', label: 'Urgent', icon: 'alert-circle' },
  ];

  const getFilteredJobs = () => {
    let filtered = jobs;

    // Apply filter
    switch (selectedFilter) {
      case 'helper':
        filtered = jobs.filter(j => j.experienceLevel === 'helper');
        break;
      case 'worker':
        filtered = jobs.filter(j => j.experienceLevel === 'worker');
        break;
      case 'technical':
        filtered = jobs.filter(j => j.category === 'technical');
        break;
      case 'daily':
        filtered = jobs.filter(j => j.category === 'daily');
        break;
      case 'urgent':
        filtered = jobs.filter(j => j.applicants < 3);
        break;
      default:
        filtered = jobs;
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredJobs = useMemo(() => getFilteredJobs(), [jobs, selectedFilter, searchQuery]);

  const getExperienceBadgeColor = (level) => {
    return level === 'helper' ? '#10B981' : '#3B82F6';
  };

  const getUrgencyColor = (applicants) => {
    if (applicants < 3) return '#EF4444';
    if (applicants < 6) return '#F59E0B';
    return '#10B981';
  };

  const renderJobCard = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
                      onPress={() => navigation.navigate('JobManagementScreen', { job: item })}
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.experienceBadge, { backgroundColor: getExperienceBadgeColor(item.experienceLevel) }]}>
              <Text style={styles.badgeText}>
                {item.experienceLevel === 'helper' ? 'Helper' : 'Worker'}
              </Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="cash" size={16} color="#6B7280" />
          <Text style={styles.detailText}>₹{item.salary}/day</Text>
        </View>

        {item.trainingProvided && (
          <View style={styles.detailRow}>
            <Ionicons name="school" size={16} color="#10B981" />
            <Text style={[styles.detailText, { color: '#10B981' }]}>Training Provided</Text>
          </View>
        )}
      </View>

      <View style={styles.jobFooter}>
        <View style={styles.applicantsContainer}>
          <View style={[styles.applicantsIndicator, { backgroundColor: getUrgencyColor(item.applicants) }]} />
          <Text style={styles.applicantsText}>{item.applicants} applicants</Text>
        </View>
        
        <TouchableOpacity
          style={styles.viewApplicationsButton}
                          onPress={() => navigation.navigate('ApplicationsScreen', { job: item })}
        >
          <Text style={styles.viewApplicationsText}>View Applications</Text>
          <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Calculate statistics
  const stats = {
    total: jobs.length,
    helpers: jobs.filter(j => j.experienceLevel === 'helper').length,
    workers: jobs.filter(j => j.experienceLevel === 'worker').length,
    urgent: jobs.filter(j => j.applicants < 3).length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Jobs</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.statsHeader}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Jobs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{stats.helpers}</Text>
            <Text style={styles.statLabel}>Helper Jobs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#3B82F6' }]}>{stats.workers}</Text>
            <Text style={styles.statLabel}>Worker Jobs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#EF4444' }]}>{stats.urgent}</Text>
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
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

        {/* Jobs List */}
        <View style={styles.jobsSection}>
          {filteredJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="briefcase-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>No jobs found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          ) : (
            filteredJobs.map((item) => (
              <View key={item.id} style={styles.jobCardWrapper}>
                {renderJobCard({ item })}
              </View>
            ))
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
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
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
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
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12, // Increased padding
    marginBottom: 12, // Increased margin
  },
  filterContainer: {
    paddingVertical: 6, // Increased padding
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18, // Increased padding
    paddingVertical: 12, // Increased padding
    borderRadius: 20,
    marginRight: 12, // Increased margin
    elevation: 2, // Increased elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 44, // Added minimum height
  },
  activeFilter: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
    elevation: 3, // Higher elevation for active state
  },
  filterText: {
    marginLeft: 8, // Increased margin
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600', // Made text bolder
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '700', // Made active text bolder
  },
  jobsSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  jobCardWrapper: {
    marginBottom: 12,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
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
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  moreButton: {
    padding: 4,
  },
  jobDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  applicantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicantsIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  applicantsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  viewApplicationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewApplicationsText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
    marginRight: 4,
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

export default ActiveJobsScreen;
