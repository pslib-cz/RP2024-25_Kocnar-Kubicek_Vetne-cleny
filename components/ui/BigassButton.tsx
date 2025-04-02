import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BigassButton(
  {title, bgEmoji, onPress = () => {}} : {title: string, bgEmoji: string, onPress?: () => void}
) {
  return (
    <View style={styles.container} onTouchStart={onPress}>
      <View style={styles.logoContainer}>
        <View style={styles.logoContent}>
          <Text style={styles.logoText}>{title}</Text>
        </View>
        <View style={styles.catBackground}>
          <Text style={styles.catEmoji}>{bgEmoji}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  logoContainer: {
    width: 350,
    height: 200,
    backgroundColor: '#2A3192',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  logoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  catBackground: {
    position: 'absolute',
    right: 40,
    top: 70,
    opacity: 0.2,
  },
  catEmoji: {
    fontSize: 140,
    color: '#4F55BC',
    transform: [{ rotate: '-30deg' }],
    position: 'absolute',
    top: -20,
    right: -75,
  }
});