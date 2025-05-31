import { WordSelectionOption } from "@/types/games/SelectionOption"
import React from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
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
        {options ?
          options.map((option, index) => (
            <LargeGameButton
              key={index}
              text={option.text}
              selected={selectedOptions.includes(option)}
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
    gap: 20,
    justifyContent: 'space-between',
  }
});