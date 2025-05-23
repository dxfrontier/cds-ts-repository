import type { CompoundFilter, FilterOperator, FilterOptions, FilterValue, LogicalOperator } from '../../types/types';

/**
 * Represents a filter to be applied on entities.
 * @template T The type of the entity.
 */
class Filter<T> {
  public readonly operator?: FilterOperator;

  public readonly field?: keyof T;
  public readonly logicalOperator?: LogicalOperator;
  public readonly filters?: Filter<T>[] | CompoundFilter<T>;

  // Like, In, Not in fields
  public readonly value?: FilterValue | string[] | number[];

  // Between fields
  public readonly value1?: FilterValue;
  public readonly value2?: FilterValue;

  /**
   * Creates a `Filter` instance with filter options.
   *
   * @param options - An object representing the filter options.
   * @param options.field - The field of the entity to filter on.
   * @param options.operator - The operator to apply on the field (e.g., `'LIKE'`, `'BETWEEN'`).
   * @param options.value - The filter value.
   * @param options.value1 - The first value for `'BETWEEN'` and `'NOT BETWEEN'` operators.
   * @param options.value2 - The second value for `'BETWEEN'` and `'NOT BETWEEN'` operators.
   *
   * @example
   * const filter = new Filter<Book>({
   *  field: 'name',
   *  operator: 'LIKE',
   *  value: 'Customer',
   * });
   *
   * this.find(filter)
   */
  constructor(options: FilterOptions<T>);

  /**
   * Creates a new `Filter` instance with logical operators to combine multiple filters.
   *
   * @param operator - Operator used to combine the filters (e.g., 'AND', 'OR').
   * @param filters - An array of `Filter` instances to combine.
   *
   * @example
   * const filter1 = new Filter<Book>({
   *    field: 'customer_name',
   *    operator: 'LIKE',
   *    value: 'ABS',
   * });
   *
   * const filter2 = new Filter<Book>({
   *    field: 'stock',
   *    operator: 'BETWEEN',
   *    value1: 11,
   *    value2: 333,
   * });
   *
   * const combinedFilters = new Filter<Book>('AND', filter1, filter2);
   *
   * this.find(combinedFilters)
   */
  constructor(operator: LogicalOperator, ...filters: Filter<T>[]);

  /**
   * Creates a new multidimensional `Filter` instance.
   *
   * @param filter - A multidimensional array of `CompoundFilter` instances combined with logical operators (`'AND'`, `'OR'`).
   *
   * @example
   * const filter1 = new Filter<Book>({
   *    field: 'customer_name',
   *    operator: 'LIKE',
   *    value: 'ABS',
   * });
   *
   * const filter2 = new Filter<Book>({
   *    field: 'ID',
   *    operator: 'NOT EQUAL',
   *    value: null,
   * });
   *
   * const filter3 = new Filter<Book>({
   *    field: 'descr',
   *    operator: 'ENDS_WITH',
   *    value: '1850',
   * });
   *
   * const filters = new Filter<Book>([filter1, 'AND', filter2, 'OR', filter3]);
   *
   * this.find(filters)
   */
  constructor(filter: CompoundFilter<T>);

  constructor(filter: FilterOptions<T> | LogicalOperator | CompoundFilter<T>, ...filters: Filter<T>[]) {
    // Overload 1 => constructor(options: FilterOptions<T>);
    if (typeof filter === 'object' && !Array.isArray(filter)) {
      this.field = filter.field;
      this.operator = filter.operator;

      if (filter.operator === 'BETWEEN' || filter.operator === 'NOT BETWEEN') {
        this.value1 = filter.value1;
        this.value2 = filter.value2;

        return;
      }

      if (filter.operator === 'LIKE') {
        this.value = `%${filter.value}%`;

        return;
      }

      if (filter.operator === 'STARTS_WITH') {
        this.value = `${filter.value}%`;

        return;
      }

      if (filter.operator === 'ENDS_WITH') {
        this.value = `%${filter.value}`;

        return;
      }

      if (
        filter.operator === 'LESS THAN' ||
        filter.operator === 'GREATER THAN' ||
        filter.operator === 'LESS THAN OR EQUALS' ||
        filter.operator === 'GREATER THAN OR EQUALS' ||
        filter.operator === 'EQUALS' ||
        filter.operator === 'NOT EQUAL'
      ) {
        this.value = filter.value;

        return;
      }

      if (filter.operator === 'IN' || filter.operator === 'NOT IN') {
        this.value = filter.value;

        return;
      }

      if (filter.operator === 'IS NULL' || filter.operator === 'IS NOT NULL') {
        this.value = null;
      }
    }

    // Overload 2 => constructor(operator: LogicalOperator, ...filters: Filter<T>[]);
    if (typeof filter === 'string' && Array.isArray(filters)) {
      this.logicalOperator = filter;
      this.filters = filters;
    }

    // Overload 3 => constructor(filter: CompoundFilter<T>);
    if (Array.isArray(filter) && filters.length === 0) {
      this.filters = filter;
    }
  }
}

export { Filter };
