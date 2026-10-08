// Weekly Meet & Greet with the Author — all enrolled students included.
// Page: session + countdown + author + join + calendar + reminder + weekly schedule,
// 7-part format, attendance tracking, Q&A submit/upvote, recordings, archive, notes.
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Linking, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../src/theme';
import { MEETINGS } from '../src/data/gamification';
import { MEET_AUTHOR, MEET_FORMAT, MEET_ARCHIVE, MEET_QUESTION_SEED, type MeetQuestion } from '../src/data/meet';
import { countdownTo, countdownLabel, icsFor, nextWeekly, markAttended, addQuestion, toggleUpvote, topQuestions } from '../src/lib/meet';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip, LinkButton } from '../src/components/ui';
import { useAuth } from '../src/store/store';

const ATT_KEY = 'amp-attendance';
const Q_KEY = 'amp-meet-questions';
const VOTED_KEY = 'amp-meet-voted';
const REM_KEY = 'amp-meet-reminder';

export default function Meet() {
  const m = MEETINGS[0];
  const { auth } = useAuth();
  const [now, setNow] = useState(Date.now());
  const [attended, setAttended] = useState<string[]>([]);
  const [questions, setQuestions] = useState<MeetQuestion[]>(MEET_QUESTION_SEED);
  const [voted, setVoted] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [reminder, setReminder] = useState(false);
  const [calMsg, setCalMsg] = useState('');

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    AsyncStorage.getItem(ATT_KEY).then((s) => s && setAttended(JSON.parse(s)));
    AsyncStorage.getItem(Q_KEY).then((s) => s && setQuestions(JSON.parse(s)));
    AsyncStorage.getItem(VOTED_KEY).then((s) => s && setVoted(JSON.parse(s)));
    AsyncStorage.getItem(REM_KEY).then((s) => s && setReminder(JSON.parse(s) === true));
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(ATT_KEY, JSON.stringify(attended)).catch(() => {});
  }, [attended]);
  useEffect(() => {
    AsyncStorage.setItem(Q_KEY, JSON.stringify(questions)).catch(() => {});
  }, [questions]);
  useEffect(() => {
    AsyncStorage.setItem(VOTED_KEY, JSON.stringify(voted)).catch(() => {});
  }, [voted]);

  const cd = countdownTo(m.startsAt, now);
  const date = new Date(m.startsAt);
  const enrolled = auth.enrolled || Boolean(auth.email);
  const rsvpd = attended.includes(m.id);

  async function addCalendar() {
    const ics = icsFor({ title: m.title, description: m.description, url: m.meetingUrl, startsAtISO: m.startsAt });
    setCalMsg('');
    if (Platform.OS === 'web') {
      try {
        const url = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
        await Linking.openURL(url);
        setCalMsg('✓ Calendar file opened — save it to add the weekly session.');
        return;
      } catch {
        // fall through to copy
      }
    }
    await Clipboard.setStringAsync(ics).catch(() => {});
    setCalMsg('✓ Copied .ics — paste into a file named meet.ics, then open it to add to your calendar.');
  }

  function toggleReminder() {
    const next = !reminder;
    setReminder(next);
    AsyncStorage.setItem(REM_KEY, JSON.stringify(next)).catch(() => {});
  }

  function submitQuestion() {
    const next = addQuestion(questions, auth.name || 'Student', draft);
    if (next.length !== questions.length) {
      setQuestions(next);
      setDraft('');
    }
  }

  function vote(id: string) {
    const r = toggleUpvote(questions, id, voted);
    setQuestions(r.list);
    setVoted(r.voted);
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>WEEKLY • RECURRING • {enrolled ? 'ENROLLED ✓' : 'OPEN TO ALL ENROLLED STUDENTS'}</Eyebrow>
        <H1>{m.title}</H1>
        <Body>{m.description}</Body>

        <Card style={s.hero}>
          <View style={s.row}>
            <Chip label="WEEKLY RECURRING" tone="accent" />
            <Chip label={countdownLabel(cd)} tone={cd.past ? 'default' : 'success'} />
          </View>
          <Text style={s.when}>{date.toLocaleString()}</Text>
          <Text style={s.count}>{countdownLabel(cd)}</Text>
          <Muted>Then weekly: next after this is {new Date(nextWeekly(m.startsAt)).toLocaleDateString()} (same link, same time).</Muted>
          <Pressable style={s.join} onPress={() => Linking.openURL(m.meetingUrl)}>
            <Text style={s.joinT}>Join Meeting →</Text>
          </Pressable>
          <View style={s.row}>
            <Pressable onPress={addCalendar} style={s.cal}>
              <Text style={s.calT}>＋ Add to Calendar</Text>
            </Pressable>
            <Pressable onPress={toggleReminder} style={[s.cal, reminder && s.calOn]}>
              <Text style={s.calT}>{reminder ? '✓ Reminder on' : '○ Meeting reminder'}</Text>
            </Pressable>
          </View>
          {!!calMsg && <Muted>{calMsg}</Muted>}
          <Muted>Link: {m.meetingUrl}</Muted>
        </Card>

        <H2>Your host — the Author</H2>
        <Card>
          <Text style={s.author}>
            {MEET_AUTHOR.emoji} {MEET_AUTHOR.name}
          </Text>
          <Muted>{MEET_AUTHOR.role}</Muted>
          <Body>{MEET_AUTHOR.bio}</Body>
        </Card>

        <H2>Session format (60 min, beginner-paced)</H2>
        {MEET_FORMAT.map((seg, i) => (
          <Card key={seg.title}>
            <View style={s.row}>
              <Text style={s.segN}>{i + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.aT}>
                  {seg.title} <Text style={s.mins}>• {seg.minutes} min</Text>
                </Text>
                <Text style={s.aD}>{seg.detail}</Text>
              </View>
            </View>
          </Card>
        ))}

        <H2>Attendance ({attended.length} marked)</H2>
        <Card>
          <Body>{rsvpd ? 'You’re marked for this session ✓ — see you there!' : 'Tap when you join (or after watching the recording).'}</Body>
          <Pressable onPress={() => setAttended((a) => markAttended(a, m.id))} style={[s.cal, rsvpd && s.calOn]}>
            <Text style={s.calT}>{rsvpd ? '✓ Attending this week' : '○ Mark me attending'}</Text>
          </Pressable>
          {MEET_ARCHIVE.map((a) => (
            <View key={a.id} style={s.archRow}>
              <Text style={s.aD}>
                {attended.includes(a.id) ? '✓ ' : '○ '}
                {a.title}
              </Text>
              {!attended.includes(a.id) && (
                <Pressable onPress={() => setAttended((x) => markAttended(x, a.id))}>
                  <Text style={s.markT}>mark ✓</Text>
                </Pressable>
              )}
            </View>
          ))}
        </Card>

        <H2>Submit a question + upvote</H2>
        <Card>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="e.g. L2M1L1: git says … (one sentence + lesson ID)"
            placeholderTextColor="#64748b"
            style={s.input}
            multiline
            maxLength={280}
          />
          <Pressable onPress={submitQuestion} style={s.cal}>
            <Text style={s.calT}>Submit question</Text>
          </Pressable>
          <Muted>Top-voted first in Student Q&A. One sentence + lesson ID gets answered fastest.</Muted>
        </Card>
        {topQuestions(questions, 10).map((q) => (
          <Card key={q.id}>
            <View style={s.row}>
              <Pressable onPress={() => vote(q.id)} style={[s.vote, voted.includes(q.id) && s.voteOn]}>
                <Text style={s.voteT}>▲ {q.votes}</Text>
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={s.aD}>{q.body}</Text>
                <Muted>— {q.author}{voted.includes(q.id) ? ' • you upvoted ✓' : ''}</Muted>
              </View>
            </View>
          </Card>
        ))}

        <H2>Recordings + archive + notes</H2>
        {MEET_ARCHIVE.map((a) => (
          <Card key={a.id}>
            <Text style={s.aT}>{a.title}</Text>
            <Muted>Held {a.heldOn} • {attended.includes(a.id) ? 'attended ✓' : 'recording below'}</Muted>
            <Pressable onPress={() => Linking.openURL(a.recordingUrl)} style={s.cal}>
              <Text style={s.calT}>▶ Play recording</Text>
            </Pressable>
            <Text style={s.notesH}>Meeting notes:</Text>
            {a.notes.map((n) => (
              <Text key={n} style={s.aD}>
                • {n}
              </Text>
            ))}
          </Card>
        ))}

        <Card>
          <Text style={s.aT}>How to prepare (2 minutes)</Text>
          <Text style={s.aD}>1) One-sentence question + lesson ID  2) Error message ready  3) Join 2 min early to test audio.</Text>
        </Card>
        <LinkButton href="/community" title="Discuss in Weekly Meet Discussions →" />
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  hero: { borderColor: Theme.colors.primary },
  when: { color: '#fff', fontFamily: Theme.fonts.bold, fontSize: 17, marginTop: 10 },
  count: { color: Theme.colors.success, fontFamily: Theme.fonts.black, fontSize: 26, marginTop: 4 },
  join: { backgroundColor: Theme.colors.success, padding: 16, borderRadius: Theme.radius.sm, marginVertical: 12, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  joinT: { color: '#052e16', fontFamily: Theme.fonts.bold, fontSize: 17 },
  cal: { backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.radius.sm, paddingHorizontal: 14, paddingVertical: 12, minHeight: Theme.touch.min, justifyContent: 'center', marginTop: 6 },
  calOn: { borderColor: Theme.colors.success },
  calT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold },
  author: { color: '#fff', fontFamily: Theme.fonts.bold, fontSize: 18 },
  segN: { color: Theme.colors.onPrimary, backgroundColor: Theme.colors.primary, width: 28, height: 28, textAlign: 'center', fontFamily: Theme.fonts.black, fontSize: 16, borderRadius: 14, overflow: 'hidden' },
  aT: { color: '#fff', fontFamily: Theme.fonts.bold, fontSize: 15 },
  mins: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 12 },
  aD: { color: Theme.colors.text, fontFamily: Theme.fonts.regular, marginTop: 4, lineHeight: 20 },
  archRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderTopWidth: 1, borderTopColor: Theme.colors.border, marginTop: 6 },
  markT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold },
  input: { backgroundColor: Theme.colors.surface, color: '#fff', borderRadius: Theme.radius.md, padding: 12, marginVertical: 6, borderWidth: 1, borderColor: Theme.colors.border, minHeight: 64 },
  vote: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, minWidth: 56, alignItems: 'center' },
  voteOn: { borderColor: Theme.colors.primary, backgroundColor: Theme.colors.surface },
  voteT: { color: Theme.colors.primary, fontFamily: Theme.fonts.bold },
  notesH: { color: '#fff', fontFamily: Theme.fonts.bold, marginTop: 8 },
});
