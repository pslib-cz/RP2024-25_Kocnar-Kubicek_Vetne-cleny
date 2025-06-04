import React from 'react';
import { SvgXml } from 'react-native-svg';
import { useRocket } from '@/contexts/RocketContext';
import { useState, useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface RocketProps {
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export const Rocket = ({ style, width = 100, height = 100 }: RocketProps) => {
  const { bodyColor, trailColor, selectedRocketIndex, rocketSvgs } = useRocket();
  const [modifiedRocketSvg, setModifiedRocketSvg] = useState<string | null>(null);

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