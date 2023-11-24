import { type LanguageCode } from 'iso-639-1';

type LooseAutocomplete<T extends string> = T | Omit<string, T>;

type KeyValueType<T> = {
  [K in keyof T]?: T[K];
};

interface DraftAdministrativeFields {
  DraftAdministrativeData_DraftUUID?: string;
  HasActiveEntity?: boolean;
}

type KeyValueDraftType<T> = T & DraftAdministrativeFields;

interface InsertResult<T> {
  query: {
    INSERT: {
      entries: T[];
    };
  };
}

interface Locale {
  locale: LooseAutocomplete<LanguageCode>;
}

export type { KeyValueType, KeyValueDraftType, Locale, InsertResult, DraftAdministrativeFields };
