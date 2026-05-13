import { StoreItem, type StoreItemInit, type StoreItemJson } from './StoreItem';
import { createUuid } from './utils';

export interface StoreVendorInit {
  uuid?: string;
  name?: string;
  items?: (StoreItem | StoreItemInit | StoreItemJson)[];
}

export interface StoreVendorJson {
  uuid: string;
  name: string;
  items: StoreItemJson[];
}

export class StoreVendor {
  uuid: string;

  name: string;

  items: StoreItem[];

  constructor({
    uuid = createUuid(),
    name = '',
    items = [],
  }: StoreVendorInit = {}) {
    this.uuid = uuid;
    this.name = name;
    this.items = items.map((item) => (item instanceof StoreItem ? item : new StoreItem(item)));
  }

  static fromJson(json: StoreVendorJson): StoreVendor {
    return new StoreVendor({
      uuid: json.uuid,
      name: json.name,
      items: json.items.map((item) => StoreItem.fromJson(item)),
    });
  }

  toJson(): StoreVendorJson {
    return {
      uuid: this.uuid,
      name: this.name,
      items: this.items.map((item) => item.toJson()),
    };
  }
}


