import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const QuestionRow = ({question, answer} : {question : string, answer : string}) => {

  const answerStyle = answer === 'ANO' ? styles1.answerYes : styles1.answerNo;

  return (
    <View style={styles1.container}>
      <View style={styles1.indicatorContainer}>
        <View style={styles1.dot} />
      </View>
      <View style={styles1.contentContainer}>
        <Text style={styles1.questionText}>{question}</Text>
        <Text style={[answerStyle]}>{answer}</Text>
      </View>
    </View>
  );
};

export default QuestionRow;

const styles1 = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 12,
    paddingLeft: 4,
  },
  indicatorContainer: {
    width: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  verticalLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: '#333',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  contentContainer: {
    flexWrap: 'wrap',
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  questionText: {
    color: '#FFF',
    fontSize: 14,
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
});