


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
import { WordButtonType } from "@/types/games/WordButtonType";

const tutorialSentence: WordSelectionOption[] = [
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
]

const tutorialTypesOrder: {type: WordType, explanation: string}[] = [
  {type: "po", explanation: "Podmět – kdo nebo co vykonává děj ve větě."},
  {type: "př", explanation: "Přísudek – co podmět dělá nebo co se s ním děje."},
  {type: "pt", explanation: "Předmět – koho nebo co se děj týká."},
  {type: "pks", explanation: "Přívlastek shodný – rozvíjí podstatné jméno a shoduje se s ním v pádě, čísle a rodě."},
  {type: "pkn", explanation: "Přívlastek neshodný – rozvíjí podstatné jméno, ale neshoduje se s ním v pádě, čísle a rodě."},
  {type: "puč", explanation: "Příslovečné určení času – vyjadřuje, kdy se děj odehrává."},
  {type: "pum", explanation: "Příslovečné určení místa – vyjadřuje, kde se děj odehrává."},
  {type: "pu příčiny", explanation: "Příslovečné určení příčiny – vyjadřuje, proč se děj odehrává."},
  {type: "pu míry", explanation: "Příslovečné určení míry – vyjadřuje, v jaké míře nebo intenzitě se děj odehrává."},
  {type: "puz", explanation: "Příslovečné určení způsobu – vyjadřuje, jakým způsobem se děj odehrává."}
];

export default function SentenceExample() {
  const { targetType, setTargetType } = useLevelContext();
  const [typeIndex, setTypeIndex] = React.useState(0)
  const [incorrectType, setIncorrectType] = React.useState<string[] | null>(null)
  const [buttons, setButtons] = useState<WordButtonType[]>([]);

  function buildButtons(sentence: WordSelectionOption[]): WordButtonType[] {
    return sentence.map((item) => ({
      text: item.text,
      type: item.type,
      drawType: false,
      state: ButtonState.default
    }));
  }

  useEffect(() => {
    setButtons(buildButtons(tutorialSentence));
  }, []);

  useEffect(() => {
    setTargetType(tutorialTypesOrder[typeIndex].type)
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
      <ThemedText>{tutorialTypesOrder[typeIndex].explanation}</ThemedText>
      <WordButtonsContainer
        buttons={buttons}
        showTooltip={false}
        longPress={() => { }}
        onClick={(button, index) => {
          if (button.type === targetType?.type) {
            let newIndex = typeIndex
            while (newIndex++ < tutorialTypesOrder.length && tutorialSentence.find(item => item.type === tutorialTypesOrder[newIndex].type) === undefined) { }

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
              setButtons(buildButtons(tutorialSentence));
              setIncorrectType(null);
            }}
          />
        </>
      }

      <ModalWrapper
        visible={!!incorrectType}
        onClose={() => setIncorrectType(null)}
      >
        <ThemedText>To není správně. Odpověď pro slovo {incorrectType && incorrectType[1]} je: {incorrectType && incorrectType[2]} a ne {targetType && targetType.type }</ThemedText>
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