// Author / Instructor CMS — Dashboard, Courses, Lesson Editor, Students,
// Meetings, Community. Role-gated (author+). Device-local drafts in MVP;
// production persists via /admin/* routes (see backend/api.ts).
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Switch, StyleSheet, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { Theme } from '../src/theme';
import { LEVELS, LESSONS, MODULES } from '../src/data/curriculum';
import { TOOLS } from '../src/data/tools';
import { PROJECTS } from '../src/data/projects';
import { API } from '../backend/api';
import { MEETINGS } from '../src/data/gamification';
import { canAccess } from '../src/lib/auth';
import { ROLE_COPY } from '../src/lib/roles';
import {
  createNode, renameNode, moveNode, setStatus, deleteNode, childrenOf,
  emptyDraft, validateDraft, rosterStats, moderate, pendingReports,
  announcementText, progressPct, type CmsNode, type DraftLesson, type RosterStudent, type ModItem,
} from '../src/lib/cms';
import { countdownLabel, countdownTo } from '../src/lib/meet';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip, ProgressBar, LinkButton, Segmented } from '../src/components/ui';
import { MelroseIcon } from '../src/components/icons';
import { useAuth, useProgress } from '../src/store/store';

const TABS = ['Dashboard', 'Courses', 'Editor', 'Students', 'Meetings', 'Community'] as const;
const NODES_KEY = 'amp-cms-nodes';
const MEET_KEY = 'amp-cms-meetings';
const POSTS_KEY = 'amp-community-posts';

interface CmsMeeting { id: string; title: string; at: string; url: string; recurring: boolean; recording: string }

export default function Admin() {
  const { auth } = useAuth();
  const { completed, projectDone, activity } = useProgress();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Dashboard');
  const [nodes, setNodes] = useState<CmsNode[]>([]);
  const [draft, setDraft] = useState<DraftLesson>(emptyDraft());
  const [draftMsg, setDraftMsg] = useState('');
  const [meetings, setMeetings] = useState<CmsMeeting[]>([]);
  const [mTitle, setMTitle] = useState('');
  const [mAt, setMAt] = useState('');
  const [mUrl, setMUrl] = useState('https://meet.aimasterplan.app/weekly');
  const [mRec, setMRec] = useState(true);
  const [annT, setAnnT] = useState('');
  const [annB, setAnnB] = useState('');
  const [modQueue, setModQueue] = useState<ModItem[]>([]);
  const [msg, setMsg] = useState('');

  const allowed = canAccess(['author', 'admin'], auth.role);

  useEffect(() => {
    AsyncStorage.getItem(NODES_KEY).then((s) => s && setNodes(JSON.parse(s)));
    AsyncStorage.getItem(MEET_KEY).then((s) => s && setMeetings(JSON.parse(s)));
    AsyncStorage.getItem(POSTS_KEY).then((s) => {
      if (!s) return;
      try {
        const posts = JSON.parse(s) as { id: string; author: string; body: string; reports?: number }[];
        setModQueue(posts.filter((p) => (p.reports ?? 0) > 0).map((p) => ({ id: p.id, author: p.author, body: p.body, reports: p.reports ?? 0, hidden: false })));
      } catch { /* seed-shaped */ }
    });
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(NODES_KEY, JSON.stringify(nodes)).catch(() => {});
  }, [nodes]);
  useEffect(() => {
    AsyncStorage.setItem(MEET_KEY, JSON.stringify(meetings)).catch(() => {});
  }, [meetings]);

  if (!allowed) {
    return (
      <Screen>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Eyebrow>CMS • YOU: {auth.role.toUpperCase()} • NEEDS AUTHOR+</Eyebrow>
          <H1>Author CMS</H1>
          <Card>
            <Body>Students see this preview only. {ROLE_COPY[auth.role].blurb}</Body>
            <LinkButton href="/settings" title="Switch role (demo) in Settings" />
          </Card>
        </ScrollView>
      </Screen>
    );
  }

  const roster: RosterStudent[] = [
    {
      id: auth.userId ?? 'me', name: auth.name || 'You', email: auth.email ?? '—',
      enrollment: auth.enrollmentStatus, completedLessons: completed.length, totalLessons: LESSONS.length,
      completedProjects: PROJECTS.filter((p) => (projectDone[p.id] ?? []).length >= p.stages.length).length,
      attendance: activity.length,
    },
    { id: 'demo-maya', name: 'Maya (demo)', email: 'maya@example.com', enrollment: 'active', completedLessons: 34, totalLessons: LESSONS.length, completedProjects: 2, attendance: 6 },
    { id: 'demo-leo', name: 'Leo (demo)', email: 'leo@example.com', enrollment: 'active', completedLessons: 8, totalLessons: LESSONS.length, completedProjects: 0, attendance: 2 },
    { id: 'demo-sam', name: 'Sam (demo)', email: 'sam@example.com', enrollment: 'pending', completedLessons: 0, totalLessons: LESSONS.length, completedProjects: 0, attendance: 0 },
  ];
  const stats = rosterStats(roster);
  const pending = pendingReports(modQueue);
  const courses = childrenOf(nodes, 'course', null);

  function addMeeting() {
    if (!mTitle.trim() || !mAt.trim()) {
      setMsg('Meeting needs a title + date (YYYY-MM-DD HH:MM).');
      return;
    }
    setMeetings((m) => [...m, { id: `m-${Date.now()}`, title: mTitle.trim(), at: mAt.trim(), url: mUrl.trim() || MEETINGS[0].meetingUrl, recurring: mRec, recording: '' }]);
    setMTitle('');
    setMAt('');
    setMsg('✓ Meeting scheduled (device-local in MVP; POST /admin/meetings in production).');
  }

  const missing = validateDraft(draft);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>AUTHOR / INSTRUCTOR CMS • {auth.role.toUpperCase()} • DASHBOARD + 5 STUDIOS</Eyebrow>
        <H1>Course CMS</H1>
        {!!msg && (
          <Card>
            <Body>{msg}</Body>
          </Card>
        )}
        <Segmented options={TABS} value={tab} onChange={setTab} />

        {tab === 'Dashboard' && (
          <>
            <View style={s.grid}>
              {[
                ['Levels', String(LEVELS.length)], ['Modules', String(MODULES.length)], ['Lessons', String(LESSONS.length)],
                ['Tools', String(TOOLS.length)], ['Projects', String(PROJECTS.length)], ['API routes', String(API.length)],
                ['Students', String(stats.total)], ['Active', String(stats.active)], ['Avg progress', `${stats.avgPct}%`],
              ].map(([k, v]) => (
                <Card key={k} style={s.stat}>
                  <Text style={s.statV}>{v}</Text>
                  <Muted>{k}</Muted>
                </Card>
              ))}
            </View>
            <Card>
              <Body>At-risk active students (&lt;20%): {stats.atRisk.length ? stats.atRisk.map((r) => r.name).join(', ') : 'none — all on track'}</Body>
              <Body>Moderation pending: {pending.length} • Custom meetings: {meetings.length} • Draft nodes: {nodes.filter((n) => n.status === 'draft').length}</Body>
            </Card>
            <Card>
              <Body>Next Meet & Greet: {countdownLabel(countdownTo(MEETINGS[0].startsAt))}</Body>
              <LinkButton href="/meet" title="Open Meet & Greet page" />
            </Card>
          </>
        )}

        {tab === 'Courses' && (
          <>
            <H2>Course → Level → Module → Lesson (custom tree)</H2>
            <Muted>Built-ins: 10 levels / {MODULES.length} modules / {LESSONS.length} lessons. Below is your custom tree (draft → publish).</Muted>
            <AddRow
              label="New course"
              onAdd={(t) => setNodes((n) => createNode(n, 'course', null, t))}
            />
            {courses.length === 0 && <Muted>No custom courses yet — create one above.</Muted>}
            {courses.map((c) => (
              <NodeCard
                key={c.id} node={c}
                onRename={(t) => setNodes((n) => renameNode(n, c.id, t))}
                onMove={(d) => setNodes((n) => moveNode(n, c.id, d))}
                onStatus={(st) => setNodes((n) => setStatus(n, c.id, st))}
                onDelete={() => setNodes((n) => deleteNode(n, c.id))}
              >
                <AddRow label="New level" onAdd={(t) => setNodes((n) => createNode(n, 'level', c.id, t))} />
                {childrenOf(nodes, 'level', c.id).map((lv) => (
                  <NodeCard
                    key={lv.id} node={lv}
                    onRename={(t) => setNodes((n) => renameNode(n, lv.id, t))}
                    onMove={(d) => setNodes((n) => moveNode(n, lv.id, d))}
                    onStatus={(st) => setNodes((n) => setStatus(n, lv.id, st))}
                    onDelete={() => setNodes((n) => deleteNode(n, lv.id))}
                  >
                    <AddRow label="New module" onAdd={(t) => setNodes((n) => createNode(n, 'module', lv.id, t))} />
                    {childrenOf(nodes, 'module', lv.id).map((m) => (
                      <NodeCard
                        key={m.id} node={m}
                        onRename={(t) => setNodes((n) => renameNode(n, m.id, t))}
                        onMove={(d) => setNodes((n) => moveNode(n, m.id, d))}
                        onStatus={(st) => setNodes((n) => setStatus(n, m.id, st))}
                        onDelete={() => setNodes((n) => deleteNode(n, m.id))}
                      >
                        <AddRow label="New lesson" onAdd={(t) => setNodes((n) => createNode(n, 'lesson', m.id, t))} />
                        {childrenOf(nodes, 'lesson', m.id).map((l) => (
                          <NodeCard
                            key={l.id} node={l}
                            onRename={(t) => setNodes((n) => renameNode(n, l.id, t))}
                            onMove={(d) => setNodes((n) => moveNode(n, l.id, d))}
                            onStatus={(st) => setNodes((n) => setStatus(n, l.id, st))}
                            onDelete={() => setNodes((n) => deleteNode(n, l.id))}
                          />
                        ))}
                      </NodeCard>
                    ))}
                  </NodeCard>
                ))}
              </NodeCard>
            ))}
          </>
        )}

        {tab === 'Editor' && (
          <>
            <H2>Lesson editor — all 10 blocks</H2>
            <Muted>{missing.length ? `Missing to publish: ${missing.join(', ')}` : 'Complete ✓ — ready to save as published lesson node.'}</Muted>
            <EditorField label="1 • Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
            <EditorField label="2 • Objective" value={draft.objective} onChange={(v) => setDraft({ ...draft, objective: v })} multiline />
            <EditorField label="3 • Rich-text intro (WHY first)" value={draft.intro} onChange={(v) => setDraft({ ...draft, intro: v })} multiline tall />
            <EditorField label="4 • Video URL" value={draft.videoUrl} onChange={(v) => setDraft({ ...draft, videoUrl: v })} />
            <EditorField label="5 • Images (one URL per line)" value={draft.images} onChange={(v) => setDraft({ ...draft, images: v })} multiline />
            <EditorField label="6 • Code" value={draft.code} onChange={(v) => setDraft({ ...draft, code: v })} multiline mono />
            <EditorField label="7 • Terminal commands (one per line)" value={draft.commands} onChange={(v) => setDraft({ ...draft, commands: v })} multiline mono />
            <EditorField label="8 • Prompts (one per line)" value={draft.prompts} onChange={(v) => setDraft({ ...draft, prompts: v })} multiline />
            <EditorField label="9 • Downloads (name | url per line)" value={draft.downloads} onChange={(v) => setDraft({ ...draft, downloads: v })} multiline />
            <EditorField label="10 • Links (label | url per line)" value={draft.links} onChange={(v) => setDraft({ ...draft, links: v })} multiline />
            <EditorField label="Quiz question" value={draft.quizQ} onChange={(v) => setDraft({ ...draft, quizQ: v })} multiline />
            <EditorField label="Quiz answer" value={draft.quizA} onChange={(v) => setDraft({ ...draft, quizA: v })} />
            <EditorField label="Exercise" value={draft.exercise} onChange={(v) => setDraft({ ...draft, exercise: v })} multiline />
            <View style={s.row}>
              <Pressable
                onPress={() => {
                  if (!draft.title.trim()) {
                    setDraftMsg('Give the lesson a title first.');
                    return;
                  }
                  setNodes((n) => setStatus(createNode(n, 'lesson', null, draft.title), `L${Date.now().toString(36)}`, 'draft'));
                  setDraftMsg('✓ Saved as draft lesson node (see Courses tab).');
                }}
                style={s.small}
              >
                <Text style={s.smallT}>Save draft</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (missing.length) {
                    setDraftMsg(`Cannot publish — missing: ${missing.join(', ')}.`);
                    return;
                  }
                  setNodes((n) => {
                    const withNode = createNode(n, 'lesson', null, draft.title);
                    const created = withNode[withNode.length - 1];
                    return setStatus(withNode, created.id, 'published');
                  });
                  setDraftMsg('✓ Published lesson node (device-local; syncs via PUT /admin/lessons in production).');
                }}
                style={s.go}
              >
                <Text style={s.goT}>Publish lesson</Text>
              </Pressable>
            </View>
            {!!draftMsg && (
              <Card>
                <Body>{draftMsg}</Body>
              </Card>
            )}
          </>
        )}

        {tab === 'Students' && (
          <>
            <H2>Students ({roster.length})</H2>
            {roster.map((r) => (
              <Card key={r.id}>
                <View style={s.row}>
                  <Text style={s.t}>{r.name}</Text>
                  <Chip label={r.enrollment} tone={r.enrollment === 'active' ? 'success' : r.enrollment === 'completed' ? 'accent' : 'warning'} />
                </View>
                <Muted>{r.email} • attendance {r.attendance} • projects {r.completedProjects}/{PROJECTS.length}</Muted>
                <ProgressBar pct={progressPct(r)} />
                <Muted>
                  Progress {r.completedLessons}/{r.totalLessons} ({progressPct(r)}%)
                </Muted>
              </Card>
            ))}
          </>
        )}

        {tab === 'Meetings' && (
          <>
            <H2>Create meeting (recurring supported)</H2>
            <Card>
              <EditorField label="Title" value={mTitle} onChange={setMTitle} />
              <EditorField label="Date (YYYY-MM-DD HH:MM)" value={mAt} onChange={setMAt} />
              <EditorField label="Meeting URL" value={mUrl} onChange={setMUrl} />
              <View style={s.row}>
                <Text style={s.t}>Recurring weekly</Text>
                <Switch value={mRec} onValueChange={setMRec} />
              </View>
              <Pressable onPress={addMeeting} style={s.go}>
                <Text style={s.goT}>Create meeting</Text>
              </Pressable>
            </Card>
            {meetings.map((mtg) => (
              <Card key={mtg.id}>
                <Text style={s.t}>{mtg.title}</Text>
                <Muted>
                  {mtg.at} • {mtg.recurring ? 'recurring weekly' : 'one-off'}
                </Muted>
                <Muted>{mtg.url}</Muted>
                <View style={s.row}>
                  <Pressable onPress={() => Linking.openURL(mtg.url)} style={s.small}>
                    <Text style={s.smallT}>Open URL</Text>
                  </Pressable>
                  <Pressable onPress={() => setMeetings((m) => m.filter((x) => x.id !== mtg.id))} style={s.ghost}>
                    <Text style={s.ghostT}>Delete</Text>
                  </Pressable>
                </View>
              </Card>
            ))}
            <H2>Send announcement</H2>
            <Card>
              <EditorField label="Title" value={annT} onChange={setAnnT} />
              <EditorField label="Body" value={annB} onChange={setAnnB} multiline tall />
              <Pressable
                onPress={async () => {
                  if (!annT.trim() || !annB.trim()) {
                    setMsg('Announcement needs title + body.');
                    return;
                  }
                  await Clipboard.setStringAsync(announcementText(annT, annB)).catch(() => {});
                  setMsg('✓ Announcement copied — paste to Community + notifications (POST /admin/meetings in production).');
                  setAnnT('');
                  setAnnB('');
                }}
                style={s.small}
              >
                <Text style={s.smallT}>Copy announcement</Text>
              </Pressable>
            </Card>
            <H2>Recordings (upload = link archive)</H2>
            <Card>
              <Body>Paste recording URLs into the Meet archive via backend in production; device-local list above links out.</Body>
              <LinkButton href="/meet" title="Open Meet page (recordings + archive)" />
            </Card>
          </>
        )}

        {tab === 'Community' && (
          <>
            <H2>Moderation queue ({pending.length})</H2>
            {pending.length === 0 && <Muted>Queue clear — nothing reported. Reports from the Community feed land here.</Muted>}
            {pending.map((m) => (
              <Card key={m.id}>
                <Text style={s.t}>
                  {m.author}: {m.body.slice(0, 120)}
                </Text>
                <View style={s.flagRow}>
                  <MelroseIcon name="flag" size={13} color={Theme.colors.muted} />
                  <Muted>{m.reports} reports</Muted>
                </View>
                <View style={s.row}>
                  <Pressable onPress={() => setModQueue((q) => moderate(q, m.id, 'approve'))} style={s.small}>
                    <Text style={s.smallT}>Approve (clear reports)</Text>
                  </Pressable>
                  <Pressable onPress={() => setModQueue((q) => moderate(q, m.id, 'hide'))} style={s.ghost}>
                    <Text style={s.ghostT}>Hide post</Text>
                  </Pressable>
                </View>
              </Card>
            ))}
            <H2>Reports + announcements</H2>
            <Card>
              <Body>Report flow: Community reports → 3+ auto-hide → this queue → approve/hide. Announcements: compose in Meetings tab, post to Weekly Meet Discussions.</Body>
              <LinkButton href="/community" title="Open Community feed" />
            </Card>
          </>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

function AddRow({ label, onAdd }: { label: string; onAdd: (t: string) => void }) {
  const [v, setV] = useState('');
  return (
    <View style={s.addRow}>
      <TextInput value={v} onChangeText={setV} placeholder={label} placeholderTextColor="#64748b" style={[s.input, { flex: 1 }]} maxLength={80} />
      <Pressable
        onPress={() => {
          if (!v.trim()) return;
          onAdd(v);
          setV('');
        }}
        style={s.small}
      >
        <Text style={s.smallT}>Add</Text>
      </Pressable>
    </View>
  );
}

function NodeCard({
  node, onRename, onMove, onStatus, onDelete, children,
}: {
  node: CmsNode;
  onRename: (t: string) => void;
  onMove: (d: -1 | 1) => void;
  onStatus: (st: 'draft' | 'published') => void;
  onDelete: () => void;
  children?: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(node.title);
  return (
    <Card style={node.status === 'published' ? s.pub : s.draft}>
      <View style={s.row}>
        <Chip label={node.kind} tone="accent" />
        <Chip label={node.status} tone={node.status === 'published' ? 'success' : 'warning'} />
      </View>
      {editing ? (
        <View style={s.addRow}>
          <TextInput value={v} onChangeText={setV} style={[s.input, { flex: 1 }]} maxLength={80} />
          <Pressable
            onPress={() => {
              onRename(v);
              setEditing(false);
            }}
            style={s.small}
          >
            <Text style={s.smallT}>Save</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={s.t}>{node.title}</Text>
      )}
      <View style={s.row}>
        <Pressable onPress={() => onMove(-1)} style={s.mini}>
          <MelroseIcon name="chevron-up" size={14} color={Theme.colors.muted} />
        </Pressable>
        <Pressable onPress={() => onMove(1)} style={s.mini}>
          <MelroseIcon name="chevron-down" size={14} color={Theme.colors.muted} />
        </Pressable>
        <Pressable onPress={() => setEditing(!editing)} style={s.mini}>
          <Text style={s.miniT}>Rename</Text>
        </Pressable>
        <Pressable onPress={() => onStatus(node.status === 'draft' ? 'published' : 'draft')} style={s.mini}>
          <Text style={s.miniT}>{node.status === 'draft' ? 'Publish' : 'Unpublish'}</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={s.mini}>
          <Text style={s.miniT}>Delete</Text>
        </Pressable>
      </View>
      {children}
    </Card>
  );
}

function EditorField({
  label, value, onChange, multiline, tall, mono,
}: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; tall?: boolean; mono?: boolean;
}) {
  return (
    <>
      <Text style={s.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={[s.input, multiline && { minHeight: tall ? 110 : 64 }, mono && { fontFamily: Theme.fonts.mono }]}
        multiline={multiline}
        placeholderTextColor="#64748b"
      />
    </>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 },
  flagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  t: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 15, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stat: { minWidth: 100, flexGrow: 1 },
  statV: { color: Theme.colors.text, fontFamily: Theme.fonts.black, fontSize: 24 },
  draft: { borderStyle: 'dashed' },
  pub: { borderColor: Theme.colors.success },
  addRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 },
  input: { backgroundColor: Theme.colors.surface, color: Theme.colors.text, borderRadius: Theme.radius.md, padding: 12, marginVertical: 4, borderWidth: 1, borderColor: Theme.colors.border, minHeight: Theme.touch.min },
  label: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, marginTop: 10 },
  small: { backgroundColor: Theme.colors.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, minHeight: Theme.touch.min, justifyContent: 'center' },
  smallT: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold },
  ghost: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, minHeight: Theme.touch.min, justifyContent: 'center' },
  ghostT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold },
  go: { backgroundColor: Theme.colors.success, borderRadius: 8, paddingHorizontal: 18, paddingVertical: 12, minHeight: Theme.touch.min, justifyContent: 'center' },
  goT: { color: '#052e16', fontFamily: Theme.fonts.bold },
  mini: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, minHeight: Theme.touch.min, justifyContent: 'center' },
  miniT: { color: Theme.colors.muted, fontFamily: Theme.fonts.bold, fontSize: 12 },
});
