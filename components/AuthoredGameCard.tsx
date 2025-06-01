import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AuthoredGame, useAPI } from '@/hooks/useAPI';
import { galaxies } from '@/components/ArenaHeader';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const isGameActive = (expirationTime: string) => {
  const now = new Date();
  const expiration = new Date(expirationTime);
  return now < expiration;
};

export const AuthoredGameCard = ({ game }: { game: AuthoredGame }) => {
  // Calculate if the game is active based on expiration time
  const active = isGameActive(game.expirationTime) && game.active;

  const router = useRouter();

  return (
    <Pressable onPress={
      () => {
        router.push({
          pathname: `/exams/(teacher)/authoredGameDetail` as never,
          params: { gameId: game.id }
        })
      }
    } key={game.id} style={styles.card}>
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
          <Text style={{ color: "white" }}>{game.difficulty}% obtížnost</Text>
        </View>
        <View style={styles.detail}>
          <MaterialIcons name="public" size={18} color="#42A5F5" style={{ marginRight: 4 }} />
          <Text style={{ color: "white" }}>{galaxies[game.galaxy].name}</Text>
        </View>
        <View style={styles.detail}>
          <MaterialIcons name="numbers" size={18} color="#AB47BC" style={{ marginRight: 4 }} />
          <Text style={{ color: "white" }}>{game.questionCount} otázek</Text>
        </View>
        <View style={styles.detail}>
          <MaterialIcons name="casino" size={18} color="#26A69A" style={{ marginRight: 4 }} />
          <Text style={{ color: "white" }}>{game.seeded ? 'Stejné otázky' : 'Různé otázky'}</Text>
        </View>
        <View style={styles.detail}>
          <MaterialIcons name="hourglass-empty" size={18} color="#FF7043" style={{ marginRight: 4 }} />
          <Text style={{ color: "white" }}>{game.expirationTime ? 'Do ' + new Date(game.expirationTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Bez expirace'}</Text>
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
              <Text style={{ color: "white" }}>{session.player.name}</Text>
            </View>
            <Text style={styles.sessionScore}>
              {session.completed ? `Skóre: ${session.correctAnswers} / ${game.questionCount} (${Math.round((session.correctAnswers / game.questionCount) * 100)}%)` : 'Ve hře'}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#1E2235',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#fff',
  },
  gameDate: {
    fontSize: 14,
    color: '#aaa',
  },
  expirationTime: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeStatus: {
    backgroundColor: '#1b4332',
  },
  inactiveStatus: {
    backgroundColor: '#35363a',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
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
    backgroundColor: '#2A3049',
    borderRadius: 4,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    color: '#ddd',
  },
  sessionsContainer: {
    marginTop: 8,
  },
  sessionsTitle: {
    fontWeight: '500',
    marginBottom: 4,
    color: '#fff',
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
    color: '#ddd',
  },
});