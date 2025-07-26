// import React from 'react';
// import { View, Text, Image, TouchableOpacity } from 'react-native';

// const ProfileScreen = () => {
//   return (
//     <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
//       <View style={{ alignItems: 'center', marginTop: 32 }}>
//         <Image
//           source={require('../assets/favicon.png')}
//           style={{ width: 96, height: 96, borderRadius: 999 }}
//         />
//         <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginTop: 8 }}>Venkata Siva Rama Raju</Text>
//         <Text style={{ fontSize: 14, color: '#6B7280' }}>Full Stack Developer</Text>
//       </View>

//       <View style={{ backgroundColor: '#F9FAFB', borderRadius: 20, padding: 16, marginTop: 24, borderWidth: 1, borderColor: '#E5E7EB' }}>
//         <Text style={{ color: '#6B7280', fontSize: 14 }}>Email</Text>
//         <Text style={{ color: '#111827', fontWeight: '600', marginTop: 4 }}>venkata@example.com</Text>

//         <Text style={{ color: '#6B7280', fontSize: 14, marginTop: 16 }}>Phone</Text>
//         <Text style={{ color: '#111827', fontWeight: '600', marginTop: 4 }}>+91 9876543210</Text>

//         <Text style={{ color: '#6B7280', fontSize: 14, marginTop: 16 }}>Location</Text>
//         <Text style={{ color: '#111827', fontWeight: '600', marginTop: 4 }}>Rajam, Andhra Pradesh</Text>
//       </View>

//       <View style={{ marginTop: 24 }}>
//         <TouchableOpacity style={{ backgroundColor: '#4F46E5', paddingVertical: 12, borderRadius: 999, alignItems: 'center' }}>
//           <Text style={{ color: '#fff', fontWeight: '600' }}>Edit Profile</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={{ backgroundColor: '#FEE2E2', paddingVertical: 12, borderRadius: 999, alignItems: 'center', marginTop: 12 }}>
//           <Text style={{ color: '#EF4444', fontWeight: '600' }}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default ProfileScreen;
// ProfileScreen.js
// ProfileScreen.js
// import React, { useState } from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   StatusBar,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const ProfileScreen = ({ navigation }) => {
//   const [isOnline, setIsOnline] = useState(true);
//   const [availableForWork, setAvailableForWork] = useState(true);

//   const handleEditProfile = () => {
//     Alert.alert('Edit Profile', 'Navigate to edit profile screen', [
//       { text: 'OK', onPress: () => console.log('Edit profile pressed') }
//     ]);
//   };

//   const handleLogout = () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Logout', 
//           style: 'destructive', 
//           onPress: () => {
//             console.log('Logged out');
//             // Add logout logic here
//           }
//         }
//       ]
//     );
//   };

//   const handleStatusToggle = () => {
//     setIsOnline(!isOnline);
//   };

//   const handleWorkAvailabilityToggle = () => {
//     setAvailableForWork(!availableForWork);
//   };

//   const handleCallPress = () => {
//     Alert.alert('Call', 'Calling +91 9876543210...');
//   };

//   const handleEmailPress = () => {
//     Alert.alert('Email', 'Opening email client...');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#1a365d" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>My Profile</Text>
//         <TouchableOpacity onPress={handleStatusToggle}>
//           <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#48bb78' : '#f56565' }]}>
//             <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
//           </View>
//         </TouchableOpacity>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Profile Picture Section */}
//         <View style={styles.profileSection}>
//           <View style={styles.avatarContainer}>
//             <Image
//               source={{ uri: 'https://via.placeholder.com/120x120/4299e1/ffffff?text=VS' }}
//               style={styles.avatar}
//             />
//             <View style={[styles.onlineIndicator, { backgroundColor: isOnline ? '#48bb78' : '#f56565' }]} />
//           </View>
//           <Text style={styles.name}>Venkata Siva Rama Raju</Text>
//           <Text style={styles.role}>Full Stack Developer</Text>
//           <Text style={styles.experience}>3+ Years Experience</Text>
//         </View>

//         {/* Quick Stats */}
//         <View style={styles.statsContainer}>
//           <View style={styles.statItem}>
//             <Ionicons name="briefcase" size={20} color="#4299e1" />
//             <Text style={styles.statNumber}>24</Text>
//             <Text style={styles.statLabel}>Projects Completed</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Ionicons name="star" size={20} color="#fbbf24" />
//             <Text style={styles.statNumber}>4.8</Text>
//             <Text style={styles.statLabel}>Rating</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Ionicons name="trending-up" size={20} color="#10b981" />
//             <Text style={styles.statNumber}>92%</Text>
//             <Text style={styles.statLabel}>Success Rate</Text>
//           </View>
//         </View>

//         {/* Work Availability Toggle */}
//         <View style={styles.availabilitySection}>
//           <View style={styles.availabilityHeader}>
//             <Text style={styles.sectionTitle}>Work Availability</Text>
//             <TouchableOpacity onPress={handleWorkAvailabilityToggle}>
//               <View style={[styles.toggle, { backgroundColor: availableForWork ? '#48bb78' : '#d1d5db' }]}>
//                 <View style={[styles.toggleCircle, { 
//                   transform: [{ translateX: availableForWork ? 20 : 2 }] 
//                 }]} />
//               </View>
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.availabilityText}>
//             {availableForWork ? 'Available for new projects' : 'Currently unavailable'}
//           </Text>
//         </View>

//         {/* Contact Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Contact Information</Text>
          
//           <TouchableOpacity style={styles.infoItem} onPress={handleEmailPress}>
//             <Ionicons name="mail" size={20} color="#4299e1" />
//             <View style={styles.infoContent}>
//               <Text style={styles.infoLabel}>Email</Text>
//               <Text style={styles.infoValue}>venkata@example.com</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.infoItem} onPress={handleCallPress}>
//             <Ionicons name="call" size={20} color="#4299e1" />
//             <View style={styles.infoContent}>
//               <Text style={styles.infoLabel}>Phone</Text>
//               <Text style={styles.infoValue}>+91 9876543210</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
//           </TouchableOpacity>

//           <View style={styles.infoItem}>
//             <Ionicons name="location" size={20} color="#4299e1" />
//             <View style={styles.infoContent}>
//               <Text style={styles.infoLabel}>Location</Text>
//               <Text style={styles.infoValue}>Rajam, Andhra Pradesh</Text>
//             </View>
//           </View>
//         </View>

//         {/* Skills Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Skills & Expertise</Text>
//           <View style={styles.skillsContainer}>
//             {['React Native', 'JavaScript', 'Node.js', 'MongoDB', 'Firebase', 'Express.js'].map((skill, index) => (
//               <View key={index} style={styles.skillTag}>
//                 <Text style={styles.skillText}>{skill}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Work Preferences */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Work Preferences</Text>
//           <View style={styles.preferencesContainer}>
//             <View style={styles.preferenceItem}>
//               <Ionicons name="time" size={18} color="#6b7280" />
//               <Text style={styles.preferenceLabel}>Work Type</Text>
//               <Text style={styles.preferenceValue}>Full-time / Contract</Text>
//             </View>
//             <View style={styles.preferenceItem}>
//               <Ionicons name="cash" size={18} color="#6b7280" />
//               <Text style={styles.preferenceLabel}>Hourly Rate</Text>
//               <Text style={styles.preferenceValue}>₹2000 - ₹3000</Text>
//             </View>
//             <View style={styles.preferenceItem}>
//               <Ionicons name="calendar" size={18} color="#6b7280" />
//               <Text style={styles.preferenceLabel}>Availability</Text>
//               <Text style={styles.preferenceValue}>Monday - Saturday</Text>
//             </View>
//           </View>
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
//             <Ionicons name="create" size={20} color="#ffffff" />
//             <Text style={styles.buttonText}>Edit Profile</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//             <Ionicons name="log-out" size={20} color="#ffffff" />
//             <Text style={styles.buttonText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f7fafc',
//   },
//   header: {
//     backgroundColor: '#1a365d',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   headerTitle: {
//     color: '#ffffff',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   statusIndicator: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//   },
//   statusText: {
//     color: '#ffffff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   profileSection: {
//     alignItems: 'center',
//     paddingVertical: 30,
//     backgroundColor: '#ffffff',
//     marginBottom: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginBottom: 15,
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 4,
//     borderColor: '#4299e1',
//   },
//   onlineIndicator: {
//     position: 'absolute',
//     bottom: 8,
//     right: 8,
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 3,
//     borderColor: '#ffffff',
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2d3748',
//     marginBottom: 5,
//   },
//   role: {
//     fontSize: 16,
//     color: '#4299e1',
//     fontWeight: '600',
//     marginBottom: 5,
//   },
//   experience: {
//     fontSize: 14,
//     color: '#718096',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#ffffff',
//     marginBottom: 16,
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     justifyContent: 'space-around',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2d3748',
//     marginTop: 5,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#718096',
//     marginTop: 5,
//     textAlign: 'center',
//   },
//   availabilitySection: {
//     backgroundColor: '#ffffff',
//     marginBottom: 16,
//     padding: 20,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   availabilityHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   toggle: {
//     width: 44,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: 'center',
//     paddingHorizontal: 2,
//   },
//   toggleCircle: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: '#ffffff',
//   },
//   availabilityText: {
//     fontSize: 14,
//     color: '#718096',
//   },
//   section: {
//     backgroundColor: '#ffffff',
//     marginBottom: 16,
//     padding: 20,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2d3748',
//     marginBottom: 15,
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e2e8f0',
//   },
//   infoContent: {
//     marginLeft: 15,
//     flex: 1,
//   },
//   infoLabel: {
//     fontSize: 12,
//     color: '#718096',
//     marginBottom: 2,
//   },
//   infoValue: {
//     fontSize: 16,
//     color: '#2d3748',
//     fontWeight: '500',
//   },
//   skillsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   skillTag: {
//     backgroundColor: '#ebf8ff',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15,
//     marginRight: 8,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#bee3f8',
//   },
//   skillText: {
//     color: '#2b6cb0',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   preferencesContainer: {
//     backgroundColor: '#f7fafc',
//     borderRadius: 10,
//     padding: 15,
//   },
//   preferenceItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   preferenceLabel: {
//     fontSize: 14,
//     color: '#718096',
//     marginLeft: 10,
//     flex: 1,
//   },
//   preferenceValue: {
//     fontSize: 14,
//     color: '#2d3748',
//     fontWeight: '500',
//   },
//   buttonContainer: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   editButton: {
//     backgroundColor: '#4299e1',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 15,
//     borderRadius: 12,
//     marginBottom: 15,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   logoutButton: {
//     backgroundColor: '#e53e3e',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 15,
//     borderRadius: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
// });

// export default ProfileScreen;
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [availableForWork, setAvailableForWork] = useState(true);
  const [notifications, setNotifications] = useState(2);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Logged out', 'You have been logged out successfully');
            // Add logout logic here
          }
        }
      ]
    );
  };

  const handleStatusToggle = () => {
    setIsOnline(!isOnline);
  };

  const handleWorkAvailabilityToggle = () => {
    setAvailableForWork(!availableForWork);
  };

  const handleCallPress = () => {
    Alert.alert('Call', 'Calling +91 9876543210...');
  };

  const handleEmailPress = () => {
    Alert.alert('Email', 'Opening email client...');
  };

  const handleNotificationPress = () => {
    setNotifications(0);
    navigation.navigate('Notifications');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleMyApplications = () => {
    navigation.navigate('MyApplications');
  };

  const handleSavedJobs = () => {
    navigation.navigate('SavedJobs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header matching HomeScreen */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={styles.brandTitle}>My Profile</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <Ionicons name="notifications" size={24} color="#374151" />
            {notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/120x120/4299e1/ffffff?text=VS' }}
              style={styles.avatar}
            />
            <View style={[styles.onlineIndicator, { backgroundColor: isOnline ? '#10B981' : '#EF4444' }]} />
          </View>
          <Text style={styles.name}>Venkata Siva Rama Raju</Text>
          <Text style={styles.role}>Full Stack Developer</Text>
          <Text style={styles.experience}>3+ Years Experience</Text>
        </View>

        {/* Quick Stats matching HomeScreen */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="briefcase" size={18} color="#10B981" />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={18} color="#F59E0B" />
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={18} color="#3B82F6" />
            <Text style={styles.statNumber}>92%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>

        {/* Work Availability Toggle */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleMain}>Work Availability</Text>
            <TouchableOpacity onPress={handleWorkAvailabilityToggle}>
              <View style={[styles.toggle, { backgroundColor: availableForWork ? '#10B981' : '#d1d5db' }]}>
                <View style={[styles.toggleCircle, { 
                  transform: [{ translateX: availableForWork ? 20 : 2 }] 
                }]} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.availabilityText}>
            {availableForWork ? 'Available for new projects' : 'Currently unavailable'}
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleMain}>Contact Information</Text>
          
          <TouchableOpacity style={styles.infoCard} onPress={handleEmailPress}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail" size={20} color="#4F46E5" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>venkata@example.com</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoCard} onPress={handleCallPress}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call" size={20} color="#4F46E5" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>+91 9876543210</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="location" size={20} color="#4F46E5" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>Rajam, Andhra Pradesh</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleMain}>Skills & Expertise</Text>
          <View style={styles.skillsContainer}>
            {['React Native', 'JavaScript', 'Node.js', 'MongoDB', 'Firebase', 'Express.js'].map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Work Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleMain}>Work Preferences</Text>
          <View style={styles.preferencesContainer}>
            <View style={styles.preferenceItem}>
              <Ionicons name="time" size={18} color="#6B7280" />
              <Text style={styles.preferenceLabel}>Work Type</Text>
              <Text style={styles.preferenceValue}>Full-time / Contract</Text>
            </View>
            <View style={styles.preferenceItem}>
              <Ionicons name="cash" size={18} color="#6B7280" />
              <Text style={styles.preferenceLabel}>Hourly Rate</Text>
              <Text style={styles.preferenceValue}>₹2000 - ₹3000</Text>
            </View>
            <View style={styles.preferenceItem}>
              <Ionicons name="calendar" size={18} color="#6B7280" />
              <Text style={styles.preferenceLabel}>Availability</Text>
              <Text style={styles.preferenceValue}>Monday - Saturday</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleMain}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={handleMyApplications}>
            <View style={styles.actionHeader}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="document-text" size={20} color="#4F46E5" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>My Applications</Text>
                <Text style={styles.actionSubtitle}>View your job applications</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleSavedJobs}>
            <View style={styles.actionHeader}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="bookmark" size={20} color="#4F46E5" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Saved Jobs</Text>
                <Text style={styles.actionSubtitle}>Jobs you bookmarked</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleSettings}>
            <View style={styles.actionHeader}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="settings" size={20} color="#4F46E5" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Settings</Text>
                <Text style={styles.actionSubtitle}>App preferences</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="create" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Logout</Text>
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
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
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
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 30,
    borderRadius: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#4F46E5',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600',
    marginBottom: 5,
  },
  experience: {
    fontSize: 14,
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
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitleMain: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  availabilityText: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D1E7FF',
  },
  skillText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '600',
  },
  preferencesContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 10,
    flex: 1,
  },
  preferenceValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  editButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;
