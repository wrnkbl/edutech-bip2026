
/**
 * Abstract database API for storing/fetching user points and similar persistent data.
 */
export abstract class DatabaseAPI {
  /**
   * Get stored points for a user in a given course.
   * @param userUuid User UUID
   * @param courseUuid Course UUID
   */
  abstract getUserPointsInCourse(userUuid: string, courseUuid: string): Promise<number>;

  /**
   * Set stored points for a user in a given course.
   * In production this will persist to the DB. Mock may be a no-op.
   * @param userUuid User UUID
   * @param courseUuid Course UUID
   * @param points Points value to store
   */
  abstract setUserPointsInCourse(userUuid: string, courseUuid: string, points: number): Promise<void>;

  /**
   * Get the maximum points for a given assignment (stored in DB).
   * @param assignmentUuid Assignment UUID
   */
  abstract getAssignmentPointsMax(assignmentUuid: string): Promise<number>;
}

