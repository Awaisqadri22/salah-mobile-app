import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NamazTable from '../screens/NamazTable';
import QazaScreen from '../screens/QazaScreen';
import FineScreen from '../screens/FineScreen';
import LogoutScreen from '../screens/LogoutScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e2e8f0',
          borderTopWidth: 1,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#0f172a',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={NamazTable}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Qaza"
        component={QazaScreen}
        options={{ tabBarLabel: 'Qaza' }}
      />
      <Tab.Screen
        name="Fine"
        component={FineScreen}
        options={{ tabBarLabel: 'Fine' }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{ tabBarLabel: 'Logout' }}
      />
    </Tab.Navigator>
  );
}
