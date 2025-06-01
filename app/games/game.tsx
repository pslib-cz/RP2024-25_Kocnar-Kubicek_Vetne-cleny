import { SafeAreaView } from "react-native-safe-area-context";
import React, { act, useEffect } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useGameContext } from "@/contexts/GameContext";
import { Text } from "react-native-svg";
import { useRouter } from "expo-router";
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import RocketProgressBar from "@/components/ui/games/ProgressBar";
import { Game1Type, GameOneUI } from "@/components/games/game1";
// import { GameRoute } from "@/constants/gameRoute";
import { Game2UI } from "@/components/games/game2";
import { Game3UI } from "@/components/games/game3";
import { ThemedText } from "@/components/ThemedText";
import { useBackspaceIntercept } from "@/hooks/useBackspaceIntercept";
import { GeneratorParam, QuestionModifier, QuestionType } from "@/constants/questionGeneratorParams";
import { hints } from "@/constants/GameHints";
import { FeedbackOverlay } from "@/components/modals/FeedbackOverlay";
import HintModal from "@/components/modals/HintModal";

export const Game: React.FC = () => {
  const { gameState, activeQuestion, questions, gameInfo } = useGameContext();

  const router = useRouter(); 
  const [hintActive, setHintActive] = React.useState(false);

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
    console.log("Active question modifiers " + activeQuestion?.TEMPLATE[GeneratorParam.QUESTION_TYPE]);

    if (activeQuestion?.TEMPLATE && activeQuestion?.TEMPLATE[GeneratorParam.QUESTION_MODIFIER]) {
      console.log("Question modifiers:");
      const modifiers = activeQuestion.TEMPLATE[GeneratorParam.QUESTION_MODIFIER];
      
      // If it's an array of modifiers
      if (Array.isArray(modifiers)) {
        for (const modifier of modifiers) {
          console.log(`- ${QuestionModifier[modifier]}`);
        }
      } 
      // If it's a single modifier value
      else {
        console.log(`- ${QuestionModifier[modifiers]}`);
      }
    }

  }, [activeQuestion]);

  const gameContent = () => {
    switch (activeQuestion?.TEMPLATE[GeneratorParam.QUESTION_TYPE]) {
      case QuestionType.MARK_WORDS:
        return GameOneUI(Game1Type.normal)
      case QuestionType.MARK_TYPES:
        return GameOneUI(Game1Type.inverted)
      case QuestionType.MARK_WORDS_ALL_TYPES:
        return GameOneUI(Game1Type.allTypes)
      case QuestionType.MARK_TYPE_ONE_WORD:
        return GameOneUI(Game1Type.oneWord, activeQuestion?.INDEX)
      case QuestionType.SELECT_MULTIPLE:
        return Game2UI(activeQuestion.WANTED)
      case QuestionType.SELECT_MULTIPLE_W_SENTENCE:
        return Game3UI(activeQuestion.WANTED)
      case QuestionType.SELECT_ONE_W_SENTENCE:
        return Game3UI(activeQuestion.WANTED)
      // case QuestionType.SELECT_TYPE:
      //   return Game2UI(true)
      default:
        throw new Error(`Unsupported question type: ${activeQuestion?.TEMPLATE[GeneratorParam.QUESTION_TYPE]}`);
    }
  }

  const HelpButton = () => {
    return (
      <TouchableOpacity
        style={[
          styles.button
        ]} 
        onPress={() => {setHintActive(true)}}
      >
        <ThemedText type="defaultSemiBold" style={{fontWeight: 900}}>?</ThemedText>
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
        <ThemedText type="defaultSemiBold" style={{fontWeight: 900}}>X</ThemedText>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <HintModal
        visible={hintActive} 
        onClose={() => {setHintActive(false)}}
        message={
          hints[activeQuestion?.TEMPLATE[GeneratorParam.QUESTION_TYPE] as keyof typeof hints] || 
          "No hints available for this question."
        }
      />
      <FeedbackOverlay
        state={gameState}
      />
      <View style={[styles.headerWrapper]}>
        <View style={{ flexShrink: 1}}>
          <HelpButton />
        </View>        
        <View style={{ flexShrink: 1, flexGrow: 999 }}>
          <RocketProgressBar progress={(gameInfo.activeQuestionIndex - 1) / questions.length}/>
        </View>
        <View style={{ flexShrink: 1}}>
          <CloseButton />
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
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    gap: 12,
  },
  container: {
    flex: 1,
    backgroundColor: '#101223',
    paddingHorizontal: 20,
    paddingVertical: 56,
    gap: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container1: {
    flex: 1,
    // backgroundColor: '#101223',
    gap: 32,
    // paddingVertical: 4,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#1E1E5F', // Dark blue color from the image
    // paddingVertical: 12,
    aspectRatio: 1,
    height: 40,
    // paddingHorizontal: 8,
    borderRadius: 24, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 300, // Maximum width
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Game;