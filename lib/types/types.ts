import type SelectBuilder from '../util/SelectBuilder';

type KeyValueType<T> = {
  [K in keyof T]?: T[K];
};

interface InsertResult<T> {
  query: {
    INSERT: {
      entries: T[];
    };
  };
}

interface Locale {
  locale: string;
}

interface RepositoryPredefinedMethods<T> {
  create: (entry: KeyValueType<T>) => Promise<InsertResult<T>>;
  createAll: (entries: Array<KeyValueType<T>>) => Promise<InsertResult<T>>;

  getAll: () => Promise<T[]>;
  getDistinctColumns: (columns: Array<keyof T>) => Promise<T[]>;
  getAllAndLimit: (props: { limit: number; offset?: number }) => Promise<T[]>;
  getAllLocaleTexts: () => Promise<T[]>;

  find: (keys: KeyValueType<T>) => Promise<T[]>;
  findOne: (keys: KeyValueType<T>) => SELECT<T>;
  findBuilder: (keys: KeyValueType<T>) => SelectBuilder<T>;

  update: (keys: KeyValueType<T>, fieldsToUpdate: KeyValueType<T>) => Promise<boolean>;
  updateAll: (
    entries: Array<{
      keys: KeyValueType<T>;
      fieldsToUpdate: KeyValueType<T>;
    }>,
  ) => Promise<boolean>;
  updateLocaleTexts: (keys: KeyValueType<T> & Locale, fieldsToUpdate: KeyValueType<T>) => Promise<boolean>;

  delete: (keys: KeyValueType<T>) => Promise<boolean>;
  deleteAll: (entries: Array<KeyValueType<T>>) => Promise<boolean>;

  exists: (keys: KeyValueType<T>) => Promise<boolean>;

  count: () => Promise<number>;
}

export type { KeyValueType, Locale, InsertResult, RepositoryPredefinedMethods };
