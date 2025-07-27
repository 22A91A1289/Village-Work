import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Authentication Screens
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import RoleSelection from '../Screens/RoleSelection';

// Worker Flow Screens
import WorkerExperienceSelection from '../Screens/WorkerExperienceSelection';
import WorkerKYCVerification from '../Screens/WorkerKYCVerification';

// Main Screens
import HomeScreen from '../Screens/HomeScreen';
import OwnerHomeScreen from '../Screens/OwnerHomeScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import OwnerProfile from '../Screens/OwnerProfile';

// Job Related Screens
import CreateJobScreen from '../Screens/CreateJobScreen';
import JobDetailsScreen from '../Screens/JobDetailsScreen';
import JobManagementScreen from '../Screens/JobManagementScreen';
import CategoryJobsScreen from '../Screens/CategoryJobsScreen';
import ActiveJobScreen from '../Screens/ActiveJobScreen';

// Application Screens
import ApplicationsScreen from '../Screens/ApplicationsScreen';
import AllApplicationScreen from '../Screens/AllApplicationScreen';

// Assessment Screens
import SkillAssessmentScreen from '../Screens/SkillAssessmentScreen';
import TestStatusScreen from '../Screens/TestStatusScreen';

// Admin Screens
import AdminDashboard from '../Screens/AdminDashboard';
import AdminPaymentManagement from '../Screens/AdminPaymentManagement';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Worker Tab Navigator
function WorkerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'WorkerHome') iconName = 'home-outline';
          else if (route.name === 'WorkerProfile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: { paddingBottom: 4, fontSize: 12 },
        tabBarStyle: { height: 60 },
      })}
    >
      <Tab.Screen name="WorkerHome" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="WorkerProfile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Owner Tab Navigator
function OwnerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'OwnerHome') iconName = 'home-outline';
          else if (route.name === 'OwnerProfile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: { paddingBottom: 4, fontSize: 12 },
        tabBarStyle: { height: 60 },
      })}
    >
      <Tab.Screen name="OwnerHome" component={OwnerHomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="OwnerProfile" component={OwnerProfile} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Admin Tab Navigator
function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'AdminHome') iconName = 'home-outline';
          else if (route.name === 'AdminPayments') iconName = 'card-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: { paddingBottom: 4, fontSize: 12 },
        tabBarStyle: { height: 60 },
      })}
    >
      <Tab.Screen name="AdminHome" component={AdminDashboard} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="AdminPayments" component={AdminPaymentManagement} options={{ tabBarLabel: 'Payments' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="RoleSelection"
        screenOptions={{
          headerShown: false,
        }}
      >
                        {/* Authentication Stack */}
                <Stack.Screen name="RoleSelection" component={RoleSelection} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />

                {/* Worker Flow Stack */}
                <Stack.Screen name="WorkerExperienceSelection" component={WorkerExperienceSelection} />
                <Stack.Screen name="WorkerKYCVerification" component={WorkerKYCVerification} />

                {/* Worker Stack */}
                <Stack.Screen name="WorkerTabNavigator" component={WorkerTabNavigator} />
        <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
        <Stack.Screen name="CategoryJobsScreen" component={CategoryJobsScreen} />
        <Stack.Screen name="ActiveJobScreen" component={ActiveJobScreen} />
        <Stack.Screen name="SkillAssessmentScreen" component={SkillAssessmentScreen} />
        <Stack.Screen name="TestStatusScreen" component={TestStatusScreen} />

        {/* Owner Stack */}
        <Stack.Screen name="OwnerTabNavigator" component={OwnerTabNavigator} />
        <Stack.Screen name="CreateJobScreen" component={CreateJobScreen} />
        <Stack.Screen name="ApplicationsScreen" component={ApplicationsScreen} />
        <Stack.Screen name="AllApplicationScreen" component={AllApplicationScreen} />

        {/* Admin Stack */}
        <Stack.Screen name="AdminTabNavigator" component={AdminTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 