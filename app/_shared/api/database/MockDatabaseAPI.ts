import { DatabaseAPI } from './DatabaseAPI';
import { Store } from '../../model';
// Require JSON at runtime for maximum bundler compatibility
const mockDbJson: any = require('../../../../assets/mockDBData.json');

/**
 * Mock implementation of DatabaseAPI. Reads from static JSON and does not persist writes.
 */
export class MockDatabaseAPI extends DatabaseAPI {
  private data = mockDbJson as {
    points: Record<string, Record<string, number>>; // courseUuid -> userUuid -> points
    assignmentPoints?: Record<string, number>;
    currentUser?: string;
    userStores?: Record<string, any>;
  };

  async getUserPointsInCourse(userUuid: string, courseUuid: string): Promise<number> {
    // simulate delay
    await new Promise((r) => setTimeout(r, 150));

    const course = this.data.points?.[courseUuid];
    if (!course) return 0;

    const points = course[userUuid];
    return typeof points === 'number' && Number.isFinite(points) ? points : 0;
  }

  async setUserPointsInCourse(userUuid: string, courseUuid: string, points: number): Promise<void> {
    // In mock: do nothing (no persistence). Keep async signature for parity with real DB.
    await new Promise((r) => setTimeout(r, 50));
    // no-op
  }

  async getAssignmentPointsMax(assignmentUuid: string): Promise<number> {
    await new Promise((r) => setTimeout(r, 50));

    const points = this.data.assignmentPoints?.[assignmentUuid];
    return typeof points === 'number' && Number.isFinite(points) ? points : 0;
  }

  async getUserPoints(): Promise<number> {
    await new Promise((r) => setTimeout(r, 100));
    const user = this.data.currentUser;
    if (!user) return 0;

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
    } catch (e) {
      return null;
    }
  }
}


