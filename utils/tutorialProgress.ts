type TutorialStep<TType extends string = string> = {
  type: TType;
};

type SentenceWord<TType extends string = string> = {
  type: TType;
};

const getPresentTutorialIndexes = <TType extends string>(
  sentence: SentenceWord<TType>[],
  tutorialTypesOrder: TutorialStep<TType>[],
): number[] => {
  const sentenceTypes = new Set(sentence.map((word) => word.type));

  return tutorialTypesOrder.reduce<number[]>((indexes, step, index) => {
    if (sentenceTypes.has(step.type)) {
      indexes.push(index);
    }

    return indexes;
  }, []);
};

export const findNextTutorialTypeIndex = <TType extends string>(
  sentence: SentenceWord<TType>[],
  fromIndex: number,
  tutorialTypesOrder: TutorialStep<TType>[],
): number => {
  const sentenceTypes = new Set(sentence.map((word) => word.type));

  for (let index = Math.max(0, fromIndex); index < tutorialTypesOrder.length; index += 1) {
    if (sentenceTypes.has(tutorialTypesOrder[index].type)) {
      return index;
    }
  }

  return tutorialTypesOrder.length;
};

export const getTutorialProgress = <TType extends string>(
  sentence: SentenceWord<TType>[],
  typeIndex: number,
  tutorialTypesOrder: TutorialStep<TType>[],
) => {
  const presentIndexes = getPresentTutorialIndexes(sentence, tutorialTypesOrder);
  const completed = presentIndexes.filter((index) => index < typeIndex).length;

  return {
    completed: Math.min(completed, presentIndexes.length),
    total: presentIndexes.length,
  };
};

export const getTutorialProgressText = <TType extends string>(
  sentence: SentenceWord<TType>[],
  typeIndex: number,
  tutorialTypesOrder: TutorialStep<TType>[],
): string => {
  const { completed, total } = getTutorialProgress(sentence, typeIndex, tutorialTypesOrder);

  return `${completed}/${total}`;
};
