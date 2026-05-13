import { Assignment, Course, User } from '../../model';

/**
 * Abstract interface for university API operations.
 * Defines the contract for authentication and course data retrieval.
 */
export abstract class UniversityAPI {
  /**
   * Authenticate a user and retrieve their user information.
   * @returns Promise resolving to the authenticated user
   */
  abstract authenticate(): Promise<User>;

  /**
   * Retrieve all courses assigned to the authenticated user.
   * @returns Promise resolving to a list of courses
   */
  abstract getCourses(): Promise<Course[]>;

  /**
   * Retrieve all assignments for a specific course.
   * @param course The course to fetch assignments for
   * @returns Promise resolving to a list of assignments
   */
  abstract getAssignments(course: Course): Promise<Assignment[]>;

  /**
   * Retrieve all users enrolled in a specific course.
   * Used to populate leaderboards and course participant lists.
   * @param course The course to fetch users for
   * @returns Promise resolving to a list of users in the course
   */
  abstract getCourseUsers(course: Course): Promise<User[]>;
}

