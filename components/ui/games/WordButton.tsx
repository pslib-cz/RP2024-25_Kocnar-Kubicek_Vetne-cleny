import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

interface WordButtonProps {
  text: string;
  state?: ButtonState;
  onClick?: () => void;
}

export enum ButtonState {
  default,
  highlighted,
  disabled,
  correct
}

const WordButton: React.FC<WordButtonProps> = ({ text, state, onClick }) => {
  const stateStyles = {
    [ButtonState.default]: null,
    [ButtonState.highlighted]: styles.highlightedButton,
    [ButtonState.disabled]: styles.disabledButton,
    [ButtonState.correct]: styles.correctButton,
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        stateStyles[state || ButtonState.default]
      ]}
      onPress={onClick}
      disabled={state === ButtonState.disabled || !onClick}
    >
      <Text style={[
        styles.buttonText,
        state === ButtonState.disabled ? styles.disabledButtonText : null,
      ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default WordButton;

const styles = StyleSheet.create({
  button: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  highlightedButton: {
    backgroundColor: 'transparent',
    borderColor: '#1155BB',
  },
  disabledButton: {
    // backgroundColor: '#333',
  },
  correctButton: {
    // backgroundColor: '#2a9d8f',
    borderColor: '#2a9d8f',
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#333',
  },
});