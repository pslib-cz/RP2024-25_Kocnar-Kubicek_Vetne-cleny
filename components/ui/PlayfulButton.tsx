import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRocket } from '@/contexts/RocketContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type PlayfulButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'gray' | 'custom';
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  customColors?: [string, string];
};

export default function PlayfulButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  textStyle,
  disabled = false,
  customColors = ['#4A5BD2', '#8A56E8']
}: PlayfulButtonProps) {
  const rocket = useRocket();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const gradientColors = {
    primary: ['#4A5BD2', '#8A56E8'] as const,
    secondary: ['#9D4EDD', '#C77DFF'] as const,
    danger: ['#E63946', '#FF758F'] as const,
    success: ['#2A9D8F', '#57CC99'] as const,
    gray: ['#555555', '#707070'] as const,
    custom: customColors,
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10 });
    rotation.value = withTiming(5, { duration: 100 });
    //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); fuck this shit
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    rotation.value = withTiming(0, { duration: 300, easing: Easing.elastic(1.5) });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ]
    };
  });

  return (
    <Animated.View style={[styles.buttonContainer, animatedStyle, style]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={styles.touchable}
      >
        <LinearGradient
          colors={gradientColors[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            disabled && styles.disabled
          ]}
        >
          <View style={styles.content}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </View>
          <View style={styles.bubbles}>
            <View style={[styles.bubble, styles.bubble1]} />
            <View style={[styles.bubble, styles.bubble2]} />
            <View style={[styles.bubble, styles.bubble3]} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    height: 60,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    marginVertical: 8,
  },
  touchable: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 2,
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  iconContainer: {
    marginRight: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  bubbles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
  },
  bubble1: {
    width: 20,
    height: 20,
    top: '20%',
    left: '10%',
  },
  bubble2: {
    width: 30,
    height: 30,
    bottom: '10%',
    right: '15%',
  },
  bubble3: {
    width: 15,
    height: 15,
    top: '40%',
    right: '25%',
  },
}); 