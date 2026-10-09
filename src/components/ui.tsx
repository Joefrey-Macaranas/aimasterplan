// Shared UI primitives — mobile-first design system (phone + tablet, Android + iOS)
// freeCodeCamp dark-theme language: deep navy, gold CTA buttons, square cards, Lato type.
// Every screen composes from these: Screen, headers, cards, buttons, grids, states.
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Theme } from '../theme';
import { Svg, Path, Circle } from 'react-native-svg';
import { MelroseIcon, type MelroseName } from './icons';

export const IS_TABLET_QUERY = Theme.breakpoints.tablet;

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isTablet = width >= Theme.breakpoints.tablet;
  const isDesktop = width >= Theme.breakpoints.desktop;
  const pad = isTablet ? Theme.layout.screenPadTablet : Theme.layout.screenPadPhone;
  const maxW = isDesktop ? Theme.layout.desktopMax : isTablet ? Theme.layout.tabletMax : Theme.layout.phoneMax;
  const cols = isDesktop ? 3 : isTablet ? 2 : 1;
  return { width, isTablet, isDesktop, pad, maxW, cols };
}

// Screen: SafeArea + responsive padding + centered max-width column.
// Use on every screen for consistent phone/tablet + Android/iOS notch handling.
export function Screen({ children, padded = true }: { children: React.ReactNode; padded?: boolean }) {
  const { pad, maxW } = useResponsive();
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[styles.screen, padded && { padding: pad }]}>
        <View style={{ width: '100%', maxWidth: maxW, alignSelf: 'center', flex: 1 }}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

// Responsive grid: 1 col phone, 2 col tablet, 3 col desktop. Children wrap automatically.
export function Grid({ children, gap = 8 }: { children: React.ReactNode; gap?: number }) {
  const { cols } = useResponsive();
  const items = React.Children.toArray(children);
  if (cols === 1) return <View style={{ gap }}>{items.map((c, i) => <View key={i}>{c}</View>)}</View>;
  const basis = cols === 2 ? '49%' : '32%';
  return (
    <View style={[styles.grid, { gap }]}>
      {items.map((c, i) => (
        <View key={i} style={{ flexBasis: basis as never, flexGrow: 1, minWidth: 220 }}>
          {c}
        </View>
      ))}
    </View>
  );
}

export function H1({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.h1, style]}>{children}</Text>;
}
export function H2({ children }: { children: React.ReactNode }) {
  return <Text style={styles.h2}>{children}</Text>;
}
export function H3({ children }: { children: React.ReactNode }) {
  return <Text style={styles.h3}>{children}</Text>;
}
export function Body({ children }: { children: React.ReactNode }) {
  return <Text style={styles.body}>{children}</Text>;
}
export function Muted({ children }: { children: React.ReactNode }) {
  return <Text style={styles.muted}>{children}</Text>;
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Divider() {
  return <View style={styles.divider} />;
}

export function Chip({ label, tone = 'default', icon }: { label: string; tone?: 'default' | 'success' | 'warning' | 'accent'; icon?: MelroseName }) {
  const bg =
    tone === 'success' ? '#e6f4ea' : tone === 'warning' ? '#fef7e0' : tone === 'accent' ? '#000000' : Theme.colors.surface;
  const fg = tone === 'success' ? Theme.colors.success : tone === 'warning' ? Theme.colors.warning : tone === 'accent' ? '#fff' : Theme.colors.muted;
  return (
    <View style={[styles.chip, { backgroundColor: bg, borderColor: Theme.colors.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {icon ? <MelroseIcon name={icon} size={13} color={fg} /> : null}
        <Text style={[styles.chipText, { color: fg }]}>{label}</Text>
      </View>
    </View>
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <View style={styles.barTrack} accessibilityLabel={`Progress ${clamped} percent`}>
      <View style={[styles.barFill, { width: `${clamped}%` }]} />
    </View>
  );
}

const MIN_TOUCH = { minHeight: Theme.touch.min, justifyContent: 'center' as const };

// Primary gold CTA — 44px+ target, works on iOS/Android/web.
export function PrimaryButton({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.primary, MIN_TOUCH]} accessibilityRole="button">
      <Text style={styles.primaryText}>{title}</Text>
    </Pressable>
  );
}

export function LinkButton({ href, title }: { href: string; title: string }) {
  return (
    <Link href={href as never} asChild>
      {/* NOTE: flatten — expo-router web Slot passes style straight to <a>, arrays crash react-dom. */}
      <Pressable style={StyleSheet.flatten([styles.linkBtn, MIN_TOUCH])} accessibilityRole="button">
        <Text style={styles.linkBtnText}>{title}</Text>
      </Pressable>
    </Link>
  );
}

export function GhostButton({ href, title }: { href: string; title: string }) {
  return (
    <Link href={href as never} asChild>
      <Pressable style={StyleSheet.flatten([styles.ghostBtn, MIN_TOUCH])} accessibilityRole="button">
        <Text style={styles.ghostBtnText}>{title}</Text>
      </Pressable>
    </Link>
  );
}

export function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

// Segmented control (tabs within a screen: e.g. project workspace phases)
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.segWrap} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o === value;
        return (
          <Pressable
            key={o}
            onPress={() => onChange(o)}
            style={[styles.seg, on && styles.segOn, MIN_TOUCH]}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
          >
            <Text style={[styles.segT, on && styles.segTOn]}>{o}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <Card>
      <H3>{title}</H3>
      <Muted>{hint}</Muted>
    </Card>
  );
}

// Small platform note (e.g. "On Android: … / On iOS: …") — keeps instructions correct per OS.
// Melrose style: thin info line-icon + hairline dashed card, no emoji.
export function PlatformNote({ ios, android }: { ios?: string; android?: string }) {
  const msg = Platform.select({ ios, android, default: ios ?? android });
  if (!msg) return null;
  return (
    <Card style={styles.platNote}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <MelroseIcon name="info" size={15} color={Theme.colors.muted} />
        <Muted>
          {Platform.OS === 'ios' ? 'iOS: ' : Platform.OS === 'android' ? 'Android: ' : 'Note: '}
          {msg}
        </Muted>
      </View>
    </Card>
  );
}

// Rocket icon — Melrose style: thin black line, no gold fill, used in Deploy tab
export function RocketIcon({ size = 20, color }: { size?: number; color?: string }) {
  const ink = color ?? Theme.colors.primary;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.5 16.5c-1.5 1.5-3 3.375-3 5.25a3.75 3.75 0 0 0 7.5 0c0-1.875-1.5-3.75-3-5.25z"
        stroke={ink}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M9 12c0-1.5 1.125-3 2.25-3.375a3.375 3.375 0 0 1 6.75 0c0 3-2.25 4.5-3 6.75a3.375 3.375 0 0 1-6.75 0c-1.125 0-2.25-1.5-2.25-3.375z"
        stroke={ink}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx="12.4" cy="7.1" r="1.1" stroke={ink} strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.colors.bg },
  screen: { flex: 1, backgroundColor: Theme.colors.bg },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  eyebrow: {
    color: Theme.colors.muted,
    fontFamily: Theme.fonts.bold,
    fontSize: Theme.typography.tiny,
    letterSpacing: 2,
    marginVertical: 4,
    textTransform: 'uppercase',
  },
  h1: { color: Theme.colors.text, fontFamily: Theme.fonts.display, fontSize: Theme.typography.hero, marginTop: 8 },
  h2: { color: Theme.colors.text, fontFamily: Theme.fonts.display, fontSize: Theme.typography.title, marginTop: 28, marginBottom: 8 },
  h3: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: Theme.typography.subtitle, marginTop: 16, marginBottom: 6 },
  body: { color: Theme.colors.text, fontFamily: Theme.fonts.regular, fontSize: Theme.typography.body, lineHeight: 24, marginVertical: 4 },
  muted: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: Theme.typography.small, lineHeight: 20, marginVertical: 4 },
  card: { backgroundColor: Theme.colors.card, borderColor: Theme.colors.border, borderWidth: 1, borderRadius: 0, padding: 20, marginVertical: 8 },
  divider: { height: 1, backgroundColor: Theme.colors.border, marginVertical: 16 },
  chip: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 0, paddingHorizontal: 12, paddingVertical: 6, marginVertical: 4, marginRight: 6 },
  chipText: { fontFamily: Theme.fonts.bold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  barTrack: { height: 8, borderRadius: 0, backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, overflow: 'hidden', marginVertical: 10 },
  barFill: { height: '100%', backgroundColor: Theme.colors.primary },
  primary: { backgroundColor: Theme.colors.primary, borderWidth: 1, borderColor: Theme.colors.primary, paddingVertical: 16, paddingHorizontal: 16, borderRadius: 0, alignItems: 'center', marginVertical: 10 },
  primaryText: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold, fontSize: 15, letterSpacing: 2, textTransform: 'uppercase' },
  linkBtn: { backgroundColor: Theme.colors.card, borderColor: Theme.colors.border, borderWidth: 1, borderBottomWidth: 1, paddingVertical: 16, paddingHorizontal: 16, borderRadius: 0, marginVertical: 0, marginTop: -1 },
  linkBtnText: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 15 },
  ghostBtn: { backgroundColor: 'transparent', borderColor: Theme.colors.text, borderWidth: 1, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 0, marginVertical: 8, alignItems: 'center' },
  ghostBtnText: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' },
  bulletRow: { flexDirection: 'row', gap: 10, marginVertical: 4, paddingRight: 8 },
  bulletDot: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 15 },
  bulletText: { color: Theme.colors.text, fontFamily: Theme.fonts.regular, fontSize: 14, lineHeight: 22, flex: 1 },
  segWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 0, marginVertical: 8, borderWidth: 1, borderColor: Theme.colors.border },
  seg: { backgroundColor: Theme.colors.card, borderWidth: 0, borderRightWidth: 1, borderColor: Theme.colors.border, borderRadius: 0, paddingHorizontal: 16, paddingVertical: 12, flex: 1, alignItems: 'center' },
  segOn: { backgroundColor: Theme.colors.primary, borderColor: Theme.colors.primary },
  segT: { color: Theme.colors.muted, fontFamily: Theme.fonts.bold, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  segTOn: { color: Theme.colors.onPrimary },
  platNote: { borderStyle: 'dashed', backgroundColor: Theme.colors.surface },
});
