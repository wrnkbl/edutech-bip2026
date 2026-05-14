import { DatabaseAPI } from './DatabaseAPI';
import { Store } from '../../model';
import { createUuid } from '../../model/utils';
// Require JSON at runtime for maximum bundler compatibility
const mockDbJson: any = require('../../../../assets/mockDBData.json');

/**
 * Mock implementation of DatabaseAPI. Reads from static JSON and does not persist writes.
 */
export class MockDatabaseAPI extends DatabaseAPI {
  private data: {
    points: Record<string, Record<string, number>>; // courseUuid -> userUuid -> points
    assignmentPoints?: Record<string, number>;
    currentUser?: string;
    userPoints?: Record<string, number>;
    userStores?: Record<string, any>;
  };

  constructor() {
    super();
    // Keep tests/debug deterministic: each init() starts from clean mock JSON.
    this.data = JSON.parse(JSON.stringify(mockDbJson));
  }

  async getUserPointsInCourse(userUuid: string, courseUuid: string): Promise<number> {
    // simulate delay
    await new Promise((r) => setTimeout(r, 150));

    const course = this.data.points?.[courseUuid];
    if (!course) return 0;

    const points = course[userUuid];
    return points ?? 0;
  }

  async setUserPointsInCourse(userUuid: string, courseUuid: string, points: number): Promise<void> {
    // In mock: do nothing (no persistence). Keep async signature for parity with real DB.
    await new Promise((r) => setTimeout(r, 50));
    // no-op
  }

  async getAssignmentPointsMax(assignmentUuid: string): Promise<number> {
    await new Promise((r) => setTimeout(r, 50));

    const points = this.data.assignmentPoints?.[assignmentUuid];
    return points ?? 0;
  }

  async getUserPoints(): Promise<number> {
    await new Promise((r) => setTimeout(r, 100));
    const user = this.data.currentUser;
    if (!user) return 0;

    const stored = this.data.userPoints?.[user];
    if (typeof stored === 'number' && Number.isFinite(stored)) {
      return stored;
    }

    let total = 0;
    for (const courseUuid of Object.keys(this.data.points || {})) {
      const course = this.data.points[courseUuid];
      const v = course[user];
      if (typeof v === 'number' && Number.isFinite(v)) total += v;
    }
    return total;
  }

  async getStore(): Promise<Store | null> {
    await new Promise((r) => setTimeout(r, 100));
    const user = this.data.currentUser;
    if (!user) return null;
    const s = this.data.userStores?.[user];
    if (!s) return null;
    try {
      return Store.fromJson(s);
    } catch {
      return null;
    }
  }

  async claimItem(itemUuid: string, userUuid: string, timestamp: Date): Promise<string | null> {
    await new Promise((r) => setTimeout(r, 100));

    const storeJson = this.data.userStores?.[userUuid];
    if (!storeJson) return null;

    const store = Store.fromJson(storeJson);
    const item = store.vendors.flatMap((vendor) => vendor.items).find((i) => i.uuid === itemUuid);
    if (!item) return null;

    // Check reclaim cooldown if item was claimed before
    const claimedItemsArray = Object.values(store.claimedItems).filter(
      (claim: any) => claim.itemUuid === itemUuid,
    );
    
    if (claimedItemsArray.length > 0) {
      // Get the most recent claim
      const lastClaim = claimedItemsArray.reduce((latest: any, current: any) => {
        const currentTime = current.timestamp instanceof Date ? current.timestamp.getTime() : new Date(current.timestamp).getTime();
        const latestTime = latest.timestamp instanceof Date ? latest.timestamp.getTime() : new Date(latest.timestamp).getTime();
        return currentTime > latestTime ? current : latest;
      });

      const lastClaimedTime = lastClaim.timestamp instanceof Date ? lastClaim.timestamp.getTime() : new Date(lastClaim.timestamp).getTime();
      const timeSinceLastClaim = timestamp.getTime() - lastClaimedTime;
      const cooldownMs = item.reclaimCooldown * 1000;
      if (timeSinceLastClaim < cooldownMs) {
        return null; // Still in cooldown
      }
    }

    const currentPoints = this.data.userPoints?.[userUuid] ?? 0;
    if (currentPoints < item.pointsCost) return null;

    if (!this.data.userPoints) {
      this.data.userPoints = {};
    }
    this.data.userPoints[userUuid] = currentPoints - item.pointsCost;

    const userStores = (this.data.userStores ??= {});
    if (!userStores[userUuid]) {
      userStores[userUuid] = store.toJson();
    }
    
    const claimUuid = createUuid();
    userStores[userUuid].claimedItems = {
      ...(userStores[userUuid].claimedItems || {}),
      [claimUuid]: {
        itemUuid,
        timestamp: timestamp.toISOString(),
      },
    };

    return claimUuid;
  }
}


