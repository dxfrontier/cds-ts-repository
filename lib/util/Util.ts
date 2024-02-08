import type { Entry } from '../types/types';
import type { Filter } from './Filter';

export const Util = {
  isAllSuccess(items: number[]): boolean {
    if (items.includes(0)) {
      return false;
    }
    return true;
  },

  isBetweenOrNotBetween<T>(keys: Filter<T>): boolean {
    const operator = keys.operator;
    return operator === 'BETWEEN' || operator === 'NOT BETWEEN';
  },

  isInOrNotIn<T>(keys: Filter<T>): boolean {
    const operator = keys.operator;
    return operator === 'IN' || operator === 'NOT IN';
  },

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

  isSingleFilter<T>(keys?: Entry<T> | Filter<T> | string): keys is Filter<T> {
    return typeof keys === 'object' && 'field' in keys && keys.field !== undefined;
  },

  isMultipleFilters<T>(keys?: Entry<T> | Filter<T> | string): keys is Filter<T> {
    return typeof keys === 'object' && 'filters' in keys && Array.isArray(keys.filters);
  },

  buildSingleFilter<T>(keys: Filter<T>): string {
    const filterOperator = keys.operator;
    const key = keys.field as string;

    if (Util.isBetweenOrNotBetween(keys)) {
      return `(${key} ${filterOperator} ${keys.value1} AND ${keys.value2})`;
    }

    if (Util.isInOrNotIn(keys)) {
      if (Array.isArray(keys.value)) {
        const remodeledString = keys.value.map((item) => `'${item.toString()}'`);

        return `${key} ${filterOperator} (${remodeledString.toString()})`;
      }
    }

    // All others operators
    return `${key} ${Util.mapOperator(keys)} '${keys.value as string}'`;
  },

  buildSQLQuery<T>(filter: Filter<T>): string {
    const isValueFound: boolean = 'value' in filter || 'value1' in filter;

    if (isValueFound && filter.logicalOperator === undefined) {
      if (Util.isSingleFilter(filter)) {
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

  buildQueryKeys<T>(keys?: Entry<T> | Filter<T> | string): string | Entry<T> | undefined {
    // Single filter object
    if (Util.isSingleFilter(keys)) {
      return Util.buildSingleFilter(keys);
    }

    // Multiple filters objects
    if (Util.isMultipleFilters(keys)) {
      return Util.buildSQLQuery(keys);
    }

    // Return non-modified keys or modified keys from the isSingleFilter and isMultipleFilters
    return keys;
  },
};

export default Util;
