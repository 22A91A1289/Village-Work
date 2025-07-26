import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const JobDetailsScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleApply = () => {
    Alert.alert(
      'Apply for Job',
      'Are you sure you want to apply for this job?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => {
            Alert.alert('Success', 'Your application has been submitted successfully!');
          },
        },
      ]
    );
  };

  const handleCall = () => {
    Linking.openURL(`tel:${job.contact}`);
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
          paddingVertical: 12,
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
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 }}>
                {job.title}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 4 }}>{job.location}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: '#EBF8FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
              <Text style={{ fontSize: 12, color: '#3B82F6', fontWeight: '500' }}>{job.type}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, color: '#059669', fontWeight: 'bold' }}>{job.salary}</Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Posted {job.timeAgo}</Text>
          </View>
        </View>

        {/* Job Description Section */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 }}>
            Job Description
          </Text>
          <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{job.description}</Text>
        </View>

        {/* Requirements Section */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 }}>
            Requirements
          </Text>
          {job.requirements.map((req, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="checkmark-circle" size={16} color="#059669" />
              <Text style={{ fontSize: 14, color: '#4B5563', marginLeft: 8 }}>{req}</Text>
            </View>
          ))}
        </View>

        {/* Employer Info Section */}
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="person-outline" size={16} color="#6B7280" />
            <Text style={{ fontSize: 14, color: '#4B5563', marginLeft: 8 }}>{job.postedBy}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="call-outline" size={16} color="#6B7280" />
            <Text style={{ fontSize: 14, color: '#4B5563', marginLeft: 8 }}>{job.contact}</Text>
          </View>
        </View>

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
          style={{
            flex: 1,
            backgroundColor: '#4F46E5',
            paddingVertical: 12,
            borderRadius: 8,
            marginLeft: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JobDetailsScreen;
