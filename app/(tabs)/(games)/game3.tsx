import { LargeGameButton } from '@/components/ui/games/LargeGameButton';
import RocketProgressBar from '@/components/ui/games/ProgressBar';
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

interface WordOption {
  id: string;
  text: string;
  selected: boolean;
}

const CzechWordSelectionQuiz: React.FC = () => {
  const [options, setOptions] = useState<WordOption[]>([
    { id: '1', text: 'Ondra', selected: false },
    { id: '2', text: 'nikdy', selected: false },
    { id: '3', text: 'o všech', selected: false },
    { id: '4', text: 'neřekl', selected: false },
  ]);

  const handleSelect = (id: string) => {
    setOptions(
      options.map(option => 
        option.id === id 
          ? { ...option, selected: !option.selected } 
          : option
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <RocketProgressBar progress={0.33} />

      <View style={styles.content}>
        {/* Question */}
        <Text style={styles.questionText}>Které slovo ve větě je podmět?</Text>
        
        {/* Example sentence */}
        <Text style={styles.exampleText}>
          Ondra mi nikdy o všech svých problémech neřekl.
        </Text>
        
        {/* Word options grid */}
        <View style={styles.grid}>
          <View style={styles.row}>
            <LargeGameButton
              text={options[0].text}
              selected={options[0].selected}
              onPress={() => handleSelect('1')}
            />
            
            <LargeGameButton
              text={options[1].text}
              selected={options[1].selected}
              onPress={() => handleSelect('2')}
            />
          </View>
          
          <View style={styles.row}>
            <LargeGameButton
              text={options[2].text}
              selected={options[2].selected}
              onPress={() => handleSelect('3')}
            />
            
            <LargeGameButton
              text={options[3].text}
              selected={options[3].selected}
              onPress={() => handleSelect('4')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  questionText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  exampleText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  grid: {
    width: '100%',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  option: {
    width: '48%',
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.4)',
  },
  selectedOption: {
    borderColor: '#6266f1',
    backgroundColor: 'rgba(98, 102, 241, 0.1)',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default CzechWordSelectionQuiz;