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
 * Chainable SELECT builder for a single row, obtained from `repository.builder().findOne(...)`.
 * Wraps a CDS-QL `SELECT.one.from(<Entity>)`, refined by the modifier methods below and run by
 * `.execute()`.
 *
 * @template T - The entity type being queried.
 * @template Keys - The type representing the keys or filters for the query.
 *
 * @remarks
 * Shares `.columns`, `.columnsFormatter`, `.getExpand`, `.forUpdate`, `.forShareLock`, `.hints` and
 * `.elements` with `FindBuilder` (inherited from `BaseFind`), but has no `.orderAsc` / `.orderDesc` /
 * `.groupBy` / `.having` / `.paginate` / `.distinct` — none of them are meaningful for a single row.
 * `.execute()` is the only terminal; there is no `.executeAndCount` / `.forEach` / `.pipeline` /
 * `.stream` counterpart. Use `FindBuilder` (via `repository.builder().find(...)`) when more than one
 * row is expected.
 *
 * @example
 * ```ts
 * const cheapestGbpBook = await this.builder()
 *   .findOne({ currency_code: 'GBP' })
 *   .columns('title', 'price')
 *   .execute();
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#findone-1 | CDS-TS-Repository - .findOne}
 * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § .findOne
 */
class FindOneBuilder<T, Keys> extends BaseFind<T, Keys> {
  /**
   * Instantiated internally by `repository.builder().findOne(...)` — never constructed directly.
   *
   * @param entity - The entity type or name to query.
   * @param keys - The keys or filters for the query.
   * @param externalService - The remote OData service (attached via `@ExternalService`) that `.execute()`
   * runs the query against instead of the primary database.
   */
  constructor(
    protected readonly entity: Entity,
    protected readonly keys: Keys | string | undefined,
    protected readonly externalService?: ExternalServiceProps,
  ) {
    super(entity, keys);

    this.initializeSelectOne();
  }

  /** Overrides `BaseFind`'s `SELECT.from` with `SELECT.one.from`, so the query resolves to a single row. */
  private initializeSelectOne(): void {
    const query = SELECT.one.from(this.resolvedEntity);

    if (this.keys) {
      query.where(this.keys);
    }

    this.select = query;
  }

  /**
   * Adds aggregate or renamed columns to the projection (`CONCAT`, `DAYS_BETWEEN`, a plain rename, …).
   * Appends the computed expressions to the SELECT's `.columns(...)`.
   *
   * @remarks
   * Numeric aggregates (`AVG` / `MIN` / `MAX` / `SUM` / …) are excluded from this overload — they only
   * make sense across multiple rows; use `FindBuilder`'s `.columnsFormatter()` for those. The
   * two-column form (`column1` / `column2`) is either `CONCAT` (string) or a temporal difference
   * function (`DAYS_BETWEEN` / `MONTHS_BETWEEN` / `YEARS_BETWEEN` / `SECONDS_BETWEEN`). The return
   * type appends the new, renamed columns via `AppendColumns<T, ColumnKeys>`.
   *
   * @param columns - An array of columns
   * @returns FindOneBuilder instance
   *
   * @example
   * ```ts
   * const author = await this.builder()
   *   .findOne({ ID: 101 })
   *   .columnsFormatter({
   *     column1: 'dateOfBirth',
   *     column2: 'dateOfDeath',
   *     aggregate: 'YEARS_BETWEEN',
   *     renameAs: 'yearsLived',
   *   })
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#columnsformatter-1 | CDS-TS-Repository - columnsFormatter}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § columnsFormatter
   */
  public columnsFormatter<const ColumnKeys extends ColumnFormatter<T, 'FIND_ONE'>>(
    ...columns: ColumnKeys
  ): FindOneBuilder<AppendColumns<T, ColumnKeys>, string | Keys> {
    const aggregateColumns = findUtils.columnUtils.buildAggregateColumns<T, ColumnKeys>(...columns);

    void this.select.columns(...aggregateColumns);

    return this as FindOneBuilder<AppendColumns<T, ColumnKeys>, string | Keys>;
  }

  /**
   * Restricts the projection to the given columns, the SQL `SELECT <columns>` counterpart.
   * Appends the column names to the SELECT's `.columns(...)`.
   *
   * @remarks
   * Accepts either spread arguments or a single array; narrows the resolved row type to
   * `Pick<T, ShowOnlyColumns<T, ColumnKeys>>`. Same ordering gotcha as `FindBuilder.columns()`: when
   * called AFTER `.getExpand()`, duplicate simple refs for already-expanded associations are dropped
   * automatically.
   *
   * @param columns - An array of column names to retrieve.
   * @returns FindOneBuilder instance
   *
   * @example
   * ```ts
   * const oneBook = await this.builder()
   *   .findOne({ currency_code: 'GBP' })
   *   .columns('title', 'currency_code')
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#columns-1 | CDS-TS-Repository - columns}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § columns
   */
  public columns<ColumnKeys extends Columns<T>>(
    ...columns: ColumnKeys[]
  ): FindOneBuilder<Pick<T, ShowOnlyColumns<T, ColumnKeys>>, string | Keys> {
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

    return this as FindOneBuilder<Pick<T, ShowOnlyColumns<T, ColumnKeys>>, string | Keys>;
  }

  /**
   * Runs the built `SELECT.one` and returns the matching row, or `undefined` when none matches.
   * Executes the SELECT directly against the primary datasource, or via the attached external
   * service's `run(query)`.
   *
   * @remarks
   * The only terminal on this builder — there is no `.executeAndCount` / `.forEach` / `.pipeline` /
   * `.stream` counterpart, since those require more than one row; use `FindBuilder` for those. Call it
   * last in the chain, after every modifier.
   *
   * @returns A promise that resolves to the single entity result.
   *
   * @example
   * ```ts
   * const oneBook = await this.builder()
   *   .findOne({ currency_code: 'GBP' })
   *   .getExpand('reviews')
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#execute-1 | CDS-TS-Repository - execute}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § execute
   */
  public async execute(): Promise<T | undefined> {
    if (this.externalService) {
      return await this.externalService.run(this.select);
    }

    return await this.select;
  }
}

export default FindOneBuilder;
