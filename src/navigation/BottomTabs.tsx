import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import NamazTable from '../screens/NamazTable';
import QazaScreen from '../screens/QazaScreen';
import FineScreen from '../screens/FineScreen';
import LogoutScreen from '../screens/LogoutScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: { active: 'home' as const, inactive: 'home-outline' as const },
  Qaza: { active: 'list' as const, inactive: 'list-outline' as const },
  Fine: { active: 'card' as const, inactive: 'card-outline' as const },
  Logout: { active: 'log-out' as const, inactive: 'log-out-outline' as const },
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name as keyof typeof TAB_ICONS];
          const name = focused ? icons.active : icons.inactive;
          return <Ionicons name={name} size={24} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          height: Platform.OS === 'ios' ? 84 : 64,
        },
        tabBarActiveTintColor: '#0f172a',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        tabBarShowLabel: true,
      })}
    >
      <Tab.Screen name="Home" component={NamazTable} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Qaza" component={QazaScreen} options={{ tabBarLabel: 'Qaza' }} />
      <Tab.Screen name="Fine" component={FineScreen} options={{ tabBarLabel: 'Fine' }} />
      <Tab.Screen name="Logout" component={LogoutScreen} options={{ tabBarLabel: 'Logout' }} />
    </Tab.Navigator>
  );
}
