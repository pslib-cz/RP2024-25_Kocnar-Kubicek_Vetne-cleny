import QuestionRow from '@/components/ui/tutorial/QuestionRow'
import PlayfulButton from '@/components/ui/PlayfulButton'
import { useTutorialContext } from '@/contexts/TutorialContext'
import { StatusBar } from 'expo-status-bar'
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import PageWrapper from '@/components/PageWrapper';
import { Ionicons } from '@expo/vector-icons'
import { ThemedText } from '@/components/ThemedText'
import { router } from 'expo-router';

export default function Tutorial() {

  const { sentence, wordId, AddNode, reset, pathExists, currentNode, usedNodes, setSentence } = useTutorialContext();

  const getSelectedWord = (): string => {
    if (!sentence || wordId === null) return '';
    return sentence[wordId]?.text || '';
  };

  const renderHeader = () => {
    return (
      <View style={[{ marginLeft: 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="white" />
          <ThemedText style={styles.backText}>Zpět</ThemedText>
        </TouchableOpacity>
        {
          sentence &&
          <View style={styles.sentenceContainer}>
            <View style={styles.sentenceHeader}>
              <Text style={styles.sentenceLabel}>Věta:</Text>
              <TouchableOpacity style={styles.dismissButton} onPress={() => setSentence(null)}>
                <Text style={styles.dismissButtonText}>Zrušit</Text>
              </TouchableOpacity>
            </View>
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
        }
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

      {renderHeader()}

      <ScrollView style={styles.questionSection}>
        {
          usedNodes.map((node, index) => (
            <QuestionRow
              key={index}
              question={node.node.title}
              answer={node.yes ? "ANO" : "NE"}
            />
          ))
        }
      </ScrollView>

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
  },
  sentenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sentenceLabel: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  dismissButton: {
    paddingHorizontal: 12,
    marginRight: 16,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
  },
  dismissButtonText: {
    color: '#fff',
    fontSize: 12,
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



