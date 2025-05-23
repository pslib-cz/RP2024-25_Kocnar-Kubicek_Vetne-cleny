import { SafeAreaView } from "react-native-safe-area-context";
import RocketProgressBar from "../ui/games/ProgressBar";
import { FeedbackOverlay } from "../FeedbackOverlay";
import React, { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useGameContext } from "@/contexts/GameContext";
import { Text } from "react-native-svg";
import { useRouter } from "expo-router";
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useMultiplayerGameContext } from "@/contexts/MultiplayerGameContext";

interface GameLayoutProps {
  children: ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const { state, gameData } = useGameContext();
  const { code } = useMultiplayerGameContext();

  const navigation = useRouter(); 

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackOverlay
        state={state}
      />
      <View style={[styles.headerWrapper]}>
        <View style={{ flexShrink: 1, flexGrow: 999 }}>
          <RocketProgressBar progress={1 - (gameData.questionsRemaining + 1) / gameData.totalQuestion}/>
        </View>
        <View style={{ flexShrink: 1, flexGrow: 1 }}>
          <TouchableOpacity
            style={[
              styles.button
            ]} 
            onPress={() => {
              navigation.push('tutorial' as never)
            }}
          >
            <Text>?</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View
        entering={SlideInRight.duration(500)}
        exiting={SlideOutLeft.duration(500)}
        style={ styles.container1 }
      >
        {children}
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
    gap: 32,
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300, // Maximum width
    color: 'white',
    fontWeight: 'bold',
  },
});