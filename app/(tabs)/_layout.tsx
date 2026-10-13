import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../../src/theme';
import { useTheme } from '../../src/store/theme';

// Melrose-style footer: thin minimal line icon per destination + micro uppercase labels.
const ICONS = {
  home: 'home',
  roadmap: 'map',
  tools: 'tool',
  projects: 'layers',
  profile: 'user',
} as const;

function tabIcon(name: keyof typeof ICONS) {
  return ({ color, size }: { color: string; size: number }) => (
    <Feather name={ICONS[name]} size={size} color={color} strokeWidth={1.5} />
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontFamily: Theme.fonts.bold,
          fontSize: 10,
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="roadmap" options={{ title: 'Roadmap', tabBarIcon: tabIcon('roadmap') }} />
      <Tabs.Screen name="tools" options={{ title: 'Tools', tabBarIcon: tabIcon('tools') }} />
      <Tabs.Screen name="projects" options={{ title: 'Projects', tabBarIcon: tabIcon('projects') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('profile') }} />
    </Tabs>
  );
}
