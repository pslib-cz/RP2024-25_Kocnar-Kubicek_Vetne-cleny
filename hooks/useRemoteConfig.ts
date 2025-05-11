import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { RemoteConfig } from '@/types/RemoteConfig';
import localConfig from '@/data/config.json';

const REMOTE_CONFIG_URL = process.env.EXPO_PUBLIC_REMOTE_CONFIG_URL;
const ASYNC_STORAGE_KEY = 'remote_config';

export function useRemoteConfig() {
  const [config, setConfig] = useState<RemoteConfig>(localConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndStoreConfig() {
      try {
        const networkState = await Network.getNetworkStateAsync();
        console.log('[useRemoteConfig] HAS INTERNET:', networkState.isInternetReachable);
        if (networkState.isInternetReachable && REMOTE_CONFIG_URL) {
          const response = await fetch(REMOTE_CONFIG_URL);
          if (response.ok) {
            const remoteConfig: RemoteConfig = await response.json();
            setConfig(remoteConfig);
            await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(remoteConfig));
            console.log('[useRemoteConfig] Remote config loaded', remoteConfig);
            setLoading(false);
            return;
          } else {
            console.warn('[useRemoteConfig] Failed to fetch remote config. Status:', response.status);
          }
        } else {
          console.log('[useRemoteConfig] Offline or REMOTE_CONFIG_URL not set. Skipping fetch.');
        }
        // If offline or fetch fails, try to load from AsyncStorage
        const stored = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        if (stored) {
          console.log('[useRemoteConfig] Loaded config from AsyncStorage');
          setConfig(JSON.parse(stored));
        } else {
          console.log('[useRemoteConfig] No config in AsyncStorage. Using local config.');
          setConfig(localConfig);
        }
      } catch (e) {
        console.error('[useRemoteConfig] Error fetching or loading config:', e);
        // On error, fallback to local config
        setConfig(localConfig);
      } finally {
        setLoading(false);
      }
    }
    fetchAndStoreConfig();
  }, []);

  return { config, loading };
} 