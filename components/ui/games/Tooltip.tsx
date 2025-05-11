import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';

interface TooltipProps {
  visible: boolean;
  message: string;
  children: React.ReactNode;
  onRequestClose: () => void;
}

export const Tooltip: React.FC<TooltipProps> = ({ visible, message, children, onRequestClose }) => {
  return (
    <View style={{ position: 'relative' }}>
      {children}
      {visible && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onRequestClose}
        >
          <View style={styles.tooltipContainer} pointerEvents="box-none">
            <Text style={styles.tooltipText}>{message}</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: [{ translateX: -Dimensions.get('window').width * 0.2 }],
    minWidth: 120,
    maxWidth: 220,
    backgroundColor: 'rgba(30,30,30,0.95)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    zIndex: 1000,
    alignItems: 'center',
  },
  tooltipText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
}); 