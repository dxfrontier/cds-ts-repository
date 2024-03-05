/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Definition } from '@sap/cds/apis/csn';
import { constants } from '../constants/constants';
import type { Expand, Columns, AssociationFunction, ValueExpand } from '../types/types';
import util from './util';

/**
 * Common Select builder class, this class contains constructor initialization and common methods use in FindBuilder.ts, FindOneBuilder.ts
 */
class BaseFind<T, Keys> {
  protected select: SELECT<any>;
  protected columnsCalled: boolean = false;
  protected expandCalled: boolean = false;

  constructor(
    protected readonly entity: Definition | string,
    protected readonly keys: Keys | string,
  ) {
    this.select = SELECT.from(this.entity).where(this.keys);
  }

  /**
   * Exclusively locks the selected rows for subsequent updates in the current transaction, thereby preventing concurrent updates by other parallel transactions.
   * @param options [optional]
   * @param options.wait an integer specifying the timeout after which to fail with an error in case a lock couldn't be obtained.
   * @returns FindBuilder / FindOneBuilder instance
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

  // /**
  //  * Automatically expands and exposes associations/compositions of the entity.
  //  * @returns FindBuilder / FindOneBuilder instance
  //  *
  //  * @example
  //  * const results = await this.builder()
  //  * .find({
  //  *     name: 'A company name',
  //  * })
  //  * .getExpand()
  //  * .execute();
  //  */
  // public getExpand(): this;

  /**
   * Deep expand of the associated entities.
   * @param associations An object of column names to expand, representing associated entities.
   * @returns FindBuilder / FindOneBuilder instance
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
   *    select: ['ID', 'name'],
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
   * @returns FindBuilder / FindOneBuilder instance
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
        _exposeOnlyFields(value.select, linkedEntity);
      });
    };

    const _processSelectAndExpand = (association: any, value: ValueExpand): void => {
      association((linkedEntity: AssociationFunction) => {
        _exposeOnlyFields(value.select, linkedEntity);
        _buildDeepExpand(value.expand, linkedEntity);
      });
    };

    const _processOnlyExpand = (association: any, value: ValueExpand): void => {
      association((linkedEntity: AssociationFunction) => {
        _expandFirstLevel(linkedEntity);
        _buildDeepExpand(value.expand, linkedEntity);
      });
    };

    const _exposeOnlyFields = (fields: any[], linkedEntity: AssociationFunction): void => {
      fields.forEach((item: unknown) => {
        linkedEntity(item);
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
}

export default BaseFind;
