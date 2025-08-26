import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAPI } from '@/hooks/useAPI';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useRocket } from '@/contexts/RocketContext';
import { galaxies } from '@/components/ArenaHeader';
import { useRouter } from 'expo-router';
import PageWrapper from '@/components/PageWrapper';
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
    questionCount: number;
  };
}

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const { userId, secretKey } = useRocket();
  const api = useAPI({ userId, secretKey });
  const router = useRouter();
  
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
      setError('Nepodařilo se načíst historii her. Zkuste to prosím znovu.');
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
              Hra {item.game.code} 
            </ThemedText>
            <ThemedText style={styles.sessionDate}>{formatDate(item.startedAt)}</ThemedText>
          </View>
          <View style={styles.scoreContainer}>
            <ThemedText style={styles.scoreText}>{item.correctAnswers} / {item.game.questionCount} ({Math.round((item.correctAnswers / item.game.questionCount) * 100)}%)</ThemedText>
            <ThemedText style={styles.scoreLabel}>úspěšnost</ThemedText>
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
              <ThemedText style={styles.detailLabel}>Galaxie:</ThemedText>
              <ThemedText style={styles.detailValue}>{galaxies[item.game.galaxy].name}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Správné odpovědi:</ThemedText>
              <ThemedText style={styles.detailValue}>{item.correctAnswers}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Stav:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {item.completed ? 'Dokončeno' : 'Probíhá'}
              </ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Začátek:</ThemedText>
              <ThemedText style={styles.detailValue}>{formatDate(item.startedAt)}</ThemedText>
            </View>
            {item.endedAt && (<>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Konec:</ThemedText>
                <ThemedText style={styles.detailValue}>{formatDate(item.endedAt)}</ThemedText>
              </View>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Doba trvání:</ThemedText>
                <ThemedText style={styles.detailValue}>{Math.round((new Date(item.endedAt).getTime() - new Date(item.startedAt).getTime()) / 1000)} s</ThemedText>
              </View></>
            )}
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Typy otázek:</ThemedText>
              <ThemedText style={styles.detailValue}>{item.game.questiontypes}</ThemedText>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <PageWrapper>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4A5BD2" />
        </View>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <View style={styles.centered}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSessions}>
            <ThemedText style={styles.retryText}>Zkusit znovu</ThemedText>
          </TouchableOpacity>
        </View>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
          <View style={{flex: 1}}>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="white" />
              <ThemedText style={{color: 'white', fontSize: 16, marginLeft: 4}}>Zpět</ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={[styles.title, {flex: 2, textAlign: 'center'}]} type="title">Historie her</ThemedText>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <TouchableOpacity onPress={fetchSessions} style={{padding: 6}} accessibilityLabel="Obnovit historii">
              <FontAwesome name="refresh" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        
        {sessions.length === 0 ? (
          <View style={styles.centered}>
            <ThemedText style={styles.emptyText}>Zatím nebyly odehrány žádné hry</ThemedText>
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
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101223',
  },
  container: {
    flex: 1,
    backgroundColor: '#101223',
    padding: 20,
  },
  title: {
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  sessionCard: {
    backgroundColor: '#1c1f3d',
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
