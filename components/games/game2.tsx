import ContinueButton from '@/components/ui/games/ContinueButton';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { useEffect } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { useLevelContext } from '@/contexts/levelContext';
import { TargetTypeDisplay } from '../ui/games/TargetTypeDisplay';
import { LargeGameButtonsGrid } from '../ui/games/LargeGameButtonsGrid';
import { WordType } from '@/types/WordTypes';
import { GameState } from '@/types/gameState';

export function Game2UI(wantedType: WordType | null = null) {
  const { data, onFinished, gameState } = useGameContext();
  const { options, setOptions, targetType, setTargetType, selectedOptions, setSelectedOptions } = useLevelContext();

  // ! this is the only allowed useEffect in the games and can only contain the data as dependency
  useEffect(() => {
    if (!data) {
      console.log("Data not initialized yet");
      return;
    }

    setOptions(data)
    setTargetType(wantedType ?? data[Math.floor(Math.random() * data.length)].type);
  }, [data]);

  const handleSelect = (id: WordSelectionOption) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter(item => item !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  const handleContinue = () => {
    const correctCount = IsValid();
    
    // Capture user selections for Game2
    const userSelections = {
      gameType: 'Game2',
      selectedOptions: options?.map(option => ({
        text: option.text,
        type: option.type,
        selected: selectedOptions.includes(option),
        correct: option.type === targetType?.type
      })) || [],
      targetType: targetType?.type
    };

    console.log("User selections g2: ", userSelections);
    
    onFinished(correctCount, userSelections)
  }

  function IsValid(): number {
    console.log("Selected options: ", selectedOptions);
    console.log("Target type: ", targetType);
    console.log("Selected options: ", selectedOptions);

    // Count how many correct answers were selected
    let correctCount = 0;
    for (const selected of selectedOptions) {
      const selectedItem = data?.find(item => item === selected);
      if (selectedItem && selectedItem.type === targetType?.type) {
        correctCount++;
      }
    }

    // This function should return the count of correct answers instead of true/false
    return correctCount;
  }

  return (
    <>
      <TargetTypeDisplay text='Vyber' />
      <LargeGameButtonsGrid
        options={options}
        selectedOptions={gameState != GameState.showingAnswers ? selectedOptions : []}
        handleSelect={handleSelect}
        correctType={gameState == GameState.showingAnswers ? targetType?.type : null}
      />
      <ContinueButton onClick={handleContinue} enabled={selectedOptions.length > 0 && gameState != GameState.showingAnswers} />
    </>
  );
};