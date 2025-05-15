import QuestionRow from '@/components/ui/tutorial/QuestionRow';
import TutorialButton from '@/components/ui/tutorial/TutorialButton';
import { useBackspaceIntercept } from '@/hooks/useBackspaceIntercept';
import { useTutorial } from '@/hooks/useTutorial';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationState, useRoute } from '@react-navigation/native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackHandler } from 'react-native';

export default function Tutorial() {
  const { usedNodes, currentNode, AddNode } = useTutorial();

  const router = useRouter();
  const { returnTo } = useLocalSearchParams();

  useBackspaceIntercept(() => {
    if (returnTo) {
      router.push(returnTo as never);
    }
    else {
      router.back();
    }
  });

  return (
    <SafeAreaView style={styles.container}>

    {returnTo && (
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push(returnTo as never)}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.backText}>Zpět ke hře</Text>
      </TouchableOpacity>
    )}

      <StatusBar style="light" />
      <View style={styles.verticalLine} />

      <View style={styles.questionSection}>
        {
          usedNodes.map((node, index) => (
            <QuestionRow
              key={index}
              question={node.node.title}
              answer={node.yes ? "ANO" : "NE"}
            />
          ))
        }
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.mainHeading}>{currentNode.node.title}</Text>
        <Text style={styles.subHeading}>{currentNode.node.description}</Text>
      </View>

      <View style={styles.buttonContainer}>
      {
        !currentNode.node.isResult &&
        <>
          <TutorialButton title="ANO" filled={true} onPress={() => AddNode(currentNode, true)} />
          <TutorialButton title="NE" filled={false} onPress={() => AddNode(currentNode, false)} />
        </>
      }
      </View>      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40
  },
  verticalLine: {
    position: 'absolute',
    left: 14,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#333',
  },
  mascotContainer: {
    position: 'absolute',
    left: 0,
    top: '40%',
  },
  mascot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotText: {
    fontSize: 16,
  },
  questionSection: {
    marginVertical: 40,
    width: '100%',
    flexGrow: 5,
  },
  questionRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  questionText: {
    color: '#FFF',
    fontSize: 16,
    marginRight: 10,
  },
  answerYes: {
    color: '#4CD964',
    fontSize: 16,
    fontWeight: 'bold',
  },
  answerNo: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainContent: {
    alignItems: 'center',
    marginBottom: 80,
    marginHorizontal: 40,
    flexGrow: 1,
  },
  mainHeading: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeading: {
    // color: '#777',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 40,
  },
  view1: {
    width: '100%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  backText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
});



