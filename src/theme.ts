// PHASE 02 — mobile-first design system (phone + tablet, Android + iOS)
// Visual language: Melrose light premium — white, black square buttons,
// Tenor Sans display + Outfit body, hairline borders, zero radius.
import { Platform } from 'react-native';

export const Theme = {
  colors: {
    bg: '#ffffff',
    surface: '#f7f7f7',
    card: '#ffffff',
    primary: '#000000',
    onPrimary: '#ffffff',
    goldBorder: '#000000',
    accent: '#000000',
    link: '#000000',
    blue: '#000000',
    success: '#1a7f37',
    warning: '#9a6a00',
    danger: '#dd1d1d',
    text: '#000000',
    muted: '#5c5c5c',
    border: '#e5e5e5',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 0, md: 0, lg: 0 },
  // responsive breakpoints (phone + tablet)
  breakpoints: { phone: 0, tablet: 768, desktop: 1024 },
  // responsive layout metrics
  layout: {
    screenPadPhone: 16,
    screenPadTablet: 32,
    phoneMax: 640,
    tabletMax: 860,
    desktopMax: 1100,
  },
  typography: {
    hero: 40,
    title: 26,
    subtitle: 18,
    body: 15,
    small: 13,
    tiny: 11,
  },
  fonts: {
    regular: 'Outfit_400Regular',
    light: 'Outfit_300Light',
    bold: 'Outfit_600SemiBold',
    black: 'TenorSans_400Regular',
    display: 'TenorSans_400Regular',
    mono: 'RobotoMono_400Regular',
    monoBold: 'RobotoMono_700Bold',
    // platform fallbacks while Google fonts load (esp. Android)
    fallback: Platform.select({ ios: 'System', android: 'Roboto', web: 'Inter, System', default: 'System' }),
  },
  // 44px minimum touch target (iOS HIG + Android Material)
  touch: { min: 44 },
  platform: {
    OS: Platform.OS,
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    isWeb: Platform.OS === 'web',
  },
} as const;

export type ThemeType = typeof Theme;
