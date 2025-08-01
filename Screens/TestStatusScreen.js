import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestStatusScreen = ({ navigation }) => {
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestData();
  }, []);

  const loadTestData = async () => {
    try {
      const selectedTester = await AsyncStorage.getItem('selectedTester');
      const selectedCategory = await AsyncStorage.getItem('selectedCategory');
      const userPhone = await AsyncStorage.getItem('userPhone');
      const testStatus = await AsyncStorage.getItem('testStatus');

      if (selectedTester) {
        setTestData({
          tester: JSON.parse(selectedTester),
          category: selectedCategory,
          phone: userPhone,
          status: testStatus || 'pending',
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading test data:', error);
      setLoading(false);
    }
  };

  const handleCancelTest = () => {
    Alert.alert(
      'Cancel Test',
      'Are you sure you want to cancel your skill test?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('testStatus', 'cancelled');
              await AsyncStorage.removeItem('selectedTester');
              await AsyncStorage.removeItem('selectedCategory');
              await AsyncStorage.removeItem('userPhone');
              
              Alert.alert(
                'Test Cancelled',
                'Your skill test has been cancelled. You can schedule a new test anytime.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                  }
                ]
              );
            } catch (error) {
              console.error('Error cancelling test:', error);
            }
          }
        }
      ]
    );
  };

  const handleRescheduleTest = () => {
            navigation.navigate('SkillAssessmentScreen');
  };

  const handleContactTester = () => {
    if (testData?.tester?.phone) {
      Alert.alert(
        'Contact Tester',
        `Call ${testData.tester.name}?\n\nPhone: ${testData.tester.phone}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Call',
            onPress: () => {
              // Here you would implement actual calling functionality
              Alert.alert('Calling...', 'This would initiate a call to the tester');
            }
          }
        ]
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={32} color="#6B7280" />
          <Text style={styles.loadingText}>Loading test status...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!testData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>No Test Found</Text>
          <Text style={styles.errorText}>
            You don't have any scheduled skill tests.
          </Text>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('SkillAssessmentScreen')}
          >
            <Text style={styles.primaryButtonText}>Schedule a Test</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Status</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[
              styles.statusIcon,
              { backgroundColor: testData.status === 'pending' ? '#FEF3C7' : '#D1FAE5' }
            ]}>
              <Ionicons 
                name={testData.status === 'pending' ? 'time' : 'checkmark'} 
                size={24} 
                color={testData.status === 'pending' ? '#D97706' : '#059669'} 
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>
                {testData.status === 'pending' ? 'Test Scheduled' : 'Test Completed'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {testData.category} Skill Assessment
              </Text>
            </View>
          </View>
          
          <View style={styles.statusTimeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#10B981' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Test Scheduled</Text>
                <Text style={styles.timelineDescription}>
                  Your skill test has been scheduled with {testData.tester.name}
                </Text>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={[
                styles.timelineDot, 
                { backgroundColor: testData.status === 'pending' ? '#E5E7EB' : '#10B981' }
              ]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Test Completed</Text>
                <Text style={styles.timelineDescription}>
                  {testData.status === 'pending' 
                    ? 'Waiting for test completion' 
                    : 'Test has been completed successfully'
                  }
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tester Information */}
        <View style={styles.testerCard}>
          <Text style={styles.sectionTitle}>Your Tester</Text>
          <View style={styles.testerInfo}>
            <View style={styles.testerAvatar}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.testerDetails}>
              <Text style={styles.testerName}>{testData.tester.name}</Text>
              <Text style={styles.testerCategory}>{testData.tester.category}</Text>
              <View style={styles.testerStats}>
                <Text style={styles.testerStat}>{testData.tester.experience} experience</Text>
                <Text style={styles.testerStat}>⭐ {testData.tester.rating}</Text>
                <Text style={styles.testerStat}>{testData.tester.distance}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Test Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Test Details</Text>
          <View style={styles.detailRow}>
            <Ionicons name="briefcase" size={20} color="#6B7280" />
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{testData.category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="call" size={20} color="#6B7280" />
            <Text style={styles.detailLabel}>Your Phone:</Text>
            <Text style={styles.detailValue}>{testData.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={20} color="#6B7280" />
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[
              styles.detailValue,
              { color: testData.status === 'pending' ? '#D97706' : '#059669' }
            ]}>
              {testData.status === 'pending' ? 'Scheduled' : 'Completed'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {testData.status === 'pending' && (
            <>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleContactTester}
              >
                <Ionicons name="call" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Contact Tester</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={handleRescheduleTest}
              >
                <Ionicons name="calendar" size={20} color="#4F46E5" />
                <Text style={styles.secondaryButtonText}>Reschedule Test</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.dangerButton}
                onPress={handleCancelTest}
              >
                <Ionicons name="close-circle" size={20} color="#EF4444" />
                <Text style={styles.dangerButtonText}>Cancel Test</Text>
              </TouchableOpacity>
            </>
          )}
          
          {testData.status !== 'pending' && (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('SkillAssessmentScreen')}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Schedule New Test</Text>
            </TouchableOpacity>
          )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusTimeline: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  timelineDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  testerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  testerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  testerDetails: {
    flex: 1,
  },
  testerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  testerCategory: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 2,
  },
  testerStats: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 12,
  },
  testerStat: {
    fontSize: 12,
    color: '#6B7280',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  actionsContainer: {
    marginTop: 24,
    marginBottom: 40,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  dangerButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  dangerButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TestStatusScreen; 