import { SafeAreaView } from "react-native-safe-area-context";
import RocketProgressBar from "../ui/games/ProgressBar";
import { FeedbackOverlay } from "../FeedbackOverlay";
import React, { ReactNode } from "react";
import { StyleSheet } from 'react-native';
import { useGameContext } from "@/contexts/GameContext";

interface GameLayoutProps {
  children: ReactNode;
  resetGame: () => void
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children, resetGame }) => {
  const { state, gameData } = useGameContext();

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackOverlay
        state={state}
        resetGame={resetGame}
      />
      <RocketProgressBar progress={1 - (gameData.questionsRemaining + 1) / gameData.totalQuestion} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});