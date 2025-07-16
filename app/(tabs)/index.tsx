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
import { ThemedText } from '@/components/ThemedText';
const ArenaPlanet: React.FC = () => {
  const { newGameInArena } = useGameContext();
  const { selectedPlanet, selectedGalaxy } = useGalaxyContext();
  const { leaveGame } = useMultiplayerGameContext();

  const translatePlanetType = (planetType: string) => {
    switch (planetType) {
      case 'ring':
        return 'Plynný obr';
      case 'sun':
        return 'Hvězda';
      case 'hole':
        return 'Černá díra';
      case 'normal':
        return 'Planeta';
      default:
        return planetType;
    }
  }

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
          <View style={{ marginBottom: 12, flexDirection: 'column', alignItems: 'center', width: '100%', gap: 4 }}>
            <ThemedText type="subtitle" style={{ fontSize: 16, color: '#888' }}>{translatePlanetType(selectedPlanet.planetType)} • {selectedPlanet.planetIndex+1}/{selectedGalaxy==0?25:8}</ThemedText>
            <ThemedText type="title">{selectedPlanet.name}</ThemedText>
          </View>
          <View style={styles.buttonContainer}>
            <PlayfulButton
              title="Další cvičení"
              onPress={newGameInArena}
              variant="primary"
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
    justifyContent: 'center',
    marginTop: 0,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  card: {
    backgroundColor: '#1c1f3d',
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
    marginBottom: 16
  },
});

export default ArenaPlanet;