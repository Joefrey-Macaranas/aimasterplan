import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Theme } from '../src/theme';
import { certificateId, verifyUrl } from '../src/lib/misc';
import { useAuth, useProgress } from '../src/store/store';
import { overallProgress, levelProgress } from '../src/lib/progress';
import { LEVELS } from '../src/data/curriculum';
import { Screen, H1, Body, Muted, Card, Chip, ProgressBar, LinkButton } from '../src/components/ui';

export default function Certificates() {
  const { auth } = useAuth();
  const { completed } = useProgress();
  const pct = overallProgress(completed);
  const name = auth.name || 'Student';
  const email = auth.email ?? 'student@aimasterplan.app';
  const id = certificateId(email, 'AI-MasterPlan');
  const eligible = pct >= 100;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <H1>Certificates</H1>
        <Body>Finish levels to unlock verifiable certificates. Share them with clients and employers.</Body>

        <Card style={s.cert}>
          <Muted>AI-MASTERPLAN • VERIFIED CERTIFICATE {eligible ? '' : '(PREVIEW)'}</Muted>
          <Text style={s.certName}>{name}</Text>
          <Text style={s.certProg}>Independent AI System Builder</Text>
          <Muted>
            Progress {pct}% • ID {id}
          </Muted>
          <Muted>Verify: {verifyUrl(id)}</Muted>
          <View style={s.row}>
            <Chip label={eligible ? 'ELIGIBLE ✓' : `${pct}% — KEEP BUILDING`} tone={eligible ? 'success' : 'warning'} />
          </View>
        </Card>

        <Text style={s.h}>Level milestones</Text>
        {LEVELS.map((lv) => {
          const p = levelProgress(lv.id, completed);
          return (
            <Card key={lv.id}>
              <View style={s.row}>
                <Text style={s.lvT}>
                  Level {lv.index}: {lv.title}
                </Text>
                <Chip label={p === 100 ? 'DONE ✓' : `${p}%`} tone={p === 100 ? 'success' : 'default'} />
              </View>
              <ProgressBar pct={p} />
              <Muted>{lv.summary}</Muted>
            </Card>
          );
        })}

        <LinkButton href="/roadmap" title="Continue lessons to unlock" />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  cert: { borderColor: Theme.colors.warning, borderWidth: 2, alignItems: 'center', paddingVertical: 24 },
  certName: { color: Theme.colors.text, fontSize: 28, fontWeight: '800', marginTop: 8 },
  certProg: { color: Theme.colors.warning, fontWeight: '800', marginVertical: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  h: { color: Theme.colors.text, fontWeight: '800', fontSize: 18, marginTop: 16 },
  lvT: { color: Theme.colors.text, fontWeight: '800', flex: 1 },
});
