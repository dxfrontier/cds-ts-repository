import type { FilterOperator, FilterOptions, LogicalOperator } from '../../types/types';

class Filter<T> {
  public readonly field: keyof T;
  public readonly operator: FilterOperator;
  public readonly logicalOperator: LogicalOperator;
  public readonly filters: Filter<T>[];

  // Like, In, Not in fields
  public readonly value?: string | number | string[] | number[];

  // Between fields
  public readonly value1?: number | string;
  public readonly value2?: number | string;

  /**
   * Creates a new Filter instance
   * @param options An object representing the Filter options
   * @returns Filter
   * @example
   * const filter = new Filter<Book>({
   *  field: 'name',
   *  operator: 'LIKE',
   *  value: 'Customer',
   * });
   * */
  constructor(options: FilterOptions<T>);

  /**
   * Creates a new Filter instance
   * @param operator  Operator used to combine the filters
   * @param filters   An array of filters
   * @returns Filter
   * @example
   *
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
   * const filters = new Filter('AND', filter1, filter2);
   * */
  constructor(operator: LogicalOperator, ...filters: Filter<T>[]);

  constructor(filter: FilterOptions<T> | LogicalOperator, ...filters: Filter<T>[]) {
    // Overload 1 => constructor(options: FilterOptions<T>);
    if (typeof filter === 'object') {
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
    }

    // Overload 2 => constructor(operator: LogicalOperator, ...filters: Filter<T>[]);
    if (typeof filter === 'string' && Array.isArray(filters)) {
      this.logicalOperator = filter;
      this.filters = filters;
    }
  }
}

export { Filter };
