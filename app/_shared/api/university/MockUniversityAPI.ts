import { Assignment, Course, User } from '../../model';
import { UniversityAPI } from './UniversityAPI';
import mockDataJson from '../../../../assets/mockData.json';

/**
 * Mock implementation of UniversityAPI.
 * Reads data from a static JSON file for development and testing purposes.
 */
export class MockUniversityAPI extends UniversityAPI {
  private mockData = mockDataJson as {
    user: any;
    courses: any[];
  };

  /**
   * Returns the mock user from the JSON data.
   */
  async authenticate(): Promise<User> {
    // Simulate async operation
    await this.delay(500);

    return User.fromJson(this.mockData.user);
  }

  /**
   * Returns all mock courses from the JSON data.
   */
  async getCourses(): Promise<Course[]> {
    // Simulate async operation
    await this.delay(500);

    return this.mockData.courses.map((courseJson) => Course.fromJson(courseJson));
  }

  /**
   * Returns assignments from the provided course.
   * @param course The course to fetch assignments from
   */
  async getAssignments(course: Course): Promise<Assignment[]> {
    // Simulate async operation
    await this.delay(300);

    // Find the course in mock data and return its assignments
    const courseData = this.mockData.courses.find((c) => c.uuid === course.uuid);

    if (!courseData) {
      return [];
    }

    return courseData.assignments.map((assignmentJson: any) =>
      Assignment.fromJson(assignmentJson),
    );
  }

  /**
   * Returns all users enrolled in a course.
   * @param course The course to fetch users for
   */
  async getCourseUsers(course: Course): Promise<User[]> {
    // Simulate async operation
    await this.delay(400);

    // Find the course in mock data and return its users
    const courseData = this.mockData.courses.find((c) => c.uuid === course.uuid);

    if (!courseData || !courseData.users) {
      return [];
    }

    return courseData.users.map((userJson: any) => User.fromJson(userJson));
  }

  /**
   * Utility method to simulate network delay.
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

