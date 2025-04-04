import RocketProgressBar from '@/components/ui/games/ProgressBar';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

interface WordButtonType {
  text: string;
  state?: ButtonState;
  onClick?: () => void;
}

export enum ButtonState{
  default,
  highlighted,
  disabled
}

const WordButton: React.FC<WordButtonType> = ({ text, state, onClick }) => {  
  const stateStyles = {
    [ButtonState.default]: styles.bottomButton,
    [ButtonState.highlighted]: styles.highlightedBottomButton,
    [ButtonState.disabled]: styles.disabledBottomButton,
  }

  return (
    <TouchableOpacity
      style={[
        styles.bottomButton,
        stateStyles[state || ButtonState.default]
      ]}
      onPress={onClick}
    >
      <Text style={styles.bottomButtonText}>{text}</Text>
    </TouchableOpacity>
  );
}

export default WordButton;

const styles = StyleSheet.create({
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
  disabledBottomButton: {
    backgroundColor: '#999',
    borderColor: '#444',
    borderWidth: 1,
  },
});