import { Capriola_400Regular } from '@expo-google-fonts/capriola';
import { TitanOne_400Regular, useFonts } from '@expo-google-fonts/titan-one';
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import React, { useEffect } from 'react';
import { useAppState } from './_shared/appstate/store';

export default function RootLayout() {
  const init = useAppState((s: any) => s.init);
  const isAuthenticated = useAppState((s: any) => s.isAuthenticated);
  
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const [fontsLoaded] = useFonts({
    'TitanOne': TitanOne_400Regular,
    'Capriola': Capriola_400Regular,
  });

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!navigationState?.key || !fontsLoaded) return; 

    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inTabsGroup) {
      router.replace('/login');
    } else if (isAuthenticated && segments[0] === 'login') {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, navigationState?.key, fontsLoaded]);

  if (!fontsLoaded) return null; 

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
    </Stack>
  );
}

/*import { Stack } from "expo-router";
import React, { useEffect } from 'react';
import { MockUniversityAPI } from './_shared/api/university/MockUniversityAPI';
import { useAppState, AppStateStore } from './_shared/appstate/store';

export default function RootLayout() {
  const init = useAppState((s: any) => s.init);

  useEffect(() => {
    init();

    // Optionally auto-authenticate and fetch all data on startup
    (async () => {
      const ok = await useAppState.getState().authenticate();
      if (ok) {
        await useAppState.getState().fetchAllData();
      }
    })();
  }, [init]);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
*/