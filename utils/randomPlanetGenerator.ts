import { getPlanetImage } from '@/data/planetImages';
import planetNames from '@/data/planetnames.json';
import { Image as RNImage } from 'react-native';

// Seeded random number generator
const seededRandom = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

export interface RandomPlanet {
  galaxyIndex: number;
  planetIndex: number;
  imageSource: any;
  name: string;
  displaySize: number;
  seed: number;
}

export const generateRandomPlanet = (seed: number): RandomPlanet => {
  const random = seededRandom(seed);
  
  // Generate random galaxy (0-4)
  const galaxyIndex = Math.floor(random() * 5);
  
  // Generate random planet within that galaxy
  const planetNamesForGalaxy = planetNames[galaxyIndex];
  const planetIndex = Math.floor(random() * planetNamesForGalaxy.length);
  
  // Get planet image and properties
  const imageSource = getPlanetImage(galaxyIndex, planetIndex);
  const { width, height } = RNImage.resolveAssetSource(imageSource);
  
  // Determine planet type and display size
  const getPlanetType = (width: number, height: number, planetIndex: number): string => {
    if (width === 1500 && height === 1500) {
      return 'ring';
    } else if (width === 1000 && height === 1000) {
      if (planetIndex % 10 === 9) {
        return 'sun';
      } else {
        return 'hole';
      }
    } else if (width === 500 && height === 500) {
      return 'normal';
    }
    return 'normal';
  };

  const getPlanetDisplaySize = (type: string) => {
    switch (type) {
      case 'ring': return 200;
      case 'sun': return 250;
      case 'hole': return 180;
      default: return 150;
    }
  };

  const planetType = getPlanetType(width, height, planetIndex);
  const displaySize = getPlanetDisplaySize(planetType);
  
  return {
    galaxyIndex,
    planetIndex,
    imageSource,
    name: planetNamesForGalaxy[planetIndex],
    displaySize,
    seed: seed
  };
};
