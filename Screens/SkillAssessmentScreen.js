import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';

const SkillAssessmentScreen = ({ navigation }) => {
  const [showTestRegistration, setShowTestRegistration] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const technicalCategories = [
    { name: 'Electrician', icon: 'flash', color: '#EF4444' },
    { name: 'Plumber', icon: 'water', color: '#3B82F6' },
    { name: 'Carpenter', icon: 'construct', color: '#8B5CF6' },
    { name: 'Painter', icon: 'color-palette', color: '#F59E0B' },
    { name: 'Mechanic', icon: 'car-sport', color: '#06B6D4' },
    { name: 'Data Entry', icon: 'laptop', color: '#10B981' },
  ];

  useEffect(() => {
    // Show category selection modal directly when screen loads
    setShowTestRegistration(true);
  }, []);


  const handleCategorySelection = async (category) => {
    setSelectedCategory(category);
    
    // Check eligibility using backend API (5-day restriction after first attempt)
    try {
      console.log('🔍 Checking quiz eligibility for category:', category?.name || 'general');
      
      // Build URL with category query parameter
      const url = category?.name 
        ? `/api/quiz/can-attempt?category=${encodeURIComponent(category.name)}`
        : '/api/quiz/can-attempt';
      
      const response = await api.get(url, { auth: true });
      console.log('✅ Eligibility response:', response);
      
      if (!response.canAttempt) {
        // User cannot attempt quiz yet (5-day restriction)
        Alert.alert(
          'Quiz Available Soon',
          `${response.message}\n\nYou must wait ${response.daysRemaining} ${response.daysRemaining === 1 ? 'day' : 'days'} between quiz attempts to ensure proper skill development.`,
          [
            { 
              text: 'OK', 
              onPress: () => {
                setShowTestRegistration(false);
                navigation.goBack();
              }
            }
          ]
        );
        return;
      }
      
      // User can attempt quiz (either first time or 5+ days since last attempt)
      console.log(`✅ Proceeding to quiz: ${response.isFirstAttempt ? 'First attempt' : 'Retake allowed'}`);
      navigation.navigate('QuizScreen', { category });
      setShowTestRegistration(false);
    } catch (error) {
      console.error('❌ Error checking quiz eligibility:', error);
      // On error, allow quiz (fail open)
      navigation.navigate('QuizScreen', { category });
      setShowTestRegistration(false);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Test Registration Modal */}
      <Modal
        visible={showTestRegistration}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Skill Assessment</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Select Your Technical Category</Text>
              <View style={styles.categoryGrid}>
                {technicalCategories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryOption,
                      selectedCategory?.name === category.name && styles.selectedCategory,
                      { borderColor: category.color }
                    ]}
                    onPress={() => handleCategorySelection(category)}
                  >
                    <Ionicons name={category.icon} size={24} color={category.color} />
                    <Text style={styles.categoryOptionText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {selectedCategory && (
              <View style={styles.modalSection}>
                <View style={styles.quizInfoCard}>
                  <Ionicons name="bulb-outline" size={32} color="#4F46E5" />
                  <Text style={styles.quizInfoTitle}>AI-Generated Skill Quiz</Text>
                  <Text style={styles.quizInfoText}>
                    You'll take a {selectedCategory.name} skill assessment with AI-generated questions.
                  </Text>
                  <Text style={styles.quizInfoText}>
                    • 5 questions{'\n'}
                    • 10 minutes time limit{'\n'}
                    • 60% required to pass{'\n'}
                    • Pass = Technical + Daily jobs{'\n'}
                    • Fail = Daily jobs only
                  </Text>
                  <TouchableOpacity 
                    style={styles.startQuizButton}
                    onPress={() => handleCategorySelection(selectedCategory)}
                  >
                    <Text style={styles.startQuizButtonText}>Start Quiz</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
                  <Text style={styles.skipButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedLevelCard: {
    borderColor: '#4F46E5',
    backgroundColor: '#F8FAFF',
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  levelSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  levelDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  jobsPreview: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  jobsPreviewTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  jobsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  jobTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jobTagText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalSection: {
    marginTop: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalSectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#F8FAFF',
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
  quizInfoCard: {
    backgroundColor: '#F8FAFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4F46E5',
    marginBottom: 20,
  },
  quizInfoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  quizInfoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  startQuizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  startQuizButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  skipButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  navigationHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default SkillAssessmentScreen; 