import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_600SemiBold,
} from '@expo-google-fonts/outfit';
import { TenorSans_400Regular } from '@expo-google-fonts/tenor-sans';
import { RobotoMono_400Regular, RobotoMono_700Bold } from '@expo-google-fonts/roboto-mono';
import { AuthProvider, ProgressProvider } from '../src/store/store';
import { Theme } from '../src/theme';

// Keep native splash visible until fonts + router are ready (all platforms).
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_600SemiBold,
    TenorSans_400Regular,
    RobotoMono_400Regular,
    RobotoMono_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: Theme.colors.bg }} />;

  return (
    <AuthProvider>
      <ProgressProvider>
        <StatusBar style="light" backgroundColor={Theme.colors.bg} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Theme.colors.bg },
            headerTintColor: '#000000',
            headerTitleStyle: { fontFamily: Theme.fonts.bold },
            contentStyle: { backgroundColor: Theme.colors.bg },
            // Android: slide; iOS: default push — set explicitly for consistency
            animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)/welcome" options={{ title: 'Welcome' }} />
          <Stack.Screen name="(onboarding)/assessment" options={{ title: 'Skill check' }} />
          <Stack.Screen name="(auth)/login" options={{ title: 'Sign in' }} />
          <Stack.Screen name="(auth)/register" options={{ title: 'Create account' }} />
          <Stack.Screen name="(auth)/forgot" options={{ title: 'Reset password' }} />
          <Stack.Screen name="(auth)/verify" options={{ title: 'Verify & recover' }} />
          <Stack.Screen name="lesson/[id]" options={{ title: 'Lesson' }} />
          <Stack.Screen name="video/[id]" options={{ title: 'Walkthrough' }} />
          <Stack.Screen name="module/[id]" options={{ title: 'Module' }} />
          <Stack.Screen name="project/[id]" options={{ title: 'Project workspace' }} />
          <Stack.Screen name="progress" options={{ title: 'Progress' }} />
          <Stack.Screen name="enroll" options={{ title: 'Enroll' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          <Stack.Screen name="achievements" options={{ title: 'Achievements' }} />
          <Stack.Screen name="planner" options={{ title: 'AI Project Planner' }} />
          <Stack.Screen name="assistant" options={{ title: 'Learning Assistant' }} />
          <Stack.Screen name="meet" options={{ title: 'Meet & Greet' }} />
          <Stack.Screen name="community" options={{ title: 'Community' }} />
          <Stack.Screen name="certificates" options={{ title: 'Certificates' }} />
          <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
          <Stack.Screen name="admin" options={{ title: 'Author CMS' }} />
        </Stack>
      </ProgressProvider>
    </AuthProvider>
  );
}
