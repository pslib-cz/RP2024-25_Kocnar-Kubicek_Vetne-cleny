import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import PlayfulButton from '@/components/ui/PlayfulButton';
import Constants from 'expo-constants';
import datasetVersion from '@/data/sheets/version.json';
import { useLoadedData } from '@/hooks/useData';
import AndroidSafeArea from '@/components/AndroidSafeArea';
export default function AboutPage() {
  const router = useRouter();
  const { loadedVersion, loadedSets } = useLoadedData();
  // Get app version from expo-constants (avoid direct access to EmbeddedManifest.version)
  const appVersion =
    (Constants.expoConfig && typeof Constants.expoConfig === 'object' && 'version' in Constants.expoConfig && (Constants.expoConfig as any).version) ||
    (Constants.manifest2 && typeof Constants.manifest2 === 'object' && 'version' in Constants.manifest2 && (Constants.manifest2 as any).version) ||
    'neuvedeno';
  // Get dataset version from imported JSON
  const dsVersion = loadedVersion || datasetVersion.version || 'neuvedeno';

  return (
    <SafeAreaView style={[styles.safeArea, AndroidSafeArea.AndroidSafeArea]}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.heading}>O aplikaci</ThemedText>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.infoBlock}>
          <ThemedText type="title" style={styles.title}>Větná dráha</ThemedText>
          <ThemedText style={styles.label}>Autoři aplikace:</ThemedText>
          <ThemedText style={styles.value}>Tomáš Viktor Kubíček & Jan Kočnar</ThemedText>
          <ThemedText style={styles.label}>Autor datových sad:</ThemedText>
          <ThemedText style={styles.value}>Romana Wágnerová</ThemedText>
          <ThemedText style={styles.label}>Verze aplikace:</ThemedText>
          <ThemedText style={styles.value}>{appVersion}</ThemedText>
          <ThemedText style={styles.label}>Verze datové sady:</ThemedText>
          <ThemedText style={styles.value}>{dsVersion} ({loadedSets.flat().length} vět)</ThemedText>
        </View>
        <View style={styles.buttonBlock}>
          <PlayfulButton
            title="Seznam zkratek"
            icon={<MaterialIcons name="list" size={22} color="white" />}
            onPress={() => router.push('/(pages)/abbrlist')}
            style={styles.button}
          />
          <PlayfulButton
            title="Znovu spustit úvod"
            icon={<MaterialIcons name="rocket-launch" size={22} color="white" />}
            onPress={() => router.push('/(pages)/onboarding')}
            style={styles.button}
          />
          <PlayfulButton
            title="DEVELOPER MENU"
            onPress={() => router.push('/(pages)/(debug)/gameTests')}
            style={styles.button}
            variant="gray"
          />
        </View>
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
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
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
  infoBlock: {
    width: '100%',
    backgroundColor: '#181a2f',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  label: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 8,
  },
  value: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 4,
    marginLeft: 8,
  },
  buttonBlock: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: 220,
    marginVertical: 4,
  },
});
