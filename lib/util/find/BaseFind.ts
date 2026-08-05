import { constants } from '../../constants/constants';
import util from '../util';

import type { Expand, Columns, Entity } from '../../types/types';
import { findUtils } from './findUtils';

/**
 * Shared base of `FindBuilder` and `FindOneBuilder`: initializes the `SELECT` and hosts every
 * modifier method common to finding one row and finding many.
 *
 * @template T - The type of the entity.
 * @template Keys - The type of the keys used to filter the entity.
 *
 * @remarks
 * Never instantiated directly — extended by `FindBuilder` (`repository.builder().find(...)`) and
 * `FindOneBuilder` (`repository.builder().findOne(...)`), which each add their own terminal(s):
 * `.execute()` on both, plus `.executeAndCount()` / `.forEach()` / `.pipeline()` / `.stream()` on
 * `FindBuilder` only.
 *
 * @example
 * ```ts
 * const results = await this.builder()
 *   .find({ currency_code: 'GBP' })
 *   .forUpdate({ wait: 5 })
 *   .execute();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#builder | CDS-TS-Repository - builder}
 * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § builder
 */
class BaseFind<T, Keys> {
  protected select: SELECT<any>;
  protected columnsCalled = false;
  protected expandCalled = false;
  protected resolvedEntity: string;

  /**
   * Resolves the entity name and initializes `SELECT.from(...)`, applying `keys` as the `WHERE` when given.
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
   * Passes query-optimizer hints to the database, as individual arguments or a single array.
   * Calls `.hints(...)` on the SELECT.
   *
   * @remarks
   * Only takes effect on HANA DB — the optimizer normally picks the access path (index search vs.
   * table scan) by cost, and hints override that choice for this query; a no-op on other database
   * services. SAP HANA hints reference:
   * https://help.sap.com/docs/HANA_SERVICE_CF/7c78579ce9b14a669c1f3295b0d8ca16/4ba9edce1f2347a0b9fcda99879c17a1.html
   *
   * @param hints - Query-optimizer hint strings, passed as individual arguments or a single array.
   *
   * @example
   * ```ts
   * const results = await this.builder()
   *   .find({ currency_code: 'GBP' })
   *   .hints('IGNORE_PLAN_CACHE', 'MAX_CONCURRENCY(1)')
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#hints | CDS-TS-Repository - hints}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § hints
   */
  hints(...hints: (string | string[])[]): this {
    const flattenedHints = hints.flat(); // Flatten in case an array of strings is passed
    this.select.hints(flattenedHints as string[]);
    return this;
  }

  /**
   * Exposes the entity's CDS metadata (its `EntityElements`).
   * Reads `SELECT.elements` off the built query.
   *
   * @remarks
   * Typed as `unknown` — SAP does not currently ship typing for `EntityElements`; narrow it yourself
   * before indexing into specific fields. Accessed as a property, not called as a method.
   *
   * @returns Metadata of the fields.
   *
   * @example
   * ```ts
   * const elements = this.builder().find({ currency_code: 'GBP' }).elements;
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#elements | CDS-TS-Repository - elements}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § elements
   */
  get elements(): unknown {
    return this.select.elements;
  }

  /**
   * Exclusively locks the selected rows for the current transaction, blocking concurrent updates from
   * other transactions.
   * Calls `.forUpdate({ wait })` on the SELECT.
   *
   * @remarks
   * `wait` bounds how long to wait for the lock before failing with an error; omit it to wait
   * indefinitely. Sibling: `.forShareLock()` takes a SHARED lock instead, which still allows other
   * transactions to READ the locked rows.
   *
   * @param options - Optional locking options.
   * @param options.wait - An integer specifying the timeout after which to fail with an error in case a lock couldn't be obtained.
   * @returns The current instance of BaseFind.
   *
   * @example
   * ```ts
   * const results = await this.builder()
   *   .find({ currency_code: 'GBP' })
   *   .forUpdate({ wait: 10 })
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#forupdate | CDS-TS-Repository - forUpdate}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § forUpdate
   */
  public forUpdate(options?: { wait?: number }): this {
    void this.select.forUpdate({ wait: options?.wait });
    return this;
  }

  /**
   * Locks the selected rows with a SHARED lock, until the current transaction commits or rolls back.
   * Calls `.forShareLock()` on the SELECT.
   *
   * @remarks
   * Allows every transaction to keep READING the locked rows (unlike `.forUpdate()`'s exclusive lock);
   * waits for the lock to be released if a queried row is already exclusively locked by another
   * transaction. Sibling: `.forUpdate()` for an exclusive lock ahead of an update.
   *
   * @returns The current instance of BaseFind.
   *
   * @example
   * ```ts
   * const results = await this.builder()
   *   .find({ currency_code: 'GBP' })
   *   .forShareLock()
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#forsharelock | CDS-TS-Repository - forShareLock}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § forShareLock
   */
  public forShareLock(): this {
    void this.select.forShareLock();
    return this;
  }

  /**
   * Auto-expands every association/composition of the entity, recursively, up to `levels` deep.
   * Builds the deep-expand column projection from the entity's own metadata.
   *
   * @remarks
   * `levels` counts from `1` (the root's direct associations); the expansion stops once that depth is
   * reached. Use the array overload (`getExpand(...associations)`) for a flat, root-only expand
   * instead, or the object overload (`getExpand(associations: Expand<T>)`) to control `select` /
   * nested `expand` per association.
   *
   * @param options - Options for expanding associations.
   * @param options.levels - Depth number to expand the associations, this will do a deep expand equals to the levels number, `depth can start from 1...n`.
   * @returns The current instance of BaseFind.
   *
   * @example
   * ```ts
   * const results = await this.builder()
   *   .find({ currency_code: 'GBP' })
   *   .getExpand({ levels: 2 })
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#getexpand | CDS-TS-Repository - getExpand}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § getExpand
   */
  public getExpand(options: { levels: number }): this;

  /**
   * Deep-expands specific associations, with per-association column selection and nested expands.
   * Builds the deep-expand column projection from the given `Expand<T>` object.
   *
   * @remarks
   * An empty object (`{}`) as an association's value expands it fully; `select` restricts its
   * columns, `expand` recurses into ITS OWN associations. Passing `{}` for the WHOLE call is a silent
   * no-op (nothing gets expanded) — unlike the array overload, this one does not validate for
   * emptiness. Use the array overload (`getExpand(...associations)`) for a flat, root-only expand, or
   * the `{ levels }` overload to expand every association without listing them.
   *
   * @param associations - An object of column names to expand, representing associated entities.
   * @returns The current instance of BaseFind.
   *
   * @example
   * ```ts
   * const results = await this.builder()
   *   .find({ currency_code: 'GBP' })
   *   .getExpand({
   *     author: {}, // full expand
   *     genre: { select: ['ID', 'name'] },
   *     reviews: { select: ['ID'], expand: { reviewer: { select: ['ID'] } } },
   *   })
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#getexpand | CDS-TS-Repository - getExpand}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § getExpand
   */
  public getExpand(associations: Expand<T>): this;

  /**
   * Expands the given associations up to their first level only (no nested `select` / `expand`).
   * Builds the deep-expand column projection from the flat association-name list.
   *
   * @remarks
   * Accepts either spread arguments or a single array of names. THROWS `Error('getExpand() method
   * must have arguments !')` when called with zero associations (`.getExpand()` / `.getExpand([])`) —
   * the only overload where this is reachable through the public types. Use the object overload
   * (`getExpand(associations: Expand<T>)`) for per-association `select` / nested `expand`, or the
   * `{ levels }` overload to expand every association without listing them.
   *
   * @param associations - An array of column names to expand, representing associated entities.
   * @returns The current instance of BaseFind.
   *
   * @example
   * ```ts
   * const results = await this.builder()
   *   .find({ currency_code: 'GBP' })
   *   .getExpand('author', 'genre')
   *   // or .getExpand(['author', 'genre'])
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#getexpand | CDS-TS-Repository - getExpand}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § getExpand
   */
  public getExpand(...associations: Columns<T>[]): this;

  public getExpand(...args: any[]): this {
    this.expandCalled = true;

    const associations: any[] = Array.isArray(args[0]) ? args[0] : args;

    // Fail fast on `.getExpand()` / `.getExpand([])` before any argument inspection
    if (util.noArgs(associations)) {
      throw new Error(constants.MESSAGES.GET_EXPAND_NO_ARGS_MESSAGE);
    }

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
      if (value == null || util.noArgs(value)) {
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
