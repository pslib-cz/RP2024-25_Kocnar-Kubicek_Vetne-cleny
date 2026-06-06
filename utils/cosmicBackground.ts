export type CosmicStar = {
  top: `${number}%`;
  left: `${number}%`;
  size: number;
  opacity: number;
};

export type CosmicStructure = {
  points: Array<{ x: number; y: number }>;
  opacity: number;
};

export const COSMIC_BACKGROUND_STARS: CosmicStar[] = [
  { top: '4%', left: '11%', size: 1.2, opacity: 0.48 },
  { top: '7%', left: '43%', size: 0.9, opacity: 0.34 },
  { top: '10%', left: '79%', size: 1.5, opacity: 0.56 },
  { top: '14%', left: '26%', size: 0.8, opacity: 0.28 },
  { top: '17%', left: '61%', size: 1.1, opacity: 0.44 },
  { top: '19%', left: '91%', size: 0.9, opacity: 0.32 },
  { top: '23%', left: '8%', size: 1.8, opacity: 0.6 },
  { top: '25%', left: '36%', size: 1, opacity: 0.4 },
  { top: '27%', left: '72%', size: 0.8, opacity: 0.3 },
  { top: '30%', left: '52%', size: 1.7, opacity: 0.62 },
  { top: '33%', left: '18%', size: 0.9, opacity: 0.36 },
  { top: '35%', left: '84%', size: 1.2, opacity: 0.46 },
  { top: '39%', left: '29%', size: 1.4, opacity: 0.5 },
  { top: '41%', left: '66%', size: 0.8, opacity: 0.26 },
  { top: '44%', left: '94%', size: 1, opacity: 0.34 },
  { top: '47%', left: '12%', size: 0.8, opacity: 0.22 },
  { top: '49%', left: '47%', size: 1.9, opacity: 0.64 },
  { top: '52%', left: '76%', size: 1, opacity: 0.38 },
  { top: '55%', left: '23%', size: 1.1, opacity: 0.44 },
  { top: '58%', left: '58%', size: 0.8, opacity: 0.3 },
  { top: '60%', left: '88%', size: 1.6, opacity: 0.58 },
  { top: '64%', left: '6%', size: 0.9, opacity: 0.36 },
  { top: '66%', left: '33%', size: 1.3, opacity: 0.5 },
  { top: '69%', left: '69%', size: 0.8, opacity: 0.28 },
  { top: '72%', left: '15%', size: 1.7, opacity: 0.56 },
  { top: '74%', left: '45%', size: 0.9, opacity: 0.34 },
  { top: '77%', left: '81%', size: 1.2, opacity: 0.48 },
  { top: '80%', left: '27%', size: 0.8, opacity: 0.26 },
  { top: '82%', left: '63%', size: 1.5, opacity: 0.54 },
  { top: '85%', left: '93%', size: 0.9, opacity: 0.32 },
  { top: '88%', left: '38%', size: 1, opacity: 0.42 },
  { top: '91%', left: '71%', size: 1.8, opacity: 0.6 },
  { top: '94%', left: '19%', size: 0.8, opacity: 0.24 },
  { top: '96%', left: '55%', size: 1.1, opacity: 0.4 },
  { top: '12%', left: '53%', size: 0.8, opacity: 0.18 },
  { top: '21%', left: '48%', size: 0.9, opacity: 0.24 },
  { top: '29%', left: '4%', size: 1.1, opacity: 0.38 },
  { top: '37%', left: '74%', size: 0.8, opacity: 0.2 },
  { top: '46%', left: '34%', size: 1, opacity: 0.36 },
  { top: '57%', left: '97%', size: 0.9, opacity: 0.3 },
  { top: '67%', left: '52%', size: 1.2, opacity: 0.46 },
  { top: '78%', left: '9%', size: 0.8, opacity: 0.22 },
  { top: '89%', left: '84%', size: 1, opacity: 0.34 },
  { top: '6%', left: '68%', size: 0.8, opacity: 0.2 },
  { top: '53%', left: '41%', size: 1.3, opacity: 0.52 },
];

export const COSMIC_BACKGROUND_STRUCTURES: CosmicStructure[] = [
  { points: [{ x: 9, y: 18 }, { x: 14, y: 15 }, { x: 19, y: 19 }], opacity: 0.13 },
  { points: [{ x: 72, y: 12 }, { x: 78, y: 17 }, { x: 84, y: 14 }, { x: 89, y: 20 }], opacity: 0.12 },
  { points: [{ x: 18, y: 58 }, { x: 25, y: 54 }, { x: 31, y: 60 }], opacity: 0.14 },
  { points: [{ x: 63, y: 72 }, { x: 70, y: 68 }, { x: 77, y: 74 }, { x: 83, y: 70 }], opacity: 0.13 },
  { points: [{ x: 41, y: 87 }, { x: 47, y: 84 }, { x: 54, y: 88 }], opacity: 0.11 },
];
