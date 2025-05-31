import ArenaHeader from '@/components/ArenaHeader';
import PlanetView from '@/components/PlanetView';
import BigassButton from '@/components/ui/BigassButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useGameContext } from '@/contexts/GameContext';

const ArenaPlanet: React.FC = () => {
  const { newGameInArena } = useGameContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ArenaHeader />
        <TouchableOpacity
          style={styles.planetContainer}
          onPress={() => router.push('/arenagalaxies')}
        >
          <PlanetView />
        </TouchableOpacity>
        <BigassButton
          title={"Další cvičení"}
          bgEmoji="🚀"
          onPress={newGameInArena}
        />
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
  planetContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center', // Ensure the planet is centered vertically
    marginTop: 0,
  },
});

export default ArenaPlanet;