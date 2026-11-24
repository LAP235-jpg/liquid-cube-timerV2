import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { loadSettings, saveSettings } from '../services/storage';
import { DEFAULT_SETTINGS, type Settings } from '../types/Settings';

interface SettingsContextValue {
  settings: Settings;
  loaded: boolean;
  updateSettings: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(settings);

  useEffect(() => {
    let active = true;
    loadSettings()
      .then((s) => {
        if (!active) return;
        ref.current = s;
        setSettings(s);
      })
      .catch(() => undefined) // mantém os padrões se a leitura falhar
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    const next = { ...ref.current, ...patch };
    ref.current = next;
    setSettings(next);
    saveSettings(next).catch(() => undefined);
  }, []);

  const value = useMemo(() => ({ settings, loaded, updateSettings }), [settings, loaded, updateSettings]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings deve ser usado dentro de SettingsProvider');
  return ctx;
}
