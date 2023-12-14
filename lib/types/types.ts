import type { Request } from '@sap/cds/apis/events';

import { type LanguageCode } from 'iso-639-1';
import type SelectBuilder from '../util/SelectBuilder';
import type Filter from '../util/Filter';

type LooseAutocomplete<T extends string> = T | Omit<string, T>;

/**
 * Use this type to have the Request typed
 */
type TypedRequest<T> = Omit<Request, 'data'> & { data: T };

type KeyValueType<T> = {
  [K in keyof T]?: T[K];
};

type DraftAdministrativeFields = {
  DraftAdministrativeData_DraftUUID?: string;
  HasActiveEntity?: boolean;
};

type KeyValueDraftType<T> = T & DraftAdministrativeFields;

type InsertResult<T> = {
  query: {
    INSERT: {
      entries: T[];
    };
  };
};

type Locale = {
  locale: LooseAutocomplete<LanguageCode>;
};

type FindReturn<T> = {
  /**
   * Finds records based on the provided keys.
   * @param keys An object representing the keys to filter the records.
   * @returns SelectBuilder
   * @example const results = await this.builder().find({ name : 'Customer 1', company : 'home' }).execute()
   *
   * */
  find<Keys extends KeyValueType<T>>(keys: KeyValueType<T>): SelectBuilder<T, Keys>;

  /**
   * Finds records based on the provided filters.
   * @param filter A Filter instance
   * @returns SelectBuilder
   * @example
   * const filterLike = new Filter<Book>({
   *  field: 'currency_code',
   *  operator: 'LIKE',
   *  value: 'GBP',
   * });
   *
   * const results = await this.builder().find(filter).execute()
   *
   * */
  find<T>(filter: Filter<T>): SelectBuilder<T, string>;
};

type LogicalOperator = 'AND' | 'OR';

type FilterOperatorWhenSingleValue =
  | 'EQUALS'
  | 'LIKE'
  | 'LESS THAN'
  | 'LESS THAN OR EQUALS'
  | 'GREATER THAN'
  | 'GREATER THAN OR EQUALS';
type FilterOperatorWhenTwoValues = 'BETWEEN' | 'NOT BETWEEN';
type FilterOperatorWhenSingleArrayValue = 'IN' | 'NOT IN';

type FilterOperator = FilterOperatorWhenSingleValue | FilterOperatorWhenTwoValues | FilterOperatorWhenSingleArrayValue;

type FilterSingleValue = {
  operator: FilterOperatorWhenSingleValue;
  value: string | number;
};

type FilterBetween = {
  operator: FilterOperatorWhenTwoValues;
  value1: string | number;
  value2: string | number;
};

type FilterInAndNotIn = {
  operator: FilterOperatorWhenSingleArrayValue;
  value: string[] | number[];
};

type FilterOptions<T> = {
  field: keyof T;
} & (FilterSingleValue | FilterBetween | FilterInAndNotIn);

export type {
  KeyValueType,
  KeyValueDraftType,
  Locale,
  InsertResult,
  DraftAdministrativeFields,
  TypedRequest,
  // Builder types
  FindReturn,
  LogicalOperator,
  FilterOperator,
  FilterOptions,
};
