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
      <View style={[styles.backgroundBar, { height, borderRadius: height / 2 }]}>
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

        <View style={[{ width: `${normalizedProgress * 100}%`, height, minWidth: "20%" }]}>
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
  },
  backgroundBar: {
    backgroundColor: '#111827',
    // overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
  },
  rocket: {
    position: 'absolute',
    right: '-25%',
    top: '-75%',
    // left: '0%',
    transform: [{ rotate: '90deg' }, {scale: 0.7}],
  },
});

export default RocketProgressBar;