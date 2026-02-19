import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
// Authentication Screens
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import ForgotPasswordScreen from '../Screens/ForgotPasswordScreen';

// Worker Tab Navigator (includes HomeScreen and ProfileScreen)
import WorkerTabNavigator from '../components/WorkerTabNavigatorWrapper';

// Job Related Screens
import JobDetailsScreen from '../Screens/JobDetailsScreen';
import CategoryJobsScreen from '../Screens/CategoryJobsScreen';
import ActiveJobScreen from '../Screens/ActiveJobScreen';

// Assessment Screens
import SkillAssessmentScreen from '../Screens/SkillAssessmentScreen';
import TestStatusScreen from '../Screens/TestStatusScreen';
import QuizScreen from '../Screens/QuizScreen';

// Video Screen
import VideoUploadScreen from '../Screens/VideoUploadScreen';

// Chat Screens
import ChatListScreen from '../Screens/ChatListScreen';
import ChatScreen from '../Screens/ChatScreen';

// Search Screen
import SearchScreen from '../Screens/SearchScreen';

// Applications Screen
import MyApplicationsScreen from '../Screens/MyApplicationsScreen';

// Notifications Screen
import NotificationsScreen from '../Screens/NotificationsScreen';

// Payment Screens
import PaymentHistoryScreen from '../Screens/PaymentHistoryScreen';
import PaymentScreen from '../Screens/PaymentScreen';

// Bank Account Screen
import BankAccountScreen from '../Screens/BankAccountScreen';

// Work History Screen
import WorkHistoryScreen from '../Screens/WorkHistoryScreen';

// Settings Screen
import SettingsScreen from '../Screens/SettingsScreen';

// Work Preferences Screen
import WorkPreferencesScreen from '../Screens/WorkPreferencesScreen';

// Rating Screen
import RatingScreen from '../Screens/RatingScreen';

const Stack = createStackNavigator();


export default function AppNavigator() {
  const { isLoggedIn, isLoading } = useAuth();
  
  console.log(`🧭 AppNavigator: isLoggedIn = ${isLoggedIn}, isLoading = ${isLoading}`);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.navWrapper}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { flex: 1 },
          }}
        >
          {isLoggedIn ? (
            // User is signed in
            <>
              <Stack.Screen name="WorkerTabNavigator" component={WorkerTabNavigator} />
              <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
              <Stack.Screen name="CategoryJobs" component={CategoryJobsScreen} />
              <Stack.Screen name="Search" component={SearchScreen} />
              <Stack.Screen name="ActiveJobScreen" component={ActiveJobScreen} />
              <Stack.Screen name="SkillAssessmentScreen" component={SkillAssessmentScreen} />
              <Stack.Screen name="QuizScreen" component={QuizScreen} />
              <Stack.Screen name="TestStatusScreen" component={TestStatusScreen} />
              <Stack.Screen name="VideoUploadScreen" component={VideoUploadScreen} />
              <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
              <Stack.Screen name="ChatScreen" component={ChatScreen} />
              <Stack.Screen name="MyApplicationsScreen" component={MyApplicationsScreen} />
              <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
              <Stack.Screen name="PaymentHistoryScreen" component={PaymentHistoryScreen} />
              <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
              <Stack.Screen name="BankAccountScreen" component={BankAccountScreen} />
              <Stack.Screen name="WorkHistoryScreen" component={WorkHistoryScreen} />
              <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
              <Stack.Screen name="RatingScreen" component={RatingScreen} />
            </>
          ) : (
            // No user is signed in
            <>
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
              <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
              <Stack.Screen name="WorkPreferencesScreen" component={WorkPreferencesScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  navWrapper: {
    flex: 1,
  },
}); 