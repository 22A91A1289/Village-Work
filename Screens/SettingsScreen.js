import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Switch,
  Alert,
  Platform,
  Modal,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useConfirmModal } from '../contexts/ConfirmModalContext';
import { getCurrentLocationAddress } from '../utils/locationHelper';

const SettingsScreen = ({ navigation }) => {
  const { t, language, changeLanguage } = useLanguage();
  const { logout } = useAuth();
  const { showConfirm } = useConfirmModal();
  const [settings, setSettings] = useState({
    notifications: true,
    jobAlerts: true,
    emailNotifications: false,
    smsNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    darkMode: false,
    dataSync: true,
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    hourlyRate: '',
    workType: '',
    experience: '',
  });
  const [tempProfileData, setTempProfileData] = useState(profileData);

  useEffect(() => {
    loadSettings();
    loadUserInfo();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadUserInfo = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        const response = await api.get('/api/users/profile', { auth: true });
        if (response) {
          const userData = {
            name: response.name || '',
            email: response.email || '',
            phone: response.phone || '',
            location: response.location || '',
            bio: response.bio || '',
            hourlyRate: response.hourlyRate || '',
            workType: response.workType || '',
            experience: response.experience || '',
          };
          setProfileData(userData);
          setTempProfileData(userData);
        }
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleEditProfile = () => {
    setTempProfileData(profileData);
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      const updatedData = {
        name: tempProfileData.name,
        phone: tempProfileData.phone,
        location: tempProfileData.location,
        bio: tempProfileData.bio,
        hourlyRate: tempProfileData.hourlyRate,
        workType: tempProfileData.workType,
        experience: tempProfileData.experience,
      };
      
      await api.put('/api/users/profile', updatedData, { auth: true });
      
      setProfileData(tempProfileData);
      setIsEditModalVisible(false);
      Alert.alert('✓ Success', 'Your profile has been updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleFetchLocation = async () => {
    setFetchingLocation(true);
    try {
      const address = await getCurrentLocationAddress();
      
      if (address) {
        setTempProfileData({...tempProfileData, location: address});
        Alert.alert('✓ Success', `Location updated to: ${address}`);
      } else {
        Alert.alert('Error', 'Could not fetch your location. Please enter manually.');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Failed to fetch location. Please try again.');
    } finally {
      setFetchingLocation(false);
    }
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        {
          text: 'English',
          onPress: () => changeLanguage('en'),
        },
        {
          text: 'తెలుగు (Telugu)',
          onPress: () => changeLanguage('te'),
        },
        {
          text: 'हिंदी (Hindi)',
          onPress: () => changeLanguage('hi'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleLogout = () => {
    showConfirm({
      title: 'Confirm Logout',
      message: 'Are you sure you want to sign out?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      destructive: true,
      onConfirm: async () => {
        try {
          await logout();
        } catch (error) {
          console.error('Error logging out:', error);
          Alert.alert('Error', 'Failed to logout. Please try again.');
        }
      },
    });
  };

  const handleDeleteAccount = () => {
    showConfirm({
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
      onConfirm: () => {
        showConfirm({
          title: 'Account Deletion',
          message: 'Please contact support to delete your account: support@worknex.com',
          confirmText: 'OK',
          cancelText: 'Close',
        });
      },
    });
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              // Keep auth data, clear only cache
              await AsyncStorage.removeItem('usedQuestions_Electrician');
              await AsyncStorage.removeItem('usedQuestions_Plumber');
              await AsyncStorage.removeItem('usedQuestions_Carpenter');
              await AsyncStorage.removeItem('usedQuestions_Mechanic');
              await AsyncStorage.removeItem('usedQuestions_DataEntry');
              Alert.alert('Success', 'Cache cleared successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const renderSettingItem = (icon, title, subtitle, onPress, rightComponent) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color="#4F46E5" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  const renderToggleItem = (icon, title, subtitle, settingKey) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color="#4F46E5" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={settings[settingKey]}
        onValueChange={() => toggleSetting(settingKey)}
        trackColor={{ false: '#D1D5DB', true: '#A5B4FC' }}
        thumbColor={settings[settingKey] ? '#4F46E5' : '#F3F4F6'}
      />
    </View>
  );

  const getCurrentLanguageName = () => {
    switch (language) {
      case 'en': return 'English';
      case 'te': return 'తెలుగు (Telugu)';
      case 'hi': return 'हिंदी (Hindi)';
      default: return 'English';
    }
  };

  const EditProfileModal = () => (
    <Modal
      visible={isEditModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSaveProfile}>
            <Text style={styles.modalSaveText}>Save</Text>
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
              editable={false}
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
            <View style={styles.labelWithButton}>
              <Text style={styles.inputLabel}>Location</Text>
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={handleFetchLocation}
                disabled={fetchingLocation}
              >
                {fetchingLocation ? (
                  <ActivityIndicator size="small" color="#4F46E5" />
                ) : (
                  <>
                    <Ionicons name="location" size={16} color="#4F46E5" />
                    <Text style={styles.locationButtonText}>Get Location</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {renderSettingItem(
            'person-outline',
            'Edit Profile',
            'Update your personal information',
            handleEditProfile
          )}
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          {renderSettingItem(
            'language-outline',
            'Change Language',
            getCurrentLanguageName(),
            handleLanguageChange
          )}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Information</Text>
          
          {renderSettingItem(
            'help-circle-outline',
            'Help & Support',
            'Get help with your account',
            () => Alert.alert('Support', 'Contact us at:\n\nEmail: support@worknex.com\nPhone: +91 1234567890\n\nWe are available 24/7 to help you!')
          )}
          
          {renderSettingItem(
            'information-circle-outline',
            'About',
            'App version 1.0.0',
            () => Alert.alert('About WorkNex', 'WorkNex v1.0.0\n\nConnecting workers with opportunities.\n\nDeveloped with ❤️ for the working community.\n\n© 2026 WorkNex. All rights reserved.')
          )}
        </View>

        {/* Account Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity
            style={[styles.settingItem, styles.logoutItem]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, styles.logoutIcon]}>
                <Ionicons name="log-out-outline" size={22} color="#EF4444" />
              </View>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, styles.logoutText]}>Sign Out</Text>
                <Text style={styles.settingSubtitle}>Sign out from your account</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.settingItem, styles.deleteItem]}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, styles.deleteIcon]}>
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
              </View>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, styles.deleteText]}>Delete Account</Text>
                <Text style={styles.settingSubtitle}>Permanently delete your account</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>WorkNex © 2026</Text>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  logoutItem: {
    borderColor: '#FEE2E2',
  },
  logoutIcon: {
    backgroundColor: '#FEE2E2',
  },
  logoutText: {
    color: '#EF4444',
  },
  deleteItem: {
    borderColor: '#FEE2E2',
  },
  deleteIcon: {
    backgroundColor: '#FEE2E2',
  },
  deleteText: {
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  labelWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  locationButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 4,
  },
});

export default SettingsScreen;
