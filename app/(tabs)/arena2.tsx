import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// Import PlanetView component
import PlanetView from '@/app/components/PlanetView';

// Galaxy names and planet counts
const galaxies = [
  { name: "Všechny členy", planetCount: 25 },
  { name: "Hlavní členy", planetCount: 8 },
  { name: "Přívlastky", planetCount: 8 },
  { name: "Přísl. určení", planetCount: 8 },
  { name: "Doplňky", planetCount: 8 },
];

// Pre-load all galaxy images
const galaxyImages = {
  1: require('@/assets/images/uni/g/1.png'),
  2: require('@/assets/images/uni/g/2.png'),
  3: require('@/assets/images/uni/g/3.png'),
  4: require('@/assets/images/uni/g/4.png'),
  5: require('@/assets/images/uni/g/5.png'),
};

const Arena2: React.FC = () => {
  const [selectedGalaxy, setSelectedGalaxy] = useState(0); // Default to the first galaxy

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Michal Rychtář</Text>
      </View>

      {/* Galaxy Selector */}
      <ScrollView horizontal style={styles.galaxySelector} showsHorizontalScrollIndicator={false}>
        {galaxies.map((galaxy, index) => (
          <TouchableOpacity
            key={`galaxy-${index}`}
            style={[
              styles.galaxyButton,
              selectedGalaxy === index && styles.galaxyButtonSelected,
            ]}
            onPress={() => setSelectedGalaxy(index)}
          >
            <Image source={galaxyImages[index + 1]} style={styles.galaxyIcon} />
            <Text
              style={[
                styles.galaxyButtonText,
                selectedGalaxy === index && styles.galaxyButtonTextSelected,
              ]}
            >
              {galaxy.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Planet List */}
      <ScrollView contentContainerStyle={styles.planetsContainer}>
        {Array.from({ length: galaxies[selectedGalaxy].planetCount }).map((_, planetIndex) => (
          <View key={`planet-${planetIndex}`} style={styles.planetItem}>
            <PlanetView galaxyIndex={selectedGalaxy} planetIndex={planetIndex} />
            <Text style={styles.planetName}>Planet {planetIndex + 1}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#171717',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  galaxySelector: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: '#171717',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  galaxyButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  galaxyButtonSelected: {
    borderBottomWidth: 2,
    borderBottomColor: '#6200ee',
  },
  galaxyIcon: {
    width: 40,
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