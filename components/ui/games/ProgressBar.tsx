import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Rocket } from '@/components/Rocket';

interface RocketProgressBarProps {
  progress: number; // Value from 0 to 1
  width?: number;
  height?: number;
}

const RocketProgressBar: React.FC<RocketProgressBarProps> = ({
  progress = 0.33,
  height = 40,
}) => {
  // Constrain progress between 0 and 1
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.container, { height }]}>
      {/* Dark background bar */}
      <View style={[styles.backgroundBar, { height, borderRadius: height / 2 }]}>
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

        <View style={[styles.rocketContainer, { width: `${normalizedProgress * 100}%`, height }]}>
          <View style={styles.rocket} />
          <Rocket style={styles.rocket} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  backgroundBar: {
    backgroundColor: '#111827',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
  },
  rocketContainer: {
    width: '100%',
  },
  rocket: {
    position: 'absolute',
    right: '0%',
    // I don't see the rocket in the browser, so I will finish it later
  },
});

export default RocketProgressBar;