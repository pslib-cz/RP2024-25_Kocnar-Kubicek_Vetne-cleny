import BigassButton from '@/components/ui/BigassButton';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SpaceJourneyProps {
  currentLevel: string;
  nextTask: string;
}

const SpaceJourney: React.FC<SpaceJourneyProps> = ({ currentLevel = 'Miercoles 32', nextTask = 'Další úloha' }) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Cesta k další planetě</Text>
      
      {/* Progress bar with rocket */}
      <View style={styles.progressContainer}>
        <View style={styles.rocketContainer}>
          <View style={styles.rocket}>
            <Text style={styles.rocketEmoji}>🚀</Text>
          </View>
        </View>
      </View>
      
      {/* Planet view */}
      <View style={styles.planetContainer}>
        <View style={styles.planet}>
          {/* White dot */}
          <View style={[styles.marker, styles.whiteDot]} />
          
          {/* Yellow dot */}
          <View style={[styles.marker, styles.yellowDot]} />
          
          {/* Green dots */}
          <View style={[styles.marker, styles.greenDot1]} />
          <View style={[styles.marker, styles.greenDot2]} />
          
          {/* Path lines */}
          <View style={styles.pathLine1} />
          <View style={styles.pathLine2} />
          <View style={styles.pathLine3} />
        </View>
        
        {/* Level indicator */}
        <Text style={styles.levelText}>{currentLevel}</Text>
      </View>
      
      {/* Next task button */}
      <BigassButton 
        title={nextTask}
        bgEmoji="🚀"
        onPress={() => console.log('Next task pressed')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  progressContainer: {
    width: '90%',
    height: 40,
    backgroundColor: '#222',
    borderRadius: 20,
    marginBottom: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    width: '30%',
    height: '100%',
    borderRadius: 20,
  },
  rocketContainer: {
    position: 'absolute',
    top: 0,
    left: '28%',
    height: '100%',
    justifyContent: 'center',
  },
  rocket: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rocketEmoji: {
    fontSize: 20,
  },
  planetContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planet: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#e63946',
    position: 'relative',
    overflow: 'hidden',
  },
  marker: {
    position: 'absolute',
    borderRadius: 25,
  },
  whiteDot: {
    width: 25,
    height: 25,
    backgroundColor: '#f1faee',
    top: 30,
    right: 90,
  },
  yellowDot: {
    width: 30,
    height: 30,
    backgroundColor: '#ffb703',
    top: '50%',
    left: 40,
  },
  greenDot1: {
    width: 30,
    height: 30,
    backgroundColor: '#2a9d8f',
    top: '50%',
    right: 40,
  },
  greenDot2: {
    width: 35,
    height: 35,
    backgroundColor: '#2a9d8f',
    bottom: 40,
    right: 70,
  },
  pathLine1: {
    position: 'absolute',
    top: 45,
    left: 130,
    width: 4,
    height: 100,
    backgroundColor: '#fff',
    transform: [{ rotate: '35deg' }],
    opacity: 0.7,
  },
  pathLine2: {
    position: 'absolute',
    top: 125,
    left: 80,
    width: 110,
    height: 4,
    backgroundColor: '#fff',
    opacity: 0.7,
  },
  pathLine3: {
    position: 'absolute',
    top: 120,
    right: 60,
    width: 4,
    height: 80,
    backgroundColor: '#fff',
    transform: [{ rotate: '20deg' }],
    opacity: 0.7,
  },
  levelText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
  },
  nextTaskButton: {
    marginTop: 20,
    width: '80%',
  },
});

export default SpaceJourney;