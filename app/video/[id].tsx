// PHASE 07 — Recorded walkthrough player (expo-video).
// Streaming • fullscreen • portrait/landscape • speed • chapter-synced captions +
// full transcript • chapter markers • resume position • picture-in-picture.
// URLs are signed in production (see backend/schema.sql note).
import { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Theme } from '../../src/theme';
import { getLesson, LESSONS } from '../../src/data/curriculum';
import { Chapters } from '../../src/components/blocks';
import { Screen, H1, Body, Muted, Eyebrow, Card, Chip, LinkButton } from '../../src/components/ui';
import { MelroseIcon } from '../../src/components/icons';
import { useProgress } from '../../src/store/store';
import { loadPlayback, savePosition, clearPosition, formatClock, chapterAt } from '../../src/lib/playback';

const RATES = [0.75, 1, 1.25, 1.5, 2];

export default function VideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = String(id);
  const lesson = getLesson(lessonId);
  const viewRef = useRef<VideoView>(null);
  const { width } = useWindowDimensions();
  const isTablet = width >= Theme.breakpoints.tablet;
  const [rate, setRate] = useState(1);
  const [position, setPosition] = useState(0);
  const [saved, setSaved] = useState<number | null>(null);
  const [cc, setCc] = useState(true);
  const [ready, setReady] = useState(false);
  const { toggleComplete, completed } = useProgress();

  const player = useVideoPlayer(lesson ? lesson.videoUrl : '', (p) => {
    p.playbackRate = 1;
  });

  // load saved position once
  useEffect(() => {
    loadPlayback().then((map) => {
      const s = map[lessonId];
      if (s && s > 5) setSaved(s);
    });
  }, [lessonId]);

  // poll position (1s) → clock, captions, throttled resume-save
  useEffect(() => {
    if (!lesson) return;
    let lastSave = 0;
    const t = setInterval(() => {
      try {
        const cur = player.currentTime ?? 0;
        setPosition(cur);
        setReady((player.duration ?? 0) > 0);
        if (cur - lastSave > 4 || cur < lastSave) {
          lastSave = cur;
          if (cur > 5) void savePosition(lessonId, cur);
        }
      } catch {
        // player not ready yet
      }
    }, 1000);
    return () => clearInterval(t);
  }, [lesson, lessonId, player]);

  // persist on unmount
  useEffect(() => {
    return () => {
      try {
        const cur = player.currentTime ?? 0;
        if (cur > 5) void savePosition(lessonId, cur);
      } catch {
        // noop
      }
    };
  }, [lessonId, player]);

  if (!lesson) {
    return (
      <Screen>
        <H1>Video not found</H1>
        <LinkButton href="/roadmap" title="Back to roadmap" />
      </Screen>
    );
  }

  const isDone = completed.includes(lesson.id);
  const chIdx = chapterAt(lesson.chapters, position);
  const ch = lesson.chapters[chIdx];

  function seekTo(seconds: number) {
    try {
      player.currentTime = seconds;
      player.play();
    } catch {
      // offline / unsigned URL in MVP — chapters + transcript still work
    }
  }
  function resume() {
    if (saved) {
      seekTo(saved);
      setSaved(null);
    }
  }
  function cycleRate() {
    const i = RATES.indexOf(rate);
    const next = RATES[(i + 1) % RATES.length] ?? 1;
    setRate(next);
    try {
      player.playbackRate = next;
    } catch {
      // noop
    }
  }
  function fullscreen() {
    try {
      viewRef.current?.enterFullscreen();
    } catch {
      // web/native fallback: native controls already expose fullscreen
    }
  }
  function pip() {
    try {
      viewRef.current?.startPictureInPicture();
    } catch {
      // PiP unsupported here (older OS / web) — video keeps playing in page
    }
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>WALKTHROUGH • {lesson.id} • CHAPTER {chIdx + 1}/{lesson.chapters.length}</Eyebrow>
        <H1>{lesson.title}</H1>
        <Body>{lesson.objective} — every important step is demonstrated slowly.</Body>

        {saved !== null && (
          <Pressable onPress={resume} style={s.resume}>
            <View style={s.resumeRow}>
              <MelroseIcon name="play" size={15} color={Theme.colors.onPrimary} />
              <Text style={s.resumeT}>Resume where you left off — {formatClock(saved)}</Text>
            </View>
          </Pressable>
        )}

        <View style={[s.playerWrap, { aspectRatio: isTablet ? 21 / 9 : 16 / 9 }]}>
          <VideoView
            ref={viewRef}
            player={player}
            style={s.player}
            contentFit="contain"
            nativeControls
            allowsPictureInPicture
          />
          {cc && (
            <View style={s.ccBar} pointerEvents="none">
              <View style={s.ccRow}>
                <MelroseIcon name="music" size={13} color="#fff" />
                <Text style={s.ccText}>
                  {ch?.title} — {formatClock(position)}
                </Text>
              </View>
            </View>
          )}
        </View>
        <Muted>Portrait on phone, landscape on fullscreen — rotate anytime. Streaming adapts to your connection.</Muted>

        <View style={s.controls}>
          <Chip label={`${formatClock(position)} watched`} />
          <Pressable onPress={cycleRate} style={s.pill} accessibilityLabel="Change playback speed">
            <Text style={s.pillT}>{rate}x speed</Text>
          </Pressable>
          <Pressable onPress={() => setCc((v) => !v)} style={s.pill} accessibilityLabel="Toggle captions">
            <Text style={s.pillT}>CC {cc ? 'on' : 'off'}</Text>
          </Pressable>
          <Pressable onPress={fullscreen} style={s.pill} accessibilityLabel="Fullscreen">
            <View style={s.pillRow}>
              <MelroseIcon name="maximize" size={13} color={Theme.colors.accent} />
              <Text style={s.pillT}>Full</Text>
            </View>
          </Pressable>
          <Pressable onPress={pip} style={s.pill} accessibilityLabel="Picture in picture">
            <View style={s.pillRow}>
              <MelroseIcon name="copy" size={13} color={Theme.colors.accent} />
              <Text style={s.pillT}>PiP</Text>
            </View>
          </Pressable>
        </View>
        {Platform.OS === 'web' && <Muted>Web: fullscreen via player controls; PiP via browser where supported.</Muted>}
        <Muted>Tip for non-coders: watch once, then replay while doing each step in the lesson page. Position auto-saves.</Muted>
        <LinkButton href={`/lesson/${lesson.id}`} title="Open step-by-step lesson page" />

        <Text style={s.h}>Chapters — tap to jump (markers)</Text>
        <Card>
          <Chapters chapters={lesson.chapters} onSeek={(c) => seekTo(c.seconds)} />
        </Card>

        <Text style={s.h}>Transcript (read or search)</Text>
        <Card>
          <Text selectable style={s.transcript}>
            {lesson.transcript}
            {'\n\n'}Chapters: {lesson.chapters.map((c) => `${c.time} ${c.title}`).join(' • ')}
          </Text>
        </Card>

        <Pressable
          onPress={() => {
            toggleComplete(lesson.id);
            if (!isDone) void clearPosition(lesson.id);
          }}
          style={[s.done, isDone && s.doneOn]}
        >
          <Text style={s.doneT}>{isDone ? '✓ Watched — tap to undo' : 'Mark walkthrough complete (+50 XP)'}</Text>
        </Pressable>
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  resume: { backgroundColor: Theme.colors.primary, borderWidth: 2, borderColor: Theme.colors.goldBorder, padding: 14, borderRadius: Theme.radius.sm, marginVertical: 8, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  resumeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resumeT: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold, fontSize: 15 },
  playerWrap: { backgroundColor: '#000', borderRadius: Theme.radius.md, overflow: 'hidden', marginVertical: 12, borderWidth: 1, borderColor: Theme.colors.border },
  player: { width: '100%', height: '100%' },
  ccBar: { position: 'absolute', left: 8, right: 8, bottom: 8, backgroundColor: '#000000cc', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 },
  ccRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  ccText: { color: '#fff', fontSize: 13, fontFamily: Theme.fonts.bold, textAlign: 'center' },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  pill: { backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, minHeight: Theme.touch.min, justifyContent: 'center' },
  pillRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pillT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold, fontSize: 13 },
  h: { color: '#fff', fontFamily: Theme.fonts.bold, fontSize: 18, marginTop: 18, marginBottom: 6 },
  transcript: { color: Theme.colors.text, fontFamily: Theme.fonts.regular, fontSize: 14, lineHeight: 21 },
  done: { backgroundColor: Theme.colors.success, padding: 16, borderRadius: Theme.radius.sm, marginTop: 16, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  doneOn: { backgroundColor: '#065f46' },
  doneT: { color: '#052e16', fontFamily: Theme.fonts.bold },
});

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}
