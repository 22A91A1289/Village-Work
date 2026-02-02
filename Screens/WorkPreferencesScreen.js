import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';

const WorkPreferencesScreen = ({ navigation, route }) => {
  const isFromSignup = route?.params?.fromSignup || false;
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedWorkType, setSelectedWorkType] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const workCategories = [
    { id: 'electrician', name: 'Electrician', icon: 'flash' },
    { id: 'plumber', name: 'Plumber', icon: 'water' },
    { id: 'carpenter', name: 'Carpenter', icon: 'construct' },
    { id: 'painter', name: 'Painter', icon: 'color-palette' },
    { id: 'mechanic', name: 'Mechanic', icon: 'settings' },
    { id: 'dataEntry', name: 'Data Entry', icon: 'laptop' },
  ];

  const workTypes = [
    { id: 'fullTime', name: 'Full Time', icon: 'briefcase' },
    { id: 'partTime', name: 'Part Time', icon: 'time' },
    { id: 'contract', name: 'Contract', icon: 'document-text' },
    { id: 'freelance', name: 'Freelance', icon: 'rocket' },
  ];

  const availabilityOptions = [
    { id: 'immediate', name: 'Immediate', subtitle: 'Can start now' },
    { id: 'within1week', name: 'Within 1 Week', subtitle: 'Ready in a week' },
    { id: 'within2weeks', name: 'Within 2 Weeks', subtitle: 'Ready in 2 weeks' },
    { id: 'within1month', name: 'Within 1 Month', subtitle: 'Ready in a month' },
  ];

  const experienceLevels = [
    { id: 'new', name: 'New Worker', subtitle: '0-1 years', icon: 'leaf' },
    { id: 'intermediate', name: 'Intermediate', subtitle: '1-3 years', icon: 'trophy' },
    { id: 'experienced', name: 'Experienced', subtitle: '3-5 years', icon: 'star' },
    { id: 'expert', name: 'Expert', subtitle: '5+ years', icon: 'medal' },
  ];

  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      if (selectedCategories.length >= 5) {
        Alert.alert('Limit Reached', 'You can select up to 5 categories');
        return;
      }
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const toggleWorkType = (typeId) => {
    if (selectedWorkType.includes(typeId)) {
      setSelectedWorkType(selectedWorkType.filter(id => id !== typeId));
    } else {
      setSelectedWorkType([...selectedWorkType, typeId]);
    }
  };

  const handleSavePreferences = async () => {
    // Validation
    if (selectedCategories.length === 0) {
      Alert.alert('Required', 'Please select at least one work category');
      return;
    }

    if (selectedWorkType.length === 0) {
      Alert.alert('Required', 'Please select at least one work type');
      return;
    }

    if (!selectedAvailability) {
      Alert.alert('Required', 'Please select your availability');
      return;
    }

    if (!selectedExperience) {
      Alert.alert('Required', 'Please select your experience level');
      return;
    }

    setIsLoading(true);

    try {
      // Save preferences to backend
      const preferences = {
        workCategories: selectedCategories,
        workTypes: selectedWorkType,
        availability: selectedAvailability,
        experienceLevel: selectedExperience,
      };

      await api.put('/api/users/work-preferences', preferences, { auth: true });

      // Save to AsyncStorage
      await AsyncStorage.setItem('workPreferences', JSON.stringify(preferences));
      await AsyncStorage.setItem('workPreferencesCompleted', 'true');
      await AsyncStorage.setItem('userSkillLevel', selectedExperience);

      Alert.alert(
        '✓ Success',
        'Your work preferences have been saved!',
        [
          {
            text: 'OK',
            onPress: () => {
              if (isFromSignup) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'WorkerTabNavigator' }],
                });
              } else {
                navigation.goBack();
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Setup?',
      'You can set your work preferences later from your profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: async () => {
            await AsyncStorage.setItem('workPreferencesCompleted', 'skipped');
            navigation.reset({
              index: 0,
              routes: [{ name: 'WorkerTabNavigator' }],
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        {!isFromSignup && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Work Preferences</Text>
          <Text style={styles.headerSubtitle}>Help us find the perfect jobs for you</Text>
        </View>
        {isFromSignup && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Work Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase-outline" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Work Categories</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Select up to 5 categories (Required)</Text>
          
          <View style={styles.grid}>
            {workCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.gridItem,
                  selectedCategories.includes(category.id) && styles.gridItemSelected,
                ]}
                onPress={() => toggleCategory(category.id)}
              >
                <Ionicons
                  name={category.icon}
                  size={28}
                  color={selectedCategories.includes(category.id) ? '#4F46E5' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.gridItemText,
                    selectedCategories.includes(category.id) && styles.gridItemTextSelected,
                  ]}
                >
                  {category.name}
                </Text>
                {selectedCategories.includes(category.id) && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Work Type */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Work Type</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Select all that apply (Required)</Text>
          
          <View style={styles.optionList}>
            {workTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.optionItem,
                  selectedWorkType.includes(type.id) && styles.optionItemSelected,
                ]}
                onPress={() => toggleWorkType(type.id)}
              >
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.optionIcon,
                      selectedWorkType.includes(type.id) && styles.optionIconSelected,
                    ]}
                  >
                    <Ionicons
                      name={type.icon}
                      size={22}
                      color={selectedWorkType.includes(type.id) ? '#4F46E5' : '#6B7280'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      selectedWorkType.includes(type.id) && styles.optionTextSelected,
                    ]}
                  >
                    {type.name}
                  </Text>
                </View>
                {selectedWorkType.includes(type.id) && (
                  <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Availability</Text>
          </View>
          <Text style={styles.sectionSubtitle}>When can you start? (Required)</Text>
          
          <View style={styles.optionList}>
            {availabilityOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionItem,
                  selectedAvailability === option.id && styles.optionItemSelected,
                ]}
                onPress={() => setSelectedAvailability(option.id)}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionText,
                      selectedAvailability === option.id && styles.optionTextSelected,
                    ]}
                  >
                    {option.name}
                  </Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
                {selectedAvailability === option.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Experience Level */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy-outline" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Experience Level</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Select your experience level (Required)</Text>
          
          <View style={styles.optionList}>
            {experienceLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.optionItem,
                  selectedExperience === level.id && styles.optionItemSelected,
                ]}
                onPress={() => setSelectedExperience(level.id)}
              >
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.optionIcon,
                      selectedExperience === level.id && styles.optionIconSelected,
                    ]}
                  >
                    <Ionicons
                      name={level.icon}
                      size={22}
                      color={selectedExperience === level.id ? '#4F46E5' : '#6B7280'}
                    />
                  </View>
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionText,
                        selectedExperience === level.id && styles.optionTextSelected,
                      ]}
                    >
                      {level.name}
                    </Text>
                    <Text style={styles.optionSubtitle}>{level.subtitle}</Text>
                  </View>
                </View>
                {selectedExperience === level.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSavePreferences}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </Text>
            {!isLoading && <Ionicons name="checkmark" size={20} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  gridItem: {
    width: '31%',
    aspectRatio: 1,
    margin: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gridItemSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  gridItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
  gridItemTextSelected: {
    color: '#4F46E5',
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionItemSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionIconSelected: {
    backgroundColor: '#EEF2FF',
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  optionTextSelected: {
    color: '#4F46E5',
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default WorkPreferencesScreen;
