import { WordType } from "@/types/WordTypes";

interface WordTypeExplanation {
  name: string;
  abbr?: WordType;
  color?: string;
  type?: 'Základní větný člen' | 'Rozvíjející větný člen';
  explanation?: string[];
  highlitedExplanation?: string[];
  examples?: Example[];
  types?: WordTypeTypeExplanation[];
}

interface WordTypeTypeExplanation{
  name: string;
  explanation: string[];
  abbr?: WordType;
    color?: string;
  examples: Example[];
}

interface Example{
  sentence: string;
  highlightedSection: string;
  explanation?: string;
}

export const WordTypes: WordTypeExplanation[] = [
  {
    name: 'podmět',
    abbr: 'po',
    color: '#4A90E2',
    type: 'Základní větný člen',
    explanation: [
      "Ptáme se prvním pádem „Kdo? Co?“",
      "Jakýkoli slovní druh (nejčastěji podstatné jméno a zájmeno)",
      "Původce děje nebo nositel vlastnosti"
    ],
    types: [
      {
        name: 'Vyjádřený',
        explanation: [
          "Objevuje se přímo ve větě"
        ],
        examples: [
          {
            sentence: "Kočka předla.",
            highlightedSection: "Kočka"
          }
        ]
      },
      {
        name: 'Nevyjádřený',
        explanation: [
          "není ve větě přímo vyjádřen, ale známe ho z kontextu nebo předešlé věty"
        ],
        examples: [
          {
            sentence: "Předla. (ona)",
            highlightedSection: "ona"
          }
        ]
      }
    ]
  },
  {
    name: 'přísudek',
    abbr: 'př',
    color: '#50C878',
    type: 'Základní větný člen',
    explanation: [
      "Ptáme se: „Co se ve větě děje? Co podmět dělá?“",
      "Vyjadřuje činnost podmětu nebo mu přisuzuje vlastnost",
      "Nejčastěji je to sloveso v určitém tvaru (poznáme osobu, číslo, způsob a čas) nebo sponové sloveso (být, stát se, stávat se …) se jménem (podstatné, přídavné, …)"
    ],
    types: [
      {
        name: 'Slovesný jednoduchý',
        explanation: [
          "tvoří jedno sloveso v určitém tvaru"
        ],
        examples: [
          {
            sentence: "Petr spí.",
            highlightedSection: "spí"
          }
        ]
      },
      {
        name: 'Slovesný složený',
        explanation: [
          "tvoří sloveso způsobové/fázové (muset, moci, chtít, začít) a infinitiv"
        ],
        examples: [
          {
            sentence: "Petr chce spát.",
            highlightedSection: "chce spát"
          }
        ]
      },
      {
        name: 'Jmenný se sponou',
        explanation: [
          "tvoří sponové sloveso (být, stát se, stávat se, …) a jméno (podstatné a přídavné jméno, zájmeno, číslovka)"
        ],
        examples: [
          {
            sentence: "Petr byl ospalý.",
            highlightedSection: "byl ospalý"
          }
        ]
      }
    ]
  },
  {
    name: 'předmět',
    abbr: 'pt',
    color: '#6C5CE7',  // Soft purple
    type: 'Rozvíjející větný člen',
    explanation: [
      "Ptáme se pádovými otázkami (mimo 1. a 5.)",
      "Vždy závislý na slovese (určuje jeho pád)",
      "Nejčastěji podstatné jméno a zájmeno, ale i infinitiv"
    ],
    highlitedExplanation: [
      "POZOR! Zaměňuje se s podmětem -> musíme se zeptat pádovou otázkou! "
    ],
    examples: [
      {
        sentence: "tu knihu",
        highlightedSection: "tu knihu"
      },
      {
        sentence: "daruji jí květinu",
        highlightedSection: "jí květinu"
      },
      {
        sentence: "Není mi dobře.",
        highlightedSection: "mi",
        explanation: "Komu není dobře? Mi/mně -> 3. pád -> předmět)"
      }
    ]
  },
  {
    name: 'Přívlastek',
    type: 'Rozvíjející větný člen',
    explanation: [
      "Ptáme se Jaký? Který? Čí?",
      "Vždy rozvíjí podstatné jméno a stojí před, nebo za ním",
      "Vlastnost podstatného jména -> blíže specifikuje"
    ],
    types: [
      {
        name: 'shodný',
        abbr: 'pks',
        color: '#FF9F43',  // Warm orange
        explanation: [
          "většinou před, shoduje se v rodě, čísle a pádě s podstatným jménem",
          "většinou přídavné jméno/zájmeno/číslovka"
        ],
        examples: [
          {
            sentence: "krásná žena",
            highlightedSection: "krásná"
          },
          {
            sentence: "s krásnou ženou,",
            highlightedSection: "s krásnou"
          }
        ]
      },
      {
        name: 'nezhodný',
        abbr: 'pkn',
        color: '#FF4B4B',  // Coral red
        explanation: [
          "zpravidla za, neshoduje se",
          "nejčastěji podstatné jméno (s předložkou i bez), infinitiv nebo příslovce"
        ],
        examples: [
          {
            sentence: "babička z Prahy,",
            highlightedSection: "z Prahy"
          },
          {
            sentence: "s babičkou z Prahy,",
            highlightedSection: "z Prahy"
          }
        ]
      }
    ]
  },
  {
    name: 'doplněk',
    abbr: 'd',
    color: '#D63031',  // Bright red
    type: 'Rozvíjející větný člen',
    explanation: [
      "Závisí na dvou větných členech – podmětu/předmětu (podstatné jméno) a přísudku (sloveso)",
      "Může být vyjádřen různými slovními druhy (podstatné jméno, číslovka, přídavné jméno, …), ale i infinitivem a přechodníkem",
      "Většinou bývá na konci věty",
      "Ptáme se dvěma otázkami: Jak? – Jaká? Jaký?",
      "Může být uvozen spojkou JAKO/ZA"
    ],
    examples: [
      {
        sentence: "Zvolen za starostu",
        highlightedSection: "za starostu"
      },
      {
        sentence: "Doběhl jako první.",
        highlightedSection: "jako první"
      },
      {
        sentence: "Jana pracovala jako učitelka.",
        highlightedSection: "jako učitelka",
        explanation: "Jana je učitelka. Jana pracuje jako učitelka. DOPLNĚK"
      },
      {
        sentence: "Petr běžel jako zajíc.",
        highlightedSection: "jako zajíc",
        explanation: "Petr běžel jako zajíc. PUZ (není dvojí platnost)"
      }
    ]
  },
  {
    name: 'příslovečné určení',
    type: 'Rozvíjející větný člen',
    explanation: [
      "Doplňuje děj a jsou to jeho okolnosti",
      "Nejčastěji příslovce, ale i podstatné jméno s předložkou",
      "Ptáme se podle druhu"
    ],
    types: [
      {
        name: 'příslovečné určení času',
        abbr: 'puč',
        color: '#FF4675',
        explanation: [
          "Ptáme se: Kdy? Jak dlouho? Od kdy? Do kdy?"
        ],
        examples: [
          {
            sentence: "Petr přišel včera.",
            highlightedSection: "včera"
          },
          {
            sentence: "Petr přišel před hodinou.",
            highlightedSection: "před hodinou"
          }
        ]
      },
      {
        name: 'příslovečné určení místa',
        abbr: 'pum',
        color: '#00B894',
        explanation: [
          "Ptáme se: Kde? Kam? Odkud? Kudy? "
        ],
        examples: [
          {
            sentence: "Šel okolo domu.",
            highlightedSection: "domu"
          },
          {
            sentence: " Sejdeme se ve škole.",
            highlightedSection: "ve škole"
          }
        ]
      },
      {
        name: 'příslovečné určení způsobu',
        abbr: 'puz',
        color: '#A29BFE',
        explanation: [
          "Ptáme se: Jak? Jakým způsobem? "
        ],
        examples: [
          {
            sentence: "Petr běžel rychle.",
            highlightedSection: "rychle"
          }
        ]
      },
      {
        name: 'příslovečné určení příčiny',
        abbr: 'pu příčiny',
        color: '#afb925',
        explanation: [
          "Ptáme se: Proč? Z jakého důvodu? Z jaké příčiny?"
        ],
        examples: [
          {
            sentence: "Petr přišel kvůli nemoci.",
            highlightedSection: "kvůli nemoci"
          }
        ]
      },
      {
        name: 'příslovečné určení míry',
        abbr: 'pu míry',
        color: '#5ec9c9',
        explanation: [
          "Ptáme se: Jak moc? Do jaké míry? V jaké míře?"
        ],
        examples: [
          {
            sentence: "Petr byl velmi unavený.",
            highlightedSection: "velmi"
          }
        ]
      },
      {
        /* MADE BY AI */
        name: 'příslovečné určení účelu',
        abbr: 'pu účelu',
        color: '#9e455d',
        explanation: [
          "Ptáme se: Za jakým účelem? Proč? Kvůli čemu?"
        ],
        examples: [
          {
            sentence: "Petr šel do školy, aby se učil.",
            highlightedSection: "aby se učil"
          }
        ]
      },
      {
        /* MADE BY AI */
        name: 'příslovečné určení podmínky',
        abbr: 'pu podmínky',
        color: '#569742',
        explanation: [
          "Ptáme se: Za jakých podmínek? Za jaké situace?"
        ],
        examples: [
          {
            sentence: "Petr půjde, pokud bude mít čas.",
            highlightedSection: "pokud bude mít čas"
          }
        ]
      },
      {
        /* MADE BY AI */
        name: 'příslovečné určení přípustky',
        abbr: 'pu přípustky',
        color: '#485d96',
        explanation: [
          "Ptáme se: I když? Přestože? Navzdory čemu?"
        ],
        examples: [
          {
            sentence: "Petr přišel, ačkoli byl unavený.",
            highlightedSection: "ačkoli byl unavený"
          }
        ]
      }
    ]
  },
]