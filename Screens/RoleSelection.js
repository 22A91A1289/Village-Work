
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const RoleSelection = ({ navigation }) => {
  const handleRoleSelection = async (role) => {
    try {
      await AsyncStorage.setItem('userRole', role);
      
      if (role === 'worker') {
        // For workers, start with mobile OTP verification
        await AsyncStorage.setItem('userSkillLevel', 'new'); // Set default skill level
        await AsyncStorage.setItem('skillAssessmentCompleted', 'skipped'); // Set default test status
        navigation.navigate('MobileOTPScreen');
      } else if (role === 'owner' || role === 'recruiter') {
        // For owners/recruiters, go directly to login
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      console.error('Error saving role:', error);
      Alert.alert('Error', 'Failed to save role selection. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.title}>WORKNEX</Text>
        <Text style={styles.subtitle}>
          STUDENT EMPLOYMENT PLATFORM
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    flexShrink: 1,
    minWidth: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
    flexWrap: 'wrap',
    minWidth: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    flexWrap: 'wrap',
    minWidth: 0,
  },
  roleContainer: {
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
