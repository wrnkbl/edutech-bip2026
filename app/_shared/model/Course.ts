import { Assignment, type AssignmentInit, type AssignmentJson } from './Assignment';
import { createUuid, cloneNumberRecord } from './utils';

export interface CourseInit {
  uuid?: string;
  name?: string;
  description?: string;
  assignments?: (Assignment | AssignmentInit | AssignmentJson)[];
  leaderboard?: Record<string, number | null | undefined>;
}

export interface CourseJson {
  uuid: string;
  name: string;
  description: string;
  assignments: AssignmentJson[];
  leaderboard: Record<string, number>;
}

export class Course {
  uuid: string;

  name: string;

  description: string;

  assignments: Assignment[];

  leaderboard: Record<string, number>;

  constructor({
    uuid = createUuid(),
    name = '',
    description = '',
    assignments = [],
    leaderboard = {},
  }: CourseInit = {}) {
    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.assignments = assignments.map((assignment) =>
      assignment instanceof Assignment ? assignment : new Assignment(assignment),
    );
    this.leaderboard = cloneNumberRecord(leaderboard);
  }

  getMaxPoints(): number {
    return this.assignments.reduce((total, assignment) => total + assignment.pointsMax, 0);
  }

  static fromJson(json: CourseJson): Course {
    return new Course({
      uuid: json.uuid,
      name: json.name,
      description: json.description,
      assignments: json.assignments.map((assignment) => Assignment.fromJson(assignment)),
      leaderboard: json.leaderboard,
    });
  }

  toJson(): CourseJson {
    return {
      uuid: this.uuid,
      name: this.name,
      description: this.description,
      assignments: this.assignments.map((assignment) => assignment.toJson()),
      leaderboard: cloneNumberRecord(this.leaderboard),
    };
  }
}


