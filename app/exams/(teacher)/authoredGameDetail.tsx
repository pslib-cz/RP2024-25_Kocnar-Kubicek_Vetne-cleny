import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/ThemedText';
import { AuthoredGame, useAPI } from '@/hooks/useAPI';
import { useRocket } from '@/contexts/RocketContext';
import { galaxies } from '@/components/ArenaHeader';

type RootStackParamList = {
  AuthoredGameDetail: {
    gameId: string;
  };
};

type AuthoredGameDetailRouteProp = RouteProp<RootStackParamList, 'AuthoredGameDetail'>;

const isGameActive = (expirationTime: string, active: boolean) => {
  const now = new Date();
  const expiration = new Date(expirationTime);
  return now < expiration && active;
};

const formatDuration = (startTime: string, endTime?: string | null) => {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const duration = Math.floor((end.getTime() - start.getTime()) / 1000 / 60); // minutes
  
  if (duration < 60) {
    return `${duration} min`;
  }
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours}h ${minutes}min`;
};

const AuthoredGameDetail = () => {
  const route = useRoute<AuthoredGameDetailRouteProp>();
  const router = useRouter();
  const { userId, secretKey } = useRocket();
  const api = useAPI({ userId, secretKey });
  const { gameId } = route.params;
  
  const [game, setGame] = useState<AuthoredGame | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGame = async () => {
    setLoading(true);
    try {
      const games = await api.getAuthoredGames();

      console.log('Fetched games:', games.length);
      console.log('Looking for game with ID:', gameId);

      const currentGame = games.find(g => g.id === gameId);
      setGame(currentGame || null);
    } catch (error) {
      console.warn('Failed to fetch game details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </SafeAreaView>
    );
  }

  if (!game) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 16, marginLeft: 4 }}>Zpět</Text>
            </TouchableOpacity>
          </View>
          <ThemedText type="title" style={[styles.title, { flex: 2, textAlign: 'center' }]}>Hra nenalezena</ThemedText>
          <View style={{ flex: 1 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Hra s tímto ID nebyla nalezena</Text>
        </View>
      </SafeAreaView>
    );
  }

  const active = isGameActive(game.expirationTime, game.active);
  const completedSessions = game.sessions.filter(session => session.completed);
  const activeSessions = game.sessions.filter(session => !session.completed);

  const averageScore = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((sum, session) => sum + session.correctAnswers, 0) / completedSessions.length / game.questionCount * 100)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 16, marginLeft: 4 }}>Zpět</Text>
          </TouchableOpacity>
        </View>
        <ThemedText type="title" style={[styles.title, { flex: 2, textAlign: 'center' }]}>Detail hry</ThemedText>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <MaterialIcons.Button
            name="refresh"
            backgroundColor="transparent"
            underlayColor="transparent"
            color="#fff"
            size={24}
            onPress={fetchGame}
            accessibilityLabel="Obnovit detail hry"
            style={{ padding: 0 }}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Game Status Header */}
        <View style={styles.statusHeader}>
          <View>
            <Text style={styles.gameCode}>Kód: {game.code}</Text>
            <Text style={styles.gameId}>ID: {game.id}</Text>
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

        {/* Game Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detaily hry</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <MaterialIcons name="speed" size={20} color="#F9A825" />
              <Text style={styles.detailLabel}>Obtížnost</Text>
              <Text style={styles.detailValue}>{game.difficulty}%</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="public" size={20} color="#42A5F5" />
              <Text style={styles.detailLabel}>Galaxie</Text>
              <Text style={styles.detailValue}>{galaxies[game.galaxy]?.name || 'Neznámá'}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="numbers" size={20} color="#AB47BC" />
              <Text style={styles.detailLabel}>Otázky</Text>
              <Text style={styles.detailValue}>{game.questionCount}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="category" size={20} color="#66BB6A" />
              <Text style={styles.detailLabel}>Typy otázek</Text>
              <Text style={styles.detailValue}>{game.questiontypes}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="casino" size={20} color="#26A69A" />
              <Text style={styles.detailLabel}>Seed</Text>
              <Text style={styles.detailValue}>{game.seed ? 'Ano' : 'Ne'}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="code" size={20} color="#FF7043" />
              <Text style={styles.detailLabel}>Verze</Text>
              <Text style={styles.detailValue}>{game.version}</Text>
            </View>
          </View>
        </View>

        {/* Time Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Časové informace</Text>
          <View style={styles.timeInfo}>
            <View style={styles.timeItem}>
              <MaterialIcons name="event" size={18} color="#4CAF50" />
              <Text style={styles.timeLabel}>Vytvořeno:</Text>
              <Text style={styles.timeValue}>
                {new Date(game.createdAt).toLocaleString('cs-CZ')}
              </Text>
            </View>
            <View style={styles.timeItem}>
              <MaterialIcons name="hourglass-empty" size={18} color="#FF7043" />
              <Text style={styles.timeLabel}>Vyprší:</Text>
              <Text style={styles.timeValue}>
                {game.expirationTime 
                  ? new Date(game.expirationTime).toLocaleString('cs-CZ')
                  : 'Bez expirace'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiky</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{game.sessions.length}</Text>
              <Text style={styles.statLabel}>Celkem hráčů</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedSessions.length}</Text>
              <Text style={styles.statLabel}>Dokončeno</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{activeSessions.length}</Text>
              <Text style={styles.statLabel}>Aktivních</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{averageScore}%</Text>
              <Text style={styles.statLabel}>Průměrné skóre</Text>
            </View>
          </View>
        </View>

        {/* Players Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hráči ({game.sessions.length})</Text>
          
          {activeSessions.length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Aktivní hráči ({activeSessions.length})</Text>
              {activeSessions.map((session) => (
                <View key={session.id} style={styles.playerCard}>
                  <View style={styles.playerHeader}>
                    <View style={styles.playerInfo}>
                      <View
                        style={[
                          styles.playerColor,
                          { backgroundColor: session.player.bodyColor }
                        ]}
                      />
                      <View>
                        <Text style={styles.playerName}>{session.player.name}</Text>
                        <Text style={styles.playerMeta}>
                          Začal: {new Date(session.startedAt).toLocaleString('cs-CZ', { 
                            dateStyle: 'short', 
                            timeStyle: 'short' 
                          })}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.playingBadge}>
                      <Text style={styles.playingText}>Hraje</Text>
                    </View>
                  </View>
                  <Text style={styles.playDuration}>
                    Doba hry: {formatDuration(session.startedAt)}
                  </Text>
                </View>
              ))}
            </>
          )}
          
          {completedSessions.length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Dokončené hry ({completedSessions.length})</Text>
              {completedSessions
                .sort((a, b) => b.correctAnswers - a.correctAnswers)
                .map((session, index) => (
                <View key={session.id} style={styles.playerCard}>
                  <View style={styles.playerHeader}>
                    <View style={styles.playerInfo}>
                      <View
                        style={[
                          styles.playerColor,
                          { backgroundColor: session.player.bodyColor }
                        ]}
                      />
                      <View>
                        <Text style={styles.playerName}>
                          {index < 3 && ['🥇', '🥈', '🥉'][index]} {session.player.name}
                        </Text>
                        <Text style={styles.playerMeta}>
                          Dokončeno: {session.endedAt ? new Date(session.endedAt).toLocaleString('cs-CZ', { 
                            dateStyle: 'short', 
                            timeStyle: 'short' 
                          }) : 'Neznámo'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.scoreInfo}>
                      <Text style={styles.score}>
                        {session.correctAnswers}/{game.questionCount}
                      </Text>
                      <Text style={styles.percentage}>
                        {Math.round((session.correctAnswers / game.questionCount) * 100)}%
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.playDuration}>
                    Doba hry: {formatDuration(session.startedAt, session.endedAt)}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Technical Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technické detaily</Text>
          <View style={styles.techDetails}>
            <Text style={styles.techItem}>Seed: {game.seed || 'Není nastaven'}</Text>
            <Text style={styles.techItem}>Game ID: {game.id}</Text>
            <Text style={styles.techItem}>Author ID: {game.authorId}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    padding: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#1E2235',
    padding: 16,
    borderRadius: 8,
  },
  gameCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameId: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeStatus: {
    backgroundColor: '#1b4332',
  },
  inactiveStatus: {
    backgroundColor: '#35363a',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    backgroundColor: '#1E2235',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#42A5F5',
    marginTop: 16,
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#2A3049',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 2,
    textAlign: 'center',
  },
  timeInfo: {
    gap: 12,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  timeValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#42A5F5',
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  playerCard: {
    backgroundColor: '#2A3049',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  playerMeta: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  playingBadge: {
    backgroundColor: '#F9A825',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  playingText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
  },
  scoreInfo: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  percentage: {
    fontSize: 12,
    color: '#42A5F5',
  },
  playDuration: {
    fontSize: 12,
    color: '#aaa',
  },
  techDetails: {
    gap: 8,
  },
  techItem: {
    fontSize: 12,
    color: '#aaa',
    fontFamily: 'monospace',
  },
});

export default AuthoredGameDetail;