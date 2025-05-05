import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMultiplayerGameContext } from '@/contexts/MultiplayerGameContext';
import { useRocket } from '@/contexts/RocketContext';
import BigassButton from '@/components/ui/BigassButton';

export default function JoinGameScreen() {
  const [code, setCode] = useState('');
  const { joinGame, code: contextCode, config, leaveGame } = useMultiplayerGameContext();
  const router = useRouter();
  const rocket = useRocket();
  const params = useLocalSearchParams();

  useEffect(() => {
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!contextCode ? (
          <View style={styles.joinContainer}>
            <Text style={styles.title}>Join a Game</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter Game Code"
                placeholderTextColor="#888"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
              />
            </View>
            <BigassButton
              title="Join Game"
              bgEmoji="🎮"
              onPress={() => handleJoinGame()}
            />
          </View>
        ) : (
          <View style={styles.gameInfoContainer}>
            <Text style={styles.title}>Game Details</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Game Code:</Text>
                <Text style={styles.infoValue}>{contextCode}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Difficulty:</Text>
                <Text style={styles.infoValue}>{config.difficulty}%</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Galaxy:</Text>
                <Text style={styles.infoValue}>{config.galaxy}</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <BigassButton
                title="Leave Game"
                bgEmoji="🚪"
                onPress={handleCancel}
              />
              <BigassButton
                title="Start Game"
                bgEmoji="🚀"
                onPress={() => router.push('/arenagalaxies')}
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  infoCard: {
    width: '90%',
    backgroundColor: 'rgba(74, 91, 210, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#4A5BD2',
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
  },
  infoValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
});