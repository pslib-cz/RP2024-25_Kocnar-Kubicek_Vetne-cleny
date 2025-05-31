import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Modal } from 'react-native';
import ModalWrapper from './ModalWrapper';

interface HintModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string[];
  closeButtonText?: string;
}

const HintModal: React.FC<HintModalProps> = ({
  visible,
  onClose,
  title = "Nápověda",
  message = [],
  closeButtonText = "Chápu",
}) => {
  return (
    <ModalWrapper visible={visible} onClose={onClose} title={title} closeButtonText={closeButtonText}>
      {message.map((paragraph, index) => (
        <Text key={index} style={[styles.message, index > 0 && styles.messageSpacing]}>
          {paragraph}
        </Text>
      ))}
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  messageSpacing: {
    marginTop: 16,
  }
});

export default HintModal;