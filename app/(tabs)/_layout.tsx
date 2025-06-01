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
          tabBarActiveTintColor: '#a182ff',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="sparkles" color={color} />,
        }}
      />

      <Tabs.Screen
        name="exams"
        options={{
          title: 'Testy',
          tabBarActiveTintColor: '#ffb163',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="doc.text" color={color} />,
        }}
      />
      <Tabs.Screen
        name="commonMistakes"
        options={{
          title: 'Pokrok',
          tabBarActiveTintColor: '#6eff63',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="clock.arrow.circlepath" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tutorial"
        options={{
          title: 'Určování',
          tabBarActiveTintColor: '#63b9ff',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'O aplikaci',
          tabBarActiveTintColor: '#ffffff',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="info.circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
