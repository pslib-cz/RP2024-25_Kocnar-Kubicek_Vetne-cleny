import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ViewStyle } from 'react-native';

interface TooltipProps {
  visible: boolean;
  message: string;
  children: React.ReactNode;
  onRequestClose: () => void;
  top?: boolean
}

export const Tooltip: React.FC<TooltipProps> = ({ visible, message, children, onRequestClose, top = true }) => {

  const style: ViewStyle = top ? { bottom: '100%' } : { top: '120%' };

  return (
    <View style={{ position: 'relative', zIndex: 1000 }}>
      {children}
      {visible && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onRequestClose}
        >
          <View style={[styles.tooltipContainer, style]} pointerEvents="box-none">
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
    left: '50%',
    transform: [{ translateX: "-50%" }],
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