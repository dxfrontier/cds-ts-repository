// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Service } from '@sap/cds';

import BaseFind from './BaseFind';
import type { ColumnFormatter, AppendColumns, Columns, ShowOnlyColumns, Entity } from '../types/types';
import util from './util';

class FindOneBuilder<T, Keys> extends BaseFind<T, Keys> {
  constructor(entity: Entity, keys: Keys | string) {
    super(entity, keys);

    this.initializeSelectOne();
  }

  /*
   * This method is used to override the SELECT from the BaseFind to add SELECT.one.from instead of SELECT.from ...
   **/
  private initializeSelectOne(): void {
    this.select = SELECT.one.from(this.entity.name).where(this.keys);
  }

  /**
   * Specifies which columns to be used as aggregate columns or to be renamed
   * @param columns An array of columns
   * @returns FindOneBuilder instance
   *
   * @example
   * const result = await this.builder()
   * .findOne({
   *     name: 'A company name',
   * })
   * .columnsFormatter(
   *    { column: 'stock', renameAs: 'stockRenamed' }, // just renaming
   * )
   * .execute();
   */
  public columnsFormatter<const ColumnKeys extends ColumnFormatter<T, 'FIND_ONE'>>(
    ...columns: ColumnKeys
  ): FindOneBuilder<AppendColumns<T, ColumnKeys>, string | Keys> {
    const aggregateColumns = util.buildAggregateColumns<T, ColumnKeys>(...columns);

    void this.select.columns(...aggregateColumns);

    // Created new instance of FindOneBuilder and preserving the select from the current instance
    const selectOneBuilder = new FindOneBuilder<AppendColumns<T, ColumnKeys>, typeof this.keys>(this.entity, this.keys);

    selectOneBuilder.select = this.select;

    return selectOneBuilder;
  }

  /**
   * Specifies which columns to be fetched
   * @param columns An array of column names to retrieve.
   * @returns FindOneBuilder instance
   *
   * @example
   * const result = await this.builder().findOne({
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
  ): FindOneBuilder<Pick<T, ShowOnlyColumns<T, ColumnKeys>>, string | Keys> {
    const allColumns = Array.isArray(columns[0]) ? columns[0] : columns;

    void this.select.columns(...(allColumns as unknown as string));

    if (this.expandCalled) {
      // As the .columns() was called after .getExpand(), the '*' will be removed from the .columns array to have correct typing based only on the columns
      util.removeExpandOperator(this.select.SELECT.columns);
    }

    // Created new instance of FindOneBuilder and preserving the select from the current instance
    const selectOneBuilder = new FindOneBuilder<Pick<T, ShowOnlyColumns<T, ColumnKeys>>, typeof this.keys>(
      this.entity,
      this.keys,
    );

    selectOneBuilder.select = this.select;
    selectOneBuilder.columnsCalled = true;

    return selectOneBuilder;
  }

  /**
   * Executes the query and returns the result as object.
   * @returns A promise that resolves to the query result.
   */
  public async execute(): Promise<T | undefined> {
    return await this.select;
  }
}

export default FindOneBuilder;
