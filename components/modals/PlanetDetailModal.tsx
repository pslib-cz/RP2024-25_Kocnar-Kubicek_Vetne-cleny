import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Modal } from 'react-native';
import ModalWrapper from './ModalWrapper';
import { useGalaxyContext } from '@/contexts/GalaxyContext';
import Planet from '../Planet';

interface PlanetDetailModal {
  visible: boolean;
  onClose: () => void;
  id?: number;
  closeButtonText?: string;
}

const PlanetDetailModal: React.FC<PlanetDetailModal> = ({
  visible,
  onClose,
  id = 0,
  closeButtonText = "Ok",
}) => {
  const { getSelectedGalaxyPlanetData, activeLevelIndex, selectedGalaxy, planetsInGalaxy } = useGalaxyContext();

  const planetData = getSelectedGalaxyPlanetData(id);

  const missingLevels = id * 4 - activeLevelIndex[selectedGalaxy];

  return (
    <ModalWrapper visible={visible} onClose={onClose} title={planetData.name} closeButtonText={closeButtonText}>
      <Text style={styles.message}>{planetData.planetType}</Text>
      <Planet revIndex={planetsInGalaxy - id - 1} showText={false} height={125} width={125} />
      <Text style={styles.message}>K odemčení této planety ti chybí ještě {missingLevels} {missingLevels == 1 ? "úroveň" : (missingLevels >= 2 && missingLevels <= 4) ? "úrovně" : "úrovní"}</Text>
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

export default PlanetDetailModal;