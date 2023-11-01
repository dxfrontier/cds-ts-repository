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

interface BuilderType<T> {
  find: (keys: KeyValueType<T>) => SelectBuilder<T>;
}

interface RepositoryPredefinedMethods<T> {
  create: (entry: KeyValueType<T>) => Promise<InsertResult<T>>;
  createMany: (entries: Array<KeyValueType<T>>) => Promise<InsertResult<T>>;

  getAll: () => Promise<T[]>;
  getDistinctColumns: <Column extends keyof T>(columns: Column[]) => Promise<Array<Pick<T, Column>>>;
  getAllAndLimit: (props: { limit: number; offset?: number }) => Promise<T[]>;
  getLocaleTexts: <Column extends keyof T>(columns: Column[]) => Promise<Array<Pick<T, Column> & Locale>>;

  find: (keys: KeyValueType<T>) => Promise<T[]>;
  findOne: (keys: KeyValueType<T>) => Promise<T>;
  builder: () => BuilderType<T>;

  update: (keys: KeyValueType<T>, fieldsToUpdate: KeyValueType<T>) => Promise<boolean>;

  updateLocaleTexts: (keys: KeyValueType<T> & Locale, fieldsToUpdate: KeyValueType<T>) => Promise<boolean>;

  delete: (keys: KeyValueType<T>) => Promise<boolean>;
  deleteMany: (entries: Array<KeyValueType<T>>) => Promise<boolean>;

  exists: (keys: KeyValueType<T>) => Promise<boolean>;

  count: () => Promise<number>;
}

export type { KeyValueType, Locale, InsertResult, BuilderType, RepositoryPredefinedMethods };
