import type {
  CompoundFilter,
  FilterField,
  FilterOperator,
  FilterOptions,
  FilterValue,
  LogicalOperator,
} from '../../types/types';

/**
 * A typed, composable where-tree for building `WHERE` predicates.
 * Accepted by most `BaseRepository` / `BaseRepositoryDraft` methods anywhere a plain keys object is
 * accepted (`find`, `countWhere`, `updateMany`, `deleteWhere`, …).
 *
 * @remarks
 * Built through three overloaded constructors: a single `{ field, operator, value… }` predicate, a
 * `new Filter('AND' | 'OR', ...filters)` combination of two or more `Filter` instances, or a
 * multidimensional `CompoundFilter` array mixing nested filters with `'AND'` / `'OR'` — each overload
 * carries its own example. An instance only ever populates the fields its own `operator` needs (e.g.
 * `value1` / `value2` for `'BETWEEN'`, the single-entry `filters` for `'EXISTS'`); every other field
 * stays `undefined`.
 *
 * @example
 * ```ts
 * const active = new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 0 });
 * const cheap = new Filter<Book>({ field: 'price', operator: 'LESS THAN', value: 20 });
 *
 * const results = await this.find(new Filter('AND', active, cheap));
 * ```
 */
class Filter<T> {
  /**
   * The operator this filter applies (e.g. `'LIKE'`, `'BETWEEN'`, `'EXISTS'`); unset on filters built
   * from the logical-operator or compound-array constructor overloads.
   */
  public readonly operator?: FilterOperator;

  /**
   * The entity field (or a one-hop path expression across a to-one association, e.g. `'author.name'`)
   * `operator` applies to; unset on filters built from the logical-operator or compound-array overloads.
   */
  public readonly field?: FilterField<T>;

  /**
   * The `'AND'` / `'OR'` operator combining `filters`; only set when this instance was built via the
   * `new Filter(operator, ...filters)` overload.
   */
  public readonly logicalOperator?: LogicalOperator;

  /**
   * Child filters combined by `logicalOperator`, or — for `'EXISTS'` / `'NOT EXISTS'` — the single
   * inner filter applied to the association, wrapped in a one-element array.
   */
  public readonly filters?: Filter<T>[] | CompoundFilter<T>;

  /**
   * The comparison value for every operator except `'BETWEEN'` / `'NOT BETWEEN'` (`value1` / `value2`)
   * and `'EXISTS'` / `'NOT EXISTS'` (`filters`); forced to `null` for `'IS NULL'` / `'IS NOT NULL'`.
   */
  public readonly value?: FilterValue | string[] | number[];

  /**
   * The lower bound for `'BETWEEN'` / `'NOT BETWEEN'`; unset for every other operator.
   */
  public readonly value1?: FilterValue;

  /**
   * The upper bound for `'BETWEEN'` / `'NOT BETWEEN'`; unset for every other operator.
   */
  public readonly value2?: FilterValue;

  /**
   * Creates a single-predicate `Filter` from a `{ field, operator, value… }` options object (or, for
   * `'EXISTS'` / `'NOT EXISTS'`, `{ field, operator, filters? }`).
   *
   * @remarks
   * `options` is a discriminated union keyed by `operator`: `value` for every value-based operator
   * (including `'IN'` / `'NOT IN'`, which take an array), `value1` / `value2` for `'BETWEEN'` /
   * `'NOT BETWEEN'`, forced to `null` for `'IS NULL'` / `'IS NOT NULL'`. `field` also accepts a
   * one-hop path expression across a to-one association (e.g. `'author.name'`) for every operator
   * except `'EXISTS'` / `'NOT EXISTS'` — for those two, `field` must instead name an association of
   * `T`, and the optional `filters` is typed on the association's target rather than on `T` (omitting
   * it asserts bare existence, e.g. `exists books`).
   *
   * @example
   * ```ts
   * const filter = new Filter<Book>({ field: 'descr', operator: 'LIKE', value: 'Catweazle' });
   * const results = await this.find(filter);
   * ```
   */
  constructor(options: FilterOptions<T>);

  /**
   * Combines two or more `Filter` instances under a single logical operator:
   * `new Filter('AND' | 'OR', ...filters)`.
   *
   * @remarks
   * Every element of `filters` must already be a constructed `Filter<T>` instance — build each one
   * with the options overload first. Passing a previously-combined `Filter` as one of `filters` nests
   * AND/OR trees (e.g. `new Filter('AND', new Filter('OR', f1, f2), f3)`); for a single expression
   * that itself mixes `'AND'` and `'OR'` at the top level, use the compound-array overload instead.
   *
   * @example
   * ```ts
   * const byAuthor = new Filter<Book>({ field: 'author.name', operator: 'EQUALS', value: 'Edgar Allen Poe' });
   * const inStock = new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 0 });
   *
   * const results = await this.find(new Filter('AND', byAuthor, inStock));
   * ```
   */
  constructor(operator: LogicalOperator, ...filters: Filter<T>[]);

  /**
   * Creates a multidimensional `Filter` from a flat array mixing `Filter` instances, nested arrays,
   * and `'AND'` / `'OR'` operators between them.
   *
   * @remarks
   * A nested array element (e.g. the `[f3, 'AND', f4]` inside `[f1, 'OR', [f3, 'AND', f4]]`) becomes
   * a parenthesized sub-group when the query is built — this is how mixed `'AND'` / `'OR'` precedence
   * is expressed, since the two-argument `new Filter(operator, ...filters)` overload only supports a
   * single operator across all of its filters.
   *
   * @example
   * ```ts
   * const wellStocked = new Filter<Author>({
   *   field: 'books',
   *   operator: 'EXISTS',
   *   filters: new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 100 }),
   * });
   * const bornInBoston = new Filter<Author>({ field: 'placeOfBirth', operator: 'EQUALS', value: 'Boston' });
   *
   * const results = await this.find(new Filter<Author>([wellStocked, 'AND', bornInBoston]));
   * ```
   */
  constructor(filter: CompoundFilter<T>);

  constructor(filter: FilterOptions<T> | LogicalOperator | CompoundFilter<T>, ...filters: Filter<T>[]) {
    // Overload 1 => constructor(options: FilterOptions<T>);
    if (typeof filter === 'object' && !Array.isArray(filter)) {
      this.field = filter.field;
      this.operator = filter.operator;

      if (filter.operator === 'EXISTS' || filter.operator === 'NOT EXISTS') {
        // The inner filter targets the association and not `T`, it is kept as the single entry of `filters`
        if (filter.filters !== undefined) {
          this.filters = [filter.filters] as unknown as Filter<T>[];
        }

        return;
      }

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
