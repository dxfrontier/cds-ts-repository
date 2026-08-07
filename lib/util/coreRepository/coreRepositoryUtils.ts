import type { CompoundFilter, Entry, LogicalOperator } from '../../types/types';
import { Filter } from '../filter/Filter';

const coreRepositoryUtils = {
  /**
   * Checks if all items in the array are non-zero.
   * @param items - An array of numbers.
   * @returns Returns true if all items are non-zero or empty, false otherwise.
   */
  isAllSuccess(items: (number | string)[]): boolean {
    if (items.length === 0) return true;

    const isString = typeof items[0] === 'string';
    const isNumber = typeof items[0] === 'number';

    return isString ? items.every((item) => item === '') : isNumber ? items.every((item) => item === 1) : false;
  },

  /**
   * Normalizes the resolved result of a CDS write query (UPDATE / UPSERT / DELETE) into the affected-row count.
   * `@sap/cds` 9 and `@cap-js/sqlite` (including under `@sap/cds` 10) resolve these queries directly to a numeric
   * row count, whereas some `@sap/cds` 10 services resolve to a consolidated `{ affected, rows }` object. Handling
   * both shapes keeps the repository's boolean/count return values identical for consumers on cds 9 and cds 10.
   * @param result - The resolved value of an awaited write query.
   * @returns The number of affected rows (0 when it cannot be determined).
   */
  resolveAffected(result: unknown): number {
    if (typeof result === 'number') {
      return result;
    }

    if (result !== null && typeof result === 'object' && 'affected' in result) {
      const affected = (result as { affected?: unknown }).affected;
      return typeof affected === 'number' ? affected : 0;
    }

    return 0;
  },

  /**
   * Normalizes the resolved result of an external-service CDS write query (`UPDATE` / `DELETE`) into a success
   * boolean. Remote OData writes are less consistent than the primary database: some stacks resolve a plain `''`
   * (or `undefined` / `null`) with no count information at all - a 204-style success - while others resolve a
   * `number` or a consolidated `{ affected, rows }` object carrying the actual affected-row count (delegated to
   * `resolveAffected`). Anything else (a non-empty string, an object without a recognizable `affected` count) is
   * treated as a failure.
   * @param result - The resolved value of an awaited external-service write query.
   * @param expectation - `'one'` requires exactly one affected row (single-key writes, e.g. `delete`), `'some'`
   * requires at least one (unscoped bulk writes, e.g. `deleteAll`).
   * @returns `true` when the result satisfies the expectation, `false` otherwise.
   */
  resolveExternalWriteSuccess(result: unknown, expectation: 'one' | 'some'): boolean {
    if (result === '' || result === undefined || result === null) {
      return true;
    }

    const affected = this.resolveAffected(result);
    return expectation === 'one' ? affected === 1 : affected > 0;
  },

  /**
   * Normalizes the resolved row of a `count(*)` aggregate query into a numeric count.
   * `@cap-js/sqlite` resolves the aliased `count(*)` column to a JS `number`, whereas other
   * databases (for example `HANA`) may resolve it to a `string` or `bigint`. Coercing keeps the
   * repository's `count` / `countWhere` / `exists` return values numeric across databases.
   * @param result - The resolved single-row result of a `SELECT count(*) as total` query.
   * @returns The count as a number (0 when it cannot be determined).
   */
  resolveCount(result: { total?: unknown } | undefined | null): number {
    if (result === null || result === undefined) {
      return 0;
    }

    const total = Number(result.total);
    return Number.isNaN(total) ? 0 : total;
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
      // Raw nested array group (e.g. the inner array of `[[Filter1, 'AND', Filter2], 'OR', Filter3]`)
      if (Array.isArray(filter)) {
        return accumulator + this.buildMultidimensionalFilters(filter, { isInnerCalled: true });
      }

      // 'EXISTS' / 'NOT EXISTS' filter — its `filters` holds the inner predicate of the association,
      // it is a single filter and must not be expanded as a nested group.
      if (filter instanceof Filter && this.isExistsOrNotExists(filter)) {
        return accumulator + `${this.buildSingleFilter(filter)}${padWithSpace}`;
      }

      if (filter instanceof Filter && filter.filters && filter.filters.length > 0) {
        // Combined filter (`new Filter('AND' | 'OR', ...)`) — its connector lives on
        // `logicalOperator`, not as array tokens, so it must be built by buildMultipleFilters.
        if (filter.logicalOperator !== undefined) {
          return accumulator + `${this.buildMultipleFilters(filter)}${padWithSpace}`;
        }

        return accumulator + this.buildMultidimensionalFilters(filter.filters, { isInnerCalled: true });
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
    // Handle 'EXISTS' / 'NOT EXISTS' case — it holds the inner predicate of the association in
    // `filters` and no value, so it would otherwise be mistaken for a combined filter.
    if (coreRepositoryUtils.isExistsOrNotExists(filter)) {
      return coreRepositoryUtils.buildSingleFilter(filter);
    }

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

    if (this.isExistsOrNotExists(keys)) {
      const existsOperator = filterOperator === 'EXISTS' ? 'exists' : 'not exists';
      const [innerFilter] = (keys.filters ?? []) as Filter<T>[];

      // Bare existence of the association (E.g. `exists books`)
      if (innerFilter === undefined) {
        return `${existsOperator} ${key}`;
      }

      return `${existsOperator} ${key}[${this.buildQueryKeys(innerFilter) as string}]`;
    }

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

    if (typeof keys.value === 'boolean') {
      return `${key} ${this.mapOperator(keys)} ${keys.value}`;
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
   * Checks if the filter operator is either 'EXISTS' or 'NOT EXISTS'.
   * @param keys - The filter object.
   * @returns Returns true if the operator is 'EXISTS' or 'NOT EXISTS', false otherwise.
   */
  isExistsOrNotExists<T>(keys: Filter<T>): boolean {
    const operator = keys.operator;
    return operator === 'EXISTS' || operator === 'NOT EXISTS';
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
