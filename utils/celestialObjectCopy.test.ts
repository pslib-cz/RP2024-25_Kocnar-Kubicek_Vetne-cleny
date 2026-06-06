import { getCelestialObjectCopy, PLANET_DESCRIPTIONS } from './celestialObjectCopy';

describe('celestial object copy', () => {
  it('returns Czech labels for arena object types', () => {
    expect(getCelestialObjectCopy('normal', 0, 0)).toMatchObject({
      label: 'Planeta',
    });

    expect(getCelestialObjectCopy('hole', 0, 24)).toMatchObject({
      label: 'Černá díra',
    });

    expect(getCelestialObjectCopy('sun', 0, 9)).toMatchObject({
      label: 'Hvězda',
    });

    expect(getCelestialObjectCopy('ring', 1, 0)).toMatchObject({
      label: 'Plynný obr',
    });
  });

  it('returns image-specific descriptions for individual planets', () => {
    expect(getCelestialObjectCopy('normal', 0, 0).description).toBe(
      'Na Cekmaronu se bílé ledové mapy rozlévají po tyrkysových mořích jako ostrovy na staré školní mapě.'
    );
    expect(getCelestialObjectCopy('normal', 0, 1).description).toBe(
      'Rachmora-8C vypadá, jako by ji někdo obtiskl do oranžové hlíny a nechal v ní tmavé kruhy po dávných dopadech.'
    );
    expect(getCelestialObjectCopy('ring', 1, 0).description).toBe(
      'Klanovik si nese široký prstenec jako nakloněnou dráhu a jeho hnědé pásy připomínají pomalu míchaný písek.'
    );
    expect(getCelestialObjectCopy('hole', 4, 7).description).toBe(
      'Ferlix-11 stahuje zelené světlo do šikmého prstence, takže temný střed působí jako brána v prostoru.'
    );
  });

  it('defines one unique one-sentence description for every planet asset', () => {
    expect(PLANET_DESCRIPTIONS.map((descriptions) => descriptions.length)).toEqual([25, 8, 8, 8, 8]);

    const descriptions = PLANET_DESCRIPTIONS.flat();
    const uniqueDescriptions = new Set(descriptions);

    expect(descriptions).toHaveLength(57);
    expect(uniqueDescriptions.size).toBe(57);
    descriptions.forEach((description) => {
      expect(description).toMatch(/\.$/);
      expect((description.match(/[.!?]/g) || []).length).toBe(1);
    });
  });

  it('keeps the descriptions varied instead of repeating the same sentence shape', () => {
    const descriptions = PLANET_DESCRIPTIONS.flat();
    const formulaWords = ['připomíná', 'působí', 'vypadá'];
    const formulaCount = descriptions.filter((description) =>
      formulaWords.some((word) => description.includes(word))
    ).length;
    const secondWordPlanetCount = descriptions.filter((description) =>
      /^\S+\s+(planeta|hvězda|černá|plynný|skalnatý)\b/i.test(description)
    ).length;
    const uniqueOpeningWords = new Set(descriptions.map((description) => description.split(/\s+/)[0]));

    expect(formulaCount).toBeLessThanOrEqual(18);
    expect(secondWordPlanetCount).toBeLessThanOrEqual(14);
    expect(uniqueOpeningWords.size).toBeGreaterThanOrEqual(35);
  });

  it('falls back to type copy when an individual planet description is missing', () => {
    expect(getCelestialObjectCopy('unknown', 99, 99)).toEqual({
      label: 'Planeta',
      description: 'Planeta je základní zastávka v galaxii, kde postupně trénuješ určování větných členů.',
    });
  });
});
