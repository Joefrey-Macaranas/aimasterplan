// PHASE 08 — COPY & FOLLOW SYSTEM + PHASE 07 video chapters UI (RN components)
// Beginner-friendly: big tap targets, plain labels, 5 clearly-distinguished step kinds.
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Theme } from '../theme';
import type { LessonStep, Chapter } from '../types/models';
import { MelroseIcon, MELROSE, type MelroseName } from './icons';

const KIND_META: Record<LessonStep['kind'], { label: string; icon: MelroseName; help: string }> = {
  USER_ACTION: { label: 'USER ACTION — YOU DO THIS', icon: MELROSE.userAction as MelroseName, help: 'Follow this exactly — no guessing. Opens the Tools Vault when you need an app.' },
  AI_PROMPT: { label: 'AI PROMPT — COPY PROMPT', icon: MELROSE.aiPrompt as MelroseName, help: 'Tap Copy Prompt, paste into your AI assistant, press Enter.' },
  TERMINAL_COMMAND: { label: 'TERMINAL COMMAND — COPY COMMAND', icon: MELROSE.terminal as MelroseName, help: 'Tap Copy Command, paste into your terminal, press Enter.' },
  CODE: { label: 'CODE — COPY CODE', icon: MELROSE.code as MelroseName, help: 'Tap Copy Code — this is the exact code from the walkthrough.' },
  EXPECTED_RESULT: { label: 'EXPECTED RESULT — WHAT SHOULD I SEE?', icon: MELROSE.expectedResult as MelroseName, help: 'Compare your screen with the description + screenshot frame. Different? Read “What if mine looks different?”' },
};

const COPY_LABEL: Partial<Record<LessonStep['kind'], string>> = {
  AI_PROMPT: 'Copy Prompt',
  TERMINAL_COMMAND: 'Copy Command',
  CODE: 'Copy Code',
};

export function CopyBlock({ step, index, shotCaption }: { step: LessonStep; index?: number; shotCaption?: string }) {
  const [copied, setCopied] = React.useState(false);
  const [showFix, setShowFix] = React.useState(false);
  const meta = KIND_META[step.kind];
  const copyable = step.kind === 'AI_PROMPT' || step.kind === 'CODE' || step.kind === 'TERMINAL_COMMAND';
  async function onCopy() {
    try {
      await Clipboard.setStringAsync(step.body);
    } catch {
      // clipboard unavailable (web private mode) — still show feedback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  const bg =
    step.kind === 'TERMINAL_COMMAND' || step.kind === 'CODE'
      ? '#000000'
      : step.kind === 'AI_PROMPT'
        ? '#ffffff'
        : step.kind === 'EXPECTED_RESULT'
          ? '#ffffff'
          : '#f7f7f7';
  const accentBorder =
    step.kind === 'AI_PROMPT'
      ? Theme.colors.primary
      : step.kind === 'EXPECTED_RESULT'
        ? Theme.colors.success
        : Theme.colors.border;
  return (
    <View style={styles.block}>
      <View style={styles.row}>
        <View style={styles.kindRow}>
          <MelroseIcon name={meta.icon} size={14} color={Theme.colors.muted} />
          <Text style={styles.kind}>
            {typeof index === 'number' ? `STEP ${index + 1} • ` : ''}
            {meta.label}
          </Text>
        </View>
        {copyable ? (
          <Pressable onPress={onCopy} style={[styles.btn, copied && styles.btnDone]} accessibilityLabel={COPY_LABEL[step.kind]}>
            <Text style={styles.btnText}>{copied ? 'Copied ✓' : COPY_LABEL[step.kind]}</Text>
          </Pressable>
        ) : step.kind === 'USER_ACTION' ? (
          <Link href="/tools" asChild>
            <Pressable style={styles.toolBtn} accessibilityLabel="Open Tool">
              <View style={styles.toolBtnRow}>
                <Text style={styles.toolBtnText}>Open Tool</Text>
                <MelroseIcon name="external-link" size={13} color={Theme.colors.accent} />
              </View>
            </Pressable>
          </Link>
        ) : (
          <View style={styles.whyPill}>
            <Text style={styles.whyPillText}>CHECK</Text>
          </View>
        )}
      </View>
      <Text style={styles.label}>{step.label}</Text>
      <Text style={styles.help}>{meta.help}</Text>
      <View style={[styles.codeBox, { backgroundColor: bg, borderColor: accentBorder, borderLeftWidth: 3 }]}>
        <Text selectable style={[styles.body, (step.kind === 'TERMINAL_COMMAND' || step.kind === 'CODE') && styles.mono]}>
          {step.body}
        </Text>
      </View>
      {step.kind === 'EXPECTED_RESULT' && (
        <View style={styles.shot}>
          <View style={styles.shotTitleRow}>
            <MelroseIcon name="image" size={14} color={Theme.colors.text} />
            <Text style={styles.shotTitle}>Screenshot — what success looks like</Text>
          </View>
          <View style={styles.shotFrame}>
            <Text style={styles.shotText}>{shotCaption ?? 'Walkthrough frame at this step: success message + expected screen (video shows it).'}</Text>
          </View>
          <Text style={styles.wssi}>What should I see? {step.body}</Text>
          <Pressable onPress={() => setShowFix((v) => !v)} style={styles.fixToggle}>
            <Text style={styles.fixToggleT}>What if mine looks different? {showFix ? '− hide' : '+ show'}</Text>
          </Pressable>
          {showFix && (
            <Text style={styles.fixBody}>
              1) Re-read the step above — one skipped line causes most mismatches.{'\n'}
              2) Compare with the screenshot frame word for word.{'\n'}
              3) Re-run only this step, then open this lesson's Troubleshooting guide below.
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

export function Chapters({ chapters, onSeek }: { chapters: Chapter[]; onSeek?: (c: Chapter) => void }) {
  return (
    <View>
      {chapters.map((c) => (
        <Pressable key={`${c.time}-${c.title}`} onPress={() => onSeek?.(c)} style={styles.chRow}>
          <Text style={styles.time}>{c.time}</Text>
          <Text style={styles.chTitle}>{c.title}</Text>
          {onSeek ? (
            <View style={styles.jumpRow}>
              <Text style={styles.jump}>Jump</Text>
              <MelroseIcon name="chevron-right" size={13} color={Theme.colors.muted} />
            </View>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 0, padding: 20, marginVertical: 8, backgroundColor: Theme.colors.card },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  kindRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  kind: { color: Theme.colors.muted, fontFamily: Theme.fonts.bold, fontSize: 11, letterSpacing: 2, flex: 1, textTransform: 'uppercase' },
  label: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 15, marginTop: 8 },
  help: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 12, marginBottom: 8, marginTop: 2 },
  body: { color: Theme.colors.text, fontFamily: Theme.fonts.regular, fontSize: 14, lineHeight: 20 },
  mono: { fontFamily: Theme.fonts.mono, color: '#fff' },
  codeBox: { borderRadius: 0, padding: 14, borderWidth: 1 },
  btn: { backgroundColor: Theme.colors.primary, borderWidth: 1, borderColor: Theme.colors.primary, borderRadius: 0, paddingHorizontal: 18, paddingVertical: 10, minWidth: 88, alignItems: 'center' },
  btnDone: { backgroundColor: Theme.colors.success, borderColor: Theme.colors.success },
  btnText: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  toolBtn: { backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.accent, borderRadius: 0, paddingHorizontal: 18, paddingVertical: 10, alignItems: 'center' },
  toolBtnRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  toolBtnText: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  whyPill: { backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 0, paddingHorizontal: 12, paddingVertical: 6 },
  whyPillText: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold, fontSize: 11 },
  shot: { marginTop: 12, borderTopWidth: 1, borderTopColor: Theme.colors.border, paddingTop: 10 },
  shotTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  shotTitle: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 13 },
  shotFrame: { borderWidth: 2, borderStyle: 'dashed', borderColor: Theme.colors.success, borderRadius: 0, padding: 16, marginTop: 8, backgroundColor: Theme.colors.surface },
  shotText: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 13, textAlign: 'center' },
  wssi: { color: Theme.colors.text, fontFamily: Theme.fonts.regular, fontSize: 13, marginTop: 8 },
  fixToggle: { marginTop: 8, paddingVertical: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  fixToggleT: { color: Theme.colors.warning, fontFamily: Theme.fonts.bold, fontSize: 14 },
  fixBody: { color: Theme.colors.text, fontFamily: Theme.fonts.regular, fontSize: 13, lineHeight: 19, marginTop: 4 },
  chRow: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Theme.colors.border, alignItems: 'center' },
  time: { color: Theme.colors.accent, fontFamily: Theme.fonts.monoBold, width: 56 },
  chTitle: { color: Theme.colors.text, fontFamily: Theme.fonts.regular, flex: 1, fontSize: 14 },
  jumpRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  jump: { color: Theme.colors.muted, fontFamily: Theme.fonts.bold },
});
