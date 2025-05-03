import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMultiplayerGameContext } from '@/contexts/MultiplayerGameContext';
import { useRocket } from '@/contexts/RocketContext';

export default function JoinGameScreen() {
  const [code, setCode] = useState('');
  const { joinGame, code: contextCode, config, leaveGame } = useMultiplayerGameContext();
  const router = useRouter();
  const rocket = useRocket();
  const params = useLocalSearchParams();

  useEffect(() => {
    // If there's a code in the URL params, set it and attempt to join
    if (params.code && !contextCode) {
      setCode(params.code as string);
      handleJoinGame(params.code as string);
    }
  }, [params.code]);

  const handleJoinGame = async (gameCode?: string) => {
    try {
      const codeToUse = gameCode || code;
      if (!codeToUse) return;

      await joinGame(codeToUse);
    } catch (error) {
      alert('Failed to join game. Please check the code and try again.');
      console.error('Error joining game:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await leaveGame();
      setCode('');
      router.push('/exams');
    } catch (error) {
      console.error('Error leaving game:', error);
      alert('Failed to leave game. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {!contextCode ? (
        <>
          <Text style={styles.title}>Join a Game</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Game Code"
            placeholderTextColor="#888"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.joinButton} onPress={() => handleJoinGame()}>
            <Text style={styles.joinButtonText}>Join Game</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.gameInfoContainer}>
          <Text style={styles.title}>Game Details</Text>
          <Text style={styles.infoText}>Game Code: {contextCode}</Text>
          <Text style={styles.infoText}>Your ID: {rocket.userId}</Text>
          <Text style={styles.infoText}>Difficulty: {config.difficulty}%</Text>
          <Text style={styles.infoText}>Galaxy: {config.galaxy}</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <Text style={styles.backButtonText}>Leave</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startButton} /*onPress={() => router.push(`/games/...`)}*/>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  joinButton: {
    backgroundColor: '#4A5BD2',
    padding: 15,
    borderRadius: 8,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameInfoContainer: {
    alignItems: 'center',
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4A5BD2',
    borderRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});