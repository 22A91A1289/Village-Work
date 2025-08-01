import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const WorkerExperienceSelection = ({ navigation }) => {
  const handleExperienceSelection = async (experience) => {
    try {
      await AsyncStorage.setItem('userExperience', experience);
      await AsyncStorage.setItem('userSkillLevel', 'new');
      await AsyncStorage.setItem('skillAssessmentCompleted', 'pending');
      
      // Navigate directly to worker home
      navigation.replace('WorkerTabNavigator');
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Back Navigation Header */}
      <View style={styles.navigationHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Experience Level</Text>
        <Text style={styles.subtitle}>
          This helps us match you with the right opportunities
        </Text>
      </View>

      <View style={styles.experienceContainer}>
        <TouchableOpacity
          style={[styles.experienceCard, { backgroundColor: '#4F46E5' }]}
          onPress={() => handleExperienceSelection('new')}
        >
          <View style={[styles.experienceIcon, { backgroundColor: '#FFFFFF' }]}>
            <Ionicons name="school" size={30} color="#4F46E5" />
          </View>
          <View style={styles.experienceContent}>
            <Text style={styles.experienceTitle}>New Worker</Text>
            <Text style={styles.experienceDescription}>
              I'm new to this field and looking to learn
            </Text>
            <View style={styles.experienceFeatures}>
              <Text style={styles.featureText}>• Basic helper positions</Text>
              <Text style={styles.featureText}>• Training opportunities</Text>
              <Text style={styles.featureText}>• Learn from experienced workers</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.experienceCard, { backgroundColor: '#10B981' }]}
          onPress={() => handleExperienceSelection('experienced')}
        >
          <View style={[styles.experienceIcon, { backgroundColor: '#FFFFFF' }]}>
            <Ionicons name="construct" size={30} color="#10B981" />
          </View>
          <View style={styles.experienceContent}>
            <Text style={styles.experienceTitle}>Experienced Worker</Text>
            <Text style={styles.experienceDescription}>
              I have skills and experience in this field
            </Text>
            <View style={styles.experienceFeatures}>
              <Text style={styles.featureText}>• Skilled worker positions</Text>
              <Text style={styles.featureText}>• Higher pay opportunities</Text>
              <Text style={styles.featureText}>• Lead and train others</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your experience level helps employers find the right match
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navigationHeader: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  experienceContainer: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 20,
  },
  experienceCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  experienceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  experienceContent: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  experienceDescription: {
    fontSize: 14,
    color: '#E5E7EB',
    marginBottom: 10,
    lineHeight: 20,
  },
  experienceFeatures: {
    gap: 3,
  },
  featureText: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default WorkerExperienceSelection; 