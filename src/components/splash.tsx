// Branded splash — native splash (assets/splash.png) hands off to this on first paint.
import { View, Text, StyleSheet, Image } from 'react-native';
import { Theme } from '../theme';
import { PRODUCT } from '../constants/branding';

export function AppSplash({ hint }: { hint?: string }) {
  return (
    <View style={s.wrap}>
      <Image source={require('../../assets/splash.png')} style={s.logo} resizeMode="contain" accessibilityLabel="AI-MasterPlan logo" />
      <Text style={s.name}>{PRODUCT.name}</Text>
      <Text style={s.tag}>{PRODUCT.tagline}</Text>
      <View style={s.bar}>
        <View style={s.fill} />
      </View>
      <Text style={s.hint}>{hint ?? 'Loading your guided path…'}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: Theme.colors.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  logo: { width: 120, height: 120, marginBottom: 16 },
  name: { color: '#fff', fontFamily: Theme.fonts.black, fontSize: 36, letterSpacing: -0.5 },
  tag: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  bar: { width: 180, height: 6, borderRadius: 3, backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border, marginTop: 24, overflow: 'hidden' },
  fill: { width: '60%', height: '100%', backgroundColor: Theme.colors.primary },
  hint: { color: Theme.colors.muted, fontFamily: Theme.fonts.regular, fontSize: 12, marginTop: 12 },
});
