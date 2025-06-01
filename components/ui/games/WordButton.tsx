import { getWordTypeColor } from '@/constants/WordTypes';
import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';

interface WordButtonProps {
  text: string;
  state?: ButtonState;
  onClick?: () => void;
  onLongPress?: () => void;
  type?: string;
  drawType?: boolean;
}

export enum ButtonState {
  default,
  highlighted,
  disabled,
  correct
}

const WordButton: React.FC<WordButtonProps> = ({ text, state, onClick, onLongPress, type, drawType }) => {
  const stateStyles = {
    [ButtonState.default]: null,
    [ButtonState.highlighted]: styles.highlightedButton,
    [ButtonState.disabled]: styles.disabledButton,
    [ButtonState.correct]: styles.correctButton,
  }

  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === ButtonState.highlighted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(borderAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(borderAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      borderAnim.stopAnimation();
      borderAnim.setValue(0);
    }
  }, [state, borderAnim]);

  const animatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#aaaa88'], // blikání mezi bílou a šedou
  });

  if (state === ButtonState.highlighted) {
    return (
      <Animated.View
        style={[
          styles.button,
          styles.highlightedButton,
          {
            borderColor: animatedBorderColor,
            backgroundColor: type && drawType && getWordTypeColor(type) || 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <TouchableOpacity
          onPress={onClick}
          onLongPress={onLongPress}
          disabled={!onClick}
        >
          <Text style={[
            styles.buttonText,
          ]}
          >
            {text}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        stateStyles[state || ButtonState.default],
        { backgroundColor: type && drawType && getWordTypeColor(type) || 'transparent' },
      ]}
      onPress={onClick}
      onLongPress={onLongPress}
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
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  highlightedButton: {
    backgroundColor: 'transparent',
    borderColor: '#ffffff',
    borderWidth: 3,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  disabledButton: {
    opacity: 0.25,
  },
  correctButton: {
    borderColor: '#2a9d8f',
    borderWidth: 3,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#BBB',
    borderColor: '#BBB'
  },
});