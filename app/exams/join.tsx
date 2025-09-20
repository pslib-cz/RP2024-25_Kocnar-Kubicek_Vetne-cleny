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
import { useGameContext } from '@/contexts/GameContext';
import { ThemedText } from '@/components/ThemedText';
import { galaxies } from '@/components/ArenaHeader';
import { GameType } from '@/types/GameType';
import PageWrapper from '@/components/PageWrapper';
import { generateRandomPlanet } from '@/utils/randomPlanetGenerator';
import { OrbitingPlayers } from '@/components/OrbitingPlayers';

export default function JoinGameScreen() {
  const [code, setCode] = useState('');
  const [randomPlanet, setRandomPlanet] = useState<any>(null);
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
      
      // Generate random planet based on the game code as seed
      const seed = parseInt(codeToUse, 10) || Math.floor(Math.random() * 1000000);
      const planet = generateRandomPlanet(seed);
      setRandomPlanet(planet);
    } catch (error) {
      alert('Nepodařilo se připojit ke hře. Zkontrolujte prosím kód a zkuste to znovu.');
      console.warn('Error joining game:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await leaveGame();
      setCode('');
      setRandomPlanet(null);
      router.replace('/exams');
    } catch (error) {
      console.warn('Error leaving game:', error);
      alert('Nepodařilo se opustit hru. Zkuste to prosím znovu.');
    }
  };

  const handleStartExam = async () => {
    console.log('Starting exam...');
    console.log('Config:', config);
    if (config.difficulty && config.galaxy >= 0) {
      try {
        if (isNaN(config.questionCount) || config.questionCount < 1 || config.questionCount > 100) {
          alert('Prosím zadejte platný počet otázek (1-100)');
          return;
        };
        
        // Convert seed to number if it's a string
        const seedNumber = config.seed ? 
          (typeof config.seed === 'string' ? parseInt(config.seed, 16) : config.seed) : 
          Math.floor(Math.random() * 1000000);
        
        console.log('Using seed:', seedNumber, 'Type:', typeof seedNumber);
        
        newGame({
          galaxy: config.galaxy,
          difficulty: config.difficulty / 100,
          count: config.questionCount,
          questionTypesBitfield: config.questiontypes,
          seed: seedNumber,
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.title} type="title">Sdílený test</ThemedText>

        {/* Planet with orbiting players */}
        {randomPlanet && (
          <View style={styles.planetSection}>
            <View style={styles.planetContainer}>
              <Image
                source={randomPlanet.imageSource}
                style={[
                  styles.planetImage,
                  {
                    width: 250,
                    height: 250,
                  }
                ]}
                resizeMode="contain"
              />
            </View>
            <OrbitingPlayers
                planetSize={200}
                players={players.concat(author ? [author] : [])}
                containerWidth={350}
                code={parseInt(contextCode || '0', 10)}
              />
          </View>
        )}

        {/* Compact game info */}
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
              <View style={{ flex: 1 }} />
              <Image source={galaxyImages[config.galaxy]} style={styles.galaxyIcon} />
              <ThemedText style={[styles.infoValue, { flex: 0 }]}>{galaxies[config.galaxy].name}</ThemedText>
            </View>
          </View>
          {/* autor hry */}
          {author && (
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Autor testu:</ThemedText>
            <PlayerRocket
            player={author}
            width={30}
            height={30}
            containerStyle={styles.compactRocketContainer}
            textStyle={styles.compactPlayerName}
          />
          </View>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <PlayfulButton
            title="Opustit hru"
            icon={<Ionicons name="exit-outline" size={20} color="white" />}
            onPress={handleCancel}
            variant="danger"
            style={{ width: 'auto', flex: 1 }}
          />
          <PlayfulButton
            title="Začít hru"
            icon={<Ionicons name="rocket" size={20} color="white" />}
            onPress={handleStartExam}
            variant="success"
            style={{ width: 'auto', flex: 1 }}
          />
        </View>
      </ScrollView>
    )
  }

  return (
    <PageWrapper>
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
            <View style={[styles.joinContainer, { marginBottom: 69 }]}>
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
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101223',
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 20,
  },
  joinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
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
    width: '100%',
    backgroundColor: '#040a38cc',
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: '#4A5BD2',
    marginBottom: 15,
    zIndex: 2,
    position: 'relative',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    width: '100%',
  },
  galaxyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
    gap: 10,
  },
  galaxyIcon: {
    width: 48,
    height: 30,
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
  },
  // Compact player card styles
  compactPlayerCard: {
    width: '100%',
    backgroundColor: 'rgba(74, 91, 210, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#4A5BD2',
    marginBottom: 12,
    alignItems: 'center',
  },
  compactPlayerTitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  compactRocketContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  compactPlayerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  compactPlayersList: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  compactPlayerItem: {
    marginBottom: 4,
  },
  planetSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: -25, // Negative margin to hide bottom half behind info card
    zIndex: 1,
    position: 'relative',
  },
  planetTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  planetContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 250,
  },
  planetImage: {
    borderRadius: 50,
    marginTop: 50,
  },
});