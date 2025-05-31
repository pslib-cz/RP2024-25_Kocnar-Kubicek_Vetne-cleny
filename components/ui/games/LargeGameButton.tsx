import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

export const LargeGameButton = ({ text, selected, onPress }: { text: string; selected: boolean; onPress: () => void }) => {
  
  if (!text || text.length === 0)
    console.warn("LargeGameButton received an empty text prop.");
  
  return (
  <TouchableOpacity
    style={[styles.option, selected && styles.selectedOption]}
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
    backgroundColor: '#000',
  },
  selectedOption: {
    borderColor: '#6266f1',
    backgroundColor: 'rgba(98, 102, 241, 0.1)',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});