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
import { LayoutAnimation, StyleSheet, View, ScrollView } from "react-native";
import { WordTypeCard } from "./anotherTutorial";
import { GetWordTypeByAbbr } from "@/constants/WordTypeDefinitions";
import PageWrapper from "@/components/PageWrapper";
import ModalWrapper from "@/components/modals/ModalWrapper";
import { WordButtonType } from "@/types/games/WordButtonType";
import { MaterialIcons } from '@expo/vector-icons';
import { useTutorialContext } from "@/contexts/TutorialContext";
import { useRouter } from "expo-router";

const tutorialSentence: WordSelectionOption[] = [
  { text: "Bílá", type: "pks" },
  { text: "kočka", type: "po" },
  { text: "s flíčky", type: "pkn" },
  { text: "včera", type: "puč" },
  { text: "na zahradě", type: "pum" },
  { text: "z hladu", type: "pu příčiny" },
  { text: "velmi", type: "pu míry" },
  { text: "obratně", type: "puz" },
  { text: "ulovila", type: "př" },
  { text: "myš", type: "pt" }
]

const tutorialTypesOrder: { type: WordType, explanation: string }[] = [
  { type: "po", explanation: "Podmět – kdo nebo co vykonává děj ve větě." },
  { type: "př", explanation: "Přísudek – co podmět dělá nebo co se s ním děje." },
  { type: "pt", explanation: "Předmět – koho nebo co se děj týká." },
  { type: "pks", explanation: "Přívlastek shodný – rozvíjí podstatné jméno a shoduje se s ním v pádě, čísle a rodě." },
  { type: "pkn", explanation: "Přívlastek neshodný – rozvíjí podstatné jméno, ale neshoduje se s ním v pádě, čísle a rodě." },
  { type: "puč", explanation: "Příslovečné určení času – vyjadřuje, kdy se děj odehrává." },
  { type: "pum", explanation: "Příslovečné určení místa – vyjadřuje, kde se děj odehrává." },
  { type: "pu příčiny", explanation: "Příslovečné určení příčiny – vyjadřuje, proč se děj odehrává." },
  { type: "pu míry", explanation: "Příslovečné určení míry – vyjadřuje, v jaké míře nebo intenzitě se děj odehrává." },
  { type: "puz", explanation: "Příslovečné určení způsobu – vyjadřuje, jakým způsobem se děj odehrává." }
];

export default function SentenceExample() {
  const { targetType, setTargetType } = useLevelContext();
  const [typeIndex, setTypeIndex] = React.useState(0)
  const [incorrectType, setIncorrectType] = React.useState<string[] | null>(null)
  const [buttons, setButtons] = useState<WordButtonType[]>([]);

  const { setSentence, setWordId, reset } = useTutorialContext();

  const router = useRouter();

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
    setTargetType(tutorialTypesOrder[typeIndex]?.type)
    console.log('Target type set to:', tutorialTypesOrder[typeIndex]?.type);
  }, [typeIndex])

  const getProgressText = () => {
    const completed = typeIndex;
    const total = tutorialTypesOrder.length;
    return `${completed}/${total}`;
  };

  const OpenTutorialOnCurrentWord = () => {
    setSentence(tutorialSentence);
    setWordId(tutorialSentence.findIndex(item => item.type === targetType?.type));
    router.push('/tutorial');
    reset()
  };

  return (
    <PageWrapper>
      <View style={styles.headerRow}>
        <ThemedText style={styles.heading}>Výukový příklad</ThemedText>
        <View style={styles.progressContainer}>
          <ThemedText style={styles.progressText}>{getProgressText()}</ThemedText>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Completion Section */}
        {!targetType?.type && (
          <View style={styles.completionSection}>
            <View style={styles.completionContainer}>
              <MaterialIcons name="check-circle" size={48} color="#4CAF50" style={styles.completionIcon} />
              <ThemedText style={styles.completionTitle}>Skvěle!</ThemedText>
              <ThemedText style={styles.completionText}>Tutoriál byl úspěšně dokončen.</ThemedText>

              <View style={styles.buttonContainer}>
                <PlayfulButton
                  title="Zkusit znovu"
                  icon={<MaterialIcons name="refresh" size={22} color="white" />}
                  onPress={() => {
                    setTypeIndex(0);
                    setButtons(buildButtons(tutorialSentence));
                    setIncorrectType(null);
                  }}
                  style={styles.restartButton}
                />
              </View>
            </View>
          </View>
        )}

        {/* Current Task Section */}
        {targetType?.type && (
          <View style={styles.taskSection}>

            <TargetTypeDisplay text='Vyber' />

            <View style={[styles.explanationContainer, { borderColor: GetWordTypeByAbbr(targetType.type)?.color || '#4CAF50' }]}>
              <ThemedText style={styles.explanationText}>
                {tutorialTypesOrder[typeIndex]?.explanation}
              </ThemedText>
            </View>
          </View>
        )}

        {/* Sentence Container */}
        <View style={styles.sentenceContainer}>
          <WordButtonsContainer
            buttons={buttons}
            showTooltip={false}
            longPress={() => { }}
            onClick={(button, index) => {

              if (!targetType?.type) {
                return
              }

              if (button.type === targetType?.type) {
                let newIndex = typeIndex + 1;
                while (newIndex < tutorialTypesOrder.length &&
                  tutorialSentence.find(item => item.type === tutorialTypesOrder[newIndex].type) === undefined) {
                  newIndex++;
                }

                setTypeIndex(newIndex);
                setIncorrectType(null);

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
        </View>

        {targetType?.type && (
          <View style={styles.buttonContainer}>
            <PlayfulButton
              title="Potřebuju poradit"
              icon={<MaterialIcons name="help-outline" size={22} color="white" />}
              onPress={OpenTutorialOnCurrentWord}
              variant="secondary"
              style={styles.helpButton}
            />
          </View>
        )}
      </ScrollView>

      {/* Error Modal */}
      <ModalWrapper
        visible={!!incorrectType}
        onClose={() => setIncorrectType(null)}
      >
        <View style={styles.modalContent}>
          <MaterialIcons name="error-outline" size={32} color="#f44336" style={styles.modalIcon} />
          <ThemedText style={styles.modalTitle}>Nepřesná odpověď</ThemedText>
          <ThemedText style={styles.modalText}>
            Slovo "{incorrectType && incorrectType[1]}" je typu "{incorrectType && incorrectType[2]}",
            ne "{targetType && targetType.type}".
          </ThemedText>
          <View style={styles.modalButtonContainer}>
            <PlayfulButton
              title="Tutoriál"
              icon={<MaterialIcons name="school" size={22} color="white" />}
              onPress={OpenTutorialOnCurrentWord}
              style={styles.modalButton}
              variant="secondary"
            />
          </View>
        </View>
      </ModalWrapper>
    </PageWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101223',
  },
  content: {
    padding: 20,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  heading: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  progressContainer: {
    backgroundColor: '#1c1f3d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    marginBottom: 24,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#1c1f3d',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  sentenceContainer: {
    backgroundColor: '#1c1f3d',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sentenceLabel: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '600',
  },
  taskSection: {
    marginBottom: 24,
  },
  explanationContainer: {
    backgroundColor: '#1c1f3d',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    marginTop: 16,
  },
  explanationText: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  helpButton: {
    marginVertical: 4,
  },
  completionSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  completionContainer: {
    backgroundColor: '#1c1f3d',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    width: '100%',
  },
  completionIcon: {
    marginBottom: 16,
  },
  completionTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  completionText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  restartButton: {
    marginVertical: 4,
  },
  modalContent: {
    alignItems: 'center',
    padding: 8,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  modalButton: {
    marginVertical: 4,
  },
});