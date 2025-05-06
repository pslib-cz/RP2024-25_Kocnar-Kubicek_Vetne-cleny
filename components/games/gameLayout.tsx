import { SafeAreaView } from "react-native-safe-area-context";
import RocketProgressBar from "../ui/games/ProgressBar";
import { FeedbackOverlay } from "../FeedbackOverlay";
import React, { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useGameContext } from "@/contexts/GameContext";
import { Text } from "react-native-svg";
import { useRouter } from "expo-router";

interface GameLayoutProps {
  children: ReactNode;
  resetGame: () => void
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children, resetGame }) => {
  const { state, gameData } = useGameContext();

  const navigation = useRouter(); 

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackOverlay
        state={state}
        resetGame={resetGame}
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
              navigation.push('tutorial' as never, )
            }}
          >
            <Text>?</Text>
          </TouchableOpacity>
        </View>
      </View>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    gap: 8,
    flexShrink: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
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