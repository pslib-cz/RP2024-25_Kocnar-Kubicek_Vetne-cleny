import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRouter } from 'expo-router';
import { useMultiplayerGameContext } from '@/contexts/MultiplayerGameContext';

export default function ShareGameScreen() {
  const router = useRouter();
  const { code } = useMultiplayerGameContext();

//   const handleCancel = async () => {
//     try {
//       await cancelGame();
//       router.push('/exams/create'); // Redirect back to CreateGame
//     } catch (error) {
//       alert('Failed to cancel the game. Please try again.');
//       console.error('Error cancelling game:', error);
//     }
//   };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sdílej hru</Text>
      <Text style={styles.codeLabel}>Kód hry:</Text>
      <Text style={styles.code}>{code}</Text>
      <QRCode value={code.toString()} size={200} />
      <TouchableOpacity style={styles.cancelButton} /*onPress={handleCancel}*/>
        <Text style={styles.cancelButtonText}>Zrušit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  code: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  cancelButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});