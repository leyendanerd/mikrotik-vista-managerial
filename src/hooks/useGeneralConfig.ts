import { useState, useEffect } from 'react';

export interface GeneralConfig {
  appName: string;
  loginIcon: string;
  refreshInterval: number;
  enableNotifications: boolean;
  darkMode: boolean;
}

const defaultConfig: GeneralConfig = {
  appName: 'MikroTik Dashboard',
  loginIcon: 'Monitor',
  refreshInterval: 30,
  enableNotifications: true,
  darkMode: false,
};

export const useGeneralConfig = () => {
  const [config, setConfig] = useState<GeneralConfig>(() => {
    const stored = localStorage.getItem('general-config');
    return stored ? { ...defaultConfig, ...JSON.parse(stored) } : defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem('general-config', JSON.stringify(config));
  }, [config]);

  return [config, setConfig] as const;
};
