import { constants } from '../../constants/constants';
import util from '../util';

import type { Expand, Columns, Entity } from '../../types/types';
import { findUtils } from './findUtils';

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
    this.resolvedEntity = findUtils.resolveEntityName(entity);

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
   * Passes hints to the database query optimizer that can influence the execution plan. The hints can be passed as individual arguments or as an array.
   *
   * The SQL Optimizer usually determines the access path (for example, index search versus table scan) on the basis of the costs (Cost-Based Optimizer). You can override the SQL Optimizer choice by explicitly specifying hints in the query that enforces a certain access path.
   *
   * @param ...hints - Query optimizer hings
   *
   * `Note`: This works only for `HANA DB`.
   *
   * @link [SAP Hana Hints details](https://help.sap.com/docs/HANA_SERVICE_CF/7c78579ce9b14a669c1f3295b0d8ca16/4ba9edce1f2347a0b9fcda99879c17a1.html)
   */
  hints(...hints: (string | string[])[]): this {
    const flattenedHints = hints.flat(); // Flatten in case an array of strings is passed
    this.select.hints(flattenedHints as string[]);
    return this;
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

    const associations: any[] = Array.isArray(args[0]) ? args[0] : args;

    /**
     * Extremely difficult to work with typing on the projection
     * That's why we use 'any' instead of SAP type
     */

    // Get names of associations being expanded to remove duplicate simple refs
    const associationNames = this.getAssociationNamesToExpand(associations);

    // If .columns() was called before .getExpand(), remove simple refs that will be expanded
    if (this.columnsCalled && associationNames.length > 0) {
      findUtils.columnUtils.removeSimpleColumnRefs(this.select.SELECT.columns, associationNames);
    }

    void this.select.columns((columnProjection: any) => {
      // If .columns() is not present, then add expand all ('*') otherwise don't add it as columns has impact on the typing.
      const columnsNotCalled = !this.columnsCalled;
      const value = associations[0];

      // Implicit overload created by Overload 3
      if (util.noArgs(value)) {
        throw new Error(constants.MESSAGES.GET_EXPAND_NO_ARGS_MESSAGE);
      }

      if (columnsNotCalled) {
        findUtils.expandUtils.expandFirstLevel(columnProjection);
      }

      // Overload 1 : object overload ({ levels : number}) ( auto expand )
      if (findUtils.expandUtils.isPropertyLevelsFound(value)) {
        findUtils.expandUtils.buildDeepExpand(
          findUtils.expandUtils.buildAutoExpandStructure(this.entity.elements, associations),
          columnProjection,
        );
        return;
      }

      // Overload 2 : array overload ( root only expand )
      if (findUtils.expandUtils.isSingleExpand(value)) {
        findUtils.expandUtils.buildSingleExpand(columnProjection, associations);
        return;
      }

      // Overload 3 : object overload ( deep expand )
      findUtils.expandUtils.buildDeepExpand(value, columnProjection);
    });

    return this;
  }

  /**
   * Extracts the association names that will be expanded from the getExpand arguments.
   * @param associations - The associations array from getExpand arguments.
   * @returns An array of association names.
   */
  private getAssociationNamesToExpand(associations: any[]): string[] {
    const value = associations[0];

    // Overload 1: { levels: number } - auto expand, names come from entity elements
    if (findUtils.expandUtils.isPropertyLevelsFound(value)) {
      // For auto expand, we'd need to traverse entity elements - skip for now as it's complex
      return [];
    }

    // Overload 2: array of strings like ['reviews'] or spread 'reviews', 'author'
    if (findUtils.expandUtils.isSingleExpand(value)) {
      return associations.filter((a) => typeof a === 'string');
    }

    // Overload 3: object like { reviews: {}, author: {} }
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value);
    }

    return [];
  }
}

export default BaseFind;
