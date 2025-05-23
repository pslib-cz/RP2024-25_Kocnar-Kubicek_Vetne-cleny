import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Svg, { Polygon, Polyline } from 'react-native-svg';
import { Image as RNImage } from 'react-native';
import planetNames from '@/data/planetnames.json';
import { useGalaxyContext } from '@/contexts/GalaxyContext';
import { planetImages } from '@/data/planetImages';

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

const HEXAGON_COUNT = 5;
const PLANET_SIZE = 250;
const HEXAGON_SIZE = 36; // slightly larger for clarity
const HEXAGON_RADIUS = HEXAGON_SIZE * Math.sqrt(3) / 2;

// Generate random, non-overlapping hexagon centers within the planet
const getRandomHexagonCenters = (
  count: number,
  width: number,
  height: number,
  seed: number
) => {
  const random = seededRandom(seed);
  const radius = width / 2;
  const centerX = width / 2;
  const centerY = height / 2;
  const minDist = HEXAGON_SIZE * 1.2;
  const maxDistFromCenter = radius - HEXAGON_SIZE * 0.7;
  const centers: { x: number; y: number }[] = [];

  let attempts = 0;
  while (centers.length < count && attempts < 200) {
    attempts++;
    // Random angle and distance from center
    const angle = random() * 2 * Math.PI;
    const dist = (random() * 0.7 + 0.15) * maxDistFromCenter; // keep away from edge and center
    const x = centerX + Math.cos(angle) * dist;
    const y = centerY + Math.sin(angle) * dist;

    // Check if inside the planet
    const fromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    if (fromCenter + HEXAGON_SIZE / 2 > radius) continue;

    // Check for overlap
    if (
      centers.some(
        (c) => Math.sqrt((x - c.x) ** 2 + (y - c.y) ** 2) < minDist
      )
    )
      continue;

    centers.push({ x, y });
  }

  // If not enough, fallback to vertical path for remaining
  while (centers.length < count) {
    const y = HEXAGON_SIZE / 2 +
      (height - HEXAGON_SIZE) * (centers.length / (count - 1));
    centers.push({ x: centerX, y });
  }

  return centers;
};

const generateHexagonPoints = (centerX: number, centerY: number, size: number) => {
  const r = size * Math.sqrt(3) / 2;
  return [
    `${centerX},${centerY - size}`,
    `${centerX + r},${centerY - size / 2}`,
    `${centerX + r},${centerY + size / 2}`,
    `${centerX},${centerY + size}`,
    `${centerX - r},${centerY + size / 2}`,
    `${centerX - r},${centerY - size / 2}`,
  ].join(' ');
};

// Remove getPlanetType, use image dimensions instead
const getPlanetDisplaySize = (type: string) => {
  switch (type) {
    case 'ring': return 380;
    case 'sun': return 500;
    case 'hole': return 340;
    default: return 260;
  }
};

function getPlanetType(width: number, height: number, planetIndex : number): string {
  if (width === 1500 && height === 1500) {
      return 'ring';
    } else if (width === 1000 && height === 1000) {
        if (planetIndex%10 === 9) {
          return 'sun';
    } else {
      return 'hole';
    }
  } else if (width === 500 && height === 500) {
    return 'normal';
  }

  return 'normal';
} 
  
const PlanetView: React.FC<{displayName? : boolean}> = ({displayName = true}) => {
  const { activeLevelIndex, selectedGalaxy, activePlanets } = useGalaxyContext();

  // Use a unique seed for each planet
  const seed = selectedGalaxy * 100 + activePlanets[selectedGalaxy] + 13;
  
  const planetIndex = activePlanets[selectedGalaxy];
  const imageSource = getPlanetImage(selectedGalaxy, planetIndex);
  const { width, height } = RNImage.resolveAssetSource(imageSource);
  
  // Determine planet type from image size
  let planetType = getPlanetType(width, height, planetIndex);

  const displaySize = getPlanetDisplaySize(planetType);
  
  // Defensive: check planetNames[selectedGalaxy]
  const hexagonCenters = getRandomHexagonCenters(HEXAGON_COUNT, displaySize, displaySize, seed);
  
  const planetList = planetNames[selectedGalaxy];
  if (!planetList) {
    return (
      <View style={styles.planetContentContainer}>
        <Text style={{ color: 'red', fontSize: 18 }}>Data for this galaxy is missing.</Text>
      </View>
    );
  }

  return (
    <View style={styles.planetContentContainer}>
      <Image
        source={imageSource}
        style={[
          styles.planetImage,
          {
            width: displaySize,
            height: displaySize,
          },
        ]}
        resizeMode="contain"
      />
      <Svg style={styles.hexagonOverlay} width={displaySize} height={displaySize}>
        {/* Draw the path connecting the hexagons */}
        <Polyline
          points={hexagonCenters.map(({ x, y }) => `${x},${y}`).join(' ')}
          fill="none"
          stroke="#fff8"
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {hexagonCenters.map(({ x, y }, index) => {
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
            <React.Fragment key={index}>
              {/* Simulate glow for the active hexagon by drawing a larger, semi-transparent hexagon underneath */}
              {index === activeLevelIndex[selectedGalaxy] && (
                <Polygon
                  points={generateHexagonPoints(x, y, HEXAGON_SIZE * 0.7)}
                  fill={'#ffff80aa'} // semi-transparent yellow
                  stroke={'#cccc00aa'}
                  strokeWidth={6}
                />
              )}
              <Polygon
                points={generateHexagonPoints(x, y, HEXAGON_SIZE / 2)}
                fill={fillColor}
                stroke={borderColor}
                strokeWidth={3}
              />
            </React.Fragment>
          );
        })}
      </Svg>
      {
        displayName &&
        <Text
          style={[
            styles.planetName,
            styles.activePlanetName,
          ]}
        >
          {planetList[planetIndex]}
        </Text>
      }
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
    marginTop: 40, // 
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