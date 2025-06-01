import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMultiplayerGameContext } from '@/contexts/MultiplayerGameContext';
import PlayfulButton from '@/components/ui/PlayfulButton';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { NamedRocket } from '@/components/NamedRocket';
import { PlayerRocket } from '@/components/PlayerRocket';
import { galaxyImages } from '@/data/galaxyImages';
import { GameType, useGameContext } from '@/contexts/GameContext';
import { ThemedText } from '@/components/ThemedText';
import { galaxies } from '@/components/ArenaHeader';
import AndroidSafeArea from '@/components/AndroidSafeArea';

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
      router.replace('/exams');
    } catch (error) {
      console.warn('Error leaving game:', error);
      alert('Nepodařilo se opustit hru. Zkuste to prosím znovu.');
    }
  };

  const handleStartExam = async () => {
    if (config.difficulty && config.galaxy >= 0) {
      try {
        if (isNaN(config.questionCount) || config.questionCount < 1 || config.questionCount > 100) {
          alert('Prosím zadejte platný počet otázek (1-100)');
          return;
        }; +
          newGame({
            galaxy: config.galaxy,
            difficulty: config.difficulty / 100,
            count: config.questionCount,
            questionTypesBitfield: config.questiontypes,
          }, GameType.TEST);
      } catch (error) {
        alert('Nepodařilo se spustit cvičení. Zkuste to znovu.');
        console.warn('Error starting exam:', error);
      }
    } else {
      alert('Prosím vyberte obtížnost a galaxii před spuštěním cvičení.');
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const JoinGameDetail = () => {
    return (
      <ScrollView contentContainerStyle={[styles.scrollContent, { alignItems: 'center', justifyContent: 'center', gap: 30, paddingVertical: 20, }]}>
        {/* <View style={styles.gameInfoContainer}> */}
        <ThemedText style={styles.title} type="title">Detaily hry</ThemedText>

        {/* User info section */}
        <View style={styles.playerInfoCard}>
          <ThemedText style={styles.playerInfoTitle}>Tvoje raketa</ThemedText>
          <NamedRocket
            width={70}
            height={70}
            containerStyle={styles.namedRocketContainer}
            textStyle={styles.playerName}
          />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Kód hry:</ThemedText>
            <ThemedText style={styles.infoValue}>{contextCode}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Obtížnost:</ThemedText>
            <ThemedText style={styles.infoValue}>{config.difficulty}%</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Galaxie:</ThemedText>
            <View style={styles.galaxyInfo}>
              <Image source={galaxyImages[config.galaxy]} style={styles.galaxyIcon} />
              <ThemedText style={styles.infoValue}>{galaxies[config.galaxy].name}</ThemedText>
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
        {/* </View> */}
        
        {/* Game author section */}
        {author && (
          <View style={styles.playerInfoCard}>
            <ThemedText style={styles.playerInfoTitle}>Autor hry</ThemedText>
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
            <ThemedText style={styles.playerInfoTitle}>Účastníci ({players.length})</ThemedText>
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
      </ScrollView>
    )
  }

  return (
    <SafeAreaView style={[styles.safeArea, AndroidSafeArea.AndroidSafeArea]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 20 }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="white" />
            <Text style={{ color: 'white', fontSize: 16, marginLeft: 4 }}>Zpět</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }} />
      </View>
      <View style={styles.container}>
        {!contextCode ? (
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.joinContainer}>
            <ThemedText style={styles.title} type="title">Připojit se ke hře</ThemedText>

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
          </TouchableWithoutFeedback>
        ) : (
            <JoinGameDetail />
          )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101223',
  },
  container: {
    flex: 1,
    backgroundColor: '#101223',
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
  // gameInfoContainer: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   gap: 30,
  //   paddingVertical: 20,
  // },
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