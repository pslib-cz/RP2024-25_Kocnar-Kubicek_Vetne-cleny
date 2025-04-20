import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useRocket } from '@/contexts/RocketContext';

const TestSelection = () => {
  const router = useRouter();
  const { teacherMode } = useRocket(); // Assuming you have a way to get the teacher mode from your context

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test (Exam) Options</Text>
      <Button
        title="Nenačisto"
        onPress={() => router.push('/exams/practice')}
      />
      <Button
        title="Připojit se"
        onPress={() => router.push('/exams/join')}
      />
      <Button
        title="Vytvořit Hru"
        onPress={() => router.push('/exams/create')}
        disabled={!teacherMode}
      />
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
});

export default TestSelection;