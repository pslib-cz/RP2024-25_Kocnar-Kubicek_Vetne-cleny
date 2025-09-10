import { ThemedText } from '@/components/ThemedText';
import { useRocket } from '@/contexts/RocketContext';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Modal, StatusBar, StyleSheet, TextInput, TouchableOpacity, View, Switch } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { rocket1, rocket2, rocket3, rocket4, rocket5 } from '@/data/rocketsImages';
import { router } from 'expo-router';
import PageWrapper from '@/components/PageWrapper';
import { ColorPickerModal } from '@/components/modals/ColorPickerModal';
import { RocketPickerModal } from '@/components/modals/RocketPickerModal';

export const loadSvgAsset = async (assetModule: any): Promise<string | null> => {
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

export default function ProfileEditScreen(): React.ReactElement {
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

  useEffect(() => {
    const loadRockets = async () => {
      try {
        const svg1 = await loadSvgAsset(rocket1);
        const svg2 = await loadSvgAsset(rocket2);
        const svg3 = await loadSvgAsset(rocket3);
        const svg4 = await loadSvgAsset(rocket4);
        const svg5 = await loadSvgAsset(rocket5);

        setRocketSvgs([svg1, svg2, svg3, svg4, svg5].filter(svg => svg !== null));
      } catch (error) {
        console.warn('Error loading rocket SVGs:', error);
      }
    };

    loadRockets();
  }, []);

  useEffect(() => {
    if (rocketSvgs.length > 0) {
      const updatedSvgs = rocketSvgs.map(svg => {
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
    <PageWrapper>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
            onChangeText={(text) => setName(text.trim().slice(0, 32))}
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

      <ColorPickerModal
        isVisible={colorPickerVisible}
        onClose={() => setColorPickerVisible(false)}
        subtitle={currentPickingFor === 'body' ? 'Vyberte barvu rakety' : 'Vyberte barvu stopy'}
        currentColor={currentPickingFor === 'body' ? bodyColor : trailColor}
        onColorChangeComplete={onColorChangeComplete}
      />

      <RocketPickerModal
        isVisible={rocketPickerVisible}
        onClose={() => setRocketPickerVisible(false)}
        rocketSvgs={modifiedRocketSvgs}
        selectedRocketIndex={selectedRocketIndex}
        onRocketSelect={setSelectedRocketIndex}
      />
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
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
});