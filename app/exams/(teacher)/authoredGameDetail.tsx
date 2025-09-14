import React, { useEffect, useState, useCallback } from 'react';
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
import { PlayerRocket } from '@/components/PlayerRocket';
import { questionGenerator } from '@/utils/QuestionsGenerator/questionGenerator';
import { useLoadedData } from '@/hooks/useData';
import { Question } from '@/types/Question';
import Constants from 'expo-constants';
import PageWrapper from '@/components/PageWrapper';
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

const appVersion =
(Constants.expoConfig && typeof Constants.expoConfig === 'object' && 'version' in Constants.expoConfig && (Constants.expoConfig as any).version) ||
(Constants.manifest2 && typeof Constants.manifest2 === 'object' && 'version' in Constants.manifest2 && (Constants.manifest2 as any).version) ||
'neuvedeno';

export default function AuthoredGameDetail() {
  const route = useRoute<AuthoredGameDetailRouteProp>();
  const router = useRouter();
  const { userId, secretKey } = useRocket();
  const api = useAPI({ userId, secretKey });
  const { loadedSets, loadedTypeSets, loadedVersion } = useLoadedData();
  
  const gameId = route.params?.gameId;
  const [game, setGame] = useState<AuthoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  const getClientVersion = () => `${appVersion}-${loadedVersion || 'v0' }`;

  const toggleSessionExpansion = (sessionId: string) => {
    setExpandedSessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  const parseSessionAnswers = (answersJson?: string) => {
    console.log("=== AUTHORED GAME DETAIL: parseSessionAnswers called ===");
    console.log("Answers JSON:", answersJson);
    console.log("Answers JSON type:", typeof answersJson);
    console.log("Answers JSON length:", answersJson?.length || 0);
    
    if (!answersJson) {
      console.log("AUTHORED GAME DETAIL: No answers JSON provided");
      return [];
    }
    
    try {
      const parsed = JSON.parse(answersJson);
      console.log("AUTHORED GAME DETAIL: Successfully parsed answers:", parsed);
      console.log("AUTHORED GAME DETAIL: Number of answers:", parsed.length);
      return parsed;
    } catch (error) {
      console.error('AUTHORED GAME DETAIL: Failed to parse session answers:', error);
      console.error('AUTHORED GAME DETAIL: Raw answers JSON:', answersJson);
      return [];
    }
  };

  const fetchGame = async () => {
    setLoading(true);
    try {
      console.log('Fetching game with ID:', gameId);
      const currentGame = await api.getAuthoredGame(gameId);
      console.log('Fetched game:', currentGame);
      setGame(currentGame);
    } catch (error) {
      console.warn('Failed to fetch game details:', error);
      setGame(null);
    } finally {
      setLoading(false);
    }
  };

  const generateQuestions = useCallback(async () => {
    if (!game || !game.seed) return;
    
    // Compare game version with current client version
    if (game.version !== getClientVersion()) return;
    
    console.log('Generating questions for game:', game.id);
    console.log('Game seed:', game.seed, 'Type:', typeof game.seed);
    
    setQuestionsLoading(true);
    try {
      // Ensure seed is a number
      const seedNumber = typeof game.seed === 'string' ? parseInt(game.seed, 16) : game.seed;
      
      if (isNaN(seedNumber)) {
        console.error('Invalid seed value:', game.seed);
        setQuestions([]);
        return;
      }
      
      console.log('Using seed number:', seedNumber);
      
      const generatedQuestions = questionGenerator({
        galaxy: game.galaxy,
        difficulty: game.difficulty / 100, // Convert from percentage to 0-1 range
        seed: seedNumber,
        count: game.questionCount,
        questionTypesBitfield: game.questiontypes,
        loadedSets,
        loadedTypeSets
      });
      
      console.log('Generated questions count:', generatedQuestions.length);
      setQuestions(generatedQuestions);
    } catch (error) {
      console.warn('Failed to generate questions:', error);
      setQuestions([]);
    } finally {
      setQuestionsLoading(false);
    }
  }, [game, loadedSets, loadedTypeSets]);

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    if (game && game.seed) {
      // Compare game version with current client version
      const currentClientVersion = getClientVersion();
      console.log('Version comparison:', {
        gameVersion: game.version,
        currentClientVersion,
        matches: game.version === currentClientVersion
      });
      if (game.version === currentClientVersion) {
        generateQuestions();
      }
    }
  }, [game, generateQuestions]);

  if (loading) {
    return (
      <PageWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </PageWrapper>
    );
  }

  if (!game) {
    return (
      <PageWrapper>
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
      </PageWrapper>
    );
  }

  const active = isGameActive(game.expirationTime, game.active);
  const completedSessions = game.sessions.filter(session => session.completed);
  const activeSessions = game.sessions.filter(session => !session.completed);

  const averageScore = completedSessions.length > 0
    ? Math.round(completedSessions.reduce((sum, session) => sum + session.correctAnswers, 0) / completedSessions.length / game.questionCount * 100)
    : 0;

  return (
    <PageWrapper>
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
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Text style={styles.gameCode}>Kód: {game.code}</Text>
            <View style={[
              styles.statusBadge,
              active ? styles.activeStatus : styles.inactiveStatus
            ]}>
              <Text style={styles.statusText}>
                {active ? 'Aktivní' : 'Ukončeno'}
              </Text>
            </View>
          </View>
          <Text style={styles.gameId}>ID: {game.id}</Text>
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
                            styles.playerColor
                          ]}
                        >
                          <PlayerRocket
                            player={session.player}
                            width={32}
                            height={32}
                            showText={false}
                            containerStyle={{
                              backgroundColor: "transparent",
                              borderRadius: 16,
                              padding: 4
                            }}
                          />
                        </View>
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
                .map((session, index) => {
                    console.log(session);
                  const isExpanded = expandedSessions.has(session.id);
                  const answers = parseSessionAnswers(session.answers);
                  
                  return (
                    <View key={session.id} style={styles.playerCard}>
                      <View style={styles.playerHeader}>
                        <View style={styles.playerInfo}>
                          <View
                            style={[
                              styles.playerColor
                            ]}
                          >
                            <PlayerRocket
                              player={session.player}
                              width={32}
                              height={32}
                              showText={false}
                              containerStyle={{
                                backgroundColor: "transparent",
                                borderRadius: 16,
                                padding: 4
                              }}
                            />
                          </View>
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
                      
                      {/* Answers toggle button */}
                      {answers.length > 0 && (
                        <TouchableOpacity 
                          style={styles.answersToggleButton}
                          onPress={() => toggleSessionExpansion(session.id)}
                        >
                          <Text style={styles.answersToggleText}>
                            {isExpanded ? 'Skrýt odpovědi' : 'Zobrazit odpovědi'} ({answers.length})
                          </Text>
                          <Ionicons 
                            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                            size={16} 
                            color="#42A5F5" 
                          />
                        </TouchableOpacity>
                      )}
                      
                      {/* Answers display */}
                      {isExpanded && answers.length > 0 && (
                        <View style={styles.answersContainer}>
                          <Text style={styles.answersTitle}>Odpovědi studenta:</Text>
                          {answers.map((answer: any, answerIndex: number) => (
                            <View key={answerIndex} style={styles.answerItem}>
                              <View style={styles.answerHeader}>
                                <Text style={styles.answerNumber}>Otázka {answerIndex + 1}</Text>
                                <View style={[
                                  styles.answerStatus,
                                  answer.correct ? styles.correctAnswer : styles.incorrectAnswer
                                ]}>
                                  <Text style={styles.answerStatusText}>
                                    {answer.correct ? '✓ Správně' : '✗ Špatně'}
                                  </Text>
                                </View>
                              </View>
                              
                              {/* Display question content */}
                              <View style={styles.questionContent}>
                                {answer.question?.SOURCE?.map((word: any, wordIndex: number) => (
                                  <View key={wordIndex} style={styles.wordItem}>
                                    <Text style={styles.wordText}>{word.text}</Text>
                                    <Text style={styles.wordType}>{word.type}</Text>
                                  </View>
                                ))}
                              </View>
                              
                              {/* Show additional question info */}
                              {answer.question?.WANTED && (
                                <Text style={styles.questionInfo}>
                                  Hledaný typ: <Text style={styles.highlightedText}>{answer.question.WANTED}</Text>
                                </Text>
                              )}
                              {answer.question?.INDEX !== undefined && (
                                <Text style={styles.questionInfo}>
                                  Index slova: <Text style={styles.highlightedText}>{answer.question.INDEX + 1}</Text>
                                </Text>
                              )}
                              
                              {/* Display user selections */}
                              {answer.userSelections && (
                                <View style={styles.userSelectionsContainer}>
                                  <Text style={styles.userSelectionsTitle}>Odpovědi studenta:</Text>
                                  
                                  {/* Game1 selections */}
                                  {answer.userSelections.selectedWords && (
                                    <View style={styles.selectionsList}>
                                      {answer.userSelections.selectedWords.map((selection: any, selectionIndex: number) => (
                                        <View key={selectionIndex} style={styles.selectionItem}>
                                          <Text style={styles.selectionWord}>
                                            "{selection.word}" → {selection.selectedType}
                                          </Text>
                                          <View style={[
                                            styles.selectionStatus,
                                            selection.selectedType === selection.correctType ? styles.correctSelection : styles.incorrectSelection
                                          ]}>
                                            <Text style={styles.selectionStatusText}>
                                              {selection.selectedType === selection.correctType ? '✓' : '✗'}
                                            </Text>
                                          </View>
                                        </View>
                                      ))}
                                    </View>
                                  )}
                                  
                                  {/* Game2 selections */}
                                  {answer.userSelections.selectedOptions && (
                                    <View style={styles.selectionsList}>
                                      <Text style={styles.selectionTarget}>
                                        Hledaný typ: {answer.userSelections.targetType}
                                      </Text>
                                      {answer.userSelections.selectedOptions.map((option: any, optionIndex: number) => (
                                        <View key={optionIndex} style={[
                                          styles.selectionItem,
                                          option.selected ? styles.selectedOption : styles.unselectedOption
                                        ]}>
                                          <Text style={styles.selectionWord}>
                                            "{option.text}" ({option.type})
                                          </Text>
                                          <View style={[
                                            styles.selectionStatus,
                                            option.correct ? styles.correctSelection : styles.incorrectSelection
                                          ]}>
                                            <Text style={styles.selectionStatusText}>
                                              {option.correct ? '✓' : '✗'}
                                            </Text>
                                          </View>
                                        </View>
                                      ))}
                                    </View>
                                  )}
                                </View>
                              )}
                              
                              <Text style={styles.answerTime}>
                                Odpovězeno: {new Date(answer.time).toLocaleString('cs-CZ', {
                                  timeStyle: 'medium'
                                })}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
            </>
          )}
        </View>

        {/* Technical Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technické detaily</Text>
          <View style={styles.techDetails}>
            <Text style={styles.techItem}>Seed: {game.seed || 'Není nastaven'}</Text>
            <Text style={styles.techItem}>Game ID: {game.id}</Text>
            <Text style={styles.techItem}>Verze: {game.version}</Text>
          </View>
        </View>

        {/* Questions Section - Only show if game is seeded and has same version */}
        {game.seed && game.version === getClientVersion() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Otázky hry</Text>
            {questionsLoading ? (
              <View style={styles.questionsLoadingContainer}>
                <ActivityIndicator size="small" color="#42A5F5" />
                <Text style={styles.questionsLoadingText}>Generuji otázky...</Text>
              </View>
            ) : questions.length > 0 ? (
              <View style={styles.questionsContainer}>
                {questions.map((question, index) => (
                  <View key={index} style={styles.questionCard}>
                    <View style={styles.questionHeader}>
                      <Text style={styles.questionNumber}>Otázka {index + 1}</Text>
                      <Text style={styles.questionType}>
                        {question.TEMPLATE[2] === 0 ? 'Označ slova' :
                         question.TEMPLATE[2] === 1 ? 'Označ typy' :
                         question.TEMPLATE[2] === 2 ? 'Označ typ slova' :
                         question.TEMPLATE[2] === 3 ? 'Označ slova (všechny typy)' :
                         question.TEMPLATE[2] === 4 ? 'Výběr více slov' :
                         question.TEMPLATE[2] === 5 ? 'Výběr více slov ve větě' :
                         question.TEMPLATE[2] === 6 ? 'Výběr jednoho slova' :
                         question.TEMPLATE[2] === 7 ? 'Výběr typu' : 'Neznámý typ'}
                      </Text>
                    </View>
                    
                    {/* Display the sentence/words */}
                    <View style={styles.questionContent}>
                      {question.SOURCE.map((word, wordIndex) => (
                        <View key={wordIndex} style={styles.wordItem}>
                          <Text style={styles.wordText}>{word.text}</Text>
                          <Text style={styles.wordType}>{word.type}</Text>
                        </View>
                      ))}
                    </View>
                    
                    {/* Show additional info if available */}
                    {question.WANTED && (
                      <Text style={styles.questionInfo}>
                        Hledaný typ: <Text style={styles.highlightedText}>{question.WANTED}</Text>
                      </Text>
                    )}
                    {question.INDEX !== undefined && (
                      <Text style={styles.questionInfo}>
                        Index slova: <Text style={styles.highlightedText}>{question.INDEX + 1}</Text>
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noQuestionsText}>Nepodařilo se vygenerovat otázky</Text>
            )}
          </View>
        )}
      </ScrollView>
    </PageWrapper>
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

    borderRadius: 8,
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
  // Questions section styles
  questionsLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  questionsLoadingText: {
    color: '#42A5F5',
    fontSize: 14,
  },
  questionsContainer: {
    gap: 12,
  },
  questionCard: {
    backgroundColor: '#2A3049',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#42A5F5',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  questionType: {
    fontSize: 12,
    color: '#42A5F5',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
  },
  questionContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  wordItem: {
    backgroundColor: '#1E2235',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wordText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  wordType: {
    fontSize: 10,
    color: '#42A5F5',
    backgroundColor: '#2A3049',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  questionInfo: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  highlightedText: {
    color: '#42A5F5',
    fontWeight: '600',
  },
  noQuestionsText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },
  // Answer display styles
  answersToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A3049',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  answersToggleText: {
    color: '#42A5F5',
    fontSize: 14,
    fontWeight: '600',
  },
  answersContainer: {
    backgroundColor: '#1E2235',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  answersTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  answerItem: {
    backgroundColor: '#2A3049',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  answerNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  answerStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  correctAnswer: {
    backgroundColor: '#1b4332',
  },
  incorrectAnswer: {
    backgroundColor: '#7f1d1d',
  },
  answerStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  answerTime: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  // User selections styles
  userSelectionsContainer: {
    backgroundColor: '#1E2235',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  userSelectionsTitle: {
    color: '#42A5F5',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  selectionsList: {
    gap: 6,
  },
  selectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#2A3049',
  },
  selectedOption: {
    backgroundColor: '#1b4332',
  },
  unselectedOption: {
    backgroundColor: '#2A3049',
  },
  selectionWord: {
    color: '#fff',
    fontSize: 13,
    flex: 1,
  },
  selectionTarget: {
    color: '#42A5F5',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  selectionStatus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  correctSelection: {
    backgroundColor: '#1b4332',
  },
  incorrectSelection: {
    backgroundColor: '#7f1d1d',
  },
  selectionStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});