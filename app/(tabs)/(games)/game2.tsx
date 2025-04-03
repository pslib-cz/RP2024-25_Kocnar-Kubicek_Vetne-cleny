import { LargeGameButton } from '@/components/ui/games/LargeGameButton';
import RocketProgressBar from '@/components/ui/games/ProgressBar';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

interface SelectionOption {
  id: string;
  text: string;
  selected: boolean;
}

const CzechSelectionGrid: React.FC = () => {
  const [options, setOptions] = useState<SelectionOption[]>([
    { id: '1', text: 'Na výlet', selected: false },
    { id: '2', text: 'Nikdy', selected: false },
    { id: '3', text: 'Si letos', selected: false },
    { id: '4', text: 'Zítra', selected: false },
  ]);

  const handleSelect = (id: string) => {
    setOptions(
      options.map(option => 
        option.id === id 
          ? { ...option, selected: !option.selected } 
          : option
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <RocketProgressBar progress={0.33} />

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Vyber PUM</Text>
        
        {/* Grid */}
        <View style={styles.grid}>
          <View style={styles.row}>
            <LargeGameButton
              text={options[0].text}
              selected={options[0].selected}
              onPress={() => handleSelect('1')}
            />

            <LargeGameButton
              text={options[1].text}
              selected={options[1].selected}
              onPress={() => handleSelect('2')}
            />
          </View>
          
          <View style={styles.row}>
            <LargeGameButton
              text={options[2].text}
              selected={options[2].selected}
              onPress={() => handleSelect('3')}
            />

            <LargeGameButton
              text={options[3].text}
              selected={options[3].selected}
              onPress={() => handleSelect('4')}
            />
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

});

export default CzechSelectionGrid;