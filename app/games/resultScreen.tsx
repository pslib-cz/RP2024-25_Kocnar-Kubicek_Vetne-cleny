import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PracticeCompleteScreen = () => {
  const navigation = useRouter();

  return (
    <LinearGradient colors={['#282A36', '#44475A']} style={styles.container}>
      <View style={styles.illustrationContainer}>
        {/* Replace with your actual image/animation component */}
        <View style={styles.character}>
          {/* Example simple shapes - replace with your character */}
          <View style={styles.head} />
          <View style={styles.body} />
          <View style={styles.arms} />
          <View style={styles.legs} />
        </View>
        <View style={styles.duo}>
          {/* Example simple shape - replace with your Duo image */}
          <View style={styles.duoBody} />
          <View style={styles.duoBeak} />
          <View style={styles.duoEyes} />
        </View>
      </View>

      <Text style={styles.title}>Practice complete!</Text>

      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: '#BD93F9' }]}>
          <View style={styles.iconContainer}>
            <FontAwesome name="bolt" size={24} color="white" />
          </View>
          <Text style={styles.statLabel}>TOTAL XP</Text>
          <Text style={styles.statValue}>20</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: '#8BE9FD' }]}>
          <View style={styles.iconContainer}>
            <FontAwesome name="clock-o" size={24} color="white" />
          </View>
          <Text style={styles.statLabel}>BLAZING</Text>
          <Text style={styles.statValue}>1:05</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: '#50FA7B' }]}>
          <View style={styles.iconContainer}>
            <FontAwesome name="check-circle" size={24} color="white" />
          </View>
          <Text style={styles.statLabel}>AMAZING</Text>
          <Text style={styles.statValue}>100%</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate('/' as never)}
      >
        <Text style={styles.continueButtonText}>CONTINUE</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  illustrationContainer: {
    alignItems: 'center',
    width: '80%',
    aspectRatio: 1.2, // Adjust as needed for your illustration
    marginBottom: 20,
  },
  character: {
    // Styles for your purple character
    position: 'absolute',
    bottom: 0,
    left: '20%',
    alignItems: 'center',
  },
  head: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#BB86FC',
  },
  body: {
    width: 40,
    height: 80,
    backgroundColor: '#BB86FC',
    marginTop: 5,
  },
  arms: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
    marginTop: 5,
  },
  arm: {
    width: 15,
    height: 40,
    backgroundColor: '#BB86FC',
  },
  legs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50,
    marginTop: 5,
  },
  leg: {
    width: 15,
    height: 40,
    backgroundColor: '#BB86FC',
  },
  duo: {
    // Styles for your green Duo character
    position: 'absolute',
    bottom: 10,
    right: '15%',
    alignItems: 'center',
  },
  duoBody: {
    width: 60,
    height: 80,
    backgroundColor: '#5EE75B',
    borderRadius: 30,
  },
  duoBeak: {
    width: 20,
    height: 20,
    backgroundColor: '#FFC107',
    position: 'absolute',
    bottom: 60,
    left: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  duoEyes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 30,
    position: 'absolute',
    top: 20,
    left: 15,
  },
  eye: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F1FA8C',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 40,
  },
  statBox: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    width: '30%',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
  },
  statLabel: {
    color: '#F8F8F2',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#6272A4',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PracticeCompleteScreen;