import { RocketProvider } from '@/contexts/RocketContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GalaxyProvider } from '@/contexts/GalaxyContext';
import { MultiplayerGameProvider } from '@/contexts/MultiplayerGameContext';

import { useColorScheme } from '@/hooks/useColorScheme';
import { GameProvider } from '@/contexts/GameContext';
import React from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Outfit: require('../assets/fonts/Outfit.ttf'),
    PT: require('../assets/fonts/PT.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GalaxyProvider>
      <RocketProvider>
        <MultiplayerGameProvider>
          <GameProvider>          
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
                <Stack.Screen name="games/game1" options={{ animation: 'none' }} />
                <Stack.Screen name="games/game1AllTypes" options={{ animation: 'none' }} />
                <Stack.Screen name="games/game1Inverted" options={{ animation: 'none' }} />
                <Stack.Screen name="games/game2" options={{ animation: 'none' }} />
                <Stack.Screen name="games/game2Multi" options={{ animation: 'none' }} />
                <Stack.Screen name="games/game3" options={{ animation: 'none' }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>          
          </GameProvider>
        </MultiplayerGameProvider>
      </RocketProvider>
    </GalaxyProvider>
  );
}
