/**
 * DataSource
 * @description The data source for the question generator.
 */
export enum DataSource {
  ALL, PAP, PK, PU, D
}

/**
 * QuestionType
 * @description The question type for the question generator.
 * @value MARK_WORDS: Mark the words by types in the sentence.
 * @value MARK_TYPES: Mark the types by words in the sentence.
 * @value MARK_TYPE_ONE_WORD: Mark the type of the one word in the sentence by index.
 * @value MARK_WORDS_ALL_TYPES: Mark the words by types in the sentence with all type options.
 * @value SELECT_MULTIPLE: Select multiple words in the options, not based on any sentence. Uses the types.json file.
 * @value SELECT_MULTIPLE_W_SENTENCE: Select multiple words in the sentence.
 * @value SELECT_ONE_W_SENTENCE: Select one word in the sentence.
 * @value SELECT_TYPE: Select the type of the word in the short sentence by index.
 */
export enum QuestionType {
  MARK_WORDS,
  MARK_TYPES,
  MARK_TYPE_ONE_WORD,
  MARK_WORDS_ALL_TYPES,
  SELECT_MULTIPLE,
  SELECT_MULTIPLE_W_SENTENCE,
  SELECT_ONE_W_SENTENCE, SELECT_TYPE
}


/**
 * DataSourceModifier
 * @description The data source modifier for the question generator.
 */
export enum DataSourceModifier {
  SENTENCE_CONTAINS_PK, SENTENCE_CONTAINS_PT, SENTENCE_CONTAINS_PU
}

/**
 * QuestionModifier
 * @description The question modifier for the question generator.
 */
export enum QuestionModifier {
  ONLY_PO, ONLY_PR, ONLY_PT, ONLY_PKS, ONLY_PKN, ONLY_PU, ACCEPT_D, CHANGE_TO_MULTIPLE_IF_NEEDED
}

/**
 * Galaxy
 * @description The galaxy for the question generator.
 */
export enum Galaxy {
  ALL, PAP, PK, PU, D
}

/**
 * GeneratorParams
 * @description The generator params for the question generator.
 */
export enum GeneratorParam {
  WEIGHT, DATA_SOURCE, QUESTION_TYPE, DATA_SOURCE_MODIFIER, QUESTION_MODIFIER
}

// Structure of the question generator params
// 1. Weight of the input
// 2. DataSource
// 3. QuestionType
// 4. DataSourceModifier Array (optional)
// 5. QuestionModifier Array (optional)

/**
 * Question generator params
 * 
 * @description This is the question generator params for the question generator. Separated by GALAXY => ALL, PAP, PK, PU, D.
 * @description The first (number) is the weight of the input.
 * @description The second (enum) is the data source.
 * @description The third (enum) is the question type.
 * @description The fourth (array) is the data source modifier. (optional)
 * @description The fifth (array) is the question modifier. (optional)
 */
export let questionGeneratorParams = [
  // All GALAXY (will also include PAP, PK, PU at low probability)
  [
    [10, DataSource.ALL, QuestionType.MARK_WORDS],
    [10, DataSource.ALL, QuestionType.MARK_TYPES],
    [10, DataSource.ALL, QuestionType.MARK_WORDS_ALL_TYPES],
    [10, DataSource.ALL, QuestionType.SELECT_MULTIPLE_W_SENTENCE],
    [0, DataSource.ALL, QuestionType.SELECT_ONE_W_SENTENCE],
  ],
  // PAP GALAXY
  [
    [1, DataSource.ALL, QuestionType.MARK_TYPES, [], [QuestionModifier.ONLY_PO, QuestionModifier.ONLY_PR]],
    [1, DataSource.ALL, QuestionType.MARK_TYPES, [DataSourceModifier.SENTENCE_CONTAINS_PT], [QuestionModifier.ONLY_PO, QuestionModifier.ONLY_PR, QuestionModifier.ONLY_PT]],
    [1, DataSource.ALL, /*QuestionType.SELECT_ONE_W_SENTENCE*/ QuestionType.SELECT_MULTIPLE_W_SENTENCE, [], [QuestionModifier.ONLY_PO, QuestionModifier.ONLY_PR]],
    [1, DataSource.ALL, /*QuestionType.SELECT_ONE_W_SENTENCE*/ QuestionType.SELECT_MULTIPLE_W_SENTENCE, [DataSourceModifier.SENTENCE_CONTAINS_PT], [QuestionModifier.ONLY_PO, QuestionModifier.ONLY_PR, QuestionModifier.ONLY_PT]],
    [1, DataSource.PAP, /*QuestionType.SELECT_ONE_W_SENTENCE*/ QuestionType.SELECT_MULTIPLE_W_SENTENCE, [], [QuestionModifier.ONLY_PO, QuestionModifier.ONLY_PT, QuestionModifier.CHANGE_TO_MULTIPLE_IF_NEEDED]],
    [0, DataSource.PAP, QuestionType.SELECT_TYPE, [], [QuestionModifier.ONLY_PO, QuestionModifier.ONLY_PT]],
    [1, DataSource.PAP, QuestionType.MARK_WORDS]
  ],
  // PK GALAXY
  [
    [0, DataSource.PK, QuestionType.SELECT_TYPE, [], [QuestionModifier.ONLY_PKS, QuestionModifier.ONLY_PKN]],
    [1, DataSource.PK, QuestionType.SELECT_MULTIPLE, [], [QuestionModifier.ONLY_PKS, QuestionModifier.ONLY_PKN]],
    [1, DataSource.ALL, QuestionType.MARK_TYPE_ONE_WORD, [DataSourceModifier.SENTENCE_CONTAINS_PK], [QuestionModifier.ONLY_PKS, QuestionModifier.ONLY_PKN]],
    [1, DataSource.ALL, QuestionType.MARK_WORDS, [DataSourceModifier.SENTENCE_CONTAINS_PK]],
    [1, DataSource.ALL, /*QuestionType.SELECT_ONE_W_SENTENCE*/ QuestionType.SELECT_MULTIPLE_W_SENTENCE, [DataSourceModifier.SENTENCE_CONTAINS_PK], [QuestionModifier.ONLY_PKS, QuestionModifier.ONLY_PKN]],
  ],
  // PU GALAXY
  [
    [0, DataSource.PU, QuestionType.SELECT_TYPE, [], [QuestionModifier.ONLY_PU]],
    [1, DataSource.PU, QuestionType.SELECT_MULTIPLE, [], [QuestionModifier.ONLY_PU]],
    [1, DataSource.ALL, QuestionType.MARK_TYPE_ONE_WORD, [DataSourceModifier.SENTENCE_CONTAINS_PU], [QuestionModifier.ONLY_PU]],
    [1, DataSource.ALL, QuestionType.MARK_WORDS, [DataSourceModifier.SENTENCE_CONTAINS_PU]],
    [1, DataSource.ALL, /*QuestionType.SELECT_ONE_W_SENTENCE*/ QuestionType.SELECT_MULTIPLE_W_SENTENCE, [DataSourceModifier.SENTENCE_CONTAINS_PU], [QuestionModifier.ONLY_PU]],
  ],
  // D GALAXY
  [
    [1, DataSource.D, QuestionType.MARK_WORDS],
    [1, DataSource.D, QuestionType.MARK_TYPES],
    [1, DataSource.D, QuestionType.MARK_WORDS_ALL_TYPES, [], [QuestionModifier.ACCEPT_D]],
    [1, DataSource.D, /*QuestionType.SELECT_ONE_W_SENTENCE*/ QuestionType.SELECT_MULTIPLE_W_SENTENCE, [], [QuestionModifier.ACCEPT_D]],
  ]
]

