
// import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';

// // Import all screens
// import RoleSelection from './Screens/RoleSelection';
// import WorkerHomeScreen from './Screens/WorkerHomeScreen';
// import WorkerProfile from './Screens/WorkerProfile';
// import OwnerHomeScreen from './Screens/OwnerHomeScreen';
// import OwnerProfile from './Screens/OwnerProfile';
// import AllApplicationsScreen from './Screens/AllApplicationsScreen';
// import ApplicationsScreen from './Screens/ApplicationsScreen';
// import JobManagementScreen from './Screens/JobManagementScreen';
// import ActiveJobsScreen from './Screens/ActiveJobsScreen';
// import WorkerDetailsScreen from './Screens/WorkerDetailsScreen';
// import JobApplicationScreen from './Screens/JobApplicationScreen';
// import CreateJobScreen from './Screens/CreateJobScreen';

// const RootStack = createNativeStackNavigator();
// const WorkerTab = createBottomTabNavigator();
// const OwnerTab = createBottomTabNavigator();

// const WorkerTabs = () => (
//   <WorkerTab.Navigator
//     screenOptions={({ route }) => ({
//       tabBarIcon: ({ color, size }) => {
//         const iconName = route.name === 'WorkerHome' ? 'home' : 'person';
//         return <Ionicons name={iconName} size={size} color={color} />;
//       },
//       tabBarActiveTintColor: '#4F46E5',
//       tabBarInactiveTintColor: 'gray',
//       headerShown: false,
//     })}
//   >
//     <WorkerTab.Screen name="WorkerHome" component={WorkerHomeScreen} />
//     <WorkerTab.Screen name="WorkerProfile" component={WorkerProfile} />
//   </WorkerTab.Navigator>
// );

// const OwnerTabs = () => (
//   <OwnerTab.Navigator
//     screenOptions={({ route }) => ({
//       tabBarIcon: ({ color, size }) => {
//         const iconName = route.name === 'OwnerHome' ? 'home' : 'person';
//         return <Ionicons name={iconName} size={size} color={color} />;
//       },
//       tabBarActiveTintColor: '#4F46E5',
//       tabBarInactiveTintColor: 'gray',
//       headerShown: false,
//     })}
//   >
//     <OwnerTab.Screen name="OwnerHome" component={OwnerHomeScreen} />
//     <OwnerTab.Screen name="OwnerProfile" component={OwnerProfile} />
//   </OwnerTab.Navigator>
// );

// export default function App() {
//   const [initialRoute, setInitialRoute] = useState('RoleSelection');

//   useEffect(() => {
//     checkInitialRoute();
//   }, []);

//   const checkInitialRoute = async () => {
//     try {
//       const userRole = await AsyncStorage.getItem('userRole');
//       if (userRole) {
//         setInitialRoute(userRole === 'worker' ? 'Worker' : 'Owner');
//       }
//     } catch (error) {
//       console.error('Error checking initial route:', error);
//     }
//   };

//   return (
//     <NavigationContainer>
//       <RootStack.Navigator initialRouteName={initialRoute}>
//         <RootStack.Screen 
//           name="RoleSelection" 
//           component={RoleSelection} 
//           options={{ headerShown: false }} 
//         />
//         <RootStack.Screen 
//           name="Worker" 
//           component={WorkerTabs} 
//           options={{ headerShown: false }} 
//         />
//         <RootStack.Screen 
//           name="Owner" 
//           component={OwnerTabs} 
//           options={{ headerShown: false }} 
//         />
        
//         {/* Navigation Screens */}
//         <RootStack.Screen 
//           name="AllApplications" 
//           component={AllApplicationsScreen}
//           options={{ title: 'All Applications' }}
//         />
//         <RootStack.Screen 
//           name="Applications" 
//           component={ApplicationsScreen}
//           options={{ title: 'Job Applications' }}
//         />
//         <RootStack.Screen 
//           name="JobManagement" 
//           component={JobManagementScreen}
//           options={{ title: 'Job Management' }}
//         />
//         <RootStack.Screen 
//           name="ActiveJobs" 
//           component={ActiveJobsScreen}
//           options={{ title: 'Active Jobs' }}
//         />
//         <RootStack.Screen 
//           name="WorkerDetails" 
//           component={WorkerDetailsScreen}
//           options={{ title: 'Worker Details' }}
//         />
//         <RootStack.Screen 
//           name="JobApplication" 
//           component={JobApplicationScreen}
//           options={{ title: 'Apply for Job' }}
//         />
//         <RootStack.Screen 
//           name="CreateJob" 
//           component={CreateJobScreen}
//           options={{ title: 'Create New Job' }}
//         />
//       </RootStack.Navigator>
//     </NavigationContainer>
//   );
// }
// import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';

// // Import all screens
// import RoleSelection from './Screens/RoleSelection';
// import HomeScreen from './Screens/HomeScreen'; // Your existing WorkerHomeScreen
// import ProfileScreen from './Screens/ProfileScreen'; // Your existing WorkerProfile
// import OwnerHomeScreen from './Screens/OwnerHomeScreen';
// import OwnerProfile from './Screens/OwnerProfile';
// import AllApplicationsScreen from './Screens/AllApplicationScreen';

// import ApplicationsScreen from './Screens/ApplicationsScreen';
// import JobManagementScreen from './Screens/JobManagementScreen';
// import ActiveJobsScreen from './Screens/ActiveJobScreen';
// import JobDetailsScreen from './Screens/JobDetailsScreen';
// import CreateJobScreen from './Screens/CreateJobScreen';

// const RootStack = createNativeStackNavigator();
// const WorkerTab = createBottomTabNavigator();
// const OwnerTab = createBottomTabNavigator();

// const WorkerTabs = () => (
//   <WorkerTab.Navigator
//     screenOptions={({ route }) => ({
//       tabBarIcon: ({ color, size }) => {
//         const iconName = route.name === 'WorkerHome' ? 'home' : 'person';
//         return <Ionicons name={iconName} size={size} color={color} />;
//       },
//       tabBarActiveTintColor: '#4F46E5',
//       tabBarInactiveTintColor: 'gray',
//       headerShown: false,
//       tabBarStyle: {
//         backgroundColor: '#FFFFFF',
//         borderTopWidth: 1,
//         borderTopColor: '#E5E7EB',
//         elevation: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: -2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         paddingBottom: 5,
//         height: 60,
//       },
//       tabBarLabelStyle: {
//         fontSize: 12,
//         fontWeight: '600',
//         marginBottom: 5,
//       },
//     })}
//   >
//     <WorkerTab.Screen 
//       name="WorkerHome" 
//       component={HomeScreen}
//       options={{
//         tabBarLabel: 'Jobs',
//       }}
//     />
//     <WorkerTab.Screen 
//       name="WorkerProfile" 
//       component={ProfileScreen}
//       options={{
//         tabBarLabel: 'Profile',
//       }}
//     />
//   </WorkerTab.Navigator>
// );

// const OwnerTabs = () => (
//   <OwnerTab.Navigator
//     screenOptions={({ route }) => ({
//       tabBarIcon: ({ color, size }) => {
//         const iconName = route.name === 'OwnerHome' ? 'home' : 'person';
//         return <Ionicons name={iconName} size={size} color={color} />;
//       },
//       tabBarActiveTintColor: '#4F46E5',
//       tabBarInactiveTintColor: 'gray',
//       headerShown: false,
//       tabBarStyle: {
//         backgroundColor: '#FFFFFF',
//         borderTopWidth: 1,
//         borderTopColor: '#E5E7EB',
//         elevation: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: -2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         paddingBottom: 5,
//         height: 60,
//       },
//       tabBarLabelStyle: {
//         fontSize: 12,
//         fontWeight: '600',
//         marginBottom: 5,
//       },
//     })}
//   >
//     <OwnerTab.Screen 
//       name="OwnerHome" 
//       component={OwnerHomeScreen}
//       options={{
//         tabBarLabel: 'Dashboard',
//       }}
//     />
//     <OwnerTab.Screen 
//       name="OwnerProfile" 
//       component={OwnerProfile}
//       options={{
//         tabBarLabel: 'Profile',
//       }}
//     />
//   </OwnerTab.Navigator>
// );

// export default function App() {
//   const [initialRoute, setInitialRoute] = useState('RoleSelection');

//   useEffect(() => {
//     checkInitialRoute();
//   }, []);

//   const checkInitialRoute = async () => {
//     try {
//       const userRole = await AsyncStorage.getItem('userRole');
//       if (userRole) {
//         setInitialRoute(userRole === 'worker' ? 'Worker' : 'Owner');
//       }
//     } catch (error) {
//       console.error('Error checking initial route:', error);
//     }
//   };

//   return (
//     <NavigationContainer>
//       <RootStack.Navigator 
//         initialRouteName={initialRoute}
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: '#4F46E5',
//           },
//           headerTintColor: '#FFFFFF',
//           headerTitleStyle: {
//             fontWeight: 'bold',
//           },
//         }}
//       >
//         <RootStack.Screen 
//           name="RoleSelection" 
//           component={RoleSelection} 
//           options={{ headerShown: false }} 
//         />
//         <RootStack.Screen 
//           name="Worker" 
//           component={WorkerTabs} 
//           options={{ headerShown: false }} 
//         />
//         <RootStack.Screen 
//           name="Owner" 
//           component={OwnerTabs} 
//           options={{ headerShown: false }} 
//         />
        
//         {/* Owner Navigation Screens */}
//         <RootStack.Screen 
//           name="AllApplications" 
//           component={AllApplicationsScreen}
//           options={{ 
//             title: 'All Applications',
//             headerStyle: { backgroundColor: '#4F46E5' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         />
//         <RootStack.Screen 
//           name="Applications" 
//           component={ApplicationsScreen}
//           options={{ 
//             title: 'Job Applications',
//             headerStyle: { backgroundColor: '#4F46E5' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         />
//         <RootStack.Screen 
//           name="JobManagement" 
//           component={JobManagementScreen}
//           options={{ 
//             title: 'Job Management',
//             headerStyle: { backgroundColor: '#4F46E5' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         />
//         <RootStack.Screen 
//           name="ActiveJobs" 
//           component={ActiveJobsScreen}
//           options={{ 
//             title: 'Active Jobs',
//             headerStyle: { backgroundColor: '#4F46E5' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         />
//         <RootStack.Screen 
//           name="CreateJob" 
//           component={CreateJobScreen}
//           options={{ 
//             title: 'Create New Job',
//             headerStyle: { backgroundColor: '#4F46E5' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         />
        
//         {/* Worker Navigation Screens */}
//         {/* <RootStack.Screen 
//           name="JobApplication" 
//           component={JobApplicationScreen}
//           options={{ 
//             title: 'Apply for Job',
//             headerStyle: { backgroundColor: '#10B981' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         /> */}
        
//         {/* Additional Worker Screens that might be navigated from your existing screens */}
//         <RootStack.Screen 
//           name="JobDetails" 
//           component={JobDetailsScreen}
//           options={{ 
//             title: 'Job Details',
//             headerStyle: { backgroundColor: '#10B981' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         />
//         <RootStack.Screen 
//           name="CategoryJobs" 
//           component={CategoryJobsScreen}
//           options={({ route }) => ({ 
//             title: route.params?.categoryName || 'Category Jobs',
//             headerStyle: { backgroundColor: '#10B981' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           })}
//         />
//         <RootStack.Screen 
//           name="AllJobs" 
//           component={AllJobsScreen}
//           options={{ 
//             title: 'All Jobs',
//             headerStyle: { backgroundColor: '#10B981' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         />
//         <RootStack.Screen 
//           name="Search" 
//           component={SearchScreen}
//           options={{ 
//             title: 'Search Jobs',
//             headerStyle: { backgroundColor: '#10B981' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         />
//         <RootStack.Screen 
//           name="Notifications" 
//           component={NotificationsScreen}
//           options={{ 
//             title: 'Notifications',
//             headerStyle: { backgroundColor: '#10B981' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         />
//         <RootStack.Screen 
//           name="MyApplications" 
//           component={MyApplicationsScreen}
//           options={{ 
//             title: 'My Applications',
//             headerStyle: { backgroundColor: '#10B981' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         />
//         <RootStack.Screen 
//           name="SavedJobs" 
//           component={SavedJobsScreen}
//           options={{ 
//             title: 'Saved Jobs',
//             headerStyle: { backgroundColor: '#10B981' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         />
//         <RootStack.Screen 
//           name="EditProfile" 
//           component={EditProfileScreen}
//           options={{ 
//             title: 'Edit Profile',
//             headerStyle: { backgroundColor: '#10B981' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         />
//         <RootStack.Screen 
//           name="Settings" 
//           component={SettingsScreen}
//           options={{ 
//             title: 'Settings',
//             headerStyle: { backgroundColor: '#10B981' },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: { fontWeight: 'bold' }
//           }}
//         />
//       </RootStack.Navigator>
//     </NavigationContainer>
//   );
// }
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import all screens
import RoleSelection from './Screens/RoleSelection';
import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import OwnerHomeScreen from './Screens/OwnerHomeScreen';
import OwnerProfile from './Screens/OwnerProfile';
import CategoryJobsScreen from './Screens/CategoryJobsScreen';
import CreateJobScreen from './Screens/CreateJobScreen';
import ActiveJobsScreen from './Screens/ActiveJobScreen';
import AllApplicationsScreen from './Screens/AllApplicationScreen';
import ApplicationsScreen from './Screens/ApplicationsScreen';
import JobManagementScreen from './Screens/JobManagementScreen';
import JobDetailsScreen from './Screens/JobDetailsScreen';

const Stack = createNativeStackNavigator();
const WorkerTab = createBottomTabNavigator();
const OwnerTab = createBottomTabNavigator();

function WorkerTabs() {
  return (
    <WorkerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'Home' ? 'home' : 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 3 },
      })}
    >
      <WorkerTab.Screen name="Home" component={HomeScreen} />
      <WorkerTab.Screen name="Profile" component={ProfileScreen} />
    </WorkerTab.Navigator>
  );
}

function OwnerTabs() {
  return (
    <OwnerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'Home' ? 'home' : 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 3 },
      })}
    >
      <OwnerTab.Screen name="Home" component={OwnerHomeScreen} />
      <OwnerTab.Screen name="Profile" component={OwnerProfile} />
    </OwnerTab.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState('RoleSelection');

  useEffect(() => {
    (async () => {
      try {
        const userRole = await AsyncStorage.getItem('userRole');
        if (userRole === 'worker') setInitialRoute('WorkerTabs');
        else if (userRole === 'owner') setInitialRoute('OwnerTabs');
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RoleSelection" component={RoleSelection} />
        <Stack.Screen name="WorkerTabs" component={WorkerTabs} />
        <Stack.Screen name="OwnerTabs" component={OwnerTabs} />

        {/* Shared screens */}
        <Stack.Screen
          name="CategoryJobs"
          component={CategoryJobsScreen}
          options={({ route }) => ({
            headerShown: true,
            title: route.params?.categoryName || 'Category Jobs',
            headerStyle: { backgroundColor: '#10B981' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          })}
        />
        <Stack.Screen name="CreateJob" component={CreateJobScreen} />
        <Stack.Screen name="ActiveJobs" component={ActiveJobsScreen} />
        <Stack.Screen name="AllApplications" component={AllApplicationsScreen} />
        <Stack.Screen name="Applications" component={ApplicationsScreen} />
        <Stack.Screen name="JobManagement" component={JobManagementScreen} />
        <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
