import React, { useId } from 'react';
import { View, StyleSheet } from 'react-native';
import { PlayerRocket } from './PlayerRocket';
import { PlayerData } from '@/types/api';

interface OrbitingPlayersProps {
  players: PlayerData[];
  planetSize: number;
  containerWidth?: number;
  code: number;
}

export const OrbitingPlayers: React.FC<OrbitingPlayersProps> = ({ 
  players, 
  planetSize = 125, 
  containerWidth,
  code
}) => {
  const containerHeight = planetSize + 25;
  const effectiveWidth = containerWidth || 300; // Default width if not provided

  // Seeded random number generator for consistent positioning
  const seededRandom = (seed: number) => {
    let value = seed % 2147483647;
    if (value <= 0) value += 2147483646;
    return () => {
      value = (value * 16807) % 2147483647;
      return (value - 1) / 2147483646;
    };
  };

  // Generate random positions in rectangular container
  const generatePlayerPositions = () => {
    const rocketSize = 30; // Width/height of rocket
    const minDistance = rocketSize * 1.2; // Minimum distance between rockets
    const maxAttempts = 10; // Only try 10 times as requested
    const positions: { x: number; y: number; angle: number }[] = [];
    
    for (let index = 0; index < players.length; index++) {
      const random = seededRandom(planetSize + index * 1000 + code * 716); // Use planetSize and index as seed
      console.log("seededRandom called with seed:", planetSize + index * 1000 + code * 716);
      console.log("random called with seed:", random());
      console.log("random called with seed:", random());

      let attempts = 0;
      let x = 0, y = 0;
      let validPosition = false;
      
      while (attempts < maxAttempts && !validPosition) {
        attempts++;
        
        // Generate random position within the container bounds
        x = random() * (effectiveWidth - rocketSize);
        y = random() * (containerHeight - rocketSize);
        
        // Check for collisions with already placed rockets
        validPosition = true;
        for (const placed of positions) {
          const distance = Math.sqrt((x - placed.x) ** 2 + (y - placed.y) ** 2);
          if (distance < minDistance) {
            validPosition = false;
            break;
          }
        }
      }
      
      // Only add position if we found a valid one (skip if we couldn't place it)
      if (validPosition) {
        positions.push({ 
          x, 
          y, 
          angle: random() * 360 // Random rotation angle
        });
      }
    }
    
    return positions;
  };

  const playerPositions = generatePlayerPositions();

  return (
    <View style={[styles.container, { width: effectiveWidth, height: containerHeight }]}>
      {playerPositions.map((position, index) => {
        const player = players[index];
        return (
          <View
            key={useId()}
            style={[
              styles.rocketContainer,
              {
                left: position.x,
                top: position.y,
                transform: [{ rotate: `${position.angle}deg` }]
              }
            ]}
          >
            <PlayerRocket
              player={player}
              width={30}
              height={30}
              showText={true}
              containerStyle={{
                backgroundColor: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              textStyle={{
                fontSize: 8,
                transform: [{ rotate: `-${position.angle}deg` }]
              }}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  rocketContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
