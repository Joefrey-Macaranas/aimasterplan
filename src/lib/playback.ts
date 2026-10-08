// Playback-position store: resume every walkthrough where the student left off.
// AsyncStorage-backed (offline-first); throttled saves from the player.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'amp-playback';

export async function loadPlayback(): Promise<Record<string, number>> {
  try {
    const s = await AsyncStorage.getItem(KEY);
    return s ? (JSON.parse(s) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export async function savePosition(lessonId: string, seconds: number): Promise<void> {
  try {
    const cur = await loadPlayback();
    cur[lessonId] = Math.max(0, Math.floor(seconds));
    await AsyncStorage.setItem(KEY, JSON.stringify(cur));
  } catch {
    // storage full/blocked — playback still works for this session
  }
}

export async function clearPosition(lessonId: string): Promise<void> {
  try {
    const cur = await loadPlayback();
    delete cur[lessonId];
    await AsyncStorage.setItem(KEY, JSON.stringify(cur));
  } catch {
    // noop
  }
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Current chapter for a position — powers chapter markers + synced captions. */
export function chapterAt(chapters: { seconds: number; title: string }[], positionSec: number): number {
  let idx = 0;
  for (let i = 0; i < chapters.length; i++) {
    if (positionSec >= chapters[i].seconds) idx = i;
  }
  return idx;
}
