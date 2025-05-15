import ContinueButton from '@/components/ui/games/ContinueButton';
import { LargeGameButton } from '@/components/ui/games/LargeGameButton';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGameContext } from '@/contexts/GameContext';
import { useLevelContext } from '@/contexts/levelContext';
import { Tooltip } from '../ui/games/Tooltip';
import WordButton from '../ui/games/WordButton';

export function Game2UI(multiSelect: boolean) {
  const { data, onFinished } = useGameContext();
  const { options, setOptions, targetType, setTargetType, selectedOptions, setSelectedOptions, tooltip, handleHideTooltip, handleShowTooltip } = useLevelContext();

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
    for (const item of selectedOptions) {
      if (item.type !== targetType?.type)
        return false;
    }
    return true;
  }

  return (
    <>
      {/* <View style={styles.content}> */}
      <Text style={styles.title}>
        Vyber
        {
          targetType &&
          <Tooltip
            visible={tooltip.visible}
            message={tooltip.message}
            onRequestClose={handleHideTooltip}
          >
            <WordButton
              text={targetType.text}
              state={targetType.state}
              type={targetType.type}
              drawType={targetType.drawType}
              onLongPress={() => handleShowTooltip(targetType.text, 0)}
              onClick={handleHideTooltip}
            />
          </Tooltip>
        }
      </Text>
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
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
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