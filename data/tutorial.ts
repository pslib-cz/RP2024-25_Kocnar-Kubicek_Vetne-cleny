
export interface TutorialNode {
  // is the leaf node - threrefore there is 'no' next nor 'yes' node
  isResult: boolean;
  
  title: string;
  description: string;

  yesNode: TutorialNode | null;
  noNode: TutorialNode | null;
}

// leaf nodes
const privlastek: TutorialNode = {
  isResult: true,
  title: "PŘÍVLASTEK",
  description: "",
  yesNode: null,
  noNode: null
};

const doplnek: TutorialNode = {
  isResult: true,
  title: "DOPLNĚK",
  description: "",
  yesNode: null,
  noNode: null
};

const predmet: TutorialNode = {
  isResult: true,
  title: "PŘEDMĚT",
  description: "",
  yesNode: null,
  noNode: null
};

const prislovecneUrceniMista: TutorialNode = {
  isResult: true,
  title: "PŘÍSLOVEČNÉ URČENÍ MÍSTA",
  description: "",
  yesNode: null,
  noNode: null
};

const prislovecneUrceniCasu: TutorialNode = {
  isResult: true,
  title: "PŘÍSLOVEČNÉ URČENÍ ČASU",
  description: "",
  yesNode: null,
  noNode: null
};

const prislovecneUrceniZpusobu: TutorialNode = {
  isResult: true,
  title: "PŘÍSLOVEČNÉ URČENÍ ZPŮSOBU",
  description: "",
  yesNode: null,
  noNode: null
};

const prislovecneUrceniMiry: TutorialNode = {
  isResult: true,
  title: "PŘÍSLOVEČNÉ URČENÍ MÍRY",
  description: "",
  yesNode: null,
  noNode: null
};

const prislovecneUrceniPriciny: TutorialNode = {
  isResult: true,
  title: "PŘÍSLOVEČNÉ URČENÍ PŘÍČINY",
  description: "",
  yesNode: null,
  noNode: null
};

const podmet: TutorialNode = {
  isResult: true,
  title: "PODMĚT",
  description: "",
  yesNode: null,
  noNode: null
};

const prisudek: TutorialNode = {
  isResult: true,
  title: "PŘÍSUDEK",
  description: "",
  yesNode: null,
  noNode: null
};

// decition nodes
const ptameSePodmetDela: TutorialNode = {
  isResult: false,
  title: "PTÁME SE - CO PODMĚT DĚLÁ?",
  description: "",
  yesNode: prisudek,
  noNode: null
};

const doplnujeDejProcZJakePriciny: TutorialNode = {
  isResult: false,
  title: "DOPLŇUJE DĚJ A PTÁME SE PROČ? Z JAKÉ PŘÍČINY?",
  description: "",
  yesNode: prislovecneUrceniPriciny,
  noNode: null
};

const doplnujeDejKolikDoJakeMiry: TutorialNode = {
  isResult: false,
  title: "DOPLŇUJE DĚJ A PTÁME SE KOLIK? DO JAKÉ MÍRY?",
  description: "",
  yesNode: prislovecneUrceniMiry,
  noNode: doplnujeDejProcZJakePriciny
};

const doplnujeDejJakJakymZpusobem: TutorialNode = {
  isResult: false,
  title: "DOPLŇUJE DĚJ A PTÁME SE JAK? JAKÝM ZPŮSOBEM?",
  description: "",
  yesNode: prislovecneUrceniZpusobu,
  noNode: doplnujeDejKolikDoJakeMiry
};

const doplnujeDejKdyOdkdy: TutorialNode = {
  isResult: false,
  title: "DOPLŇUJE DĚJ A PTÁME SE KDY? ODKDY?",
  description: "",
  yesNode: prislovecneUrceniCasu,
  noNode: doplnujeDejJakJakymZpusobem
};

const doplnujeDejKdeKam: TutorialNode = {
  isResult: false,
  title: "DOPLŇUJE DĚJ A PTÁME SE KDE? KAM?",
  description: "",
  yesNode: prislovecneUrceniMista,
  noNode: doplnujeDejKdyOdkdy
};

const shodujeSeSPodstatnymJmenem: TutorialNode = {
  isResult: false,
  title: "SHODUJE SE S PODSTATNÝM JMÉNEM? PADÁ S NÍM. KDO? CO?",
  description: "",
  yesNode: doplnek,
  noNode: predmet
};

const zavisiSlovoNaPrisudku: TutorialNode = {
  isResult: false,
  title: "ZÁVISÍ SLOVO NA PŘÍSUDKU? PTÁME SE PÁDOVÝMI OTÁZKAMI 2.-7.?",
  description: "",
  yesNode: shodujeSeSPodstatnymJmenem,
  noNode: doplnujeDejKdeKam
};

const urcujeSlovoVlastnost: TutorialNode = {
  isResult: false,
  title: "URČUJE SLOVO VLASTNOST PODSTATNÉHO JMÉNA? PTÁME SE JAKÝ? KTERÝ? ČÍ?",
  description: "",
  yesNode: privlastek,
  noNode: zavisiSlovoNaPrisudku
};

const jeSlovoVPrvnimPade: TutorialNode = {
  isResult: false,
  title: "JE SLOVO V 1. PÁDĚ ?",
  description: "",
  yesNode: podmet,
  noNode: ptameSePodmetDela
};

// base node
const jeSlovoZavisle: TutorialNode = {
  isResult: false,
  title: "JE SLOVO ZÁVISLÉ?",
  description: "VĚTNÉ ČLENY",
  yesNode: urcujeSlovoVlastnost,
  noNode: jeSlovoVPrvnimPade
};

export default jeSlovoZavisle;