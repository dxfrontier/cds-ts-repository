/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnFormatter, Entry, Entity, AutoExpandLevels, ExpandStructure } from '../types/types';
import type { Filter } from './filter/Filter';
import { constants } from '../constants/constants';

import type { Association, column_expr, struct, type } from '@sap/cds';

export const util = {
  /**
   * Checks if all items in the array are non-zero.
   * @param items - An array of numbers.
   * @returns Returns true if all items are non-zero, false otherwise.
   */
  isAllSuccess(items: number[]): boolean {
    if (items.includes(0)) {
      return false;
    }
    return true;
  },

  /**
   * Checks if the filter operator is either 'BETWEEN' or 'NOT BETWEEN'.
   * @param keys - The filter object.
   * @returns Returns true if the operator is 'BETWEEN' or 'NOT BETWEEN', false otherwise.
   */
  isBetweenOrNotBetween<T>(keys: Filter<T>): boolean {
    const operator = keys.operator;
    return operator === 'BETWEEN' || operator === 'NOT BETWEEN';
  },

  /**
   * Checks if the filter operator is either 'IN' or 'NOT IN'.
   * @param keys - The filter object.
   * @returns Returns true if the operator is 'IN' or 'NOT IN', false otherwise.
   */
  isInOrNotIn<T>(keys: Filter<T>): boolean {
    const operator = keys.operator;
    return operator === 'IN' || operator === 'NOT IN';
  },

  /**
   * Maps the filter operator to its corresponding SQL operator.
   * @param keys - The filter object.
   * @returns The SQL operator mapped from the filter operator.
   * @throws Error if no operator is found.
   */
  mapOperator<T>(keys: Filter<T>) {
    switch (keys.operator) {
      case 'GREATER THAN':
        return '>';

      case 'GREATER THAN OR EQUALS':
        return '>=';

      case 'LESS THAN':
        return '<';

      case 'LESS THAN OR EQUALS':
        return '<=';

      case 'EQUALS':
        return '=';

      case 'NOT EQUAL':
        return '<>';

      case 'LIKE':
      case 'ENDS_WITH':
      case 'STARTS_WITH':
        return 'LIKE';

      default:
        throw Error('No operator found');
    }
  },

  /**
   * Checks if the keys parameter represents a single filter.
   * @param keys - The keys object.
   * @returns Returns true if keys represent a single filter, false otherwise.
   */
  isSingleFilter<T>(keys?: Entry<T> | Filter<T> | string): keys is Filter<T> {
    return typeof keys === 'object' && 'field' in keys && keys.field !== undefined;
  },

  /**
   * Checks if the keys parameter represents multiple filters.
   * @param keys - The keys object.
   * @returns Returns true if keys represent multiple filters, false otherwise.
   */
  isMultipleFilters<T>(keys?: Entry<T> | Filter<T> | string): keys is Filter<T> {
    return typeof keys === 'object' && 'filters' in keys && Array.isArray(keys.filters);
  },

  /**
   * Builds a single SQL filter string based on the provided filter object.
   * @param keys - The filter object.
   * @returns The SQL filter string.
   */
  buildSingleFilter<T>(keys: Filter<T>): string {
    const filterOperator = keys.operator;
    const key = keys.field as string;

    if (util.isBetweenOrNotBetween(keys)) {
      return `(${key} ${filterOperator} ${keys.value1} AND ${keys.value2})`;
    }

    if (util.isInOrNotIn(keys)) {
      if (Array.isArray(keys.value)) {
        const remodeledString = keys.value.map((item) => `'${item.toString()}'`);

        return `${key} ${filterOperator} (${remodeledString.toString()})`;
      }
    }

    // All others operators
    return `${key} ${util.mapOperator(keys)} '${keys.value as string}'`;
  },

  /**
   * Recursively builds a SQL query string based on the provided filter object.
   * @param filter - The filter object.
   * @returns The SQL query string.
   */
  buildSQLQuery<T>(filter: Filter<T>): string {
    const isValueFound: boolean = 'value' in filter || 'value1' in filter;

    if (isValueFound && filter.logicalOperator === undefined) {
      if (util.isSingleFilter(filter)) {
        return this.buildSingleFilter(filter);
      }
    }

    const subQueries = filter.filters?.map((subFilter) => this.buildSQLQuery(subFilter));
    let query: string = '';

    // Compute the filters in a logical OR or AND
    if (filter.logicalOperator === 'AND') {
      query = `(${subQueries?.join(` ${filter.logicalOperator} `)})`;
    }

    if (filter.logicalOperator === 'OR') {
      query = `(${subQueries?.join(` ${filter.logicalOperator} `)})`;
    }

    return query;
  },

  /**
   * Builds query keys for SQL based on the provided keys object.
   * @param keys - The keys object (can be a single filter, multiple filters, or a string).
   * @returns The query keys string, entry object, or undefined if keys are not modified.
   */
  buildQueryKeys<T>(keys?: Entry<T> | Filter<T> | string): string | Entry<T> | undefined {
    // Single filter object
    if (util.isSingleFilter(keys)) {
      return util.buildSingleFilter(keys);
    }

    // Multiple filters objects
    if (util.isMultipleFilters(keys)) {
      return util.buildSQLQuery(keys);
    }

    // Return non-modified keys
    return keys;
  },

  /**
   * Checks if the given value represents an empty expand structure (all fields).
   * @param value - The expand structure value.
   * @returns Returns true if the value represents an empty expand structure, false otherwise.
   */
  isExpandAll(value: ExpandStructure): boolean {
    return typeof value === 'object' && Object.keys(value).length === 0;
  },

  /**
   * Checks if the given value represents a select and expand structure.
   * @param value - The expand structure value.
   * @returns Returns true if the value represents a select and expand structure, false otherwise.
   */
  isSelectAndExpand(value: ExpandStructure): boolean {
    return 'select' in value && 'expand' in value;
  },

  /**
   * Checks if the given value represents a select only structure.
   * @param value - The expand structure value.
   * @returns Returns true if the value represents a select only structure, false otherwise.
   */
  isSelectOnly(value: ExpandStructure): boolean {
    return 'select' in value;
  },

  /**
   * Checks if the given value represents an expand only structure.
   * @param value - The expand structure value.
   * @returns Returns true if the value represents an expand only structure, false otherwise.
   */
  isExpandOnly(value: ExpandStructure): boolean {
    return 'expand' in value;
  },

  /**
   * Builds aggregate columns for SQL based on the provided column formatters.
   * @param columns - An array of column formatters.
   * @returns An array of SQL aggregate column strings.
   */
  buildAggregateColumns<T, ColumnKeys extends ColumnFormatter<T>>(...columns: ColumnKeys) {
    return columns.map((item) => {
      const twoColumns = 'column1' in item && 'column2' in item;
      if (twoColumns) {
        const column1 = item.column1 as string;
        const column2 = item.column2 as string;

        return `${item.aggregate}(${column1}, ' ',${column2}) as ${item.renameAs}`;
      }

      const oneColumn = 'aggregate' in item && 'column' in item;
      if (oneColumn) {
        const column = item.column as string;

        return `${item.aggregate}(${column}) as ${item.renameAs}`;
      }

      // Just rename the column
      return `${item.column as string} as ${item.renameAs}`;
    });
  },

  /**
   * Removes the expand operator ('*') from the column expressions array.
   * @param columns - An array of column expressions.
   */
  removeExpandOperator(columns: column_expr[] | undefined) {
    columns?.some((item, index) => {
      const column = item as any;
      if (column === constants.COMMON.ALL_FIELDS) {
        columns?.splice(index, 1);

        return true; // STOP '*' found
      }

      return false;
    });

    /*
        Workaround using reverse
        When .getExpand(['reviews']) is firstly called before .columns(['currency_code','reviews']) somehow this causes duplicates and gives an error.
        If this is being reversed, this works as expected
      */
    columns?.reverse();
  },

  /**
   * Resolves the name of the entity based on its draft status.
   * @param entity - The entity object.
   * @returns The resolved entity name.
   */
  resolveEntityName(entity: Entity) {
    // Draft entity
    if (entity.drafts != null) {
      return entity.drafts.name;
    }

    // Active entity
    return entity.name;
  },

  /**
   * Checks if the given element is expandable.
   * @param element - The element object.
   * @returns Returns true if the element is expandable, false otherwise.
   */
  isElementExpandable(
    element: type &
      struct &
      Association & {
        key?: boolean | undefined;
        virtual?: boolean | undefined;
        unique?: boolean | undefined;
        notNull?: boolean | undefined;
      } & Partial<{ name: string }>,
  ): boolean {
    return (
      (element.type === 'cds.Association' || element.type === 'cds.Composition') &&
      element.name !== 'DraftAdministrativeData' &&
      element.name !== 'texts' &&
      element.name !== 'currency' &&
      element.name !== 'SiblingEntity'
    );
  },

  /**
   * Checks if property levels are found in the auto-expand levels structure.
   * @param value - The auto-expand levels structure.
   * @returns Returns true if property levels are found, false otherwise.
   */
  isPropertyLevelsFound(value: AutoExpandLevels): value is AutoExpandLevels {
    return Object.prototype.hasOwnProperty.call(value, 'levels') && value.levels !== undefined;
  },

  /**
   * Checks if the provided array contains no arguments.
   * @param value - The array of arguments.
   * @returns Returns true if the array contains no arguments, false otherwise.
   */
  noArgs(value: unknown[]): boolean {
    return value.length === 0;
  },

  /**
   * Checks if the provided value represents a single expand.
   * @param value - The expand value.
   * @returns Returns true if the value represents a single expand, false otherwise.
   */
  isSingleExpand(value: unknown[]): boolean {
    return typeof value === 'string';
  },
};

export default util;
