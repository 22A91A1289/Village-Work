import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';

const JobDetailsScreen = ({ route, navigation }) => {
  const { job } = route.params || {};
  
  // Log job data for debugging
  console.log('🔍 JobDetailsScreen received job:', job?._id, job?.title);
  console.log('🔍 Job requirements:', job?.requirements);
  console.log('🔍 Job benefits:', job?.benefits);
  
  // Safety check - if no job data, show error and go back
  if (!job) {
    console.error('❌ No job data in route params!');
    Alert.alert('Error', 'Job details not found', [
      { text: 'Go Back', onPress: () => navigation.goBack() }
    ]);
    return null;
  }
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginAndApplicationStatus();
  }, []);

  const checkLoginAndApplicationStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setIsLoggedIn(!!token);
      console.log('📋 Checking application status for job:', job._id);

      if (token && job._id) {
        // Check if already applied
        const myApplications = await api.get('/api/applications/my-applications', { auth: true });
        console.log('📋 My applications:', myApplications);
        const alreadyApplied = Array.isArray(myApplications) && myApplications.some(app => app.job?._id === job._id);
        console.log('📋 Already applied?', alreadyApplied, 'for job:', job._id);
        setHasApplied(alreadyApplied);
      }
    } catch (error) {
      console.log('❌ Error checking application status:', error);
    }
  };

  const checkVideoStatus = async () => {
    try {
      const hasVideo = await AsyncStorage.getItem('hasVideoIntroduction');
      return hasVideo === 'true';
    } catch (error) {
      return false;
    }
  };

  const handleApply = async () => {
    console.log('🎯 APPLY BUTTON CLICKED!');
    console.log('🎯 isLoggedIn:', isLoggedIn);
    console.log('🎯 hasApplied:', hasApplied);
    console.log('🎯 isApplying:', isApplying);
    console.log('🎯 Job ID:', job._id);
    
    // Check if logged in
    if (!isLoggedIn) {
      Alert.alert(
        'Login Required',
        'Please login to apply for jobs',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('LoginScreen') }
        ]
      );
      return;
    }

    // Check if already applied
    if (hasApplied) {
      Alert.alert('Already Applied', 'You have already applied for this job.');
      return;
    }

    // Check if video introduction is uploaded
    const hasVideo = await checkVideoStatus();
    if (!hasVideo) {
      Alert.alert(
        'Video Introduction Required',
        'Employers require a 1-2 minute self-introduction video for KYC purposes. Please record your video first.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Record Video', 
            onPress: () => navigation.navigate('VideoUploadScreen', { 
              fromApplication: true,
              returnToJob: job 
            })
          }
        ]
      );
      return;
    }

    Alert.alert(
      'Apply for Job',
      'Are you sure you want to apply for this job? Your video verification will be shown to the employer.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: async () => {
            try {
              setIsApplying(true);
              console.log('🚀 Applying for job:', job._id, job.title);
              
              // Submit application to backend
              const response = await api.post('/api/applications', {
                jobId: job._id,
                message: `I am interested in the ${job.title} position.`
              }, { auth: true });
              
              console.log('✅ Application submitted successfully!', response);

              setHasApplied(true);
              Alert.alert(
                'Success!',
                'Your application has been submitted successfully! The employer will see your KYC-verified profile.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error('❌ Application error:', error);
              console.error('❌ Error name:', error.name);
              console.error('❌ Error message:', error.message);
              console.error('❌ Error response:', error.response);
              console.error('❌ Full error:', JSON.stringify(error, null, 2));
              
              Alert.alert(
                'Application Failed',
                error.response?.data?.error || error.message || 'Failed to submit application. Please try again.'
              );
            } finally {
              setIsApplying(false);
            }
          },
        },
      ]
    );
  };

  const handleCall = () => {
    if (job.contact) {
      Linking.openURL(`tel:${job.contact}`);
    } else {
      Alert.alert('No Contact', 'Contact information not available for this job.');
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      isBookmarked ? 'Removed from Bookmarks' : 'Added to Bookmarks',
      isBookmarked ? 'Job removed from your bookmarks' : 'Job saved to your bookmarks'
    );
  };

  const handleShare = () => {
    Alert.alert('Share Job', 'Job details copied to clipboard');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 40,
          paddingBottom: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#1F2937', marginLeft: 8 }}>
            Job Details
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={handleBookmark} style={{ marginRight: 16 }}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isBookmarked ? '#EF4444' : '#6B7280'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {/* Job Header Card */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 20,
            marginTop: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#F3F4F6',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 4, flexWrap: 'wrap' }}>
                {job.title || 'Job Title'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 4, flex: 1 }}>{job.location || 'Location not specified'}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: '#EBF8FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
              <Text style={{ fontSize: 12, color: '#3B82F6', fontWeight: '500' }}>{job.type || 'Job'}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, color: '#059669', fontWeight: 'bold', flex: 1 }}>{job.salary || 'Salary not specified'}</Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 8 }}>Posted {job.timeAgo || 'Recently'}</Text>
          </View>
        </View>

        {/* Job Description Section */}
        {job.description && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 }}>
              Job Description
            </Text>
            <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{job.description}</Text>
          </View>
        )}

        {/* Requirements Section */}
        {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 }}>
              Requirements
            </Text>
            {(job.requirements || []).map((req, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <Text style={{ fontSize: 14, color: '#4B5563', marginLeft: 8 }}>{req}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Employer Info Section */}
        {(job.postedBy || job.contact) && (
          <View
            style={{
              backgroundColor: '#F9FAFB',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 }}>
              Employer Information
            </Text>
            {job.postedBy && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="person-outline" size={16} color="#6B7280" />
                <Text style={{ fontSize: 14, color: '#4B5563', marginLeft: 8 }}>{job.postedBy}</Text>
              </View>
            )}
            {job.contact && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="call-outline" size={16} color="#6B7280" />
                <Text style={{ fontSize: 14, color: '#4B5563', marginLeft: 8 }}>{job.contact}</Text>
              </View>
            )}
          </View>
        )}

        {/* Additional Info */}
        <View
          style={{
            backgroundColor: '#FEF3C7',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="information-circle" size={20} color="#D97706" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#D97706', marginLeft: 8 }}>
              Application Tips
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: '#92400E', marginTop: 8, lineHeight: 20 }}>
            • Contact the employer directly for faster response{'\n'}
            • Be punctual and professional during communication{'\n'}
            • Carry necessary documents for verification
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          backgroundColor: '#fff',
        }}
      >
        <TouchableOpacity
          onPress={handleCall}
          style={{
            flex: 1,
            backgroundColor: '#059669',
            paddingVertical: 12,
            borderRadius: 8,
            marginRight: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="call" size={20} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>Call Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleApply}
          disabled={isApplying || hasApplied}
          style={{
            flex: 1,
            backgroundColor: hasApplied ? '#9CA3AF' : isApplying ? '#6366F1' : '#4F46E5',
            paddingVertical: 12,
            borderRadius: 8,
            marginLeft: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isApplying || hasApplied ? 0.7 : 1,
          }}
        >
          {isApplying ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name={hasApplied ? "checkmark-circle" : "checkmark"} size={20} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>
                {hasApplied ? 'Applied' : 'Apply Now'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JobDetailsScreen;
