import React, { useState, useEffect } from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleProp, ViewStyle, View, Text, StyleSheet, TextStyle } from 'react-native';
import { PlayerData } from '@/types/api';
import { useRocket } from '@/contexts/RocketContext';

interface PlayerRocketProps {
  player: PlayerData;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  showId?: boolean;
}

export const PlayerRocket = ({
  player,
  style,
  width = 50,
  height = 50,
  textStyle,
  containerStyle,
  showId = false
}: PlayerRocketProps) => {
  const [modifiedRocketSvg, setModifiedRocketSvg] = useState<string | null>(null);
  const { rocketSvgs } = useRocket();

  useEffect(() => {
    if (rocketSvgs.length > 0 && player.selectedRocketIndex < rocketSvgs.length) {
      const svg = rocketSvgs[player.selectedRocketIndex];
      const modifiedSvg = svg
        .replaceAll('_body_', player.bodyColor)
        .replaceAll('_trail_', player.trailColor);
      setModifiedRocketSvg(modifiedSvg);
    }
  }, [rocketSvgs, player]);

  if (!modifiedRocketSvg) return null;

  return (
    <View style={[styles.container, containerStyle]}>
      <SvgXml xml={modifiedRocketSvg} width={width} height={height} style={[{ transform: [{ rotate: "45deg" }] }, style]} />
      <View style={styles.playerInfo}>
        <Text style={[styles.playerName, textStyle]}>{player.name}</Text>
        {showId && <Text style={styles.playerId}>{player.id.substring(0, 8)}...</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playerInfo: {
    marginLeft: 12,
    flexDirection: 'column',
  },
  playerName: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Outfit',
    fontWeight: 'bold',
  },
  playerId: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'Outfit',
  }
}); 