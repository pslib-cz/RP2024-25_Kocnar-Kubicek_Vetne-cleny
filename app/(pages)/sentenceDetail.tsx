// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { WordSelectionOption } from '@/types/games/SelectionOption';
// import { useLocalSearchParams } from 'expo-router';
// import { WordButtonType } from '@/types/games/WordButtonType';
// import { ButtonState } from '@/components/ui/games/WordButton';
// import { WordButtonsContainer } from '@/components/ui/games/WordButtonsContainer';
// import { useLevelContext } from '@/contexts/levelContext';

// // Accepts param: sentence (as JSON stringified WordSelectionOption[])
// export default function SentenceDisplayPage() {
//   const params = useLocalSearchParams();
//   const [sentence, setSentence] = useState<WordSelectionOption[] | null>(null);
//   const [buttons, setButtons] = useState<WordButtonType[]>([]);

//   const { handleShowTooltip } = useLevelContext();

//   useEffect(() => {
//     if (typeof params.sentence === 'string') {
//       try {
//         const arr = JSON.parse(params.sentence);
//         if (Array.isArray(arr) && arr.every(w => typeof w.text === 'string')) {
//           setSentence(arr);
//         } else {
//           setSentence(null);
//         }
//       } catch { }
//     }

//     handleShowTooltip("", -1);
//   }, [params.sentence]);
  
//   useEffect(() => {
//     if (!sentence) return;

//     setButtons(
//       sentence.map((item) => ({
//         text: item.text,
//         type: item.type,
//         drawType: true,
//         state: ButtonState.correct
//       }))
//     )      
//   }, [sentence]);

//   return (
//     <View style={styles.container}>
//       <WordButtonsContainer
//         buttons={buttons}
//         showTooltip={true}
//         longPress={() => {}}
//         onClick={(button, index) => handleShowTooltip(button.type || "null", index)}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   sentenceContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sentenceText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });
