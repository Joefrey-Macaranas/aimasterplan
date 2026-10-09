// Melrose icon system — thin minimal line icons, single style across the app.
// Rule: every UI icon is Feather @ strokeWidth 1.5, black/muted, no emoji.
// Exception: src/data/tools.ts brand icons stay untouched (tools vault keeps its own logos/emoji).
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../theme';

export type MelroseName = React.ComponentProps<typeof Feather>['name'];

export function MelroseIcon({
  name,
  size = 18,
  color,
  strokeWidth = 1.5,
}: {
  name: MelroseName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return <Feather name={name} size={size} color={color ?? Theme.colors.text} strokeWidth={strokeWidth} />;
}

// Semantic Melrose mapping (emoji → thin line). Tools icons excluded on purpose.
export const MELROSE = {
  // lesson step kinds (was 👉 💬 ⌨ 📝 ✅)
  userAction: 'navigation',
  aiPrompt: 'message-circle',
  terminal: 'terminal',
  code: 'code',
  expectedResult: 'check-circle',
  screenshot: 'image',
  // community post kinds (was ❓ 🚀 🏆 🙏 💬)
  question: 'help-circle',
  showcase: 'send',
  win: 'award',
  help: 'life-buoy',
  general: 'message-circle',
  // status / gamification (was 🔥 🏆 🔒 🎉 ♥ 🙏 💬 ⚑ 🎙️ 📖 🎚 🔧 ⬇ ↗ ▶ ⛶ ❐ ♪ 📣)
  streak: 'zap',
  trophy: 'award',
  lock: 'lock',
  unlock: 'unlock',
  heart: 'heart',
  celebrate: 'gift',
  thanks: 'thumbs-up',
  comment: 'message-circle',
  report: 'flag',
  mic: 'mic',
  book: 'book-open',
  skill: 'sliders',
  fix: 'tool',
  download: 'download',
  share: 'share-2',
  play: 'play',
  pause: 'pause',
  full: 'maximize',
  pip: 'copy',
  music: 'music',
  announce: 'bell',
  bookmark: 'bookmark',
  check: 'check',
  checkSquare: 'check-square',
  square: 'square',
  xCircle: 'x-circle',
  info: 'info',
  calendar: 'calendar',
  clock: 'clock',
  arrowRight: 'arrow-right',
  external: 'external-link',
  copy: 'copy',
  eye: 'eye',
} as const satisfies Record<string, MelroseName>;

// Emoji (data-layer keys, e.g. reactions) → Melrose Feather for presentation only.
// Data values stay unchanged so tests/storage keep working.
export const REACTION_ICON: Record<string, MelroseName> = {
  '♥': 'heart',
  '🎉': 'gift',
  '🙏': 'thumbs-up',
  '💬': 'message-circle',
};

// Small inline row: [thin icon + uppercase micro label] — Melrose list/eyebrow style.
export function IconLabel({
  icon,
  label,
  size = 14,
  color,
}: {
  icon: MelroseName;
  label: string;
  size?: number;
  color?: string;
}) {
  return (
    <View style={is.row}>
      <MelroseIcon name={icon} size={size} color={color ?? Theme.colors.muted} />
      <Text style={[is.text, color ? { color } : null]}>{label}</Text>
    </View>
  );
}

const is = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  text: {
    color: Theme.colors.muted,
    fontFamily: Theme.fonts.bold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
