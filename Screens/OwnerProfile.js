// // import React, { useState } from 'react';
// // import {
// //   ScrollView,
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   Alert,
// //   TextInput,
// //   Modal,
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';

// // const OwnerProfileScreen = ({ navigation }) => {
// //   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
// //   const [profileData, setProfileData] = useState({
// //     name: 'Rajesh Kumar',
// //     email: 'rajesh.kumar@gmail.com',
// //     phone: '+91 9876543210',
// //     location: 'Srikakulam, Andhra Pradesh',
// //     businessName: 'Kumar Enterprises',
// //     businessType: 'Agriculture & Construction',
// //     experience: '5 years',
// //     bio: 'Experienced contractor providing quality work opportunities in agriculture and construction sectors.',
// //   });

// //   const [tempProfileData, setTempProfileData] = useState(profileData);

// //   const profileStats = [
// //     { icon: 'briefcase', label: 'Jobs Posted', value: '24', color: '#10B981' },
// //     { icon: 'people', label: 'Workers Hired', value: '156', color: '#3B82F6' },
// //     { icon: 'star', label: 'Rating', value: '4.8', color: '#F59E0B' },
// //     { icon: 'time', label: 'Response Time', value: '< 2hrs', color: '#8B5CF6' },
// //   ];

// //   const menuItems = [
// //     { icon: 'briefcase-outline', title: 'My Job Postings', subtitle: 'View and manage your jobs', screen: 'MyJobs' },
// //     { icon: 'people-outline', title: 'Hired Workers', subtitle: "View workers you've hired", screen: 'HiredWorkers' },
// //     { icon: 'card-outline', title: 'Payment & Billing', subtitle: 'Manage payments and invoices', screen: 'Payment' },
// //     { icon: 'bar-chart-outline', title: 'Analytics', subtitle: 'Job performance insights', screen: 'Analytics' },
// //     { icon: 'settings-outline', title: 'Settings', subtitle: 'App preferences and privacy', screen: 'Settings' },
// //     { icon: 'help-circle-outline', title: 'Help & Support', subtitle: 'Get help and contact support', screen: 'Support' },
// //   ];

// //   const handleSaveProfile = () => {
// //     setProfileData(tempProfileData);
// //     setIsEditModalVisible(false);
// //     Alert.alert('Success', 'Profile updated successfully!');
// //   };

// //   const handleLogout = () => {
// //     Alert.alert('Logout', 'Are you sure you want to logout?', [
// //       { text: 'Cancel', style: 'cancel' },
// //       {
// //         text: 'Logout',
// //         style: 'destructive',
// //         onPress: () => {
// //           Alert.alert('Logged Out', 'You have been logged out successfully');
// //         },
// //       },
// //     ]);
// //   };

// //   return (
// //     <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
// //       <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

// //       <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
// //         <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
// //           <Ionicons name="arrow-back" size={24} color="#1F2937" />
// //         </TouchableOpacity>
// //         <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', flex: 1 }}>Profile</Text>
// //         <TouchableOpacity onPress={() => setIsEditModalVisible(true)} style={{ backgroundColor: '#4F46E5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}>
// //           <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Edit</Text>
// //         </TouchableOpacity>
// //       </View>

// //       <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
// //         <View style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
// //           <View style={{ alignItems: 'center', marginBottom: 16 }}>
// //             <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
// //               <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff' }}>{profileData.name.charAt(0)}</Text>
// //             </View>
// //             <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 }}>{profileData.name}</Text>
// //             <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 8 }}>{profileData.businessName}</Text>
// //             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
// //               <Ionicons name="location-outline" size={16} color="#6B7280" />
// //               <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 4 }}>{profileData.location}</Text>
// //             </View>
// //           </View>
// //           <Text style={{ fontSize: 14, color: '#4B5563', textAlign: 'center', lineHeight: 20 }}>{profileData.bio}</Text>
// //         </View>

// //         <View style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
// //           <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
// //             {profileStats.map((stat, index) => (
// //               <View key={index} style={{ alignItems: 'center' }}>
// //                 <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: `${stat.color}15`, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
// //                   <Ionicons name={stat.icon} size={24} color={stat.color} />
// //                 </View>
// //                 <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 }}>{stat.value}</Text>
// //                 <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center' }}>{stat.label}</Text>
// //               </View>
// //             ))}
// //           </View>
// //         </View>

// //         <View style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
// //           <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 16 }}>Contact Information</Text>
// //           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
// //             <Ionicons name="mail-outline" size={20} color="#6B7280" />
// //             <Text style={{ fontSize: 14, color: '#4B5563', marginLeft: 12 }}>{profileData.email}</Text>
// //           </View>
// //           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
// //             <Ionicons name="call-outline" size={20} color="#6B7280" />
// //             <Text style={{ fontSize: 14, color: '#4B5563', marginLeft: 12 }}>{profileData.phone}</Text>
// //           </View>
// //           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
// //             <Ionicons name="business-outline" size={20} color="#6B7280" />
// //             <Text style={{ fontSize: 14, color: '#4B5563', marginLeft: 12 }}>{profileData.businessType} • {profileData.experience}</Text>
// //           </View>
// //         </View>

// //         <View style={{ backgroundColor: '#fff', marginTop: 8 }}>
// //           {menuItems.map((item, index) => (
// //             <TouchableOpacity
// //               key={index}
// //               onPress={() => navigation.navigate(item.screen)}
// //               style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: index < menuItems.length - 1 ? 1 : 0, borderBottomColor: '#F3F4F6' }}
// //             >
// //               <Ionicons name={item.icon} size={24} color="#6B7280" />
// //               <View style={{ flex: 1, marginLeft: 12 }}>
// //                 <Text style={{ fontSize: 16, fontWeight: '500', color: '#1F2937' }}>{item.title}</Text>
// //                 <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>{item.subtitle}</Text>
// //               </View>
// //               <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
// //             </TouchableOpacity>
// //           ))}
// //         </View>

// //         <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: '#fff', marginTop: 8, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
// //           <Ionicons name="log-out-outline" size={24} color="#EF4444" />
// //           <Text style={{ fontSize: 16, fontWeight: '500', color: '#EF4444', marginLeft: 8 }}>Logout</Text>
// //         </TouchableOpacity>
// //       </ScrollView>

// //       {/* Modal Component here (reuse previous modal code if needed) */}
// //     </SafeAreaView>
// //   );
// // };

// // export default OwnerProfileScreen;

// import React, { useState } from 'react';
// import {
//   ScrollView,
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Alert,
//   TextInput,
//   Modal,
//   StyleSheet,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const OwnerProfileScreen = ({ navigation }) => {
//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [profileData, setProfileData] = useState({
//     name: 'Rajesh Kumar',
//     email: 'rajesh.kumar@gmail.com',
//     phone: '+91 9876543210',
//     location: 'Srikakulam, Andhra Pradesh',
//     businessName: 'Kumar Enterprises',
//     businessType: 'Agriculture & Construction',
//     experience: '5 years',
//     bio: 'Experienced contractor providing quality work opportunities in agriculture and construction sectors.',
//   });

//   const [tempProfileData, setTempProfileData] = useState(profileData);

//   const profileStats = [
//     { icon: 'briefcase', label: 'Active Jobs', value: '24', color: '#10B981', description: 'Currently posted' },
//     { icon: 'people', label: 'Total Hires', value: '156', color: '#3B82F6', description: 'Workers hired' },
//     { icon: 'star', label: 'Rating', value: '4.8', color: '#F59E0B', description: 'Out of 5.0' },
//     { icon: 'time', label: 'Response', value: '< 2hrs', color: '#8B5CF6', description: 'Average time' },
//   ];

//   const menuItems = [
//     { 
//       icon: 'briefcase-outline', 
//       title: 'Job Management', 
//       subtitle: 'Create, edit, and track your job postings', 
//       screen: 'MyJobs',
//       badge: '3 Active'
//     },
//     { 
//       icon: 'people-outline', 
//       title: 'Worker History', 
//       subtitle: 'View past hires and their performance', 
//       screen: 'HiredWorkers' 
//     },
//     { 
//       icon: 'card-outline', 
//       title: 'Payments', 
//       subtitle: 'Billing history and payment methods', 
//       screen: 'Payment',
//       badge: 'Due: ₹2,500'
//     },
//     { 
//       icon: 'bar-chart-outline', 
//       title: 'Business Insights', 
//       subtitle: 'Performance metrics and analytics', 
//       screen: 'Analytics' 
//     },
//     { 
//       icon: 'shield-checkmark-outline', 
//       title: 'Account Verification', 
//       subtitle: 'Verify your business documents', 
//       screen: 'Verification',
//       status: 'verified'
//     },
//     { 
//       icon: 'settings-outline', 
//       title: 'Settings', 
//       subtitle: 'Privacy, notifications, and preferences', 
//       screen: 'Settings' 
//     },
//     { 
//       icon: 'help-circle-outline', 
//       title: 'Help Center', 
//       subtitle: 'FAQs, tutorials, and customer support', 
//       screen: 'Support' 
//     },
//   ];

//   const handleSaveProfile = () => {
//     setProfileData(tempProfileData);
//     setIsEditModalVisible(false);
//     Alert.alert('✓ Success', 'Your profile has been updated successfully!');
//   };

//   const handleLogout = () => {
//     Alert.alert(
//       'Confirm Logout', 
//       'Are you sure you want to sign out of your account?', 
//       [
//         { text: 'Stay Logged In', style: 'cancel' },
//         {
//           text: 'Sign Out',
//           style: 'destructive',
//           onPress: () => {
//             // Navigate to login screen or clear user session
//             navigation.reset({
//               index: 0,
//               routes: [{ name: 'Login' }],
//             });
//           },
//         },
//       ]
//     );
//   };

//   const EditProfileModal = () => (
//     <Modal
//       visible={isEditModalVisible}
//       animationType="slide"
//       presentationStyle="pageSheet"
//     >
//       <SafeAreaView style={styles.modalContainer}>
//         <View style={styles.modalHeader}>
//           <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
//             <Text style={styles.modalCancelText}>Cancel</Text>
//           </TouchableOpacity>
//           <Text style={styles.modalTitle}>Edit Profile</Text>
//           <TouchableOpacity onPress={handleSaveProfile}>
//             <Text style={styles.modalSaveText}>Save</Text>
//           </TouchableOpacity>
//         </View>
        
//         <ScrollView style={styles.modalContent}>
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Full Name</Text>
//             <TextInput
//               style={styles.textInput}
//               value={tempProfileData.name}
//               onChangeText={(text) => setTempProfileData({...tempProfileData, name: text})}
//               placeholder="Enter your full name"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Business Name</Text>
//             <TextInput
//               style={styles.textInput}
//               value={tempProfileData.businessName}
//               onChangeText={(text) => setTempProfileData({...tempProfileData, businessName: text})}
//               placeholder="Enter business name"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Email Address</Text>
//             <TextInput
//               style={styles.textInput}
//               value={tempProfileData.email}
//               onChangeText={(text) => setTempProfileData({...tempProfileData, email: text})}
//               placeholder="Enter email address"
//               keyboardType="email-address"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Phone Number</Text>
//             <TextInput
//               style={styles.textInput}
//               value={tempProfileData.phone}
//               onChangeText={(text) => setTempProfileData({...tempProfileData, phone: text})}
//               placeholder="Enter phone number"
//               keyboardType="phone-pad"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Location</Text>
//             <TextInput
//               style={styles.textInput}
//               value={tempProfileData.location}
//               onChangeText={(text) => setTempProfileData({...tempProfileData, location: text})}
//               placeholder="City, State"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>About Your Business</Text>
//             <TextInput
//               style={[styles.textInput, styles.textArea]}
//               value={tempProfileData.bio}
//               onChangeText={(text) => setTempProfileData({...tempProfileData, bio: text})}
//               placeholder="Describe your business and services"
//               multiline={true}
//               numberOfLines={4}
//             />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </Modal>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()} 
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={24} color="#1F2937" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>My Profile</Text>
//         <TouchableOpacity 
//           onPress={() => setIsEditModalVisible(true)} 
//           style={styles.editButton}
//         >
//           <Ionicons name="create-outline" size={20} color="#FFFFFF" />
//           <Text style={styles.editButtonText}>Edit</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         {/* Profile Header */}
//         <View style={styles.profileHeader}>
//           <View style={styles.avatarContainer}>
//             <View style={styles.avatar}>
//               <Text style={styles.avatarText}>{profileData.name.charAt(0)}</Text>
//             </View>
//             <View style={styles.verificationBadge}>
//               <Ionicons name="checkmark" size={12} color="#FFFFFF" />
//             </View>
//           </View>
          
//           <View style={styles.profileInfo}>
//             <Text style={styles.profileName}>{profileData.name}</Text>
//             <Text style={styles.businessName}>{profileData.businessName}</Text>
//             <View style={styles.locationContainer}>
//               <Ionicons name="location-outline" size={16} color="#6B7280" />
//               <Text style={styles.locationText}>{profileData.location}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Bio Section */}
//         <View style={styles.bioSection}>
//           <Text style={styles.bioText}>{profileData.bio}</Text>
//         </View>

//         {/* Stats Grid */}
//         <View style={styles.statsContainer}>
//           <Text style={styles.sectionTitle}>Business Overview</Text>
//           <View style={styles.statsGrid}>
//             {profileStats.map((stat, index) => (
//               <View key={index} style={styles.statCard}>
//                 <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
//                   <Ionicons name={stat.icon} size={24} color={stat.color} />
//                 </View>
//                 <Text style={styles.statValue}>{stat.value}</Text>
//                 <Text style={styles.statLabel}>{stat.label}</Text>
//                 <Text style={styles.statDescription}>{stat.description}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Contact Information */}
//         <View style={styles.contactSection}>
//           <Text style={styles.sectionTitle}>Contact Details</Text>
//           <View style={styles.contactItem}>
//             <Ionicons name="mail-outline" size={20} color="#6B7280" />
//             <Text style={styles.contactText}>{profileData.email}</Text>
//           </View>
//           <View style={styles.contactItem}>
//             <Ionicons name="call-outline" size={20} color="#6B7280" />
//             <Text style={styles.contactText}>{profileData.phone}</Text>
//           </View>
//           <View style={styles.contactItem}>
//             <Ionicons name="business-outline" size={20} color="#6B7280" />
//             <Text style={styles.contactText}>{profileData.businessType} • {profileData.experience} experience</Text>
//           </View>
//         </View>

//         {/* Menu Items */}
//         <View style={styles.menuSection}>
//           <Text style={styles.sectionTitle}>Quick Actions</Text>
//           {menuItems.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               onPress={() => navigation.navigate(item.screen)}
//               style={styles.menuItem}
//             >
//               <View style={styles.menuIcon}>
//                 <Ionicons name={item.icon} size={24} color="#4F46E5" />
//               </View>
//               <View style={styles.menuContent}>
//                 <View style={styles.menuTitleRow}>
//                   <Text style={styles.menuTitle}>{item.title}</Text>
//                   {item.badge && (
//                     <View style={styles.badge}>
//                       <Text style={styles.badgeText}>{item.badge}</Text>
//                     </View>
//                   )}
//                   {item.status === 'verified' && (
//                     <Ionicons name="checkmark-circle" size={16} color="#10B981" />
//                   )}
//                 </View>
//                 <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
//               </View>
//               <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Logout Button */}
//         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//           <Ionicons name="log-out-outline" size={20} color="#EF4444" />
//           <Text style={styles.logoutText}>Sign Out</Text>
//         </TouchableOpacity>

//         <View style={styles.bottomSpacing} />
//       </ScrollView>

//       <EditProfileModal />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   editButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#4F46E5',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   editButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '500',
//     marginLeft: 4,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   profileHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FFFFFF',
//     marginTop: 8,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginRight: 16,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#4F46E5',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   avatarText: {
//     fontSize: 32,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   verificationBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: '#10B981',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   businessName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#4F46E5',
//     marginBottom: 8,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginLeft: 4,
//   },
//   bioSection: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     marginTop: 8,
//   },
//   bioText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#374151',
//   },
//   statsContainer: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     marginTop: 8,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 16,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   statCard: {
//     width: '48%',
//     backgroundColor: '#F9FAFB',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     alignItems: 'center',
//   },
//   statIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 2,
//   },
//   statDescription: {
//     fontSize: 12,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   contactSection: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     marginTop: 8,
//   },
//   contactItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   contactText: {
//     fontSize: 16,
//     color: '#374151',
//     marginLeft: 12,
//     flex: 1,
//   },
//   menuSection: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     marginTop: 8,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   menuIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#EEF2FF',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 16,
//   },
//   menuContent: {
//     flex: 1,
//   },
//   menuTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   menuTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#1F2937',
//     flex: 1,
//   },
//   menuSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     lineHeight: 20,
//   },
//   badge: {
//     backgroundColor: '#FEF3C7',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 12,
//     marginLeft: 8,
//     marginRight: 8,
//   },
//   badgeText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#92400E',
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 20,
//     marginTop: 20,
//     paddingVertical: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#FEE2E2',
//   },
//   logoutText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#EF4444',
//     marginLeft: 8,
//   },
//   bottomSpacing: {
//     height: 20,
//   },
//   // Modal Styles
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   modalCancelText: {
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   modalSaveText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#4F46E5',
//   },
//   modalContent: {
//     flex: 1,
//     padding: 20,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//     backgroundColor: '#FFFFFF',
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
// });

// export default OwnerProfileScreen;

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const OwnerProfile = () => {
  const navigation = useNavigation();

  // Sample data - replace with actual data from your state management
  const myPostedJobs = [
    {
      id: 1,
      title: 'Construction Helper Needed',
      category: 'daily',
      experienceLevel: 'helper',
      location: 'Mumbai',
      salary: 800,
      applicants: 5,
      trainingProvided: true,
    },
    {
      id: 2,
      title: 'Senior Electrician Required',
      category: 'technical',
      experienceLevel: 'worker',
      location: 'Delhi',
      salary: 1200,
      applicants: 12,
      trainingProvided: false,
    },
  ];

  const handleNavigateToApplications = () => {
    navigation.navigate('AllApplications', { jobs: myPostedJobs });
  };

  const handleNavigateToActiveJobs = () => {
    navigation.navigate('ActiveJobs', { jobs: myPostedJobs });
  };

  const handleCreateJob = () => {
    navigation.navigate('CreateJob');
  };

  const menuItems = [
    {
      id: 1,
      title: 'View All Applications',
      subtitle: 'Check applications from helpers & workers',
      icon: 'document-text',
      onPress: handleNavigateToApplications,
      badge: '23',
    },
    {
      id: 2,
      title: 'Active Jobs',
      subtitle: 'Manage your posted job listings',
      icon: 'briefcase',
      onPress: handleNavigateToActiveJobs,
      badge: myPostedJobs.length.toString(),
    },
    {
      id: 3,
      title: 'Create New Job',
      subtitle: 'Post job for helpers or experienced workers',
      icon: 'add-circle',
      onPress: handleCreateJob,
    },
    {
      id: 4,
      title: 'Worker Analytics',
      subtitle: 'View performance metrics',
      icon: 'analytics',
      onPress: () => {},
    },
    {
      id: 5,
      title: 'Settings',
      subtitle: 'Account and notification settings',
      icon: 'settings',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: 'https://via.placeholder.com/80' }}
              style={styles.profileImage}
            />
            <View style={styles.profileText}>
              <Text style={styles.ownerName}>John Doe</Text>
              <Text style={styles.ownerTitle}>Business Owner</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>4.8</Text>
                <Text style={styles.reviewCount}>(124 reviews)</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Total Jobs Posted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Applications Received</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Workers Hired</Text>
          </View>
        </View>

        {/* Experience Categories */}
        <View style={styles.categoryContainer}>
          <Text style={styles.sectionTitle}>Worker Categories</Text>
          <View style={styles.categoryRow}>
            <View style={styles.categoryCard}>
              <Ionicons name="hammer" size={24} color="#10B981" />
              <Text style={styles.categoryTitle}>Helpers</Text>
              <Text style={styles.categorySubtitle}>New/Learning</Text>
              <Text style={styles.categoryCount}>45 Available</Text>
            </View>
            <View style={styles.categoryCard}>
              <Ionicons name="build" size={24} color="#3B82F6" />
              <Text style={styles.categoryTitle}>Workers</Text>
              <Text style={styles.categorySubtitle}>Experienced</Text>
              <Text style={styles.categoryCount}>32 Available</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={24} color="#4F46E5" />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              
              <View style={styles.menuRight}>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  ownerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  ownerTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    padding: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F46E5',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OwnerProfile;
