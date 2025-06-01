import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { galaxies } from '@/components/ArenaHeader';

interface AuthoredGame {
  id: string;
  code: number;
  difficulty: number;
  galaxy: number;
  questiontypes: number;
  version: string;
  seed: string | null;
  active: boolean;
  expirationTime: string;
  createdAt: string;
  questionCount: number;
  authorId: string;
  sessions: Array<{
    id: string;
    playerId: string;
    gameId: string;
    score: number;
    correctAnswers: number;
    completed: boolean;
    startedAt: string;
    endedAt: string | null;
    player: {
      id: string;
      name: string;
      bodyColor: string;
      trailColor: string;
      selectedRocketIndex: number;
      clientVersion: string;
      levels: string;
      secretKey: string;
    };
  }>;
}

type RootStackParamList = {
  AuthoredGameDetail: {
    gameParam: AuthoredGame;
  };
};

type AuthoredGameDetailRouteProp = RouteProp<RootStackParamList, 'AuthoredGameDetail'>;

const isGameActive = (expirationTime: string, active: boolean) => {
  const now = new Date();
  const expiration = new Date(expirationTime);
  return now < expiration && active;
};

const formatDuration = (startTime: string, endTime?: string) => {
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
  const navigation = useNavigation();
  const { gameParam } = route.params;
  const game : AuthoredGame = typeof gameParam === "string" ? JSON.parse(gameParam) as AuthoredGame : gameParam;

  console.log('Game Detail:', game);
  console.log('Game Sessions:', game.sessions);

  const active = isGameActive(game.expirationTime, game.active);
  const completedSessions = game.sessions.filter(session => session.completed);
  const activeSessions = game.sessions.filter(session => !session.completed);

  const averageScore = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((sum, session) => sum + session.correctAnswers, 0) / completedSessions.length / game.questionCount * 100)
    : 0;

  const handleShareGame = () => {
    Alert.alert('Sdílet hru', `Kód hry: ${game.code}`);
  };

  const handleDeleteGame = () => {
    Alert.alert(
      'Smazat hru',
      'Opravdu chcete smazat tuto hru? Tato akce je nevratná.',
      [
        { text: 'Zrušit', style: 'cancel' },
        { text: 'Smazat', style: 'destructive', onPress: () => {
          // Handle delete logic here
          navigation.goBack();
        }}
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
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

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareGame}>
            <MaterialIcons name="share" size={20} color="#fff" />
            <Text style={styles.buttonText}>Sdílet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteGame}>
            <MaterialIcons name="delete" size={20} color="#fff" />
            <Text style={styles.buttonText}>Smazat</Text>
          </TouchableOpacity>
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
                        Dokončeno: {new Date(session.endedAt).toLocaleString('cs-CZ', { 
                          dateStyle: 'short', 
                          timeStyle: 'short' 
                        })}
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
          <Text style={styles.techItem}>Seed: {game.seed}</Text>
          <Text style={styles.techItem}>Game ID: {game.id}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1419',
  },
  header: {
    backgroundColor: '#1E2235',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3049',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#42A5F5',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF5350',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#1E2235',
    margin: 16,
    padding: 16,
    borderRadius: 12,
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