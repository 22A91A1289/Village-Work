import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CreateJobScreen = ({ navigation }) => {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    category: 'daily',
    experienceLevel: 'helper',
    location: '',
    salary: '',
    duration: '',
    trainingProvided: false,
    requirements: '',
  });

  const categories = [
    { value: 'daily', label: 'Daily Work', icon: 'calendar' },
    { value: 'technical', label: 'Technical', icon: 'settings' },
  ];

  const experienceLevels = [
    { value: 'helper', label: 'Helper (New/Learning)', icon: 'hammer', color: '#10B981' },
    { value: 'worker', label: 'Worker (Experienced)', icon: 'build', color: '#3B82F6' },
  ];

  const handleCreateJob = () => {
    // Validate form
    if (!jobData.title || !jobData.location || !jobData.salary) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Here you would typically save to your backend/database
    console.log('Creating job:', jobData);
    
    Alert.alert(
      'Success',
      'Job posted successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const renderCategorySelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.label}>Job Category *</Text>
      <View style={styles.optionRow}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.optionButton,
              jobData.category === category.value && styles.selectedOption
            ]}
            onPress={() => setJobData({ ...jobData, category: category.value })}
          >
            <Ionicons
              name={category.icon}
              size={20}
              color={jobData.category === category.value ? '#FFFFFF' : '#6B7280'}
            />
            <Text style={[
              styles.optionText,
              jobData.category === category.value && styles.selectedOptionText
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderExperienceSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.label}>Experience Level *</Text>
      <View style={styles.optionColumn}>
        {experienceLevels.map((level) => (
          <TouchableOpacity
            key={level.value}
            style={[
              styles.experienceOption,
              jobData.experienceLevel === level.value && {
                borderColor: level.color,
                backgroundColor: `${level.color}10`
              }
            ]}
            onPress={() => setJobData({ ...jobData, experienceLevel: level.value })}
          >
            <View style={styles.experienceLeft}>
              <View style={[styles.experienceIcon, { backgroundColor: level.color }]}>
                <Ionicons name={level.icon} size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.experienceLabel}>{level.label}</Text>
            </View>
            
            <View style={[
              styles.radioButton,
              jobData.experienceLevel === level.value && {
                backgroundColor: level.color,
                borderColor: level.color
              }
            ]}>
              {jobData.experienceLevel === level.value && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Back Navigation Header */}
      <View style={styles.navigationHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create New Job</Text>
          <Text style={styles.headerSubtitle}>
            Post a job based on your specific requirements and experience needs
          </Text>
        </View>

        <View style={styles.form}>
          {/* Job Title */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Job Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Construction Helper Needed"
              value={jobData.title}
              onChangeText={(text) => setJobData({ ...jobData, title: text })}
            />
          </View>

          {/* Category Selector */}
          {renderCategorySelector()}

          {/* Experience Level Selector */}
          {renderExperienceSelector()}

          {/* Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mumbai, Maharashtra"
              value={jobData.location}
              onChangeText={(text) => setJobData({ ...jobData, location: text })}
            />
          </View>

          {/* Salary */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Daily Salary (₹) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 800"
              value={jobData.salary}
              onChangeText={(text) => setJobData({ ...jobData, salary: text })}
              keyboardType="numeric"
            />
          </View>

          {/* Duration */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Duration</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 15 days, 2 months"
              value={jobData.duration}
              onChangeText={(text) => setJobData({ ...jobData, duration: text })}
            />
          </View>

          {/* Training Provided */}
          <View style={styles.switchContainer}>
            <View style={styles.switchLeft}>
              <Text style={styles.switchLabel}>Training Provided</Text>
              <Text style={styles.switchSubtext}>
                Will you provide training for new workers?
              </Text>
            </View>
            <Switch
              value={jobData.trainingProvided}
              onValueChange={(value) => setJobData({ ...jobData, trainingProvided: value })}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Job Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the job responsibilities, requirements, and working conditions..."
              value={jobData.description}
              onChangeText={(text) => setJobData({ ...jobData, description: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Requirements */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Requirements</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="List any specific requirements, skills, or tools needed..."
              value={jobData.requirements}
              onChangeText={(text) => setJobData({ ...jobData, requirements: text })}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateJob}>
          <Text style={styles.createButtonText}>Post Job</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 20, // Increased top padding to avoid collision with header
  },
  navigationHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectorContainer: {
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionColumn: {
    gap: 12,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedOption: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  experienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
  },
  experienceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  experienceIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  experienceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  switchLeft: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  switchSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  createButton: {
    backgroundColor: '#4F46E5',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateJobScreen;
