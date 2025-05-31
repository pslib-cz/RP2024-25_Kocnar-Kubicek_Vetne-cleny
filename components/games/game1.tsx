import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WordButtonType } from '@/types/games/WordButtonType';
import { useGameContext } from '@/contexts/GameContext';
import { getWordTypesByType, WordTypes } from '@/constants/WordTypes';
import { useLevelContext } from '@/contexts/levelContext';
import { WordButtonsContainer } from '../ui/games/WordButtonsContainer';
import { ButtonState } from '../ui/games/WordButton';
import { WordType } from '@/types/WordTypes';

export const enum Game1Type {
  normal = 0,
  inverted = 1,
  allTypes = 2,
  oneWord = 3
}

const BASIC_TYPES = ["po","př","pt","pks","pkn","pum","puč","puz"]

export function GameOneUI(type: Game1Type, oneWord_INDEX: number = 1) {
  const inverted = type === Game1Type.inverted;
  const allTypes = type === Game1Type.allTypes || type === Game1Type.oneWord;
  const oneWord = type === Game1Type.oneWord;

  const { onFinished, data } = useGameContext();
  const { gameIndex, setGameIndex, phraseButtons, setPhraseButtons, bottomButtons, setBottomButtons, handleHideTooltip, handleShowTooltip } = useLevelContext();

  // ! this is the only allowed useEffect in the games and can only contain the data as dependency
  useEffect(() => {
    console.log("GameOneUI useEffect triggered with data: ", data);

    if (oneWord) {
      setGameIndex(oneWord_INDEX);
    }

    if (data) {
      setPhraseButtons(
        data.map((item, index) => ({
          text: !inverted ? item.text : item.type,
          type: item.type,
          drawType: inverted,
          state: oneWord ? 
            (index == oneWord_INDEX ? ButtonState.highlighted : ButtonState.disabled) : 
            (index === 0 ? ButtonState.highlighted : ButtonState.default)
        }))
      );

      if (allTypes) {
        //const typesInSentence = data.map(item => item.type);
        //const uniqueTypesWithBasicTypes = Array.from(new Set([...typesInSentence, ...BASIC_TYPES]));
        //const types = getWordTypesByType(uniqueTypesWithBasicTypes as WordType[]);

        setBottomButtons(
          WordTypes.map((i) => ({
            text: i.abbr,
            type: i.abbr,
            drawType: true,
            state: ButtonState.default
          }))
        )
        return;
      }

      setBottomButtons(
        data.map((item) => ({
          text: !inverted ? item.type : item.text.toLowerCase().replace('.', ''),
          type: item.type,
          drawType: !inverted,
          state: ButtonState.default
        }))
          .sort(() => Math.random() - 0.5)
      )
    }
  }, [data]);

  const onBottomButtonClicked = (bottomButton: WordButtonType) => {
    if (!phraseButtons || !data || !bottomButtons) {
      console.warn("Phrase buttons or data or bottomButtons not initialized yet");
      return;
    }

    if (gameIndex >= data.length)
      throw Error("Game index is out of bounds");

    const updatedPhraseButtons = [...phraseButtons];

    if (oneWord)
    {
      onFinished(data[gameIndex].type === bottomButton.type)
      return;
    }

    if (data[gameIndex].type === bottomButton.type) {
      if (!allTypes && bottomButton)
        bottomButton.state = ButtonState.disabled;

      console.log("Correct answer for game index:", gameIndex, "button:", updatedPhraseButtons[gameIndex]);
      updatedPhraseButtons[gameIndex].state = ButtonState.correct;

      if (gameIndex < bottomButtons.length - 1 && updatedPhraseButtons[gameIndex + 1])
        updatedPhraseButtons[gameIndex + 1].state = ButtonState.highlighted;

      if (gameIndex === data.length - 1)
        onFinished(true)

      setGameIndex(gameIndex + 1);
    }
    else
      onFinished(false)

    setBottomButtons([...bottomButtons]);
    setPhraseButtons(updatedPhraseButtons);
  };

  return (
    <>
      <View></View>
      <WordButtonsContainer buttons={phraseButtons}
        showTooltip={inverted}
        longPress={(button, index) => { inverted && handleShowTooltip(button.text, index) }}
        onClick={(button, index) => { inverted && handleShowTooltip(button.text, index) }}
      />
      <WordButtonsContainer buttons={bottomButtons}
        showTooltip={!inverted}
        longPress={(button, index) => { !inverted && handleShowTooltip(button.text, index) }}
        onClick={(button) => { onBottomButtonClicked(button); handleHideTooltip(); }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  phraseContainer: {
    display: 'flex',
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  phraseButton: {
    backgroundColor: 'transparent',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
  }
});