import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useGameContext } from "@/contexts/GameContext";
import { Text } from "react-native-svg";
import { useRouter } from "expo-router";
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { FeedbackOverlay } from "@/components/FeedbackOverlay";
import RocketProgressBar from "@/components/ui/games/ProgressBar";
import { Game1Type, GameOneUI } from "@/components/games/game1";
import { GameRoute } from "@/constants/gameRoute";
import { Game2UI } from "@/components/games/game2";
import { Game3UI } from "@/components/games/game3";
import { ThemedText } from "@/components/ThemedText";
import { useBackspaceIntercept } from "@/hooks/useBackspaceIntercept";
import { GeneratorParam, QuestionType } from "@/constants/questionGeneratorParams";

export const Game: React.FC = () => {
  const { gameState, activeQuestion, questions, gameInfo } = useGameContext();

  const router = useRouter(); 

  function leaveAlert(){
    Alert.alert(
      'Opravdu chcete opustit hru?',
      'Pokud opustíte hru, ztratíte veškerý pokrok.',
      [
        { text: 'Zrušit', style: 'cancel', onPress: () => {} },
        {
          text: 'Opustit hru',
          style: 'destructive',
          onPress: () => {
            router.replace("/");
          },
        },
      ]
    );
  }

  useBackspaceIntercept(() => {
    leaveAlert()
  });

  useEffect(() => {
    console.log("activeQuestion:", activeQuestion?.TEMPLATE[GeneratorParam.QUESTION_TYPE]);
  }, [activeQuestion]);

  const gameContent = () => {
    switch (activeQuestion?.TEMPLATE[GeneratorParam.QUESTION_TYPE]) {
      case QuestionType.MARK_WORDS:
        return GameOneUI(Game1Type.normal)
      case QuestionType.MARK_TYPES:
        return GameOneUI(Game1Type.inverted)
      case QuestionType.MARK_WORDS_ALL_TYPES:
        return GameOneUI(Game1Type.allTypes)
      case QuestionType.SELECT_MULTIPLE:
        return Game2UI()
      case QuestionType.SELECT_MULTIPLE_W_SENTENCE:
        return Game3UI()
      default:
        return Game3UI()
    }
  }

  const HelpButton = () => {
    return (
      <TouchableOpacity
        style={[
          styles.button
        ]} 
        onPress={() => {
            router.push({
              pathname: '/tutorial',
              params: { returnTo: 'games/game' }
            });
        }}
      >
        <ThemedText type="defaultSemiBold">?</ThemedText>
      </TouchableOpacity>
    )
  }

  const CloseButton = () => {
    return (
      <TouchableOpacity
        style={[
          styles.button
        ]} 
        onPress={() => {
          leaveAlert()
        }}
      >
        <ThemedText type="defaultSemiBold">X</ThemedText>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackOverlay
        state={gameState}
      />
      <View style={[styles.headerWrapper]}>
        <View style={{ flexShrink: 1, flexGrow: 1, flexDirection: 'row', gap: 8 }}>
          <View style={{ flexShrink: 1}}>
            <HelpButton />
          </View>        
          <View style={{ flexShrink: 1, flexGrow: 999 }}>
            <RocketProgressBar progress={1 - (gameInfo.activeQuestionIndex + 1) / questions.length}/>
          </View>
          <View style={{ flexShrink: 1}}>
            <CloseButton />
          </View>
        </View>
      </View>
      <Animated.View
        key={gameInfo.activeQuestionIndex} // Force remount -> animation
        entering={SlideInRight.duration(500)}
        exiting={SlideOutLeft.duration(500)}
        style={ styles.container1 }
      >
        {gameContent()}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  container1: {
    flex: 1,
    backgroundColor: '#000',
    gap: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#1E1E5F', // Dark blue color from the image
    // paddingVertical: 12,
    aspectRatio: 1,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 24, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 300, // Maximum width
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Game;