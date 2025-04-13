import ContinueButton from '@/components/ui/games/ContinueButton';
import { LargeGameButton } from '@/components/ui/games/LargeGameButton';
import RocketProgressBar from '@/components/ui/games/ProgressBar';
import { Spreadsheets } from '@/data/DataNavigator';
import { ParseFile } from '@/hooks/useCSV';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ToastAndroid, View } from 'react-native';

const CzechWordSelectionQuiz: React.FC = () => {
  const [data, setData] = useState<WordSelectionOption[]>();

  useEffect(() => {
    ParseFile(Spreadsheets.All1, (parsed) => {
      setData(parsed[0].data);
    },
    (error) => {
      console.error("Error parsing file:", error);
    });
  }, []);

  const [options, setOptions] = useState<WordSelectionOption[]>();

  useEffect(() => {
    console.log("Data change:", data);

    if (data) {
      setOptions(data);
    }
  }, [data]);

  const [selectedOptions, setSelectedOptions] = useState<WordSelectionOption[]>([]);

  const handleSelect = (id: WordSelectionOption) => {    
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter(item => item !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  const handleContinue = () => {
    if (IsValid()) {
      ToastAndroid.show('Correct!', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Incorrect!', ToastAndroid.SHORT);
    }
  }

  const targetType = 'PO 1';

  function IsValid() : boolean{    
    for (const item of selectedOptions) {
      if (item.type !== targetType)
        return false;      
    }    
    return true;
  }

  return (
    <SafeAreaView style={styles.container}>
      <RocketProgressBar progress={0.33} />
      <View style={styles.content}>
        <Text style={styles.questionText}>Které slovo ve větě je podmět?</Text>        
        <Text style={styles.exampleText}>
          Ondra mi nikdy o všech svých problémech neřekl.
        </Text>
        <View style={styles.grid}>
          {
            options &&
            options.map((option, index) => (
              <LargeGameButton
                key={index}
                text={option.text}
                selected={selectedOptions.includes(option)}
                onPress={() => handleSelect(option)}
              />
            ))
          }
        </View>
        {
          selectedOptions.length > 0 && 
          <ContinueButton onClick={handleContinue}/>
        }
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
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
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