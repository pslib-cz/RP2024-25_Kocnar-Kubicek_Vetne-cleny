import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import { COSMIC_BACKGROUND_STARS, COSMIC_BACKGROUND_STRUCTURES } from '@/utils/cosmicBackground';

const CosmicBackground: React.FC = () => (
  <View pointerEvents="none" style={styles.container}>
    {COSMIC_BACKGROUND_STARS.map((star, index) => (
      <View
        key={`star-${index}`}
        style={[
          styles.star,
          {
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            borderRadius: star.size / 2,
            opacity: star.opacity,
          },
        ]}
      />
    ))}
    <Svg pointerEvents="none" style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      {COSMIC_BACKGROUND_STRUCTURES.map((structure, index) => (
        <React.Fragment key={`structure-${index}`}>
          <Polyline
            points={structure.points.map(({ x, y }) => `${x},${y}`).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={0.22}
            opacity={structure.opacity}
          />
          {structure.points.map((point, pointIndex) => (
            <Circle
              key={`structure-${index}-point-${pointIndex}`}
              cx={point.x}
              cy={point.y}
              r={0.42}
              fill="#FFFFFF"
              opacity={Math.min(structure.opacity + 0.08, 0.22)}
            />
          ))}
        </React.Fragment>
      ))}
      <Line x1="6" y1="82" x2="16" y2="79" stroke="rgba(255,255,255,0.8)" strokeWidth={0.18} opacity={0.12} />
      <Line x1="86" y1="35" x2="96" y2="31" stroke="rgba(255,255,255,0.8)" strokeWidth={0.18} opacity={0.1} />
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
});

export default CosmicBackground;
