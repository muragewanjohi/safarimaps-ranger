import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.75)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: true,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: '#2E7D32',
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 20,
            height: 88 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 12,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderWidth: 0,
          },
          android: {
            backgroundColor: '#2E7D32',
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 20,
            height: 76 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 12,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderWidth: 0,
          },
          default: {
            backgroundColor: '#2E7D32',
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 20,
            height: 76 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 12,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderWidth: 0,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 6,
          letterSpacing: 0.3,
          lineHeight: 14,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          paddingHorizontal: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? "house.fill" : "house"} 
              color={color || (focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)')} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? "map.fill" : "map"} 
              color={color || (focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)')} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? "exclamationmark.triangle.fill" : "exclamationmark.triangle"} 
              color={color || (focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)')} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? "person.fill" : "person"} 
              color={color || (focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)')} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
