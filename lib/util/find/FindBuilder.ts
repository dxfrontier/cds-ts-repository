// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Service } from '@sap/cds';
import cds from '@sap/cds';

import { PassThrough } from 'stream';

import BaseFind from './BaseFind';

import type { Readable, Writable } from 'stream';
import type {
  AppendColumns,
  ColumnFormatter,
  Columns,
  Entity,
  ExecuteAndCountResult,
  ExternalServiceBinding,
  ShowOnlyColumns,
} from '../../types/types';
import type { Filter } from '../filter/Filter';
import coreRepositoryUtils from '../coreRepository/coreRepositoryUtils';
import util from '../util';
import { findUtils } from './findUtils';

/**
 * Chainable SELECT builder for multiple rows, obtained from `repository.builder().find(...)`.
 * Wraps a CDS-QL `SELECT.from(<Entity>)`, refined by the modifier methods below and run by a terminal.
 *
 * @template T - The entity type being queried.
 * @template Keys - The type representing the keys or filters for the query.
 *
 * @remarks
 * Modifiers (`.orderAsc`, `.orderDesc`, `.groupBy`, `.having`, `.columns`, `.columnsFormatter`,
 * `.paginate`, `.distinct`, `.getExpand`, `.forUpdate`, `.forShareLock`, `.hints` — inherited from
 * `BaseFind`) return `this` and chain in any order; a terminal (`.execute`, `.executeAndCount`,
 * `.forEach`, `.pipeline`, `.stream`) runs the query exactly once. Use `FindOneBuilder` (via
 * `repository.builder().findOne(...)`) when at most one row is expected.
 *
 * @example
 * ```ts
 * const cheapBooks = await this.builder()
 *   .find({ currency_code: 'GBP' })
 *   .orderAsc('price')
 *   .paginate({ limit: 10 })
 *   .execute();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#find-1 | CDS-TS-Repository - .find}
 * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § .find
 */
class FindBuilder<T, Keys> extends BaseFind<T, Keys> {
  /**
   * Instantiated internally by `repository.builder().find(...)` — never constructed directly.
   *
   * @param entity - The entity type or name to query.
   * @param keys - The keys or filters for the query.
   * @param externalService - The remote OData service (attached via `@ExternalService`) that `.execute()`
   * runs the query against instead of the primary database, or the descriptor of a connection still in
   * flight; every other terminal throws when it is set.
   */
  constructor(
    protected readonly entity: Entity,
    protected readonly keys: Keys | string | undefined,
    protected readonly externalService?: ExternalServiceBinding,
  ) {
    super(entity, keys);
  }

  /**
   * Skips duplicate rows, the SQL `DISTINCT` counterpart.
   * Sets `SELECT.distinct = true`.
   *
   * @remarks
   * Accessed as a property, not called as a method (`.distinct`, not `.distinct()`). When set,
   * `.executeAndCount()` counts the DISTINCT rows instead of the unpaginated total.
   *
   * @returns FindBuilder instance
   *
   * @example
   * ```ts
   * const currencies = await this.builder()
   *   .find()
   *   .distinct
   *   .columns('currency_code')
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#distinct | CDS-TS-Repository - distinct}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § distinct
   */
  get distinct(): this {
    this.select.SELECT.distinct = true;
    return this;
  }

  /**
   * Orders the result set by the given columns, ascending.
   * Appends `.orderBy(<column> asc, ...)` to the SELECT.
   *
   * @remarks
   * Accepts either spread arguments or a single array of column names; multiple columns sort
   * left-to-right (primary, secondary, …). Sibling: `.orderDesc()` for descending order.
   *
   * @param columns - An array of column names to order ascending.
   * @returns FindBuilder instance
   *
   * @example
   * ```ts
   * const results = await this.builder()
   *   .find({ genre_ID: 12 })
   *   .orderAsc('price', 'title')
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#orderasc | CDS-TS-Repository - orderAsc}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § orderAsc
   */
  public orderAsc(...columns: Columns<T>[]): this {
    const columnsArray = Array.isArray(columns[0]) ? columns[0] : columns;
    const ascColumns = columnsArray.map((column) => `${column as string} asc`);

    void this.select.orderBy(...ascColumns);

    return this;
  }

  /**
   * Orders the result set by the given columns, descending.
   * Appends `.orderBy(<column> desc, ...)` to the SELECT.
   *
   * @remarks
   * Accepts either spread arguments or a single array of column names; multiple columns sort
   * left-to-right (primary, secondary, …). Sibling: `.orderAsc()` for ascending order.
   *
   * @param columns - An array of column names to order in descending.
   * @returns FindBuilder instance
   *
   * @example
   * ```ts
   * const results = await this.builder()
   *   .find({ genre_ID: 12 })
   *   .orderDesc('price')
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#orderdesc | CDS-TS-Repository - orderDesc}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § orderDesc
   */
  public orderDesc(...columns: Columns<T>[]): this {
    const columnsArray = Array.isArray(columns[0]) ? columns[0] : columns;
    const descColumns = columnsArray.map((column) => `${column as string} desc`);

    void this.select.orderBy(...descColumns);

    return this;
  }

  /**
   * Groups the result set by the given columns, the SQL `GROUP BY` counterpart.
   * Appends `.groupBy(...)` to the SELECT.
   *
   * @remarks
   * Accepts either spread arguments or a single array of column names. Required before `.having()`
   * (which throws otherwise); typically paired with `.columnsFormatter()` aggregates (`COUNT`, `AVG`,
   * …), since plain columns outside the grouping list are otherwise meaningless in a grouped query.
   *
   * @param columns - An array of column names to use for grouping.
   * @returns FindBuilder instance
   *
   * @example
   * ```ts
   * const perAuthor = await this.builder()
   *   .find()
   *   .columnsFormatter({ column: 'ID', aggregate: 'COUNT', renameAs: 'total' })
   *   .groupBy('author_ID')
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#groupby | CDS-TS-Repository - groupBy}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § groupBy
   */
  public groupBy(...columns: Columns<T>[]): this {
    const columnsArray = Array.isArray(columns[0]) ? columns[0] : columns;
    void this.select.groupBy(...(columnsArray as unknown as string));
    return this;
  }

  /**
   * Filters the groups created by `.groupBy()`, the SQL `HAVING` counterpart of `WHERE`.
   * Appends `.having(...)` to the SELECT.
   *
   * @remarks
   * THROWS `Error('.having() requires .groupBy() to be called before !')` when `.groupBy()` was not
   * called earlier in the chain. Aggregate conditions (E.g. `count(*) >= 2`) MUST be a raw string —
   * they are not columns of the entity and a `Filter<T>` cannot express them; `Filter<T>` only covers
   * plain conditions on the grouped columns themselves.
   *
   * @param filter - A raw condition string or a `Filter` instance applied on the groups.
   * @returns FindBuilder instance
   *
   * @example
   * ```ts
   * const popularAuthors = await this.builder()
   *   .find()
   *   .columnsFormatter({ column: 'ID', aggregate: 'COUNT', renameAs: 'total' })
   *   .groupBy('author_ID')
   *   .having('count(*) >= 2')
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#having | CDS-TS-Repository - having}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § having
   */
  public having(filter: Filter<T> | string): this {
    if (!this.select.SELECT.groupBy) {
      throw new Error('.having() requires .groupBy() to be called before !');
    }

    const condition = typeof filter === 'string' ? filter : (coreRepositoryUtils.buildQueryKeys(filter) as string);

    void this.select.having(condition);

    return this;
  }

  /**
   * Adds aggregate or renamed columns to the projection (`AVG`, `COUNT`, `CONCAT`, `DAYS_BETWEEN`, a
   * plain rename, …).
   * Appends the computed expressions to the SELECT's `.columns(...)`.
   *
   * @remarks
   * Numeric aggregates (`AVG` / `MIN` / `MAX` / `SUM` / …) are only available here, on `FindBuilder` —
   * `FindOneBuilder`'s overload excludes them, since a single row has nothing to aggregate over. The
   * two-column form (`column1` / `column2`) is either `CONCAT` (string) or a temporal difference
   * function (`DAYS_BETWEEN` / `MONTHS_BETWEEN` / `YEARS_BETWEEN` / `SECONDS_BETWEEN`). The return
   * type appends the new, renamed columns via `AppendColumns<T, ColumnKeys>`; sibling `.columns()`
   * selects existing columns without computing anything.
   *
   * @param columns - An array of columns.
   * @returns FindBuilder instance
   *
   * @example
   * ```ts
   * const results = await this.builder()
   *   .find()
   *   .columnsFormatter(
   *     { column: 'price', aggregate: 'AVG', renameAs: 'avgPrice' },
   *     { column: 'stock', renameAs: 'stockRenamed' },
   *   )
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#columnsformatter | CDS-TS-Repository - columnsFormatter}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § columnsFormatter
   */
  public columnsFormatter<const ColumnKeys extends ColumnFormatter<T, 'FIND'>>(
    ...columns: ColumnKeys
  ): FindBuilder<AppendColumns<T, ColumnKeys>, string | Keys> {
    const aggregateColumns = findUtils.columnUtils.buildAggregateColumns<T, ColumnKeys>(...columns);

    void this.select.columns(...aggregateColumns);

    return this as FindBuilder<AppendColumns<T, ColumnKeys>, string | Keys>;
  }

  /**
   * Restricts the projection to the given columns, the SQL `SELECT <columns>` counterpart.
   * Appends the column names to the SELECT's `.columns(...)`.
   *
   * @remarks
   * Accepts either spread arguments or a single array; narrows the resolved row type to
   * `Pick<T, ShowOnlyColumns<T, ColumnKeys>>`. When called AFTER `.getExpand()`, simple column refs
   * that duplicate an already-expanded association are filtered out automatically and the `'*'`
   * auto-expand marker is dropped, so ordering the two calls never double-selects an association.
   *
   * @param columns - An array of column names to retrieve.
   * @returns FindBuilder instance
   *
   * @example
   * ```ts
   * const results = await this.builder()
   *   .find({ currency_code: 'GBP' })
   *   .columns('title', 'price')
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#columns | CDS-TS-Repository - columns}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § columns
   */
  public columns<ColumnKeys extends Columns<T>>(
    ...columns: ColumnKeys[]
  ): FindBuilder<Pick<T, ShowOnlyColumns<T, ColumnKeys>>, string | Keys> {
    let allColumns = (Array.isArray(columns[0]) ? columns[0] : columns) as string[];

    if (this.expandCalled) {
      // Filter out columns that are already expanded to avoid "Duplicate definition" error
      allColumns = findUtils.columnUtils.filterExpandedColumns(allColumns, this.select.SELECT.columns);

      // Remove the '*' operator as .columns() was called after .getExpand()
      findUtils.columnUtils.removeExpandOperator(this.select.SELECT.columns);
    }

    if (allColumns.length > 0) {
      void this.select.columns(...(allColumns as unknown as string));
    }

    this.columnsCalled = true;

    return this as FindBuilder<Pick<T, ShowOnlyColumns<T, ColumnKeys>>, string | Keys>;
  }

  /**
   * Limits the result set with an optional offset, the SQL `LIMIT` / `OFFSET` counterpart.
   * Calls `.limit(limit, skip)` on the SELECT.
   *
   * @remarks
   * `skip` defaults to no offset when omitted. `.executeAndCount()`'s count ignores this pagination —
   * it always reports the TOTAL unpaginated match count.
   *
   * @param options - The options for limiting the result set.
   * @param options.limit - The limit for the result set.
   * @param options.skip - Optional. The number of items to skip in the result set.
   * @returns FindBuilder instance
   *
   * @example
   * ```ts
   * const results = await this.builder()
   *   .find({ currency_code: 'GBP' })
   *   .paginate({ limit: 10, skip: 5 })
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#paginate-1 | CDS-TS-Repository - paginate}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § paginate
   */
  public paginate(options: { limit: number; skip?: number }): this {
    if (options.skip !== undefined && options.skip !== null) {
      void this.select.limit(options.limit, options.skip);
    } else {
      void this.select.limit(options.limit);
    }
    return this;
  }

  /**
   * Runs the built SELECT and returns the matching rows.
   * Executes the SELECT directly against the primary datasource, or via the attached external
   * service's `run(query)`.
   *
   * @remarks
   * THE primary terminal of the chain — call it last, after every modifier (`.orderAsc`, `.columns`,
   * `.getExpand`, …). For the total row count alongside the page, use `.executeAndCount()`; for result
   * sets too large to materialize in memory, use `.forEach()`, `.pipeline()` or `.stream()` instead.
   * On an external service whose connection is still pending, this is where it is awaited: the built
   * query is then pointed at the entity the service declares before it is run.
   *
   * @returns A promise that resolves to the array of query results.
   *
   * @example
   * ```ts
   * const cheapBooks = await this.builder()
   *   .find({ currency_code: 'GBP' })
   *   .orderAsc('price')
   *   .paginate({ limit: 5 })
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#execute | CDS-TS-Repository - execute}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § execute
   */
  public async execute(): Promise<T[] | undefined> {
    if (this.externalService) {
      const target = await util.resolveExternalTarget(this.entity, this.externalService);

      util.retargetQuery(this.select, findUtils.resolveEntityName(target.entity));

      return await target.service.run(this.select);
    }

    return await this.select;
  }

  /**
   * Runs the query and returns the matching rows together with the total row count, ignoring
   * pagination.
   * Runs `.execute()` and a derived `count(*)` (or grouped/distinct row count) query in parallel.
   *
   * @remarks
   * THROWS `Error('executeAndCount is currently not supported on External services !')` when the
   * repository has an attached `@ExternalService`. The count always ignores `.paginate()` (it is the
   * TOTAL unpaginated match count); with `.groupBy()` it is the number of groups, and with `.distinct`
   * the number of distinct rows. Prefer plain `.execute()` when the count is not needed — it skips the
   * extra query.
   *
   * @returns A promise that resolves to the query results and the total count.
   *
   * @example
   * ```ts
   * const { results, count } = await this.builder()
   *   .find({ currency_code: 'GBP' })
   *   .paginate({ limit: 10 })
   *   .executeAndCount();
   * // results: the first 10 'GBP' books, count: every 'GBP' book
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#executeandcount | CDS-TS-Repository - executeAndCount}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § executeAndCount
   */
  public async executeAndCount(): Promise<ExecuteAndCountResult<T>> {
    if (this.externalService) {
      throw new Error('executeAndCount is currently not supported on External services !');
    }

    // Counted first : the count query is derived from the main query and has to be built before it runs
    const [count, results] = await Promise.all([this.countAll(), this.execute()]);

    return { results: results ?? [], count };
  }

  /**
   * Streams the query and invokes `callback` once per row, without materializing the whole result set
   * in memory. Ideal for processing large tables.
   * Iterates the SELECT with `for await...of`, inside an explicit transaction.
   *
   * @remarks
   * THROWS `Error('forEach is currently not supported on External services !')` when the repository
   * has an attached `@ExternalService`. `async` callbacks are AWAITED one row at a time — unlike
   * `Array.prototype.forEach`, `callback` never runs concurrently for two rows. Runs inside its own
   * managed transaction; nesting it inside an ambient transaction is safe. Use `.execute()` when the
   * whole result set fits in memory, or `.pipeline()` / `.stream()` to forward serialized JSON instead
   * of row objects.
   *
   * @param callback - The function called for every row of the result set, `async` callbacks are awaited.
   * @returns A promise that resolves once every row was processed.
   *
   * @example
   * ```ts
   * await this.builder()
   *   .find({ currency_code: 'GBP' })
   *   .orderAsc('ID')
   *   .forEach(async (book) => {
   *     await this.archive(book);
   *   });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#foreach | CDS-TS-Repository - forEach}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § forEach
   */
  public async forEach(callback: (row: T) => unknown | Promise<unknown>): Promise<void> {
    if (this.externalService) {
      throw new Error('forEach is currently not supported on External services !');
    }

    // Streaming requires an explicit transaction, nesting it in an ambient one is safe.
    // The rows are iterated instead of being delegated to `.foreach()`, which discards the promise
    // of an `async` callback and would resolve while the callback is still running.
    await cds.tx(async () => {
      for await (const row of this.select) {
        await callback(row as T);
      }
    });
  }

  /**
   * Streams the query and pipes the serialized rows into `destination`, without materializing the
   * whole result set in memory.
   * Runs `SELECT.pipeline(destination)` inside an explicit transaction.
   *
   * @remarks
   * THROWS `Error('pipeline is currently not supported on External services !')` when the repository
   * has an attached `@ExternalService`. The written bytes are the `JSON` ARRAY of the results (E.g.
   * `[{"ID":201}, ...]`), NOT row objects — a direct fit for an `HTTP` response body; use `.forEach()`
   * when row-by-row objects are needed instead. Runs inside its own managed transaction; nesting it
   * inside an ambient transaction is safe.
   *
   * @param destination - The writable stream the serialized results are piped into.
   * @returns A promise that resolves once every row was written.
   *
   * @example
   * ```ts
   * await this.builder()
   *   .find()
   *   .orderAsc('ID')
   *   .pipeline(req.http!.res);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#pipeline | CDS-TS-Repository - pipeline}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § pipeline
   */
  public async pipeline(destination: Writable): Promise<void> {
    if (this.externalService) {
      throw new Error('pipeline is currently not supported on External services !');
    }

    // Streaming requires an explicit transaction, nesting it in an ambient one is safe
    await cds.tx(async () => {
      await this.select.pipeline(destination);
    });
  }

  /**
   * Streams the query into a `Readable` of the serialized rows, without materializing the whole
   * result set in memory.
   * Wraps `SELECT.pipeline(...)` into a `PassThrough`, run inside an explicit transaction.
   *
   * @remarks
   * THROWS `Error('stream is currently not supported on External services !')` SYNCHRONOUSLY (this
   * method is not `async`) when the repository has an attached `@ExternalService` — unlike
   * `.forEach()` / `.pipeline()`, whose equivalent throw only rejects the returned promise. The
   * emitted bytes are the `JSON` ARRAY of the results, NOT row objects, same as `.pipeline()`.
   * Streaming errors are emitted on the returned stream instead of a rejected promise: an `'error'`
   * LISTENER IS MANDATORY, an unhandled stream error crashes the process. Runs inside its own managed
   * transaction; nesting it inside an ambient transaction is safe.
   *
   * @returns A readable stream emitting the serialized results, query errors are emitted on it.
   *
   * @example
   * ```ts
   * const stream = this.builder().find().orderAsc('ID').stream();
   *
   * stream.on('error', (error) => req.reject(500, error.message));
   * stream.pipe(req.http!.res);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#stream | CDS-TS-Repository - stream}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § stream
   */
  public stream(): Readable {
    if (this.externalService) {
      throw new Error('stream is currently not supported on External services !');
    }

    const passThrough = new PassThrough();

    // Deliberately floating : the stream is handed over to the caller immediately, streaming errors
    // are surfaced on the stream itself. Streaming requires an explicit transaction.
    void cds
      .tx(async () => {
        await this.select.pipeline(passThrough);
      })
      .catch((error: Error) => passThrough.destroy(error));

    return passThrough;
  }

  /**
   * Counts all rows matching the query, ignoring the pagination.
   * @returns The total number of rows (of groups when the query is grouped, of distinct rows when it is distinct).
   */
  private async countAll(): Promise<number> {
    // Grouped / distinct query : the total is the number of rows the query itself returns, a
    // `count(*)` would count the underlying rows instead. The main query is cloned (and not
    // mutated) to drop the pagination.
    if (this.select.SELECT.groupBy || this.select.SELECT.distinct) {
      const groupedQuery = SELECT.from(this.resolvedEntity);

      Object.assign(groupedQuery.SELECT, JSON.parse(JSON.stringify(this.select.SELECT)));
      delete groupedQuery.SELECT.limit;

      const groups = (await groupedQuery) as unknown[];
      return groups.length;
    }

    // Regular query : let the database compute the count via `count(*)` on the same filters.
    const countQuery = SELECT.one.from(this.resolvedEntity).columns('count(*) as total');

    if (this.select.SELECT.where) {
      countQuery.SELECT.where = JSON.parse(JSON.stringify(this.select.SELECT.where));
    }

    const result = (await countQuery) as { total?: number } | undefined;
    return coreRepositoryUtils.resolveCount(result);
  }
}

export default FindBuilder;
