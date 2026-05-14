import { DatabaseAPI } from './DatabaseAPI';
// Require JSON at runtime for maximum bundler compatibility
const mockDbJson: any = require('../../../../assets/mockDBData.json');

/**
 * Mock implementation of DatabaseAPI. Reads from static JSON and does not persist writes.
 */
export class MockDatabaseAPI extends DatabaseAPI {
  private data = mockDbJson as {
    points: Record<string, Record<string, number>>; // courseUuid -> userUuid -> points
    assignmentPoints?: Record<string, number>;
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
}


