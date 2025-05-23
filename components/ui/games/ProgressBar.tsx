import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
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
  const animatedProgress = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: normalizedProgress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [normalizedProgress]);
  
  const progressWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['5%', '100%'],
  });

  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.backgroundBar, { height, borderRadius: height / 2 }]}>
        <Animated.View style={[
          styles.progressBar,
          {
            width: progressWidth,
            height,
            borderRadius: height / 2,
          }
        ]}>
          <LinearGradient
            colors={['#4c1d95', '#6d28d9', '#7c3aed']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: '100%', height: '100%', borderRadius: height / 2 }}
          />
        </Animated.View>

        <Animated.View style={{ 
          width: progressWidth, 
          height, 
          position: 'absolute',
          left: 0,
        }}>
          <Rocket style={styles.rocket} />
        </Animated.View>
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
    position: 'relative',
    width: '100%',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    overflow: 'hidden',
  },
  rocket: {
    position: 'absolute',
    right: -65,
    top: '-75%',
    transform: [{ rotate: '90deg' }, {scale: 0.7}],
  },
});

export default RocketProgressBar;