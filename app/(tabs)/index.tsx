import { Image, StyleSheet, Platform, ScrollView, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import BigassButton from '@/components/ui/BigassButton';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import React from 'react';
import { loadSvgAsset } from './profile';

export default function HomeScreen()
{
  const router = useRouter();

  const rocket1 = require('../../assets/images/rockets/rocket1.svg');

  const [svg, setSvg] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSvg = async () => {
      setSvg(await loadSvgAsset(rocket1));
    };
    fetchSvg();
  }, []);


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16, alignItems: 'center' }}>

      <View onTouchStart={() => {
        router.push('/profile');
      }}>
        <SvgXml xml={svg} width={200} height={200} />
        <ThemedText type="title">Míša</ThemedText>
      </View>

      <BigassButton title='⛷️ Procvičování' bgEmoji='⛷️' onPress={() => {
      
      }}/>
      <BigassButton title='🙀 Test' bgEmoji='🙀' onPress={() => {

      }}/>
      <BigassButton title='🏢 Tutoriál' bgEmoji='💀' onPress={() => 
      router.push('/tutorial')
      }/>

      <ThemedText type="subtitle">Nejčastější chyby</ThemedText>
    </ScrollView>
  );
}

function HomeScreen1() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

