import React, { useState } from 'react';
import { Image } from 'expo-image';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useGalaxyContext } from '@/context/GalaxyContext';

// Import PlanetView component
import { NamedRocket } from '@/components/NamedRocket';
import { ThemedText } from '@/components/ThemedText';
import { Galaxy } from '@/types/Galaxy';

// Galaxy names and planet counts
const galaxies : Galaxy[] = [
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

const ArenaHeader: React.FC = () => {
  const { selectedGalaxy, setSelectedGalaxy } = useGalaxyContext();
  const [showSelectModal, setShowSelectModal] = useState(false);

  const handleGalaxyChange = (galaxyIndex: number) => {
    setSelectedGalaxy(galaxyIndex);
    setShowSelectModal(false);
  };

  return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            
            <TouchableOpacity style={{maxWidth: "50%", overflow: "hidden"}} onPress={() => router.push('/profile')}>
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
                  onPress={() => handleGalaxyChange(index)}
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
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default ArenaHeader;