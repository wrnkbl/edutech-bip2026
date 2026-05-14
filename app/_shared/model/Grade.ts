import { createUuid } from './utils';

export interface GradeInit {
  uuid?: string;
  value?: number;
  scale?: number[];
  assignmentId?: string;
}

export interface GradeJson {
  uuid: string;
  value: number;
  scale: number[];
  assignmentId: string;
}

export class Grade {
  uuid: string;

  value: number;

  scale: number[];

  assignmentId: string;

  constructor({
    uuid = createUuid(),
    value = 0,
    scale = [],
    assignmentId = '',
  }: GradeInit = {}) {
    this.uuid = uuid;
    this.value = value;
    this.scale = [...scale];
    this.assignmentId = assignmentId;
  }

  percentage(): number {
    const max = this.scale.length > 0 ? this.scale[this.scale.length - 1] : undefined;

    if (typeof max !== 'number' || max === 0) {
      return 0;
    }

    return this.value / max;
  }

  static fromJson(json: GradeJson): Grade {
    return new Grade({
      uuid: json.uuid,
      value: json.value,
      scale: json.scale,
      assignmentId: json.assignmentId,
    });
  }

  toJson(): GradeJson {
    return {
      uuid: this.uuid,
      value: this.value,
      scale: [...this.scale],
      assignmentId: this.assignmentId,
    };
  }
}


