import React from 'react';
import { SvgXml } from 'react-native-svg';
import { useRocket } from '@/contexts/RocketContext';
import { useState, useEffect } from 'react';
import { loadSvgAsset } from '@/app/(tabs)/profile';
import { StyleProp, ViewStyle, View, Text, StyleSheet, TextStyle } from 'react-native';

interface RocketProps {
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export const NamedRocket = ({ 
  style, 
  width = 50, 
  height = 50, 
  textStyle, 
  containerStyle 
}: RocketProps) => {
  const { bodyColor, trailColor, selectedRocketIndex, name } = useRocket();
  const [rocketSvgs, setRocketSvgs] = useState<string[]>([]);
  const [modifiedRocketSvg, setModifiedRocketSvg] = useState<string | null>(null);

  // Load rocket SVGs
  useEffect(() => {
    const loadRockets = async () => {
      try {
        const rocket1 = require('../assets/images/rockets/rocket1.svg');
        const rocket2 = require('../assets/images/rockets/rocket2.svg');
        const rocket3 = require('../assets/images/rockets/rocket3.svg');
        const rocket4 = require('../assets/images/rockets/rocket4.svg');
        const rocket5 = require('../assets/images/rockets/rocket5.svg');

        const svg1 = await loadSvgAsset(rocket1);
        const svg2 = await loadSvgAsset(rocket2);
        const svg3 = await loadSvgAsset(rocket3);
        const svg4 = await loadSvgAsset(rocket4);
        const svg5 = await loadSvgAsset(rocket5);

        setRocketSvgs([svg1, svg2, svg3, svg4, svg5].filter(svg => svg !== null));
      } catch (error) {
        console.error('Error loading rocket SVGs:', error);
      }
    };

    loadRockets();
  }, []);

  // Update the rocket SVG with the selected colors
  useEffect(() => {
    if (rocketSvgs.length > 0 && selectedRocketIndex < rocketSvgs.length) {
      const svg = rocketSvgs[selectedRocketIndex];
      const modifiedSvg = svg
        .replaceAll('_body_', bodyColor)
        .replaceAll('_trail_', trailColor);
      setModifiedRocketSvg(modifiedSvg);
    }
  }, [rocketSvgs, bodyColor, trailColor, selectedRocketIndex]);

  if (!modifiedRocketSvg) return null;

return (
    <View style={[styles.container, containerStyle]}>
        <SvgXml xml={modifiedRocketSvg} width={width} height={height} style={[{transform: [{rotate: "45deg"}]}, style]} />
        <Text style={[styles.headerTitle, textStyle]}>{name}</Text>
    </View>
);
  
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Outfit'
  },
});

