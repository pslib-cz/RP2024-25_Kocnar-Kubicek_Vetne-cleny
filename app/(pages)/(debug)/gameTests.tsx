import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import ArenaHeader from '@/components/ArenaHeader';
// import { GameRoute } from '@/constants/gameRoute';
import { GameType, useGameContext } from '@/contexts/GameContext';
import { useRouter } from 'expo-router';
import { useLevelContext } from '@/contexts/levelContext';
import { QuestionType } from '@/constants/questionGeneratorParams';

const games : {id : QuestionType, name: string}[] = [
  {id: QuestionType.MARK_WORDS, name: 'Mark Words'},
  {id: QuestionType.MARK_TYPES, name: 'Mark Types'},
  {id: QuestionType.MARK_WORDS_ALL_TYPES, name: 'Mark Words All Types'},
  {id: QuestionType.MARK_TYPE_ONE_WORD, name: 'Mark Type One Word'},
  {id: QuestionType.SELECT_MULTIPLE, name: 'Select Multiple'},
  {id: QuestionType.SELECT_MULTIPLE_W_SENTENCE, name: 'Select Multiple with Sentence'},
  {id: QuestionType.SELECT_ONE_W_SENTENCE, name: 'Select One with Sentence'},
  {id: QuestionType.SELECT_TYPE, name: 'Select Type'},
]

const GameTests: React.FC = () => {
  const { newGameWithQuestions } = useGameContext();
  const { resetLevelData } = useLevelContext();

  const navigation = useRouter();

  const handleGameSelect = (gameId: QuestionType) => {
    navigation.push("games/game" as never)
    newGameWithQuestions([{
      SOURCE: [{text: "Test", type: "po"}, {text: "Test", type: "po"}, {text: "Test", type: "po"}, {text: "Test", type: "po"}],
      TEMPLATE: [1,0,gameId],
      INDEX: 1,
      WANTED: "pu přípustky"
    }], GameType.PRACTICE)
    resetLevelData()
  };

  //console.log("GameTests rendered with games:", games, typeof games[0].id);

  return (
    <View style={styles.container}>
      <ArenaHeader />
      <Text style={styles.title}>Select a Game to Test</Text>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gameButton}
            onPress={() => handleGameSelect(item.id as QuestionType)}
          >
            <Text style={styles.gameButtonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.gameButton}
        onPress={() => {
          navigation.push("games/resultScreen" as never)
          resetLevelData()
        }}
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