import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

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
