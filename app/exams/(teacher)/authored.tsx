import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthoredGame, useAPI } from '@/hooks/useAPI';
import { useEffect, useState } from 'react';
import { useRocket } from '@/contexts/RocketContext';
import { galaxies } from '@/components/ArenaHeader';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { AuthoredGameCard } from '@/components/AuthoredGameCard';

export default function AuthoredGamesPage() {
  const { userId, secretKey } = useRocket();
  const api = useAPI({ userId, secretKey });
  const [games, setGames] = useState<AuthoredGame[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Move fetchGames outside useEffect so it can be reused
  const fetchGames = async () => {
    setLoading(true);
    try {
      const data = await api.getAuthoredGames();
      setGames(data);
    } catch (error) {
      console.warn('Failed to fetch authored games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 16, marginLeft: 4 }}>Zpět</Text>
            </TouchableOpacity>
          </View>
          <ThemedText type="title" style={[styles.title, { flex: 2, textAlign: 'center' }]}>Moje vytvořené hry</ThemedText>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <MaterialIcons.Button
              name="refresh"
              backgroundColor="transparent"
              underlayColor="transparent"
              color="#fff"
              size={24}
              onPress={fetchGames}
              accessibilityLabel="Obnovit seznam her"
              style={{ padding: 0 }}
            />
          </View>
        </View>
        {games.length === 0 ? (
          <Text style={styles.emptyMessage}>Zatím jste nevytvořili žádné hry</Text>
        ) : (
          games.map((game) => <AuthoredGameCard key={game.id} game={game} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101223',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
  }
});
