import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { NEXT_LEVEL_TRESHOLD, useGameContext } from '@/contexts/GameContext';
import PlanetView from '@/components/PlanetView';
import { useMultiplayerGameContext } from '@/contexts/MultiplayerGameContext';
import { GameType } from '@/types/GameType';
import PlayfulButton from '@/components/ui/PlayfulButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const PracticeCompleteScreen = () => {
  const navigation = useRouter();

  const { getDuration, getSuccessRate } = useGameContext();
  const { newGameInArena, gameType, newGameWitMostCommonMistakes } = useGameContext();
  const { code } = useMultiplayerGameContext();

  const ResultStuff = ({ text, value, color, icon }: { text: string, value: string, color: string, icon: 'timer' | 'star' }) => {
    return (
      <View style={[styles.statBox, { backgroundColor: color }]}>
        <View style={styles.iconContainer}>
          <MaterialIcons name={icon} size={24} color="white" />
        </View>
        <Text style={styles.statLabel}>{text}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    )
  }

  const successRate = getSuccessRate();

  // Calculate color from red (10%) to green (90%)
  const getSuccessRateColor = (rate: number) => {
    // Clamp rate between 10 and 90
    const clamped = Math.max(10, Math.min(90, rate));
    // Linear interpolation between red (#FF5555) and green (#50FA7B)
    // Red:   r=255, g=85,  b=85
    // Green: r=80,  g=250, b=123
    const t = (clamped - 10) / 80; // 0 at 10%, 1 at 90%
    const r = Math.round(215 + (80 - 255) * t);
    const g = Math.round(45 + (250 - 85) * t);
    const b = Math.round(45 + (123 - 85) * t);
    return `rgb(${r},${g},${b})`;
  };

  const successRateColor = getSuccessRateColor(successRate);

  const resultScreenPractice = () => {
    return (
      <SafeAreaView style={styles.container}>
        <PlanetView displayName={false} />

        <Text style={styles.title}>{successRate >= NEXT_LEVEL_TRESHOLD ? "Úroveň dokončena!" : "Úroveň nesplněna!"}</Text>
        <Text style={{ color: "white", marginBottom: 16, textAlign: "center" }}>Pro cestu na další misi je nutné mít úspěšnost alespoň {NEXT_LEVEL_TRESHOLD}%.</Text>

        <View style={styles.statsContainer}>
          <ResultStuff text="Čas" value={`${getDuration()}s`} color="#6272A4" icon="timer" />
          <ResultStuff text="Úspěšnost" value={`${successRate.toFixed(1)}%`} color={successRateColor} icon="star" />
        </View>

        <View style={styles.buttonContainer}>
          <View style={[styles.buttonWrapper, { flex: 3 }]}>
            <PlayfulButton variant='custom' title={successRate >= NEXT_LEVEL_TRESHOLD ? "Další mise" : "Zkusit znovu"} onPress={newGameInArena} customColors={[successRateColor, successRateColor]} />
          </View>
          <View style={[styles.buttonWrapper, { flex: 2 }]}>
            <PlayfulButton title="Domů" onPress={() => navigation.replace('/' as never)} />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  const resultScreenMultiplayer = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          Test dokončen!
        </Text>

        <View style={styles.statsContainer}>
          <ResultStuff text="Čas" value={`${getDuration()}s`} color="#6272A4" icon="timer" />
          <ResultStuff text="Úspěšnost" value={`${successRate.toFixed(2)}%`} color={successRateColor} icon="star" />
        </View>

        <PlayfulButton title="Domů" onPress={() => navigation.replace('/' as never)} />
      </SafeAreaView>
    )
  }

  const commonMistakesScreen = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={[styles.title, { textAlign: 'center' }]}>
          Procvičování chyb dokončeno!
        </Text>

        <View style={styles.statsContainer}>
          <ResultStuff text="Čas" value={`${getDuration()}s`} color="#6272A4" icon="timer" />
          <ResultStuff text="Úspěšnost" value={`${successRate.toFixed(2)}%`} color={successRateColor} icon="star" />
        </View>

        <PlayfulButton title={"Zkusit znovu"} onPress={newGameWitMostCommonMistakes} />
        <PlayfulButton title="Domů" onPress={() => navigation.replace('/' as never)} />
      </SafeAreaView>
    )
  }

  switch (gameType) {
    case GameType.TEST:
      return resultScreenMultiplayer();
    case GameType.TEST_PRACTICE:
      return resultScreenMultiplayer();
    case GameType.COMMON_MISTAKES:
      return commonMistakesScreen();
    default:
      return resultScreenPractice();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#101223',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    marginTop: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 40,
    gap: 10,
  },
  statBox: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    flexGrow: 1,
    flexBasis: 1,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
  },
  statLabel: {
    color: '#F8F8F2',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flexGrow: 1,
  },
  continueButton: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderColor: '#6272A4',
    borderWidth: 2,
    margin: 8
  },
  buttonFilled: {
    backgroundColor: '#6272A4',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
});

export default PracticeCompleteScreen;