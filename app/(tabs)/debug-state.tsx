import React, { useMemo, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { useAppState } from '../_shared/appstate';

export default function DebugStateScreen() {
  const [output, setOutput] = useState<string>('');
  const [dbOutput, setDbOutput] = useState<string>('');
  const [claimedOutput, setClaimedOutput] = useState<string>('');
  const isLoading = useAppState((s: any) => s.isLoading);
  const isAuthenticated = useAppState((s: any) => s.isAuthenticated);
  const hasDb = useAppState((s: any) => !!s.db);
  const userPoints = useAppState((s: any) => s.userPoints);
  const store = useAppState((s: any) => s.store);
  const getClaimedItems = useAppState((s: any) => s.getClaimedItems);

  const claimedItems = getClaimedItems();
  const allItems = useMemo(
    () => store?.vendors?.flatMap((vendor: any) => vendor.items ?? []) ?? [],
    [store],
  );

  const claimableItem = useMemo(() => {
    const now = Date.now();
    return (
      allItems.find((item: any) => {
        const recentClaim = claimedItems.find((c: any) => c.item.uuid === item.uuid);
        if (recentClaim) {
          const timeSinceLastClaim = now - recentClaim.claimedAt.getTime();
          const cooldownMs = recentClaim.item.reclaimCooldown * 1000;
          if (timeSinceLastClaim < cooldownMs) {
            return false;
          }
        }
        return item.pointsCost <= userPoints;
      }) ?? null
    );
  }, [allItems, claimedItems, userPoints]);

  const itemWithCooldown = useMemo(
    () => allItems.find((item: any) => item.reclaimCooldown > 0) ?? null,
    [allItems],
  );

  const isDataReady = isAuthenticated && !!store;
  const canTryCooldown = !!itemWithCooldown && userPoints >= itemWithCooldown.pointsCost;

  const refreshSnapshots = async () => {
    const state = useAppState.getState();
    const db = state.db;
    const claimedItems = state.getClaimedItems();

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
    setClaimedOutput(JSON.stringify(claimedItems, null, 2));
    console.log('App state snapshot:', snapshot);
    console.log('DB snapshot:', dbSnapshot);
    console.log('Claimed items snapshot:', claimedItems);
  };

  const handleLoad = async () => {
    // initialize mock API + DB via global state
    useAppState.getState().init();

    // authenticate
    const ok = await useAppState.getState().authenticate();

    // fetch all data if authenticated
    if (ok) {
      await useAppState.getState().fetchAllData();
    }

    await refreshSnapshots();
  };

  const handleClaimFirstItem = async () => {
    if (!claimableItem) {
      return;
    }

    await useAppState.getState().claimItem(claimableItem.uuid);
    await refreshSnapshots();
  };

  const handleClaimItemWithCooldown = async () => {
    if (!itemWithCooldown || !canTryCooldown) {
      return;
    }

    try {
      await useAppState.getState().claimItem(itemWithCooldown.uuid);
      await refreshSnapshots();
    } catch (err: any) {
      alert(`Failed to claim item with cooldown: ${err?.message ?? String(err)}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ marginBottom: 12 }}>
        <Button title={isLoading ? 'Loading...' : 'Init + Authenticate + Fetch All Data'} onPress={handleLoad} />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Button
          title={(() => {
            if (!isDataReady) return 'Load data first';
            return claimableItem ? `Claim first store item (${claimableItem.name})` : 'No claimable item';
          })()}
          onPress={handleClaimFirstItem}
          disabled={!isDataReady || !claimableItem}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Button
          title={(() => {
            if (!isDataReady) return 'Load data first';
            if (!itemWithCooldown) return 'No item with cooldown';
            if (!canTryCooldown) {
              return `Need ${itemWithCooldown.pointsCost} points for cooldown test (${itemWithCooldown.name})`;
            }
            return `Test cooldown - Claim item with cooldown (${itemWithCooldown.name})`;
          })()}
          onPress={handleClaimItemWithCooldown}
          disabled={!isDataReady || !itemWithCooldown || !canTryCooldown}
        />
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
        <Text>Claimable item: {claimableItem?.name ?? '(none)'}</Text>
        <Text>Item with cooldown: {itemWithCooldown?.name ?? '(none)'}</Text>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>DB full snapshot:</Text>
        <Text style={{ fontFamily: 'monospace' }}>{dbOutput || '(no db data loaded yet)'}</Text>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Claimed items (last 15 mins):</Text>
        <Text style={{ fontFamily: 'monospace' }}>{claimedOutput || '(no claimed items yet)'}</Text>
      </View>
    </ScrollView>
  );
}

