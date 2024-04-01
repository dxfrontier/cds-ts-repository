/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnFormatter, Entry, Entity, AutoExpandLevels, ExpandStructure } from '../types/types';
import type { Filter } from './helpers/Filter';
import { constants } from '../constants/constants';

import type { column_expr } from '@sap/cds';
import type { Association, struct, type } from '@sap/cds/apis/csn';

export const util = {
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

  isExpandAll(value: ExpandStructure): boolean {
    return typeof value === 'object' && Object.keys(value).length === 0;
  },

  isSelectAndExpand(value: ExpandStructure): boolean {
    return 'select' in value && 'expand' in value;
  },

  isSelectOnly(value: ExpandStructure): boolean {
    return 'select' in value;
  },

  isExpandOnly(value: ExpandStructure): boolean {
    return 'expand' in value;
  },

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

  resolveEntityName(entity: Entity) {
    // Draft entity
    if (entity.drafts != null) {
      return entity.drafts.name;
    }

    // Active entity
    return entity.name;
  },

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

  isPropertyLevelsFound(value: AutoExpandLevels): value is AutoExpandLevels {
    return Object.prototype.hasOwnProperty.call(value, 'levels') && value.levels !== undefined;
  },

  noArgs(value: unknown[]): boolean {
    return value.length === 0;
  },

  isSingleExpand(value: unknown[]): boolean {
    return typeof value === 'string';
  },
};

export default util;
