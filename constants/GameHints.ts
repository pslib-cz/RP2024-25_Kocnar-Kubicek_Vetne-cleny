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
    "Vyber správná slova ze spodní nabídky. ",
    "Pečlivě zvaž všechna slova na výběr, které odpovídají otázce. Tato slova netvoří větu, pocházejí z různých vět. " + 
    "Může být více možností!",
    "Pokud si nejsi jistý zkratkami, dlouhým podržením tlačítka se ti zobrazí celý název členu"
  ],
  [QuestionType.SELECT_MULTIPLE_W_SENTENCE]: [
    "Vyber správná slova ze spodní nabídky. ",
    "Pečlivě zvaž všechna slova na výběr, které odpovídají otázce. " + 
    "Může být více možností!",
    "Pokud si nejsi jistý zkratkami, dlouhým podržením tlačítka se ti zobrazí celý název členu"
  ],
  [QuestionType.SELECT_ONE_W_SENTENCE]: [
    "Vyber správné slovo ze spodní nabídky. ",
    "Pečlivě vyber jednu správnou možnost, která odpovídá otázce. ",
    "Je pouze jedna správná odpověď!",
    "Pokud si nejsi jistý zkratkami, dlouhým podržením tlačítka se ti zobrazí celý název členu"
  ],
  [QuestionType.SELECT_TYPE]: [
    "Vyber správný člen ze spodní nabídky. ",
    "Pečlivě vyber jednu správnou možnost, která odpovídá otázce. ",
    "Je pouze jedna správná odpověď!",
    "Pokud si nejsi jistý zkratkami, dlouhým podržením tlačítka se ti zobrazí celý název členu"
  ],
}