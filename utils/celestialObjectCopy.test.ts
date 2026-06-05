import { getCelestialObjectCopy } from './celestialObjectCopy';

describe('celestial object copy', () => {
  it('returns Czech labels and one-sentence descriptions for arena object types', () => {
    expect(getCelestialObjectCopy('normal')).toEqual({
      label: 'Planeta',
      description: 'Planeta je základní zastávka v galaxii, kde postupně trénuješ určování větných členů.',
    });

    expect(getCelestialObjectCopy('hole')).toEqual({
      label: 'Černá díra',
      description: 'Černá díra je náročnější zastávka, kde se hodí zpomalit a dobře promyslet odpověď.',
    });

    expect(getCelestialObjectCopy('sun')).toEqual({
      label: 'Hvězda',
      description: 'Hvězda je jasný milník v galaxii, který připomíná viditelný posun v učení.',
    });

    expect(getCelestialObjectCopy('ring')).toEqual({
      label: 'Plynný obr',
      description: 'Plynný obr s prstencem je výrazná zastávka, která ukazuje důležitý krok na cestě galaxií.',
    });
  });

  it('falls back to normal planet copy for unknown internal types', () => {
    expect(getCelestialObjectCopy('unknown')).toEqual(getCelestialObjectCopy('normal'));
  });
});
