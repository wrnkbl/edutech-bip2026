import { createUuid, dateToJson, toDate } from './utils';

export interface AssignmentInit {
  uuid?: string;
  name?: string;
  description?: string;
  dueDate?: string | Date | null;
  submissionDate?: string | Date | null;
  pointsGained?: number | null;
  pointsMax?: number;
}

export interface AssignmentJson {
  uuid: string;
  name: string;
  description: string;
  dueDate: string;
  submissionDate: string | null;
  pointsGained: number | null;
  pointsMax: number;
}

export class Assignment {
  uuid: string;

  name: string;

  description: string;

  dueDate: Date;

  submissionDate: Date | null;

  pointsGained: number | null;

  pointsMax: number;

  constructor({
    uuid = createUuid(),
    name = '',
    description = '',
    dueDate = new Date(),
    submissionDate = null,
    pointsGained = null,
    pointsMax = 0,
  }: AssignmentInit = {}) {
    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.dueDate = toDate(dueDate) ?? new Date();
    this.submissionDate = toDate(submissionDate);
    this.pointsGained = pointsGained;
    this.pointsMax = pointsMax;
  }

  static fromJson(json: AssignmentJson): Assignment {
    return new Assignment({
      uuid: json.uuid,
      name: json.name,
      description: json.description,
      dueDate: json.dueDate,
      submissionDate: json.submissionDate,
      pointsGained: json.pointsGained,
      pointsMax: json.pointsMax,
    });
  }

  toJson(): AssignmentJson {
    return {
      uuid: this.uuid,
      name: this.name,
      description: this.description,
      dueDate: dateToJson(this.dueDate) ?? new Date().toISOString(),
      submissionDate: dateToJson(this.submissionDate),
      pointsGained: this.pointsGained,
      pointsMax: this.pointsMax,
    };
  }
}

