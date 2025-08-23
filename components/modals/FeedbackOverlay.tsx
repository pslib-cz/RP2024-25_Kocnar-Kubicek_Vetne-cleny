import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameState } from '@/types/gameState';
import { useGameContext } from '@/contexts/GameContext';
import { GameType } from '@/types/GameType';
import PlayfulButton from '../ui/PlayfulButton';

interface DisplayMessage {
  message: string;
  icon: 'checkmark-circle' | 'close-circle' | 'information-circle';
  themeColor: string;
}

const GetDisplayMessage = (gameState: GameState) : DisplayMessage => {
  switch (gameState) {    
    case GameState.partiallyCorrect:
      return { message: "Byl si blízko", icon: "information-circle", themeColor: "#FF9F1C" };
    case GameState.correct:
      return { message: "Dobrá práce!", icon: "checkmark-circle", themeColor: "#8CC83C" };
    case GameState.incorrect:
      return { message: "To není dobře!", icon: "close-circle", themeColor: "#FF4B4B" };
    default:
      return { message: "Invalid state", icon: "close-circle", themeColor: "#FF4B4B" };
  }
}

export const FeedbackOverlay: React.FC = () => {
  const { nextQuestion, gameState, gameType, setGameState } = useGameContext();

  const displayMessage = GetDisplayMessage(gameState);

  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (gameState != GameState.pending) {
      const height = gameState == GameState.showingAnswers ?
        Dimensions.get('window').height - 120 :
        0;

      slideAnim.setValue(Dimensions.get('window').height);
      fadeAnim.setValue(0);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
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
  }, [gameState]);

  if (gameState == GameState.pending) return null;

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
        {
          gameState != GameState.showingAnswers &&
          <View style={styles.header}>
            <Ionicons name={displayMessage.icon} size={32} color={displayMessage.themeColor} style={styles.icon} />
            <Text style={[styles.headerText, { color: displayMessage.themeColor }]}>
              {displayMessage.message}
            </Text>
          </View>
        }

        <View>
          <PlayfulButton
            onPress={() => nextQuestion()}
            title='Další otázka'
            variant='custom'
            customColors={[displayMessage.themeColor, displayMessage.themeColor]}
          />
          {
            gameState !== GameState.correct && gameType != GameType.TEST && gameState != GameState.showingAnswers &&
            <PlayfulButton
              onPress={() => setGameState(GameState.showingAnswers)}
              title='Správné odpovědi'
              variant='gray'
            />
          }
        </View>

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
    backgroundColor: 'rgba(28, 41, 43, 0.97)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    paddingTop: 32,
    paddingBottom: 75,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 80,
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
    marginBottom: 20,
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