import { ThemedText } from '@/components/ThemedText';
import RocketProgressBar from '@/components/ui/games/ProgressBar';
import WordButton, { ButtonState } from '@/components/ui/games/WordButton';
import { ParseFile, useCSV } from '@/hooks/useCSV';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ToastAndroid, View } from 'react-native';

const LanguageLearningScreen: React.FC = () => {

  interface WordButtonType {
    text: string;
    state?: ButtonState;
  }

  const [data, setData] = useState<WordSelectionOption[]>();

  useEffect(() => {
    ParseFile("data/List1.csv", (parsed) => {
      console.log("Parsed data:", parsed);
      setData(parsed.map((item, index) => ({
        id: String(index),
        text: item[0],
        type: item[1],
      })));
    },
    (error) => {
      console.error("Error parsing file:", error);
    });
  }, []);

  /*
  const data = [
    {word: 'pro radost 1', type: 'PO 1'},
    {word: 'sedával 2', type: 'PŮJ 2'},
    {word: 'vždycky 3', type: 'PŘ 3'},
    {word: 'u otevřeného 4', type: 'PUČ 4'},
    {word: 'okna. 5', type: 'PKS 5'},
  ]
  */

  console.log("Data loaded:", data);

  const [gameIndex, setGameIndex] = useState(0); // id of the current game card

  const [phraseButtons, setPhraseButtons] = useState<WordButtonType[]>();

  const [bottomButtons, setBottomButtons] = useState<WordButtonType[]>();

  useEffect(() => {
    if (data) {
      setPhraseButtons(
        data.map((item, index) => ({
          text: item.text,
          state: index === 0 ? ButtonState.highlighted : ButtonState.default
        }))
      );

      setBottomButtons(
        data.map((item) => ({
          text: item.type,
          state: ButtonState.default
        }))
        .sort(() => Math.random() - 0.5)
      )
    }
  }, [data]);

  const onBottomButtonClicked = (bottomButton: WordButtonType) => {
    const updatedPhraseButtons = [...phraseButtons];

    if (bottomButton.text === data[gameIndex].type) {
      bottomButton.state = ButtonState.disabled;
      updatedPhraseButtons[gameIndex].state = ButtonState.correct;

      if (gameIndex < bottomButtons.length - 1) 
        updatedPhraseButtons[gameIndex + 1].state = ButtonState.highlighted;

      setGameIndex(gameIndex + 1);

    }
    else{
      ToastAndroid.show('Incorrect!', ToastAndroid.SHORT);
    }

    setBottomButtons([...bottomButtons]); // make sure to update the state
    setPhraseButtons(updatedPhraseButtons);
  };

  return (
    <SafeAreaView style={styles.container}>
      <RocketProgressBar progress={0.33} />
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

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 60,
    gap: 40,
    justifyContent: 'space-between'
  },
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

export default LanguageLearningScreen;