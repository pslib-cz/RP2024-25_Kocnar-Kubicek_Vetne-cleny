import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Rocket } from '@/components/Rocket';

interface RocketProgressBarProps {
  progress: number; // Value from 0 to 1
  width?: number;
  height?: number;
}

const RocketProgressBar: React.FC<RocketProgressBarProps> = ({
  progress = 0.33,
  width = 350,
  height = 40,
}) => {
  // Constrain progress between 0 and 1
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  
  // Calculate position for the rocket
  const rocketPosition = Math.max(normalizedProgress * width - 25, 0);
  
  return (
    <View style={[styles.container, { width, height }]}>
      {/* Dark background bar */}
      <View style={[styles.backgroundBar, { width, height, borderRadius: height / 2 }]}>
        {/* Colored progress gradient */}
        <LinearGradient
          colors={['#4c1d95', '#6d28d9', '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
          styles.progressBar,
          {
            width: `${normalizedProgress * 100}%`,
            height,
            borderRadius: height / 2,
          },
          ]}
        />
        
        <View style={{ transform: [{ rotate: '90deg' }, { translateX: -30 }, { translateY: -70 }, { scale: 0.75 }], position: 'absolute', top: 0, left: 0, }}>
          <Rocket />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundBar: {
    backgroundColor: '#111827',
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
  },
  rocketContainer: {
    position: 'absolute',
    top: 0,
    height: '100%',
    justifyContent: 'center',
    zIndex: 10,
  },
});

export default RocketProgressBar;