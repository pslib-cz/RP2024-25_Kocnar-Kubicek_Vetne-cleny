import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

export enum LargeGameButtonStyle {
  default,
  selected,
  correct,
  incorrect,
}

export const LargeGameButton = (
  { text, style, onPress }: 
  { text: string; style: LargeGameButtonStyle; onPress: () => void }
) => {

  if (!text || text.length === 0)
    console.warn("LargeGameButton received an empty text prop.");

  const getButtonStyle = () => {
    switch (style) {
      case LargeGameButtonStyle.selected:
        return styles.selectedOption;
      case LargeGameButtonStyle.correct:
        return styles.correctOption;
      case LargeGameButtonStyle.incorrect:
        return styles.incorrectOption;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.option, getButtonStyle()]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.optionText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    width: '47%',
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101223',
  },
  selectedOption: {
    borderColor: '#6266f1',
    backgroundColor: 'rgba(98, 102, 241, 0.1)',
  },
  correctOption: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  incorrectOption: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});