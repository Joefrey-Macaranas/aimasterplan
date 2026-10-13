// Theme mode store — light/dark toggle, persisted offline-first.
// Logo tap toggles mode. Shared UI primitives read from here.
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../theme';

export type ThemeMode = 'light' | 'dark';
export type ThemeColors = Record<keyof typeof Theme.colors, string>;

export const lightColors: ThemeColors = { ...Theme.colors };

export const darkColors: ThemeColors = {
  bg: '#0B1020',
  surface: '#151B2E',
  card: '#11162A',
  primary: '#FFFFFF',
  onPrimary: '#0B1020',
  goldBorder: '#FFFFFF',
  accent: '#7DD3FC',
  link: '#7DD3FC',
  blue: '#7DD3FC',
  success: '#4ADE80',
  warning: '#FACC15',
  danger: '#F87171',
  text: '#F8FAFC',
  muted: '#A0AAB8',
  border: '#232A44',
};

const KEY = 'amp-theme-mode';

interface ThemeApi {
  mode: ThemeMode;
  dark: boolean;
  colors: ThemeColors;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
}

const Ctx = createContext<ThemeApi | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((s) => {
      if (s === 'light' || s === 'dark') setModeState(s);
    }).catch(() => {});
  }, []);

  const value = useMemo<ThemeApi>(() => {
    const dark = mode === 'dark';
    return {
      mode,
      dark,
      colors: dark ? darkColors : lightColors,
      toggle: () => {
        setModeState((m) => {
          const next: ThemeMode = m === 'dark' ? 'light' : 'dark';
          AsyncStorage.setItem(KEY, next).catch(() => {});
          return next;
        });
      },
      setMode: (m: ThemeMode) => {
        setModeState(m);
        AsyncStorage.setItem(KEY, m).catch(() => {});
      },
    };
  }, [mode]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): Omit<typeof Theme, 'colors'> & ThemeApi {
  const v = useContext(Ctx);
  if (!v) {
    // Fallback outside provider (tests / isolated render): light mode, no-op toggle.
    return { ...Theme, mode: 'light' as ThemeMode, dark: false, colors: lightColors, toggle: () => {}, setMode: () => {} };
  }
  const { colors: _ignored, ...rest } = Theme;
  void _ignored;
  return { ...rest, ...v };
}

// Pure helper for tests: flip mode without React.
export function nextMode(mode: ThemeMode): ThemeMode {
  return mode === 'dark' ? 'light' : 'dark';
}
