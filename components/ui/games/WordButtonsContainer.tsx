import { WordButtonType } from "@/types/games/WordButtonType";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Tooltip } from "./Tooltip";
import WordButton from "./WordButton";
import { ThemedText } from "@/components/ThemedText";
import { useLevelContext } from "@/contexts/levelContext";

export const WordButtonsContainer = (
  {buttons, showTooltip, longPress, onClick} : 
  {
    buttons : WordButtonType[] | undefined, 
    showTooltip : boolean, 
    longPress: (button: WordButtonType, index : number) => void,
    onClick: (button: WordButtonType, index: number) => void
  }
) => {

  const { tooltip, handleHideTooltip } = useLevelContext();

  return(
    <>
    {
      buttons ?
      <View style={styles.phraseContainer}>
        {
          buttons.map((button, index) => {
            return (
              <Tooltip
                key={index}
                visible={showTooltip && tooltip.visible && tooltip.index === index}
                message={tooltip.message}
                onRequestClose={handleHideTooltip}
              >
                <WordButton
                  text={button.text}
                  state={button.state}
                  type={button.type}
                  drawType={button.drawType}
                  onLongPress={() => longPress(button, index)}
                  onClick={() => onClick(button, index)}
                />
              </Tooltip>
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
  )
}

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