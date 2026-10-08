import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Theme } from '../src/theme';
export default function NotFound() {
  return (
    <View style={s.c}>
      <Text style={s.t}>Page not found</Text>
      <Link href="/home"><Text style={s.l}>Go home</Text></Link>
    </View>
  );
}
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: Theme.colors.bg, justifyContent: 'center', padding: 24 }, t: { color: Theme.colors.text, fontSize: 22, fontWeight: '800' }, l: { color: Theme.colors.accent, marginTop: 12 } });
