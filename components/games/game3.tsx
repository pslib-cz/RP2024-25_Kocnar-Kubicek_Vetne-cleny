import ContinueButton from '@/components/ui/games/ContinueButton';
import { LargeGameButton } from '@/components/ui/games/LargeGameButton';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGameContext } from '@/contexts/GameContext';
import { useLevelContext } from '@/contexts/levelContext';

export function Game3UI(sentece: boolean) {
  const { data, onFinished } = useGameContext();
  const { options, setOptions, targetType, setTargetType, selectedOptions, setSelectedOptions } = useLevelContext();

  // const [options, setOptions] = useState<WordSelectionOption[]>();
  // const [selectedOptions, setSelectedOptions] = useState<WordSelectionOption[]>([]);

  useEffect(() => {
    if (data) {
      setOptions(data);
    }

    setTargetType(data[Math.floor(Math.random() * data.length)].type);
  }, [data]);

  const handleSelect = (id: WordSelectionOption) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter(item => item !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  const handleContinue = () => {
    onFinished(IsValid())
  }

  function IsValid(): boolean {
    for (const item of selectedOptions) {
      if (item.type !== targetType)
        return false;
    }
    return true;
  }

  return (
    <>
      {/* <View style={styles.content}> */}
      <View>
        <Text style={styles.questionText}>Které slovo {sentece ? "ve větě " : ""}je {targetType}?</Text>
        {
          sentece &&
          <Text style={styles.exampleText}>
            {data.map((item) => item.text).join(" ")}
          </Text>
        }
      </View>
        <ScrollView style={{ width: '100%' }}>
          <View style={[styles.grid, { marginBottom: 40 }]}>
            {
              options &&
              options.map((option, index) => (
                <LargeGameButton
                  key={index}
                  text={option.text}
                  selected={selectedOptions.includes(option)}
                  onPress={() => handleSelect(option)}
                />
              ))
            }
          </View>
        </ScrollView>
        <ContinueButton onClick={handleContinue} enabled={selectedOptions.length > 0} />
      {/* </View> */}
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
  },
  questionText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  exampleText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  grid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  option: {
    width: '48%',
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.4)',
  },
  selectedOption: {
    borderColor: '#6266f1',
    backgroundColor: 'rgba(98, 102, 241, 0.1)',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});