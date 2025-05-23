import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch, ScrollView, Image, Platform, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMultiplayerGameContext } from '@/contexts/MultiplayerGameContext';
import { useRouter } from 'expo-router';
import { galaxyImages } from '@/data/galaxyImages';

export default function CreateGameScreen() {
  const [difficulty, setDifficulty] = useState(50);
  const [galaxy, setGalaxy] = useState(0);
  const [questionTypes, setQuestionTypes] = useState(0b111111);
  const [expirationTime, setExpirationTime] = useState(new Date(Date.now() + 30.5 * 60 * 1000)); // Default 30 minutes from now
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSeeded, setIsSeeded] = useState(true);
  const [questionCount, setQuestionCount] = useState('10');
  const [isCustomCount, setIsCustomCount] = useState(false);
  const { createGame, code } = useMultiplayerGameContext();
  const router = useRouter();

  const questionCountPresets = [10, 15, 20, 25];

  const handlePresetSelect = (count: number) => {
    setQuestionCount(count.toString());
    setIsCustomCount(false);
  };

  const handleCustomCountPress = () => {
    setIsCustomCount(true);
  };

  const getTimeDifference = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `(za ${hours} hodin${hours === 1 ? 'u' : hours >= 2 && hours <= 4 ? 'y' : ''})`;
    }
    return `(za ${minutes} minut${minutes === 1 ? 'u' : minutes >= 2 && minutes <= 4 ? 'y' : ''})`;
  };

  const toggleQuestionType = (typeIndex: number) => {
    setQuestionTypes((prev) => prev ^ (1 << typeIndex));
  };

  const handleStartExam = async () => {
    if (difficulty && galaxy >= 0) {
      try {
        const count = parseInt(questionCount);
        if (isNaN(count) || count < 1 || count > 100) {
          alert('Please enter a valid number of questions (1-100)');
          return;
        }

        const gameData = {
          difficulty,
          galaxy,
          questiontypes: questionTypes,
          version: '1.0.0',
          expirationTime,
          seeded: isSeeded,
          questionCount: count
        };

        await createGame(gameData);
        router.push('/exams/share');
      } catch (error) {
        alert('Failed to create game. Please try again.');
        console.warn('Error creating game:', error);
      }
    } else {
      alert('Please select difficulty and galaxy before starting the exam.');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setExpirationTime(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>Vytvořit sdílený test</ThemedText>

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

        {/* Expiration Time Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>Čas vypršení:</ThemedText>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(!showDatePicker)}
          >
            <ThemedText style={styles.datePickerText}>
              {expirationTime.toLocaleString('cs-CZ', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
              {' '}
              {getTimeDifference(expirationTime)}
            </ThemedText>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={expirationTime}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              locale="cs-CZ" 
              onChange={onDateChange}
              minimumDate={new Date(Date.now() + 5 * 60 * 1000)} // Minimum 5 minutes from now
              maximumDate={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)} // Maximum 7 days from now
            />
          )}
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
          {['Přiřazování členů', 'Přiřazování slov', 'Označování členů', 'Vybírání slova', 'Vybírání více slov', 'Vybírání s větou'].map((type, index) => (
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

        {/* Seeded Mode Toggle */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View>
              <ThemedText style={styles.switchLabel}>Stejné otázky</ThemedText>
              <ThemedText style={styles.switchDescription}>
                {isSeeded ? 'Stejné otázky pro všechny' : 'Náhodné otázky pro každého'}
              </ThemedText>
            </View>
            <Switch
              value={isSeeded}
              onValueChange={setIsSeeded}
              trackColor={{ false: '#767577', true: '#4A5BD2' }}
            />
          </View>
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#121212',
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
  datePickerButton: {
    backgroundColor: '#121212',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  datePickerText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  switchDescription: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  presetButton: {
    backgroundColor: '#121212',
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