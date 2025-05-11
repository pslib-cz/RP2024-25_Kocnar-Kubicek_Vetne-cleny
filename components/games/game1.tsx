import { ThemedText } from '@/components/ThemedText';
import WordButton, { ButtonState } from '@/components/ui/games/WordButton';
import React, { useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { WordButtonType } from '@/types/games/WordButtonType';
import { useGameContext } from '@/contexts/GameContext';
import { WordTypes } from '@/constants/WordTypes';
import { useLevelContext } from '@/contexts/levelContext';
import { Tooltip } from '@/components/ui/games/Tooltip';

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
  const { gameIndex, setGameIndex, phraseButtons, setPhraseButtons, bottomButtons, setBottomButtons } = useLevelContext();

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

    if (data[gameIndex].type === bottomButton.type) {
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

  // Helper to get full definition by abbr
  const getDefinition = (abbr: string) => {
    const found = WordTypes.find((w) => w.abbr === abbr);
    return found ? found.name : abbr;
  };

  // Helper to check if a string is a word type abbreviation
  const isWordTypeAbbr = (abbr: string) => WordTypes.some(w => w.abbr === abbr);

  // Show tooltip for abbreviation
  const handleShowTooltip = (abbr: string, index: number) => {
    setTooltip({ visible: true, message: getDefinition(abbr), index });
  };
  const handleHideTooltip = () => {
    setTooltip({ visible: false, message: '', index: null });
  };

  return (
    <>
      <View></View>
      {
        phraseButtons ?
          <View style={styles.phraseContainer}>
            {
              phraseButtons.map((button, index) => {
                if (inverted && isWordTypeAbbr(button.text)) {
                  return (
                    <Tooltip
                      key={index}
                      visible={tooltip.visible && tooltip.index === index}
                      message={tooltip.message}
                      onRequestClose={handleHideTooltip}
                    >
                      <WordButton
                        text={button.text}
                        state={button.state}
                        type={button.type}
                        drawType={button.drawType}
                        onLongPress={() => handleShowTooltip(button.text, index)}
                        onClick={handleHideTooltip}
                      />
                    </Tooltip>
                  );
                }
                return (
                  <WordButton
                    key={index}
                    text={button.text}
                    state={button.state}
                    type={button.type}
                    drawType={button.drawType}
                  />
                );
              })
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
              bottomButtons.map((button, index) => {
                if (!inverted && isWordTypeAbbr(button.text)) {
                  return (
                    <Tooltip
                      key={index}
                      visible={tooltip.visible && tooltip.index === index}
                      message={tooltip.message}
                      onRequestClose={handleHideTooltip}
                    >
                      <WordButton
                        text={button.text}
                        state={button.state}
                        onClick={() => { onBottomButtonClicked(button); handleHideTooltip(); }}
                        onLongPress={() => handleShowTooltip(button.text, index)}
                        type={button.type}
                        drawType={button.drawType}
                      />
                    </Tooltip>
                  );
                }
                return (
                  <WordButton
                    key={index}
                    text={button.text}
                    state={button.state}
                    onClick={() => onBottomButtonClicked(button)}
                    type={button.type}
                    drawType={button.drawType}
                  />
                );
              })
            }
          </View>
          :
          <View style={styles.phraseContainer}>
            <ThemedText>Loading...</ThemedText>
          </View>
      }
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