import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameState } from '@/types/gameState';
import { useGameContext } from '@/contexts/GameContext';

interface OverlayProps {
  state: GameState;
}

export const FeedbackOverlay: React.FC<OverlayProps> = ({ 
  state, 
}) => { 
  const { moveToNextLevel } = useGameContext();

  const isCorrect = state == GameState.correct;

  const displayMessage = isCorrect ? "Dobrá práce!" : "To není dobře!";
  const displayIcon = isCorrect ? "checkmark-circle" : "close-circle";
  
  // Colors based on answer correctness
  const themeColor = isCorrect ? "#8CC83C" : "#FF4B4B";
  
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state != GameState.pending) {
      // Reset position before animating in
      slideAnim.setValue(Dimensions.get('window').height);
      fadeAnim.setValue(0);
      
      // Animate in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: Dimensions.get('window').height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [state]);

  if (state == GameState.pending) return null;

  return (
    <Animated.View 
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name={displayIcon} size={32} color={themeColor} style={styles.icon} />
          <Text style={[styles.headerText, { color: themeColor }]}>
            {displayMessage}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.continueButton, { backgroundColor: themeColor }]} 
          onPress={() => moveToNextLevel()}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Další otázka</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(28, 41, 43, 0.97)', // Dark background like Duolingo
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 15,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  continueButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#1C292B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  navButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#555',
  },
  squareIndicator: {
    width: 26,
    height: 26,
    backgroundColor: '#555',
  },
});