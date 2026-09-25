import type { CompoundFilter, Entry, LogicalOperator } from '../../types/types';
import { Filter } from '../filter/Filter';

/**
 * Matches a single CDS element name segment, mirroring the cds-compiler lexer's identifier rule
 * (`[$_\p{ID_Start}][$\p{ID_Continue}\u200C\u200D]*`): a Unicode identifier-start character, `_` or
 * `$`, followed by identifier-continue characters (which additionally cover combining marks), `_`,
 * `$`, ZWNJ (U+200C) or ZWJ (U+200D).
 */
const FIELD_PATH_SEGMENT = /^[$_\p{ID_Start}][$\p{ID_Continue}\u200C\u200D]*$/u;

/**
 * Doubles every embedded single quote (the CQL / SQL string-literal escape) so a string value can
 * never terminate the single-quoted literal it is placed in.
 * @param value - The raw string value.
 * @returns `value` with every `'` doubled.
 */
function escapeStringLiteral(value: string): string {
  return value.replace(/'/g, "''");
}

/**
 * Validates a filter field (or, for `EXISTS` / `NOT EXISTS`, the association path) : it must be a
 * dot-separated sequence of {@link FIELD_PATH_SEGMENT} segments, e.g. `'stock'` or `'author.name'`.
 * @param field - The field / association path to validate.
 * @param operator - The operator applied on `field` (only used to name it in the thrown error).
 * @throws Error if `field` is not a valid CDS element path.
 */
function assertValidFieldPath(field: string, operator: unknown): void {
  const isValid = field.length > 0 && field.split('.').every((segment) => FIELD_PATH_SEGMENT.test(segment));

  if (!isValid) {
    throw new Error(`Filter field '${field}' (operator '${String(operator)}') is not a valid CDS element path.`);
  }
}

/**
 * Renders a filter value as a quoted CQL string literal - used wherever a value is compared as a
 * string (`EQUALS`, `NOT EQUAL`, the comparison / `LIKE` family operators, and each `IN` / `NOT IN`
 * item). Strings are escaped via {@link escapeStringLiteral}; finite numbers and `bigint`s are
 * rendered as-is inside the quotes and `null` renders as the literal text `'null'`. Anything else (a plain object, an array, a function, a symbol, `NaN`, `Infinity`,
 * `undefined`, …) throws, naming the offending field and operator.
 * @param value - The value to quote.
 * @param field - The field the value is compared against (only used to name it in the thrown error).
 * @param operator - The operator applied (only used to name it in the thrown error).
 * @returns The quoted, literal-safe CQL fragment.
 * @throws Error if `value` is not a string, a finite number, a `bigint` or `null`.
 */
function quoteLiteral(value: unknown, field: string, operator: unknown): string {
  if (typeof value === 'string') {
    return `'${escapeStringLiteral(value)}'`;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return `'${value}'`;
  }

  if (typeof value === 'bigint') {
    return `'${value}'`;
  }

  if (value === null) {
    return `'null'`;
  }

  throw new Error(
    `Filter value for field '${field}' (operator '${String(operator)}') must be a string, a finite number, a bigint or null.`,
  );
}

/**
 * Renders a filter value without surrounding quotes - used for `BETWEEN` / `NOT BETWEEN` bounds and
 * the boolean branch. Finite numbers, `bigint`s, booleans and `null` are emitted as-is; string bounds
 * are rendered as quoted literals, escaped via {@link escapeStringLiteral}. Anything else throws,
 * naming the offending field and operator.
 * @param value - The value to render.
 * @param field - The field the value is compared against (only used to name it in the thrown error).
 * @param operator - The operator applied (only used to name it in the thrown error).
 * @returns The literal-safe CQL fragment.
 * @throws Error if `value` is not a finite number, a `bigint`, a `boolean`, `null` or a string.
 */
function renderUnquotedLiteral(value: unknown, field: string, operator: unknown): string {
  if (typeof value === 'bigint' || typeof value === 'boolean' || value === null) {
    return String(value);
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === 'string') {
    return `'${escapeStringLiteral(value)}'`;
  }

  throw new Error(
    `Filter value for field '${field}' (operator '${String(operator)}') must be a finite number, a bigint, a boolean or a string.`,
  );
}

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

    assertValidFieldPath(key, filterOperator);

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
      const lowerBound = renderUnquotedLiteral(keys.value1, key, filterOperator);
      const upperBound = renderUnquotedLiteral(keys.value2, key, filterOperator);

      return `(${key} ${filterOperator} ${lowerBound} AND ${upperBound})`;
    }

    if (this.isInOrNotIn(keys)) {
      if (Array.isArray(keys.value)) {
        const remodeledString = keys.value.map((item) => quoteLiteral(item, key, filterOperator));

        return `${key} ${filterOperator} (${remodeledString.toString()})`;
      }
    }

    if (this.isNullOrNotNull(keys)) {
      return `${key} ${this.mapOperator(keys)}`;
    }

    if (typeof keys.value === 'boolean') {
      return `${key} ${this.mapOperator(keys)} ${renderUnquotedLiteral(keys.value, key, filterOperator)}`;
    }

    // All other operators
    return `${key} ${this.mapOperator(keys)} ${quoteLiteral(keys.value, key, filterOperator)}`;
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
