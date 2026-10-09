// Certificate system: final program certificate + 20 module certificates.
// Each: student name, program, date, ID, verify URL/QR, author signature,
// download (PDF) + share. Locked until the work is actually done.
import { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Share, Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { Theme } from '../src/theme';
import { useAuth, useProgress } from '../src/store/store';
import { LEVELS, getModulesForLevel } from '../src/data/curriculum';
import { moduleCerts, finalCert, shareText, certHtml, AUTHOR_SIGNATURE } from '../src/lib/certificates';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip, ProgressBar, LinkButton, Grid } from '../src/components/ui';
import { MelroseIcon } from '../src/components/icons';

async function downloadCert(args: { student: string; program: string; certId: string; url: string; date: string; kind: 'Module' | 'Program' }): Promise<string> {
  const html = certHtml(args);
  try {
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { dialogTitle: `Certificate ${args.certId}` });
      return '✓ PDF ready — shared/saved from the sheet.';
    }
    return `PDF saved at ${uri}`;
  } catch {
    await Clipboard.setStringAsync(args.url).catch(() => {});
    return Platform.OS === 'web'
      ? 'Download needs the mobile app — verify link copied instead. Use browser Print → PDF here.'
      : 'Could not render PDF — verify link copied instead.';
  }
}

async function shareCert(text: string): Promise<string> {
  try {
    const r = await Share.share({ message: text });
    return r.action === Share.sharedAction ? '✓ Shared.' : 'Share dismissed.';
  } catch {
    await Clipboard.setStringAsync(text).catch(() => {});
    return 'Share unavailable — details copied instead.';
  }
}

export default function Certificates() {
  const { auth } = useAuth();
  const { completed } = useProgress();
  const [msg, setMsg] = useState('');
  const [openMod, setOpenMod] = useState<string | null>(null);

  const name = auth.name || 'Student';
  const email = auth.email ?? 'student@aimasterplan.app';
  const mods = useMemo(() => moduleCerts(email, completed), [email, completed]);
  const fin = useMemo(() => finalCert(email, completed), [email, completed]);
  const unlocked = mods.filter((m) => m.eligible).length;

  async function onDownload(kind: 'Module' | 'Program', program: string, certId: string, url: string, eligible: boolean) {
    if (!eligible) {
      setMsg('Locked — finish the work first, then download.');
      return;
    }
    setMsg('Rendering PDF…');
    setMsg(await downloadCert({ student: name, program, certId, url, date: fin.date, kind }));
  }

  async function onShare(program: string, certId: string, url: string, eligible: boolean) {
    if (!eligible) {
      setMsg('Locked — share unlocks at 100%.');
      return;
    }
    setMsg(await shareCert(shareText({ student: name, program, certId, url, date: fin.date })));
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>VERIFIED CERTIFICATES • {unlocked}/20 MODULES • PROGRAM {fin.pct}%</Eyebrow>
        <H1>Certificates</H1>
        <Body>Finish modules to unlock module certificates; finish everything for the program certificate. Every certificate carries ID + QR verification.</Body>
        {!!msg && (
          <Card>
            <Body>{msg}</Body>
          </Card>
        )}

        <H2>Final program certificate</H2>
        <Card style={s.cert}>
          <Muted>AI-MASTERPLAN • {fin.eligible ? 'VERIFIED' : 'PREVIEW — finish all lessons to unlock'}</Muted>
          <Text style={s.certName}>{name}</Text>
          <Text style={s.certProg}>Independent AI System Builder</Text>
          <Muted>Program: AI-MasterPlan • Completed: {fin.date}</Muted>
          <Muted>ID: {fin.certId}</Muted>
          <Muted>Verify: {fin.url}</Muted>
          <View style={s.qr}>
            <QRCode value={fin.url} size={140} backgroundColor="#ffffff" />
          </View>
          <Muted>Scan to verify ↑</Muted>
          <Text style={s.sig}>{AUTHOR_SIGNATURE.name}</Text>
          <Muted>{AUTHOR_SIGNATURE.title} (signature)</Muted>
          <View style={s.row}>
            <Chip label={fin.eligible ? 'ELIGIBLE ✓' : `${fin.pct}% — KEEP BUILDING`} tone={fin.eligible ? 'success' : 'warning'} />
          </View>
          <View style={s.btnRow}>
            <Pressable onPress={() => onDownload('Program', 'Independent AI System Builder (AI-MasterPlan)', fin.certId, fin.url, fin.eligible)} style={s.btn}>
              <View style={s.btnInner}>
                <MelroseIcon name="download" size={15} color={Theme.colors.onPrimary} />
                <Text style={s.btnT}>Download</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => onShare('Independent AI System Builder (AI-MasterPlan)', fin.certId, fin.url, fin.eligible)} style={s.btnGhost}>
              <View style={s.btnInner}>
                <MelroseIcon name="share-2" size={15} color={Theme.colors.accent} />
                <Text style={s.btnGhostT}>Share</Text>
              </View>
            </Pressable>
          </View>
          <ProgressBar pct={fin.pct} />
        </Card>

        <H2>Module certificates ({unlocked}/20)</H2>
        <Grid>
          {LEVELS.flatMap((lv) =>
            getModulesForLevel(lv.id).map((m) => {
              const c = mods.find((x) => x.moduleId === m.id)!;
              const open = openMod === m.id;
              return (
                <Card key={m.id} style={c.eligible ? s.unlocked : undefined}>
                  <Pressable onPress={() => setOpenMod(open ? null : m.id)}>
                    <View style={s.row}>
                      <MelroseIcon name={c.eligible ? 'award' : 'lock'} size={16} color={c.eligible ? Theme.colors.success : Theme.colors.muted} />
                      <Text style={s.lvT}>
                        {m.id} — {m.title}
                      </Text>
                    </View>
                    <Muted>
                      {c.pct}% • ID {c.certId}
                    </Muted>
                  </Pressable>
                  {open && (
                    <View style={s.detail}>
                      <Muted>Student: {name} • Program: {m.title} • Date: {fin.date}</Muted>
                      <Muted>Verify: {c.url}</Muted>
                      {c.eligible && (
                        <View style={s.qrSm}>
                          <QRCode value={c.url} size={96} backgroundColor="#ffffff" />
                        </View>
                      )}
                      <Text style={s.sigSm}>{AUTHOR_SIGNATURE.name}</Text>
                      <View style={s.btnRow}>
                        <Pressable onPress={() => onDownload('Module', m.title, c.certId, c.url, c.eligible)} style={s.btn}>
                          <View style={s.btnInner}>
                            <MelroseIcon name="download" size={14} color={Theme.colors.onPrimary} />
                            <Text style={s.btnT}>Download</Text>
                          </View>
                        </Pressable>
                        <Pressable onPress={() => onShare(m.title, c.certId, c.url, c.eligible)} style={s.btnGhost}>
                          <View style={s.btnInner}>
                            <MelroseIcon name="share-2" size={14} color={Theme.colors.accent} />
                            <Text style={s.btnGhostT}>Share</Text>
                          </View>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </Card>
              );
            }),
          )}
        </Grid>

        <LinkButton href="/roadmap" title="Continue lessons to unlock" />
        <LinkButton href="/progress" title="Open progress dashboard" />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  cert: { borderColor: Theme.colors.warning, borderWidth: 2, alignItems: 'center', paddingVertical: 24 },
  certName: { color: '#fff', fontFamily: Theme.fonts.black, fontSize: 28, marginTop: 8, textAlign: 'center' },
  certProg: { color: Theme.colors.warning, fontFamily: Theme.fonts.bold, marginVertical: 4, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  qr: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 12 },
  qrSm: { backgroundColor: '#fff', padding: 8, borderRadius: 8, marginTop: 8, alignSelf: 'flex-start' },
  sig: { color: '#fff', fontSize: 26, marginTop: 12, fontStyle: 'italic', fontFamily: Theme.fonts.regular },
  sigSm: { color: '#fff', fontSize: 18, marginTop: 8, fontStyle: 'italic' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btn: { backgroundColor: Theme.colors.primary, borderWidth: 2, borderColor: Theme.colors.goldBorder, borderRadius: Theme.radius.sm, paddingHorizontal: 18, paddingVertical: 12, minHeight: Theme.touch.min, justifyContent: 'center', flex: 1, alignItems: 'center' },
  btnT: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold },
  btnGhost: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.radius.sm, paddingHorizontal: 18, paddingVertical: 12, minHeight: Theme.touch.min, justifyContent: 'center', flex: 1, alignItems: 'center' },
  btnGhostT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold },
  lvT: { color: '#fff', fontFamily: Theme.fonts.bold, flex: 1 },
  detail: { marginTop: 8, borderTopWidth: 1, borderTopColor: Theme.colors.border, paddingTop: 8 },
  unlocked: { borderColor: Theme.colors.success },
});
