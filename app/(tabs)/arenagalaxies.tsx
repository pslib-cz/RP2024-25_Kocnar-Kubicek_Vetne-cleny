import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import GalaxyView from '@/components/GalaxyView';
import ArenaHeader from '@/components/ArenaHeader';
import { useRouter } from 'expo-router';

const ArenaGalaxies: React.FC = () => {
  const router = useRouter(); // Initialize navigation

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <ArenaHeader
          onBackPress={() => router.replace("/arenaplanet")} // Pass back button handler
        />
        {/* Galaxy View */}
        <GalaxyView />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    color: '#ffffff',
  },
  galaxySelectorContainer: {
    position: 'absolute',
    top: 66,
    right: 0,
    zIndex: 1,
    backgroundColor: '#000',
    borderWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderColor: '#333',
  },
  galaxySelector: {
    flexDirection: 'column',
    padding: 8,
    paddingTop: 0,
  },
  galaxyButton: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row-reverse',
    marginHorizontal: 10,
  },
  galaxyButtonSelected: {
    display: "none",
    borderBottomWidth: 2,
    borderBottomColor: '#6200ee',
  },
  galaxyIcon: {
    width: 64,
    height: 40,
    marginBottom: 5,
  },
  galaxyButtonText: {
    fontSize: 12,
    color: '#aaaaaa',
  },
  galaxyButtonTextSelected: {
    color: '#ffffff',
  },
  planetsContainer: {
    padding: 20,
  },
  planetItem: {
    alignItems: 'center',
    marginVertical: 20,
  },
  planetName: {
    color: '#ffffff',
    marginTop: 8,
    fontSize: 14,
  },
});

export default ArenaGalaxies;