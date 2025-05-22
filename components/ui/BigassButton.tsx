import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BigassButton(
  { title, bgEmoji, onPress = () => { }, enabled = true }: { title: string, bgEmoji: string, onPress?: () => void, enabled?: boolean }
) {
  return (
    <TouchableOpacity
      style={[styles.container, !enabled && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={!enabled}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoContent}>
          <Text style={styles.logoText}>{title}</Text>
        </View>
        <View style={styles.catBackground}>
          <Text style={styles.catEmoji}>{bgEmoji}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoContainer: {
    width: 350,
    height: 175,
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
    right: 40,
    top: 70,
    opacity: 0.2,
    position: 'absolute',
  },
  catEmoji: {
    transform: [{ rotate: '-30deg' }],
    fontSize: 140,
    color: '#4F55BC',
    position: 'absolute',
    top: -20,
    right: -75,
  }
});