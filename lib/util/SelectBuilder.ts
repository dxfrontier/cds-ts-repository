/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Definition } from '@sap/cds/apis/csn';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Service } from '@sap/cds';

import type { AppendColumns, ColumnFormatter, Columns, ShowOnlyColumns } from '../types/types';

class SelectBuilder<T, Keys> {
  private select: SELECT<any>;

  /*
   * This flag is used in the getExpand method, as both methods are calling the .columns
   */
  private isColumnsCalled: boolean = false;
  private isExpandCalled: boolean = false;

  constructor(
    private readonly entity: Definition | string,
    private readonly keys: Keys | string,
  ) {
    this.select = SELECT.from(this.entity).where(this.keys);
  }

  /**
   * Skip duplicates similar to distinct from SQL
   * @returns SelectBuilder instance
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
   * @returns SelectBuilder instance
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
   * @returns SelectBuilder instance
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
   * @returns SelectBuilder instance
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
   * Retrieves the expands associated entities.
   * @param associations An array of column names to expand, representing associated entities.
   * @returns SelectBuilder instance
   *
   * @example
   * const results = await this.builder()
   * .find({
   *     name: 'A company name',
   * })
   * .getExpand('orders', 'reviews')
   * // or
   * //.getExpand(['orders', 'reviews'])
   * .execute();
   */
  public getExpand(...associations: Columns<T>[]): this {
    const associationsColumns = Array.isArray(associations[0]) ? associations[0] : associations;

    this.isExpandCalled = true;

    // const private routines for this func
    const _buildAssociatedNamedEntity = (column: any): void => {
      // If .columns() was called first do not expand all
      if (!this.isColumnsCalled) {
        column('*');
      }

      associationsColumns?.forEach((association) => {
        column[association]((linkedEntity: (...args: unknown[]) => unknown) => {
          linkedEntity('*');
        });
      });
    };

    void this.select.columns((column: any) => {
      _buildAssociatedNamedEntity(column);
    });

    return this;
  }

  /**
   * Specifies which columns to be used as aggregate columns or to be renamed
   * @param columns An array of columns
   * @returns SelectBuilder instance
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
  public columnsFormatter<const ColumnKeys extends ColumnFormatter<T>>(
    ...columns: ColumnKeys
  ): SelectBuilder<AppendColumns<T, ColumnKeys>, string | Keys> {
    const constructedColumns = columns.map((item) => {
      // Two columns
      if ('column1' in item && 'column2' in item) {
        const column1 = item.column1 as string;
        const column2 = item.column2 as string;

        return `${item.aggregate}(${column1}, ' ',${column2}) as ${item.renameAs}`;
      }

      // One column
      if ('aggregate' in item && 'column' in item) {
        const column = item.column as string;
        return `${item.aggregate}(${column}) as ${item.renameAs}`;
      }

      // Just rename the column
      return `${item.column as string} as ${item.renameAs}`;
    });

    void this.select.columns(...constructedColumns);

    // We are creating and new instance of SelectBuilder and preserving the select from the current SelectBuilder instance
    const selectBuilder = new SelectBuilder<AppendColumns<T, ColumnKeys>, typeof this.keys>(this.entity, this.keys);

    selectBuilder.select = this.select;

    return selectBuilder;
  }

  /**
   * Specifies which columns to be fetched
   * @param columns An array of column names to retrieve.
   * @returns SelectBuilder instance
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
  ): SelectBuilder<Pick<T, ShowOnlyColumns<T, ColumnKeys>>, string | Keys> {
    const allColumns = Array.isArray(columns[0]) ? columns[0] : columns;

    // private routine for this func
    const _removeExpandAllFields = (): void => {
      this.select.SELECT.columns?.forEach((item, index) => {
        const column = item as any;
        if (column === '*') {
          this.select.SELECT.columns?.splice(index, 1);
        }
      });
      /*
        Workaround using reverse
        When .getExpand(['reviews']) is firstly called before .columns(['currency_code','reviews']) somehow this causes duplicates and gives an error.
        If this is being reversed, this works as expected
      */
      this.select.SELECT.columns?.reverse();
    };

    void this.select.columns(...(allColumns as unknown as string));

    if (this.isExpandCalled) {
      // As the .columns() was called after .getExpand(), the '*' will be removed from the .columns array to have correct typing based only on the columns
      _removeExpandAllFields();
    }

    // this.select.SELECT.columns?.reverse();

    // We are creating and new instance of SelectBuilder and preserving the select from the current SelectBuilder instance
    const selectBuilder = new SelectBuilder<Pick<T, ShowOnlyColumns<T, ColumnKeys>>, typeof this.keys>(
      this.entity,
      this.keys,
    );

    selectBuilder.select = this.select;
    selectBuilder.isColumnsCalled = true;

    return selectBuilder;
  }

  /**
   * Limits the result set with an optional offset.
   * @param props
   * @param props.limit The limit for the result set.
   * @param props.skip The optional 'skip', this will skip a certain number of items for the result set.
   * @returns SelectBuilder instance
   *
   * @example
   * const results = await this.builder().find({
   *   name: 'A company name',
   * })
   * .limit({ limit: 10, skip: 5 })
   * .execute();
   *
   */
  public limit(props: { limit: number; skip?: number }): this {
    if (props.skip !== null) {
      void this.select.limit(props.limit, props.skip);
      return this;
    }

    void this.select.limit(props.limit);
    return this;
  }

  /**
   * Exclusively locks the selected rows for subsequent updates in the current transaction, thereby preventing concurrent updates by other parallel transactions.
   */
  public forUpdate(): this {
    void this.select.forUpdate();
    return this;
  }

  /**
   * Locks the selected rows in the current transaction, thereby preventing concurrent updates by other parallel transactions, until the transaction is committed or rolled back. Using a shared lock allows all transactions to read the locked record.
   * If a queried record is already exclusively locked by another transaction, the .forShareLock() method waits for the lock to be released.
   */
  public forShareLock(): this {
    void this.select.forShareLock();
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

export default SelectBuilder;
