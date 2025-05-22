import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAPI } from '@/hooks/useAPI';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useRocket } from '@/contexts/RocketContext';

interface SessionInfo {
  id: string;
  gameId: string;
  score: number;
  correctAnswers: number;
  completed: boolean;
  startedAt: string;
  endedAt: string | null;
  game: {
    id: string;
    code: number;
    difficulty: number;
    galaxy: number;
    questiontypes: number;
    version: string;
  };
}

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const { userId, secretKey } = useRocket();
  
  const api = useAPI({ userId, secretKey });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get<SessionInfo[]>(`/players/${userId}/sessions`);
      setSessions(response);
    } catch (err) {
      console.warn('Failed to fetch sessions:', err);
      setError('Failed to load game history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const toggleExpand = (sessionId: string) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  const getDifficultyLabel = (level: number) => {
    const labels = ['Easy', 'Medium', 'Hard', 'Expert'];
    return labels[level] || `Level ${level}`;
  };

  const getGalaxyLabel = (galaxy: number) => {
    return `Galaxy ${galaxy + 1}`;
  };

  const renderSessionItem = ({ item }: { item: SessionInfo }) => {
    const isExpanded = expandedSession === item.id;
    
    return (
      <View style={styles.sessionCard}>
        <TouchableOpacity 
          style={styles.sessionHeader} 
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.headerInfo}>
            <ThemedText style={styles.sessionTitle}>
              {getGalaxyLabel(item.game.galaxy)} • {getDifficultyLabel(item.game.difficulty)}
            </ThemedText>
            <ThemedText style={styles.sessionDate}>{formatDate(item.startedAt)}</ThemedText>
          </View>
          <View style={styles.scoreContainer}>
            <ThemedText style={styles.scoreText}>{item.score}</ThemedText>
            <ThemedText style={styles.scoreLabel}>points</ThemedText>
          </View>
          <FontAwesome 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={16} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.sessionDetails}>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Game Code:</ThemedText>
              <ThemedText style={styles.detailValue}>{item.game.code}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Correct Answers:</ThemedText>
              <ThemedText style={styles.detailValue}>{item.correctAnswers}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Status:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {item.completed ? 'Completed' : 'In Progress'}
              </ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Started:</ThemedText>
              <ThemedText style={styles.detailValue}>{formatDate(item.startedAt)}</ThemedText>
            </View>
            {item.endedAt && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Ended:</ThemedText>
                <ThemedText style={styles.detailValue}>{formatDate(item.endedAt)}</ThemedText>
              </View>
            )}
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Question Types:</ThemedText>
              <ThemedText style={styles.detailValue}>{item.game.questiontypes}</ThemedText>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4A5BD2" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSessions}>
            <ThemedText style={styles.retryText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ThemedText style={styles.title} type="title">Game History</ThemedText>
        
        {sessions.length === 0 ? (
          <View style={styles.centered}>
            <ThemedText style={styles.emptyText}>No games played yet</ThemedText>
          </View>
        ) : (
          <FlatList
            data={sessions}
            renderItem={renderSessionItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    marginBottom: 20,
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  sessionCard: {
    backgroundColor: '#121212',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#fff',
  },
  sessionDate: {
    fontSize: 14,
    color: '#999',
  },
  scoreContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A5BD2',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999',
  },
  sessionDetails: {
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4A5BD2',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
