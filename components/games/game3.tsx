import ContinueButton from '@/components/ui/games/ContinueButton';
import { LargeGameButton } from '@/components/ui/games/LargeGameButton';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGameContext } from '@/contexts/GameContext';
import { useLevelContext } from '@/contexts/levelContext';
import { Tooltip } from '../ui/games/Tooltip';
import WordButton from '../ui/games/WordButton';
import { TargetTypeDisplay } from '../ui/games/TargetTypeDisplay';
import { LargeGameButtonsGrid } from '../ui/games/LargeGameButtonsGrid';

export function Game3UI() {
  const { data, onFinished } = useGameContext();
  const { options, setOptions, targetType, setTargetType, selectedOptions, setSelectedOptions, tooltip, handleHideTooltip, handleShowTooltip } = useLevelContext();

  // ! this is the only allowed useEffect in the games and can only contain the data as dependency
  useEffect(() => {
    if (data) {
      setOptions(data);
    }

    setTargetType(data[Math.floor(Math.random() * data.length)].type);
  }, [data]);

  const handleSelect = (id: WordSelectionOption) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter(item => item !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  const handleContinue = () => {
    onFinished(IsValid())
  }

  function IsValid(): boolean {

    console.log("Selected options: ", selectedOptions);
    console.log("Target type: ", targetType);
    console.log("Selected options: ", selectedOptions);

    for (const item of selectedOptions) {      
      if (!targetType?.type) throw new Error("Target type is not set");
      if (item.type !== targetType?.type)
        return false;
    }
    return true;
  }

  return (
    <>
      <View>
        <TargetTypeDisplay text='Které slovo ve větě je ' />
        <Text style={styles.questionText}>
          {data.map(option => option.text).join(' ')}
        </Text>
      </View>
      <LargeGameButtonsGrid 
        options={options} 
        selectedOptions={selectedOptions} 
        handleSelect={handleSelect} 
      />
      {/* <ScrollView style={{ width: '100%' }}>
        <View style={[styles.grid, { marginBottom: 40 }]}>
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
      </ScrollView> */}
      <ContinueButton onClick={handleContinue} enabled={selectedOptions.length > 0} />
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
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
    paddingHorizontal: 20,
  },
  // grid: {
  //   width: '100%',
  //   display: 'flex',
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   gap: 16,
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
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