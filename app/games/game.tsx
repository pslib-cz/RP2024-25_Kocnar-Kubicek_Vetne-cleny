import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
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

export const Game: React.FC = () => {
  const { state, gameData, gameType } = useGameContext();

  const router = useRouter(); 

  useBackspaceIntercept(() => {
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
  });

  const gameContent = () => {
    switch (gameType) {
      case GameRoute.GAME1:
        return GameOneUI(Game1Type.normal)
      case GameRoute.GAME1_INVERTED:
        return GameOneUI(Game1Type.inverted)
      case GameRoute.GAME1_ALL_TYPES:
        return GameOneUI(Game1Type.allTypes)
      case GameRoute.GAME2:
        return Game2UI(false)
      case GameRoute.GAME2_MULTI:
        return Game2UI(true)
      case GameRoute.GAME3:
        return Game3UI(true)
      default:
        return <Text>Game not found</Text>
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
            router.push({
              pathname: '/tutorial',
              params: { returnTo: 'games/game' }
            });
        }}
      >
        <ThemedText type="defaultSemiBold">x</ThemedText>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackOverlay
        state={state}
      />
      <View style={[styles.headerWrapper]}>
        <View style={{ flexShrink: 1, flexGrow: 1, flexDirection: 'row', gap: 8 }}>
          <View style={{ flexShrink: 1}}>
            <HelpButton />
          </View>        
          <View style={{ flexShrink: 1, flexGrow: 999 }}>
            <RocketProgressBar progress={1 - (gameData.questionsRemaining + 1) / gameData.totalQuestion}/>
          </View>
          <View style={{ flexShrink: 1}}>
            <CloseButton />
          </View>
        </View>
      </View>
      <Animated.View
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