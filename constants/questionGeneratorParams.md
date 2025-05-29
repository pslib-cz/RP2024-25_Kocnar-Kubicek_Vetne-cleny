# Parametry generátoru otázek (`questionGeneratorParams`)

Tento dokument podrobně popisuje strukturu a možnosti konfigurace parametru `questionGeneratorParams`, který slouží k nastavování generování otázek v aplikaci. Vše je vysvětleno v češtině, včetně významu jednotlivých hodnot a příkladů použití.

---

## Úvod

Parametr `questionGeneratorParams` je pole, které definuje různé varianty generování otázek podle tzv. "galaxií" (skupin typů vět). Každá galaxie obsahuje sadu konfigurací, které určují, jaké otázky budou generovány, z jakých dat, s jakými modifikátory a s jakou vahou.

---

## Enumy a jejich význam

### DataSource
Určuje zdroj dat pro generování otázek:
- `ALL` – Všechny zdroje
- `PAP` – Podmět a přísudek
- `PK` – Předmět
- `PU` – Příslovečné určení
- `D` – Doplněk

### QuestionType
Typ otázky, která bude vygenerována:
- `MARK_WORDS` – Označ slova podle typů ve větě
- `MARK_TYPES` – Označ typy podle slov ve větě
- `MARK_TYPE_ONE_WORD` – Označ typ jednoho slova ve větě (dle indexu)
- `MARK_WORDS_ALL_TYPES` – Označ slova podle typů s možností všech typů
- `SELECT_MULTIPLE` – Vyber více slov z nabídky (ne podle věty)
- `SELECT_MULTIPLE_W_SENTENCE` – Vyber více slov ve větě
- `SELECT_ONE_W_SENTENCE` – Vyber jedno slovo ve větě
- `SELECT_TYPE` – Vyber typ slova v krátké větě (dle indexu)

### DataSourceModifier
Modifikátory zdroje dat:
- `SENTENCE_CONTAINS_PK` – Věta obsahuje předmět
- `SENTENCE_CONTAINS_PT` – Věta obsahuje přísudek
- `SENTENCE_CONTAINS_PU` – Věta obsahuje příslovečné určení

### QuestionModifier
Modifikátory otázky:
- `ONLY_PO` – Pouze podmět
- `ONLY_PR` – Pouze přísudek
- `ONLY_PT` – Pouze přísudek (jiný kontext)
- `ONLY_PKS` – Pouze předmět (skupina)
- `ONLY_PKN` – Pouze předmět (jiný kontext)
- `ONLY_PU` – Pouze příslovečné určení
- `ACCEPT_D` – Akceptovat doplněk
- `CHANGE_TO_MULTIPLE_IF_NEEDED` – Změnit na výběr více možností, pokud je třeba

### Galaxy
Skupiny vět (galaxie):
- `ALL`, `PAP`, `PK`, `PU`, `D` (viz DataSource)

### GeneratorParam
Typy parametrů generátoru (pro interní použití):
- `WEIGHT`, `DATA_SOURCE`, `QUESTION_TYPE`, `DATA_SOURCE_MODIFIER`, `QUESTION_MODIFIER`

---

## Struktura pole `questionGeneratorParams`

Každý prvek hlavního pole odpovídá jedné galaxii (skupině vět). Uvnitř je pole konfigurací, kde každá konfigurace má následující strukturu:

```
[
  váha (číslo),
  DataSource (enum),
  QuestionType (enum),
  DataSourceModifier[] (volitelné pole),
  QuestionModifier[] (volitelné pole)
]
```

- **Váha**: Určuje pravděpodobnost výběru dané konfigurace (čím vyšší číslo, tím častěji bude vybrána).
- **DataSource**: Z jakého zdroje dat se otázka generuje.
- **QuestionType**: Typ otázky.
- **DataSourceModifier[]**: (Volitelné) Modifikátory zdroje dat, které upřesňují výběr vět.
- **QuestionModifier[]**: (Volitelné) Modifikátory otázky, které upřesňují, na co se otázka zaměřuje.

---

## Příklad: Význam jednotlivých konfigurací

### 1. Všechny galaxie (ALL)
```js
[
  [10, DataSource.ALL, QuestionType.MARK_WORDS],
  [10, DataSource.ALL, QuestionType.MARK_TYPES],
  [10, DataSource.ALL, QuestionType.MARK_WORDS_ALL_TYPES],
  [10, DataSource.ALL, QuestionType.SELECT_MULTIPLE_W_SENTENCE],
  [10, DataSource.ALL, QuestionType.SELECT_ONE_W_SENTENCE],
  [10, DataSource.ALL, QuestionType.SELECT_TYPE],
]
```
Každá konfigurace má váhu 10 a generuje různé typy otázek pro všechny věty.

### 2. Galaxie PAP (podmět a přísudek)
```js
[
  [1, DataSource.ALL, QuestionType.MARK_TYPES, [], [QuestionModifier.ONLY_PO, QuestionModifier.ONLY_PR]],
  [1, DataSource.ALL, QuestionType.MARK_TYPES, [DataSourceModifier.SENTENCE_CONTAINS_PT], [QuestionModifier.ONLY_PO, QuestionModifier.ONLY_PR, QuestionModifier.ONLY_PT]],
  [1, DataSource.ALL, QuestionType.SELECT_ONE_W_SENTENCE, [], [QuestionModifier.ONLY_PO, QuestionModifier.ONLY_PR]],
  [1, DataSource.ALL, QuestionType.SELECT_ONE_W_SENTENCE, [DataSourceModifier.SENTENCE_CONTAINS_PT], [QuestionModifier.ONLY_PO, QuestionModifier.ONLY_PR, QuestionModifier.ONLY_PT]],
  [1, DataSource.PAP, QuestionType.SELECT_ONE_W_SENTENCE, [], [QuestionModifier.ONLY_PO, QuestionModifier.ONLY_PT, QuestionModifier.CHANGE_TO_MULTIPLE_IF_NEEDED]],
  [1, DataSource.PAP, QuestionType.SELECT_TYPE, [], [QuestionModifier.ONLY_PO, QuestionModifier.ONLY_PT]],
  [1, DataSource.PAP, QuestionType.MARK_WORDS]
]
```
Zde jsou použity různé modifikátory, které určují, že otázky se zaměřují pouze na podmět, přísudek nebo jejich kombinace.

### 3. Galaxie PK (předmět)
Podobně jako výše, ale zaměřuje se na předmět a jeho varianty.

### 4. Galaxie PU (příslovečné určení)
Konfigurace zaměřené na příslovečné určení.

### 5. Galaxie D (doplněk)
Otázky zaměřené na doplněk, včetně speciálního modifikátoru `ACCEPT_D`.

---

## Shrnutí

Tato konfigurace umožňuje detailně nastavit, jaké otázky budou generovány, z jakých vět a s jakými specifiky. Díky tomu lze generátor otázek přizpůsobit různým výukovým potřebám a zaměřit se na konkrétní gramatické jevy.

Pro úpravy stačí přidat nebo změnit konfigurace v poli `questionGeneratorParams` podle výše uvedené struktury a významů. 