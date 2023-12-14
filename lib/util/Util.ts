import type { KeyValueType } from '../types/types';
import Filter from './Filter';

export const Util = {
  isAllSuccess(items: number[]): boolean {
    if (items.includes(0)) {
      return false;
    }
    return true;
  },

  isLike<T>(keys: Filter<T>): boolean {
    return (
      keys.getFilterOperator() === 'LIKE'
      // keys.getFilterOperator() === 'STARTS WITH' ||
      // keys.getFilterOperator() === 'ENDS WITH'
    );
  },

  isEquals<T>(keys: Filter<T>): boolean {
    return keys.getFilterOperator() === 'EQUALS';
  },

  isLeftOrRightOperator<T>(keys: Filter<T>): boolean {
    return (
      keys.getFilterOperator() === 'GREATER THAN' ||
      keys.getFilterOperator() === 'GREATER THAN OR EQUALS' ||
      keys.getFilterOperator() === 'LESS THAN' ||
      keys.getFilterOperator() === 'LESS THAN OR EQUALS'
    );
  },

  isBetweenOrNotBetween<T>(keys: Filter<T>): boolean {
    return keys.getFilterOperator() === 'BETWEEN' || keys.getFilterOperator() === 'NOT BETWEEN';
  },

  isInOrNotIn<T>(keys: Filter<T>): boolean {
    return keys.getFilterOperator() === 'IN' || keys.getFilterOperator() === 'NOT IN';
  },

  mapOperator<T>(keys: Filter<T>) {
    switch (keys.getFilterOperator()) {
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

      default:
        throw Error('No operator found');
    }
  },

  isSingleFilter<T>(keys: Record<string, unknown> | Filter<T> | string): keys is Filter<T> {
    return keys instanceof Filter && typeof keys === 'object' && !('filters' in keys);
  },

  isMultipleFilters<T>(keys: Record<string, unknown> | Filter<T> | string): keys is Filter<T> {
    return keys instanceof Filter && 'filters' in keys;
  },

  buildSingleFilter<T>(keys: Filter<T>): string {
    const filterOperator = keys.getFilterOperator();
    const key = keys.getField();

    if (Util.isLike(keys)) {
      return `${key} ${filterOperator} '${keys.value as string}'`;
    }

    if (Util.isEquals(keys)) {
      return `${key} ${Util.mapOperator(keys)} '${keys.value as string}'`;
    }

    if (Util.isLeftOrRightOperator(keys)) {
      return `${key} ${Util.mapOperator(keys)} '${keys.value as string}'`;
    }

    if (Util.isBetweenOrNotBetween(keys)) {
      return `(${key} ${filterOperator} ${keys.value1} AND ${keys.value2})`;
    }

    if (Util.isInOrNotIn(keys)) {
      if (Array.isArray(keys.value)) {
        const remodeledString = keys.value.map((item) => `'${item.toString()}'`);

        return `${key} ${filterOperator} (${remodeledString.toString()})`;
      }
    }

    return '';
  },

  buildSQLQuery<T>(filter: Filter<T>): string {
    const isLogicalOperatorNotFound: boolean = !('logicalOperator' in filter);

    if (isLogicalOperatorNotFound) {
      if (Util.isSingleFilter(filter)) {
        return this.buildSingleFilter(filter);
      }
    }

    const subQueries = filter.getFilters().map((subFilter) => this.buildSQLQuery(subFilter));
    let query: string = '';

    // Compute the filters in a logical OR or AND
    // TODO: refactor this
    if (filter.getLogicalOperator() === 'AND') {
      query = `(${subQueries.join(` ${filter.getLogicalOperator()} `)})`;
    }

    if (filter.getLogicalOperator() === 'OR') {
      query = `(${subQueries.join(` ${filter.getLogicalOperator()} `)})`;
    }

    return query;
  },

  buildQueryKeys<T>(keys: KeyValueType<T> | Filter<T> | string): string | KeyValueType<T> {
    // Single filter object
    if (Util.isSingleFilter(keys)) {
      keys = Util.buildSingleFilter(keys);
    }

    // Multiple filters objects
    if (Util.isMultipleFilters(keys)) {
      keys = Util.buildSQLQuery(keys);
    }

    // Return non-modified keys or modified keys from the isSingleFilter and isMultipleFilters
    return keys;
  },
};

export default Util;
