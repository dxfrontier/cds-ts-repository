import type { TypedRequest } from '@sap/cds';

import type { LanguageCode } from 'iso-639-1';

import type FindBuilder from '../util/find/FindBuilder';
import type { Filter } from '../util/filter/Filter';
import type FindOneBuilder from '../util/find/FindOneBuilder';

type Entity = { name: string } & Partial<{
  elements: unknown;
  drafts: { name: string };
}>;

type Entry<T> = Partial<T>;
type Entries<T> = Entry<T> | Entry<T>[];

type EntryDraft<T> = T & DraftAdministrativeFields;
type DraftEntries<T> = EntryDraft<T> | EntryDraft<T>[];

type DraftAdministrativeFields = {
  DraftAdministrativeData_DraftUUID?: string | null;
  HasActiveEntity?: boolean | null;
};

type AssociationFunction = (...args: unknown[]) => unknown;

type InsertResult<T> = {
  query: {
    INSERT: {
      entries: T[];
    };
  };
};

type LooseAutocomplete<T extends string> = T | Omit<string, T>;
type Locale = {
  locale: LooseAutocomplete<LanguageCode>;
};

type Columns<T> = keyof T | (keyof T)[];
type ShowOnlyColumns<T, K> = K extends (keyof T)[] ? K[number] : K extends keyof T ? K : never;

type FindReturn<T> = {
  /**
   * Get all entries from the table.
   * @returns FindBuilder
   * @example const results = await this.builder().find().execute()
   *
   * */
  find(): FindBuilder<T, string>;

  /**
   * Finds entries based on the provided keys.
   * @param keys An object representing the keys to filter the entries.
   * @returns FindBuilder
   * @example const results = await this.builder().find({ name : 'Customer 1', company : 'home' }).execute()
   *
   * */
  find<Keys extends Entry<T>>(keys: Entry<T>): FindBuilder<T, Keys>;

  /**
   * Finds entries based on the provided filters.
   * @param filter A Filter instance
   * @returns FindBuilder
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
  find<T>(filter: Filter<T>): FindBuilder<T, string>;

  /**
   * Finds a single entry based on the provided keys.
   * @param keys An object representing the keys to filter the entries.
   * @returns FindOneBuilder
   * @example const oneResult = await this.builder().findOne({ name : 'Customer 1', company : 'home' }).execute()
   *
   * */
  findOne<Keys extends Entry<T>>(keys: Entry<T>): FindOneBuilder<T, Keys>;

  /**
   * Finds a single entry based on the provided filters.
   * @param filter A Filter instance
   * @returns FindOneBuilder
   * @example
   * const filterLike = new Filter<Book>({
   *  field: 'currency_code',
   *  operator: 'LIKE',
   *  value: 'GBP',
   * });
   *
   * const oneResult = await this.builder().findOne(filter).execute()
   *
   * */
  findOne<T>(filter: Filter<T>): FindOneBuilder<T, string>;
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
  renameAs: string;
};

type BaseAggregateFields<T> = {
  renameAs: string;
  column: keyof T;
};

type BuilderTypes = 'FIND_ONE' | 'FIND';

type AggregateFields<T, K = BuilderTypes> =
  | (BaseAggregateFields<T> &
      /* 
        If it's 'findOne' then remove the AggregateNumberUsingColumn as this works only when we have more than 1 entry in the table
        If it's 'find' this means the result will have more than 1 item and we can apply 'AVG', 'MAX', 'MIN' ... 
       **/
      (K extends 'FIND_ONE'
        ? AggregateStringUsingColumn | AggregateDateUsingColumn
        : AggregateStringUsingColumn | AggregateNumberUsingColumn | AggregateDateUsingColumn))
  | AggregateStringTwoColumnsUsingColumn<T>;

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

type ColumnFormatter<T, K = BuilderTypes> = AggregateFields<T, K>[];

type AddNewFields<T, K extends ColumnFormatter<T>> = T & Partial<DynamicColumnTypes<K, T>>;

type GetColumnNames<T, K extends ColumnFormatter<T>> = K[number][];

type AppendColumns<T, K extends ColumnFormatter<T>> = T & AddNewFields<T, GetColumnNames<T, K>>;

// End .columnsFormatter types

// Start deep expand of getExpand method

type Unpacked<T> = T extends (infer U)[]
  ? { expand?: Expand<U>; select?: (keyof U)[] }
  : { expand?: Expand<T>; select?: (keyof T)[] };

type AutoExpandLevels = { levels?: number };

type Expand<T> = {
  [P in keyof T]: Unpacked<T[P]>;
} & AutoExpandLevels;

type ExpandStructure = Record<string, any>;

type ValueExpand = {
  select: any[];
  expand: ExpandStructure;
};

// End deep expand of getExpand method

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
  AssociationFunction,
  Entity,
  AutoExpandLevels,

  // Builder types
  FindReturn,
  LogicalOperator,
  FilterOperator,
  FilterOptions,
  Expand,
  ValueExpand,
  ExpandStructure,

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
