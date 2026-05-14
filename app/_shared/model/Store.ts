import { StoreVendor, type StoreVendorInit, type StoreVendorJson } from './StoreVendor';
import { createUuid } from './utils';

export interface ClaimedItemRecord {
  itemUuid: string;
  timestamp: Date;
}

export interface ClaimedItemRecordJson {
  itemUuid: string;
  timestamp: string;
}

export interface StoreInit {
  uuid?: string;
  vendors?: (StoreVendor | StoreVendorInit | StoreVendorJson)[];
  claimedItems?: Record<string, ClaimedItemRecord | ClaimedItemRecordJson | { itemUuid: string; timestamp: string | Date }>;
}

export interface StoreJson {
  uuid: string;
  vendors: StoreVendorJson[];
  claimedItems: Record<string, ClaimedItemRecordJson>;
}

export class Store {
  uuid: string;

  vendors: StoreVendor[];

  claimedItems: Record<string, ClaimedItemRecord>;

  constructor({
    uuid = createUuid(),
    vendors = [],
    claimedItems = {},
  }: StoreInit = {}) {
    this.uuid = uuid;
    this.vendors = vendors.map((vendor) =>
      vendor instanceof StoreVendor ? vendor : new StoreVendor(vendor),
    );
    this.claimedItems = this.normalizeClaimedItems(claimedItems);
  }

  private normalizeClaimedItems(items: Record<string, any>): Record<string, ClaimedItemRecord> {
    const result: Record<string, ClaimedItemRecord> = {};
    for (const [key, value] of Object.entries(items)) {
      if (value && typeof value === 'object') {
        result[key] = {
          itemUuid: value.itemUuid,
          timestamp: value.timestamp instanceof Date ? value.timestamp : new Date(value.timestamp),
        };
      }
    }
    return result;
  }

  static fromJson(json: StoreJson): Store {
    return new Store({
      uuid: json.uuid,
      vendors: json.vendors.map((vendor) => StoreVendor.fromJson(vendor)),
      claimedItems: json.claimedItems,
    });
  }

  toJson(): StoreJson {
    const claimedItemsJson: Record<string, ClaimedItemRecordJson> = {};
    for (const [key, value] of Object.entries(this.claimedItems)) {
      claimedItemsJson[key] = {
        itemUuid: value.itemUuid,
        timestamp: value.timestamp.toISOString(),
      };
    }
    return {
      uuid: this.uuid,
      vendors: this.vendors.map((vendor) => vendor.toJson()),
      claimedItems: claimedItemsJson,
    };
  }
}


