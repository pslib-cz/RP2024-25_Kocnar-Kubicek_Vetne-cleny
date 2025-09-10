import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { ThemedText } from '../ThemedText';

interface RocketPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  rocketSvgs: string[];
  selectedRocketIndex: number;
  onRocketSelect: (index: number) => void;
}

export const RocketPickerModal: React.FC<RocketPickerModalProps> = ({
  isVisible,
  onClose,
  rocketSvgs,
  selectedRocketIndex,
  onRocketSelect
}) => {
  const handleRocketSelect = (index: number) => {
    onRocketSelect(index);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.rocketPickerContainer}>
          <ThemedText type="subtitle" style={styles.rocketPickerTitle}>
            Vyberte raketu
          </ThemedText>

          <View style={styles.rocketGrid}>
            {rocketSvgs.map((svg, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.rocketOption,
                  selectedRocketIndex === index && styles.selectedRocketOption
                ]}
                onPress={() => handleRocketSelect(index)}
              >
                <SvgXml xml={svg} width={50} height={50} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rocketPickerContainer: {
    width: '80%',
    backgroundColor: '#1c1f3d',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  rocketPickerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  rocketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  rocketOption: {
    width: 80,
    height: 80,
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#101223',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRocketOption: {
    borderColor: '#4A5BD2',
  },
});
