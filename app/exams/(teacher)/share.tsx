import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRouter } from 'expo-router';
import { useMultiplayerGameContext } from '@/contexts/MultiplayerGameContext';
import { useRocket } from '@/contexts/RocketContext';
import { Ionicons } from '@expo/vector-icons';

export default function ShareGameScreen() {
  const router = useRouter();
  const { code, leaveGame } = useMultiplayerGameContext();
  const rocket = useRocket();
  const shareLink = `vetnecleny://exams/join?code=${code}`;

  const handleCancel = async () => {
    try {
      await leaveGame();
      router.push('/exams/create');
    } catch (error) {
      alert('Nepodařilo se zrušit hru. Zkuste to znovu.');
      console.warn('Error cancelling game:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
        <View style={{flex: 1}}>
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="white" />
            <Text style={{color: 'white', fontSize: 16, marginLeft: 4}}>Zpět</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.title, {flex: 2, textAlign: 'center'}]}>Sdílená hra</Text>
        <View style={{flex: 1}} />
      </View>
      <View style={{borderWidth: 20, borderColor: 'white', borderRadius: 20}}>
        <QRCode value={shareLink} size={250} />
      </View>
      <Text style={styles.codeLabel}>KÓD HRY:</Text>
      <Text style={styles.code}>{code}</Text>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
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
    backgroundColor: '#101223',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  codeLabel: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 20,
  },
  code: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
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