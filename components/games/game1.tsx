import { ThemedText } from '@/components/ThemedText';
import WordButton, { ButtonState } from '@/components/ui/games/WordButton';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { WordButtonType } from '@/types/games/WordButtonType';
import { GameState } from '@/types/gameState';
import { useFocusEffect } from 'expo-router';
import { useGameContext } from '@/contexts/GameContext';
import { GameLayout } from './gameLayout';

// TODO: implement custom max error count

export const enum Game1Type {
  normal = 0,
  inverted = 1,
  allTypes = 2
}

const allTypeTypes : string[] = [
  "po",
  "př",
  "a další"
]

export function GameOneUI(type: Game1Type) {
  const inverted = type == Game1Type.inverted;
  const allTypes = type == Game1Type.allTypes;

  const { data, onFinished } = useGameContext();

  const [gameIndex, setGameIndex] = useState(0); // id of the current game card
  const [phraseButtons, setPhraseButtons] = useState<WordButtonType[]>();
  const [bottomButtons, setBottomButtons] = useState<WordButtonType[]>();

  // Function to initialize or reset the game
  const resetGame = useCallback(() => {
    console.log("-------------- RESETTING Game1 --------------");
    setGameIndex(0);
    //setState(GameState.pending);
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
    console.log("Game1 Data were changed");

    if (data) {
      setPhraseButtons(
        data.map((item, index) => ({
          text: !inverted ? item.text : item.type,
          state: index === 0 ? ButtonState.highlighted : ButtonState.default
        }))
      );

      if (allTypes) {
        setBottomButtons(
          allTypeTypes.map((i) => ({
            text: i,
            state: ButtonState.default
          }))
        )
        return;
      }

      setBottomButtons(
        data.map((item) => ({
          text: !inverted ? item.type : item.text,
          state: ButtonState.default
        }))
          .sort(() => Math.random() - 0.5)
      )
    }
  }, [data, inverted]);

  const onBottomButtonClicked = (bottomButton: WordButtonType) => {
    if (!phraseButtons || !data || !bottomButtons) {
      console.log("Phrase buttons or data or bottomButtons not initialized yet");
      return;
    }

    if (gameIndex >= data.length)
      throw Error("Game index is out of bounds");

    const updatedPhraseButtons = [...phraseButtons];

    const isValid = !inverted ?
      data[gameIndex].type === bottomButton.text :
      data[gameIndex].text === bottomButton.text;

    if (isValid) {
      bottomButton.state = ButtonState.disabled;
      updatedPhraseButtons[gameIndex].state = ButtonState.correct;

      if (gameIndex < bottomButtons.length - 1)
        updatedPhraseButtons[gameIndex + 1].state = ButtonState.highlighted;

      if (gameIndex === data.length - 1) {
        ToastAndroid.show('Finished!', ToastAndroid.SHORT);
        onFinished(true)
      }

      setGameIndex(gameIndex + 1);
    }
    else {
      ToastAndroid.show('Incorrect!', ToastAndroid.SHORT);

      onFinished(false)
    }

    if (!allTypes)
      setBottomButtons([...bottomButtons]); // make sure to update the state
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