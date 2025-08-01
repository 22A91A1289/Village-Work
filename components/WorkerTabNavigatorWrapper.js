import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../Screens/HomeScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import { useLanguage } from '../contexts/LanguageContext';

const Tab = createBottomTabNavigator();

function WorkerTabNavigator() {
  const { t } = useLanguage();
  
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
      <Tab.Screen 
        name="WorkerHome" 
        component={HomeScreen} 
        options={{ tabBarLabel: t('home') }} 
      />
      <Tab.Screen 
        name="WorkerProfile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: t('profile') }} 
      />
    </Tab.Navigator>
  );
}

export default WorkerTabNavigator;

