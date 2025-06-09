import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import GalaxyView from '@/components/GalaxyView';
import ArenaHeader from '@/components/ArenaHeader';
import { useRouter } from 'expo-router';
import AndroidSafeArea from '@/components/AndroidSafeArea';

const ArenaGalaxies: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, AndroidSafeArea.AndroidSafeArea]}>
      <View style={styles.container}>
        <ArenaHeader
          onBackPress={() => router.back()}
        />
        <GalaxyView />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101223',
  },
  container: {
    flex: 1,
    backgroundColor: '#101223',
  },
});

export default ArenaGalaxies;