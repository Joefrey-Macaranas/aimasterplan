import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { LEVELS, LESSONS, MODULES } from '../src/data/curriculum';
import { TOOLS } from '../src/data/tools';
import { PROJECTS } from '../src/data/projects';
import { API } from '../backend/api';
import { canAccess } from '../src/lib/auth';
import { ROLE_COPY } from '../src/lib/roles';
import { useAuth } from '../src/store/store';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip, LinkButton, Divider } from '../src/components/ui';
import { Theme } from '../src/theme';

export default function Admin() {
  const { auth } = useAuth();
  const allowedAuthor = canAccess(['author', 'admin'], auth.role);
  const allowedAdmin = canAccess(['admin'], auth.role);
  const allowedInstructor = canAccess(['instructor', 'author', 'admin'], auth.role);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>AUTHOR / ADMIN CMS • ROLE-GATED (YOU: {auth.role.toUpperCase()})</Eyebrow>
        <H1>Course CMS</H1>
        <Body>Publish, reorder and monitor the Beginner → Independent Builder curriculum.</Body>

        <Card style={allowedAuthor ? undefined : s.locked}>
          <View style={s.row}>
            <Text style={s.t}>Your access</Text>
            <Chip label={ROLE_COPY[auth.role]?.title ?? auth.role} tone={allowedAuthor ? 'success' : 'warning'} />
          </View>
          <Muted>
            Student: learn • Instructor: meetups + reviews{allowedInstructor ? ' ✓' : ' (locked)'} • Author: CMS publish
            {allowedAuthor ? ' ✓' : ' (locked)'} • Admin: users + roles{allowedAdmin ? ' ✓' : ' (locked)'}
          </Muted>
          {!allowedAuthor && (
            <>
              <Divider />
              <Body>Students see this preview only. Switch role in Settings (demo) or ask an admin for author access.</Body>
              <LinkButton href="/settings" title="Open Settings → role switcher" />
            </>
          )}
        </Card>

        {allowedAuthor && (
          <>
            <Card>
              <Muted>CONTENT INVENTORY (LIVE)</Muted>
              <Body>
                Levels: {LEVELS.length} • Modules: {MODULES.length} • Lessons: {LESSONS.length} • Tools: {TOOLS.length} •
                Projects: {PROJECTS.length} • API routes: {API.length}
              </Body>
              <Chip label={LESSONS.length >= 40 ? 'CURRICULUM COMPLETE ✓' : 'CURRICULUM INCOMPLETE'} tone={LESSONS.length >= 40 ? 'success' : 'warning'} />
            </Card>

            <Card>
              <Muted>COURSE MANAGEMENT (AUTHOR+)</Muted>
              <Body>Create level → modules → lessons. Reorder by drag in CMS. Draft → review → publish. Lesson editor supports: WHY-first intro, video + chapters, copyable prompts/commands/code, downloads, quizzes, troubleshooting.</Body>
            </Card>

            <Card>
              <Muted>STUDENTS & PROGRESS (INSTRUCTOR+)</Muted>
              <Body>Enrollments, per-lesson completion, streaks, XP, drop-off lesson, project submissions, attendance for Meet & Greet.</Body>
            </Card>

            <Card>
              <Muted>MEETINGS & COMMUNITY (INSTRUCTOR+)</Muted>
              <Body>Recurring weekly meeting URL, announcements, recordings archive. Moderation queue for community posts and reports.</Body>
            </Card>

            {allowedAdmin && (
              <Card>
                <Muted>USER ROLES (ADMIN ONLY ✓)</Muted>
                <Body>PUT /admin/users/:id/role • PUT /admin/users/:id/enrollment. Roles: student → instructor → author → admin.</Body>
              </Card>
            )}

            <H2>API contract (backend/api.ts)</H2>
            <Card>
              {API.map((r) => (
                <Body key={`${r.method}-${r.path}`}>
                  {r.method} {r.path} {r.roles ? `(roles: ${r.roles.join(',')})` : '(student)'}
                </Body>
              ))}
            </Card>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  t: { color: Theme.colors.text, fontFamily: Theme.fonts.bold, fontSize: 15 },
  locked: { borderStyle: 'dashed' },
});
