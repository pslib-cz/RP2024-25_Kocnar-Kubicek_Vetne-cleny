import { ThemedText } from '@/components/ThemedText';
import { useRocket } from '@/contexts/RocketContext';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View, Switch } from 'react-native';
import { SvgXml } from 'react-native-svg';
import ColorPicker from 'react-native-wheel-color-picker';

// Načtení SVG souboru jako text
export const loadSvgAsset = async (assetModule: any): Promise<string | null> => {
  try {
    const asset = Asset.fromModule(assetModule);
    await asset.downloadAsync();
    const fileContent = await FileSystem.readAsStringAsync(asset.localUri!);
    return fileContent;
  } catch (error) {
    console.error('Error loading SVG:', error);
    return null;
  }
};

export default function ProfileEditScreen(): React.ReactElement {
  // Use context instead of local state for rocket properties
  const {
    bodyColor,
    setBodyColor,
    trailColor,
    setTrailColor,
    selectedRocketIndex,
    setSelectedRocketIndex,
    name,
    setName,
    teacherMode,
    setTeacherMode
  } = useRocket();

  const [currentPickingFor, setCurrentPickingFor] = useState<'body' | 'trail' | null>(null);
  const [colorPickerVisible, setColorPickerVisible] = useState<boolean>(false);
  const [rocketPickerVisible, setRocketPickerVisible] = useState<boolean>(false);
  const [rocketSvgs, setRocketSvgs] = useState<string[]>([]);
  const [modifiedRocketSvgs, setModifiedRocketSvgs] = useState<string[]>([]);

  // Load saved preferences when component mounts
  // This is now handled by the RocketContext

  // Načtení všech raket při spuštění komponenty
  useEffect(() => {
    const loadRockets = async () => {
      try {
        // Načtení SVG souborů - zde je potřeba správně importovat soubory z assets
        // Toto je příklad, jak by se soubory mohly importovat
        const rocket1 = require('../../assets/images/rockets/rocket1.svg');
        const rocket2 = require('../../assets/images/rockets/rocket2.svg');
        const rocket3 = require('../../assets/images/rockets/rocket3.svg');
        const rocket4 = require('../../assets/images/rockets/rocket4.svg');
        const rocket5 = require('../../assets/images/rockets/rocket5.svg');

        //console.log(rocket1, rocket2, rocket3, rocket4, rocket5);

        // Načtení obsahu SVG souborů
        const svg1 = await loadSvgAsset(rocket1);
        const svg2 = await loadSvgAsset(rocket2);
        const svg3 = await loadSvgAsset(rocket3);
        const svg4 = await loadSvgAsset(rocket4);
        const svg5 = await loadSvgAsset(rocket5);

        // Uložení SVG textů do stavu
        setRocketSvgs([svg1, svg2, svg3, svg4, svg5].filter(svg => svg !== null));
      } catch (error) {
        console.error('Error loading rocket SVGs:', error);
      }
    };

    loadRockets();
  }, []);

  // Aktualizace barev raket při změně barvy nebo po načtení raket
  useEffect(() => {
    if (rocketSvgs.length > 0) {
      // Modifikace SVG pro změnu barev
      const updatedSvgs = rocketSvgs.map(svg => {
        // Nahrazení barvy v atributech fill pro elementy s id="body" a id="trail"
        let modifiedSvg = svg.replaceAll("_body_", bodyColor).replaceAll("_trail_", trailColor);
        return modifiedSvg;
      });

      setModifiedRocketSvgs(updatedSvgs);
    }
  }, [rocketSvgs, bodyColor, trailColor]);

  const openColorPicker = (type: 'body' | 'trail'): void => {
    setCurrentPickingFor(type);
    setColorPickerVisible(true);
  };

  const onColorChangeComplete = (color: string): void => {
    if (currentPickingFor === 'body') {
      setBodyColor(color);
    } else if (currentPickingFor === 'trail') {
      setTrailColor(color);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
          <ThemedText style={styles.backText}>Zpět</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>Upravit profil</ThemedText>

        {/* Avatar Selection Options */}
        <View style={styles.avatarOptions}>
          {/* Body Color Option */}
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[styles.colorOption, { backgroundColor: bodyColor }]}
              onPress={() => openColorPicker('body')}
            />
            <ThemedText style={styles.optionLabel}>Barva rakety</ThemedText>
          </View>

          {/* Rocket Shape Option */}
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

          {/* Trail Color Option */}
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
            defaultValue={name}
            onChangeText={(text) => setName(text.trim())}
            placeholderTextColor="#666"
          />
        </View>

        {/* Teacher Mode Toggle */}
        <View style={styles.teacherModeContainer}>
          <ThemedText style={styles.teacherModeLabel}>Učitelský režim</ThemedText>
          <Switch
            value={teacherMode}
            onValueChange={setTeacherMode}
            thumbColor={teacherMode ? '#fff' : '#bbb'}
            trackColor={{ false: '#333', true: '#4A5BD2' }}
          />
        </View>
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
            <ThemedText type="subtitle" style={styles.colorPickerTitle}>
              {currentPickingFor === 'body' ? 'Vyberte barvu rakety' : 'Vyberte barvu stopy'}
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
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>Zrušit</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => setColorPickerVisible(false)}
              >
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>Potvrdit</ThemedText>
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
            <ThemedText type="subtitle" style={styles.colorPickerTitle}>Vyberte raketu</ThemedText>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 20,
    textAlign: 'center',
  },
  avatarOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 30,
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
    width: 120, // Increased from 60
    height: 120, // Increased from 60
    borderRadius: 60, // Adjusted to match the new size
    backgroundColor: '#121212',
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
    width: '100%',
    marginTop: 30,
  },
  nameLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: '#121212',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  teacherModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  teacherModeLabel: {
    color: 'white',
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
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  rocketPickerContainer: {
    width: '80%',
    backgroundColor: '#121212',
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
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#FF7733',
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
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRocketOption: {
    borderColor: '#FF7733',
  },
});