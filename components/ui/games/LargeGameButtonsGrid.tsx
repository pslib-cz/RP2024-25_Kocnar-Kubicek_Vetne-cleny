import { WordSelectionOption } from "@/types/games/SelectionOption"
import React from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { LargeGameButton, LargeGameButtonStyle } from "./LargeGameButton"

type LargeGameButtonsGridProps = {
  options?: WordSelectionOption[];
  selectedOptions: WordSelectionOption[];
  handleSelect: (option: WordSelectionOption) => void;
  correctType?: string | null;
};

export const LargeGameButtonsGrid: React.FC<LargeGameButtonsGridProps> = ({ options, selectedOptions, handleSelect, correctType = null }) => {

  const getButtonStyle = (option: WordSelectionOption) : LargeGameButtonStyle => {

    if (correctType) {
      if (option.type === correctType) {
        return LargeGameButtonStyle.correct;
      }
      else{
        return LargeGameButtonStyle.incorrect;
      }
    }

    if (selectedOptions.includes(option)) {
      return LargeGameButtonStyle.selected;
    }
    return LargeGameButtonStyle.default;
  }

  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={[styles.grid, { marginBottom: 40 }]}>
        {options ?
          options.map((option, index) => (
            <LargeGameButton
              key={index}
              text={option.text}
              style={getButtonStyle(option)}
              onPress={() => handleSelect(option)}
            />
          ))
          :
          <Text style={{ textAlign: 'center', width: '100%' }}>
            Načítání dat...
          </Text>
        }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: "6%",
    justifyContent: 'space-between',
  }
});