import SentenceDetailModal from '@/components/modals/SentenceDetailModal';
import { ThemedText } from '@/components/ThemedText';
import PlayfulButton from '@/components/ui/PlayfulButton';
import { useCommonMistakesContext } from '@/contexts/CommonMistakesContext';
import { useGameContext } from '@/contexts/GameContext';
import { CommonMistake } from '@/types/CommonMistake';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import { router, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useMultiplayerGameContext } from '@/contexts/MultiplayerGameContext';

export default function CommonMistakes() {
  const { newGameWitMostCommonMistakes } = useGameContext()
  const { allMistakes } = useCommonMistakesContext();
  const { leaveGame } = useMultiplayerGameContext();

  const [displayedSentence, setDisplayedSentence] = React.useState<WordSelectionOption[] | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      leaveGame();
    }, [leaveGame])
  );

  const MistakeContainer = ({ mistake }: { mistake: CommonMistake }) => {
    return (
      <Pressable
        onPress={() => setDisplayedSentence(mistake.question.SOURCE)}
        style={({ pressed }) => [
          { opacity: pressed ? 0.7 : 1 }
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, backgroundColor: '#222', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, width: 320 }}>
          <ThemedText style={{ fontSize: 18, marginRight: 8 }}>❌</ThemedText>
          <ThemedText style={{ flex: 1, color: '#fff', fontSize: 16 }}>
            {mistake.question.SOURCE.map((part: { text: string }) => part.text).join(' ')}
            {'\n'}
            <ThemedText style={{ color: '#e74c3c', fontSize: 14 }}>
              Chyby: {mistake.mistakeCount}
            </ThemedText>
            {'  '}
            <ThemedText style={{ color: '#27ae60', fontSize: 14 }}>
              Správně: {mistake.correctCount}
            </ThemedText>
          </ThemedText>
        </View>
      </Pressable>
    )
  }

  return (
    <View style={{ flex: 1, padding: 16, paddingTop: 48, gap: 16, justifyContent: 'center', backgroundColor: '#101223' }}>
      <SentenceDetailModal
        visible={displayedSentence !== null}
        onClose={() => { setDisplayedSentence(null) }}
        sentence={displayedSentence}
      />
      <View style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
        <ThemedText type="title" style={{ marginBottom: 16, marginTop: 16, textAlign: 'center' }}>Nejčastější chyby</ThemedText>
        <ScrollView style={{ height: 10 }}>
          {allMistakes.length === 0 ? (
            <ThemedText style={{ color: '#888' }}>Žádné chyby zatím nejsou zaznamenány.</ThemedText>
          ) : (
            allMistakes.sort((a, b) => b.mistakeCount - a.mistakeCount).slice(0, 12).map((mistake, idx) => (
              <MistakeContainer key={idx} mistake={mistake} />
            ))
          )}
        </ScrollView>
        <PlayfulButton
          title={"Procvičit chyby"}
          onPress={newGameWitMostCommonMistakes}
          disabled={allMistakes.length === 0}
        />
      </View>
    </View>
  );
}

