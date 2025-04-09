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
      setData(parsed[0].data);
    },
    (error) => {
      console.error("Error parsing file:", error);
    });
  }, []);

  const [gameIndex, setGameIndex] = useState(0); // id of the current game card

  const [phraseButtons, setPhraseButtons] = useState<WordButtonType[]>();

  const [bottomButtons, setBottomButtons] = useState<WordButtonType[]>();

  useEffect(() => {
    console.log("Data change:", data);

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

    if (!phraseButtons || !data || !bottomButtons){
      console.log("Phrase buttons or data or bottomButtons not initialized yet");
      return;
    }

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