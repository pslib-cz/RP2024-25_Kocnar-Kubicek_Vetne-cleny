import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, SafeAreaView, StatusBar, Modal, ScrollView as RNScrollView, NativeSyntheticEvent } from 'react-native';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { ThemedText } from '@/components/ThemedText';
import { useRocket } from '@/contexts/RocketContext';
import { SvgXml } from 'react-native-svg';
import { rocket1, rocket2, rocket3, rocket4, rocket5 } from '@/data/rocketsImages';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import ColorPicker from 'react-native-wheel-color-picker';
import PlayfulButton from '@/components/ui/PlayfulButton';
import { MaterialIcons } from '@expo/vector-icons';
import { WordButtonsContainer } from '@/components/ui/games/WordButtonsContainer';
import { ButtonState } from '@/components/ui/games/WordButton';
import { useLevelContext } from '@/contexts/levelContext';
import { NamedRocket } from '@/components/NamedRocket';
import AndroidSafeArea from '@/components/AndroidSafeArea';
import { PlayerRocket } from '@/components/PlayerRocket';

const loadSvgAsset = async (assetModule: any): Promise<string | null> => {
  try {
    const asset = Asset.fromModule(assetModule);
    await asset.downloadAsync();
    const fileContent = await FileSystem.readAsStringAsync(asset.localUri!);
    return fileContent;
  } catch (error) {
    console.warn('Error loading SVG:', error);
    return null;
  }
};

export default function OnboardingScreen() {
  const pagerRef = useRef<PagerView>(null);
  const router = useRouter();
  const {
    bodyColor,
    setBodyColor,
    trailColor,
    setTrailColor,
    selectedRocketIndex,
    setSelectedRocketIndex,
    name,
    setName,
  } = useRocket();

  const [rocketSvgs, setRocketSvgs] = useState<string[]>([]);
  const [modifiedRocketSvgs, setModifiedRocketSvgs] = useState<string[]>([]);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [currentPickingFor, setCurrentPickingFor] = useState<'body' | 'trail' | null>(null);
  const [rocketPickerVisible, setRocketPickerVisible] = useState(false);
  const [localName, setLocalName] = useState('');
  const [nameTouched, setNameTouched] = useState(false);

  const staticWordButtons1 = [
    { text: 'Veverky', type: 'po', state: ButtonState.correct },
    { text: 'se starají', type: 'př', state: ButtonState.highlighted },
    { text: 'o opuštěná', type: 'pks' },
    { text: '(o) mláďata.', type: 'pt' }
  ]
  const staticWordButtons2 = [
    { text: 'pks', type: 'pks', drawType: true },
    { text: 'po', type: 'po', drawType: true, state: ButtonState.disabled },
    { text: 'pt', type: 'pt', drawType: true },
    { text: 'př', type: 'př', drawType: true }
  ]

  useEffect(() => {
    const loadRockets = async () => {
      const svg1 = await loadSvgAsset(rocket1);
      const svg2 = await loadSvgAsset(rocket2);
      const svg3 = await loadSvgAsset(rocket3);
      const svg4 = await loadSvgAsset(rocket4);
      const svg5 = await loadSvgAsset(rocket5);
      setRocketSvgs([svg1, svg2, svg3, svg4, svg5].filter(svg => svg !== null) as string[]);
    };
    loadRockets();
  }, []);

  useEffect(() => {
    if (rocketSvgs.length > 0) {
      const updatedSvgs = rocketSvgs.map(svg =>
        svg.replaceAll('_body_', bodyColor).replaceAll('_trail_', trailColor)
      );
      setModifiedRocketSvgs(updatedSvgs);
    }
  }, [rocketSvgs, bodyColor, trailColor]);

  // Sync local name to context
  useEffect(() => {
    setName(localName.trim().slice(0, 32));
  }, [localName, setName]);

  const openColorPicker = (type: 'body' | 'trail') => {
    setCurrentPickingFor(type);
    setColorPickerVisible(true);
  };

  const onColorChangeComplete = (color: string) => {
    if (currentPickingFor === 'body') setBodyColor(color);
    else if (currentPickingFor === 'trail') setTrailColor(color);
  };

  // Navigation logic
  const [page, setPage] = useState(0);
  const goToPage = (idx: number) => {
    pagerRef.current?.setPage(idx);
    setPage(idx);
  };

  const { width } = Dimensions.get('window');
  const { handleShowTooltip } = useLevelContext();

  return (
    <SafeAreaView style={[AndroidSafeArea.AndroidSafeArea, { flex: 1, backgroundColor: '#101223' }]}>
      <StatusBar barStyle="light-content" />
      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(e: any) => setPage(e.nativeEvent.position)}
      >
        {/* Slide 1: Introduction */}
        <View key="1" style={styles.slide}>
          <Image
            source={require('../../assets/images/icons/splash-icon-light.png')}
            style={{ width: 120, height: 120, marginBottom: 16, alignSelf: 'center', borderRadius: 16 }}
            resizeMode="contain"
          />
          <View style={styles.paddedContainer}>
            <ThemedText type="title" style={{ marginBottom: 12, textAlign: 'center' }}>Vítej v aplikaci</ThemedText>
            <ThemedText type="title" style={{ marginBottom: 24, textAlign: 'center' }}>Větná dráha</ThemedText>
            <ThemedText type="default" style={{ marginBottom: 16, textAlign: 'center', fontSize: 18 }}>
              Procvičuj větné členy, sbírej body a zlepšuj se! Čekají tě mise vesmírem a zkoušky znalostí.
            </ThemedText>
            <ThemedText type="default" style={{ marginBottom: 16, textAlign: 'center', fontSize: 18 }}>
              Před tím, než začneš, musíš si nastavit svůj profil a naučit se používat aplikaci.
            </ThemedText>
            <ThemedText type="default" style={{ marginBottom: 16, textAlign: 'center', fontSize: 18 }}>
              Stisknutím tlačítka "Pokračovat" souhlasíš s <ThemedText type="defaultSemiBold" style={{ color: '#4A5BD2' }} onPress={() => router.push('/(pages)/gdpr')}>Zásadami ochrany osobních údajů</ThemedText>. Údaje jsou použity pro zobrazení výsledků hry a vašeho profilu v rámci sdílených her.
            </ThemedText>
          </View>
          <View style={styles.bottomButtonContainer}>
            <PlayfulButton title="Pokračovat" icon={<MaterialIcons name="arrow-forward" size={24} color="white" />} onPress={() => goToPage(1)} />
          </View>
        </View>

        {/* Slide 2: Profile Setup */}
        <RNScrollView key="2" contentContainerStyle={[styles.slide, { alignItems: 'center', justifyContent: 'flex-start' }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.paddedContainer}>
            <ThemedText type="title" style={{ marginBottom: 12, textAlign: 'center' }}>Váš profil</ThemedText>
            <ThemedText style={{ color: '#aaa', marginBottom: 16, textAlign: 'center' }}>Zadejte své jméno a vyberte si raketu</ThemedText>
          </View>
          <View style={styles.avatarOptions}>
            {/* Body Color */}
            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={[styles.colorOption, { backgroundColor: bodyColor }]}
                onPress={() => openColorPicker('body')}
              />
              <ThemedText style={styles.optionLabel}>Barva rakety</ThemedText>
            </View>
            {/* Rocket Shape */}
            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={styles.shapeOption}
                onPress={() => setRocketPickerVisible(true)}
              >
                {modifiedRocketSvgs.length > 0 && selectedRocketIndex < modifiedRocketSvgs.length && (
                  <SvgXml xml={modifiedRocketSvgs[selectedRocketIndex]} width={70} height={70} />
                )}
              </TouchableOpacity>
              <ThemedText style={styles.optionLabel}>Tvar rakety</ThemedText>
            </View>
            {/* Trail Color */}
            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={[styles.colorOption, { backgroundColor: trailColor }]}
                onPress={() => openColorPicker('trail')}
              />
              <ThemedText style={styles.optionLabel}>Barva trysek</ThemedText>
            </View>
          </View>
          {/* Name Input */}
          <View style={styles.nameContainer}>
            <ThemedText style={styles.nameLabel}>Jméno</ThemedText>
            <TextInput
              style={styles.nameInput}
              value={localName}
              onChangeText={text => { setLocalName(text); setNameTouched(true); }}
              placeholder="Zadejte své jméno"
              placeholderTextColor="#666"
              autoCapitalize="words"
              autoFocus={false}
              onBlur={() => setNameTouched(true)}
            />
          </View>
          <View style={styles.bottomButtonContainer}>
            <PlayfulButton
              title="Pokračovat"
              icon={<MaterialIcons name="arrow-forward" size={24} color="white" />}
              onPress={() => goToPage(2)}
              disabled={!localName.trim()}
            />
          </View>
          {/* Color Picker Modal */}
          <Modal
            visible={colorPickerVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setColorPickerVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.colorPickerContainer}>
                <ThemedText type="subtitle" style={[styles.colorPickerTitle, { paddingHorizontal: 16 }]}>
                  {currentPickingFor === 'body' ? 'Vyberte barvu rakety' : 'Vyberte barvu trysek'}
                </ThemedText>
                <View style={styles.colorPickerWrapper}>
                  <ColorPicker
                    color={currentPickingFor === 'body' ? bodyColor : trailColor}
                    onColorChangeComplete={onColorChangeComplete}
                    thumbSize={30}
                    sliderSize={20}
                    noSnap={true}
                    row={false}
                  />
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setColorPickerVisible(false)}
                  >
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, { paddingHorizontal: 16 }]}>Zrušit</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => setColorPickerVisible(false)}
                  >
                    <ThemedText type="defaultSemiBold" style={[styles.buttonText, { paddingHorizontal: 16 }]}>Potvrdit</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/* Rocket Picker Modal */}
          <Modal
            visible={rocketPickerVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setRocketPickerVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.rocketPickerContainer}>
                <ThemedText type="subtitle" style={[styles.colorPickerTitle, { paddingHorizontal: 16 }]}>Vyberte raketu</ThemedText>
                <View style={styles.rocketGrid}>
                  {modifiedRocketSvgs.map((svg, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.rocketOption,
                        selectedRocketIndex === index && styles.selectedRocketOption
                      ]}
                      onPress={() => {
                        setSelectedRocketIndex(index);
                        setRocketPickerVisible(false);
                      }}
                    >
                      <SvgXml xml={svg} width={50} height={50} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Modal>
        </RNScrollView>

        {/* Slide 3: Arena Info */}
        <View key="3" style={styles.slide}>
          <View style={styles.paddedContainer}>
            <ThemedText type="title" style={{ marginBottom: 16, textAlign: 'center' }}>Seznam se s Arénou!</ThemedText>
            <ThemedText style={{ marginBottom: 16, textAlign: 'center' }}>
              Aréna je prostor, ve kterém můžeš cestovat po galaxiích. V galaxiích můžeš procvičovat větné členy v různých úlohách a sbírat body za správné odpovědi.
            </ThemedText>
          </View>
          <Image
            source={require('../../assets/images/uni/2/celestial7.png')}
            style={{ height: width * 0.6, borderRadius: 16, marginBottom: 24, zIndex: 1000, transform: [{ translateX: -width * 0.1 }] }}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/images/uni/4/celestial8.png')}
            style={{ height: width * 0.6, borderRadius: 16, marginBottom: 24, transform: [{ translateX: width * 0.2 }, { translateY: -width * 0.3 }] }}
            resizeMode="contain"
          />
          <View style={styles.bottomButtonContainer}>
            <PlayfulButton title="Pokračovat" icon={<MaterialIcons name="arrow-forward" size={24} color="white" />} onPress={() => goToPage(3)} />
          </View>
        </View>

        {/* Slide 4: Games/Gametypes Info */}
        <View key="4" style={styles.slide}>
          <View style={styles.paddedContainer}>
            <ThemedText type="title" style={{ marginBottom: 16, textAlign: 'center' }}>Herní režimy</ThemedText>
            <ThemedText style={{ marginBottom: 16, textAlign: 'center' }}>
              V aplikaci najdeš různé typy her, každý ti pomůže procvičit jiné dovednosti.
            </ThemedText>
            <ThemedText style={{ marginBottom: 16, textAlign: 'center' }}>
              Zde můžeš vidět příklad hry, ve které budeš klikat na barevné zkratky větných členů dole, a tím postupně označovat větu.
            </ThemedText>
            <ThemedText style={{ marginBottom: 16, textAlign: 'center' }}>
              Pokud si nejsi jistý se zkratkami, můžeš na zkratce podržet prst a zobrazí se ti nápověda, nebo si můžeš přečíst seznam zkratek.
            </ThemedText>
          </View>
          <View style={{ width: '100%', alignItems: 'center', marginBottom: 24 }}>
            <WordButtonsContainer buttons={staticWordButtons1} showTooltip={false} longPress={() => { }} onClick={() => { }} />
            <WordButtonsContainer buttons={staticWordButtons2} showTooltip={true} longPress={(a, b) => handleShowTooltip(a.text, b)} onClick={() => { }} />
          </View>
          <View style={styles.bottomButtonContainer}>
            <PlayfulButton title="Seznam zkratek" icon={<MaterialIcons name="info" size={24} color="white" />} onPress={() => router.push('/(pages)/abbrlist')} variant="secondary" style={{ height: 44 }} />
            <PlayfulButton title="Pokračovat" icon={<MaterialIcons name="sports-esports" size={24} color="white" />} onPress={() => goToPage(4)} />
          </View>
        </View>

        {/* Slide 5: Exams Info */}
        <View key="5" style={styles.slide}>
          <View style={styles.paddedContainer}>
            <ThemedText type="title" style={{ marginBottom: 16, textAlign: 'center' }}>Testy a zkoušky</ThemedText>
            <ThemedText style={{ marginBottom: 16, textAlign: 'center' }}>
              Vyzkoušej si testy nanečisto nebo se připoj ke zkoušce sdílené tvým učitelem!
            </ThemedText>
            <ThemedText style={{ marginBottom: 16, textAlign: 'center' }}>
              Sleduj svůj pokrok a porovnej výsledky s ostatními!
            </ThemedText>
            {/* User info section */}
            <View style={styles.playerInfoContainer}>
              <NamedRocket
                containerStyle={styles.namedRocketContainer}
                textStyle={styles.playerName}
              />

              <PlayerRocket
                player={
                  {
                    id: "a",
                    name: 'Karel',
                    bodyColor: "#cfc",
                    trailColor: "#8f2",
                    selectedRocketIndex: 3,
                  }
                }
                containerStyle={styles.namedRocketContainer}
                textStyle={styles.playerName}
              />
              <PlayerRocket
                player={
                  {
                    id: "b",
                    name: 'Paní Kovářová',
                    bodyColor: "#f8c",
                    trailColor: "#fff",
                    selectedRocketIndex: 2,
                  }
                }
                containerStyle={styles.namedRocketContainer}
                textStyle={styles.playerName}
              />
            </View>
          </View>
          <View style={styles.bottomButtonContainer}>
            <PlayfulButton title="Začít" icon={<MaterialIcons name="rocket-launch" size={24} color="white" />} onPress={() => router.replace('/')} />
          </View>
        </View>
      </PagerView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#101223',
  },
  paddedContainer: {
    width: '100%',
    padding: 16,
  },
  avatarOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 0,
  },
  optionContainer: {
    alignItems: 'center',
  },
  colorOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    marginTop: 30,
  },
  shapeOption: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1c1f3d',
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionLabel: {
    color: '#777',
    fontSize: 14,
  },
  nameContainer: {
    // this is bad solution, but it was fast and is good enough for now
    zIndex: 999,
    backgroundColor: '#101223',
    width: '100%',
    marginTop: 30,
  },
  nameLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: '#1c1f3d',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPickerContainer: {
    width: '80%',
    backgroundColor: '#1c1f3d',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  rocketPickerContainer: {
    width: '80%',
    backgroundColor: '#1c1f3d',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  colorPickerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  colorPickerWrapper: {
    width: '100%',
    height: 300,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A5BD2',
    boxSizing: 'border-box',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4A5BD2',
    padding: 12,
    borderRadius: 6,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rocketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  rocketOption: {
    width: 80,
    height: 80,
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#101223',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRocketOption: {
    borderColor: '#4A5BD2',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  playerInfoContainer: {
    marginBottom: 24,
  },
  namedRocketContainer: {
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#4A5BD2',
    backgroundColor: '#101223',
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  playerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

