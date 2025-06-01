import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useRocket } from '@/contexts/RocketContext';
import PlayfulButton from '@/components/ui/PlayfulButton';
import AndroidSafeArea from '@/components/AndroidSafeArea';
const TestSelection = () => {
  const router = useRouter();
  const { teacherMode } = useRocket();

  return (
    <SafeAreaView style={[AndroidSafeArea.AndroidSafeArea, styles.background]}>
      <View style={styles.card}>
        <Text style={styles.title}>Testy</Text>
        <View style={styles.buttonContainer}>
          <PlayfulButton
            title="Nanečisto"
            onPress={() => router.push('/exams/practice')}
            variant="primary"
          />
          <PlayfulButton
            title="Připojit se"
            onPress={() => router.push('/exams/join')}
            variant="secondary"
          />
          {teacherMode && (
            <>
              <PlayfulButton
                title="Vytvořit Hru"
                onPress={() => router.push('/exams/create')}
                variant="success"
              />
              <PlayfulButton
                title="Moje vytvořené hry"
                onPress={() => router.push('/exams/(teacher)/authored')}
                variant="secondary"
              />
            </>
          )}
          <PlayfulButton
            title="Historie Her"
            onPress={() => router.push('/exams/history')}
            variant="danger"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#101223',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#181A2A',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 24,
    elevation: 8,
    minWidth: 320,
    maxWidth: 380,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 28,
    color: '#F3F4FA',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});

export default TestSelection;