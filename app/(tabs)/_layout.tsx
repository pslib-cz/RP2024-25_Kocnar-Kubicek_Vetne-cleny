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
          backgroundColor: '#101223',
          borderColor: '#101223',
          borderBottomWidth: 10,
          boxSizing: 'border-box',
        },
        tabBarIconStyle: {
          width: 32,
          height: 32,
        },
        
      }}>
      <Tabs.Screen
        name="index"
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
        name="commonMistakes"
        options={{
          title: 'Časté chyby',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="exclamationmark.triangle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(debug)/gameTests"
        options={{
          title: 'TESTOVACÍ',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="wrench.and.screwdriver" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tutorial"
        options={{
          title: 'Návod',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="book" color={color} />,
        }}
      />
    </Tabs>
  );
}
