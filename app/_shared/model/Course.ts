import { Assignment, type AssignmentInit, type AssignmentJson } from './Assignment';
import { createUuid, cloneNumberRecord } from './utils';

export interface CourseInit {
  uuid?: string;
  name?: string;
  description?: string;
  assignments?: (Assignment | AssignmentInit | AssignmentJson)[];
  leaderboard?: Record<string, number | null | undefined>;
  pointsGained?: number | null;
  pointsMax?: number;
}


export interface CourseJson {
  uuid: string;
  name: string;
  description: string;
  assignments: AssignmentJson[];
  leaderboard: Record<string, number>;
  pointsGained?: number;
  pointsMax?: number;
}

export class Course {
  uuid: string;

  name: string;

  description: string;

  assignments: Assignment[];

  leaderboard: Record<string, number>;
  pointsGained: number | null;
  pointsMax: number;

  constructor({
    uuid = createUuid(),
    name = '',
    description = '',
    assignments = [],
    leaderboard = {},
    pointsGained = null,
    pointsMax = 0,
  }: CourseInit = {}) {
    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.assignments = assignments.map((assignment) =>
      assignment instanceof Assignment ? assignment : new Assignment(assignment),
    );
    this.leaderboard = cloneNumberRecord(leaderboard);
    this.pointsGained = pointsGained ?? null;
    this.pointsMax = pointsMax ?? 0;
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
      pointsGained: json.pointsGained,
      pointsMax: json.pointsMax,
    });
  }

  toJson(): CourseJson {
    return {
      uuid: this.uuid,
      name: this.name,
      description: this.description,
      assignments: this.assignments.map((assignment) => assignment.toJson()),
      leaderboard: cloneNumberRecord(this.leaderboard),
      pointsGained: this.pointsGained ?? undefined,
      pointsMax: this.pointsMax,
    };
  }
}


