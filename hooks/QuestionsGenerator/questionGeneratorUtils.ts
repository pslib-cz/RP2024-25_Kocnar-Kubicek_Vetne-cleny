import { DataSourceModifier, GeneratorParam, QuestionModifier } from "@/constants/questionGeneratorParams";

export function isTypeAllowed(bitfield: number, type: number) {
  return (bitfield & (1 << type)) !== 0;
}

// Utility: Deterministic shuffle
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function isValidTemplate(template: any[]): boolean {
  return (
    Array.isArray(template) &&
    template.length > GeneratorParam.QUESTION_TYPE &&
    typeof template[GeneratorParam.DATA_SOURCE] === 'number' &&
    typeof template[GeneratorParam.QUESTION_TYPE] === 'number' &&
    template[GeneratorParam.WEIGHT] > 0
  );
}

// DataSourceModifier filter logic
export function applyDataSourceModifiers(sentences: string[][], modifiers: DataSourceModifier[] | undefined): string[][] {
  if (!modifiers || !Array.isArray(modifiers) || modifiers.length === 0) return sentences;
  return sentences.filter(sentence => {
    // Each modifier must be satisfied (AND logic)
    return modifiers.every(mod => {
      switch (mod) {
        case DataSourceModifier.SENTENCE_CONTAINS_PK:
          // At least one word with type 'pks' or 'pkn'
          return sentence.some(item => Array.isArray(item) && (item[1] === 'pks' || item[1] === 'pkn'));
        case DataSourceModifier.SENTENCE_CONTAINS_PT:
          // At least one word with type 'pt'
          return sentence.some(item => Array.isArray(item) && item[1] === 'pt');
        case DataSourceModifier.SENTENCE_CONTAINS_PU:
          // At least one word with type starting with 'pu'
          return sentence.some(item => Array.isArray(item) && typeof item[1] === 'string' && item[1].startsWith('pu'));
        default:
          return true;
      }
    });
  });
}

// QuestionModifier filter logic for ONLY_<type>
export function applyOnlyTypeModifiers(sentences: string[][], modifiers: QuestionModifier[] | undefined): string[][] {
  if (!modifiers || !Array.isArray(modifiers) || modifiers.length === 0) return sentences;
  // Find all ONLY_... modifiers
  const onlyTypes = modifiers
    .filter(mod => typeof mod === 'number' && [
      QuestionModifier.ONLY_PO,
      QuestionModifier.ONLY_PR,
      QuestionModifier.ONLY_PT,
      QuestionModifier.ONLY_PKS,
      QuestionModifier.ONLY_PKN,
      QuestionModifier.ONLY_PU
    ].includes(mod))
    .map(mod => {
      switch (mod) {
        case QuestionModifier.ONLY_PO: return 'po';
        case QuestionModifier.ONLY_PR: return 'př';
        case QuestionModifier.ONLY_PT: return 'pt';
        case QuestionModifier.ONLY_PKS: return 'pks';
        case QuestionModifier.ONLY_PKN: return 'pkn';
        case QuestionModifier.ONLY_PU: return 'pu';
        default: return null;
      }
    })
    .filter(Boolean);
  if (onlyTypes.length === 0) return sentences;
  // Sentence must contain at least one of the required types (OR logic)
  return sentences.filter(sentence =>
    sentence.some(item => Array.isArray(item) && onlyTypes.some(type => item[1] === type || (type === 'pu' && typeof item[1] === 'string' && item[1].startsWith('pu'))))
  );
}

// Helper to get WANTED types from QuestionModifiers
export function getWantedTypesFromModifiers(modifiers: QuestionModifier[] | undefined): string[] | undefined {
  if (!modifiers || !Array.isArray(modifiers) || modifiers.length === 0) return undefined;
  const onlyTypes = modifiers
    .filter(mod => typeof mod === 'number' && [
      QuestionModifier.ONLY_PO,
      QuestionModifier.ONLY_PR,
      QuestionModifier.ONLY_PT,
      QuestionModifier.ONLY_PKS,
      QuestionModifier.ONLY_PKN,
      QuestionModifier.ONLY_PU,
      QuestionModifier.ACCEPT_D
    ].includes(mod))
    .map(mod => {
      switch (mod) {
        case QuestionModifier.ONLY_PO: return 'po';
        case QuestionModifier.ONLY_PR: return 'př';
        case QuestionModifier.ONLY_PT: return 'pt';
        case QuestionModifier.ONLY_PKS: return 'pks';
        case QuestionModifier.ONLY_PKN: return 'pkn';
        case QuestionModifier.ONLY_PU: return 'pu';
        case QuestionModifier.ACCEPT_D: return 'd';
        default: return null;
      }
    })
    .filter(Boolean);
  if (onlyTypes.length === 0) return undefined;
  return onlyTypes as string[];
}