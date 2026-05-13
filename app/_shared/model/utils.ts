export type DateLike = string | Date | null | undefined;

export const createUuid = (): string => {
  const crypto = globalThis.crypto as Crypto | undefined;

  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }

  return `uuid-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

export const toDate = (value: DateLike): Date | null => {
  if (value == null) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const dateToJson = (value: DateLike): string | null => {
  const date = toDate(value);

  return date ? date.toISOString() : null;
};

export const cloneNumberRecord = (
  record: Record<string, number | null | undefined> = {},
): Record<string, number> => {
  const result: Record<string, number> = {};

  for (const [key, value] of Object.entries(record)) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      result[key] = value;
    }
  }

  return result;
};

export const cloneDateRecord = (
  record: Record<string, DateLike> = {},
): Record<string, Date> => {
  const result: Record<string, Date> = {};

  for (const [key, value] of Object.entries(record)) {
    const date = toDate(value);

    if (date) {
      result[key] = date;
    }
  }

  return result;
};

export const dateRecordToJson = (
  record: Record<string, Date> = {},
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(record)) {
    result[key] = value.toISOString();
  }

  return result;
};

