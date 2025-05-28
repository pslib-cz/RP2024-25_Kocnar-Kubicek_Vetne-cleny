import ContinueButton from '@/components/ui/games/ContinueButton';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGameContext } from '@/contexts/GameContext';
import { useLevelContext } from '@/contexts/levelContext';
import { TargetTypeDisplay } from '../ui/games/TargetTypeDisplay';
import { LargeGameButtonsGrid } from '../ui/games/LargeGameButtonsGrid';

export function Game3UI() {
  const { data, onFinished } = useGameContext();
  const { options, setOptions, targetType, setTargetType, selectedOptions, setSelectedOptions } = useLevelContext();

  // ! this is the only allowed useEffect in the games and can only contain the data as dependency
  useEffect(() => {
    if (data) {
      setOptions(data);
      setTargetType(data[Math.floor(Math.random() * data.length)].type);
    }
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
        {
          data ?
          <>
            <TargetTypeDisplay text='Které slovo ve větě je ' />
            <Text style={styles.exampleText}>
              {data.map(option => option.text).join(' ')}
            </Text>
          </>
        :
        <Text style={styles.exampleText}>
          Načítání dat...
        </Text>
        }
      </View>
      <LargeGameButtonsGrid 
        options={options} 
        selectedOptions={selectedOptions} 
        handleSelect={handleSelect} 
      />
      <ContinueButton onClick={handleContinue} enabled={selectedOptions.length > 0} />
    </>
  );
};

const styles = StyleSheet.create({
  exampleText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});