import type { TypedRequest } from '@sap/cds/apis/services';

import { type LanguageCode } from 'iso-639-1';
import type SelectBuilder from '../util/SelectBuilder';
import type { Filter } from '../util/Filter';
// import { Book } from '#cds-models/CatalogService';

type LooseAutocomplete<T extends string> = T | Omit<string, T>;

type Entry<T> = {
  [K in keyof T]?: T[K];
};

type DraftAdministrativeFields = {
  DraftAdministrativeData_DraftUUID?: string;
  HasActiveEntity?: boolean;
};

type EntryDraft<T> = T & DraftAdministrativeFields;

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

type Columns<T> = keyof T | (keyof T)[];
type ShowOnlyColumns<T, K> = K extends (keyof T)[] ? K[number] : K extends keyof T ? K : never;

type Entries<T> = Entry<T> | Entry<T>[];
type DraftEntries<T> = EntryDraft<T> | EntryDraft<T>[];

type FindReturn<T> = {
  /**
   * Get all records from the table.
   * @returns SelectBuilder
   * @example const results = await this.builder().find().execute()
   *
   * */
  find(): SelectBuilder<T, string>;
  /**
   * Finds records based on the provided keys.
   * @param keys An object representing the keys to filter the records.
   * @returns SelectBuilder
   * @example const results = await this.builder().find({ name : 'Customer 1', company : 'home' }).execute()
   *
   * */
  find<Keys extends Entry<T>>(keys: Entry<T>): SelectBuilder<T, Keys>;

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

// Start Filter types

type LogicalOperator = 'AND' | 'OR';

type FilterOperatorWhenSingleValue =
  | 'EQUALS'
  | 'NOT EQUAL'
  | 'LIKE'
  | 'STARTS_WITH'
  | 'ENDS_WITH'
  | 'LESS THAN'
  | 'LESS THAN OR EQUALS'
  | 'GREATER THAN'
  | 'GREATER THAN OR EQUALS';
type FilterOperatorWhenTwoValues = 'BETWEEN' | 'NOT BETWEEN';
type FilterOperatorWhenArrayValues = 'IN' | 'NOT IN';

type FilterOperator = FilterOperatorWhenSingleValue | FilterOperatorWhenTwoValues | FilterOperatorWhenArrayValues;

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
  operator: FilterOperatorWhenArrayValues;
  value: string[] | number[];
};

type FilterOptions<T> = {
  field: keyof T;
} & (FilterSingleValue | FilterBetween | FilterInAndNotIn);

// End Filter types

// Start .columnsFormatter types

type NumericAggregateFunctions =
  | 'AVG'
  | 'MIN'
  | 'MAX'
  | 'SUM'
  | 'ABS'
  | 'CEILING'
  | 'TOTAL'
  | 'COUNT'
  | 'ROUND'
  | 'FLOOR';
type DateAggregateFunctions = 'DAY' | 'MONTH' | 'YEAR' | 'HOUR' | 'MINUTE' | 'SECOND';

type StringAggregateFunctions = 'LOWER' | 'UPPER' | 'LENGTH' | 'TRIM';
type StringAggregateTwoColumnsFunctions = 'CONCAT';

type AggregateNumberUsingColumn = {
  aggregate?: NumericAggregateFunctions;
};

type AggregateDateUsingColumn = {
  aggregate?: DateAggregateFunctions;
};

type AggregateStringUsingColumn = {
  aggregate?: StringAggregateFunctions;
};

type AggregateStringTwoColumnsUsingColumn<T> = {
  aggregate?: StringAggregateTwoColumnsFunctions;
  column1: keyof T;
  column2: keyof T;
};

type BaseAggregateFields<T> = {
  renameAs: string;
  column: keyof T;
};

type AggregateFields<T> =
  | (BaseAggregateFields<T> & (AggregateStringUsingColumn | AggregateNumberUsingColumn | AggregateDateUsingColumn))
  | (AggregateStringTwoColumnsUsingColumn<T> & { renameAs: string });

type DynamicColumnTypes<T extends AggregateFields<K>[], K> = {
  [K in T[number]['renameAs']]: K extends Extract<
    T[number],
    { aggregate: NumericAggregateFunctions | DateAggregateFunctions }
  >['renameAs']
    ? number
    : K extends Extract<T[number], { aggregate: StringAggregateFunctions }>['renameAs']
      ? string
      : string; // Just renaming will get by default string
};

type ColumnFormatter<T> = AggregateFields<T>[];

type AddNewFields<T, K extends ColumnFormatter<T>> = T & Partial<DynamicColumnTypes<K, T>>;

type GetColumnNames<T, K extends ColumnFormatter<T>> = K[number][];

type AppendColumns<T, K extends ColumnFormatter<T>> = T & AddNewFields<T, GetColumnNames<T, K>>;

// End .columnsFormatter types

// TODO: deep expand of getExpand
// export type Expand<T> = ExpandType<T> | ExpandType<T>[];

// export type ExpandType<T> = string | ExpandObject<T>;

// export type ExpandObject<T> = keyof T | NestedExpandOptions<T>;

// export type NestedExpandOptions<T> = {
//   [P in keyof T]?: Unpacked<T[P]>;
// };

// export type Unpacked<T> = T extends (infer U)[] ? U : T;

// export const book: Expand<Book> = {
//   author: {},
//   reviews: {
//     reviewer: {},
//   },
// };

export type {
  // Common
  Entry,
  EntryDraft,
  Locale,
  InsertResult,
  DraftAdministrativeFields,
  TypedRequest,
  Columns,
  ShowOnlyColumns,
  Entries,
  DraftEntries,

  // Builder types
  FindReturn,
  LogicalOperator,
  FilterOperator,
  FilterOptions,

  // ColumnsFormatter types
  ColumnFormatter,
  AddNewFields,
  GetColumnNames,
  AppendColumns,
  DynamicColumnTypes,
  NumericAggregateFunctions,
  DateAggregateFunctions,
  StringAggregateFunctions,
  StringAggregateTwoColumnsFunctions,
};
