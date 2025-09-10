import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { ThemedText } from '../ThemedText';

interface ColorPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  subtitle: string;
  currentColor: string;
  onColorChangeComplete: (color: string) => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isVisible,
  onClose,
  subtitle,
  currentColor,
  onColorChangeComplete
}) => {
  const [pickerColor, setPickerColor] = useState<string>(currentColor);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.colorPickerContainer}>
          <ThemedText type="subtitle" style={styles.colorPickerTitle}>
            {subtitle}
          </ThemedText>

          <View style={styles.colorPickerWrapper}>
            <ColorPicker
              color={pickerColor}
              onColorChangeComplete={setPickerColor}
              thumbSize={30}
              sliderSize={20}
              noSnap={true}
              row={false}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <ThemedText type="defaultSemiBold" style={styles.colorpickerButtonText}>
                Zrušit
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                onColorChangeComplete(pickerColor);
                onClose();
              }}
            >
              <ThemedText type="defaultSemiBold" style={styles.colorpickerButtonText}>
                Potvrdit
              </ThemedText>
            </TouchableOpacity>
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
  colorPickerContainer: {
    width: '80%',
    backgroundColor: '#1c1f3d',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  colorPickerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  colorPickerWrapper: {
    width: '100%',
    height: 300,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#4A5BD2',
    padding: 12,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4A5BD2',
    padding: 12,
    borderRadius: 6,
    marginLeft: 8,
    alignItems: 'center',
  },
  colorpickerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
