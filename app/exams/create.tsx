import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch, ScrollView, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { useMultiplayerGameContext } from '@/contexts/MultiplayerGameContext';
import { useRouter } from 'expo-router';

const galaxyImages = [
  require('@/assets/images/uni/g/1.png'),
  require('@/assets/images/uni/g/2.png'),
  require('@/assets/images/uni/g/3.png'),
  require('@/assets/images/uni/g/4.png'),
  require('@/assets/images/uni/g/5.png'),
];

export default function CreateGameScreen() {
  const [difficulty, setDifficulty] = useState(50);
  const [galaxy, setGalaxy] = useState(0);
  const [questionTypes, setQuestionTypes] = useState(0);
  const { createGame, code } = useMultiplayerGameContext();
  const router = useRouter();

  const toggleQuestionType = (typeIndex: number) => {
    setQuestionTypes((prev) => prev ^ (1 << typeIndex));
  };

  const handleStartExam = async () => {
    if (difficulty && galaxy >= 0) {
      try {
        await createGame({
          difficulty,
          galaxy,
          questionTypes,
          seed: Math.floor(Math.random() * 1000000), // Generate a random seed
        });
        router.push(`/exams/share?code=${code}`);
      } catch (error) {
        alert('Failed to create game. Please try again.');
        console.error('Error creating game:', error);
      }
    } else {
      alert('Please select difficulty and galaxy before starting the exam.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>Vytvořit test</ThemedText>

        {/* Difficulty Selection */}
        <View style={styles.section}>
          <View style={styles.difficultyHeader}>
            <ThemedText style={styles.label}>Vyberte obtížnost:</ThemedText>
            <ThemedText style={styles.sliderValue}>{difficulty}%</ThemedText>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={5}
            value={difficulty}
            onValueChange={(value) => setDifficulty(value)}
            minimumTrackTintColor="#4A5BD2"
            maximumTrackTintColor="#121212"
            thumbTintColor="#4A5BD2"
          />
          <View style={styles.difficultyLabels}>
            <ThemedText style={styles.difficultyLabel}>Velmi lehká</ThemedText>
            <ThemedText style={styles.difficultyLabel}>Lehká</ThemedText>
            <ThemedText style={styles.difficultyLabel}>Střední</ThemedText>
            <ThemedText style={styles.difficultyLabel}>Těžká</ThemedText>
            <ThemedText style={styles.difficultyLabel}>Velmi těžká</ThemedText>
          </View>
        </View>

        {/* Galaxy Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>Vyberte galaxii:</ThemedText>
          <View style={styles.scrollableContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Všechny', 'Hlavní', 'Přísl. určení', 'Přivlastek', 'Doplňek'].map((galaxyOption, index) => (
                <TouchableOpacity
                  key={galaxyOption}
                  style={[
                    styles.optionButton,
                    galaxy === index && styles.selectedButton,
                  ]}
                  onPress={() => setGalaxy(index)}
                >
                  <Image source={galaxyImages[index]} style={styles.galaxyIcon} />
                  <ThemedText
                    style={
                      galaxy === index
                        ? styles.selectedButtonText
                        : styles.buttonText
                    }
                  >
                    {galaxyOption}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Question Types */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>Typy otázek:</ThemedText>
          {['type1', 'type2', 'type3'].map((type, index) => (
            <View key={type} style={styles.switchRow}>
              <ThemedText style={styles.switchLabel}>{type}</ThemedText>
              <Switch
                value={(questionTypes & (1 << index)) !== 0}
                onValueChange={() => toggleQuestionType(index)}
                trackColor={{ false: '#767577', true: '#4A5BD2' }}
              />
            </View>
          ))}
        </View>

        {/* Start Exam Button */}
        <TouchableOpacity style={styles.startButton} onPress={handleStartExam}>
          <ThemedText style={styles.startButtonText}>Vytvořit test</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
  },
  code: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#121212',
    color: 'white',
    borderRadius: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    color: 'white',
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#4A5BD2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    backgroundColor: '#121212',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  selectedButton: {
    backgroundColor: '#4A5BD2',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedButtonText: {
    color: 'white',
    fontSize: 16,
  },
  galaxyIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  scrollableContainer: {
    flexDirection: 'row',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  difficultyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyLabel: {
    color: 'white',
    fontSize: 12,
  },
  sliderValueContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  difficultyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
    marginBottom: 5,
  },
});