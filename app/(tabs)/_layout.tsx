import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRocket } from '@/contexts/RocketContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { teacherMode } = useRocket();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tutorial"
        options={{
          title: 'Tutorial',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(debug)/gameTests"
        options={{
          title: 'game menu (debug)',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="wrench.and.screwdriver" color={color} />,
        }}
      />
      {teacherMode && (
        <Tabs.Screen
          name="teacher"
          options={{
            title: 'Teacher',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="graduationcap.fill" color={color} />,
          }}
        />
      )}
    </Tabs>
  );
}
