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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useConfirmModal } from '../contexts/ConfirmModalContext';

const ProfileScreen = ({ navigation }) => {
  const { t, language, changeLanguage } = useLanguage();
  const { logout } = useAuth();
  const { showConfirm } = useConfirmModal();
  const [isOnline, setIsOnline] = useState(true);
  const [availableForWork, setAvailableForWork] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [videoStatus, setVideoStatus] = useState('none'); // 'none', 'pending', 'completed'
  const [loading, setLoading] = useState(true);
  const [quizHistory, setQuizHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    pendingPayments: 0,
    completedPayments: 0,
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [primaryBankAccount, setPrimaryBankAccount] = useState(null);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    workerType: 'New Worker',
    bio: '',
    hourlyRate: '',
    availability: 'Available',
    workType: '',
    quizScore: null,
    quizPassed: null,
    quizCategory: null,
    skillLevel: 'new',
    profilePicture: null,
  });

  const [tempProfileData, setTempProfileData] = useState(profileData);

  // These will be loaded from backend in the future
  const workerSkills = [];
  const workStats = [];
  const recentJobs = [];

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Update profile in backend
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
          console.error('Logout error:', error);
          Alert.alert('Error', 'Failed to logout. Please try again.');
        }
      },
    });
  };

  const handleProfilePictureChange = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => pickImage('camera'),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => pickImage('gallery'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async (source) => {
    try {
      // Request permissions
      let permissionResult;
      if (source === 'camera') {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please grant permission to access your photos or camera.');
        return;
      }

      // Launch image picker
      let result;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        
        // Update profile data with new image
        setProfileData({ ...profileData, profilePicture: imageUri });
        
        // Save to AsyncStorage
        await AsyncStorage.setItem('profilePicture', imageUri);
        
        // TODO: Upload to backend in the future
        // await api.post('/api/users/upload-profile-picture', { image: imageUri }, { auth: true });
        
        Alert.alert('✓ Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  // Fetch unread notifications count
  const fetchUnreadNotifications = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        return; // Guest users don't have notifications
      }

      const response = await api.get('/api/notifications/unread-count', { auth: true });
      if (response && response.success) {
        setNotifications(response.unreadCount || 0);
      }
    } catch (error) {
      // Silently fail - notifications not critical
      console.log('Could not fetch notification count');
    }
  };

  useEffect(() => {
    loadProfileData();
    loadVideoStatus();
    loadQuizHistory();
    loadApplicationsCount();
    loadEarningsData();
    loadBankAccounts();
    fetchUnreadNotifications();

    // Set up polling for real-time notifications (every 30 seconds)
    const notificationInterval = setInterval(() => {
      fetchUnreadNotifications();
    }, 30000);

    return () => {
      clearInterval(notificationInterval);
    };
  }, []);

  // Refresh when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfileData();
      loadQuizHistory();
      loadVideoStatus();
      loadApplicationsCount();
      loadEarningsData();
      loadBankAccounts();
      fetchUnreadNotifications(); // Refresh notification count
    });
    return unsubscribe;
  }, [navigation]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Load saved profile picture
      const savedProfilePicture = await AsyncStorage.getItem('profilePicture');
      
      // Check if user is logged in
      const authToken = await AsyncStorage.getItem('authToken');
      setIsLoggedIn(!!authToken);
      
      if (!authToken) {
        console.log('No auth token found, showing guest profile');
        // User not logged in - load from AsyncStorage if available
        const localUser = await AsyncStorage.getItem('authUser');
        if (localUser) {
          const userData = JSON.parse(localUser);
          
          // Format work categories for display
          let workTypeDisplay = '';
          if (userData.workCategories && userData.workCategories.length > 0) {
            const categoryMap = {
              'electrician': 'Electrician',
              'plumber': 'Plumber',
              'carpenter': 'Carpenter',
              'painter': 'Painter',
              'mechanic': 'Mechanic',
              'dataEntry': 'Data Entry',
              'driver': 'Driver'
            };
            workTypeDisplay = userData.workCategories
              .map(cat => categoryMap[cat] || cat)
              .join(', ');
          } else {
            workTypeDisplay = userData.workType || '';
          }

          const defaultHourlyRate = userData.hourlyRate || '₹150-300/hour';

          setProfileData({
            name: userData.name || 'Guest User',
            email: userData.email || '',
            phone: userData.phone || '',
            location: userData.location || '',
            experience: userData.experience || '',
            workerType: 'Guest',
            bio: userData.bio || '',
            hourlyRate: defaultHourlyRate,
            availability: 'Available',
            workType: workTypeDisplay,
            quizScore: null,
            quizPassed: null,
            quizCategory: null,
            skillLevel: 'new',
            profilePicture: savedProfilePicture,
          });
        }
        setLoading(false);
        return;
      }
      
      // Fetch profile from backend
      const userProfile = await api.get('/api/users/profile', { auth: true });
      
      if (userProfile) {
        // Format work categories for display
        let workTypeDisplay = '';
        if (userProfile.workCategories && userProfile.workCategories.length > 0) {
          // Capitalize and format categories
          workTypeDisplay = userProfile.workCategories
            .map(cat => {
              // Convert from camelCase/value to display format
              const categoryMap = {
                'electrician': 'Electrician',
                'plumber': 'Plumber',
                'carpenter': 'Carpenter',
                'painter': 'Painter',
                'mechanic': 'Mechanic',
                'dataEntry': 'Data Entry',
                'driver': 'Driver'
              };
              return categoryMap[cat] || cat;
            })
            .join(', ');
        } else {
          workTypeDisplay = userProfile.workType || '';
        }

        // Set default hourly rate if not set
        const defaultHourlyRate = userProfile.hourlyRate || 
          (userProfile.skillLevel === 'experienced' ? '₹300-500/hour' : '₹150-300/hour');

        setProfileData({
          name: userProfile.name || 'Worker',
          email: userProfile.email || '',
          phone: userProfile.phone || '',
          location: userProfile.location || '',
          experience: userProfile.experience || '',
          workerType: userProfile.skillLevel === 'experienced' ? 'Experienced Worker' : 'New Worker',
          bio: userProfile.bio || '',
          hourlyRate: defaultHourlyRate,
          availability: userProfile.availability ? 'Available' : 'Not Available',
          workType: workTypeDisplay,
          quizScore: userProfile.quizScore !== undefined ? userProfile.quizScore : null,
          quizPassed: userProfile.quizPassed !== undefined ? userProfile.quizPassed : null,
          quizCategory: userProfile.quizCategory || null,
          skillLevel: userProfile.skillLevel || 'new',
          profilePicture: userProfile.profilePicture || savedProfilePicture,
        });
        
        // Update video status from backend
        if (userProfile.videoUploaded) {
          setVideoStatus('completed');
        }
      }
    } catch (error) {
      console.log('Error loading profile:', error.message);
      // Try to load from AsyncStorage as fallback
      try {
        const localUser = await AsyncStorage.getItem('authUser');
        if (localUser) {
          const userData = JSON.parse(localUser);
          
          // Format work categories for display
          let workTypeDisplay = '';
          if (userData.workCategories && userData.workCategories.length > 0) {
            const categoryMap = {
              'electrician': 'Electrician',
              'plumber': 'Plumber',
              'carpenter': 'Carpenter',
              'painter': 'Painter',
              'mechanic': 'Mechanic',
              'dataEntry': 'Data Entry',
              'driver': 'Driver'
            };
            workTypeDisplay = userData.workCategories
              .map(cat => categoryMap[cat] || cat)
              .join(', ');
          } else {
            workTypeDisplay = userData.workType || '';
          }

          const defaultHourlyRate = userData.hourlyRate || 
            (userData.skillLevel === 'experienced' ? '₹300-500/hour' : '₹150-300/hour');

          setProfileData({
            name: userData.name || 'Worker',
            email: userData.email || '',
            phone: userData.phone || '',
            location: userData.location || '',
            experience: userData.experience || '',
            workerType: userData.skillLevel === 'experienced' ? 'Experienced Worker' : 'New Worker',
            bio: userData.bio || '',
            hourlyRate: defaultHourlyRate,
            availability: 'Available',
            workType: workTypeDisplay,
            quizScore: null,
            quizPassed: null,
            quizCategory: null,
            skillLevel: userData.skillLevel || 'new',
            profilePicture: savedProfilePicture,
          });
        }
      } catch (storageError) {
        console.log('Could not load from storage:', storageError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadEarningsData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (!authToken) {
        return;
      }
      
      // Fetch earnings summary
      const summaryResponse = await api.get('/api/payments/earnings/summary', { auth: true });
      if (summaryResponse.success) {
        setEarnings(summaryResponse.summary);
      }
      
      // Fetch recent payments
      const paymentsResponse = await api.get('/api/payments/history?limit=5', { auth: true });
      if (paymentsResponse.success) {
        setRecentPayments(paymentsResponse.payments);
      }
    } catch (error) {
      console.log('Could not load earnings data:', error.message);
    }
  };

  const loadBankAccounts = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (!authToken) {
        return;
      }
      
      // Fetch bank accounts
      const response = await api.get('/api/bank-accounts', { auth: true });
      if (response.success) {
        setBankAccounts(response.accounts);
        
        // Set primary account
        const primary = response.accounts.find(acc => acc.isPrimary);
        setPrimaryBankAccount(primary || null);
      }
    } catch (error) {
      console.log('Could not load bank accounts:', error.message);
    }
  };

  const loadQuizHistory = async () => {
    try {
      // Check if user is logged in
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (!authToken) {
        console.log('No auth token found, skipping quiz history load');
        return;
      }
      
      const quizzes = await api.get('/api/quiz/my-results', { auth: true });
      if (quizzes && Array.isArray(quizzes)) {
        setQuizHistory(quizzes);
      }
    } catch (error) {
      console.log('Could not load quiz history:', error.message);
    }
  };

  const loadVideoStatus = async () => {
    try {
      // First check backend for actual video status
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (authToken) {
        try {
          const userProfile = await api.get('/api/users/profile', { auth: true });
          if (userProfile && userProfile.videoUploaded) {
            setVideoStatus('completed');
            await AsyncStorage.setItem('hasVideoIntroduction', 'true');
            return;
          } else {
            // User exists but no video uploaded - clear any stale data
            setVideoStatus('none');
            await AsyncStorage.removeItem('hasVideoIntroduction');
            return;
          }
        } catch (error) {
          console.log('Could not load video status from backend:', error.message);
        }
      }
      
      // Fallback to AsyncStorage (but only if backend check failed)
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
      setVideoStatus('none'); // Default to none on error
    }
  };

  const loadApplicationsCount = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (!authToken) {
        console.log('No auth token, skipping applications load');
        return;
      }

      // Fetch user's applications from backend
      const applications = await api.get('/api/applications/my-applications', { auth: true });
      
      if (applications && Array.isArray(applications)) {
        setApplicationsCount(applications.length);
        
        // Count pending applications
        const pending = applications.filter(app => app.status === 'pending').length;
        setPendingApplicationsCount(pending);
      }
    } catch (error) {
      console.log('Could not load applications:', error.message);
      // Set to 0 if error
      setApplicationsCount(0);
      setPendingApplicationsCount(0);
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
    navigation.navigate('NotificationsScreen');
  };

  // Get menu items with dynamic video status
  const getMenuItems = () => [
    {
      icon: 'document-text-outline',
      title: 'My Applications',
      subtitle: 'Track your job applications',
      badge: pendingApplicationsCount > 0 ? `${pendingApplicationsCount} Pending` : null,
      onPress: () => navigation.navigate('MyApplicationsScreen'),
    },
    {
      icon: 'briefcase-outline',
      title: 'Work History',
      subtitle: 'Past jobs and earnings',
      onPress: () => {
        if (isLoggedIn) {
          navigation.navigate('WorkHistoryScreen');
        } else {
          Alert.alert('Login Required', 'Please login to view your work history');
        }
      },
    },
    {
      icon: 'wallet-outline',
      title: 'Earnings & Payments',
      subtitle: 'Payment history and methods',
      onPress: () => {
        if (isLoggedIn) {
          navigation.navigate('PaymentHistoryScreen');
        } else {
          Alert.alert('Login Required', 'Please login to view your earnings and payments');
        }
      },
    },
    {
      icon: 'card-outline',
      title: 'Bank Accounts',
      subtitle: bankAccounts.length > 0 
        ? `${bankAccounts.length} account${bankAccounts.length > 1 ? 's' : ''} added`
        : 'Add bank account for payments',
      badge: primaryBankAccount?.isVerified ? 'Verified' : bankAccounts.length > 0 ? 'Pending' : null,
      onPress: () => {
        if (isLoggedIn) {
          navigation.navigate('BankAccountScreen');
        } else {
          Alert.alert('Login Required', 'Please login to manage your bank accounts');
        }
      },
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
      icon: 'settings-outline',
      title: 'Settings',
      subtitle: 'Privacy and preferences',
      onPress: () => {
        if (isLoggedIn) {
          navigation.navigate('SettingsScreen');
        } else {
          Alert.alert('Login Required', 'Please login to access settings');
        }
      },
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
                <Text style={styles.badgeText}>
                  {notifications > 99 ? '99+' : notifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Login Prompt for Guest Users */}
        {!isLoggedIn && (
          <View style={styles.loginPromptBanner}>
            <View style={styles.loginPromptContent}>
              <Ionicons name="person-circle-outline" size={40} color="#4F46E5" />
              <View style={styles.loginPromptText}>
                <Text style={styles.loginPromptTitle}>Login to Save Your Progress</Text>
                <Text style={styles.loginPromptSubtitle}>
                  Create an account to sync your profile and quiz results
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.loginPromptButton}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.loginPromptButtonText}>Login / Sign Up</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Profile Header */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleProfilePictureChange} style={styles.avatarContainer}>
            <Image
              source={
                profileData.profilePicture 
                  ? { uri: profileData.profilePicture }
                  : { uri: 'https://via.placeholder.com/120x120/4F46E5/ffffff?text=' + (profileData.name.charAt(0) || 'U') }
              }
              style={styles.avatar}
            />
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </View>
            <View style={[styles.onlineIndicator, { backgroundColor: isOnline ? '#10B981' : '#EF4444' }]} />
          </TouchableOpacity>
          <Text style={styles.name}>{profileData.name || 'Worker'}</Text>
          <Text style={styles.role}>{profileData.workerType}</Text>
          {profileData.experience && (
            <Text style={styles.experience}>{profileData.experience} Experience</Text>
          )}
          
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


        {/* Work Stats - Hidden for now, will be implemented with real backend data */}
        {workStats.length > 0 && (
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
        )}

        {/* Quiz Score Section - Prominently Displayed */}
        {profileData.quizScore > 0 && (
          <View style={styles.section}>
            <View style={styles.quizScoreHeader}>
              <Text style={styles.sectionTitle}>Skill Assessment Results</Text>
              {profileData.quizPassed && (
                <View style={styles.passedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.passedBadgeText}>Passed</Text>
                </View>
              )}
            </View>
            <View style={[styles.quizScoreCard, profileData.quizPassed ? styles.quizScoreCardPassed : styles.quizScoreCardFailed]}>
              <View style={styles.quizScoreContent}>
                <View style={styles.quizScoreLeft}>
                  <Ionicons 
                    name={profileData.quizPassed ? "trophy" : "school"} 
                    size={32} 
                    color={profileData.quizPassed ? "#10B981" : "#F59E0B"} 
                  />
                  <View style={styles.quizScoreInfo}>
                    <Text style={styles.quizScoreLabel}>Quiz Score</Text>
                    <Text style={[styles.quizScoreValue, profileData.quizPassed && styles.quizScoreValuePassed]}>
                      {profileData.quizScore} / 5
                    </Text>
                    {profileData.quizCategory && (
                      <Text style={styles.quizCategoryText}>
                        Category: {profileData.quizCategory}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.quizScoreRight}>
                  <Text style={[styles.quizPercentage, profileData.quizPassed && styles.quizPercentagePassed]}>
                    {Math.round((profileData.quizScore / 5) * 100)}%
                  </Text>
                  <Text style={styles.quizStatusText}>
                    {profileData.quizPassed ? 'Qualified' : 'Not Qualified'}
                  </Text>
                </View>
              </View>
              {profileData.quizPassed && (
                <View style={styles.quizPassedMessage}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.quizPassedMessageText}>
                    You have access to technical work opportunities!
                  </Text>
                </View>
              )}
            </View>

            {/* Quiz History */}
            {quizHistory.length > 0 && (
              <View style={styles.quizHistoryContainer}>
                <Text style={styles.quizHistoryTitle}>Quiz History</Text>
                {quizHistory.slice(0, 3).map((quiz, index) => (
                  <View key={quiz._id || index} style={styles.quizHistoryItem}>
                    <View style={styles.quizHistoryLeft}>
                      <Ionicons 
                        name={quiz.passed ? "checkmark-circle" : "close-circle"} 
                        size={20} 
                        color={quiz.passed ? "#10B981" : "#EF4444"} 
                      />
                      <View style={styles.quizHistoryInfo}>
                        <Text style={styles.quizHistoryCategory}>{quiz.category || 'General'}</Text>
                        <Text style={styles.quizHistoryDate}>
                          {quiz.completedAt ? new Date(quiz.completedAt).toLocaleDateString() : 'Recently'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.quizHistoryRight}>
                      <Text style={[styles.quizHistoryScore, quiz.passed && styles.quizHistoryScorePassed]}>
                        {quiz.score}/{quiz.totalQuestions}
                      </Text>
                      <Text style={styles.quizHistoryPercentage}>
                        {quiz.percentage?.toFixed(0) || 0}%
                      </Text>
                    </View>
                  </View>
                ))}
                {quizHistory.length > 3 && (
                  <TouchableOpacity 
                    style={styles.viewAllQuizzesButton}
                    onPress={() => Alert.alert('Quiz History', 'View all quiz attempts')}
                  >
                    <Text style={styles.viewAllQuizzesText}>View All Quizzes ({quizHistory.length})</Text>
                    <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        {/* Skills Section - Hidden for now, will be implemented with real backend data */}
        {workerSkills.length > 0 && (
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
        )}

        {/* Recent Work - Hidden for now, will be implemented with real backend data */}
        {recentJobs.length > 0 && (
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
        )}

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
                <Text style={styles.infoValue}>{profileData.email || 'Not provided'}</Text>
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
                <Text style={styles.infoValue}>{profileData.phone || 'Not provided'}</Text>
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
                <Text style={styles.infoValue}>{profileData.location || 'Not specified'}</Text>
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
              <Text style={styles.preferenceValue}>{profileData.workType || 'Not specified'}</Text>
            </View>
            <View style={styles.preferenceItem}>
              <Ionicons name="cash" size={18} color="#6B7280" />
              <Text style={styles.preferenceLabel}>Hourly Rate</Text>
              <Text style={styles.preferenceValue}>{profileData.hourlyRate || 'Not specified'}</Text>
            </View>
            <View style={styles.preferenceItem}>
              <Ionicons name="calendar" size={18} color="#6B7280" />
              <Text style={styles.preferenceLabel}>Availability</Text>
              <Text style={styles.preferenceValue}>{profileData.availability || 'Available'}</Text>
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
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#4F46E5',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
  quizScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  passedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  passedBadgeText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  quizScoreCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
  },
  quizScoreCardPassed: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  quizScoreCardFailed: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  quizScoreContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizScoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quizScoreInfo: {
    marginLeft: 16,
    flex: 1,
  },
  quizScoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  quizScoreValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 4,
  },
  quizScoreValuePassed: {
    color: '#10B981',
  },
  quizCategoryText: {
    fontSize: 12,
    color: '#6B7280',
  },
  quizScoreRight: {
    alignItems: 'flex-end',
  },
  quizPercentage: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 4,
  },
  quizPercentagePassed: {
    color: '#10B981',
  },
  quizStatusText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  quizPassedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  quizPassedMessageText: {
    color: '#065F46',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  quizHistoryContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  quizHistoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  quizHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  quizHistoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quizHistoryInfo: {
    marginLeft: 12,
  },
  quizHistoryCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  quizHistoryDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  quizHistoryRight: {
    alignItems: 'flex-end',
  },
  quizHistoryScore: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 2,
  },
  quizHistoryScorePassed: {
    color: '#10B981',
  },
  quizHistoryPercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
  viewAllQuizzesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 12,
  },
  viewAllQuizzesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    marginRight: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
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
  loginPromptBanner: {
    backgroundColor: '#EEF2FF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4F46E5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  loginPromptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginPromptText: {
    flex: 1,
    marginLeft: 16,
  },
  loginPromptTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  loginPromptSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  loginPromptButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  loginPromptButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  
  // Earnings Section Styles
  earningsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  earningsCardsContainer: {
    gap: 12,
  },
  earningCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  totalEarningsCard: {
    backgroundColor: '#10B98110',
    borderColor: '#10B981',
  },
  pendingEarningsCard: {
    backgroundColor: '#F59E0B10',
    borderColor: '#F59E0B',
  },
  completedEarningsCard: {
    backgroundColor: '#3B82F610',
    borderColor: '#3B82F6',
  },
  earningCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  earningCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  earningCardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  earningCardSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  recentPaymentsContainer: {
    marginTop: 20,
  },
  recentPaymentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    marginBottom: 8,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentJobTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  paymentAmountContainer: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  paymentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  paymentStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  earningsEmptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  earningsEmptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  earningsEmptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  
  // Bank Account Section Styles
  bankAccountDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  bankAccountSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bankAccountHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bankAccountTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  bankAccountCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bankAccountContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bankAccountDetails: {
    flex: 1,
  },
  bankAccountHolderName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  bankAccountBankName: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  bankAccountNumber: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  bankVerifiedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankAccountWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  bankAccountWarningText: {
    flex: 1,
    fontSize: 12,
    color: '#F59E0B',
    lineHeight: 16,
  },
  addBankAccountCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addBankAccountTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    marginTop: 12,
    marginBottom: 4,
  },
  addBankAccountSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ProfileScreen;
