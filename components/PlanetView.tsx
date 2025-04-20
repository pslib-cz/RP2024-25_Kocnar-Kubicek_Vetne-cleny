import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

// Import your data
import planetNames from '@/data/planetnames.json';

// Import context
import { useGalaxyContext } from '@/contexts/GalaxyContext';

// Define the props type for the GalaxyView component


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

// Seeded random generator
const seededRandom = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const generateHexagonPoints = (centerX: number, centerY: number, hexagonSize: number, hexagonRadius: number) => {
  return [
    `${centerX},${centerY - hexagonSize}`,
    `${centerX + hexagonRadius},${centerY - hexagonSize / 2}`,
    `${centerX + hexagonRadius},${centerY + hexagonSize / 2}`,
    `${centerX},${centerY + hexagonSize}`,
    `${centerX - hexagonRadius},${centerY + hexagonSize / 2}`,
    `${centerX - hexagonRadius},${centerY - hexagonSize / 2}`,
  ].join(' ');
};

const generateRandomHexagons = (count: number, width: number, height: number, seed: number) => {
  const random = seededRandom(seed);
  const hexagons: string[] = [];
  const radius = width / 2; // Assuming the planet is a circle with width as diameter
  const centerX = width / 2;
  const centerY = height / 2;
  const hexagonSize = 20; // Size of the hexagon
  const hexagonRadius = hexagonSize * Math.sqrt(3) / 2; // Approximate radius of the hexagon

  // Add the first hexagon at the bottom
  hexagons.push(generateHexagonPoints(centerX, height, hexagonSize, hexagonRadius));

  while (hexagons.length < count - 1) {
    const x = random() * width;
    const y = random() * height;

    // Check if the hexagon center is within the circle
    const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    if (distanceFromCenter + hexagonRadius > radius) continue;

    // Check for overlap with existing hexagons
    const overlaps = hexagons.some((points) => {
      const [existingX, existingY] = points.split(',')[0].split(' ').map(Number);
      const distance = Math.sqrt((x - existingX) ** 2 + (y - existingY) ** 2);
      return distance < 2 * hexagonRadius; // Ensure no overlap
    });

    if (overlaps) continue;

    hexagons.push(generateHexagonPoints(x, y, hexagonSize, hexagonRadius));
  }

  // Add the last hexagon at the top
  hexagons.push(generateHexagonPoints(centerX, 0, hexagonSize, hexagonRadius));

  return hexagons;
};

const PlanetView: React.FC = () => {
  // Get activeLevelIndex from context
  const { activeLevelIndex, selectedGalaxy, activePlanets } = useGalaxyContext();

  const seed = selectedGalaxy * 100 + activePlanets[selectedGalaxy] + 13; // Generate a unique seed for each planet
  const hexagons = generateRandomHexagons(5, 250, 250, seed); // Ensure hexagons are within the circle

  return (
    <View style={styles.planetContentContainer}>
      <Image
        source={getPlanetImage(selectedGalaxy, activePlanets[selectedGalaxy])}
        style={[
          styles.planetImage,
          {
            width: 250,
            height: 250,
          },
        ]}
      />
      <Svg style={styles.hexagonOverlay} width={250} height={250}>
        {hexagons.map((points, index) => {
          let fillColor;
          if (index < activeLevelIndex[selectedGalaxy]) {
            fillColor = '#00ff00'; // Brighter green for finished
          } else if (index === activeLevelIndex[selectedGalaxy]) {
            fillColor = '#ffff80'; // Brighter yellow for active
          } else {
            fillColor = '#b0b0b0'; // Brighter gray for unreached
          }

          const borderColor = index < activeLevelIndex[selectedGalaxy]
            ? '#008000' // Darker green
            : index === activeLevelIndex[selectedGalaxy]
            ? '#cccc00' // Darker yellow
            : '#808080'; // Darker gray

          return (
            <Polygon
              key={index}
              points={points}
              fill={fillColor}
              stroke={borderColor}
              strokeWidth={2} // Add border width
            />
          );
        })}
      </Svg>
      <Text
        style={[
          styles.planetName,
          styles.activePlanetName,
        ]}
      >
        {planetNames[selectedGalaxy][activePlanets[selectedGalaxy]]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({

  planetsContainer: {
    padding: 20,
  },
  planetContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Added to center the planet vertically
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
  hexagonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default PlanetView;
