import { Stack } from "expo-router";
import React, { useEffect } from 'react';
import { MockUniversityAPI } from './_shared/api/university/MockUniversityAPI';
import { useAppState, AppStateStore } from './_shared/appstate/store';

export default function RootLayout() {
  const init = useAppState((s: any) => s.init);

  useEffect(() => {
    const api = new MockUniversityAPI();
    init(api);

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
