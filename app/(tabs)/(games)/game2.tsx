import ContinueButton from '@/components/ui/games/ContinueButton';
import { LargeGameButton } from '@/components/ui/games/LargeGameButton';
import RocketProgressBar from '@/components/ui/games/ProgressBar';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ToastAndroid, View } from 'react-native';

const CzechSelectionGrid: React.FC = () => {
  const data = [
    {word: 'pro radost 1', type: 'PO 1'},
    {word: 'sedával 2', type: 'PŮJ 2'},
    {word: 'vždycky 3', type: 'PUM 3'},
    {word: 'u otevřeného 4', type: 'PUČ 4'},
    {word: 'okna. 5', type: 'PKS 5'},
  ];

  const targetType = 'PO 1';

  const [options, setOptions] = useState<WordSelectionOption[]>(
    data.map((item, index) => ({
      id: `${index + 1}`,
      text: item.word,
      type: item.type,
    }))
  );

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
            options.map((option) => (
              <LargeGameButton
                key={option.id}
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