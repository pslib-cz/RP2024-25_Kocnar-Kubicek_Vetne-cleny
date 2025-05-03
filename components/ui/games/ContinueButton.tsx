import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ContinueButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onClick}>
      <Text style={styles.buttonText}>POTVRDIT</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1E1E5F', // Dark blue color from the image
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Full width
    maxWidth: 300, // Maximum width
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default ContinueButton;