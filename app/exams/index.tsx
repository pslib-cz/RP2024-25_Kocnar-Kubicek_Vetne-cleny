import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useRocket } from '@/contexts/RocketContext';

const TestSelection = () => {
  const router = useRouter();
  const { teacherMode, userId, secretKey } = useRocket(); // Using the correct properties from RocketContext

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test (Exam) Options</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Nenačisto"
          onPress={() => router.push('/exams/practice')}
        />
        <Button
          title="Připojit se"
          onPress={() => router.push('/exams/join')}
        />
        {teacherMode && (
          <>
            <Button
              title="Vytvořit Hru"
              onPress={() => router.push('/exams/create')}
            />
            <Button
              title="Moje vytvořené hry"
              onPress={() => router.push('/exams/(teacher)/authored')}
            />
          </>
        )}
        <Button
          title="Historie Her"
          onPress={() => router.push('/exams/history')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  }
});

export default TestSelection;