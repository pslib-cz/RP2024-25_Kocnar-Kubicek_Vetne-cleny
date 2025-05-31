import { QuestionType } from "./questionGeneratorParams";


export const hints: Record<QuestionType, string[]> = {
  [QuestionType.MARK_WORDS]: [
    "Přiřad správné členy ke slovům z věty. ",

    "Nejdříve si v hlavě urči člen prvního slova nahoře a poté klikni na správný člen ze spodní nabídky. " +
    "Pak přejdi ke druhému slovu a opakuj. ",
    "Pokud si nejsi jistý zkratkami, dlouhým podržením tlačítka s členem se ti zobrazí celý název členu"
  ],
  [QuestionType.MARK_TYPES]: [
    "Přiřad správná slova k typům. ",

    "Nejdříve vyber vhodné slovo pro první člen věty nahoře a poté klikni na správné slovo z věty ze spodní nabídky. " + 
    "Pak přejdi ke druhému členu a opakuj. ",
    "Pokud si nejsi jistý zkratkami, dlouhým podržením tlačítka se člen věty zobrazí"
  ],
  [QuestionType.MARK_TYPE_ONE_WORD]: [
    "Přiřad správný členy ke slovu z věty. ",

    "Nejdříve si v hlavě urči člen zvýrazněného slova nahoře a poté klikni na správný člen ze spodní nabídky. ",
    "Pokud si nejsi jistý zkratkami, dlouhým podržením tlačítka s členem se ti zobrazí celý název členu"
  ],
  [QuestionType.MARK_WORDS_ALL_TYPES]: [
    "Přiřad správné členy ke slovům z věty. ",

    "Nejdříve si v hlavě urči člen prvního slova nahoře a poté klikni na správný člen ze spodní nabídky. " +
    "Pak přejdi ke druhému slovu a opakuj. ",
    "Pokud si nejsi jistý zkratkami, dlouhým podržením tlačítka s členem se ti zobrazí celý název členu"
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