import RocketProgressBar from '@/components/ui/games/ProgressBar';
import WordButton, { ButtonState } from '@/components/ui/games/WordButton';
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ToastAndroid } from 'react-native';

const LanguageLearningScreen: React.FC = () => {

  interface WordButtonType {
    text: string;
    state?: ButtonState;
  }

  const data = [
    {word: 'pro radost 1', type: 'PO 1'},
    {word: 'sedával 2', type: 'PŮJ 2'},
    {word: 'vždycky 3', type: 'PŘ 3'},
    {word: 'u otevřeného 4', type: 'PUČ 4'},
    {word: 'okna. 5', type: 'PKS 5'},
  ]

  const [phraseButtons, setPhraseButtons] = useState<WordButtonType[]>(    
    data.map((item, index) => ({
      text: item.word,
      state: index === 0 ? ButtonState.highlighted : ButtonState.default
    }))
  );

  const [bottomButtons, setBottomButtons] = useState<WordButtonType[]>(
    data.map((item) => ({
      text: item.type,
      state: ButtonState.default
    }))
  .sort(() => Math.random() - 0.5)
  );

  const [gameIndex, setGameIndex] = useState(0);

  const onBottomButtonClicked = (bottomButton: WordButtonType) => {
    const updatedPhraseButtons = [...phraseButtons];

    if (bottomButton.text === data[gameIndex].type) {
      bottomButton.state = ButtonState.disabled;
      updatedPhraseButtons[gameIndex].state = ButtonState.disabled;

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

      {/* Bottom word options */}
      <View style={styles.bottomContainer}>
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
      </View>
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
  },
  phraseContainer: {
    display: 'flex',
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
  },
  bottomContainer: {
    marginTop: 'auto',
    marginBottom: 50,
  }
});

export default LanguageLearningScreen;