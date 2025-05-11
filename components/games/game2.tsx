import ContinueButton from '@/components/ui/games/ContinueButton';
import { LargeGameButton } from '@/components/ui/games/LargeGameButton';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GameLayout } from './gameLayout';
import { useGameContext } from '@/contexts/GameContext';

export function Game2UI(multiSelect: boolean) {
  const { data, onFinished } = useGameContext();

  const [targetType, setTargetType] = useState<string>('... loading'); // Set the target type here
  const [options, setOptions] = useState<WordSelectionOption[]>();

  const [selectedOptions, setSelectedOptions] = useState<WordSelectionOption[]>([]);

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
    for (const item of selectedOptions) {
      if (item.type !== targetType)
        return false;
    }
    return true;
  }

  return (
    <GameLayout>
      {/* <View style={styles.content}> */}
      <Text style={styles.title}>Vyber {targetType}</Text>
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
      {/* </View> */}
    </GameLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    // flex: 1,
    // alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom: 40,
  },
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