import React from 'react';
import { View, StyleSheet } from 'react-native';
import GalaxyView from '@/components/GalaxyView';
import ArenaHeader from '@/components/ArenaHeader';
import { useRouter } from 'expo-router';
import PlanetDetailModal from '@/components/modals/PlanetDetailModal';
import PageWrapper from '@/components/PageWrapper';

const ArenaGalaxies: React.FC = () => {
  const router = useRouter();
  const [openedIndex, setOpenedIndex] = React.useState<number | undefined>(undefined);

  return (
    <PageWrapper>
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
    </PageWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101223',
  },
});

export default ArenaGalaxies;