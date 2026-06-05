export type CelestialObjectType = 'normal' | 'hole' | 'sun' | 'ring';

type CelestialObjectCopy = {
  label: string;
  description: string;
};

const CELESTIAL_OBJECT_COPY: Record<CelestialObjectType, CelestialObjectCopy> = {
  normal: {
    label: 'Planeta',
    description: 'Planeta je základní zastávka v galaxii, kde postupně trénuješ určování větných členů.',
  },
  hole: {
    label: 'Černá díra',
    description: 'Černá díra je náročnější zastávka, kde se hodí zpomalit a dobře promyslet odpověď.',
  },
  sun: {
    label: 'Hvězda',
    description: 'Hvězda je jasný milník v galaxii, který připomíná viditelný posun v učení.',
  },
  ring: {
    label: 'Plynný obr',
    description: 'Plynný obr s prstencem je výrazná zastávka, která ukazuje důležitý krok na cestě galaxií.',
  },
};

export const getCelestialObjectCopy = (planetType: string): CelestialObjectCopy => {
  if (planetType in CELESTIAL_OBJECT_COPY) {
    return CELESTIAL_OBJECT_COPY[planetType as CelestialObjectType];
  }

  return CELESTIAL_OBJECT_COPY.normal;
};
