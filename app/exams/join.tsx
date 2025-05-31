import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMultiplayerGameContext } from '@/contexts/MultiplayerGameContext';
import PlayfulButton from '@/components/ui/PlayfulButton';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { NamedRocket } from '@/components/NamedRocket';
import { PlayerRocket } from '@/components/PlayerRocket';
import { galaxyImages } from '@/data/galaxyImages';

// Import Galaxy names
import { Galaxy } from '@/types/Galaxy';
import { useGameContext } from '@/contexts/GameContext';

// Galaxy names to map from index
const galaxies: Galaxy[] = [
  { name: "Všechny členy", planetCount: 25 },
  { name: "Hlavní členy", planetCount: 8 },
  { name: "Přívlastky", planetCount: 8 },
  { name: "Přísl. určení", planetCount: 8 },
  { name: "Doplňky", planetCount: 8 },
];

export default function JoinGameScreen() {
  const [code, setCode] = useState('');
  const { joinGame, code: contextCode, config, leaveGame, author, players } = useMultiplayerGameContext();
  const { newGame } = useGameContext();
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.code && !contextCode) {
      setCode(params.code as string);
      handleJoinGame(params.code as string);
    }
  }, [params.code]);

  const handleJoinGame = async (gameCode?: string) => {
    try {
      Keyboard.dismiss(); // Dismiss keyboard when joining game
      const codeToUse = gameCode || code;
      if (!codeToUse) return;
      await joinGame(codeToUse);
    } catch (error) {
      alert('Nepodařilo se připojit ke hře. Zkontrolujte prosím kód a zkuste to znovu.');
      console.warn('Error joining game:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await leaveGame();
      setCode('');
      router.push('/exams');
    } catch (error) {
      console.warn('Error leaving game:', error);
      alert('Nepodařilo se opustit hru. Zkuste to prosím znovu.');
    }
  };

  const handleStartExam = async () => {
    if (config.difficulty && config.galaxy >= 0) {
      try {
        if (isNaN(config.questionCount) || config.questionCount < 1 || config.questionCount > 100) {
          alert('Please enter a valid number of questions (1-100)');
          return;
        };+
        newGame({
            galaxy: config.galaxy,
            difficulty: config.difficulty/100,
            count: config.questionCount,
            questionTypesBitfield: config.questiontypes,
        });
      } catch (error) {
        alert('Failed to start exam. Please try again.');
        console.warn('Error starting exam:', error);
      }
    } else {
      alert('Please select difficulty and galaxy before starting the exam.');
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {!contextCode ? (
            <View style={styles.joinContainer}>
              <Text style={styles.title}>Připojit se ke hře</Text>
              
              {/* User info section */}
              <View style={styles.playerInfoContainer}>
                <NamedRocket 
                  width={60} 
                  height={60} 
                  containerStyle={styles.namedRocketContainer}
                  textStyle={styles.playerName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Zadejte kód hry"
                  placeholderTextColor="#888"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={dismissKeyboard}
                  blurOnSubmit={true}
                />
              </View>
              <PlayfulButton
                title="Připojit se"
                icon={<Ionicons name="game-controller" size={24} color="white" />}
                onPress={() => handleJoinGame()}
                variant="primary"
              />
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.gameInfoContainer}>
                <Text style={styles.title}>Detaily hry</Text>
                
                {/* User info section */}
                <View style={styles.playerInfoCard}>
                  <Text style={styles.playerInfoTitle}>Tvoje raketa</Text>
                  <NamedRocket 
                    width={70} 
                    height={70} 
                    containerStyle={styles.namedRocketContainer}
                    textStyle={styles.playerName}
                  />
                </View>
                
                {/* Game author section */}
                {author && (
                  <View style={styles.playerInfoCard}>
                    <Text style={styles.playerInfoTitle}>Autor hry</Text>
                    <PlayerRocket 
                      player={author}
                      width={70} 
                      height={70}
                    />
                  </View>
                )}
                
                {/* Players section */}
                {players && players.length > 0 && (
                  <View style={styles.playerInfoCard}>
                    <Text style={styles.playerInfoTitle}>Účastníci ({players.length})</Text>
                    <View style={styles.playersList}>
                      {players.map(player => (
                        <PlayerRocket 
                          key={player.id}
                          player={player}
                          width={60} 
                          height={60}
                          containerStyle={styles.playerItem}
                        />
                      ))}
                    </View>
                  </View>
                )}
                
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Kód hry:</Text>
                    <Text style={styles.infoValue}>{contextCode}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Obtížnost:</Text>
                    <Text style={styles.infoValue}>{config.difficulty}%</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Galaxie:</Text>
                    <View style={styles.galaxyInfo}>
                      <Image source={galaxyImages[config.galaxy]} style={styles.galaxyIcon} />
                      <Text style={styles.infoValue}>{galaxies[config.galaxy].name}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <PlayfulButton
                    title="Opustit hru"
                    icon={<Ionicons name="exit-outline" size={24} color="white" />}
                    onPress={handleCancel}
                    variant="danger"
                  />
                  <PlayfulButton
                    title="Začít hru"
                    icon={<Ionicons name="rocket" size={24} color="white" />}
                    onPress={handleStartExam}
                    variant="success"
                  />
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  joinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 15,
    borderWidth: 2,
    borderColor: '#4A5BD2',
    borderRadius: 12,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: 'rgba(74, 91, 210, 0.1)',
  },
  gameInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    paddingVertical: 20,
  },
  infoCard: {
    width: '90%',
    backgroundColor: 'rgba(74, 91, 210, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#4A5BD2',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    color: '#888',
    fontSize: 16,
    flex: 1,
  },
  infoValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    marginTop: 10,
  },
  galaxyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  galaxyIcon: {
    width: 64,
    height: 40,
    marginRight: 10,
  },
  playerInfoContainer: {
    backgroundColor: 'rgba(74, 91, 210, 0.1)',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    width: '90%',
    borderWidth: 2,
    borderColor: '#4A5BD2',
  },
  playerInfoCard: {
    width: '90%',
    backgroundColor: 'rgba(74, 91, 210, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#4A5BD2',
    marginBottom: 10,
    alignItems: 'center',
  },
  playerInfoTitle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  namedRocketContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  playerName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  playersList: {
    width: '100%',
    gap: 10,
  },
  playerItem: {
    width: '100%',
    marginBottom: 8,
  }
});