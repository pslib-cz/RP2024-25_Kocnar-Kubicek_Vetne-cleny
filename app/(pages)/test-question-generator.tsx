import React, { useState } from "react";
import { Galaxy, QuestionType } from "@/constants/questionGeneratorParams";
import { View, Text, ScrollView, TextInput, Switch, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { questionGenerator } from "@/utils/QuestionsGenerator/questionGenerator";
import { useLoadedData } from "@/hooks/useData";
import { GeneratorParam } from "@/constants/questionGeneratorParams";

const galaxyOptions = Object.entries(Galaxy).filter(([k, v]) => typeof v === 'number');
const questionTypeOptions = Object.entries(QuestionType).filter(([k, v]) => typeof v === 'number');

export default function TestQuestionGenerator() {
  const { loadedSets, loadedTypeSets } = useLoadedData();
  const [galaxy, setGalaxy] = useState<Galaxy>(Galaxy.ALL);
  const [difficulty, setDifficulty] = useState(0.5);
  const [seed, setSeed] = useState(42);
  const [count, setCount] = useState(7);
  const [questionTypesBitfield, setQuestionTypesBitfield] = useState(
    (1 << questionTypeOptions.length) - 1
  );
  const [testResults, setTestResults] = useState<string[]>([]);

  const questions = questionGenerator({
    galaxy,
    difficulty,
    seed,
    count,
    questionTypesBitfield,
    loadedSets,
    loadedTypeSets
  });

  const testSeedConsistency = () => {
    console.log('Testing seed consistency...');
    const results: string[] = [];
    
    // Generate questions multiple times with the same seed
    for (let i = 0; i < 3; i++) {
      const testQuestions = questionGenerator({
        galaxy,
        difficulty,
        seed,
        count,
        questionTypesBitfield,
        loadedSets,
        loadedTypeSets
      });
      
      const questionTypes = testQuestions.map(q => q.TEMPLATE[GeneratorParam.QUESTION_TYPE]);
      const result = `Run ${i + 1}: Question types: [${questionTypes.join(', ')}]`;
      results.push(result);
      console.log(result);
    }
    
    setTestResults(results);
  };

  console.log(questions);

  function toggleQuestionType(idx: number) {
    setQuestionTypesBitfield(bitfield => bitfield ^ (1 << idx));
  }

  return (
    <ScrollView style={{ padding: 24, backgroundColor: "#f4f4f4" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>Question Generator Test</Text>
      <View style={{ marginBottom: 16 }}>
        <Text>Galaxy:</Text>
        <Picker
          selectedValue={galaxy}
          onValueChange={itemValue => setGalaxy(itemValue)}
          style={{ marginBottom: 8 }}
        >
          {galaxyOptions.map(([name, value]) => (
            <Picker.Item key={value} label={name} value={value} />
          ))}
        </Picker>
        <Text>Difficulty: {difficulty.toFixed(2)}</Text>
        <Slider
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={difficulty}
          onValueChange={setDifficulty}
          style={{ width: 200, marginBottom: 8 }}
        />
        <Text>Seed:</Text>
        <TextInput
          value={seed.toString()}
          onChangeText={text => setSeed(Number(text))}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 4, marginBottom: 8, width: 100 }}
        />
        <Text>Count:</Text>
        <TextInput
          value={count.toString()}
          onChangeText={text => setCount(Number(text))}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 4, marginBottom: 8, width: 100 }}
        />
      </View>
      <View style={{ marginBottom: 16 }}>
        <Text>Question Types:</Text>
        {questionTypeOptions.map(([name, idx]) => (
          <View key={name} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Switch
              value={!!(questionTypesBitfield & (1 << (idx as number)))}
              onValueChange={() => toggleQuestionType(idx as number)}
            />
            <Text style={{ marginLeft: 8 }}>{name}</Text>
          </View>
        ))}
      </View>
      
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Seed Consistency Test</Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' }}
          onPress={testSeedConsistency}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Test Seed Consistency</Text>
        </TouchableOpacity>
        {testResults.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Test Results:</Text>
            {testResults.map((result, index) => (
              <Text key={index} style={{ marginBottom: 2, fontSize: 12 }}>{result}</Text>
            ))}
          </View>
        )}
      </View>
      
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>Output</Text>
        <ScrollView style={{ backgroundColor: "#f4f4f4", padding: 16, borderRadius: 8, maxHeight: 400 }}>
          <Text selectable>{JSON.stringify(questions, null, 2)}</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
} 