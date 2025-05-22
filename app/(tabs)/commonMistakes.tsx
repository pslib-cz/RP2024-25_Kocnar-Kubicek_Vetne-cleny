import { ThemedText } from '@/components/ThemedText';
import BigassButton from '@/components/ui/BigassButton';
import { useCommonMistakesContext } from '@/contexts/CommonMistakesContext';
import { useGameContext } from '@/contexts/GameContext';
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function CommonMistakes()
{
  const { newGameWithCount_CommonMistakes } = useGameContext()
  const { allMistakes } = useCommonMistakesContext();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16, alignItems: 'center' }}>

      <BigassButton title='⛷️ Procvičování' bgEmoji='⛷️' onPress={newGameWithCount_CommonMistakes}/>

      <View style={{ backgroundColor: '#222', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, width: 320 }}>
        <ThemedText type="title" style={{ marginBottom: 8 }}>Nejčastější chyby</ThemedText>
        {allMistakes.length === 0 ? (
          <ThemedText style={{ color: '#888' }}>Žádné chyby zatím nejsou zaznamenány.</ThemedText>
        ) : (
          allMistakes.map((mistake, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
              <ThemedText style={{ fontSize: 18, marginRight: 8 }}>❌</ThemedText>
              <ThemedText style={{ flex: 1 }}>
                {mistake.sentence.map((part: { text: string }) => part.text).join(' ')}
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
          ))
        )}
      </View>
    </ScrollView>
  );
}

