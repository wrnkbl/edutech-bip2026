import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { useAppState } from '../_shared/appstate';

export default function DebugStateScreen() {
  const [output, setOutput] = useState<string>('');
  const [dbOutput, setDbOutput] = useState<string>('');
  const isLoading = useAppState((s: any) => s.isLoading);
  const userPoints = useAppState((s: any) => s.userPoints);
  const store = useAppState((s: any) => s.store);
  const hasDb = useAppState((s: any) => !!s.db);

  const handleLoad = async () => {
    // initialize mock API + DB via global state
    useAppState.getState().init();

    // authenticate
    const ok = await useAppState.getState().authenticate();

    // fetch all data if authenticated
    if (ok) {
      await useAppState.getState().fetchAllData();
    }

    // grab the snapshot and pretty-print
    const state = useAppState.getState();
    const db = state.db;

    const dbSnapshot = db
      ? {
          userPoints: await db.getUserPoints(),
          store: await db.getStore(),
          assignmentPointsMax: await Promise.all(
            Object.values(state.allAssignments)
              .flat()
              .map(async (assignment: any) => ({
                assignmentUuid: assignment.uuid,
                pointsMax: await db.getAssignmentPointsMax(assignment.uuid),
              })),
          ),
        }
      : null;

    const snapshot = {
      user: state.user,
      userPoints: state.userPoints,
      store: state.store,
      courses: state.courses,
      allAssignments: state.allAssignments,
      courseUsers: state.courseUsers,
      hasDb: !!state.db,
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
    };

    setOutput(JSON.stringify(snapshot, null, 2));
    setDbOutput(JSON.stringify(dbSnapshot, null, 2));
    console.log('App state snapshot:', snapshot);
    console.log('DB snapshot:', dbSnapshot);
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

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>DB quick readout:</Text>
        <Text>User points: {userPoints}</Text>
        <Text>Has DB: {String(hasDb)}</Text>
        <Text>Store vendors: {store?.vendors?.length ?? 0}</Text>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>DB full snapshot:</Text>
        <Text style={{ fontFamily: 'monospace' }}>{dbOutput || '(no db data loaded yet)'}</Text>
      </View>
    </ScrollView>
  );
}

