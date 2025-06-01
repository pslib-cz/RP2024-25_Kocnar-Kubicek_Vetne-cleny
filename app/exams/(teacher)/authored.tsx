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

export default function AuthoredGamesPage() {
  const { userId, secretKey } = useRocket();
  const api = useAPI({ userId, secretKey });
  const [games, setGames] = useState<AuthoredGame[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to check if a game is still active based on expiration time
  const isGameActive = (expirationTime: string) => {
    const now = new Date();
    const expiration = new Date(expirationTime);
    return now < expiration;
  };

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
      <ScrollView>
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
          games.map((game) => {
            // Calculate if the game is active based on expiration time
            const active = isGameActive(game.expirationTime) && game.active;

            return (
              <View key={game.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.gameCode}>Kód: {game.code}</Text>
                    <Text style={styles.gameDate}>
                      Vytvořeno: {new Date(game.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    active ? styles.activeStatus : styles.inactiveStatus
                  ]}>
                    <Text style={styles.statusText}>
                      {active ? 'Aktivní' : 'Ukončeno'}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.detail}>
                    <MaterialIcons name="speed" size={18} color="#F9A825" style={{ marginRight: 4 }} />
                    <Text>{game.difficulty}% obtížnost</Text>
                  </View>
                  <View style={styles.detail}>
                    <MaterialIcons name="public" size={18} color="#42A5F5" style={{ marginRight: 4 }} />
                    <Text>{galaxies[game.galaxy].name}</Text>
                  </View>
                  <View style={styles.detail}>
                    <MaterialIcons name="numbers" size={18} color="#AB47BC" style={{ marginRight: 4 }} />
                    <Text>{game.questionCount} otázek</Text>
                  </View>
                  <View style={styles.detail}>
                    <MaterialIcons name="casino" size={18} color="#26A69A" style={{ marginRight: 4 }} />
                    <Text>{game.seeded ? 'Stejné otázky' : 'Různé otázky'}</Text>
                  </View>
                  <View style={styles.detail}>
                    <MaterialIcons name="hourglass-empty" size={18} color="#FF7043" style={{ marginRight: 4 }} />
                    <Text>{game.expirationTime ? 'Do ' + new Date(game.expirationTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Bez expirace'}</Text>
                  </View>
                </View>

                <View style={styles.sessionsContainer}>
                  <Text style={styles.sessionsTitle}>Hráči ({game.sessions.length}):</Text>
                  {game.sessions.map((session: any) => (
                    <View key={session.id} style={styles.sessionRow}>
                      <View style={styles.playerInfo}>
                        <View
                          style={[
                            styles.playerColor,
                            { backgroundColor: session.player.bodyColor }
                          ]}
                        />
                        <Text>{session.player.name}</Text>
                      </View>
                      <Text style={styles.sessionScore}>
                        {session.completed ? `Skóre: ${session.correctAnswers} / ${game.questionCount} (${Math.round((session.correctAnswers / game.questionCount) * 100)}%)` : 'Ve hře'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  gameCode: {
    fontSize: 18,
    fontWeight: '600',
  },
  gameDate: {
    fontSize: 14,
    color: '#888',
  },
  expirationTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeStatus: {
    backgroundColor: '#e6f7ee',
  },
  inactiveStatus: {
    backgroundColor: '#eee',
  },
  statusText: {
    fontSize: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  detail: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sessionsContainer: {
    marginTop: 8,
  },
  sessionsTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  sessionScore: {
    fontSize: 14,
  },
});
