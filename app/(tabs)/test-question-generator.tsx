import React, { useState } from "react";
import { useQuestionGenerator } from "@/hooks/useQuestionGenerator";
import { Galaxy, QuestionType } from "@/constants/questionGeneratorParams";
import { View, Text, ScrollView, TextInput, Switch } from "react-native";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";

const galaxyOptions = Object.entries(Galaxy).filter(([k, v]) => typeof v === 'number');
const questionTypeOptions = Object.entries(QuestionType).filter(([k, v]) => typeof v === 'number');

export default function TestQuestionGenerator() {
  const [galaxy, setGalaxy] = useState<Galaxy>(Galaxy.ALL);
  const [difficulty, setDifficulty] = useState(0.5);
  const [seed, setSeed] = useState(42);
  const [count, setCount] = useState(7);
  const [questionTypesBitfield, setQuestionTypesBitfield] = useState(
    (1 << questionTypeOptions.length) - 1
  );

  const questions = useQuestionGenerator({
    galaxy,
    difficulty,
    seed,
    count,
    questionTypesBitfield,
  });

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
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>Output</Text>
        <ScrollView style={{ backgroundColor: "#f4f4f4", padding: 16, borderRadius: 8, maxHeight: 400 }}>
          <Text selectable>{JSON.stringify(questions, null, 2)}</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
} 