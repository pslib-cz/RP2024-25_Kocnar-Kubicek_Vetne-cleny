import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

interface WordButtonProps {
  text: string;
  state?: ButtonState;
  onClick?: () => void;
}

export enum ButtonState{
  default,
  highlighted,
  disabled
}

const WordButton: React.FC<WordButtonProps> = ({ text, state, onClick }) => {  
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
      disabled={state === ButtonState.disabled}
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