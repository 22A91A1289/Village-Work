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
import MobileOTPScreen from '../Screens/MobileOTPScreen';

// Main Screens
import OwnerHomeScreen from '../Screens/OwnerHomeScreen';
import OwnerProfile from '../Screens/OwnerProfile';

// Worker Tab Navigator (includes HomeScreen and ProfileScreen)
import WorkerTabNavigator from '../components/WorkerTabNavigatorWrapper';

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
import QuizScreen from '../Screens/QuizScreen';

// Video Screen
import VideoUploadScreen from '../Screens/VideoUploadScreen';

// Chat Screens
import ChatListScreen from '../Screens/ChatListScreen';
import ChatScreen from '../Screens/ChatScreen';

// Search Screen
import SearchScreen from '../Screens/SearchScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
                <Stack.Screen name="MobileOTPScreen" component={MobileOTPScreen} />

                {/* Worker Stack */}
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

        {/* Owner Stack */}
        <Stack.Screen name="OwnerTabNavigator" component={OwnerTabNavigator} />
        <Stack.Screen name="CreateJobScreen" component={CreateJobScreen} />
        <Stack.Screen name="JobManagementScreen" component={JobManagementScreen} />
        <Stack.Screen name="ApplicationsScreen" component={ApplicationsScreen} />
        <Stack.Screen name="AllApplicationScreen" component={AllApplicationScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
} 