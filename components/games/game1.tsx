import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WordButtonType } from '@/types/games/WordButtonType';
import { useGameContext } from '@/contexts/GameContext';
import { WordTypes } from '@/constants/WordTypes';
import { useLevelContext } from '@/contexts/levelContext';
import { WordButtonsContainer } from '../ui/games/WordButtonsContainer';
import { ButtonState } from '../ui/games/WordButton';
import { GeneratorParam, QuestionModifier } from '@/constants/questionGeneratorParams';
import { GameState } from '@/types/gameState';

export const enum Game1Type {
  normal = 0,
  inverted = 1,
  allTypes = 2,
  oneWord = 3
}

const filterData = (data: WordButtonType[], modifiers: QuestionModifier[]) => {
  if (modifiers.length == 0) return data;

  return data.filter(item => {
    let result = false;
    if (!result && modifiers.includes(QuestionModifier.ONLY_PO)) {
      result = item.type == "po";
    }
    if (!result && modifiers.includes(QuestionModifier.ONLY_PR)) {
      result = item.type == "př";
    }
    if (!result && modifiers.includes(QuestionModifier.ONLY_PT)) {
      result = item.type == "pt";
    }
    if (!result && modifiers.includes(QuestionModifier.ONLY_PKS)) {
      result = item.type == "pks";
    }
    if (!result && modifiers.includes(QuestionModifier.ONLY_PKN)) {
      result = item.type == "pkn";
    }
    if (!result && modifiers.includes(QuestionModifier.ONLY_PU)) {
      result = item.type?.includes("pu") ?? false;
    }
    return result;
  });
}

export function GameOneUI(type: Game1Type, oneWord_INDEX: number = 1) {
  const inverted = type === Game1Type.inverted;
  const allTypes = type === Game1Type.allTypes || type === Game1Type.oneWord;
  const oneWord = type === Game1Type.oneWord;

  const { onFinished, data, activeQuestion, gameState } = useGameContext();
  const { gameIndex, setGameIndex, phraseButtons, setPhraseButtons, bottomButtons, setBottomButtons, handleHideTooltip, handleShowTooltip } = useLevelContext();
  
  // Track user selections for each word
  const [userSelections, setUserSelections] = useState<{[wordIndex: number]: string}>({});

  const modifiers: QuestionModifier[] = activeQuestion?.TEMPLATE[GeneratorParam.QUESTION_MODIFIER] as QuestionModifier[] ?? [];

  const InvertedPhraseButtons = (data: WordButtonType[]): WordButtonType[] => {
    return filterData(data, modifiers).map((item, index) => ({
      text: item.type || "",
      type: item.type || "",
      drawType: true,
      state: oneWord ?
        (index == oneWord_INDEX ? ButtonState.highlighted : ButtonState.disabled) :
        (index === 0 ? ButtonState.highlighted : ButtonState.default)
    }))
  }

  const NormalPhraseButtons = (data: WordButtonType[]): WordButtonType[] => {
    return data.map((item, index) => ({
      text: item.text || "",
      type: item.type,
      drawType: inverted,
      state: oneWord ?
        (index == oneWord_INDEX ? ButtonState.highlighted : ButtonState.disabled) :
        (index === 0 ? ButtonState.highlighted : ButtonState.default)
    }))
  }

  const NormalBottomButtons = (data: WordButtonType[]): WordButtonType[] => {
    return data.map((item) => ({
      text: item.type || "",
      type: item.type,
      drawType: true,
      state: ButtonState.default
    })).sort(() => Math.random() - 0.5)
  }

  const InvertedBottomButtons = (data: WordButtonType[]): WordButtonType[] => {
    return data.map((item) => ({
      text: item.text?.toLowerCase().replace('.', ''),
      type: item.type,
      drawType: false,
      state: ButtonState.default
    })).sort(() => Math.random() - 0.5)
  }

  const AllTypesBottomButtons = (): WordButtonType[] => {
    return WordTypes.map((i) => ({
      text: i.abbr,
      type: i.abbr,
      drawType: true,
      state: ButtonState.default
    }))
  }

  // ! this is the only allowed useEffect in the games and can only contain the data as dependency
  useEffect(() => {
    if (oneWord) {
      setGameIndex(oneWord_INDEX);
    }

    // Reset user selections when new data comes in
    setUserSelections({});

    if (data) {
      if (inverted) {
        let updatedData: WordButtonType[] = data;
        const sentenceContainsPo = data.some(item => item.type === "po");

        if (modifiers.includes(QuestionModifier.ONLY_PO)) {
          updatedData = [...data, {
            text: "neurčitý podmět",
            type: sentenceContainsPo ? "x" : "po"
          }];
        }

        setPhraseButtons(InvertedPhraseButtons(updatedData));
        setBottomButtons(InvertedBottomButtons(updatedData));
      }
      else {
        setPhraseButtons(NormalPhraseButtons(data));

        if (allTypes) {
          setBottomButtons(AllTypesBottomButtons());
        }
        else {
          setBottomButtons(NormalBottomButtons(data));
        }
      }
    }
  }, [data]);

  const onBottomButtonClicked = (bottomButton: WordButtonType) => {
    if (gameState == GameState.showingAnswers) return;

    handleHideTooltip();

    if (!phraseButtons || !data || !bottomButtons) {
      console.warn("Phrase buttons or data or bottomButtons not initialized yet");
      return;
    }

    if (gameIndex >= phraseButtons.length)
      throw Error("Game index is out of bounds");

    const updatedPhraseButtons = [...phraseButtons];

    if (oneWord) {
      console.log("=== GAME1: oneWord mode ===");
      console.log("Data:", data);
      console.log("Game index:", gameIndex);
      console.log("Bottom button:", bottomButton);
      
      const isCorrect = data[gameIndex].type === bottomButton.type;
      console.log("GAME1: Is correct:", isCorrect);
      
      // Capture user selections for Game1 oneWord mode
      const userSelections = {
        gameType: 'Game1_oneWord',
        selectedWords: [{
          word: data[gameIndex].text || '',
          wordIndex: gameIndex,
          selectedType: bottomButton.type,
          correctType: data[gameIndex].type || ''
        }]
      };
      
      console.log("GAME1: User selections captured:", userSelections);
      console.log("GAME1: Calling onFinished with:", isCorrect ? 1 : 0, userSelections);
      
      onFinished(isCorrect ? 1 : 0, userSelections);
      return;
    }

    // Track user's selection
    const updatedUserSelections = {
      ...userSelections,
      [gameIndex]: bottomButton.type || ''
    };
    setUserSelections(updatedUserSelections);

    if (phraseButtons[gameIndex].type === bottomButton.type) {
      if (!allTypes && bottomButton)
        bottomButton.state = ButtonState.disabled;

      console.log("Correct answer for game index:", gameIndex, "button:", updatedPhraseButtons[gameIndex]);
      updatedPhraseButtons[gameIndex].state = ButtonState.correct;

      let nextIndex = updatedPhraseButtons.findIndex((button, idx) => 
        idx > gameIndex && button.state !== ButtonState.correct && button.state !== ButtonState.disabled
      );      
      if (nextIndex === -1) {
        nextIndex = updatedPhraseButtons.findIndex((button) => 
          button.state !== ButtonState.correct && button.state !== ButtonState.disabled
        );
      }

      console.log("Next index:", nextIndex);

      if (updatedPhraseButtons[nextIndex])
        updatedPhraseButtons[nextIndex].state = ButtonState.highlighted;

      if (updatedPhraseButtons.every(button => button.state === ButtonState.correct || button.state === ButtonState.disabled)) {
        console.log("=== GAME1: Complete mode - all buttons correct ===");
        console.log("Updated phrase buttons:", updatedPhraseButtons);
        console.log("Data:", data);
        
        // Capture user selections for Game1 completion
        const userSelectionsData = {
          gameType: 'Game1_complete',
          selectedWords: updatedPhraseButtons.map((button, index) => ({
            word: button.text || '',
            wordIndex: index,
            selectedType: updatedUserSelections[index] || '', // User's actual selection
            correctType: data?.[index]?.type || ''
          }))
        };
        
        console.log("GAME1: User selections captured:", userSelectionsData);
        console.log("GAME1: Calling onFinished with:", 1, userSelectionsData);
        
        onFinished(1, userSelectionsData);
      }

      setGameIndex(nextIndex);
    }
    else {
      console.log("=== GAME1: Partial mode - incorrect answer ===");
      console.log("Updated phrase buttons:", updatedPhraseButtons);
      console.log("Data:", data);
      
      const correctCount = updatedPhraseButtons.filter(button => button.state === ButtonState.correct).length;
      console.log("GAME1: Correct count:", correctCount, "out of", updatedPhraseButtons.length);
      
      // Capture user selections for Game1 partial completion
      const userSelectionsData = {
        gameType: 'Game1_partial',
        selectedWords: updatedPhraseButtons.map((button, index) => ({
          word: button.text || '',
          wordIndex: index,
          selectedType: updatedUserSelections[index] || '', // User's actual selection
          correctType: data?.[index]?.type || ''
        }))
      };
      
      const percentage = correctCount / updatedPhraseButtons.length;
      console.log("GAME1: User selections captured:", userSelectionsData);
      console.log("GAME1: Calling onFinished with:", percentage, userSelectionsData);
      
      onFinished(percentage, userSelectionsData);
    }

    setBottomButtons([...bottomButtons]);
    setPhraseButtons(updatedPhraseButtons);
  };

  const handlePhraseButtonLongClick = (button: WordButtonType, index: number) => {
    if (gameState == GameState.showingAnswers) {
      if (!inverted) {
        handleShowTooltip(button.type || "", index)
      }
      else {
        handleShowTooltip(button.text, index)
      }
    }

    if (inverted) {
      handleShowTooltip(button.type || "", index)
    }
  }

  const handlePhraseButtonClick = (button: WordButtonType, index: number) => {
    if (gameState == GameState.showingAnswers) return;
    if (!phraseButtons || button.state == ButtonState.correct) return;

    setGameIndex(index);
    const updatedPhraseButtons = [...phraseButtons];
    updatedPhraseButtons.forEach((btn, i) => {
      if (btn == button)
        btn.state = ButtonState.highlighted;
      else if (btn.state == ButtonState.highlighted)
        btn.state = ButtonState.default;
      
    });
    setPhraseButtons(updatedPhraseButtons);
  };

  return (
    <>
      <View>
        <Text style={styles.title}>{inverted ? "Přiřaď slova k větným členům" : "Přiřaď větné členy ke slovům"}</Text>
      </View>
      <WordButtonsContainer buttons={phraseButtons}
        showTooltip={inverted}
        longPress={handlePhraseButtonLongClick}
        onClick={handlePhraseButtonClick}
        forceDrawTypeAnd={gameState == GameState.showingAnswers}
      />
      <WordButtonsContainer buttons={bottomButtons}
        showTooltip={!inverted}
        longPress={(button, index) => { !inverted && handleShowTooltip(button.text, index) }}
        onClick={(button) => { onBottomButtonClicked(button); }}
        forceDrawTypeAnd={gameState == GameState.showingAnswers}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});