import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import GalaxyView from '@/components/GalaxyView';
import ArenaHeader from '@/components/ArenaHeader';
import { useRouter } from 'expo-router';
import AndroidSafeArea from '@/components/AndroidSafeArea';
import PlanetDetailModal from '@/components/modals/PlanetDetailModal';

const ArenaGalaxies: React.FC = () => {
  const router = useRouter();

  const [openedIndex, setOpenedIndex] = React.useState<number | undefined>(undefined);

  return (
    <SafeAreaView style={[styles.safeArea, AndroidSafeArea.AndroidSafeArea]}>
      <PlanetDetailModal
        visible={openedIndex !== undefined}
        onClose={() => setOpenedIndex(undefined)}
        id={openedIndex}
        closeButtonText="cool"
      />

      <View style={styles.container}>
        <ArenaHeader
          onBackPress={() => router.back()}
        />
        <GalaxyView setOpenedIndex={setOpenedIndex} />
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