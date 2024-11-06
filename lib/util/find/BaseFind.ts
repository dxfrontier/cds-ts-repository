import { constants } from '../../constants/constants';
import util from '../util';

import type { Expand, Columns, AssociationFunction, ValueExpand, Entity, ExpandStructure } from '../../types/types';

/**
 * Common Select builder class, this class contains constructor initialization and common methods used in FindBuilder.ts and FindOneBuilder.ts.
 *
 * @template T The type of the entity.
 * @template Keys The type of the keys used to filter the entity.
 */
class BaseFind<T, Keys> {
  protected select: SELECT<any>;
  protected columnsCalled = false;
  protected expandCalled = false;
  protected resolvedEntity: string;

  /**
   * Creates an instance of BaseFind.
   *
   * @param entity - The entity for which the SELECT query is being built.
   * @param keys - The keys used to filter the SELECT query.
   */
  constructor(
    protected readonly entity: Entity,
    protected readonly keys: Keys | string | undefined,
  ) {
    this.resolvedEntity = util.resolveEntityName(entity);

    this.initializeSelect();
  }

  private initializeSelect() {
    const query = SELECT.from(this.resolvedEntity);

    if (this.keys) {
      query.where(this.keys);
    }

    this.select = query;
  }
  /**
   * Provides the Metadata of the fields.
   * `Note`: currently SAP does not offer typing on EntityElements.
   *
   * @returns Metadata of the fields.
   *
   * @example
   * const results = await this.builder().find({
   *   name: 'A company name',
   * }).elements;
   */
  get elements(): unknown {
    return this.select.elements;
  }

  /**
   * Exclusively locks the selected rows for subsequent updates in the current transaction, thereby preventing concurrent updates by other parallel transactions.
   *
   * @param options [optional]
   * @param options.wait - An integer specifying the timeout after which to fail with an error in case a lock couldn't be obtained.
   * @returns The current instance of BaseFind.
   *
   * @example
   * const results = await this.builder().find({
   *   name: 'A company name',
   * }).forUpdate({ wait: 10 }).execute();
   */
  public forUpdate(options?: { wait?: number }): this {
    void this.select.forUpdate({ wait: options?.wait });
    return this;
  }

  /**
   * Locks the selected rows in the current transaction, thereby preventing concurrent updates by other parallel transactions, until the transaction is committed or rolled back.
   * Using a shared lock allows all transactions to read the locked record.
   * If a queried record is already exclusively locked by another transaction, the .forShareLock() method waits for the lock to be released.
   *
   * @returns The current instance of BaseFind.
   */
  public forShareLock(): this {
    void this.select.forShareLock();
    return this;
  }

  /**
   * Auto expands and exposes associations/compositions of the entity.
   *
   * @param options - Options for expanding associations.
   * @param options.levels - Depth number to expand the associations, this will do a deep expand equals to the levels number, `depth can start from 1...n`.
   * @returns The current instance of BaseFind.
   *
   * @example
   * const results = await this.builder().find({
   *     name: 'A company name',
   * }).getExpand({ levels: 2 }).execute();
   */
  public getExpand(options: { levels: number }): this;

  /**
   * Deep expand of the associated entities.
   *
   * @param associations - An object of column names to expand, representing associated entities.
   * @returns The current instance of BaseFind.
   *
   * @example
   * const results = await this.builder().find({
   *     name: 'A company name',
   * }).getExpand({
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
   * }).execute();
   */
  public getExpand(associations: Expand<T>): this;

  /**
   * Retrieves the associated entities expanded up to `1 level`.
   *
   * @param associations - An array of column names to expand, representing associated entities.
   * @returns The current instance of BaseFind.
   *
   * @example
   * const results = await this.builder().find({
   *     name: 'A company name',
   * }).getExpand('orders', 'reviews').execute();
   * // or
   * //.getExpand(['orders', 'reviews']).execute();
   */
  public getExpand(...associations: Columns<T>[]): this;

  public getExpand(...args: any[]): this {
    this.expandCalled = true;

    const associations = Array.isArray(args[0]) ? args[0] : args;

    // const private routines for this func
    const _processExpandAll = (association: any): void => {
      association((linkedEntity: AssociationFunction) => {
        linkedEntity(constants.COMMON.ALL_FIELDS);
      });
    };

    const _processOnlySelect = (association: any, value: ValueExpand): void => {
      association((linkedEntity: AssociationFunction) => {
        _exposeFieldsOnly(value.select, linkedEntity);
      });
    };

    const _processSelectAndExpand = (association: any, value: ValueExpand): void => {
      association((linkedEntity: AssociationFunction) => {
        _exposeFieldsOnly(value.select, linkedEntity);
        _buildDeepExpand(value.expand, linkedEntity);
      });
    };

    const _processOnlyExpand = (association: any, value: ValueExpand): void => {
      association((linkedEntity: AssociationFunction) => {
        _expandFirstLevel(linkedEntity);
        _buildDeepExpand(value.expand, linkedEntity);
      });
    };

    const _exposeFieldsOnly = (fields: unknown[], linkedEntity: AssociationFunction): void => {
      fields.forEach((item: unknown) => {
        linkedEntity(item);
      });
    };

    const _expandFirstLevel = (columnProjection: any): void => {
      columnProjection(constants.COMMON.ALL_FIELDS);
    };

    const _buildDeepExpand = (expandStructure: ExpandStructure, columnProjection: any): void => {
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
      associations.forEach((association) => {
        columnProjection[association]((linkedEntity: AssociationFunction) => {
          linkedEntity(constants.COMMON.ALL_FIELDS);
        });
      });
    };

    const _buildAutoExpandStructure = (elements: any | undefined, depth = 1): ExpandStructure => {
      const value = associations[0];

      if (util.isPropertyLevelsFound(value) && value.levels !== undefined) {
        if (depth > value.levels) {
          return {}; // STOP when reached depth
        }
      }

      // private routine for this func
      const _buildStructure = (): ExpandStructure => {
        const expandStructure: ExpandStructure = {};

        for (const key in elements) {
          const element = elements[key];

          if (util.isElementExpandable(element)) {
            /*
             * SAP does not provides us typing on _target as probably is a private property
             * That's the reason why casting to 'any'
             */
            expandStructure[key] = {
              expand: _buildAutoExpandStructure(element._target.elements, depth + 1),
            };
          }
        }

        return expandStructure;
      };

      return _buildStructure();
    };

    /**
     * Extremely difficult to work with typing on the projection
     * That's why we use 'any' instead of SAP type
     */

    void this.select.columns((columnProjection: any) => {
      // If .columns() is not present, then add expand all ('*') otherwise don't add it as columns has impact on the typing.
      const columnsNotCalled = !this.columnsCalled;
      const value = associations[0];

      // Implicit overload created by Overload 3
      if (util.noArgs(value)) {
        throw new Error(constants.MESSAGES.GET_EXPAND_NO_ARGS_MESSAGE);
      }

      if (columnsNotCalled) {
        _expandFirstLevel(columnProjection);
      }

      // Overload 1 : object overload ({ levels : number}) ( auto expand )
      if (util.isPropertyLevelsFound(value)) {
        _buildDeepExpand(_buildAutoExpandStructure(this.entity.elements), columnProjection);
        return;
      }

      // Overload 2 : array overload ( single expand )
      if (util.isSingleExpand(value)) {
        _buildSingleExpand(columnProjection);
        return;
      }

      // Overload 3 : object overload ( deep expand )
      _buildDeepExpand(value, columnProjection);
    });

    return this;
  }
}

export default BaseFind;
