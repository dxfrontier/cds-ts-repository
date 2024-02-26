/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Definition } from '@sap/cds/apis/csn';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Service } from '@sap/cds';

import type {
  AppendColumns,
  AssociationFunction,
  ColumnFormatter,
  Columns,
  Expand,
  ValueExpand,
  ShowOnlyColumns,
} from '../types/types';

import util from './util';
import { constants } from '../constants/constants';

class SelectBuilder<T, Keys> {
  private select: SELECT<any>;

  /*
   * This flag is used in the getExpand method, as both methods are calling the .columns
   */
  private columnsCalled: boolean = false;
  private expandCalled: boolean = false;

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
   * Deep expand of the associated entities.
   * @param associations An object of column names to expand, representing associated entities.
   * @returns SelectBuilder instance
   *
   * @example
   * const results = await this.builder()
   * .find({
   *     name: 'A company name',
   * })
   * .getExpand({
   *  // expand full 'author' up to 1 level
   *  author: {},
   *  // expand 'genre', having only 'ID' and 'name'
   *  genre: {
   *    select: ['ID', 'parent'],
   *  },
   *  // expand 'reviews', having only 'ID', 'book_ID' and 'reviewer' having only 'ID'
   *  reviews: {
   *    select: ['ID', 'book_ID'],
   *    expand: {
   *      reviewer: {
   *        select: ['ID'],
   *      },
   *    },
   *  },
   * })
   * .execute();
   */
  public getExpand(associations: Expand<T>): this;

  /**
   * Retrieves the associated entities expanded up to 1 level.
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
  public getExpand(...associations: Columns<T>[]): this;

  public getExpand(...args: any[]): this {
    this.expandCalled = true;

    const associationsColumns = Array.isArray(args[0]) ? args[0] : args;

    // const private routines for this func
    const _processExpandAll = (association: any): void => {
      association((linkedEntity: AssociationFunction) => {
        linkedEntity(constants.COMMON.ALL_FIELDS);
      });
    };

    const _processOnlySelect = (association: any, value: ValueExpand): void => {
      association((linkedEntity: AssociationFunction) => {
        value.select.forEach((item: unknown) => {
          linkedEntity(item);
        });
      });
    };

    const _processSelectAndExpand = (association: any, value: ValueExpand): void => {
      association((linkedEntity: AssociationFunction) => {
        value.select.forEach((item: unknown) => {
          linkedEntity(item);
        });

        _buildDeepExpand(value.expand, linkedEntity);
      });
    };

    const _processOnlyExpand = (association: any, value: ValueExpand): void => {
      association((linkedEntity: AssociationFunction) => {
        _expandFirstLevel(association);
        _buildDeepExpand(value.expand, linkedEntity);
      });
    };

    const _expandFirstLevel = (columnProjection: any): void => {
      columnProjection(constants.COMMON.ALL_FIELDS);
    };

    const _buildDeepExpand = (expandStructure: Record<string, any>, columnProjection: any): void => {
      for (const key in expandStructure) {
        const value = expandStructure[key];
        const association = columnProjection[key];

        // Empty object, expand all
        if (util.isExpandAll(value)) {
          _processExpandAll(association);
        }
        // Both select and expand
        else if (util.isSelectAndExpand(value)) {
          _processSelectAndExpand(association, value);
        }
        // Only select
        else if (util.isSelectOnly(value)) {
          _processOnlySelect(association, value);
        }
        // Only expand
        else if (util.isExpandOnly(value)) {
          _processOnlyExpand(association, value);
        } else {
          throw new Error(constants.MESSAGES.DEEP_EXPAND_NOT_EXIST);
        }
      }
    };

    const _buildSingleExpand = (columnProjection: any): void => {
      associationsColumns.forEach((association) => {
        columnProjection[association]((linkedEntity: AssociationFunction) => {
          linkedEntity(constants.COMMON.ALL_FIELDS);
        });
      });
    };

    /**
     * Extremely difficult to work with typing on the projection
     * That's why we use any instead of SAP type
     */

    const singleExpand = typeof associationsColumns[0] === 'string';
    const columnsNotCalled = !this.columnsCalled;

    void this.select.columns((columnProjection: any) => {
      // If .columns() is not present, then add expand all ('*') otherwise don't add it as columns has impact on the typing.
      if (columnsNotCalled) {
        _expandFirstLevel(columnProjection);
      }

      // Overload 1 : array overload ( single expand )
      if (singleExpand) {
        _buildSingleExpand(columnProjection);
        return;
      }

      // Overload 2 : object overload ( deep expand )
      const expandStructure: Record<string, any> = associationsColumns[0];
      _buildDeepExpand(expandStructure, columnProjection);
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
      const twoColumns = 'column1' in item && 'column2' in item;
      if (twoColumns) {
        const column1 = item.column1 as string;
        const column2 = item.column2 as string;

        return `${item.aggregate}(${column1}, ' ',${column2}) as ${item.renameAs}`;
      }

      const oneColumn = 'aggregate' in item && 'column' in item;
      if (oneColumn) {
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
        if (column === constants.COMMON.ALL_FIELDS) {
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

    if (this.expandCalled) {
      // As the .columns() was called after .getExpand(), the '*' will be removed from the .columns array to have correct typing based only on the columns
      _removeExpandAllFields();
    }

    // We are creating and new instance of SelectBuilder and preserving the select from the current SelectBuilder instance
    const selectBuilder = new SelectBuilder<Pick<T, ShowOnlyColumns<T, ColumnKeys>>, typeof this.keys>(
      this.entity,
      this.keys,
    );

    selectBuilder.select = this.select;
    selectBuilder.columnsCalled = true;

    return selectBuilder;
  }

  /**
   * Limits the result set with an optional offset.
   * @param options
   * @param options.limit The limit for the result set.
   * @param options.skip The optional 'skip', this will skip a certain number of items for the result set.
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
  public limit(options: { limit: number; skip?: number }): this {
    if (options.skip !== null) {
      void this.select.limit(options.limit, options.skip);
      return this;
    }

    void this.select.limit(options.limit);
    return this;
  }

  /**
   * Exclusively locks the selected rows for subsequent updates in the current transaction, thereby preventing concurrent updates by other parallel transactions.
   * @param options [optional]
   * @param options.wait an integer specifying the timeout after which to fail with an error in case a lock couldn't be obtained.
   * @returns SelectBuilder instance
   * @example
   * const results = await this.builder().find({
   *   name: 'A company name',
   * })
   * .forUpdate({ wait: 10 })
   * // or
   * //.forUpdate()
   * .execute();
   *
   */
  public forUpdate(options?: { wait?: number }): this {
    void this.select.forUpdate({ wait: options?.wait });
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
