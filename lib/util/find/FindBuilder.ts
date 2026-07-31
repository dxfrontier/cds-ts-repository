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
  ExternalServiceProps,
  ShowOnlyColumns,
} from '../../types/types';
import type { Filter } from '../filter/Filter';
import coreRepositoryUtils from '../coreRepository/coreRepositoryUtils';
import { findUtils } from './findUtils';

/**
 * Builder class for constructing a query to find multiple entities.
 * Extends {@link BaseFind} class to inherit common find methods.
 *
 * @template T - The entity type being queried.
 * @template Keys - The type representing the keys or filters for the query.
 */
class FindBuilder<T, Keys> extends BaseFind<T, Keys> {
  /**
   * Constructs a new `FindBuilder` instance.
   *
   * @param entity - The entity type or name to query.
   * @param keys - The keys or filters for the query.
   */
  constructor(
    protected readonly entity: Entity,
    protected readonly keys: Keys | string | undefined,
    protected readonly externalService?: ExternalServiceProps,
  ) {
    super(entity, keys);
  }

  /**
   * `Skip` duplicates similar to distinct from SQL.
   * @returns FindBuilder instance
   *
   * @example
   * const results = await this.builder().find()
   * .distinct
   * .columns('country')
   * .execute();
   */
  get distinct(): this {
    this.select.SELECT.distinct = true;
    return this;
  }

  /**
   * Orders the selected columns in ascending order.
   *
   * @param columns - An array of column names to order ascending.
   * @returns FindBuilder instance
   *
   * @example
   * const results = await this.builder().find({
   *   name: 'A company name',
   * })
   * .orderAsc('name', 'company', 'ID')
   * // or
   * //.orderAsc(['name', 'company'])
   * .execute();
   */
  public orderAsc(...columns: Columns<T>[]): this {
    const columnsArray = Array.isArray(columns[0]) ? columns[0] : columns;
    const ascColumns = columnsArray.map((column) => `${column as string} asc`);

    void this.select.orderBy(...ascColumns);

    return this;
  }

  /**
   * Orders the selected columns in descending order.
   *
   * @param columns - An array of column names to order in descending.
   * @returns FindBuilder instance
   *
   * @example
   * const results = await this.builder().find({
   *   name: 'A company name',
   * })
   * .orderDesc(['name'])
   * // or
   * //.orderDesc(['name', 'company'])
   * .execute();
   */
  public orderDesc(...columns: Columns<T>[]): this {
    const columnsArray = Array.isArray(columns[0]) ? columns[0] : columns;
    const descColumns = columnsArray.map((column) => `${column as string} desc`);

    void this.select.orderBy(...descColumns);

    return this;
  }

  /**
   * Groups the selected columns.
   *
   * @param columns - An array of column names to use for grouping.
   * @returns FindBuilder instance
   *
   * @example
   * const results = await this.builder().find({
   *   name: 'A company name',
   * })
   * .groupBy('name', 'company')
   * // or
   * //.groupBy(['name', 'company'])
   * .execute();
   */
  public groupBy(...columns: Columns<T>[]): this {
    const columnsArray = Array.isArray(columns[0]) ? columns[0] : columns;
    void this.select.groupBy(...(columnsArray as unknown as string));
    return this;
  }

  /**
   * Filters the groups created by `.groupBy()`, the `HAVING` counterpart of the `WHERE` clause.
   *
   * `Note`: `.groupBy()` must be called before, aggregate conditions (E.g. `count(*) >= 2`) can only
   * be expressed as a raw string as they are not columns of the entity.
   *
   * @param filter - A raw condition string or a `Filter` instance applied on the groups.
   * @returns FindBuilder instance
   *
   * @example
   * const results = await this.builder().find()
   * .columnsFormatter({ column: 'ID', aggregate: 'COUNT', renameAs: 'total' })
   * .groupBy('author_ID')
   * // raw string, mandatory for aggregates
   * .having('count(*) >= 2')
   * // or a Filter
   * //.having(new Filter<Book>({ field: 'author_ID', operator: 'EQUALS', value: 101 }))
   * .execute();
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
   * Specifies which columns to be used as aggregate columns or to be renamed.
   *
   * @param columns - An array of columns.
   * @returns FindBuilder instance
   *
   * @example
   * const results = await this.builder()
   * .find({
   *     name: 'A company name',
   * })
   * .columnsFormatter(
   *    { column: 'price', aggregate: 'AVG', renameAs: 'theAvg' }, // using 'AVG'
   *    { column: 'stock', renameAs: 'stockRenamed' }, // just renaming
   *    // temporal difference between two date columns
   *    { column1: 'dateOfBirth', column2: 'dateOfDeath', aggregate: 'DAYS_BETWEEN', renameAs: 'daysLived' },
   * )
   * .execute();
   */
  public columnsFormatter<const ColumnKeys extends ColumnFormatter<T, 'FIND'>>(
    ...columns: ColumnKeys
  ): FindBuilder<AppendColumns<T, ColumnKeys>, string | Keys> {
    const aggregateColumns = findUtils.columnUtils.buildAggregateColumns<T, ColumnKeys>(...columns);

    void this.select.columns(...aggregateColumns);

    return this as FindBuilder<AppendColumns<T, ColumnKeys>, string | Keys>;
  }

  /**
   * Specifies which columns to be fetched.
   *
   * @param columns - An array of column names to retrieve.
   * @returns FindBuilder instance
   *
   * @example
   * const results = await this.builder().find({
   *   name: 'A company name',
   * })
   * .columns('name', 'currency_code')
   * // or
   * //.columns(['name', 'currency_code'])
   * .execute();
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
   * Limits the result set with an optional offset.
   *
   * @param options - The options for limiting the result set.
   * @param options.limit - The limit for the result set.
   * @param options.skip - Optional. The number of items to skip in the result set.
   * @returns FindBuilder instance
   *
   * @example
   * const results = await this.builder().find({
   *   name: 'A company name',
   * })
   * .paginate({ limit: 10, skip: 5 })
   * .execute();
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
   * Executes the query and returns the result as an array of objects.
   *
   * @returns A promise that resolves to the array of query results.
   */
  public async execute(): Promise<T[] | undefined> {
    if (this.externalService) {
      return await this.externalService.run(this.select);
    }

    return await this.select;
  }

  /**
   * Executes the query and returns the results together with the total number of rows matching it.
   *
   * The `count` ignores the pagination : with `.paginate()` it is the total of the unpaginated
   * query, with `.groupBy()` the number of groups and with `.distinct` the number of distinct rows.
   *
   * `Note`: currently not supported on `External services`.
   *
   * @returns A promise that resolves to the query results and the total count.
   *
   * @example
   * const { results, count } = await this.builder().find({
   *   currency_code: 'GBP',
   * })
   * .paginate({ limit: 10 })
   * .executeAndCount();
   * // results : the first 10 'GBP' books, count : all 'GBP' books
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
   * Executes the query and calls the callback for every row, without materializing the whole result
   * set in memory. Ideal for processing large tables.
   *
   * `Note`: currently not supported on `External services`.
   *
   * @param callback - The function called for every row of the result set, `async` callbacks are awaited.
   * @returns A promise that resolves once every row was processed.
   *
   * @example
   * await this.builder().find({
   *   currency_code: 'GBP',
   * })
   * .orderAsc('ID')
   * .forEach(async (book) => {
   *   await this.archive(book);
   * });
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
   * Executes the query and pipes the serialized results into the given writable stream, without
   * materializing the whole result set in memory.
   *
   * `Note`: the written bytes are the `JSON` array of the results (E.g. `[{"ID":201}, ...]`) and not
   * row objects, which makes it a direct fit for an `HTTP` response. Use `.forEach()` to work on rows.
   *
   * `Note`: currently not supported on `External services`.
   *
   * @param destination - The writable stream the serialized results are piped into.
   * @returns A promise that resolves once every row was written.
   *
   * @example
   * await this.builder().find()
   * .orderAsc('ID')
   * .pipeline(req.http!.res);
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
   * Executes the query and returns a readable stream of the serialized results, without
   * materializing the whole result set in memory.
   *
   * `Note`: the emitted bytes are the `JSON` array of the results (E.g. `[{"ID":201}, ...]`) and not
   * row objects, which makes it a direct fit for an `HTTP` response. Use `.forEach()` to work on rows.
   *
   * `Note`: currently not supported on `External services`.
   *
   * @returns A readable stream emitting the serialized results, query errors are emitted on it.
   *
   * @example
   * const stream = this.builder().find()
   * .orderAsc('ID')
   * .stream();
   *
   * // The 'error' listener is mandatory, an unhandled stream error crashes the process
   * stream.on('error', (error) => req.reject(500, error.message));
   * stream.pipe(req.http!.res);
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
