import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch, ScrollView, Image, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { GameType, useGameContext } from '@/contexts/GameContext';
import { galaxyImages } from '@/data/galaxyImages';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CreateGameScreen() {
  const [difficulty, setDifficulty] = useState(50);
  const [galaxy, setGalaxy] = useState(0);
  const [questionTypes, setQuestionTypes] = useState(0b01101111);
  const [questionCount, setQuestionCount] = useState('10');
  const [isCustomCount, setIsCustomCount] = useState(false);
  const { newGame } = useGameContext();
  const router = useRouter();

  const questionCountPresets = [10, 15, 20, 25];

  const handlePresetSelect = (count: number) => {
    setQuestionCount(count.toString());
    setIsCustomCount(false);
  };

  const handleCustomCountPress = () => {
    setIsCustomCount(true);
  };

  const toggleQuestionType = (typeIndex: number) => {
    setQuestionTypes((prev) => prev ^ (1 << typeIndex));
  };

  const handleStartExam = async () => {
    if (difficulty && galaxy >= 0) {
      try {
        const count = parseInt(questionCount);
        if (isNaN(count) || count < 1 || count > 100) {
          alert('Prosím zadejte platný počet otázek (1-100)');
          return;
        };
        newGame({
            galaxy: galaxy,
            difficulty: difficulty/100,
            count: count,
            questionTypesBitfield: questionTypes,
        }, GameType.TEST_PRACTICE);
      } catch (error) {
        alert('Nepodařilo se spustit cvičení. Zkuste to znovu.');
        console.warn('Error starting exam:', error);
      }
    } else {
      alert('Prosím vyberte obtížnost a galaxii před spuštěním cvičení.');
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
        <View style={{flex: 1}}>
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="white" />
            <ThemedText style={{color: 'white', fontSize: 16, marginLeft: 4}}>Zpět</ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText type="title" style={[styles.title, {flex: 2, textAlign: 'center'}]}>Vytvořit test</ThemedText>
        <View style={{flex: 1}} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Question Count Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>Počet otázek:</ThemedText>
          <View style={styles.presetContainer}>
            {questionCountPresets.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.presetButton,
                  questionCount === preset.toString() && !isCustomCount && styles.selectedPreset,
                ]}
                onPress={() => handlePresetSelect(preset)}
              >
                <ThemedText
                  style={[
                    styles.presetText,
                    questionCount === preset.toString() && !isCustomCount && styles.selectedPresetText,
                  ]}
                >
                  {preset}
                </ThemedText>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.presetButton,
                isCustomCount && styles.selectedPreset,
              ]}
              onPress={handleCustomCountPress}
            >
              <ThemedText
                style={[
                  styles.presetText,
                  isCustomCount && styles.selectedPresetText,
                ]}
              >
                Vlastní
              </ThemedText>
            </TouchableOpacity>
          </View>
          {isCustomCount && (
            <TextInput
              style={styles.input}
              value={questionCount}
              onChangeText={setQuestionCount}
              keyboardType="numeric"
              placeholder="Zadejte počet otázek"
              placeholderTextColor="#666"
            />
          )}
        </View>

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
          <ThemedText style={styles.label}>Sady členů:</ThemedText>
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
          {['Označování věty členy', 'Označování členů větou', 'Označování věty (jedno slovo)', 'Označování věty (všechny členy)', 'Vybírání bez věty', 'Vybírání s větou (více možností)', 'Vybírání s větou (jedna možnost)', 'Vybírání členu'].map((type, index) => (
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
    backgroundColor: '#101223',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#1c1f3d',
    color: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  code: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#101223',
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
    backgroundColor: '#1c1f3d',
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
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  presetButton: {
    backgroundColor: '#1c1f3d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 45,
    alignItems: 'center',
  },
  selectedPreset: {
    backgroundColor: '#4A5BD2',
  },
  presetText: {
    color: 'white',
    fontSize: 16,
  },
  selectedPresetText: {
    color: 'white',
    fontWeight: 'bold',
  },
});