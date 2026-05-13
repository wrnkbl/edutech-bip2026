import { StoreVendor, type StoreVendorInit, type StoreVendorJson } from './StoreVendor';
import { cloneDateRecord, createUuid, dateRecordToJson } from './utils';

export interface StoreInit {
  uuid?: string;
  vendors?: (StoreVendor | StoreVendorInit | StoreVendorJson)[];
  claimedItems?: Record<string, string | Date | null | undefined>;
}

export interface StoreJson {
  uuid: string;
  vendors: StoreVendorJson[];
  claimedItems: Record<string, string>;
}

export class Store {
  uuid: string;

  vendors: StoreVendor[];

  claimedItems: Record<string, Date>;

  constructor({
    uuid = createUuid(),
    vendors = [],
    claimedItems = {},
  }: StoreInit = {}) {
    this.uuid = uuid;
    this.vendors = vendors.map((vendor) =>
      vendor instanceof StoreVendor ? vendor : new StoreVendor(vendor),
    );
    this.claimedItems = cloneDateRecord(claimedItems);
  }

  static fromJson(json: StoreJson): Store {
    return new Store({
      uuid: json.uuid,
      vendors: json.vendors.map((vendor) => StoreVendor.fromJson(vendor)),
      claimedItems: json.claimedItems,
    });
  }

  toJson(): StoreJson {
    return {
      uuid: this.uuid,
      vendors: this.vendors.map((vendor) => vendor.toJson()),
      claimedItems: dateRecordToJson(this.claimedItems),
    };
  }
}


