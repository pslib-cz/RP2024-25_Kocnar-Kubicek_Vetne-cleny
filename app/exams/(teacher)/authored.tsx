import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useAPI } from '@/hooks/useAPI';
import { useEffect, useState } from 'react';
import { useRocket } from '@/contexts/RocketContext';

export default function AuthoredGamesPage() {
  const { userId, secretKey } = useRocket();
  const api = useAPI({ userId, secretKey });
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to check if a game is still active based on expiration time
  const isGameActive = (expirationTime: string) => {
    const now = new Date();
    const expiration = new Date(expirationTime);
    return now < expiration;
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await api.getAuthoredGames();
        setGames(data);
      } catch (error) {
        console.error('Failed to fetch authored games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Moje vytvořené hry</Text>
      
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
                <Text style={styles.detail}>Obtížnost: {game.difficulty}</Text>
                <Text style={styles.detail}>Galaxie: {game.galaxy}</Text>
                <Text style={styles.detail}>Typy otázek: {game.questiontypes}</Text>
              </View>

              {game.expirationTime && (
                <Text style={styles.expirationTime}>
                  Platné do: {new Date(game.expirationTime).toLocaleString()}
                </Text>
              )}

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
                      {session.completed ? `Skóre: ${session.score}` : 'Ve hře'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
