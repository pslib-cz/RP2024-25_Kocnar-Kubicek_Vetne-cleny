import React from 'react';
import { SvgXml } from 'react-native-svg';
import { useRocket } from '@/contexts/RocketContext';
import { useState, useEffect } from 'react';
import { loadSvgAsset } from '@/app/(pages)/profile';
import { StyleProp, ViewStyle } from 'react-native';
import { rocket1, rocket2, rocket3, rocket4, rocket5 } from '@/data/rocketsImages';

interface RocketProps {
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export const Rocket = ({ style, width = 100, height = 100 }: RocketProps) => {
  const { bodyColor, trailColor, selectedRocketIndex } = useRocket();
  const [rocketSvgs, setRocketSvgs] = useState<string[]>([]);
  const [modifiedRocketSvg, setModifiedRocketSvg] = useState<string | null>(null);

  // Load rocket SVGs
  useEffect(() => {
    const loadRockets = async () => {
      try {
        const svg1 = await loadSvgAsset(rocket1);
        const svg2 = await loadSvgAsset(rocket2);
        const svg3 = await loadSvgAsset(rocket3);
        const svg4 = await loadSvgAsset(rocket4);
        const svg5 = await loadSvgAsset(rocket5);

        setRocketSvgs([svg1, svg2, svg3, svg4, svg5].filter(svg => svg !== null));
      } catch (error) {
        console.warn('Error loading rocket SVGs:', error);
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

  return <SvgXml xml={modifiedRocketSvg} width={width} height={height} style={style} />;
};