import { QuestionType } from "./questionGeneratorParams";


export const hints: Record<QuestionType, string[]> = {
  [QuestionType.MARK_WORDS]: [
    "Cílem této minihry je přiřadit správné typy ke slovům. " +
    "A to tím, že klikneš na správný typ právě označeného slova.",

    "Nejdříve si urči typ prvního slova a poté klikni na správný typ ze spodní nabídky. " + 
    "Pokud si nejsi jistý, dlouhým podržením tlačítka s typem se ti zobrazí vysvětlení"
  ],
  [QuestionType.MARK_TYPES]: [
    "Cílem této minihry je přiřadit správná slova k typům. " +
    "A to tím, že klikneš na vhodné slovo pro právě označený typ.",

    "Nejdříve vyber vhodné slovo pro první typ a poté klikni na správný ze spodní nabídky. " + 
    "Pokud si nejsi jistý, dlouhým podržením tlačítka s typem se ti zobrazí vysvětlení"
  ],
  [QuestionType.MARK_TYPE_ONE_WORD]: [
    "Hledejte slovo, které odpovídá zadanému typu.",
    "Použijte kontext věty k určení správného slova."
  ],
  [QuestionType.MARK_WORDS_ALL_TYPES]: [
    "Hledejte slova, která odpovídají různým typům.",
    "Použijte kontext věty k určení správných slov."
  ],
  [QuestionType.SELECT_MULTIPLE]: [
    "Zaměřte se na vztah mezi nabízenými možnostmi.",
    "Pečlivě zvažte všechny možné odpovědi."
  ],
  [QuestionType.SELECT_MULTIPLE_W_SENTENCE]: [
    "Hledejte slova, která odpovídají danému typu.",
    "Použijte kontext věty k určení správných slov."
  ],
  [QuestionType.SELECT_ONE_W_SENTENCE]: [
    "Hledejte slovo, které odpovídá danému typu.",
    "Použijte kontext věty k určení správného slova."
  ],
  [QuestionType.SELECT_TYPE]: [
    "Hledejte typy, které odpovídají danému typu.",
    "Použijte kontext věty k určení správného typu."
  ],
}