import ArenaHeader from '@/components/ArenaHeader';
import PlanetView from '@/components/PlanetView';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { useGameContext } from '@/contexts/GameContext';
import PlayfulButton from '@/components/ui/PlayfulButton';
import { useGalaxyContext } from '@/contexts/GalaxyContext';
import { useMultiplayerGameContext } from '@/contexts/MultiplayerGameContext';
import { useFocusEffect } from '@react-navigation/native';
const ArenaPlanet: React.FC = () => {
  const { newGameInArena } = useGameContext();
  const { selectedPlanet } = useGalaxyContext();
  const { leaveGame } = useMultiplayerGameContext();

  useFocusEffect(
    React.useCallback(() => {
      leaveGame();
    }, [leaveGame])
  );

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <ArenaHeader />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.planetContainer}
          onPress={() => router.push('/arenagalaxies')}
        >
          <PlanetView displayName={false}/>
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
            {selectedPlanet.name}
          </Text>
          <View style={styles.buttonContainer}>
            <PlayfulButton
              title="Další cvičení"
              onPress={newGameInArena}
              variant="primary"
            />
            <PlayfulButton
              title="Nejčastější chyby"
              onPress={() => router.push('/commonMistakes')}
              variant="secondary"
            />
          </View>
        </View>

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
    alignItems: 'center',
  },
  planetContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center', // Ensure the planet is centered vertically
    marginTop: 0,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  card: {
    backgroundColor: '#181A2A',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 24,
    elevation: 8,
    minWidth: 320,
    maxWidth: 380,
    width: '90%',
    alignItems: 'center',
  },
});

export default ArenaPlanet;