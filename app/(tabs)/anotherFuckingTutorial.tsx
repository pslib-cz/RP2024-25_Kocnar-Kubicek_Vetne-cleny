


// show whole sentence and make player choose what word is what type - eg. sentence and one type is shown
// if player makes mistake, show correct answer explanation and offer step by step guided tutorial
// then, move onto the next word

// this is pretty much another game type, so I am using LevelContext

import { ThemedText } from "@/components/ThemedText";
import { TargetTypeDisplay } from "@/components/ui/games/TargetTypeDisplay";
import { ButtonState } from "@/components/ui/games/WordButton";
import { WordButtonsContainer } from "@/components/ui/games/WordButtonsContainer";
import PlayfulButton from "@/components/ui/PlayfulButton";
import { useLevelContext } from "@/contexts/levelContext";
import { WordSelectionOption } from "@/types/games/SelectionOption";
import { WordType } from "@/types/WordTypes";
import React, { useCallback, useEffect, useState } from "react";
import { LayoutAnimation } from "react-native";
import { WordTypeCard } from "./anotherTutorial";
import { GetWordTypeByAbbr } from "@/constants/WordTypeDefinitions";
import PageWrapper from "@/components/PageWrapper";
import ModalWrapper from "@/components/modals/ModalWrapper";

export default function SentenceExample() {

  const { options, setOptions, targetType, setTargetType, selectedOptions, setSelectedOptions } = useLevelContext();

  const sentence: WordSelectionOption[] = [
    { text: "Bílá", type: "pks" }, // přívlastek shodný
    { text: "kočka", type: "po" }, // podmět
    { text: "s flíčky", type: "pkn" }, // přívlastek neshodný
    { text: "včera", type: "puč" }, // příslovečné určení času
    { text: "na zahradě", type: "pum" }, // příslovečné určení místa
    { text: "z hladu", type: "pu příčiny" }, // příslovečné určení příčiny
    { text: "velmi", type: "pu míry" }, // příslovečné určení míry
    { text: "obratně", type: "puz" }, // příslovečné určení způsobu
    { text: "ulovila", type: "př" }, // přísudek
    { text: "myš", type: "pt" } // předmět
  ];

  const typesOrder: WordType[] = [
    "po",    // podmět
    "př",    // přísudek
    "pt",    // předmět
    "pks",   // přívlastek shodný
    "pkn",   // přívlastek neshodný
    "puč",   // příslovečné určení času
    "pum",   // příslovečné určení místa
    "pu příčiny", // příslovečné určení příčiny
    "pu míry",    // příslovečné určení míry
    "puz"    // příslovečné určení způsobu
  ];
  const explanations = ["začneme podmětem", "pokračujeme přísudkem", "a nakonec doplníme předmětem"]

  const [typeIndex, setTypeIndex] = React.useState(0)

  const [incorrectType, setIncorrectType] = React.useState<string[] | null>(null)

  const [buttons, setButtons] = useState<{ text: string; type: WordType; drawType: boolean; state: ButtonState }[]>([]);

  useEffect(() => {
    const newButtons = sentence.map((item) => ({
      text: item.text,
      type: item.type,
      drawType: false,
      state: ButtonState.default
    }));
    setButtons(newButtons);
  }, []);

  useEffect(() => {
    setTargetType(typesOrder[typeIndex])
  }, [typeIndex])

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback((key: string) => {
    // Configure layout animation for smooth expand/collapse
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleY,
        springDamping: 0.7,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });

    setExpandedItems(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(key)) {
        newExpanded.delete(key);
      } else {
        newExpanded.add(key);
      }
      return newExpanded;
    });
  }, []);

  return (
    <PageWrapper padding>
      <ThemedText>{explanations[typeIndex]}</ThemedText>
      <WordButtonsContainer
        buttons={buttons}
        showTooltip={false}
        longPress={() => { }}
        onClick={(button, index) => {
          if (button.type === targetType?.type) {
            let newIndex = typeIndex
            while (newIndex++ < typesOrder.length && sentence.find(item => item.type === typesOrder[newIndex]) === undefined) { }

            setTypeIndex(newIndex)
            setIncorrectType(null)

            setButtons(prevButtons => {
              const newButtons = [...prevButtons];
              newButtons[index] = {
                ...newButtons[index],
                drawType: true,
                state: ButtonState.correct
              };
              return newButtons;
            });

          } else {
            setIncorrectType([targetType?.type || "", button.text, button.type || ""])
          }
        }}
      />
      {
        targetType?.type &&
        <>
          <TargetTypeDisplay text='Vyber' />
          <WordTypeCard
            wordType={GetWordTypeByAbbr(targetType?.type)}
            index={0}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
          />
          <PlayfulButton
            title="Potřebuju poradit"
            onPress={() => {
              alert('This will display tutorial sooner or later')
            }}
          />
        </>
      }
      {
        !targetType?.type &&
        <>
          <ThemedText>Tutoriál dokončen</ThemedText>
          <PlayfulButton
            title="Zkusit znovu"
            onPress={() => {
              setTypeIndex(0);
              setButtons(sentence.map((item) => ({
                text: item.text,
                type: item.type,
                drawType: false,
                state: ButtonState.default
              })));
              setIncorrectType(null);;
            }}
          />
        </>
      }

      <ModalWrapper
        visible={!!incorrectType}
        onClose={() => setIncorrectType(null)}
      >
        <ThemedText>To není správně. Odpověď pro slovo {incorrectType && incorrectType[1]} je: {incorrectType && incorrectType[2]} a ne {incorrectType && incorrectType[0]}</ThemedText>
        <PlayfulButton
          title="Tutoriál"
          onPress={() => {
            alert('This will display tutorial sooner or later')
          }}
        />
      </ModalWrapper>
    </PageWrapper>
  )
}