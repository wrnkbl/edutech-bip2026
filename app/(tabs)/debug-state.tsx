import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { useAppState } from '../_shared/appstate';
import { MockUniversityAPI } from '../_shared/api/university/MockUniversityAPI';

export default function DebugStateScreen() {
  const [output, setOutput] = useState<string>('');
  const isLoading = useAppState((s: any) => s.isLoading);

  const handleLoad = async () => {
    // initialize API
    const api = new MockUniversityAPI();
    useAppState.getState().init(api);

    // authenticate
    const ok = await useAppState.getState().authenticate();

    // fetch all data if authenticated
    if (ok) {
      await useAppState.getState().fetchAllData();
    }

    // grab the snapshot and pretty-print
    const state = useAppState.getState();
    const snapshot = {
      user: state.user,
      courses: state.courses,
      allAssignments: state.allAssignments,
      courseUsers: state.courseUsers,
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
    };

    setOutput(JSON.stringify(snapshot, null, 2));
    console.log('App state snapshot:', snapshot);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ marginBottom: 12 }}>
        <Button title={isLoading ? 'Loading...' : 'Init + Authenticate + Fetch All Data'} onPress={handleLoad} />
      </View>

      <View>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>State snapshot:</Text>
        <Text style={{ fontFamily: 'monospace' }}>{output || '(no data loaded yet)'}</Text>
      </View>
    </ScrollView>
  );
}

