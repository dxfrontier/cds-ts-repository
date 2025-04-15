// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Service, type } from '@sap/cds';

import BaseFind from './BaseFind';

import type {
  ColumnFormatter,
  AppendColumns,
  Columns,
  ShowOnlyColumns,
  Entity,
  ExternalServiceProps,
} from '../../types/types';
import { findUtils } from './findUtils';

/**
 * Builder class for constructing a query to find a single entity.
 *
 * Extends {@link BaseFind} class to inherit common find methods.
 *
 * @template T - The entity type being queried.
 * @template Keys - The type representing the keys or filters for the query.
 */
class FindOneBuilder<T, Keys> extends BaseFind<T, Keys> {
  /**
   * Constructs a new `FindOneBuilder` instance.
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

    this.initializeSelectOne();
  }

  /*
   * This method is used to override the SELECT from the BaseFind to add SELECT.one.from instead of SELECT.from ...
   */
  private initializeSelectOne(): void {
    const query = SELECT.one.from(this.resolvedEntity);

    if (this.keys) {
      query.where(this.keys);
    }

    this.select = query;
  }

  /**
   * Specifies which columns to be used as aggregate columns or to be renamed.
   *
   * @param columns - An array of columns
   * @returns FindOneBuilder instance
   *
   * @example
   * const result = await this.builder()
   *   .findOne({
   *     name: 'A company name',
   *   })
   *   .columnsFormatter(
   *     { column: 'stock', renameAs: 'stockRenamed' }, // just renaming
   *   )
   *   .execute();
   */
  public columnsFormatter<const ColumnKeys extends ColumnFormatter<T, 'FIND_ONE'>>(
    ...columns: ColumnKeys
  ): FindOneBuilder<AppendColumns<T, ColumnKeys>, string | Keys> {
    const aggregateColumns = findUtils.columnUtils.buildAggregateColumns<T, ColumnKeys>(...columns);

    void this.select.columns(...aggregateColumns);

    return this as FindOneBuilder<AppendColumns<T, ColumnKeys>, string | Keys>;
  }

  /**
   * Specifies which columns to be fetched for a single record.
   *
   * @param columns - An array of column names to retrieve.
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
   */
  public columns<ColumnKeys extends Columns<T>>(
    ...columns: ColumnKeys[]
  ): FindOneBuilder<Pick<T, ShowOnlyColumns<T, ColumnKeys>>, string | Keys> {
    const allColumns = Array.isArray(columns[0]) ? columns[0] : columns;

    void this.select.columns(...(allColumns as unknown as string));

    if (this.expandCalled) {
      // As the .columns() was called after .getExpand(), the '*' will be removed from the .columns array to have correct typing based only on the columns
      findUtils.columnUtils.removeExpandOperator(this.select.SELECT.columns);
    }

    this.columnsCalled = true;

    return this as FindOneBuilder<Pick<T, ShowOnlyColumns<T, ColumnKeys>>, string | Keys>;
  }

  /**
   * Executes the query and returns the result as an object.
   *
   * @returns A promise that resolves to the single entity result.
   */
  public async execute(): Promise<T | undefined> {
    if (this.externalService) {
      return await this.externalService.run(this.select);
    }

    return await this.select;
  }
}

export default FindOneBuilder;
