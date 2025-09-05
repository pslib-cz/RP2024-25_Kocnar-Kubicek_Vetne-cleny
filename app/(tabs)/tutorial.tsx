import QuestionRow from '@/components/ui/tutorial/QuestionRow'
import PlayfulButton from '@/components/ui/PlayfulButton'
import { useTutorial } from '@/hooks/useTutorial'
import { useTutorialContext } from '@/contexts/TutorialContext'
import { StatusBar } from 'expo-status-bar'
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import PageWrapper from '@/components/PageWrapper';

export default function Tutorial() {

  const { sentence, wordId, AddNode, reset, pathExists, currentNode, usedNodes } = useTutorialContext();

  const getSelectedWord = (): string => {
    if (!sentence || wordId === null) return '';
    return sentence[wordId]?.text || '';
  };

  const renderSentence = () => {
    if (!sentence) return null;

    return (
      <View style={styles.sentenceContainer}>
        <Text style={styles.sentenceLabel}>Věta:</Text>
        <View style={styles.sentenceTextContainer}>
          {sentence.map((word, index) => (
            <Text
              key={index}
              style={[
                styles.normalWord,
                index === wordId && styles.highlightedWord
              ]}
            >
              {word.text}{' '}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const onButtonClicked = (yes: boolean) => {
    if (sentence && wordId && !pathExists(currentNode, sentence[wordId].type, yes)) {
      Alert.alert("To nebude správně");
      return
    }

    AddNode(currentNode, yes);
  };

  return (
    <PageWrapper>
      <StatusBar style="light" />
      <View style={styles.verticalLine} />

      {/* Display the sentence with highlighted word */}
      {renderSentence()}

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
        <Text style={styles.subHeading}>
          Odpovídáním přijdeš na větný člen slova{getSelectedWord() ? ` "${getSelectedWord()}"` : ''}.
        </Text>
        <Text style={styles.mainHeading}>{currentNode.node.title}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {
          !currentNode.node.isResult &&
          <>
            {
              currentNode.node.yesNode &&
              <PlayfulButton title="ANO" variant="success" style={{ width: '50%' }} onPress={() => onButtonClicked(true)} />
            }
            {
              currentNode.node.noNode &&
              <PlayfulButton title="NE" variant="danger" style={{ width: '50%' }} onPress={() => onButtonClicked(false)} />
            }
          </>
        }
      </View>
      <View style={styles.resetButtonContainer}>
        <PlayfulButton title="RESET" variant="secondary" style={{ width: '50%', padding: 10 }} onPress={reset} />
      </View>
    </PageWrapper>
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
  sentenceContainer: {
    width: '100%',
    marginVertical: 15,
    backgroundColor: '#1c1f3d',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
  },
  sentenceLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  sentenceTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  normalWord: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
  },
  highlightedWord: {
    color: '#ffffffff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
});



