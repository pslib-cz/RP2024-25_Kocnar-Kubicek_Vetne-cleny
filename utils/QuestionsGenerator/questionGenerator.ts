import { questionGeneratorParams, QuestionType, Galaxy, GeneratorParam, DataSource, DataSourceModifier, QuestionModifier } from "@/constants/questionGeneratorParams";
import { useLoadedData } from "@/hooks/useData";
import { WordSelectionOption } from "@/types/games/SelectionOption";
import { useMemo } from "react";
import { applyDataSourceModifiers, applyOnlyTypeModifiers, getWantedTypesFromModifiers, isTypeAllowed, isValidTemplate, seededShuffle } from "./questionGeneratorUtils";
import { WordType } from "@/types/WordTypes";
import { Question } from "@/types/Question";

// Utility: Map QuestionType enum to bit positions
const QUESTION_TYPE_VALUES = Object.values(QuestionType).filter(v => typeof v === 'number') as number[];

/**
 * Question Generator Hook
 * 
 * This hook generates questions based on provided parameters:
 * - galaxy: The galaxy to generate questions for (ALL, PAP, PK, PU, D)
 * - difficulty: A number between 0-1 indicating question difficulty
 * - seed: Random seed for deterministic generation
 * - count: Number of questions to generate
 * - questionTypesBitfield: Bitfield indicating allowed question types
 * 
 * Questions are generated deterministically based on the seed, allowing
 * for reproducible question sets while maintaining randomness.
 * 
 * @returns Array of generated questions based on the input parameters
 */

export function questionGenerator({
  galaxy,
  difficulty,
  seed,
  count,
  questionTypesBitfield
}: {
  galaxy: Galaxy,
  difficulty: number,
  seed: number,
  count: number,
  questionTypesBitfield: number
}) {
  // Get loaded data
  const { loadedSets, loadedTypeSets } = useLoadedData();
  // Get templates for the selected galaxy
  const templates = questionGeneratorParams[galaxy];

  // Filter templates by allowed question types
  const allowedTemplates = templates.filter(tpl => {
    if (!isValidTemplate(tpl)) return false;
    return isTypeAllowed(questionTypesBitfield, tpl[GeneratorParam.QUESTION_TYPE] as number);
  });

  // Shuffle and pick templates
  const pickedTemplates = () => {
    if (allowedTemplates.length === 0) return [];
    // For each question, pick a pseudo-random template from allowedTemplates
    return Array.from({ length: count }, (_, i) => {
      return seededShuffle(allowedTemplates, seed + i)[0];
    });
  };

  // Generate questions
  const questions = () => {

    const templates = pickedTemplates();

    if(templates == undefined) throw new Error("No templates available for the selected parameters");

    return templates.map((template, idx) => {
      const dataSource = template[GeneratorParam.DATA_SOURCE] as DataSource;
      const questionType = template[GeneratorParam.QUESTION_TYPE] as QuestionType;
      const dataSourceModifiers = template[GeneratorParam.DATA_SOURCE_MODIFIER] as DataSourceModifier[] | undefined;
      const questionModifiers = template[GeneratorParam.QUESTION_MODIFIER] as QuestionModifier[] | undefined;

      // Special logic for SELECT_MULTIPLE
      if (questionType === QuestionType.SELECT_MULTIPLE) {
        let options: [string, string][] = [];
        if (dataSource === DataSource.PK) {
          // All pks and pkn words
          const pks = (loadedTypeSets['pks'] || []).map((w: string) => [w, 'pks'] as [string, string]);
          const pkn = (loadedTypeSets['pkn'] || []).map((w: string) => [w, 'pkn'] as [string, string]);
          options = [...pks, ...pkn];
        } else if (dataSource === DataSource.PU) {
          // All pu... words
          options = Object.entries(loadedTypeSets)
            .filter(([type]) => type.startsWith('pu'))
            .flatMap(([type, words]) => words.map((w: string) => [w, type] as [string, string]));
        } else {
          // Not supported
          return null;
        }
        // Number of options based on difficulty
        const numOptions = Math.max(4, Math.min(10, Math.round(4 + difficulty * 6)));
        const shuffledOptions = seededShuffle(options, seed + idx).slice(0, numOptions);
        const wanted = shuffledOptions[(seed + idx) % shuffledOptions.length][1];
        return {
          SOURCE: shuffledOptions.map(([word, type]) => ({text: word, type: type})),
          TEMPLATE: template,
          WANTED: wanted
        };
      }

      // Standard logic for other types
      const raw = loadedSets[dataSource];
      // Flatten and filter as before
      let set: string[][] = raw
        .filter((sentence: any) => Array.isArray(sentence) && sentence.every((item: any) => Array.isArray(item) && item.length >= 2 && typeof item[0] === 'string' && typeof item[1] === 'string'));
      // Apply DataSourceModifiers
      set = applyDataSourceModifiers(set, dataSourceModifiers);
      // Apply QuestionModifiers (ONLY_...)
      set = applyOnlyTypeModifiers(set, questionModifiers);

      // Difficulty slicing logic
      const range = 0.25;
      const effectiveDifficulty = difficulty ?? 0;
      const minDiff = Math.max(0, effectiveDifficulty - range) * set.length;
      const maxDiff = Math.min(1, effectiveDifficulty + range) * set.length;
      const resultSet = set.slice(Math.floor(minDiff), Math.ceil(maxDiff));

      // Shuffle sentences pseudo-randomly by seed, then pick idx-th sentence
      const shuffledSentences = seededShuffle(resultSet, seed);
      const sentence = shuffledSentences[idx % shuffledSentences.length] || [];

      // Convert to [word, type][] only if both exist
      const source = sentence
        .filter((item: any) => Array.isArray(item) && item.length >= 2 && typeof item[0] === 'string' && typeof item[1] === 'string')
        .map((item: any) => {
            return {
                text: item[0],
                type: item[1],
            } as WordSelectionOption;
        });
      // Prepare output
      const out: any = {
        SOURCE: source,
        TEMPLATE: template
      };
      // For certain types, add INDEX
      if (
        questionType === QuestionType.MARK_TYPE_ONE_WORD ||
        questionType === QuestionType.SELECT_TYPE
      ) {
        if (questionModifiers?.includes(QuestionModifier.ONLY_PKN) && questionModifiers?.includes(QuestionModifier.ONLY_PKS)) {
            const availableIndexes = sentence.map((item: any, index: number) => (item[1] === 'pkn' || item[1] === 'pks') ? index : null).filter(a => a !== null);
            console.log("Available indexes: ", availableIndexes);
            out.INDEX = (availableIndexes.length > 0) ? availableIndexes[(seed * (idx + 1)) % availableIndexes.length] : 0;
        } else if (questionModifiers?.includes(QuestionModifier.ONLY_PKN)) {
            const availableIndexes = sentence.map((item: any, index: number) => (item[1] === 'pkn') ? index : null).filter(a => a !== null);
            out.INDEX = (availableIndexes.length > 0) ? availableIndexes[(seed * (idx + 1)) % availableIndexes.length] : 0;
        } else if (questionModifiers?.includes(QuestionModifier.ONLY_PKS)) {
            const availableIndexes = sentence.map((item: any, index: number) => (item[1] === 'pks') ? index : null).filter(a => a !== null);
            out.INDEX = (availableIndexes.length > 0) ? availableIndexes[(seed * (idx + 1)) % availableIndexes.length] : 0;
        } else if (questionModifiers?.includes(QuestionModifier.ONLY_PU))    {
            const availableIndexes = sentence.map((item: any, index: number) => (item[1].startsWith('pu')) ? index : null).filter(a => a !== null);
            out.INDEX = (availableIndexes.length > 0) ? availableIndexes[(seed * (idx + 1)) % availableIndexes.length] : 0;
        } else {
          out.INDEX = (sentence.length > 0) ? (seed * (idx + 1)) % sentence.length : 0;
        }
      }
      // For SELECT_MULTIPLE_W_SENTENCE and SELECT_ONE_W_SENTENCE, add WANTED
      if (
        questionType === QuestionType.SELECT_MULTIPLE_W_SENTENCE ||
        questionType === QuestionType.SELECT_ONE_W_SENTENCE
      ) {
        const wanted = getWantedTypesFromModifiers(questionModifiers)?.filter(a => source.some(b => b.type === a));
        if (wanted) {
          out.WANTED = wanted[(seed + idx) % wanted.length];
        } else {
          out.WANTED = sentence[(seed + idx) % sentence.length][1];
        }
      }
      return out;
    }).filter(Boolean) as {
      SOURCE: WordSelectionOption[];
      TEMPLATE: typeof questionGeneratorParams[number][number];
      WANTED?: string;
      INDEX?: number;
    }[];
  };

  const questionsad = questions() as Question[];

  console.log("Params: ", galaxy, difficulty, seed, count, questionTypesBitfield);
  console.log("Generated questions:", questionsad);

  return questionsad;
}



