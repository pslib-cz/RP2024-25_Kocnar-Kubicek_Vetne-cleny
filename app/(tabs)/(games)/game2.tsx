import ContinueButton from '@/components/ui/games/ContinueButton';
import { LargeGameButton } from '@/components/ui/games/LargeGameButton';
import RocketProgressBar from '@/components/ui/games/ProgressBar';
import { Spreadsheets } from '@/utils/DataNavigator';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { ParseFileToDataRows } from '@/utils/fileParser';

const CzechSelectionGrid: React.FC = () => {
  const [data, setData] = useState<WordSelectionOption[]>();

  useEffect(() => {
    ParseFileToDataRows(Spreadsheets.Privlastek, (parsed) => {
      setData(parsed[0][0].data);
    },
    (error) => {
      console.error("Error parsing file:", error);
    });
  }, []);

  const [targetType, setTargetType] = useState<string>('... loading'); // Set the target type here

  const [options, setOptions] = useState<WordSelectionOption[]>();

  useEffect(() => {

    if (!data) {
      console.log("Data not initialized yet");
      return;
    }

    setOptions(data)

    setTargetType(data[Math.floor(Math.random() * data.length)].type);
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
        <Text style={styles.title}>Vyber {targetType}</Text>        
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
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  grid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
  }
});

export default CzechSelectionGrid;