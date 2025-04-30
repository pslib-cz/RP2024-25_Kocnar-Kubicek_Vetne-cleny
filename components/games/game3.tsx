import ContinueButton from '@/components/ui/games/ContinueButton';
import { LargeGameButton } from '@/components/ui/games/LargeGameButton';
import { useData } from '@/hooks/useData';
import { WordSelectionOption } from '@/types/games/SelectionOption';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { GameLayout } from './gameLayout';
import { useGameContext } from '@/contexts/GameContext';

export function Game3UI(sentece : boolean) {
  const { data, onFinished } = useGameContext();
  const [options, setOptions] = useState<WordSelectionOption[]>();

  useEffect(() => {
    if (data) {
      setOptions(data);
    }
  }, [data]);

  const [selectedOptions, setSelectedOptions] = useState<WordSelectionOption[]>([]);

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

  const targetType = 'po';

  function IsValid() : boolean{    
    for (const item of selectedOptions) {
      if (item.type !== targetType)
        return false;      
    }    
    return true;
  }

  return (
    <GameLayout
      resetGame={() => {}}
    >
      <View style={styles.content}>
        <Text style={styles.questionText}>Které slovo {sentece ? "ve větě " : ""}je {targetType}?</Text>        
        {
          sentece &&
          <Text style={styles.exampleText}>
            {data.map((item) => item.text).join(" ")}
          </Text>
        }
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
        {
          selectedOptions.length > 0 && 
          <ContinueButton onClick={handleContinue}/>
        }
      </View>
    </GameLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 60,
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
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  grid: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
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