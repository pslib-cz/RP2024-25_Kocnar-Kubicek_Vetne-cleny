import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
  const router = useRouter();

  const handleAbbreviationsPress = () => {
    onClose(); // Close the hint modal first
    router.push('/(pages)/abbrlist');
  };

  return (
    <ModalWrapper visible={visible} onClose={onClose} title={title} closeButtonText={closeButtonText}>
      {message.map((paragraph, index) => (
        <Text key={index} style={[styles.message, index > 0 && styles.messageSpacing]}>
          {paragraph}
        </Text>
      ))}
      
      {/* Abbreviations button */}
      <TouchableOpacity style={styles.abbreviationsButton} onPress={handleAbbreviationsPress}>
        <Ionicons name="list" size={20} color="white" />
        <Text style={styles.abbreviationsButtonText}>Seznam zkratek</Text>
      </TouchableOpacity>
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
  },
  abbreviationsButton: {
    backgroundColor: '#189dc5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 100,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  abbreviationsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HintModal;