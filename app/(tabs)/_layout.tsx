import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: undefined,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#000',
          marginTop: 10,
        },
        tabBarIconStyle: {
          width: 32,
          height: 32,
        },
        
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Domů',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="house" color={color} />,
        }}
      />

      <Tabs.Screen
        name="arenaplanet"
        options={{
          title: 'Aréna',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="sparkles" color={color} />,
        }}
      />

      <Tabs.Screen
        name="exams"
        options={{
          title: 'Testy',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="doc.text" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tutorial"
        options={{
          title: 'Návod',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(debug)/gameTests"
        options={{
          title: 'TESTOVACÍ',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="wrench.and.screwdriver" color={color} />,
        }}
      />
    </Tabs>
  );
}
