import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const galaxyImages = [
  require('@/assets/images/uni/g/1.png'),
  require('@/assets/images/uni/g/2.png'),
  require('@/assets/images/uni/g/3.png'),
  require('@/assets/images/uni/g/4.png'),
  require('@/assets/images/uni/g/5.png'),
];

export default function TeacherScreen() {
  const [gameCode, setGameCode] = useState('123456');
  const [difficulty, setDifficulty] = useState(50);
  const [galaxy, setGalaxy] = useState('Všechny'); // Set default galaxy to 'Všechny'
  const [questionTypes, setQuestionTypes] = useState({ type1: true, type2: true, type3: true });
  const [showGameCode, setShowGameCode] = useState(false);

  type QuestionTypeKey = keyof typeof questionTypes;

  const toggleQuestionType = (type: QuestionTypeKey) => {
    setQuestionTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleStartExam = () => {
    if (difficulty && galaxy) {
      setShowGameCode(true);
    } else {
      alert('Please select difficulty and galaxy before starting the exam.');
    }
  };

  return (
    <SafeAreaView style={styles.container} >
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
            step={5} // Updated to snap by fives
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
                    galaxy === galaxyOption && styles.selectedButton,
                  ]}
                  onPress={() => setGalaxy(galaxyOption)}
                >
                  <Image source={galaxyImages[index]} style={styles.galaxyIcon} />
                  <ThemedText
                    style={
                      galaxy === galaxyOption
                        ? styles.selectedButtonText // Removed bold styling for selected button
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
          {Object.keys(questionTypes).map((type) => (
            <View key={type} style={styles.switchRow}>
              <ThemedText style={styles.switchLabel}>{type}</ThemedText>
              <Switch
                value={questionTypes[type as QuestionTypeKey]}
                onValueChange={() => toggleQuestionType(type as QuestionTypeKey)}
                trackColor={{ false: '#767577', true: '#4A5BD2' }}
              />
            </View>
          ))}
        </View>

        {/* Start Exam Button */}
        <TouchableOpacity style={styles.startButton} onPress={handleStartExam}>
          <ThemedText style={styles.startButtonText}>Vytvořit test</ThemedText>
        </TouchableOpacity>

        {/* Game Code and QR Code */}
        {showGameCode && (
          <View style={styles.section}>
            <ThemedText style={styles.label}>Kód hry:</ThemedText>
            <Text style={styles.gameCode}>{gameCode}</Text>
            <QRCode value={gameCode} size={150} />
          </View>
        )}
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
  gameCode: {
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