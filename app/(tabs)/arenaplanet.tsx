import ArenaHeader from '@/components/ArenaHeader';
import PlanetView from '@/components/PlanetView';
import BigassButton from '@/components/ui/BigassButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useGameContext } from '@/contexts/GameContext';

const ArenaPlanet: React.FC = () => {
  const { newGameWithCount } = useGameContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Title */}
        <ArenaHeader />
        {/* Planet view */}
        <TouchableOpacity
          style={styles.planetContainer}
          onPress={() => router.push('/arenagalaxies')}
        >
          <PlanetView />
        </TouchableOpacity>

        {/* Next task button */}
        <BigassButton
          title={"Další cvičení"}
          bgEmoji="🚀"
          onPress={newGameWithCount}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  progressContainer: {
    width: '90%',
    height: 40,
    backgroundColor: '#222',
    borderRadius: 20,
    marginBottom: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    width: '30%',
    height: '100%',
    borderRadius: 20,
  },
  rocketContainer: {
    position: 'absolute',
    top: 0,
    left: '28%',
    height: '100%',
    justifyContent: 'center',
  },
  rocket: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rocketEmoji: {
    fontSize: 20,
  },
  planetContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center', // Ensure the planet is centered vertically
    marginTop: 0,
  },
  marker: {
    position: 'absolute',
    borderRadius: 25,
  },
  whiteDot: {
    width: 25,
    height: 25,
    backgroundColor: '#f1faee',
    top: 30,
    right: 90,
  },
  yellowDot: {
    width: 30,
    height: 30,
    backgroundColor: '#ffb703',
    top: '50%',
    left: 40,
  },
  greenDot1: {
    width: 30,
    height: 30,
    backgroundColor: '#2a9d8f',
    top: '50%',
    right: 40,
  },
  greenDot2: {
    width: 35,
    height: 35,
    backgroundColor: '#2a9d8f',
    bottom: 40,
    right: 70,
  },
  pathLine1: {
    position: 'absolute',
    top: 45,
    left: 130,
    width: 4,
    height: 100,
    backgroundColor: '#fff',
    transform: [{ rotate: '35deg' }],
    opacity: 0.7,
  },
  pathLine2: {
    position: 'absolute',
    top: 125,
    left: 80,
    width: 110,
    height: 4,
    backgroundColor: '#fff',
    opacity: 0.7,
  },
  pathLine3: {
    position: 'absolute',
    top: 120,
    right: 60,
    width: 4,
    height: 80,
    backgroundColor: '#fff',
    transform: [{ rotate: '20deg' }],
    opacity: 0.7,
  },
  levelText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
  },
  nextTaskButton: {
    marginTop: 20,
    width: '80%',
  },
});

export default ArenaPlanet;