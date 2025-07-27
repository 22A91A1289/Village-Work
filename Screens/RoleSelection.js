
// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';

// const RoleSelection = ({ navigation }) => {
//   const handleRoleSelect = async (role) => {
//     try {
//       await AsyncStorage.setItem('userRole', role);
//       if (role === 'owner') {
//         navigation.replace('Owner'); // Navigate to Owner stack
//       } else if (role === 'worker') {
//         navigation.replace('Worker'); // Navigate to Worker tabs
//       }
//     } catch (error) {
//       console.error('Error saving role:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

//       <Text style={styles.title}>Welcome to VillageWork</Text>
//       <Text style={styles.subtitle}>Select your role to continue</Text>

//       <View style={styles.rolesContainer}>
//         {/* Recruiter/Owner Role */}
//         <TouchableOpacity
//           style={[styles.roleCard, { backgroundColor: '#4F46E5' }]}
//           onPress={() => handleRoleSelect('owner')}
//         >
//           <Ionicons name="briefcase-outline" size={40} color="#fff" />
//           <Text style={styles.roleText}>Recruiter</Text>
//           <Text style={styles.roleSubText}>I want to post and manage jobs</Text>
//         </TouchableOpacity>

//         {/* Worker Role */}
//         <TouchableOpacity
//           style={[styles.roleCard, { backgroundColor: '#10B981' }]}
//           onPress={() => handleRoleSelect('worker')}
//         >
//           <Ionicons name="construct-outline" size={40} color="#fff" />
//           <Text style={styles.roleText}>Worker</Text>
//           <Text style={styles.roleSubText}>I’m looking for work opportunities</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default RoleSelection;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginBottom: 32,
//     textAlign: 'center',
//   },
//   rolesContainer: {
//     width: '100%',
//   },
//   roleCard: {
//     padding: 24,
//     borderRadius: 16,
//     alignItems: 'center',
//     marginBottom: 20,
//     elevation: 4,
//   },
//   roleText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#fff',
//     marginTop: 12,
//   },
//   roleSubText: {
//     fontSize: 14,
//     color: '#E5E7EB',
//     marginTop: 4,
//     textAlign: 'center',
//   },
// });
// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   Image,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';

// const RoleSelection = ({ navigation }) => {
//   const handleRoleSelection = async (role) => {
//     try {
//       await AsyncStorage.setItem('userRole', role);
//       navigation.replace(role === 'worker' ? 'Worker' : 'Owner');
//     } catch (error) {
//       console.error('Error saving role:', error);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Welcome to WorkConnect</Text>
//         <Text style={styles.subtitle}>
//           Connect skilled workers with job opportunities based on experience levels
//         </Text>
//       </View>

//       <View style={styles.roleContainer}>
//         <Text style={styles.roleTitle}>Choose Your Role</Text>
        
//         <TouchableOpacity
//           style={styles.roleCard}
//           onPress={() => handleRoleSelection('worker')}
//         >
//           <View style={[styles.roleIcon, { backgroundColor: '#10B981' }]}>
//             <Ionicons name="hammer" size={32} color="#FFFFFF" />
//           </View>
//           <View style={styles.roleContent}>
//             <Text style={styles.roleCardTitle}>I'm a Worker</Text>
//             <Text style={styles.roleDescription}>
//               Find work opportunities as a helper or experienced worker
//             </Text>
//             <View style={styles.roleFeatures}>
//               <Text style={styles.featureText}>• Apply for helper positions</Text>
//               <Text style={styles.featureText}>• Find experienced worker jobs</Text>
//               <Text style={styles.featureText}>• Get training opportunities</Text>
//             </View>
//           </View>
//           <Ionicons name="chevron-forward" size={24} color="#10B981" />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.roleCard}
//           onPress={() => handleRoleSelection('owner')}
//         >
//           <View style={[styles.roleIcon, { backgroundColor: '#3B82F6' }]}>
//             <Ionicons name="business" size={32} color="#FFFFFF" />
//           </View>
//           <View style={styles.roleContent}>
//             <Text style={styles.roleCardTitle}>I'm an Employer</Text>
//             <Text style={styles.roleDescription}>
//               Post jobs and hire helpers or experienced workers
//             </Text>
//             <View style={styles.roleFeatures}>
//               <Text style={styles.featureText}>• Post jobs for helpers</Text>
//               <Text style={styles.featureText}>• Hire experienced workers</Text>
//               <Text style={styles.featureText}>• Manage applications efficiently</Text>
//             </View>
//           </View>
//           <Ionicons name="chevron-forward" size={24} color="#3B82F6" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.footer}>
//         <Text style={styles.footerText}>
//           By continuing, you agree to our Terms of Service and Privacy Policy
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   header: {
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 40,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   roleContainer: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   roleTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   roleCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     padding: 24,
//     marginBottom: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   roleIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 20,
//   },
//   roleContent: {
//     flex: 1,
//   },
//   roleCardTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   roleDescription: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 12,
//     lineHeight: 20,
//   },
//   roleFeatures: {
//     gap: 4,
//   },
//   featureText: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   footer: {
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     textAlign: 'center',
//     lineHeight: 18,
//   },
// });

// export default RoleSelection;
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const RoleSelection = ({ navigation }) => {
  const handleRoleSelection = async (role) => {
    try {
      await AsyncStorage.setItem('userRole', role);
      
      if (role === 'worker') {
        // For workers, go to experience selection first
        navigation.navigate('WorkerExperienceSelection');
      } else {
        // For other roles, go directly to login
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to VillageWork</Text>
        <Text style={styles.subtitle}>
          Connect skilled workers with job opportunities based on experience levels
        </Text>
      </View>

      <View style={styles.roleContainer}>
        <Text style={styles.roleTitle}>Choose Your Role</Text>

        <TouchableOpacity
          style={[styles.roleCard, { backgroundColor: '#4F46E5' }]}
          onPress={() => handleRoleSelection('worker')}
        >
          <View style={[styles.roleIcon, { backgroundColor: '#FFFFFF' }]}>
            <Ionicons name="hammer" size={30} color="#4F46E5" />
          </View>
          <View style={styles.roleContent}>
            <Text style={styles.roleCardTitle}>I'm a Worker</Text>
            <Text style={styles.roleDescription}>
              Find work opportunities as a helper or experienced worker
            </Text>
            <View style={styles.roleFeatures}>
              <Text style={styles.featureText}>• Apply for helper positions</Text>
              <Text style={styles.featureText}>• Find experienced worker jobs</Text>
              <Text style={styles.featureText}>• Get training opportunities</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, { backgroundColor: '#10B981' }]}
          onPress={() => handleRoleSelection('owner')}
        >
          <View style={[styles.roleIcon, { backgroundColor: '#FFFFFF' }]}>
            <Ionicons name="business" size={30} color="#10B981" />
          </View>
          <View style={styles.roleContent}>
            <Text style={styles.roleCardTitle}>I'm an Employer</Text>
            <Text style={styles.roleDescription}>
              Post jobs and hire helpers or experienced workers
            </Text>
            <View style={styles.roleFeatures}>
              <Text style={styles.featureText}>• Post jobs for helpers</Text>
              <Text style={styles.featureText}>• Hire experienced workers</Text>
              <Text style={styles.featureText}>• Manage applications efficiently</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, { backgroundColor: '#F59E0B' }]}
          onPress={() => handleRoleSelection('admin')}
        >
          <View style={[styles.roleIcon, { backgroundColor: '#FFFFFF' }]}>
            <Ionicons name="shield" size={30} color="#F59E0B" />
          </View>
          <View style={styles.roleContent}>
            <Text style={styles.roleCardTitle}>I'm an Admin</Text>
            <Text style={styles.roleDescription}>
              Manage platform operations and user verification
            </Text>
            <View style={styles.roleFeatures}>
              <Text style={styles.featureText}>• Review work completions</Text>
              <Text style={styles.featureText}>• Approve skill tests</Text>
              <Text style={styles.featureText}>• Process payments</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Reset Complete', 'All data has been cleared. You can start fresh.');
            } catch (error) {
              console.error('Error clearing data:', error);
            }
          }}
        >
          <Text style={styles.resetButtonText}>Reset App Data (For Testing)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  roleContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  roleCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  roleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleContent: {
    flex: 1,
  },
  roleCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  roleDescription: {
    fontSize: 13,
    color: '#E5E7EB',
    marginBottom: 10,
    lineHeight: 18,
  },
  roleFeatures: {
    gap: 3,
  },
  featureText: {
    fontSize: 11,
    color: '#D1D5DB',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resetButtonText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default RoleSelection;
