import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Rocket } from './Rocket';
import { useGalaxyContext } from '@/contexts/GalaxyContext';
import planetNames from '@/data/planetnames.json';
import { getPlanetImage } from '@/data/planetImages';
import { router } from 'expo-router';

const Planet: React.FC<{ revIndex: number, showText?: boolean, onOpen?: (id: number) => void, width?: number, height?: number}> = ({ revIndex, showText = true, onOpen, width, height }) => {
  const { selectedGalaxy, planetsInGalaxy, activePlanetIndex } = useGalaxyContext();

  const index = planetsInGalaxy - revIndex - 1; // Reverse index for display
  const planetName = planetNames[selectedGalaxy][index] || `Planet ${index + 1}`;
  const isActive = index === activePlanetIndex;

  return (
    <TouchableOpacity
      style={styles.planetItem}
      disabled={onOpen === undefined}
      onPress={() => {
        if (!isActive) {
          onOpen?.(index);
        }
        else{
          router.back()
        }
      }}>
      {/* Timeline index number positioned next to the planet */}
      {
        showText &&
        <View style={styles.timelineIndexContainer}>
          <Text style={[styles.timelineNumber, isActive && { color: "#eee" }]}>{planetsInGalaxy - revIndex}</Text>
          {isActive && (
            <Rocket width={50} height={50} style={styles.rocketIcon} />
          )}
        </View>
      }

      <View style={styles.planetContentContainer}>
        <Image
          source={getPlanetImage(selectedGalaxy, index)}
          style={[
            styles.planetImage,
            {
              width: width ? width : index === planetsInGalaxy - 1 ? 250 : ((120 + (index * 31547 % 4) * 20) * (isActive ? 1.5 : 1)),
              height: height ? height : index === planetsInGalaxy - 1 ? 250 : ((120 + (index * 31547 % 4) * 20) * (isActive ? 1.5 : 1)),
            }
          ]}
        />
        {
          showText &&        
          <Text style={[
            styles.planetName,
            isActive && styles.activePlanetName
          ]}>{planetName}</Text>
        }
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  planetScroll: {
    flex: 1,
  },
  timelineContainer: {
    position: 'absolute',
    top: -1000,
    left: 0,
    bottom: 0,
    zIndex: 1,
  },
  timelineIndexContainer: {
    position: 'absolute',
    left: -40,
    width: 40,
    height: "100%",
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  timelineNumber: {
    color: '#888',
    fontSize: 14,
  },
  planetsContainer: {
    paddingLeft: 70, // Increased to make room for timeline numbers
    paddingRight: 20,
    paddingVertical: 20,
  },
  planetItem: {
    flexDirection: 'row',
    marginVertical: 30,
    position: 'relative',
  },
  planetContentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  planetImage: {
    borderRadius: 50,
  },
  planetRing: {
    position: 'absolute',
    height: 10,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffff00',
    borderRadius: 30,
    transform: [{ rotate: '20deg' }],
  },
  planetName: {
    color: '#ffffff',
    marginTop: 8,
    fontSize: 14,
  },
  activePlanetName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    padding: 16,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    width: '40%',
    height: '100%',
    backgroundColor: '#6200ee',
  },
  progressLabel: {
    color: '#ffffff',
    marginTop: 8,
    fontSize: 14,
  },
  rocketContainer: {
    position: 'absolute',
    left: 0,
    zIndex: 2,
  },
  rocketIcon: {
    marginTop: 5,
    transform: [{ rotate: '30deg' }, { translateX: 35 }, { translateY: -20 }],
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default Planet;