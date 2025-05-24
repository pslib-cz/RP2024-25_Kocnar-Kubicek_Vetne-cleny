import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import { useLocalSearchParams } from 'expo-router';

// Accepts param: sentence (as JSON stringified WordSelectionOption[])
export default function SentenceDisplayPage() {
  const params = useLocalSearchParams();
  let sentence: WordSelectionOption[] | null = null;

  console.log('SentenceDisplayPage params:', params);

  if (typeof params.sentence === 'string') {
    try {
      const arr = JSON.parse(params.sentence);
      console.log('Parsed sentence:', arr);
      if (Array.isArray(arr) && arr.every(w => typeof w.text === 'string')) {
        sentence = arr;
      }
    } catch {
      sentence = null;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.sentenceContainer}>
        {sentence ? (
          <Text style={styles.sentenceText}>
            {sentence.map((w, i) => w.text + (i < sentence.length - 1 ? ' ' : ''))}
          </Text>
        ) : (
          <Text style={styles.label}>No valid sentence provided.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  sentenceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sentenceText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
