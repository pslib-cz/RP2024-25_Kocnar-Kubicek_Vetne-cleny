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
import { ConfigProvider } from '@/contexts/ConfigContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GameProvider } from '@/contexts/GameContext';
import React from 'react';
import { LevelProvider } from '@/contexts/levelContext';
import { FileSystemStuffProvider } from '@/contexts/FileSystemStuffContext';
import { CommonMistakesProvider } from '@/contexts/CommonMistakesContext';

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
    <ConfigProvider>
      <FileSystemStuffProvider>
        <GalaxyProvider>
          <RocketProvider>
            <LevelProvider>
              <MultiplayerGameProvider>
                <CommonMistakesProvider>
                  <GameProvider>Add commentMore actions
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                      <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" />
                        <Stack.Screen name="games/game" />
                        {/* <Stack.Screen name="tutorial" /> */}
                      </Stack>
                      <StatusBar style="light" translucent backgroundColor='transparent' />
                    </ThemeProvider>
                  </GameProvider>
                </CommonMistakesProvider>
              </MultiplayerGameProvider>
            </LevelProvider>
          </RocketProvider>
        </GalaxyProvider>
      </FileSystemStuffProvider>
    </ConfigProvider>
  );
}
