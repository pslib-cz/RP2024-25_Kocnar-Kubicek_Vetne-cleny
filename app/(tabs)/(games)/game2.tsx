import ContinueButton from '@/components/ui/games/ContinueButton';
import { LargeGameButton } from '@/components/ui/games/LargeGameButton';
import RocketProgressBar from '@/components/ui/games/ProgressBar';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ToastAndroid } from 'react-native';

interface SelectionOption {
  id: string;
  text: string;
  type: string;
}

const CzechSelectionGrid: React.FC = () => {

  const data = [
    {word: 'pro radost 1', type: 'PO 1'},
    {word: 'sedával 2', type: 'PŮJ 2'},
    {word: 'vždycky 3', type: 'PUM 3'},
    {word: 'u otevřeného 4', type: 'PUČ 4'},
    {word: 'okna. 5', type: 'PKS 5'},
  ];

  const [options, setOptions] = useState<SelectionOption[]>(
    data.map((item, index) => ({
      id: `${index + 1}`,
      text: item.word,
      type: item.type,
    }))
  );

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSelect = (id: string) => {    
    selectedOptions.includes(id) ?
      setSelectedOptions(selectedOptions.filter(item => item !== id)) :
      setSelectedOptions([...selectedOptions, id]);
  };

  const handleContinue = () => {
    
    ToastAndroid.show('This is not implemented yet lil bro', ToastAndroid.SHORT);

  }

  return (
    <SafeAreaView style={styles.container}>

      <RocketProgressBar progress={0.33} />

      <View style={styles.content}>
        <Text style={styles.title}>Vyber PUM</Text>
        
        <View style={styles.grid}>
          <View style={styles.row}>
            <LargeGameButton
              text={options[0].text}
              selected={selectedOptions.includes('1')}
              onPress={() => handleSelect('1')}
            />

            <LargeGameButton
              text={options[1].text}
              selected={selectedOptions.includes('2')}
              onPress={() => handleSelect('2')}
            />
          </View>
          
          <View style={styles.row}>
            <LargeGameButton
              text={options[2].text}
              selected={selectedOptions.includes('3')}
              onPress={() => handleSelect('3')}
            />

            <LargeGameButton
              text={options[3].text}
              selected={selectedOptions.includes('4')}
              onPress={() => handleSelect('4')}
            />
          </View>
        </View>

        {
          selectedOptions.length > 0 && 
          <ContinueButton onClick={() => handleContinue}/>
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

});

export default CzechSelectionGrid;