// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Service } from '@sap/cds';

import BaseFind from './BaseFind';

import type {
  AppendColumns,
  ColumnFormatter,
  Columns,
  Entity,
  ExternalServiceProps,
  ShowOnlyColumns,
} from '../../types/types';
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
}

export default FindBuilder;
