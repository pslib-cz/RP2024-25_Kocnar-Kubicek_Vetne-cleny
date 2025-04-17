import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArenaHeader from '@/components/ArenaHeader';

const games = [
  { id: '(games)/game1', name: 'Game 1' },
  { id: '(games)/game1Inverted', name: 'Game 1 inverted' },
  { id: '(games)/game2', name : 'Game 2'},
  { id: '(games)/game2Multi', name : 'Game 2 Multi'},
  { id: '(games)/game3', name : 'Game 3'},
  // Add more games here
];

const GameTests: React.FC = () => {
  const navigation = useNavigation();

  //console.log(navigation.getState())

  const handleGameSelect = (gameId: string) => {
    navigation.navigate(gameId as never); // Navigate to the selected game
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