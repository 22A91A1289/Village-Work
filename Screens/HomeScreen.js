
// import React, { useState, useEffect } from 'react';
// import {
//   ScrollView,
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   TextInput,
//   StatusBar,
//   Alert,
//   StyleSheet,
// } from 'react-native';
// import * as Location from 'expo-location';
// import { Ionicons } from '@expo/vector-icons';

// const dailyWorkCategories = [
//   { name: 'Farming', icon: 'leaf', color: '#10B981', beginnerFriendly: true },
//   { name: 'Construction', icon: 'hammer', color: '#F59E0B', beginnerFriendly: true },
//   { name: 'Sweeper', icon: 'brush', color: '#6366F1', beginnerFriendly: true },
//   { name: 'Maid', icon: 'people', color: '#EC4899', beginnerFriendly: true },
// ];

// const technicalWorkCategories = [
//   { name: 'Electrician Helper', icon: 'flash', color: '#EF4444', beginnerFriendly: true },
//   { name: 'Plumber Helper', icon: 'water', color: '#3B82F6', beginnerFriendly: true },
//   { name: 'Carpenter Assistant', icon: 'construct', color: '#8B5CF6', beginnerFriendly: true },
//   { name: 'Mechanic Trainee', icon: 'car-sport', color: '#06B6D4', beginnerFriendly: true },
// ];

// const nearbyJobs = [
//   {
//     id: 1,
//     title: 'Farm Labor - No Experience Required',
//     location: 'Rajam, Srikakulam',
//     salary: '₹450/day',
//     type: 'Daily Work',
//     timeAgo: '2 hours ago',
//     urgency: 'urgent',
//     description: 'Perfect for beginners - we will teach you everything about farming!',
//     requirements: ['Willingness to learn', 'Physically fit', 'Available full day'],
//     benefits: ['On-job training', 'Daily payment', 'Lunch provided'],
//     postedBy: 'Ramesh Naidu',
//     contact: '9876543210',
//     isApplied: false,
//     trainingProvided: true,
//     experienceLevel: 'beginner',
//   },
//   {
//     id: 2,
//     title: 'Electrician Helper - Learn While Working',
//     location: 'Kothavalasa',
//     salary: '₹600/day',
//     type: 'Technical Work',
//     timeAgo: '1 day ago',
//     urgency: 'normal',
//     description: 'Great opportunity to learn electrical work from experienced professionals.',
//     requirements: ['Basic interest in electrical work', 'Safety conscious', 'Eager to learn'],
//     benefits: ['Professional training', 'Safety equipment provided', 'Career growth'],
//     postedBy: 'Anil Kumar',
//     contact: '9876501234',
//     isApplied: false,
//     trainingProvided: true,
//     experienceLevel: 'beginner',
//   },
//   {
//     id: 3,
//     title: 'Construction Helper - Training Included',
//     location: 'Vizianagaram',
//     salary: '₹500/day',
//     type: 'Daily Work',
//     timeAgo: '3 days ago',
//     urgency: 'normal',
//     description: 'Join our construction team and learn valuable building skills.',
//     requirements: ['Hardworking attitude', 'Team player', 'Willing to learn'],
//     benefits: ['Skill development', 'Weekly bonus', 'Career advancement'],
//     postedBy: 'Suresh',
//     contact: '9998887777',
//     isApplied: false,
//     trainingProvided: true,
//     experienceLevel: 'beginner',
//   },
// ];

// const HomeScreen = ({ navigation }) => {
//   const [searchText, setSearchText] = useState('');
//   const [location, setLocation] = useState(null);
//   const [loadingLocation, setLoadingLocation] = useState(false);
//   const [notifications, setNotifications] = useState(3);
//   const [jobs, setJobs] = useState(nearbyJobs);

//   const fetchLocation = async () => {
//     try {
//       setLoadingLocation(true);
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission denied', 'Location permission is required');
//         setLoadingLocation(false);
//         return;
//       }
      
//       let loc = await Location.getCurrentPositionAsync({});
//       let reverse = await Location.reverseGeocodeAsync(loc.coords);
      
//       if (reverse.length > 0) {
//         const place = reverse[0];
//         const city = place.city || place.district || place.subregion || 
//                     place.region || place.name || 'Unknown Location';
//         setLocation(city.trim());
//       } else {
//         setLocation('Unknown Location');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Could not fetch location');
//       setLocation('Unknown Location');
//     } finally {
//       setLoadingLocation(false);
//     }
//   };

//   const handleCategoryPress = (category) => {
//     navigation.navigate('CategoryJobs', {
//       categoryName: category.name,
//       categoryIcon: category.icon,
//     });
//   };

//   const handleJobPress = (job) => {
//     navigation.navigate('JobDetails', { job });
//   };

//   const handleNotificationPress = () => {
//     setNotifications(0);
//     navigation.navigate('Notifications');
//   };

//   const handleSearchFocus = () => {
//     navigation.navigate('Search');
//   };

//   const handleSearchChange = (text) => {
//     setSearchText(text);
//   };

//   const handleApplyJob = (jobId) => {
//     const job = jobs.find(j => j.id === jobId);
//     Alert.alert(
//       'Apply for Job',
//       `Are you sure you want to apply for "${job.title}"?\n\nThis is a beginner-friendly job with training provided!`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Apply', 
//           onPress: () => {
//             setJobs(prevJobs => 
//               prevJobs.map(j => 
//                 j.id === jobId ? { ...j, isApplied: true } : j
//               )
//             );
//             Alert.alert('Success', 'Your application has been submitted! The employer will contact you soon.');
//           }
//         }
//       ]
//     );
//   };

//   const handleSeeAllJobs = () => {
//     navigation.navigate('AllJobs');
//   };

//   useEffect(() => {
//     fetchLocation();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
//       {/* Enhanced Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Ionicons name="location" size={16} color="#6B7280" />
//           <Text style={styles.locationText}>
//             {loadingLocation ? 'Locating...' : location || 'Unknown'}
//           </Text>
//         </View>
        
//         <View style={styles.headerCenter}>
//           <Text style={styles.brandTitle}>VillageWork</Text>
//           <Text style={styles.brandSubtitle}>Beginner-Friendly Jobs</Text>
//         </View>
        
//         <View style={styles.headerRight}>
//           <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
//             <Ionicons name="notifications" size={24} color="#374151" />
//             {notifications > 0 && (
//               <View style={styles.notificationBadge}>
//                 <Text style={styles.badgeText}>{notifications}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchSection}>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color="#9CA3AF" />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search beginner-friendly jobs..."
//             value={searchText}
//             onChangeText={handleSearchChange}
//             onFocus={handleSearchFocus}
//           />
//           <TouchableOpacity style={styles.filterButton}>
//             <Ionicons name="options" size={20} color="#4F46E5" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
//         {/* Beginner Welcome Card */}
//         <View style={styles.welcomeCard}>
//           <View style={styles.welcomeHeader}>
//             <Ionicons name="school" size={24} color="#10B981" />
//             <Text style={styles.welcomeTitle}>Perfect for Beginners!</Text>
//           </View>
//           <Text style={styles.welcomeText}>
//             All jobs here welcome new workers. No experience required - we help you learn!
//           </Text>
//         </View>

//         {/* Quick Stats */}
//         <View style={styles.statsContainer}>
//           <View style={styles.statItem}>
//             <Ionicons name="briefcase" size={18} color="#10B981" />
//             <Text style={styles.statNumber}>24</Text>
//             <Text style={styles.statLabel}>Jobs Today</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Ionicons name="school" size={18} color="#4F46E5" />
//             <Text style={styles.statNumber}>18</Text>
//             <Text style={styles.statLabel}>With Training</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Ionicons name="person-add" size={18} color="#F59E0B" />
//             <Text style={styles.statNumber}>156</Text>
//             <Text style={styles.statLabel}>New Workers</Text>
//           </View>
//         </View>

//         {/* Daily Work Categories */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Daily Work - Perfect for Beginners</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
//             {dailyWorkCategories.map((category, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => handleCategoryPress(category)}
//                 style={[styles.categoryCard, { backgroundColor: category.color }]}
//               >
//                 <View style={styles.categoryIconContainer}>
//                   <Ionicons name={category.icon} size={28} color="#FFFFFF" />
//                 </View>
//                 <Text style={styles.categoryName}>{category.name}</Text>
//                 <View style={styles.beginnerBadge}>
//                   <Ionicons name="checkmark" size={12} color="#FFFFFF" />
//                   <Text style={styles.beginnerBadgeText}>Beginner OK</Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         {/* Technical Work Categories */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Technical Work - Learn While Working</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
//             {technicalWorkCategories.map((category, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => handleCategoryPress(category)}
//                 style={[styles.categoryCard, { backgroundColor: category.color }]}
//               >
//                 <View style={styles.categoryIconContainer}>
//                   <Ionicons name={category.icon} size={28} color="#FFFFFF" />
//                 </View>
//                 <Text style={styles.categoryName}>{category.name}</Text>
//                 <View style={styles.beginnerBadge}>
//                   <Ionicons name="school" size={12} color="#FFFFFF" />
//                   <Text style={styles.beginnerBadgeText}>Training</Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         {/* Nearby Jobs */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitleMain}>Nearby Jobs for You</Text>
//             <TouchableOpacity onPress={handleSeeAllJobs}>
//               <Text style={styles.seeAllText}>See All</Text>
//             </TouchableOpacity>
//           </View>
          
//           {jobs.map((job) => (
//             <TouchableOpacity
//               key={job.id}
//               onPress={() => handleJobPress(job)}
//               style={styles.jobCard}
//             >
//               <View style={styles.jobHeader}>
//                 <View style={[styles.jobTypeTag, { 
//                   backgroundColor: job.type === 'Daily Work' ? '#DEF7EC' : '#EBF8FF' 
//                 }]}>
//                   <Text style={[styles.jobTypeText, { 
//                     color: job.type === 'Daily Work' ? '#047857' : '#1E40AF' 
//                   }]}>
//                     {job.type}
//                   </Text>
//                 </View>
//                 <View style={styles.jobMeta}>
//                   <Text style={styles.timeAgo}>{job.timeAgo}</Text>
//                   {job.urgency === 'urgent' && (
//                     <View style={styles.urgentBadge}>
//                       <Ionicons name="flash" size={10} color="#DC2626" />
//                       <Text style={styles.urgentText}>Urgent</Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
              
//               <Text style={styles.jobTitle}>{job.title}</Text>
              
//               <View style={styles.jobLocation}>
//                 <Ionicons name="location" size={16} color="#6B7280" />
//                 <Text style={styles.jobLocationText}>{job.location}</Text>
//               </View>

//               <View style={styles.jobFeatures}>
//                 <View style={styles.featureTag}>
//                   <Ionicons name="person-add" size={12} color="#10B981" />
//                   <Text style={styles.featureText}>No Experience Needed</Text>
//                 </View>
//                 {job.trainingProvided && (
//                   <View style={styles.featureTag}>
//                     <Ionicons name="school" size={12} color="#4F46E5" />
//                     <Text style={styles.featureText}>Training Provided</Text>
//                   </View>
//                 )}
//               </View>

//               <View style={styles.jobBenefits}>
//                 <Text style={styles.benefitsTitle}>What you get:</Text>
//                 <View style={styles.benefitsList}>
//                   {job.benefits.slice(0, 2).map((benefit, index) => (
//                     <View key={index} style={styles.benefitItem}>
//                       <Ionicons name="checkmark-circle" size={14} color="#10B981" />
//                       <Text style={styles.benefitText}>{benefit}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
              
//               <View style={styles.jobFooter}>
//                 <View style={styles.salaryContainer}>
//                   <Text style={styles.salaryLabel}>Daily Payment</Text>
//                   <Text style={styles.salary}>{job.salary}</Text>
//                 </View>
                
//                 <TouchableOpacity
//                   style={[styles.applyButton, job.isApplied && styles.appliedButton]}
//                   onPress={(e) => {
//                     e.stopPropagation();
//                     if (!job.isApplied) {
//                       handleApplyJob(job.id);
//                     }
//                   }}
//                   disabled={job.isApplied}
//                 >
//                   <Ionicons 
//                     name={job.isApplied ? "checkmark" : "paper-plane"} 
//                     size={16} 
//                     color="#FFFFFF" 
//                   />
//                   <Text style={styles.applyText}>
//                     {job.isApplied ? 'Applied' : 'Apply Now'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableOpacity>
//           ))}
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
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerCenter: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   headerRight: {
//     flex: 1,
//     alignItems: 'flex-end',
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   brandTitle: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: '#1F2937',
//     textAlign: 'center',
//   },
//   brandSubtitle: {
//     fontSize: 12,
//     color: '#10B981',
//     textAlign: 'center',
//     marginTop: 2,
//     fontWeight: '600',
//   },
//   notificationButton: {
//     position: 'relative',
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: '#F3F4F6',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: 4,
//     right: 4,
//     backgroundColor: '#EF4444',
//     borderRadius: 8,
//     width: 16,
//     height: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   badgeText: {
//     color: '#FFFFFF',
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   searchSection: {
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#1F2937',
//   },
//   filterButton: {
//     padding: 4,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   welcomeCard: {
//     backgroundColor: '#F0FDF4',
//     marginHorizontal: 20,
//     marginTop: 20,
//     padding: 20,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#BBF7D0',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   welcomeHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   welcomeTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#047857',
//     marginLeft: 8,
//   },
//   welcomeText: {
//     fontSize: 14,
//     color: '#065F46',
//     lineHeight: 20,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 20,
//     marginTop: 20,
//     marginBottom: 20,
//     paddingVertical: 20,
//     borderRadius: 16,
//     justifyContent: 'space-around',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginTop: 6,
//   },
//   statLabel: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   section: {
//     marginBottom: 28,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//     paddingHorizontal: 20,
//     marginBottom: 16,
//   },
//   sectionTitleMain: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   seeAllText: {
//     fontSize: 14,
//     color: '#4F46E5',
//     fontWeight: '600',
//   },
//   categoriesContainer: {
//     paddingLeft: 20,
//   },
//   categoryCard: {
//     width: 120,
//     height: 120,
//     borderRadius: 18,
//     padding: 16,
//     marginRight: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//   },
//   categoryIconContainer: {
//     marginBottom: 8,
//   },
//   categoryName: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   beginnerBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 8,
//   },
//   beginnerBadgeText: {
//     fontSize: 10,
//     color: '#FFFFFF',
//     marginLeft: 2,
//     fontWeight: '600',
//   },
//   jobCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 18,
//     padding: 20,
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
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   jobTypeTag: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   jobTypeText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   jobMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   timeAgo: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   urgentBadge: {
//     backgroundColor: '#FEE2E2',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     marginLeft: 8,
//   },
//   urgentText: {
//     fontSize: 10,
//     color: '#DC2626',
//     fontWeight: '600',
//     marginLeft: 2,
//   },
//   jobTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   jobLocation: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   jobLocationText: {
//     fontSize: 15,
//     color: '#6B7280',
//     marginLeft: 4,
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
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     marginRight: 8,
//     marginBottom: 4,
//     borderWidth: 1,
//     borderColor: '#BBF7D0',
//   },
//   featureText: {
//     fontSize: 11,
//     color: '#047857',
//     marginLeft: 4,
//     fontWeight: '600',
//   },
//   jobBenefits: {
//     backgroundColor: '#FFFBEB',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#FED7AA',
//   },
//   benefitsTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#92400E',
//     marginBottom: 6,
//   },
//   benefitsList: {
//     gap: 4,
//   },
//   benefitItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   benefitText: {
//     fontSize: 13,
//     color: '#92400E',
//     marginLeft: 6,
//   },
//   jobFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   salaryContainer: {
//     alignItems: 'flex-start',
//   },
//   salaryLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginBottom: 2,
//   },
//   salary: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#059669',
//   },
//   applyButton: {
//     backgroundColor: '#4F46E5',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   appliedButton: {
//     backgroundColor: '#10B981',
//   },
//   applyText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 6,
//   },
// });

// export default HomeScreen;
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
  Modal,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const dailyWorkCategories = [
  { name: 'Farming', icon: 'leaf', color: '#10B981', hasSkillLevels: false },
  { name: 'Construction', icon: 'hammer', color: '#F59E0B', hasSkillLevels: true },
  { name: 'Cleaning', icon: 'brush', color: '#6366F1', hasSkillLevels: false },
  { name: 'Housekeeping', icon: 'home', color: '#EC4899', hasSkillLevels: false },
];

const technicalWorkCategories = [
  { name: 'Electrician', icon: 'flash', color: '#EF4444', hasSkillLevels: true, requiresTest: true },
  { name: 'Plumber', icon: 'water', color: '#3B82F6', hasSkillLevels: true, requiresTest: true },
  { name: 'Carpenter', icon: 'construct', color: '#8B5CF6', hasSkillLevels: true, requiresTest: true },
  { name: 'Mechanic', icon: 'car-sport', color: '#06B6D4', hasSkillLevels: true, requiresTest: true },
];

const nearbyJobs = [
  {
    id: 1,
    title: 'Farm Assistant Needed',
    location: 'Rajam, Srikakulam',
    salary: '₹450/day',
    type: 'Daily Work',
    timeAgo: '2 hours ago',
    urgency: 'urgent',
    description: 'Help with daily farming activities. Training provided for beginners.',
    skillLevel: 'any', // beginner, intermediate, expert, any
    requirements: ['Physically fit', 'Available full day'],
    benefits: ['Daily payment', 'Lunch provided', 'Transport allowance'],
    postedBy: 'Ramesh Naidu',
    contact: '9876543210',
    isApplied: false,
    trainingProvided: true,
  },
  {
    id: 2,
    title: 'Experienced Electrician Required',
    location: 'Kothavalasa',
    salary: '₹1200/day',
    type: 'Technical Work',
    timeAgo: '1 day ago',
    urgency: 'normal',
    description: 'Complex home wiring project. Experience mandatory.',
    skillLevel: 'expert',
    requirements: ['5+ years experience', 'Own tools', 'Safety certified'],
    benefits: ['High pay', 'Project bonus', 'Future work opportunities'],
    postedBy: 'Anil Kumar',
    contact: '9876501234',
    isApplied: false,
    requiresSkillTest: true,
    testDetails: 'Basic electrical safety and wiring knowledge test',
  },
  {
    id: 3,
    title: 'Carpenter - All Levels Welcome',
    location: 'Vizianagaram',
    salary: '₹600-1000/day',
    type: 'Technical Work',
    timeAgo: '3 days ago',
    urgency: 'normal',
    description: 'Furniture making project. Beginners can learn, experienced get higher pay.',
    skillLevel: 'any',
    requirements: ['Interest in woodworking', 'Basic tool knowledge helpful'],
    benefits: ['Skill development', 'Variable pay based on skill', 'Weekly bonus'],
    postedBy: 'Suresh',
    contact: '9998887777',
    isApplied: false,
    hasSkillAssessment: true,
  },
];

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [jobs, setJobs] = useState(nearbyJobs);
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userSkillLevel, setUserSkillLevel] = useState('beginner');

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
        const city = place.city || place.district || place.subregion ||
          place.region || place.name || 'Unknown Location';
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

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryJobs', {
      categoryName: category.name,
      categoryIcon: category.icon,
      hasSkillLevels: category.hasSkillLevels,
      requiresTest: category.requiresTest,
    });
  };

  const handleJobPress = (job) => {
    navigation.navigate('JobDetails', { job });
  };

  const handleApplyJob = (job) => {
    if (job.requiresSkillTest || job.hasSkillAssessment) {
      setSelectedJob(job);
      setSkillModalVisible(true);
    } else {
      // Direct application for non-technical jobs
      Alert.alert(
        'Apply for Job',
        `Apply for "${job.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Apply',
            onPress: () => {
              setJobs(prevJobs =>
                prevJobs.map(j =>
                  j.id === job.id ? { ...j, isApplied: true } : j
                )
              );
              Alert.alert('Success', 'Application submitted successfully!');
            }
          }
        ]
      );
    }
  };

  const handleSkillAssessment = (skillLevel) => {
    setSkillModalVisible(false);
    
    if (selectedJob.skillLevel === 'expert' && skillLevel === 'beginner') {
      Alert.alert(
        'Skill Level Mismatch',
        'This job requires expert level skills. Would you like to apply for a training position instead?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Find Training Jobs',
            onPress: () => navigation.navigate('CategoryJobs', {
              categoryName: 'Training Programs',
              skillLevel: 'beginner'
            })
          }
        ]
      );
      return;
    }

    if (selectedJob.requiresSkillTest && skillLevel !== 'beginner') {
      Alert.alert(
        'Skill Test Required',
        `This job requires a skill test. You'll be connected with a nearby ${selectedJob.type.toLowerCase()} expert for assessment.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Schedule Test',
            onPress: () => {
              // Here you would navigate to skill test scheduling
              Alert.alert(
                'Test Scheduled',
                'A nearby expert will contact you within 2 hours to schedule your skill assessment.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      setJobs(prevJobs =>
                        prevJobs.map(j =>
                          j.id === selectedJob.id ? { ...j, isApplied: true, testScheduled: true } : j
                        )
                      );
                    }
                  }
                ]
              );
            }
          }
        ]
      );
    } else {
      // Direct application based on skill level
      setJobs(prevJobs =>
        prevJobs.map(j =>
          j.id === selectedJob.id ? { ...j, isApplied: true } : j
        )
      );
      Alert.alert('Success', 'Application submitted successfully!');
    }
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'expert': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSkillLevelText = (level) => {
    switch (level) {
      case 'beginner': return 'Beginner Friendly';
      case 'intermediate': return 'Some Experience Required';
      case 'expert': return 'Expert Level';
      case 'any': return 'All Levels Welcome';
      default: return 'Any Level';
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="location" size={16} color="#10B981" />
          <Text style={styles.locationText}>
            {loadingLocation ? 'Locating...' : location || 'Unknown'}
          </Text>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.brandTitle}>VillageWork</Text>
          <Text style={styles.brandSubtitle}>All Skill Levels</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton} onPress={() => setNotifications(0)}>
            <Ionicons name="notifications" size={20} color="#374151" />
            {notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs by skill level, location..."
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => navigation.navigate('Search')}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Skill Level Selection Card */}
        <View style={styles.skillCard}>
          <View style={styles.skillHeader}>
            <Ionicons name="school" size={24} color="#4F46E5" />
            <Text style={styles.skillTitle}>Choose Your Experience Level</Text>
          </View>
          <Text style={styles.skillSubtitle}>
            We'll show you the most suitable jobs based on your skills
          </Text>
          <View style={styles.skillLevels}>
            {['beginner', 'intermediate', 'expert'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.skillLevelButton,
                  userSkillLevel === level && styles.selectedSkillLevel,
                  { borderColor: getSkillLevelColor(level) }
                ]}
                onPress={() => setUserSkillLevel(level)}
              >
                <Text style={[
                  styles.skillLevelText,
                  userSkillLevel === level && { color: getSkillLevelColor(level) }
                ]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="briefcase" size={24} color="#4F46E5" />
            <Text style={styles.statNumber}>47</Text>
            <Text style={styles.statLabel}>Total Jobs</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="school" size={24} color="#10B981" />
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>With Training</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>18</Text>
            <Text style={styles.statLabel}>Expert Level</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color="#EF4444" />
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>With Tests</Text>
          </View>
        </View>

        {/* Daily Work Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Work</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {dailyWorkCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleCategoryPress(category)}
                style={[styles.categoryCard, { backgroundColor: category.color }]}
              >
                <View style={styles.categoryIconContainer}>
                  <Ionicons name={category.icon} size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categorySubtext}>Multiple levels</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Technical Work Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Work</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {technicalWorkCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleCategoryPress(category)}
                style={[styles.categoryCard, { backgroundColor: category.color }]}
              >
                <View style={styles.categoryIconContainer}>
                  <Ionicons name={category.icon} size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <View style={styles.testBadge}>
                  <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
                  <Text style={styles.testBadgeText}>Skill Test</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Nearby Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleMain}>Nearby Jobs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllJobs')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              onPress={() => handleJobPress(job)}
              style={styles.jobCard}
            >
              <View style={styles.jobHeader}>
                <View style={[styles.jobTypeTag, { 
                  backgroundColor: job.type === 'Daily Work' ? '#F0FDF4' : '#FFF7ED' 
                }]}>
                  <Text style={[styles.jobTypeText, { 
                    color: job.type === 'Daily Work' ? '#047857' : '#C2410C' 
                  }]}>
                    {job.type}
                  </Text>
                </View>
                <View style={styles.jobMeta}>
                  <Text style={styles.timeAgo}>{job.timeAgo}</Text>
                  {job.urgency === 'urgent' && (
                    <View style={styles.urgentBadge}>
                      <Ionicons name="time" size={10} color="#DC2626" />
                      <Text style={styles.urgentText}>Urgent</Text>
                    </View>
                  )}
                </View>
              </View>

              <Text style={styles.jobTitle}>{job.title}</Text>
              
              <View style={styles.jobLocation}>
                <Ionicons name="location" size={16} color="#6B7280" />
                <Text style={styles.jobLocationText}>{job.location}</Text>
              </View>

              {/* Skill Level Indicator */}
              <View style={styles.skillLevelContainer}>
                <View style={[styles.skillLevelTag, { backgroundColor: getSkillLevelColor(job.skillLevel) }]}>
                  <Text style={styles.skillLevelTagText}>{getSkillLevelText(job.skillLevel)}</Text>
                </View>
                {job.requiresSkillTest && (
                  <View style={styles.testRequired}>
                    <Ionicons name="school" size={14} color="#8B5CF6" />
                    <Text style={styles.testRequiredText}>Skill Test Required</Text>
                  </View>
                )}
              </View>

              {/* Job Benefits Preview */}
              <View style={styles.benefitsPreview}>
                {job.benefits.slice(0, 2).map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.jobFooter}>
                <View style={styles.salaryContainer}>
                  <Text style={styles.salaryLabel}>Daily Payment</Text>
                  <Text style={styles.salary}>{job.salary}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    job.isApplied && styles.appliedButton
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    if (!job.isApplied) {
                      handleApplyJob(job);
                    }
                  }}
                  disabled={job.isApplied}
                >
                  <Ionicons 
                    name={job.isApplied ? "checkmark" : "paper-plane"} 
                    size={16} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.applyText}>
                    {job.isApplied ? 'Applied' : 'Apply Now'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Skill Assessment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={skillModalVisible}
        onRequestClose={() => setSkillModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Skill Assessment</Text>
              <TouchableOpacity onPress={() => setSkillModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              What's your experience level in {selectedJob?.type}?
            </Text>
            
            <View style={styles.modalSkillLevels}>
              {[
                { level: 'beginner', description: 'New to this field, willing to learn' },
                { level: 'intermediate', description: 'Have some experience, can work independently' },
                { level: 'expert', description: 'Highly experienced, can handle complex tasks' }
              ].map((skill) => (
                <TouchableOpacity
                  key={skill.level}
                  style={styles.modalSkillOption}
                  onPress={() => handleSkillAssessment(skill.level)}
                >
                  <View style={styles.skillOptionHeader}>
                    <Text style={styles.skillOptionTitle}>
                      {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                  </View>
                  <Text style={styles.skillOptionDescription}>{skill.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
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
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#4F46E5',
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
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  skillCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  skillSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  skillLevels: {
    flexDirection: 'row',
    gap: 12,
  },
  skillLevelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  selectedSkillLevel: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  skillLevelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 20,
    borderRadius: 16,
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 28,
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
    marginBottom: 16,
  },
  sectionTitleMain: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingLeft: 20,
  },
  categoryCard: {
    width: 120,
    height: 130,
    borderRadius: 18,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  categoryIconContainer: {
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  categorySubtext: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  testBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  testBadgeText: {
    fontSize: 9,
    color: '#FFFFFF',
    marginLeft: 2,
    fontWeight: '600',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTypeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeAgo: {
    fontSize: 12,
    color: '#6B7280',
  },
  urgentBadge: {
    backgroundColor: '#FEE2E2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  urgentText: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '600',
    marginLeft: 2,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  jobLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobLocationText: {
    fontSize: 15,
    color: '#6B7280',
    marginLeft: 4,
  },
  skillLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  skillLevelTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillLevelTagText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  testRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  testRequiredText: {
    fontSize: 11,
    color: '#8B5CF6',
    marginLeft: 4,
    fontWeight: '600',
  },
  benefitsPreview: {
    marginBottom: 16,
    gap: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 13,
    color: '#059669',
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  appliedButton: {
    backgroundColor: '#10B981',
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalSkillLevels: {
    gap: 12,
  },
  modalSkillOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  skillOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  skillOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  skillOptionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default HomeScreen;
