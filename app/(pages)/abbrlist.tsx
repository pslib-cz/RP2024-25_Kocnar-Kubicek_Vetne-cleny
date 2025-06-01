import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import WordButton from '@/components/ui/games/WordButton';
import { WordTypes } from '@/constants/WordTypes';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import AndroidSafeArea from '@/components/AndroidSafeArea';
// Local type for WordTypeExt
interface WordTypeExt {
  name: string;
  abbr: string;
  color: string;
}

export default function AbbrListPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, AndroidSafeArea.AndroidSafeArea]}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Zpět"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Zpět</Text>
        </TouchableOpacity>
        <ThemedText style={styles.heading} type="title">Seznam zkratek</ThemedText>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {WordTypes.map((wt: WordTypeExt) => (
          <View key={wt.abbr} style={styles.row}>
            <WordButton text={wt.abbr} type={wt.abbr} drawType />
            <Text style={styles.name}>{wt.name}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101223',
  },
  container: {
    flex: 1,
    backgroundColor: '#101223',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
    gap: 16,
  },
  heading: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 12,
  },
  name: {
    color: '#FFF',
    fontSize: 18,
    flex: 1,
    marginLeft: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  backText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
});
