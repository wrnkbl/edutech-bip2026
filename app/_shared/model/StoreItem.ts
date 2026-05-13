import { createUuid } from './utils';

export interface StoreItemInit {
  uuid?: string;
  name?: string;
  description?: string;
  pointsCost?: number;
  reclaimable?: boolean;
  reclaimCooldown?: number;
  image?: string;
}

export interface StoreItemJson {
  uuid: string;
  name: string;
  description: string;
  pointsCost: number;
  reclaimable: boolean;
  reclaimCooldown: number;
  image: string;
}

export class StoreItem {
  uuid: string;

  name: string;

  description: string;

  pointsCost: number;

  reclaimable: boolean;

  reclaimCooldown: number;

  image: string;

  constructor({
    uuid = createUuid(),
    name = '',
    description = '',
    pointsCost = 0,
    reclaimable = false,
    reclaimCooldown = 0,
    image = '',
  }: StoreItemInit = {}) {
    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.pointsCost = pointsCost;
    this.reclaimable = reclaimable;
    this.reclaimCooldown = reclaimCooldown;
    this.image = image;
  }

  static fromJson(json: StoreItemJson): StoreItem {
    return new StoreItem({
      uuid: json.uuid,
      name: json.name,
      description: json.description,
      pointsCost: json.pointsCost,
      reclaimable: json.reclaimable,
      reclaimCooldown: json.reclaimCooldown,
      image: json.image,
    });
  }

  toJson(): StoreItemJson {
    return {
      uuid: this.uuid,
      name: this.name,
      description: this.description,
      pointsCost: this.pointsCost,
      reclaimable: this.reclaimable,
      reclaimCooldown: this.reclaimCooldown,
      image: this.image,
    };
  }
}

