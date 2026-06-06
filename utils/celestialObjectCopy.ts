export type CelestialObjectType = 'normal' | 'hole' | 'sun' | 'ring';

type CelestialObjectCopy = {
  label: string;
  description: string;
};

const CELESTIAL_OBJECT_TYPE_COPY: Record<CelestialObjectType, CelestialObjectCopy> = {
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

export const PLANET_DESCRIPTIONS = [
  [
    'Na Cekmaronu se bílé ledové mapy rozlévají po tyrkysových mořích jako ostrovy na staré školní mapě.',
    'Rachmora-8C vypadá, jako by ji někdo obtiskl do oranžové hlíny a nechal v ní tmavé kruhy po dávných dopadech.',
    'Na Zveranaku se tmavé oceány střídají se světlými tahy, jako kdyby po něm prošel studený vítr.',
    'Drsnavax má tyrkysové pásy a vínové pevniny, takže působí jako planeta rozdělená mezi moře a skály.',
    'Brzdalor 4R skrývá většinu povrchu pod bílým ledem, jen modrošedé průlivy zůstávají otevřené.',
    'Stinarka má fialový stín a tmavé kruhy, jako by si schovávala staré krátery pod nocí.',
    'Mekrala vypadá svěže, s bílými oblaky nad zelenými kraji a modrými vodami.',
    'Dravalix-K3 je zelený klidný svět s měkkými kruhy, které připomínají nízké kopce.',
    'Na Treblenoru žluté pevniny vystupují z temné zeleně jako světla na mapě lesa.',
    'Zaskronia září tyrkysově, jako kdyby uvnitř hvězdy bublalo studené světlo.',
    'Klapanik pokrývají modrobílé víry, které vedou pohled jako proudy na zamrzlém moři.',
    'Zlomira nosí červené pásy přes tyrkysový povrch, takže působí jako svět se dvěma různými tvářemi.',
    'Skloben má tenký prstenec a tmavé modré jádro, jako tichý uzel uprostřed vesmíru.',
    'Oblinor Prime má vínové skály a světlé pláně rozložené jako nedokončená mapa.',
    'Zadobor 3 vypadá z dálky jako ledová koule s měkkými modrými stíny.',
    'Na Vlchorenu-X se tyrkysové skvrny drží v hnědém prachu jako zbytky mělkých jezer.',
    'Trnavor-IX míchá tmavou modř, fialovou a zlaté čáry, jako kdyby na něm právě končila bouře.',
    'Kradnor-6 není hladká koule, ale šedomodrý úlomek s menším kamenem po boku.',
    'Blokisar pluje jako olivový kus skály, od kterého se oddělilo několik drobných úlomků.',
    'Kropis-12 svítí oranžově a jeho bílé jiskry vypadají jako horké kapky kolem povrchu.',
    'Tvaruna je růžový kráterový svět, který připomíná starý měsíc posetý tmavými miskami.',
    'Fronel má rudé víry a bílé zlomy, jako kdyby jeho povrch rozkreslily hluboké kaňony.',
    'Mrazivik je tichý šedomodrý svět s kulatými jamkami po dopadech.',
    'Bzukeron 5X ukazuje mátové skvrny v hnědé krajině, jako světlo prosakující přes prach.',
    'Plosen V stáčí oranžový prstenec kolem temného středu jako rozžhavenou linku v sešitě.',
  ],
  [
    'Klanovik si nese široký prstenec jako nakloněnou dráhu a jeho hnědé pásy připomínají pomalu míchaný písek.',
    'Zavraton-4 má růžové ledové plochy a tyrkysová moře, jako by na něm zůstala stopa po polární záři.',
    'Sklonir drží rezavé pevniny na šedém povrchu, jen pár světlých jezer proráží ticho.',
    'Vyzdalor není kulatý, spíš zelený zlomek světa s tyrkysovým okrajem.',
    'Na Mirkadonu-9 se bílé víry točí nad zelenými oblastmi jako pomalé počasí.',
    'Jazvorka hoří červenými a oranžovými skvrnami, ale tmavé části ukazují chladnoucí kámen.',
    'Spalenor-2 rozkládá tyrkysová moře mezi zelené a bílé oblasti jako jasnou školní mapu.',
    'Tmorax svírá fialový prstenec kolem černého středu, jako kdyby světlo obíhalo po kružnici.',
  ],
  [
    'Gralin-5 se rozpadl na fialové kamenné díly, které stále drží podobný směr.',
    'Velebrix-0 má červené jádro a úzký prstenec, takže připomíná rychle roztočenou káču.',
    'Na Zalmaranu světlé kruhy leží v temné zeleni jako jezera na noční mapě.',
    'Ryslan-13B si míchá růžovou, zelenou a krémovou tak nepravidelně, že každá oblast vypadá jinak.',
    'Korexion stojí ve stínu, jen bledé skvrny na něm prozrazují chladný povrch.',
    'Kovranon-11 má bílá pole na hnědém základu, jako by ho někdo poprášil světlým prachem.',
    'Slepanov obtáčejí modré proudy a krémové pásy, které se táhnou přes celou kouli.',
    'Gropis-23 ohýbá žluté světlo kolem temnoty jako jasný kompas ztracený ve vesmíru.',
  ],
  [
    'Zarbion nese bledý prstenec a zelené stíny, jako lehká planeta zahalená do mlhy.',
    'Kamirok-15 je fialový ledový svět, kde světlé plochy leží jako zmrzlé ostrovy.',
    'Plenor-5 má uprostřed sytou zeleň a kolem ní šedé krajiny s růžovými stopami.',
    'Narvok spojuje modré vody s hnědozelenými pevninami, takže působí jako svět plný cest.',
    'Kolbex-6 překrývají růžové a bílé víry, jako kdyby se nad zelení honily široké mraky.',
    'Seradyn má úzký růžový prstenec a malé tmavé tělo, které vypadá jako značka na obloze.',
    'Vyslen-4 nese hnědočervený povrch s bílými krátery, které připomínají světlé otisky.',
    'Briktor obepíná rudý prstenec tak ostře, jako by kolem temnoty kroužila žhavá stuha.',
  ],
  [
    'Sternon-2B skrývá tmavě modrý povrch pod zelenými a bílými tahy, jako večerní obloha pod mraky.',
    'Tronvika je zelený svět s dlouhými fialovými pásy, které vedou oko kolem celé koule.',
    'Oribis-7 pluje v hnědém prstenci, tichý a menší než ostatní obři.',
    'Kvetalon má červené pláně, zelené okraje a bílé plochy, jako pestrý atlas bez popisků.',
    'Lužnika-3 ukazuje tmavě rudý povrch s oranžovými okny horka mezi chladnějšími skálami.',
    'Frestor je tmavozelený a klidný, s modrými zálivy schovanými při okrajích.',
    'Mordalis-12 spojuje šedé skály s jasnou zelení, jako místo, kde se kámen pomalu mění v krajinu.',
    'Ferlix-11 stahuje zelené světlo do šikmého prstence, takže temný střed působí jako brána v prostoru.',
  ],
] as const;

const getObjectTypeCopy = (planetType: string): CelestialObjectCopy => {
  if (planetType in CELESTIAL_OBJECT_TYPE_COPY) {
    return CELESTIAL_OBJECT_TYPE_COPY[planetType as CelestialObjectType];
  }

  return CELESTIAL_OBJECT_TYPE_COPY.normal;
};

const getPlanetDescription = (galaxyIndex?: number, planetIndex?: number): string | undefined => {
  if (galaxyIndex === undefined || planetIndex === undefined) {
    return undefined;
  }

  return PLANET_DESCRIPTIONS[galaxyIndex]?.[planetIndex];
};

export const getCelestialObjectCopy = (
  planetType: string,
  galaxyIndex?: number,
  planetIndex?: number,
): CelestialObjectCopy => {
  const typeCopy = getObjectTypeCopy(planetType);

  return {
    label: typeCopy.label,
    description: getPlanetDescription(galaxyIndex, planetIndex) || typeCopy.description,
  };
};
