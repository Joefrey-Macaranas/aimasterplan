import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Theme } from '../src/theme';
import { notifyTitle, type NotifyKind } from '../src/lib/misc';
import { Screen, H1, Body, Muted, Card, Chip } from '../src/components/ui';

const SEED: { kind: NotifyKind; body: string; time: string }[] = [
  { kind: 'continue', body: 'You’re 1 lesson from finishing Level 1. 12 minutes today keeps your streak alive.', time: '2h ago' },
  { kind: 'meetup', body: 'Weekly Meet & Greet in 3 days — bring one question, leave with one win.', time: '1d ago' },
  { kind: 'new-lesson', body: 'New walkthrough: “Components & Responsive Layouts” (L3) is live.', time: '2d ago' },
  { kind: 'achievement', body: 'You earned “First Lesson” (+50 XP). Next: copy and run your first AI prompt.', time: '3d ago' },
  { kind: 'reply', body: 'Aya replied in Project Showcase: “Nice work on P01!”', time: '4d ago' },
  { kind: 'announcement', body: 'Instructor tip: strong prompts = GOAL + CONTEXT + CONSTRAINTS + EXAMPLE.', time: '5d ago' },
];

export default function Notifications() {
  const [read, setRead] = useState<string[]>([]);
  const toggle = (t: string) => setRead((r) => (r.includes(t) ? r.filter((x) => x !== t) : [...r, t]));

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <H1>Notifications</H1>
        <Body>Gentle nudges — continue learning, join the meetup, celebrate wins. No spam.</Body>
        <Muted>
          {SEED.length - read.length} unread • Tap to mark read
        </Muted>
        {SEED.map((n, i) => {
          const key = `${n.kind}-${i}`;
          const isRead = read.includes(key);
          return (
            <Pressable key={key} onPress={() => toggle(key)}>
              <Card style={isRead ? s.read : s.unread}>
                <View style={s.row}>
                  <Chip label={notifyTitle(n.kind)} tone={isRead ? 'default' : 'accent'} />
                  <Muted>{n.time}</Muted>
                </View>
                <Text style={s.body}>{n.body}</Text>
                <Muted>{isRead ? 'Read ✓' : 'Unread • tap to mark read'}</Muted>
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  body: { color: Theme.colors.text, marginTop: 8, lineHeight: 20 },
  unread: { borderColor: Theme.colors.accent },
  read: { opacity: 0.75 },
});
