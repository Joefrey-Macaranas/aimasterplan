// Course enrollment: status, free audit, one-time purchase, subscription,
// coupons, scholarships, free enrollment, payment history, invoice/receipt.
// Demo checkout (no real charges in MVP) — production wires Stripe/RevenueCat here.
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { Theme } from '../src/theme';
import { PRODUCTS, COUPONS, SCHOLARSHIP_PROMPT } from '../src/data/enrollment';
import { quote, makePurchase, money, receiptText, statusAfterPurchase, STATUSES, type Purchase } from '../src/lib/enrollment';
import { Screen, H1, H2, Body, Muted, Eyebrow, Card, Chip } from '../src/components/ui';
import { useAuth } from '../src/store/store';

const HIST_KEY = 'amp-purchases';

export default function Enroll() {
  const { auth, setEnrollment } = useAuth();
  const [productId, setProductId] = useState('lifetime');
  const [coupon, setCoupon] = useState('');
  const [story, setStory] = useState('');
  const [err, setErr] = useState('');
  const [history, setHistory] = useState<Purchase[]>([]);
  const [openInv, setOpenInv] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(HIST_KEY).then((s) => s && setHistory(JSON.parse(s)));
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(HIST_KEY, JSON.stringify(history)).catch(() => {});
  }, [history]);

  const q = quote(productId, coupon, story);
  const product = PRODUCTS.find((p) => p.id === productId)!;

  async function checkout() {
    setErr('');
    setMsg('');
    if (!auth.email) {
      setErr('Sign in first — enrollment attaches to your account.');
      return;
    }
    if (!q.ok || !q.quote) {
      setErr(q.error ?? 'Could not price this plan.');
      return;
    }
    const p = makePurchase(auth.email, productId, q.quote);
    setHistory((h) => [p, ...h]);
    setEnrollment(statusAfterPurchase(p.kind));
    setCoupon('');
    setMsg(
      p.total === 0
        ? `✓ Enrolled free (${p.kind}) — status active. Receipt ${p.id} below.`
        : `✓ Demo purchase approved — ${money(p.total)} (${p.id}). No real charge in MVP. Status active.`,
    );
  }

  async function shareReceipt(p: Purchase) {
    try {
      const r = await Share.share({ message: receiptText(p) });
      setMsg(r.action === Share.sharedAction ? '✓ Receipt shared.' : 'Share dismissed.');
    } catch {
      await Clipboard.setStringAsync(receiptText(p)).catch(() => {});
      setMsg('Receipt copied.');
    }
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Eyebrow>ENROLLMENT • {auth.enrollmentStatus.toUpperCase()} • {auth.email ?? 'SIGNED OUT'}</Eyebrow>
        <H1>Enroll</H1>
        <Body>All enrolled students get Levels 1–10, projects, Meet & Greet and community. Pick the path that fits.</Body>

        <H2>Status</H2>
        <View style={s.chips}>
          {STATUSES.map((st) => (
            <Chip key={st} label={`${st}${auth.enrollmentStatus === st ? ' ✓' : ''}`} tone={auth.enrollmentStatus === st ? 'success' : 'default'} />
          ))}
        </View>
        <Muted>Pending → verify email or enroll below → Active → finish 100% → Completed. Suspended = contact support.</Muted>

        <H2>1 • Choose your plan</H2>
        {PRODUCTS.map((p) => (
          <Pressable key={p.id} onPress={() => setProductId(p.id)} style={[s.plan, productId === p.id && s.planOn]}>
            <View style={s.row}>
              <Text style={s.planT}>{p.title}</Text>
              <Chip label={p.kind === 'free' ? 'FREE' : money(p.priceCents) + (p.kind === 'sub' ? '/mo' : '')} tone={p.kind === 'free' ? 'success' : 'accent'} />
            </View>
            <Text style={s.planB}>{p.blurb}</Text>
            {p.perks.map((perk) => (
              <Text key={perk} style={s.perk}>
                • {perk}
              </Text>
            ))}
          </Pressable>
        ))}

        <H2>2 • Coupon (optional)</H2>
        <Card>
          <TextInput value={coupon} onChangeText={setCoupon} autoCapitalize="characters" placeholder="WELCOME20, BUILDER50, SCHOLAR100" placeholderTextColor="#64748b" style={s.input} />
          <Muted>Working codes: {COUPONS.map((c) => `${c.code} (−${c.pctOff}%)`).join(' • ')}</Muted>
          {!!q.ok && q.quote && !q.quote.free && (
            <Body>
              {money(q.quote.subtotal)} − {money(q.quote.discount)} = {money(q.quote.total)}
            </Body>
          )}
          {!!q.ok && q.quote?.free && product.kind !== 'free' && (
            <Body>Free with this code — {money(0)} due.</Body>
          )}
          {!q.ok && !!coupon && <Text style={s.e}>{q.error}</Text>}
        </Card>

        <H2>3 • Scholarship story (only for SCHOLAR100)</H2>
        <Card>
          <Muted>{SCHOLARSHIP_PROMPT}</Muted>
          <TextInput value={story} onChangeText={setStory} multiline placeholder="Your story…" placeholderTextColor="#64748b" style={[s.input, { minHeight: 80 }]} maxLength={500} />
          <Muted>{story.trim().length}/20 minimum</Muted>
        </Card>

        {!!err && <Text style={s.e}>{err}</Text>}
        {!!msg && (
          <Card>
            <Body>{msg}</Body>
          </Card>
        )}
        <Pressable onPress={checkout} style={s.go}>
          <Text style={s.goT}>
            {product.kind === 'free' ? 'Enroll free →' : q.ok && q.quote?.total === 0 ? 'Enroll with 100% code →' : `Pay ${q.ok && q.quote ? money(q.quote.total) : money(product.priceCents)} (demo) →`}
          </Text>
        </Pressable>
        <Muted>Demo checkout — no real charge. Production connects Stripe/RevenueCat to these same plans.</Muted>

        <H2>Payment history ({history.length})</H2>
        {history.length === 0 && <Muted>No purchases yet — receipts appear here with invoice IDs.</Muted>}
        {history.map((p) => {
          const open = openInv === p.id;
          return (
            <Card key={p.id}>
              <Pressable onPress={() => setOpenInv(open ? null : p.id)}>
                <View style={s.row}>
                  <Text style={s.planT}>
                    {p.id} — {p.productTitle}
                  </Text>
                  <Chip label={money(p.total)} tone={p.total === 0 ? 'success' : 'default'} />
                </View>
                <Muted>
                  {p.at.slice(0, 10)} • {p.kind}{p.coupon ? ` • ${p.coupon}` : ''} {open ? '−' : '+'}
                </Muted>
              </Pressable>
              {open && (
                <View style={s.inv}>
                  <Text selectable style={s.receipt}>
                    {receiptText(p)}
                  </Text>
                  <Pressable onPress={() => shareReceipt(p)} style={s.small}>
                    <Text style={s.smallT}>Share / copy invoice</Text>
                  </Pressable>
                </View>
              )}
            </Card>
          );
        })}
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  plan: { backgroundColor: Theme.colors.card, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.radius.md, padding: 16, marginVertical: 6 },
  planOn: { borderColor: Theme.colors.primary, borderWidth: 2 },
  planT: { color: '#fff', fontFamily: Theme.fonts.bold, fontSize: 16, flex: 1 },
  planB: { color: Theme.colors.text, marginTop: 4 },
  perk: { color: Theme.colors.muted, fontSize: 13, marginTop: 2 },
  input: { backgroundColor: Theme.colors.surface, color: '#fff', borderRadius: Theme.radius.md, padding: 14, marginVertical: 6, borderWidth: 1, borderColor: Theme.colors.border, minHeight: Theme.touch.min, fontSize: 16 },
  e: { color: Theme.colors.danger, fontFamily: Theme.fonts.bold, marginVertical: 6 },
  go: { backgroundColor: Theme.colors.primary, borderWidth: 2, borderColor: Theme.colors.goldBorder, padding: 16, borderRadius: Theme.radius.sm, alignItems: 'center', marginTop: 8, minHeight: Theme.touch.min, justifyContent: 'center' },
  goT: { color: Theme.colors.onPrimary, fontFamily: Theme.fonts.bold, fontSize: 16 },
  inv: { marginTop: 8, borderTopWidth: 1, borderTopColor: Theme.colors.border, paddingTop: 8 },
  receipt: { color: Theme.colors.text, fontFamily: Theme.fonts.mono, fontSize: 13, lineHeight: 19 },
  small: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 8, padding: 12, marginTop: 8, alignItems: 'center', minHeight: Theme.touch.min, justifyContent: 'center' },
  smallT: { color: Theme.colors.accent, fontFamily: Theme.fonts.bold },
});
