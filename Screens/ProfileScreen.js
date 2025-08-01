import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../contexts/LanguageContext';

const ProfileScreen = ({ navigation }) => {
  const { t, language, changeLanguage } = useLanguage();
  const [isOnline, setIsOnline] = useState(true);
  const [availableForWork, setAvailableForWork] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [videoStatus, setVideoStatus] = useState('none'); // 'none', 'pending', 'completed'

  const [profileData, setProfileData] = useState({
    name: 'Venkata Siva Rama Raju',
    email: 'venkata@example.com',
    phone: '+91 9876543210',
    location: 'Rajam, Andhra Pradesh',
    experience: '3+ Years',
    workerType: 'Experienced Worker',
    bio: 'Skilled worker with expertise in construction, electrical work, and general maintenance. Reliable and hardworking with excellent problem-solving skills.',
    hourlyRate: '₹2000 - ₹3000',
    availability: 'Monday - Saturday',
    workType: 'Full-time / Contract',
  });

  const [tempProfileData, setTempProfileData] = useState(profileData);

  const workerSkills = [
    { name: 'Construction', level: 'Expert', icon: 'hammer', color: '#10B981' },
    { name: 'Electrical Work', level: 'Advanced', icon: 'flash', color: '#F59E0B' },
    { name: 'Plumbing', level: 'Intermediate', icon: 'water', color: '#3B82F6' },
    { name: 'Carpentry', level: 'Advanced', icon: 'construct', color: '#8B5CF6' },
    { name: 'Painting', level: 'Intermediate', icon: 'color-palette', color: '#EF4444' },
    { name: 'General Maintenance', level: 'Expert', icon: 'build', color: '#06B6D4' },
  ];

  const workStats = [
    { icon: 'briefcase', label: 'Jobs Completed', value: '156', color: '#10B981' },
    { icon: 'star', label: 'Rating', value: '4.8', color: '#F59E0B' },
    { icon: 'time', label: 'Response Time', value: '< 1hr', color: '#3B82F6' },
    { icon: 'cash', label: 'Earnings', value: '₹2.4L', color: '#8B5CF6' },
  ];

  const recentJobs = [
    {
      id: 1,
      title: 'House Construction Helper',
      employer: 'Kumar Enterprises',
      duration: '2 months',
      rating: 5,
      earnings: '₹45,000',
      status: 'completed',
    },
    {
      id: 2,
      title: 'Electrical Installation',
      employer: 'Tech Solutions',
      duration: '3 weeks',
      rating: 4,
      earnings: '₹28,000',
      status: 'completed',
    },
    {
      id: 3,
      title: 'Office Renovation',
      employer: 'City Builders',
      duration: '1 month',
      rating: 5,
      earnings: '₹32,000',
      status: 'completed',
    },
  ];

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    setProfileData(tempProfileData);
    setIsEditModalVisible(false);
    Alert.alert('✓ Success', 'Your profile has been updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out',
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Logged Out', 'You have been logged out successfully');
            navigation.reset({
              index: 0,
              routes: [{ name: 'RoleSelection' }],
            });
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadVideoStatus();
  }, []);

  const loadVideoStatus = async () => {
    try {
      const hasVideo = await AsyncStorage.getItem('hasVideoIntroduction');
      if (hasVideo === 'true') {
        setVideoStatus('completed');
      } else if (hasVideo === 'pending') {
        setVideoStatus('pending');
      } else {
        setVideoStatus('none');
      }
    } catch (error) {
      console.error('Error loading video status:', error);
    }
  };

  const handleWorkAvailabilityToggle = () => {
    setAvailableForWork(!availableForWork);
    Alert.alert(
      'Availability Updated',
      availableForWork ? 'You are now unavailable for work' : 'You are now available for work'
    );
  };

  const handleNotificationPress = () => {
    setNotifications(0);
    Alert.alert('Notifications', 'View your notifications');
  };

  // Get menu items with dynamic video status
  const getMenuItems = () => [
    {
      icon: 'document-text-outline',
      title: 'My Applications',
      subtitle: 'Track your job applications',
      badge: '5 Pending',
      onPress: () => Alert.alert('Applications', 'View your job applications'),
    },
    {
      icon: 'briefcase-outline',
      title: 'Work History',
      subtitle: 'Past jobs and earnings',
      onPress: () => Alert.alert('Work History', 'View your completed jobs'),
    },
    {
      icon: 'wallet-outline',
      title: 'Earnings & Payments',
      subtitle: 'Payment history and methods',
      onPress: () => Alert.alert('Payments', 'Manage your earnings and payments'),
    },
    {
      icon: 'videocam-outline',
      title: 'Upload Introduction Video',
      subtitle: videoStatus === 'completed' 
        ? 'Video uploaded ✓' 
        : videoStatus === 'pending' 
        ? 'Pending - Upload to access more jobs' 
        : 'Record and upload your introduction video',
      badge: videoStatus === 'pending' ? 'Pending' : videoStatus === 'completed' ? 'Completed' : null,
      onPress: () => navigation.navigate('VideoUploadScreen'),
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Skills Assessment',
      subtitle: 'Take skill tests to improve rating',
      onPress: () => navigation.navigate('SkillAssessmentScreen'),
    },
    {
      icon: 'notifications-outline',
      title: 'Job Alerts',
      subtitle: 'Get notified about new jobs',
      onPress: () => Alert.alert('Job Alerts', 'Configure job notifications'),
    },
    {
      icon: 'language-outline',
      title: t('changeLanguage'),
      subtitle: `${t('language')}: ${language === 'en' ? t('english') : language === 'te' ? t('telugu') : t('hindi')}`,
      onPress: () => setIsLanguageModalVisible(true),
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      subtitle: 'Privacy and preferences',
      onPress: () => Alert.alert('Settings', 'Manage your account settings'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => Alert.alert('Support', 'Get help and contact support'),
    },
  ];

  const menuItems = getMenuItems();

  const LanguageModal = () => (
    <Modal
      visible={isLanguageModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsLanguageModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.languageModalContainer}>
          <View style={styles.languageModalHeader}>
            <Text style={styles.languageModalTitle}>{t('selectLanguage')}</Text>
            <TouchableOpacity onPress={() => setIsLanguageModalVisible(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[styles.languageOption, language === 'en' && styles.languageOptionSelected]}
              onPress={() => {
                changeLanguage('en');
                setIsLanguageModalVisible(false);
              }}
            >
              <Text style={[styles.languageOptionText, language === 'en' && styles.languageOptionTextSelected]}>
                {t('english')}
              </Text>
              {language === 'en' && <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.languageOption, language === 'te' && styles.languageOptionSelected]}
              onPress={() => {
                changeLanguage('te');
                setIsLanguageModalVisible(false);
              }}
            >
              <Text style={[styles.languageOptionText, language === 'te' && styles.languageOptionTextSelected]}>
                {t('telugu')}
              </Text>
              {language === 'te' && <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.languageOption, language === 'hi' && styles.languageOptionSelected]}
              onPress={() => {
                changeLanguage('hi');
                setIsLanguageModalVisible(false);
              }}
            >
              <Text style={[styles.languageOptionText, language === 'hi' && styles.languageOptionTextSelected]}>
                {t('hindi')}
              </Text>
              {language === 'hi' && <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const EditProfileModal = () => (
    <Modal
      visible={isEditModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
            <Text style={styles.modalCancelText}>{t('cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t('editProfile')}</Text>
          <TouchableOpacity onPress={handleSaveProfile}>
            <Text style={styles.modalSaveText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={tempProfileData.name}
              onChangeText={(text) => setTempProfileData({...tempProfileData, name: text})}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              value={tempProfileData.email}
              onChangeText={(text) => setTempProfileData({...tempProfileData, email: text})}
              placeholder="Enter email address"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.textInput}
              value={tempProfileData.phone}
              onChangeText={(text) => setTempProfileData({...tempProfileData, phone: text})}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.textInput}
              value={tempProfileData.location}
              onChangeText={(text) => setTempProfileData({...tempProfileData, location: text})}
              placeholder="City, State"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Hourly Rate (₹)</Text>
            <TextInput
              style={styles.textInput}
              value={tempProfileData.hourlyRate}
              onChangeText={(text) => setTempProfileData({...tempProfileData, hourlyRate: text})}
              placeholder="e.g., ₹2000 - ₹3000"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>About Your Skills</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={tempProfileData.bio}
              onChangeText={(text) => setTempProfileData({...tempProfileData, bio: text})}
              placeholder="Describe your skills and experience"
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={styles.brandTitle}>My Profile</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <Ionicons name="notifications" size={24} color="#374151" />
            {notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/120x120/4F46E5/ffffff?text=VS' }}
              style={styles.avatar}
            />
            <View style={[styles.onlineIndicator, { backgroundColor: isOnline ? '#10B981' : '#EF4444' }]} />
          </View>
          <Text style={styles.name}>{profileData.name}</Text>
          <Text style={styles.role}>{profileData.workerType}</Text>
          <Text style={styles.experience}>{profileData.experience} Experience</Text>
          
          {/* Availability Toggle */}
          <View style={styles.availabilityContainer}>
            <Text style={styles.availabilityLabel}>Available for Work</Text>
            <TouchableOpacity onPress={handleWorkAvailabilityToggle}>
              <View style={[styles.toggle, { backgroundColor: availableForWork ? '#10B981' : '#D1D5DB' }]}>
                <View style={[styles.toggleCircle, { 
                  transform: [{ translateX: availableForWork ? 20 : 2 }] 
                }]} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Work Stats */}
        <View style={styles.statsContainer}>
          {workStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon} size={20} color={stat.color} />
          </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
          ))}
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills & Expertise</Text>
          <View style={styles.skillsGrid}>
            {workerSkills.map((skill, index) => (
              <View key={index} style={styles.skillCard}>
                <View style={[styles.skillIcon, { backgroundColor: `${skill.color}15` }]}>
                  <Ionicons name={skill.icon} size={20} color={skill.color} />
                </View>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillLevel}>{skill.level}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Work */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Work</Text>
          {recentJobs.map((job, index) => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.ratingText}>{job.rating}</Text>
              </View>
          </View>
              <Text style={styles.employerName}>{job.employer}</Text>
              <View style={styles.jobDetails}>
                <Text style={styles.jobDuration}>{job.duration}</Text>
                <Text style={styles.jobEarnings}>₹{job.earnings}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <TouchableOpacity style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail" size={20} color="#4F46E5" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profileData.email}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call" size={20} color="#4F46E5" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{profileData.phone}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="location" size={20} color="#4F46E5" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{profileData.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Work Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Preferences</Text>
          <View style={styles.preferencesContainer}>
            <View style={styles.preferenceItem}>
              <Ionicons name="time" size={18} color="#6B7280" />
              <Text style={styles.preferenceLabel}>Work Type</Text>
              <Text style={styles.preferenceValue}>{profileData.workType}</Text>
            </View>
            <View style={styles.preferenceItem}>
              <Ionicons name="cash" size={18} color="#6B7280" />
              <Text style={styles.preferenceLabel}>Hourly Rate</Text>
              <Text style={styles.preferenceValue}>{profileData.hourlyRate}</Text>
            </View>
            <View style={styles.preferenceItem}>
              <Ionicons name="calendar" size={18} color="#6B7280" />
              <Text style={styles.preferenceLabel}>Availability</Text>
              <Text style={styles.preferenceValue}>{profileData.availability}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={item.onPress}
            >
            <View style={styles.actionHeader}>
              <View style={styles.actionIconContainer}>
                  <Ionicons name={item.icon} size={20} color="#4F46E5" />
              </View>
              <View style={styles.actionContent}>
                  <View style={styles.actionTitleRow}>
                    <Text style={styles.actionTitle}>{item.title}</Text>
                    {item.badge && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
                    )}
            </View>
                  <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="create" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EditProfileModal />
      <LanguageModal />
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 30,
    borderRadius: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#4F46E5',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600',
    marginBottom: 5,
  },
  experience: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
  },
  availabilityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 20,
    borderRadius: 16,
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statCard: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skillCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  skillIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  skillLevel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 4,
  },
  employerName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  jobEarnings: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  preferencesContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 10,
    flex: 1,
  },
  preferenceValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  actionTitle: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  editButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  languageModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '50%',
  },
  languageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  languageModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  languageOptions: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  languageOptionSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  languageOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  languageOptionTextSelected: {
    color: '#4F46E5',
  },
});

export default ProfileScreen;
