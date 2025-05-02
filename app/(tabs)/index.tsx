import { Rocket } from '@/components/Rocket';
import { ThemedText } from '@/components/ThemedText';
import BigassButton from '@/components/ui/BigassButton';
import { useGameContext } from '@/contexts/GameContext';
import { useMultiplayerGameContext } from '@/contexts/MultiplayerGameContext';
import { useRocket } from '@/contexts/RocketContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function HomeScreen()
{
  const router = useRouter();
  const { name } = useRocket();

  const { moveToNextLevel } = useGameContext()

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16, alignItems: 'center' }}>

      <View onTouchStart={() => {
        router.push('/profile');
      }}>
        <Rocket />
        <ThemedText type="title">{name}</ThemedText>
      </View>


      <BigassButton title='⛷️ Procvičování' bgEmoji='⛷️' onPress={() => {
        
        console.warn("Not implemented yet - seed and other stuff should be generated here")

        moveToNextLevel()

      }}/>
      <BigassButton title='🙀 Test' bgEmoji='🙀' onPress={() => {
        router.push('../exams');
      }}/>
      <BigassButton title='🏢 Tutoriál' bgEmoji='💀' onPress={() => 
        router.push('/tutorial')
      }/>

      <ThemedText type="subtitle">Nejčastější chyby</ThemedText>
    </ScrollView>
  );
}

