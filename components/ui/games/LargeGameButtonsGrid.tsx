import { WordSelectionOption } from "@/types/games/SelectionOption"
import React from "react"
import { ScrollView, StyleSheet } from "react-native"
import { View } from "react-native-reanimated/lib/typescript/Animated"
import { LargeGameButton } from "./LargeGameButton"


type LargeGameButtonsGridProps = {
  options?: WordSelectionOption[];
  selectedOptions: WordSelectionOption[];
  handleSelect: (option: WordSelectionOption) => void;
};

export const LargeGameButtonsGrid: React.FC<LargeGameButtonsGridProps> = ({options, selectedOptions, handleSelect}) => {
  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={[styles.grid, { marginBottom: 40 }]}>
        {options &&
          options.map((option, index) => (
            <LargeGameButton
              key={index}
              text={option.text}
              selected={selectedOptions.includes(option)}
              onPress={() => handleSelect(option)}
            />
          ))}
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
    gap: 20,
    justifyContent: 'space-between',
  }
});