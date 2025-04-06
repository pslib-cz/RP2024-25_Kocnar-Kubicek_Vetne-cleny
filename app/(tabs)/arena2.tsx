import React, { useState } from 'react';
import { Image } from 'expo-image';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// Import PlanetView component
import GalaxyView from '@/components/GalaxyView';
import { NamedRocket } from '@/components/NamedRocket';
import { ThemedText } from '@/components/ThemedText';

// Galaxy names and planet counts
const galaxies = [
  { name: "Všechny členy", planetCount: 25 },
  { name: "Hlavní členy", planetCount: 8 },
  { name: "Přívlastky", planetCount: 8 },
  { name: "Přísl. určení", planetCount: 8 },
  { name: "Doplňky", planetCount: 8 },
];

// Pre-load all galaxy images
const galaxyImages = [
  require('@/assets/images/uni/g/1.png'),
  require('@/assets/images/uni/g/2.png'),
  require('@/assets/images/uni/g/3.png'),
  require('@/assets/images/uni/g/4.png'),
  require('@/assets/images/uni/g/5.png'),
];

const Arena2: React.FC = () => {
  const [selectedGalaxy, setSelectedGalaxy] = useState(0);
  const [showSelectModal, setShowSelectModal] = useState(false) // Default to the first galaxy

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <NamedRocket/>
            </TouchableOpacity>
          <TouchableOpacity
                style={[
                  styles.galaxyButton
                ]}
                onPress={() => setShowSelectModal(!showSelectModal)}
              >
                <Image source={galaxyImages[selectedGalaxy]} style={styles.galaxyIcon} />
                <ThemedText
                  style={[
                    styles.headerTitle,
                  ]}
                >
                  {galaxies[selectedGalaxy].name}
                </ThemedText>
              </TouchableOpacity>
        </View>

        {/* Galaxy Selector - only show when modal is active */}
        {showSelectModal && (
          <View style={styles.galaxySelectorContainer}>
            <View style={styles.galaxySelector}>
              {galaxies.map((galaxy, index) => (
                <TouchableOpacity
                  key={`galaxy-${index}`}
                  style={[
                    styles.galaxyButton,
                    selectedGalaxy === index && styles.galaxyButtonSelected,
                  ]}
                  onPress={() => {
                    setSelectedGalaxy(index);
                    setShowSelectModal(false);
                  }}
                >
                  <Image source={galaxyImages[index]} style={styles.galaxyIcon} />
                  <ThemedText
                    style={[
                      styles.headerTitle,
                      selectedGalaxy === index && styles.galaxyButtonTextSelected,
                    ]}
                  >
                    {galaxy.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Planet List */}
        <GalaxyView route={{params: {galaxyIndex: selectedGalaxy, activePlanetIndex: 0}}} />
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

export default Arena2;