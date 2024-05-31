/* eslint-disable @typescript-eslint/no-useless-constructor */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Service, type } from '@sap/cds';

import util from '../util';
import BaseFind from './BaseFind';

import type { AppendColumns, ColumnFormatter, Columns, Entity, ShowOnlyColumns } from '../../types/types';

class FindBuilder<T, Keys> extends BaseFind<T, Keys> {
  constructor(entity: Entity, keys: Keys | string) {
    super(entity, keys);
  }

  /**
   * `Skip` duplicates similar to distinct from SQL
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
   * @param columns An array of column names to order ascending.
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
   * @param columns An array of column names to order in descending.
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
   * @param columns An array of column names to use for grouping.
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
   * Specifies which columns to be used as aggregate columns or to be renamed
   * @param columns An array of columns
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
    const aggregateColumns = util.buildAggregateColumns<T, ColumnKeys>(...columns);

    void this.select.columns(...aggregateColumns);

    // Created new instance of FindBuilder and preserving the select from the current instance
    const selectBuilder = new FindBuilder<AppendColumns<T, ColumnKeys>, typeof this.keys>(this.entity, this.keys);

    selectBuilder.select = this.select;

    return selectBuilder;
  }

  /**
   * Specifies which columns to be fetched
   * @param columns An array of column names to retrieve.
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
   *
   */
  public columns<ColumnKeys extends Columns<T>>(
    ...columns: ColumnKeys[]
  ): FindBuilder<Pick<T, ShowOnlyColumns<T, ColumnKeys>>, string | Keys> {
    const allColumns = Array.isArray(columns[0]) ? columns[0] : columns;

    void this.select.columns(...(allColumns as unknown as string));

    if (this.expandCalled) {
      // As the .columns() was called after .getExpand(), the '*' will be removed from the .columns array to have correct typing based only on the columns
      util.removeExpandOperator(this.select.SELECT.columns);
    }

    // Created new instance of FindBuilder and preserving the select from the current instance
    const selectBuilder = new FindBuilder<Pick<T, ShowOnlyColumns<T, ColumnKeys>>, typeof this.keys>(
      this.entity,
      this.keys,
    );

    selectBuilder.select = this.select;
    selectBuilder.columnsCalled = true;

    return selectBuilder;
  }

  /**
   * Limits the result set with an optional offset.
   * @deprecated Use `this.builder().find().paginate` instead of `this.builder().find().limit`
   * @param options
   * @param options.limit The limit for the result set.
   * @param options.skip The optional 'skip', this will skip a certain number of items for the result set.
   * @returns FindBuilder instance
   *
   * @example
   * const results = await this.builder().find({
   *   name: 'A company name',
   * })
   * .limit({ limit: 10, skip: 5 })
   * .execute();
   *
   */
  public limit(options: { limit: number; skip?: number }): this {
    if (options.skip !== null) {
      void this.select.limit(options.limit, options.skip);
      return this;
    }

    void this.select.limit(options.limit);
    return this;
  }

  /**
   * Limits the result set with an optional offset.
   * @param options
   * @param options.limit The limit for the result set.
   * @param options.skip The optional 'skip', this will skip a certain number of items for the result set.
   * @returns FindBuilder instance
   *
   * @example
   * const results = await this.builder().find({
   *   name: 'A company name',
   * })
   * .paginate({ limit: 10, skip: 5 })
   * .execute();
   *
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
   * @returns A promise that resolves to the query result.
   */
  public async execute(): Promise<T[] | undefined> {
    return await this.select;
  }
}

export default FindBuilder;
