import QuestionRow from '@/components/ui/tutorial/QuestionRow';
import TutorialButton from '@/components/ui/tutorial/TutorialButton';
import PlayfulButton from '@/components/ui/PlayfulButton';
import { useBackspaceIntercept } from '@/hooks/useBackspaceIntercept';
import { useTutorial } from '@/hooks/useTutorial';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
          {
            currentNode.node.yesNode &&
            <PlayfulButton title="ANO" variant="success" style={{width: '50%'}}onPress={() => AddNode(currentNode, true)} />
          }
          {
            currentNode.node.noNode &&
            <PlayfulButton title="NE" variant="danger" style={{width: '50%'}} onPress={() => AddNode(currentNode, false)} />
          }
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
    backgroundColor: '#101223',
  },
  verticalLine: {
    position: 'absolute',
    left: 14,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#333',
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
  mainContent: {
    alignItems: 'center',
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
    color: '#777',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 40,
    gap: 10,
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



