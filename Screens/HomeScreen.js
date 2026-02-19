
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
//                 </View>
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
import React, { useState, useEffect, useMemo } from 'react';
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
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useResponsive } from '../utils/responsive';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../contexts/LanguageContext';
import { translateJobs } from '../utils/jobTranslations';
import { api } from '../utils/api';

const dailyWorkCategories = [
  { name: 'Farming', icon: 'leaf', color: '#10B981', hasSkillLevels: false },
  { name: 'Construction', icon: 'hammer', color: '#F59E0B', hasSkillLevels: true },
  { name: 'Cleaning', icon: 'brush', color: '#6366F1', hasSkillLevels: false },
  { name: 'Housekeeping', icon: 'home', color: '#EC4899', hasSkillLevels: false },
  { name: 'Welder', icon: 'flame', color: '#EF4444', hasSkillLevels: false },
  { name: 'Painter', icon: 'color-palette', color: '#8B5CF6', hasSkillLevels: false },
];

// Category icon and color mapping
const categoryIconMap = {
  'Electrician': { icon: 'flash', color: '#EF4444' },
  'Plumber': { icon: 'water', color: '#3B82F6' },
  'Carpenter': { icon: 'construct', color: '#8B5CF6' },
  'Mechanic': { icon: 'car-sport', color: '#06B6D4' },
  'Welder': { icon: 'flame', color: '#F97316' },
  'Painter': { icon: 'color-palette', color: '#EC4899' },
  'Mason': { icon: 'home', color: '#64748B' },
  'Finance': { icon: 'cash', color: '#10B981' },
  'Accounts': { icon: 'calculator', color: '#059669' },
  'Computer': { icon: 'desktop', color: '#6366F1' },
  'Data Entry': { icon: 'document-text', color: '#8B5CF6' },
  'Excel': { icon: 'stats-chart', color: '#10B981' },
  'Typing': { icon: 'create', color: '#3B82F6' },
  'Office Work': { icon: 'briefcase', color: '#6366F1' },
  // Default for any other category
  'default': { icon: 'hammer', color: '#64748B' }
};

// Default technical categories - always shown
const defaultTechnicalCategories = [
  { name: 'Electrician', icon: 'flash', color: '#F59E0B', hasSkillLevels: true, requiresTest: true },
  { name: 'Plumber', icon: 'water', color: '#3B82F6', hasSkillLevels: true, requiresTest: true },
  { name: 'Carpenter', icon: 'hammer', color: '#8B4513', hasSkillLevels: true, requiresTest: true },
  { name: 'Mechanic', icon: 'build', color: '#6B7280', hasSkillLevels: true, requiresTest: true },
  { name: 'Data Entry', icon: 'document-text', color: '#10B981', hasSkillLevels: true, requiresTest: true },
];

const HomeScreen = ({ navigation }) => {
  const { t, language } = useLanguage();
  const r = useResponsive();
  const styles = useMemo(() => createStyles(r), [r.width, r.height]);
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [originalJobs, setOriginalJobs] = useState([]); // Start with empty array - only backend jobs
  const [jobs, setJobs] = useState([]);
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userSkillLevel, setUserSkillLevel] = useState('helper');
  const [skillAssessmentCompleted, setSkillAssessmentCompleted] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [technicalCategories, setTechnicalCategories] = useState(defaultTechnicalCategories); // Start with defaults
  const [userSkills, setUserSkills] = useState({}); // { categoryName: { passed: true/false, attempted: true/false } }

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

  const handleCategoryPress = async (category) => {
    // Daily Work - always accessible
    if (!category.requiresTest) {
      navigation.navigate('CategoryJobs', {
        categoryName: category.name,
        categoryIcon: category.icon,
        hasSkillLevels: category.hasSkillLevels,
        requiresTest: false,
      });
      return;
    }

    // Technical Work - check skill status
    const skillStatus = userSkills[category.name];
    
    if (skillStatus?.passed) {
      // Skill test passed - allow access to jobs
      navigation.navigate('CategoryJobs', {
        categoryName: category.name,
        categoryIcon: category.icon,
        hasSkillLevels: category.hasSkillLevels,
        requiresTest: category.requiresTest,
      });
    } else if (skillStatus?.attempted && !skillStatus?.passed) {
      // Skill test failed - locked
      Alert.alert(
        `${category.name} Skills Locked`,
        `You attempted the ${category.name} skill test but didn't pass. This skill remains locked.\n\nYou can still attempt tests for other skills.`,
        [{ text: 'OK' }]
      );
    } else {
      // Not attempted yet - offer to take skill test
      Alert.alert(
        `${category.name} Skill Test`,
        `To access ${category.name} jobs, you need to pass a skill test for this category.\n\nYou get 1 attempt. Pass = Unlock jobs`,
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Take Test',
            onPress: () => {
              navigation.navigate('QuizScreen', {
                category: { name: category.name, icon: category.icon }
              });
            }
          }
        ]
      );
    }
  };

  const handleJobPress = (job) => {
    navigation.navigate('JobDetailsScreen', { job });
  };

  const handleViewDetails = (job) => {
    // Always navigate to job details screen
    // User can see full details and apply from there
    handleJobPress(job);
  };

  const handleSkillAssessment = (skillLevel) => {
    setSkillModalVisible(false);
    
    if (selectedJob.skillLevel === 'expert' && skillLevel === 'helper') {
      Alert.alert(
        'Skill Level Mismatch',
        'This job requires expert level skills. Would you like to apply for a training position instead?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Find Training Jobs',
            onPress: () => navigation.navigate('CategoryJobs', {
              categoryName: 'Training Programs',
              skillLevel: 'helper'
            })
          }
        ]
      );
      return;
    }

    // Check if user needs skill test (only show if quiz not passed)
    if (selectedJob.requiresSkillTest && skillLevel !== 'helper' && testStatus !== 'passed') {
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
      // Direct application - allowed for helpers or users who passed quiz
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
      case 'helper': return '#10B981';
      case 'worker': return '#3B82F6';
      case 'expert': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSkillLevelText = (level) => {
    switch (level) {
      case 'helper': return t('helper');
      case 'worker': return t('worker');
      case 'expert': return t('expert');
      default: return t('anyLevel');
    }
  };

  const loadUserSkills = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        console.log('No auth token - user skills not loaded');
        return;
      }

      // Fetch all quiz results for this user
      const quizResults = await api.get('/api/quiz/my-results', { auth: true });
      
      // Build skill status map
      const skillsMap = {};
      quizResults.forEach(quiz => {
        if (quiz.category) {
          skillsMap[quiz.category] = {
            passed: quiz.passed,
            attempted: true,
            score: quiz.score,
            totalQuestions: quiz.totalQuestions,
            percentage: quiz.percentage
          };
        }
      });
      
      setUserSkills(skillsMap);
      console.log('📚 User skills loaded:', Object.keys(skillsMap));
    } catch (error) {
      console.error('Error loading user skills:', error);
      setUserSkills({});
    }
  };

  useEffect(() => {
    loadUserData();
    fetchLocation();
    fetchJobsFromBackend();
    loadUserSkills();
    fetchUnreadNotifications();

    // Set up polling for real-time notifications (every 30 seconds)
    const notificationInterval = setInterval(() => {
      fetchUnreadNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(notificationInterval);
  }, []);

  // Refresh when screen comes into focus (e.g., returning from quiz or notifications)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('HomeScreen focused - refreshing data');
      loadUserData();
      fetchJobsFromBackend();
      loadUserSkills();  // Reload skills when returning from quiz
      fetchUnreadNotifications(); // Refresh notification count
    });

    return unsubscribe;
  }, [navigation]);

  // Re-filter jobs whenever testStatus changes (originalJobs is used directly, not as dependency)
  useEffect(() => {
    if (originalJobs.length > 0) {
      console.log('🔄 Re-filtering jobs - testStatus:', testStatus, 'jobs:', originalJobs.length);
      filterJobsBySkillLevel(userSkillLevel, testStatus);
    }
  }, [testStatus]);

  // Fetch jobs from backend API
  const fetchJobsFromBackend = async () => {
    try {
      setLoadingJobs(true);
      // Fetch jobs without authentication (public endpoint)
      const backendJobs = await api.get('/api/jobs', { auth: false });
      
      if (backendJobs && backendJobs.length > 0) {
        // Transform backend jobs to match frontend format
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
          experienceLevel: job.experienceLevel || 'any',
          trainingProvided: job.trainingProvided || false,
          postedBy: job.postedBy?.name || 'Unknown',
          contact: job.postedBy?.phone || '',
          isApplied: false,
          urgency: job.urgency || 'normal',
          status: job.status || 'active',
          createdAt: job.createdAt,
          // Add computed fields
          timeAgo: job.createdAt ? getTimeAgo(new Date(job.createdAt)) : 'Recently',
          // Any Technical Work job requires skill test (quiz)
          requiresSkillTest: job.type === 'Technical Work',
          hasSkillAssessment: job.type === 'Technical Work'
        }));
        
        // Update jobs state - filter based on current quiz status
        setOriginalJobs(transformedJobs);
        
        // Extract unique technical categories from jobs (exclude Farming)
        const technicalJobs = transformedJobs.filter(job => 
          job.type === 'Technical Work' && job.category !== 'Farming'
        );
        const uniqueCategories = [...new Set(technicalJobs.map(job => job.category))].filter(Boolean);
        
        // Map backend categories to display format
        const backendCategories = uniqueCategories.map(categoryName => {
          const iconData = categoryIconMap[categoryName] || categoryIconMap['default'];
          return {
            name: categoryName,
            icon: iconData.icon,
            color: iconData.color,
            hasSkillLevels: true,
            requiresTest: true
          };
        });
        
        // Merge default categories with backend categories (remove duplicates and Farming)
        const allCategoryNames = new Set([
          ...defaultTechnicalCategories.map(c => c.name),
          ...backendCategories.map(c => c.name)
        ]);
        
        const mergedCategories = Array.from(allCategoryNames)
          .filter(categoryName => categoryName !== 'Farming') // Remove Farming from technical categories
          .map(categoryName => {
            // Prefer backend category if it exists, otherwise use default
            const backendCat = backendCategories.find(c => c.name === categoryName);
            const defaultCat = defaultTechnicalCategories.find(c => c.name === categoryName);
            return backendCat || defaultCat;
          })
          .filter(Boolean);
        
        setTechnicalCategories(mergedCategories);
        console.log('📊 Technical categories (default + backend):', mergedCategories.length, mergedCategories.map(c => c.name));
        
        // Filter jobs with current testStatus
        filterJobsBySkillLevel(userSkillLevel, testStatus, transformedJobs);
      } else {
        // No jobs from backend - keep default technical categories, show empty state for jobs
        console.log('No jobs available from backend - showing default technical categories');
        setOriginalJobs([]);
        setJobs([]);
        setTechnicalCategories(defaultTechnicalCategories);
      }
    } catch (error) {
      console.error('Error fetching jobs from backend:', error);
      // Show empty state on error - keep default technical categories
      setOriginalJobs([]);
      setJobs([]);
      setTechnicalCategories(defaultTechnicalCategories);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Helper function to calculate time ago
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

  // Fetch unread notifications count
  const fetchUnreadNotifications = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        return; // Guest users don't have notifications
      }

      const response = await api.get('/api/notifications/unread-count', { auth: true });
      if (response.success) {
        setUnreadNotifications(response.unreadCount);
      }
    } catch (error) {
      // Silently fail - notifications not critical
      console.log('Could not fetch notification count');
    }
  };

  const loadUserData = async () => {
    try {
      // First check AsyncStorage for quick load
      const skillLevel = await AsyncStorage.getItem('userSkillLevel');
      const testStatusValue = await AsyncStorage.getItem('skillAssessmentCompleted');
      const authToken = await AsyncStorage.getItem('authToken');
      
      console.log('HomeScreen - Skill Level (local):', skillLevel);
      console.log('HomeScreen - Test Status (local):', testStatusValue);
      console.log('HomeScreen - Has Auth Token:', !!authToken);
      
      // Only fetch from backend if user is logged in
      if (authToken) {
        try {
          const userProfile = await api.get('/api/auth/me', { auth: true });
          if (userProfile) {
            console.log('HomeScreen - User Profile from backend:', userProfile);
            
            // Update state with backend data
            const backendSkillLevel = userProfile.skillLevel || skillLevel || 'new';
            const backendQuizPassed = userProfile.quizPassed || false;
            const backendTestStatus = backendQuizPassed ? 'passed' : (testStatusValue || 'pending');
            
            setUserSkillLevel(backendSkillLevel);
            setTestStatus(backendTestStatus);
            setSkillAssessmentCompleted(true);
            
            // Update AsyncStorage with backend data
            await AsyncStorage.setItem('userSkillLevel', backendSkillLevel);
            await AsyncStorage.setItem('skillAssessmentCompleted', backendTestStatus);
            await AsyncStorage.setItem('quizPassed', backendQuizPassed ? 'true' : 'false');
            
            // Jobs will be filtered by useEffect when testStatus is updated
            return;
          }
        } catch (apiError) {
          console.log('Not logged in or token expired, using guest mode');
          // User not logged in - that's okay, show guest view
        }
      }
      
      // Fallback to AsyncStorage data or default guest values
      setUserSkillLevel(skillLevel || 'new');
      setTestStatus(testStatusValue || 'pending');
      setSkillAssessmentCompleted(false);
      
      // Jobs will be filtered by useEffect when testStatus is updated
    } catch (error) {
      console.error('Error loading user data:', error);
      // Set default guest values on error
      setUserSkillLevel('new');
      setTestStatus('pending');
      setSkillAssessmentCompleted(false);
      // Jobs will be filtered by useEffect when testStatus is updated
    }
  };



  const filterJobsBySkillLevel = (skillLevel, testStatus, jobsToFilter = null) => {
    // Use provided jobs or current originalJobs (raw backend jobs)
    const rawJobs = jobsToFilter || originalJobs;
    
    console.log('Filtering jobs for skill level:', skillLevel, 'test status:', testStatus);
    console.log('Total jobs before filter:', rawJobs.length);
    
    // Check if user has passed the quiz
    const hasPassedQuiz = testStatus === 'passed';
    
    let filteredJobs;
    if (hasPassedQuiz) {
      // Users who passed quiz see all jobs (Technical + Daily)
      filteredJobs = rawJobs;
      console.log('✅ User passed quiz - showing all jobs (Technical + Daily):', filteredJobs.length);
      console.log('Technical work categories will be visible');
    } else {
      // All other users (new, failed, pending, skipped, null) see ONLY daily work
      // Strictly filter out all Technical Work jobs - only show Daily Work type
      filteredJobs = rawJobs.filter(job => job.type === 'Daily Work');
      console.log('❌ User has not passed quiz - showing only daily work:', filteredJobs.length, 'jobs');
      console.log('Technical work categories will be hidden');
    }
    
    // Translate jobs based on current language
    setJobs(translateJobs(filteredJobs, language));
  };

  // Re-translate jobs when language changes
  useEffect(() => {
    if (originalJobs.length > 0) {
      setJobs(translateJobs(originalJobs, language));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="location" size={16} color="#10B981" />
          <Text style={styles.locationText}>
            {loadingLocation ? t('locating') : location || t('unknownLocation')}
          </Text>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.brandTitle}>WORKNEX</Text>
          <Text style={styles.brandSubtitle}>STUDENT EMPLOYMENT PLATFORM</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.notificationButton} 
            onPress={() => navigation.navigate('NotificationsScreen')}
          >
            <Ionicons name="notifications" size={20} color="#374151" />
            {unreadNotifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </Text>
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
            placeholder={t('searchJobs')}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => navigation.navigate('Search')}
          />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={Platform.OS === 'android'}
      >

        {/* Daily Work Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dailyWork')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {dailyWorkCategories && dailyWorkCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleCategoryPress(category)}
                style={[styles.categoryCard, { backgroundColor: category.color }]}
              >
                <View style={styles.categoryIconContainer}>
                  <Ionicons name={category.icon} size={32} color="#FFFFFF" />
                </View>
                  <Text style={styles.categoryName}>{t(category.name.toLowerCase())}</Text>
                <Text style={styles.categorySubtext}>{t('multipleLevels')}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Technical Work Categories - Always visible, access based on skill test results */}
        {technicalCategories && technicalCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('technicalWork')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
              {technicalCategories && technicalCategories.map((category, index) => {
                const skillStatus = userSkills[category.name];
                const isPassed = skillStatus?.passed;
                const isLocked = skillStatus?.attempted && !skillStatus?.passed;
                const requiresTest = !skillStatus?.attempted;

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleCategoryPress(category)}
                    style={[
                      styles.categoryCard, 
                      { backgroundColor: category.color },
                      (isLocked || requiresTest) && styles.lockedCategoryCard
                    ]}
                  >
                    <View style={styles.categoryIconContainer}>
                      <Ionicons name={category.icon} size={32} color="#FFFFFF" />
                    </View>
                    <Text style={styles.categoryName}>{t(category.name.toLowerCase())}</Text>
                    
                    {isPassed && (
                      <View style={styles.passedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                        <Text style={styles.passedBadgeText}>Unlocked</Text>
                      </View>
                    )}
                    
                    {isLocked && (
                      <View style={styles.lockedBadge}>
                        <Ionicons name="lock-closed" size={14} color="#EF4444" />
                        <Text style={styles.lockedBadgeText}>Locked</Text>
                      </View>
                    )}
                    
                    {requiresTest && (
                      <View style={styles.testRequiredBadge}>
                        <Ionicons name="shield-checkmark" size={14} color="#F59E0B" />
                        <Text style={styles.testRequiredBadgeText}>Test Required</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Nearby Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleMain}>{t('nearbyJobs')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.seeAllText}>{t('viewAll')}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Loading State */}
          {loadingJobs && (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={styles.emptyStateText}>Loading jobs...</Text>
            </View>
          )}

          {/* Empty State - No Jobs */}
          {!loadingJobs && (!jobs || jobs.length === 0) && (
            <View style={styles.emptyState}>
              <Ionicons name="briefcase-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No Jobs Available</Text>
              <Text style={styles.emptyStateText}>
                Check back later or employers can post jobs from the Web Dashboard
              </Text>
            </View>
          )}

          {/* Jobs List */}
          {!loadingJobs && jobs && jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              onPress={() => handleJobPress(job)}
              style={styles.jobCard}
            >
              <View style={styles.jobHeader}>
                <View style={[styles.jobTypeTag, { 
                  backgroundColor: (job.originalType || job.type) === 'Daily Work' ? '#F0FDF4' : '#FFF7ED' 
                }]}>
                  <Text style={[styles.jobTypeText, { 
                    color: (job.originalType || job.type) === 'Daily Work' ? '#047857' : '#C2410C' 
                  }]}>
                    {job.type}
                  </Text>
                </View>
                <View style={styles.jobMeta}>
                  <Text style={styles.timeAgo}>{job.timeAgo}</Text>
                  {job.urgency === 'urgent' && (
                    <View style={styles.urgentBadge}>
                      <Ionicons name="time" size={10} color="#DC2626" />
                      <Text style={styles.urgentText}>{t('urgent')}</Text>
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
                {job.requiresSkillTest && testStatus !== 'passed' && (
                  <View style={styles.testRequired}>
                    <Ionicons name="school" size={14} color="#8B5CF6" />
                    <Text style={styles.testRequiredText}>{t('skillTestRequired')}</Text>
                  </View>
                )}
              </View>

              {/* Job Benefits Preview */}
              {job.benefits && job.benefits.length > 0 && (
                <View style={styles.benefitsPreview}>
                  {job.benefits.slice(0, 2).map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.jobFooter}>
                <View style={styles.salaryContainer}>
                  <Text style={styles.salaryLabel}>Daily Payment</Text>
                  <Text style={styles.salary}>{job.salary}</Text>
                </View>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleViewDetails(job);
                  }}
                >
                  <Ionicons 
                    name="eye-outline" 
                    size={16} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.applyText}>
                    View Details
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
                { level: 'helper', description: 'New to this field, willing to learn' },
                { level: 'worker', description: 'Have some experience, can work independently' },
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
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    alignItems: 'flex-end',
    flex: 1,
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
    fontSize: 11,
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
    paddingHorizontal: pad,
    paddingVertical: sp.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: sp.md,
    paddingVertical: sp.md,
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
  assessmentBanner: {
    backgroundColor: '#F8FAFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  assessmentBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#4F46E5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  assessmentBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  assessmentBannerText: {
    marginLeft: 12,
    flex: 1,
  },
  assessmentBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  assessmentBannerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  assessmentBannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  assessmentBannerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 6,
  },
  scrollView: {
    flex: 1,
    minHeight: 0,
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
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#047857',
    marginLeft: 6,
  },
  statusDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  testStatusContainer: {
    marginTop: 12,
  },
  testStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  testStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 4,
  },
  testStatusDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  testStatusButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  testStatusButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    paddingHorizontal: pad,
    marginBottom: sp.md,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: r.rsf(18),
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: pad,
    marginBottom: sp.md,
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
    paddingLeft: pad,
  },
  categoryCard: {
    width: r.rs(120),
    height: r.rs(130),
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
    textAlign: 'center',
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
    padding: pad,
    marginHorizontal: pad,
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
    flexWrap: 'wrap',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sp.xl * 2,
    paddingHorizontal: pad,
    marginHorizontal: pad,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  lockedCategoryCard: {
    opacity: 0.6,
  },
  passedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  passedBadgeText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  lockedBadgeText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 4,
  },
  testRequiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  testRequiredBadgeText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '600',
    marginLeft: 4,
  },
});
}

export default HomeScreen;
