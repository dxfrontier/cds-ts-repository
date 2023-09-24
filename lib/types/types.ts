import type SelectBuilder from '../util/SelectBuilder';

type KeyValueType<T> = {
  [K in keyof T]?: T[K];
};

type Locale = string;

interface RepositoryPredefinedMethods<T> {
  create: (entry: KeyValueType<T>) => INSERT<T>;
  createAll: (entries: Array<KeyValueType<T>>) => INSERT<T>;

  getAll: () => SELECT<T[]>;
  getAllDistinct: () => SELECT<T[]>;
  getAllAndLimit: (props: { limit: number; offset?: number }) => SELECT<T[]>;

  find: (keys: KeyValueType<T>) => SELECT<T[]>;
  findOne: (keys: KeyValueType<T>) => SELECT<T>;
  findBuilder: (keys: KeyValueType<T>) => SelectBuilder<T>;

  update: (keys: KeyValueType<T>, fieldsToUpdate: KeyValueType<T>) => Promise<boolean>;
  updateAllBy: (
    entries: Array<{
      keys: KeyValueType<T>;
      fieldsToUpdate: KeyValueType<T>;
    }>,
  ) => Promise<boolean>;
  updateLocaleTexts: (keys: Locale, fieldsToUpdate: KeyValueType<T>) => Promise<boolean>;

  delete: (keys: KeyValueType<T>) => Promise<boolean>;
  deleteAll: (entries: Array<KeyValueType<T>>) => Promise<boolean>;

  exists: (keys: KeyValueType<T>) => Promise<boolean>;

  count: () => Promise<number>;
}

export type { RepositoryPredefinedMethods, KeyValueType, Locale };
