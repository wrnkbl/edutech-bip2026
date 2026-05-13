import { createUuid } from './utils';

export interface UserInit {
  uuid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UserJson {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class User {
  uuid: string;

  firstName: string;

  lastName: string;

  email: string;

  constructor({
    uuid = createUuid(),
    firstName = '',
    lastName = '',
    email = '',
  }: UserInit = {}) {
    this.uuid = uuid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  static fromJson(json: UserJson): User {
    return new User({
      uuid: json.uuid,
      firstName: json.firstName,
      lastName: json.lastName,
      email: json.email,
    });
  }

  toJson(): UserJson {
    return {
      uuid: this.uuid,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    };
  }
}


