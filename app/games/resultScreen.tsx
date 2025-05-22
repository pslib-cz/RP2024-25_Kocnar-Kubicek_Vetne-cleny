import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { NEXT_LEVEL_TRESHOLD, useGameContext } from '@/contexts/GameContext';
import PlanetView from '@/components/PlanetView';
import { useMultiplayerGameContext } from '@/contexts/MultiplayerGameContext';

const PracticeCompleteScreen = () => {
  const navigation = useRouter();

  const { getDuration, getSuccessRate } = useGameContext();
  const { newGameWithCount, commonMistakes, newGameWithCount_CommonMistakes } = useGameContext();
  const { code } = useMultiplayerGameContext();

  const ResultStuff = ({text, value, color} : {text : string, value : string, color : string}) => {
    return(
      <View style={[styles.statBox, { backgroundColor: color }]}>
        <View style={styles.iconContainer}>
          <FontAwesome name="bolt" size={24} color="white" />
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
    const r = Math.round(255 + (80 - 255) * t);
    const g = Math.round(85 + (250 - 85) * t);
    const b = Math.round(85 + (123 - 85) * t);
    return `rgb(${r},${g},${b})`;
  };

  const successRateColor = getSuccessRateColor(successRate);

  const resultScreenPractice = () => {
    return (
      <View style={styles.container}>
        <PlanetView displayName={false}/>

        <Text style={styles.title}>{successRate >= NEXT_LEVEL_TRESHOLD ? "Úroveň dokončena!" : "Úroveň nesplněna!"}</Text>
        <Text style={{color: "white", marginBottom: 16}}>Pro odemčení další úrovně je nutné mít úspěšnost alespoň {NEXT_LEVEL_TRESHOLD}%</Text>

        <View style={styles.statsContainer}>
          <ResultStuff text="Time" value={`${getDuration()}s`} color="#6272A4" />
          <ResultStuff text="Success rate" value={`${successRate.toFixed(2)}%`} color={successRateColor} />
        </View>
  
        <Button title={successRate >= NEXT_LEVEL_TRESHOLD ? "Další level" : "Zkusit znovu"} filled={true} onPress={newGameWithCount} />
        <Button title="Domů" filled={false} onPress={() => navigation.navigate('/' as never)} />
      </View>
    )
  }

  const resultScreenMultiplayer = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Jsi 10 z 9!
        </Text>

        <View style={styles.statsContainer}>
          <ResultStuff text="Time" value={`${getDuration()}s`} color="#6272A4" />
          <ResultStuff text="Success rate" value={`${successRate.toFixed(2)}%`} color={successRateColor} />
        </View>
  
        <Button title={successRate >= NEXT_LEVEL_TRESHOLD ? "Další level" : "Zkusit znovu"} filled={true} onPress={newGameWithCount} />
        <Button title="Domů" filled={false} onPress={() => navigation.navigate('/' as never)} />
      </View>
    )
  }

  const commonMistakesScreen = () => {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { textAlign: 'center' }]}>
          Procvičování chyb dokončeno!
        </Text>

        <View style={styles.statsContainer}>
          <ResultStuff text="Time" value={`${getDuration()}s`} color="#6272A4" />
          <ResultStuff text="Success rate" value={`${successRate.toFixed(2)}%`} color={successRateColor} />
        </View>
  
        <Button title={"Zkusit znovu"} filled={true} onPress={newGameWithCount_CommonMistakes} />
        <Button title="Domů" filled={false} onPress={() => navigation.navigate('/' as never)} />
      </View>
    )
  }

  console.log(`Finished screen with code: ${code}, commonMistakes: ${commonMistakes}`);

  //if (code) return resultScreenMultiplayer();
  if (true) return commonMistakesScreen();
  return resultScreenPractice();
};

function Button({ title, filled, onPress } : { title: string, filled: boolean, onPress: () => void })
{
  return (
    <TouchableOpacity
      style={[
        styles.continueButton,
        filled ? styles.buttonFilled : null
      ]}
      onPress={onPress}
    >
      <Text style={styles.continueButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F1FA8C',
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
});

export default PracticeCompleteScreen;