import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

// Import your data
import planetNames from '@/data/planetnames.json';

// Define the props type for the PlanetView component
type PlanetViewProps = {
  route: {
    params: {
      galaxyIndex: number;
    };
  };
};

// Pre-load all planet images
const planetImages: Record<string, any> = {
    // Galaxy 1 (25 planets)
    '1_1': require('@/assets/images/uni/1/celestial1.png'),
    '1_2': require('@/assets/images/uni/1/celestial2.png'),
    '1_3': require('@/assets/images/uni/1/celestial3.png'),
    '1_4': require('@/assets/images/uni/1/celestial4.png'),
    '1_5': require('@/assets/images/uni/1/celestial5.png'),
    '1_6': require('@/assets/images/uni/1/celestial6.png'),
    '1_7': require('@/assets/images/uni/1/celestial7.png'),
    '1_8': require('@/assets/images/uni/1/celestial8.png'),
    '1_9': require('@/assets/images/uni/1/celestial9.png'),
    '1_10': require('@/assets/images/uni/1/celestial10.png'),
    '1_11': require('@/assets/images/uni/1/celestial11.png'),
    '1_12': require('@/assets/images/uni/1/celestial12.png'),
    '1_13': require('@/assets/images/uni/1/celestial13.png'),
    '1_14': require('@/assets/images/uni/1/celestial14.png'),
    '1_15': require('@/assets/images/uni/1/celestial15.png'),
    '1_16': require('@/assets/images/uni/1/celestial16.png'),
    '1_17': require('@/assets/images/uni/1/celestial17.png'),
    '1_18': require('@/assets/images/uni/1/celestial18.png'),
    '1_19': require('@/assets/images/uni/1/celestial19.png'),
    '1_20': require('@/assets/images/uni/1/celestial20.png'),
    '1_21': require('@/assets/images/uni/1/celestial21.png'),
    '1_22': require('@/assets/images/uni/1/celestial22.png'),
    '1_23': require('@/assets/images/uni/1/celestial23.png'),
    '1_24': require('@/assets/images/uni/1/celestial24.png'),
    '1_25': require('@/assets/images/uni/1/celestial25.png'),

    // Galaxy 2 (8 planets)
    '2_1': require('@/assets/images/uni/2/celestial1.png'),
    '2_2': require('@/assets/images/uni/2/celestial2.png'),
    '2_3': require('@/assets/images/uni/2/celestial3.png'),
    '2_4': require('@/assets/images/uni/2/celestial4.png'),
    '2_5': require('@/assets/images/uni/2/celestial5.png'),
    '2_6': require('@/assets/images/uni/2/celestial6.png'),
    '2_7': require('@/assets/images/uni/2/celestial7.png'),
    '2_8': require('@/assets/images/uni/2/celestial8.png'),

    // Galaxy 3 (8 planets)
    '3_1': require('@/assets/images/uni/3/celestial1.png'),
    '3_2': require('@/assets/images/uni/3/celestial2.png'),
    '3_3': require('@/assets/images/uni/3/celestial3.png'),
    '3_4': require('@/assets/images/uni/3/celestial4.png'),
    '3_5': require('@/assets/images/uni/3/celestial5.png'),
    '3_6': require('@/assets/images/uni/3/celestial6.png'),
    '3_7': require('@/assets/images/uni/3/celestial7.png'),
    '3_8': require('@/assets/images/uni/3/celestial8.png'),

    // Galaxy 4 (8 planets)
    '4_1': require('@/assets/images/uni/4/celestial1.png'),
    '4_2': require('@/assets/images/uni/4/celestial2.png'),
    '4_3': require('@/assets/images/uni/4/celestial3.png'),
    '4_4': require('@/assets/images/uni/4/celestial4.png'),
    '4_5': require('@/assets/images/uni/4/celestial5.png'),
    '4_6': require('@/assets/images/uni/4/celestial6.png'),
    '4_7': require('@/assets/images/uni/4/celestial7.png'),
    '4_8': require('@/assets/images/uni/4/celestial8.png'),

    // Galaxy 5 (8 planets)
    '5_1': require('@/assets/images/uni/5/celestial1.png'),
    '5_2': require('@/assets/images/uni/5/celestial2.png'),
    '5_3': require('@/assets/images/uni/5/celestial3.png'),
    '5_4': require('@/assets/images/uni/5/celestial4.png'),
    '5_5': require('@/assets/images/uni/5/celestial5.png'),
    '5_6': require('@/assets/images/uni/5/celestial6.png'),
    '5_7': require('@/assets/images/uni/5/celestial7.png'),
    '5_8': require('@/assets/images/uni/5/celestial8.png'),
};

// Utility function to get planet image
const getPlanetImage = (galaxyIndex: number, planetIndex: number) => {
  const key = `${galaxyIndex + 1}_${planetIndex + 1}`;
  // Return default image if specific one not found
  return planetImages[key] || planetImages['1_1'];
};

const PlanetView: React.FC<PlanetViewProps> = ({ route }) => {
  const { galaxyIndex } = route.params;
  const planetsInGalaxy = galaxyIndex === 0 ? 25 : 8;
  console.log(planetsInGalaxy, galaxyIndex)
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.planetScroll}>
        <View style={styles.timelineContainer}>
          {/* Display vertical timeline with numbers */}
          {Array.from({ length: planetsInGalaxy }).map((_, index) => (
            <View key={`timeline-${index}`} style={styles.timelineItem}>
              <Text style={styles.timelineNumber}>{ planetsInGalaxy - index }</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.planetsContainer}>
          {/* Display planets */}
          {Array.from({ length: planetsInGalaxy }).map((_, revIndex) => {
            const index = planetsInGalaxy - revIndex - 1; // Reverse index for display
            const planetName = planetNames[galaxyIndex][index] || `Planet ${index + 1}`;
            
            return (
              <View key={`planet-${index}`} style={styles.planetItem}>
                <Text style={styles.planetName}>{galaxyIndex}</Text>
                <Image
                  source={getPlanetImage(galaxyIndex, index)}
                  style={[styles.planetImage, { width: 120 + (index % 4) * 20, height: 120 + (index % 4) * 20 }]}
                />
                <Text style={styles.planetName}>{planetName}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      
      {/* Bottom progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.progressLabel}>MIERCOLES 32</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  planetScroll: {
    flex: 1,
  },
  timelineContainer: {
    position: 'absolute',
    left: 10,
    top: 0,
    bottom: 0,
    width: 30,
    justifyContent: 'space-around',
  },
  timelineItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  timelineNumber: {
    color: '#aaaaaa',
    fontSize: 14,
  },
  planetsContainer: {
    paddingLeft: 40,
    paddingRight: 20,
    paddingVertical: 20,
  },
  planetItem: {
    alignItems: 'center',
    marginVertical: 30,
    position: 'relative',
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
});

export default PlanetView;
