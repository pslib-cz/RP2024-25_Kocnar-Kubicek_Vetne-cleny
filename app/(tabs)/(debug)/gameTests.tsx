import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import ArenaHeader from '@/components/ArenaHeader';
import { GameRoute } from '@/constants/gameRoute';
import { useGameContext } from '@/contexts/GameContext';
import { useRouter } from 'expo-router';
import { useLevelContext } from '@/contexts/levelContext';

const games = Object.entries(GameRoute).map(([key, value]) => ({
  id: value,
  name: key.replace(/_/g, ' '),
}));

const GameTests: React.FC = () => {

  const { loadLevel } = useGameContext();  
  const { resetLevelData } = useLevelContext();

  //console.log(navigation.getState())

  const navigation = useRouter();

  const handleGameSelect = (gameId: GameRoute) => {
    navigation.push("games/game" as never)
    loadLevel(gameId)
    resetLevelData()
  };

  return (
    <View style={styles.container}>
      <ArenaHeader/>
      <Text style={styles.title}>Select a Game to Test</Text>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gameButton}
            onPress={() => handleGameSelect(item.id)}
          >
            <Text style={styles.gameButtonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  gameButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  gameButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameTests;