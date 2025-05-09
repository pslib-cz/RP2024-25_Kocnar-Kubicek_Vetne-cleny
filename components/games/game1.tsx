import { ThemedText } from '@/components/ThemedText';
import WordButton, { ButtonState } from '@/components/ui/games/WordButton';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WordButtonType } from '@/types/games/WordButtonType';
import { useFocusEffect } from 'expo-router';
import { useGameContext } from '@/contexts/GameContext';
import { GameLayout } from './gameLayout';
import { WordTypes } from '@/constants/WordTypes';

// TODO: implement custom max error count

export const enum Game1Type {
  normal = 0,
  inverted = 1,
  allTypes = 2
}

export function GameOneUI(type: Game1Type) {
  const inverted = type === Game1Type.inverted;
  const allTypes = type === Game1Type.allTypes;

  const { data, onFinished } = useGameContext();

  const [gameIndex, setGameIndex] = useState(0); // id of the current game card
  const [phraseButtons, setPhraseButtons] = useState<WordButtonType[]>();
  const [bottomButtons, setBottomButtons] = useState<WordButtonType[]>();

  // Function to initialize or reset the game
  const resetGame = useCallback(() => {
    console.log("-------------- RESETTING Game1 --------------");
    setGameIndex(0);
  }, [])

  useFocusEffect(
    useCallback(() => {
      console.log("Tab focused - resetting game");
      resetGame();

      return () => {
        console.log("Tab unfocused");
      };
    }, [resetGame])
  );

  useEffect(() => {
    //console.log("Game1 Data were changed");

    if (data) {
      setPhraseButtons(
        data.map((item, index) => ({
          text: !inverted ? item.text : item.type,
          type: item.type,
          drawType: inverted,
          state: index === 0 ? ButtonState.highlighted : ButtonState.default
        }))
      );

      if (allTypes) {
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
          text: !inverted ? item.type : item.text,
          type: item.type,
          drawType: !inverted,
          state: ButtonState.default
        }))
          .sort(() => Math.random() - 0.5)
      )
    }
  }, [allTypes, data, inverted]);

  const onBottomButtonClicked = (bottomButton: WordButtonType) => {
    if (!phraseButtons || !data || !bottomButtons) {
      console.warn("Phrase buttons or data or bottomButtons not initialized yet");
      return;
    }

    if (gameIndex >= data.length)
      throw Error("Game index is out of bounds");

    const updatedPhraseButtons = [...phraseButtons];

    // const isValid = !inverted ?
    //   data[gameIndex].type === bottomButton.type :
    //   data[gameIndex].type === bottomButton.type;

    const isValid = data[gameIndex].type === bottomButton.type;
    
    //console.log("isValid", isValid, "gameIndex", gameIndex, "bottomButton.type", bottomButton.type, "data[gameIndex].type", data[gameIndex].type);

    if (isValid) {
      if (!allTypes)
        bottomButton.state = ButtonState.disabled;
      
      updatedPhraseButtons[gameIndex].state = ButtonState.correct;

      if (gameIndex < bottomButtons.length - 1)
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
    <GameLayout
      resetGame={resetGame}
    >
      {
        phraseButtons ?
          <View style={styles.phraseContainer}>
            {
              phraseButtons.map((button, index) => (
                <WordButton
                  key={index}
                  text={button.text}
                  state={button.state}
                  type={button.type}
                  drawType={button.drawType}
                />
              ))
            }
          </View>
          :
          <View style={styles.phraseContainer}>
            <ThemedText>Loading...</ThemedText>
          </View>
      }
      {        
        bottomButtons ?
          <View style={styles.phraseContainer}>
            {
              bottomButtons.map((button, index) => (
                <WordButton
                  key={index}
                  text={button.text}
                  state={button.state}
                  onClick={() => onBottomButtonClicked(button)}
                  type={button.type}
                  drawType={button.drawType}
                />
              ))
            }
          </View>
          :
          <View style={styles.phraseContainer}>
            <ThemedText>Loading...</ThemedText>
          </View>
      }
    </GameLayout>
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