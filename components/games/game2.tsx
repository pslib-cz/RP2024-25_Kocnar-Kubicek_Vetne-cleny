import ContinueButton from '@/components/ui/games/ContinueButton';
import { LargeGameButton } from '@/components/ui/games/LargeGameButton';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGameContext } from '@/contexts/GameContext';
import { useLevelContext } from '@/contexts/levelContext';
import { TargetTypeDisplay } from '../ui/games/TargetTypeDisplay';

export function Game2UI(multiSelect: boolean) {
  const { data, onFinished } = useGameContext();
  const { options, setOptions, targetType, setTargetType, selectedOptions, setSelectedOptions } = useLevelContext();

  // ! this is the only allowed useEffect in the games and can only contain the data as dependency
  useEffect(() => {
    if (!data) {
      console.log("Data not initialized yet");
      return;
    }

    setOptions(data)

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
      <TargetTypeDisplay />
      <ScrollView style={{ width: '100%' }}>
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
      </ScrollView>
      <ContinueButton onClick={handleContinue} enabled={selectedOptions.length > 0} />
    </>
  );
};

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 20,
    justifyContent: 'space-between',
  }
});