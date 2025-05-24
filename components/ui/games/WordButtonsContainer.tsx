

// // TODO
// // this should be a component that renders buttons from game 1

// import { WordButtonType } from "@/types/games/WordButtonType";
// import React from "react";
// import { StyleSheet, View } from "react-native";
// import { Tooltip } from "./Tooltip";
// import WordButton from "./WordButton";
// import { WordTypes } from "@/constants/WordTypes";

//   const isWordTypeAbbr = (abbr: string) => WordTypes.some(w => w.abbr === abbr);

// export const WordButtonsContainer = (
//   {buttons, showTooltip} : {buttons : WordButtonType[], showTooltip : boolean}
// ) => {
//   return(
//     <>
//     {
//       buttons ?
//       <View style={styles.phraseContainer}>
//         {
//           buttons.map((button, index) => {
//             if (showTooltip && isWordTypeAbbr(button.text)) {
//               return (
//                 <Tooltip
//                   key={index}
//                   visible={tooltip.visible && tooltip.index === index}
//                   message={tooltip.message}
//                   onRequestClose={handleHideTooltip}
//                 >
//                   <WordButton
//                     text={button.text}
//                     state={button.state}
//                     type={button.type}
//                     drawType={button.drawType}
//                     onLongPress={() => {}}
//                     onClick={() => handleShowTooltip(button.text, index)}
//                   />
//                 </Tooltip>
//               );
//             }
//             return (
//               <WordButton
//                 key={index}
//                 text={button.text}
//                 state={button.state}
//                 type={button.type}
//                 drawType={button.drawType}
//               />
//             );
//           })
//         }
//       </View>
//       :
//       <View style={styles.phraseContainer}>
//         <ThemedText>Loading...</ThemedText>
//       </View>
//     }
//     </>
//   )
// }

// const styles = StyleSheet.create({
//   phraseContainer: {
//     display: 'flex',
//     gap: 8,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   phraseButton: {
//     backgroundColor: 'transparent',
//     borderColor: '#444',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     marginHorizontal: 5,
//   }
// });