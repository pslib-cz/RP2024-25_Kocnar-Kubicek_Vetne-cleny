import React, { createContext, useContext, ReactNode } from 'react';
import { useRemoteConfig } from '@/hooks/useRemoteConfig';
import { RemoteConfig } from '@/types/RemoteConfig';

interface ConfigContextValue {
  config: RemoteConfig;
  loading: boolean;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const { config, loading } = useRemoteConfig();
  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export function useConfigContext() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfigContext must be used within a ConfigProvider');
  return ctx;
} 