import type { CompoundFilter, Entry, LogicalOperator } from '../../types/types';
import { Filter } from '../filter/Filter';

const coreRepositoryUtils = {
  /**
   * Checks if all items in the array are non-zero.
   * @param items - An array of numbers.
   * @returns Returns true if all items are non-zero or empty, false otherwise.
   */
  isAllSuccess(items: (number | string)[]): boolean {
    if (items.length === 0) return false;

    const isString = typeof items[0] === 'string';
    const isNumber = typeof items[0] === 'number';

    return isString ? items.every((item) => item === '') : isNumber ? items.every((item) => item === 1) : false;
  },

  /**
   * Builds query keys for SQL based on the provided keys object.
   * @param keys - The keys object (can be a single filter, multiple filters, or a string).
   * @returns The query keys string, entry object, or undefined if keys are not modified.
   */
  buildQueryKeys<T>(keys?: Entry<T> | Filter<T>): Entry<T> | string | undefined {
    // Single filter object
    if (this.isSingleFilter(keys)) {
      return this.buildSingleFilter(keys);
    }

    // Multiple filters object
    if (this.isMultipleFilters(keys)) {
      return this.buildMultipleFilters(keys);
    }

    // Multidimensional filters object
    if (this.isMultidimensionalFilter(keys)) {
      return this.buildMultidimensionalFilters(keys.filters);
    }

    // Return non-modified keys
    return keys;
  },

  /**
   * Recursively builds a SQL query string based on the provided multidimensional filters object.
   * @param filter - The filter object which is an multidimensional Array (E.g. `[[Filter1, 'AND' Filter2], 'OR' Filter3]`)
   * @returns The SQL query string.
   */
  buildMultidimensionalFilters<T>(filters: Filter<T>['filters'], options?: { isInnerCalled: boolean }): string {
    const padWithSpace = ' ';

    const constructedQuery = filters!.reduce((accumulator, filter) => {
      if (filter instanceof Filter && filter.filters && filter.filters.length > 0) {
        return this.buildMultidimensionalFilters(filter.filters, { isInnerCalled: true });
      }

      if (filter instanceof Filter && filter.filters === undefined) {
        return accumulator + `${this.buildMultipleFilters(filter)}${padWithSpace}`;
      }

      if (filter === 'AND' || filter === 'OR') {
        return accumulator + (filter === 'AND' ? `AND${padWithSpace}` : `OR${padWithSpace}`);
      }

      return accumulator;
    }, '');

    const trimmedQuery = constructedQuery.trimEnd();

    if (options?.isInnerCalled) {
      return `(${trimmedQuery})${padWithSpace}`;
    }

    return trimmedQuery;
  },

  /**
   * Recursively builds a SQL query string based on the provided filter object.
   * @param filter - The filter object.
   * @returns The SQL query string.
   */
  buildMultipleFilters<T>(filter: Filter<T>): string {
    // Handle single filter case
    const propertyValueFound: boolean = 'value' in filter || 'value1' in filter;
    const filterOptionsFound = propertyValueFound && filter.logicalOperator === undefined;

    if (filterOptionsFound) {
      if (coreRepositoryUtils.isSingleFilter(filter)) {
        return coreRepositoryUtils.buildSingleFilter(filter);
      }
    }

    // ##################################

    // Handle combined filters case
    const subQueries = (filter.filters as Filter<T>[] | undefined)?.map((subFilter) =>
      this.buildMultipleFilters(subFilter),
    );

    if (filter.logicalOperator === 'AND' || filter.logicalOperator === 'OR') {
      return `(${subQueries?.join(` ${filter.logicalOperator} `)})`;
    }

    return '';
  },

  buildSingleFilter<T>(keys: Filter<T>): string {
    const filterOperator = keys.operator;
    const key = keys.field as string;

    if (this.isBetweenOrNotBetween(keys)) {
      return `(${key} ${filterOperator} ${keys.value1} AND ${keys.value2})`;
    }

    if (this.isInOrNotIn(keys)) {
      if (Array.isArray(keys.value)) {
        const remodeledString = keys.value.map((item) => `'${item.toString()}'`);

        return `${key} ${filterOperator} (${remodeledString.toString()})`;
      }
    }

    if (this.isNullOrNotNull(keys)) {
      return `${key} ${this.mapOperator(keys)}`;
    }

    // All others operators
    return `${key} ${this.mapOperator(keys)} '${keys.value as string}'`;
  },

  /**
   * Checks if the keys parameter represents a single filter.
   * @param keys - The keys object.
   * @returns Returns true if keys represent a single filter, false otherwise.
   */
  isSingleFilter<T>(keys?: Entry<T> | Filter<T> | CompoundFilter<T>): keys is Filter<T> {
    return typeof keys === 'object' && 'field' in keys && keys.field !== undefined;
  },

  /**
   * Checks if the keys parameter represents multiple filters.
   * @param keys - The keys object.
   * @returns Returns true if keys represent multiple filters, false otherwise.
   */
  isMultipleFilters<T>(keys?: Entry<T> | Filter<T> | CompoundFilter<T>): keys is Filter<T> {
    return typeof keys === 'object' && 'filters' in keys && 'logicalOperator' in keys && Array.isArray(keys.filters);
  },

  /**
   * Checks if the keys parameter represents multidimensional filters.
   * @param keys - The keys object.
   * @returns Returns true if keys represent multidimensional filter, false otherwise.
   */
  isMultidimensionalFilter<T>(keys?: Entry<T> | Filter<T> | CompoundFilter<T>): keys is Filter<T> {
    return (
      typeof keys === 'object' &&
      'filters' in keys &&
      Array.isArray(keys.filters) &&
      (keys.filters as any).some((item: Filter<T> | LogicalOperator) => item === 'OR' || item === 'AND')
    );
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
   * Checks if the filter operator is either 'IS NULL' or 'IS NOT NULL'.
   * @param keys - The filter
   * @returns Returns true if the operator is 'IS NULL' or 'IS NOT NULL', false otherwise.
   */
  isNullOrNotNull<T>(keys: Filter<T>): boolean {
    const operator = keys.operator;
    return operator === 'IS NULL' || operator === 'IS NOT NULL';
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

      case 'IS NULL':
        return 'IS NULL';

      case 'IS NOT NULL':
        return 'IS NOT NULL';

      default:
        throw Error('No operator found');
    }
  },
};

export default coreRepositoryUtils;
