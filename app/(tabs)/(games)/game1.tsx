import RocketProgressBar from '@/components/ui/games/ProgressBar';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

interface WordButton {
  text: string;
  selected?: boolean;
  highlighted?: boolean;
  onClick?: () => void;
}

const WordButton: React.FC<WordButton> = ({ text, selected, highlighted, onClick }) => {
  return (
    <TouchableOpacity
      style={[
        styles.bottomButton,
        selected && styles.selectedBottomButton,
        highlighted && styles.highlightedBottomButton,
      ]}
      onPress={onClick}
    >
      <Text style={styles.bottomButtonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const LanguageLearningScreen: React.FC = () => {
  const [phraseButtons, setPhraseButtons] = useState<WordButton[]>([
    { text: 'pro radost', selected: true },
    { text: 'sedával' },
    { text: 'vždycky' },
    { text: 'u otevřeného' },
    { text: 'okna.' },
  ]);

  const [bottomButtons, setBottomButtons] = useState<WordButton[]>([
    { text: 'PO', highlighted: true },
    { text: 'PŮJ', selected: true },
    { text: 'PŘ' },
    { text: 'PUČ' },
    { text: 'PKS' },
    { text: 'PŮM.' },
  ]);

  const togglePhraseSelection = (index: number) => {
    const updatedButtons = [...phraseButtons];
    updatedButtons[index].selected = !updatedButtons[index].selected;
    setPhraseButtons(updatedButtons);
  };

  const toggleBottomSelection = (index: number) => {
    const updatedButtons = [...bottomButtons];
    updatedButtons[index].selected = !updatedButtons[index].selected;
    setBottomButtons(updatedButtons);
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
              selected={button.selected}
              highlighted={button.highlighted}
              onClick={() => togglePhraseSelection(index)}
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
                selected={button.selected}
                highlighted={button.highlighted}
                onClick={() => toggleBottomSelection(index)}
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
  },
  bottomButton: {
    backgroundColor: '#333',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  selectedBottomButton: {
    backgroundColor: '#1d3557',
    borderColor: '#2575fc',
    borderWidth: 1,
  },
  highlightedBottomButton: {
    backgroundColor: 'transparent',
    borderColor: '#e63946',
    borderWidth: 1,
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LanguageLearningScreen;