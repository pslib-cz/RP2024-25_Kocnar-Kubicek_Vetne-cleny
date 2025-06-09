import QuestionRow from '@/components/ui/tutorial/QuestionRow'
import PlayfulButton from '@/components/ui/PlayfulButton'
import { useTutorial } from '@/hooks/useTutorial'
import { StatusBar } from 'expo-status-bar'
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import AndroidSafeArea from '@/components/AndroidSafeArea';

export default function Tutorial() {
  const { usedNodes, currentNode, AddNode, reset } = useTutorial();

  return (
    <SafeAreaView style={[styles.container, AndroidSafeArea.AndroidSafeArea]}>
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
        <Text style={styles.subHeading}>Odpovídáním přijdeš na větný člen slova.</Text>
        <Text style={styles.mainHeading}>{currentNode.node.title}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {
          !currentNode.node.isResult &&
          <>
            {
              currentNode.node.yesNode &&
              <PlayfulButton title="ANO" variant="success" style={{ width: '50%' }} onPress={() => AddNode(currentNode, true)} />
            }
            {
              currentNode.node.noNode &&
              <PlayfulButton title="NE" variant="danger" style={{ width: '50%' }} onPress={() => AddNode(currentNode, false)} />
            }
          </>
        }
      </View>
      <View style={styles.resetButtonContainer}>
        <PlayfulButton title="RESET" variant="secondary" style={{ width: '50%', padding: 10 }} onPress={reset} />
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
    marginVertical: 10,
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
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 40,
    gap: 10
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    alignSelf: 'flex-start',
    marginTop: 50,
  },
  backText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  resetButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 0,
  },
});



