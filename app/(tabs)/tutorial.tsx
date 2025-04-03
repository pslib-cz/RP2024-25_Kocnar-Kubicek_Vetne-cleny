import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import QuestionRow from '@/components/ui/tutorial/QuestionRow';
import TutorialButton from '@/components/ui/tutorial/TutorialButton';
import { useTutorial } from '@/hooks/useTutorial';

export default function Tutorial() {

  const {usedNodes, currentNode, AddNode} = useTutorial();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.view1}>
        <View style={styles.verticalLine} />
      
        <View style={styles.mascotContainer}>
          <View style={styles.mascot}>
            <Text style={styles.mascotText}>👀</Text>
          </View>
        </View>

        {/* Questions section */}
        <View style={styles.questionSection}>
          {
            usedNodes.map((node, index) => (
              <QuestionRow
                key={index}
                question={node.node.title}
                answer={node.node.isResult ? "ANO" : "NE"}
              />
            ))
          }
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          <Text style={styles.mainHeading}>{currentNode.node.title}</Text>
          <Text style={styles.subHeading}>{currentNode.node.description}</Text>
        </View>
      </View>
            
      {
        !currentNode.node.isResult &&
        <View style={styles.buttonContainer}>
          <TutorialButton title="ANO" filled={true} onPress={() => {
            
            if (currentNode && currentNode.node.yesNode)
              AddNode(currentNode.node.yesNode, true);

          }} />
          <TutorialButton title="NE" filled={false} onPress={() => {

            if (currentNode && currentNode.node.noNode)
              AddNode(currentNode.node.noNode, true);

          }} />        
        </View>
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
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
    // alignSelf: 'flex-start',
    // marginLeft: 40,
    marginBottom: 40,
    width: '100%',
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
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  view1: {
    width: '100%',
  }
});



