import React, { useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Rocket } from './Rocket';
import { useGalaxyContext } from '@/contexts/GalaxyContext';
import { useRouter } from 'expo-router';
import planetNames from '@/data/planetnames.json';
import { planetImages } from '@/data/planetImages';

// Utility function to get planet image
const getPlanetImage = (galaxyIndex: number, planetIndex: number) => {
  const key = `${galaxyIndex + 1}_${planetIndex + 1}`;
  // Return default image if specific one not found
  return planetImages[key] || planetImages['1_1'];
};

const GalaxyView: React.FC = () => {
  const { selectedGalaxy, activePlanets } = useGalaxyContext();
  const router = useRouter(); // Initialize router
  const activePlanetIndex = activePlanets[selectedGalaxy];
  const planetsInGalaxy = selectedGalaxy === 0 ? 25 : 8;

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (activePlanetIndex !== undefined && scrollViewRef.current) {
      setTimeout(() => {
        const estimatedPosition = (planetsInGalaxy - activePlanetIndex - 1) * 230;
        scrollViewRef.current?.scrollTo({ y: estimatedPosition, animated: false });
      }, 50);
    }
  }, [activePlanetIndex, planetsInGalaxy]);

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.planetScroll}
        showsVerticalScrollIndicator={false}// Redirect on touch
      >
        {/* Vertical timeline using SVG */}
        <View style={styles.timelineContainer}>
          <Svg height={10000} width={40} >
            <Line
              x1={20}
              y1={0}
              x2={20}
              y2={10000}
              stroke="#555"
              strokeWidth={1.5}
              strokeDasharray="20"
            />
          </Svg>
        </View>

        <View style={styles.planetsContainer}>
          {/* Display planets */}
          {Array.from({ length: planetsInGalaxy }).map((_, revIndex) => {
            const index = planetsInGalaxy - revIndex - 1; // Reverse index for display
            const planetName = planetNames[selectedGalaxy][index] || `Planet ${index + 1}`;
            const isActive = index === activePlanetIndex;
            
            return (
              <View 
                key={`planet-${index}`} 
                style={styles.planetItem}
              >
                {/* Timeline index number positioned next to the planet */}
                <View style={styles.timelineIndexContainer}>
                  <Text style={[styles.timelineNumber, isActive && {color: "#eee"}]}>{planetsInGalaxy - revIndex}</Text>
                  {isActive && (
                    <Rocket width={50} height={50} style={styles.rocketIcon} />
                  )}
                </View>
                
                <View style={styles.planetContentContainer}>
                  <Image
                    source={getPlanetImage(selectedGalaxy, index)}
                    style={[
                      styles.planetImage, 
                      { 
                        width: index === planetsInGalaxy-1 ? 250 : ((120 + (index * 31547  % 4) * 20) * (isActive ? 1.5 : 1)), 
                        height:  index === planetsInGalaxy-1 ? 250 : ((120 + (index * 31547  % 4) * 20) * (isActive ? 1.5 : 1)), 
                      }
                    ]}
                  />
                  <Text style={[
                    styles.planetName,
                    isActive && styles.activePlanetName
                  ]}>{planetName}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

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

export default GalaxyView;
