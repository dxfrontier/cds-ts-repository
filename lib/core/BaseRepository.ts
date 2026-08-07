import { CoreRepository } from './CoreRepository';
import type {
  Columns,
  Entries,
  Entry,
  Locale,
  ShowOnlyColumns,
  FindReturn,
  Entity,
  ExtractSingular,
  BaseRepositoryConstructor,
  InsertResult,
  NumericKeys,
  IncrementFields,
} from '../types/types';
import type { Filter } from '../util/filter/Filter';
import util from '../util/util';

/**
 * Typed data-access layer over CDS-QL (`SELECT` / `INSERT` / `UPDATE` / `UPSERT` / `DELETE`) for ONE CAP entity.
 * `T` is a cds-typer entity type — plural types (`Books`) are accepted and narrowed to their singular by
 * `ExtractSingular`.
 *
 * @template T - The type of the entity, a cds-typer singular or plural type.
 *
 * @remarks
 * Mental model — read this before calling anything:
 * - Subclass it once per entity and hand the cds-typer entity to `super(...)`; EVERY method then targets that entity.
 * - Draft counterpart: `BaseRepositoryDraft` — the same operations, `*Draft`-suffixed, against the drafts table.
 *   Combine both with `class X extends Mixin(BaseRepository<T>, BaseRepositoryDraft<T>)` (`Mixin` is re-exported by
 *   this package).
 * - `.builder()` opens the chainable query API (`columns`, `columnsFormatter`, `getExpand`, `orderAsc`, `paginate`,
 *   `execute`, the streaming terminals …) for everything the plain methods cannot express.
 * - `Filter<T>` is accepted in place of a plain keys object by `find`, `countWhere`, `updateMany`, `deleteWhere`,
 *   `incrementMany`, `decrementMany` and `.builder().find(...)`; a plain keys object is an `AND`-ed equality match.
 * - Decorating the subclass with `@ExternalService('NAME')` reroutes EVERY method to that remote OData service
 *   instead of the primary database; the methods that cannot run remotely say so in their own `@remarks`.
 * - Escape convention of the examples in this package: a decorator shown at line start inside an example is written
 *   with a leading slash — drop the leading slash when copying.
 *
 * @example
 * ```ts
 * import { BaseRepository } from '@dxfrontier/cds-ts-repository';
 * import { Books } from '#cds-models/CatalogService';
 *
 * export class BookRepository extends BaseRepository<Books> {
 *   constructor() {
 *     super(Books);
 *   }
 *
 *   public async soldOut() {
 *     return await this.find({ stock: 0 });
 *   }
 * }
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#usage | CDS-TS-Repository - BaseRepository}
 * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § Usage
 */
abstract class BaseRepository<T> {
  protected readonly coreRepository: CoreRepository<ExtractSingular<T>>;

  /**
   * Binds the repository to ONE cds-typer entity — call it as `super(Books)` from the subclass constructor.
   * When the subclass carries `@ExternalService('NAME')`, the entity is re-resolved from that service's entity set
   * and every query of this repository is routed there — construction order does not matter, a connection still in
   * flight is awaited on the first call instead.
   *
   * @param entity - The entity this repository manages.
   */
  constructor(protected readonly entity: Entity) {
    const constructor = this.constructor as BaseRepositoryConstructor;

    // The connected service is already on the class : the entity is swapped right away.
    if (constructor.externalService) {
      this.entity = util.findExternalServiceEntity(this.entity, constructor.externalService);
      this.coreRepository = new CoreRepository(this.entity, constructor.externalService);

      return;
    }

    // `@ExternalService` applied, connection still pending : the ORIGINAL entity is kept and re-resolved
    // together with the service on the first repository call.
    if (constructor.externalServiceName !== undefined && constructor.externalServicePromise !== undefined) {
      this.coreRepository = new CoreRepository(this.entity, {
        name: constructor.externalServiceName,
        promise: constructor.externalServicePromise,
      });

      return;
    }

    this.coreRepository = new CoreRepository(this.entity);
  }

  /**
   * Inserts a single entry into the table.
   * Executes `INSERT.into(<Entity>).entries(entry)`.
   *
   * @remarks
   * Deep inserts are supported — a nested composition array inside `entry` is written together with the root row.
   * The resolved value is an `InsertResult`, NOT the created row: read the written payload from
   * `result.query.INSERT.entries`, or re-read it with `findOne` when database-generated values are needed. Use
   * `createMany` for several entries, `updateOrCreate` when the row may already exist and `findOrCreate` when it must
   * be inserted ONLY if missing. Draft counterpart: `createDraft`.
   * Bound to an external service via `@ExternalService`, the insert runs remotely and the single row returned by the
   * service is wrapped into the same `InsertResult` shape.
   *
   * @param entry - An object representing the entry to be created.
   * @returns A promise that resolves to the `InsertResult` of the insert, not to the created row.
   *
   * @example
   * ```ts
   * const created = await this.create({
   *   ID: 1001,
   *   title: 'Wuthering Heights',
   *   stock: 12,
   *   currency_code: 'GBP',
   * });
   *
   * const [book] = created.query.INSERT.entries;
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#create | CDS-TS-Repository - create}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § create
   */
  public async create(entry: Entry<ExtractSingular<T>>): Promise<InsertResult<T>> {
    return await this.coreRepository.create(entry);
  }

  /**
   * Inserts multiple entries into the table with ONE statement.
   * Executes `INSERT.into(<Entity>).entries(...entries)`.
   *
   * @remarks
   * Accepts either a spread of objects (`createMany(a, b)`) or a single array (`createMany([a, b])`). The resolved
   * value is an `InsertResult`, NOT the created rows: read them from `result.query.INSERT.entries`. Use `create` for
   * a single entry and `updateOrCreate` when some of the rows may already exist. Draft counterpart:
   * `createManyDrafts`.
   * Bound to an external service via `@ExternalService`, the entries are NOT batched: one `INSERT` per entry is sent
   * sequentially and the returned rows are collected into the same `InsertResult` shape.
   *
   * @param entries - The entries to be created, passed as a spread of objects or as a single array.
   * @returns A promise that resolves to the `InsertResult` of the insert, not to the created rows.
   *
   * @example
   * ```ts
   * const created = await this.createMany(
   *   { ID: 1001, title: 'Wuthering Heights', stock: 12 },
   *   { ID: 1002, title: 'Jane Eyre', stock: 7 },
   * );
   * // or: await this.createMany([{ ID: 1001, ... }, { ID: 1002, ... }]);
   *
   * const insertedCount = created.query.INSERT.entries.length;
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#createmany | CDS-TS-Repository - createMany}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § createMany
   */
  public async createMany(...entries: Entries<ExtractSingular<T>>[]): Promise<InsertResult<T>> {
    return await this.coreRepository.createMany(...entries);
  }

  /**
   * Retrieves every entry of the table.
   * Executes `SELECT.from(<Entity>)`.
   *
   * @remarks
   * Reads the FULL table — no filter, no projection, no limit. Prefer `paginate` on large tables, `find` when a
   * filter applies and `.builder().find()` when columns, expands or ordering are needed. CDS-QL resolves an empty
   * table to an empty array, so the `undefined` of the return type is defensive: narrow with `results?.length`
   * rather than a plain truthiness check. Draft counterpart: `getAllDrafts`.
   *
   * @returns A promise that resolves to every entry of the table, an empty array on an empty table.
   *
   * @example
   * ```ts
   * const books = await this.getAll();
   *
   * if (books?.length) {
   *   // ...
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#getall | CDS-TS-Repository - getAll}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § getAll
   */
  public async getAll(): Promise<ExtractSingular<T>[] | undefined> {
    return await this.coreRepository.getAll();
  }

  /**
   * Retrieves the distinct value combinations of the given columns.
   * Executes `SELECT.distinct.from(<Entity>).columns(...columns)`.
   *
   * @remarks
   * Accepts either a spread of column names or a single array, and the resolved rows carry ONLY the requested
   * columns — the projection is narrowed on the type level too. Distinctness applies to the COMBINATION of all
   * listed columns, not to each column separately. Bound to an external service via `@ExternalService`, `DISTINCT`
   * is not issued: the same columns are grouped instead (`SELECT.from(<Entity>).columns(...).groupBy(...)`). Draft
   * counterpart: `getDraftsDistinctColumns`.
   *
   * @param columns - The column names to retrieve distinct entries for, passed as a spread or as a single array.
   * @returns A promise that resolves to the distinct value combinations, narrowed to the requested columns.
   *
   * @example
   * ```ts
   * const combinations = await this.getDistinctColumns('currency_code', 'genre_ID');
   * // or: await this.getDistinctColumns(['currency_code', 'genre_ID']);
   *
   * const firstCurrency = combinations?.[0].currency_code;
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#getdistinctcolumns | CDS-TS-Repository - getDistinctColumns}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § getDistinctColumns
   */
  public async getDistinctColumns<ColumnKeys extends Columns<ExtractSingular<T>>>(
    ...columns: ColumnKeys[]
  ): Promise<Pick<ExtractSingular<T>, ShowOnlyColumns<ExtractSingular<T>, ColumnKeys>>[] | undefined> {
    return await this.coreRepository.getDistinctColumns(...columns);
  }

  /**
   * Retrieves one page of entries.
   * Executes `SELECT.from(<Entity>).limit(limit)`, or `.limit(limit, skip)` when `skip` is supplied.
   *
   * @remarks
   * `skip` is optional and defaults to no offset. The rows are NOT ordered explicitly, so pages are only stable when
   * the database happens to be — chain `.builder().find().orderAsc(...).paginate(...)` when the sequence matters.
   * An exhausted page resolves to an empty array, not to `undefined`. Draft counterpart: `paginateDrafts`.
   *
   * @param options - The pagination options.
   * @param options.limit - The limit for the result set.
   * @param options.skip - Optional 'skip', which skips a number of items before the page starts (default: 0).
   * @returns A promise that resolves to one page of entries, an empty array when the page is exhausted.
   *
   * @example
   * ```ts
   * const firstPage = await this.paginate({ limit: 10 });
   * const secondPage = await this.paginate({ limit: 10, skip: 10 });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#paginate | CDS-TS-Repository - paginate}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § paginate
   */
  public async paginate(options: {
    limit: number;
    skip?: number | undefined;
  }): Promise<ExtractSingular<T>[] | undefined> {
    return await this.coreRepository.paginate(options);
  }

  /**
   * Retrieves the translated texts of the entity from its `.texts` sibling table.
   * Executes ``SELECT.from(`<Entity>.texts`).columns(...columns, 'locale')``.
   *
   * @remarks
   * Reads the `.texts` table CDS generates for `localized` elements, NOT the entity itself — only localized columns
   * and the keys are available there. The `locale` column is ALWAYS added to the projection, so every row is typed
   * as the picked columns plus `locale`. Throws an `Error` when the repository is bound to an external service via
   * `@ExternalService`. Write the same texts back with `updateLocaleTexts`.
   *
   * @param columns - The localized column names to retrieve, passed as a spread or as a single array.
   * @returns A promise that resolves to the rows of the `.texts` table, typed as the picked columns plus `locale`.
   *
   * @example
   * ```ts
   * const texts = await this.getLocaleTexts('title', 'descr');
   * // or: await this.getLocaleTexts(['title', 'descr']);
   *
   * const german = texts?.filter((text) => text.locale === 'de');
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#getlocaletexts | CDS-TS-Repository - getLocaleTexts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § getLocaleTexts
   */
  public async getLocaleTexts<ColumnKeys extends Columns<ExtractSingular<T>>>(...columns: ColumnKeys[]) {
    return await this.coreRepository.getLocaleTexts(...columns);
  }

  /**
   * Retrieves every entry of the table.
   * Executes `SELECT.from(<Entity>)` without a `where` clause.
   *
   * @remarks
   * The argument-less overload is equivalent to `getAll` — pass keys or a `Filter` to narrow the result set. Use
   * `findOne` when a single row is expected and `.builder().find()` when columns, expands, ordering or pagination
   * are needed. Resolves to an empty array on an empty table, so the `undefined` of the return type is defensive.
   * Draft counterpart: `findDrafts`.
   *
   * @returns A promise that resolves to every entry of the table, an empty array on an empty table.
   *
   * @example
   * ```ts
   * const books = await this.find();
   * const total = books?.length ?? 0;
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#find | CDS-TS-Repository - find}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § find
   */
  public async find(): Promise<ExtractSingular<T>[] | undefined>;

  /**
   * Finds every entry matching the given keys.
   * Executes `SELECT.from(<Entity>).where(keys)`.
   *
   * @remarks
   * A keys object is an `AND`-combined equality match over the listed columns — switch to the `Filter` overload for
   * `LIKE`, `IN`, `BETWEEN`, ranges, association paths or `OR` combinations. Keys that match nothing resolve to an
   * empty array, NOT to `undefined` and never to an error. Use `findOne` when at most one row is expected. Draft
   * counterpart: `findDrafts`.
   *
   * @param keys - An object representing the keys to filter the entries.
   * @returns A promise that resolves to the matching entries, an empty array when nothing matches.
   *
   * @example
   * ```ts
   * const soldOutBritish = await this.find({ stock: 0, currency_code: 'GBP' });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#find | CDS-TS-Repository - find}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § find
   */
  public async find(keys: Entry<ExtractSingular<T>>): Promise<ExtractSingular<T>[] | undefined>;

  /**
   * Finds every entry matching the given `Filter` tree.
   * Executes `SELECT.from(<Entity>).where(<filter expression>)`.
   *
   * @remarks
   * `Filter` expresses everything a keys object cannot: comparison operators, `LIKE` / `STARTS_WITH` / `IN` /
   * `BETWEEN` / `EXISTS`, one-hop association paths (`'author.name'`) and nested `'AND'` / `'OR'` combinations. The
   * very same instance can be handed to `countWhere`, `updateMany`, `deleteWhere` and `.builder().find(...)`. Draft
   * counterpart: `findDrafts`.
   *
   * @param filter - A `Filter` instance describing the where clause.
   * @returns A promise that resolves to the matching entries, an empty array when nothing matches.
   *
   * @example
   * ```ts
   * import { BaseRepository, Filter } from '@dxfrontier/cds-ts-repository';
   *
   * const lowStock = new Filter<Books>({ field: 'stock', operator: 'LESS THAN', value: 10 });
   * const books = await this.find(lowStock);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#find | CDS-TS-Repository - find}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § find
   */
  public async find(filter: Filter<ExtractSingular<T>>): Promise<ExtractSingular<T>[] | undefined>;

  public async find(
    keys?: Entry<ExtractSingular<T>> | Filter<ExtractSingular<T>>,
  ): Promise<ExtractSingular<T>[] | undefined> {
    return await this.coreRepository.find(keys);
  }

  /**
   * Finds the single entry matching the given keys.
   * Executes `SELECT.one.from(<Entity>).where(keys)`.
   *
   * @remarks
   * Resolves to `undefined` when nothing matches, unlike `find`, which resolves to an empty array. When several rows
   * match, the database picks one without a defined order — make the choice explicit with `findFirst` / `findLast`,
   * or read them all with `find`. Use `findOrCreate` when a miss should insert the row. Draft counterpart:
   * `findOneDraft`.
   *
   * @param keys - An object representing the keys to filter the record.
   * @returns A promise that resolves to the single matching entry, or `undefined` when nothing matches.
   *
   * @example
   * ```ts
   * const book = await this.findOne({ ID: 201 });
   *
   * if (book) {
   *   // ...
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#findone | CDS-TS-Repository - findOne}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § findOne
   */
  public async findOne(keys: Entry<ExtractSingular<T>>): Promise<ExtractSingular<T> | undefined> {
    return await this.coreRepository.findOne(keys);
  }

  /**
   * Updates a single entry ONLY when it exists.
   * Executes `UPDATE.entity(<Entity>).where(keys).set(fieldsToUpdate)` — on an external service, a
   * `SELECT.one.from(<Entity>).where(keys)` probe first.
   *
   * @remarks
   * Resolves to `false` when no row matched the keys, and to `true` ONLY when exactly one row was updated. Against
   * the primary database this is ONE atomic `UPDATE`: no probe first, a miss simply affects 0 rows — behaviorally
   * identical to `update`, the method earns its name on an external service. Bound to an external service via
   * `@ExternalService` it stays a SELECT-then-UPDATE probe — two round trips, NOT locked against each other, because
   * a remote by-key `UPDATE` throws on a miss instead of affecting 0 rows — wrap that call in a CDS transaction when
   * a concurrent write would be harmful. `fieldsToUpdate` is a partial patch: omitted columns keep their value. Use
   * `updateMany` to patch every matching row. Draft counterpart: `findOneDraftAndUpdate`.
   *
   * @param keys - The keys to find the entity.
   * @param fieldsToUpdate - The fields to update on the found entity.
   * @returns A promise that resolves to `true` when exactly one row was updated, `false` otherwise.
   *
   * @example
   * ```ts
   * const wasUpdated = await this.findOneAndUpdate({ ID: 201 }, { title: 'Wuthering Heights', stock: 12 });
   *
   * if (!wasUpdated) {
   *   // the book does not exist (or more than one row matched)
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#findoneandupdate | CDS-TS-Repository - findOneAndUpdate}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § findOneAndUpdate
   */
  public async findOneAndUpdate(
    keys: Entry<ExtractSingular<T>>,
    fieldsToUpdate: Entry<ExtractSingular<T>>,
  ): Promise<boolean> {
    return await this.coreRepository.findOneAndUpdate(keys, fieldsToUpdate);
  }

  /**
   * Opens the chainable query API of this entity.
   * Returns a `FindReturn` whose `find(...)` / `findOne(...)` start a `FindBuilder` / `FindOneBuilder`.
   *
   * @remarks
   * NOTHING is sent to the database until a terminal is called — `execute`, `executeAndCount`, `forEach`, `pipeline`
   * or `stream`. Reach for it whenever the plain methods are not expressive enough: `columns`, `columnsFormatter`,
   * `getExpand`, `orderAsc` / `orderDesc`, `groupBy` / `having`, `distinct`, `paginate`, `forUpdate` /
   * `forShareLock` and `hints`. Both `find(...)` and `findOne(...)` take a keys object or a `Filter`, exactly like
   * `find` / `findOne`. Draft counterpart: `builderDraft`.
   *
   * @returns An instance of `FindReturn` whose `find(...)` / `findOne(...)` open the chainable query builder.
   *
   * @example
   * ```ts
   * const books = await this.builder()
   *   .find({ currency_code: 'GBP' })
   *   .columns('title', 'stock')
   *   .orderAsc('title')
   *   .paginate({ limit: 10 })
   *   .execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#builder | CDS-TS-Repository - builder}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § builder
   */
  public builder(): FindReturn<ExtractSingular<T>> {
    return this.coreRepository.builder();
  }

  /**
   * Updates the entry matching the given keys.
   * Executes `UPDATE.entity(<Entity>).where(keys).set(fieldsToUpdate)`.
   *
   * @remarks
   * Resolves to `true` ONLY when exactly one row was affected: keys matching several rows update them all and STILL
   * resolve to `false` — use `updateMany`, which returns the affected-row count. Nothing is read first, so keys
   * matching no row resolve to `false` without an error — `findOneAndUpdate` behaves identically on the primary
   * database and only probes existence first on an external service; insert the missing row with `updateOrCreate`
   * instead. `fieldsToUpdate` is a partial patch: omitted columns keep their
   * value. Draft counterpart: `updateDraft`.
   *
   * @param keys - An object representing the keys to filter the entries.
   * @param fieldsToUpdate - An object representing the fields and their updated values for the matching entries.
   * @returns A promise that resolves to `true` when exactly one row was affected, `false` otherwise.
   *
   * @example
   * ```ts
   * const updated = await this.update({ ID: 201 }, { title: 'a new title', stock: 42 });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#update | CDS-TS-Repository - update}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § update
   */
  public async update(keys: Entry<ExtractSingular<T>>, fieldsToUpdate: Entry<ExtractSingular<T>>): Promise<boolean> {
    return await this.coreRepository.update(keys, fieldsToUpdate);
  }

  /**
   * Inserts the entries that do not exist yet and updates those that do (SQL `UPSERT`).
   * Executes `UPSERT.into(<Entity>).entries(...entries)`.
   *
   * @remarks
   * EVERY entry MUST carry the full primary key — CDS decides insert vs update by it. Accepts a spread of objects or
   * a single array, and resolves to `true` when AT LEAST one row was affected, so a partially applied batch is not
   * distinguishable from a fully applied one; use `update` for a targeted patch and `findOrCreate` when an existing
   * row must stay untouched. Throws an `Error` when the repository is bound to an external service via
   * `@ExternalService` — use `update` there instead. Draft counterpart: `updateOrCreateDraft`.
   *
   * @param entries - The entries to be created or updated, passed as a spread of objects or as a single array.
   * @returns A promise that resolves to `true` when at least one row was affected, `false` otherwise.
   *
   * @example
   * ```ts
   * const upserted = await this.updateOrCreate(
   *   { ID: 1001, title: 'Wuthering Heights', stock: 12 },
   *   { ID: 1002, title: 'Jane Eyre', stock: 7 },
   * );
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#updateorcreate | CDS-TS-Repository - updateOrCreate}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § updateOrCreate
   */
  public async updateOrCreate(...entries: Entries<ExtractSingular<T>>[]): Promise<boolean> {
    return await this.coreRepository.updateOrCreate(...entries);
  }

  /**
   * Updates the translated texts of one language in the entity's `.texts` sibling table.
   * Executes ``UPDATE.entity(`<Entity>.texts`).with(fieldsToUpdate).where(localeCodeKeys)``.
   *
   * @remarks
   * The `locale` code (`'de'`, `'fr'`, …) is part of the key: next to the entity keys it selects WHICH language row
   * of `.texts` is patched. Resolves to `true` ONLY when exactly one row was affected, and a language that has no
   * row in `.texts` yet is NOT created — an `UPDATE` never inserts. The active table stays untouched: patch the
   * default-language values with `update`. Throws an `Error` when the repository is bound to an external service via
   * `@ExternalService`, same as `getLocaleTexts` — which reads the same texts back.
   *
   * @param localeCodeKeys - An object representing the language code and the keys to filter the entries.
   * @param fieldsToUpdate - An object representing the fields and their updated values for the matching entries.
   * @returns A promise that resolves to `true` when exactly one row was affected, `false` otherwise.
   * @throws {Error} - When an external service is attached via `@ExternalService` - the `.texts` entity set does not
   * exist remotely, so this is not supported the way the active `update` is.
   *
   * @example
   * ```ts
   * const updated = await this.updateLocaleTexts({ locale: 'de', ID: 201 }, { title: 'Sturmhöhe' });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#updatelocaletexts | CDS-TS-Repository - updateLocaleTexts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § updateLocaleTexts
   */
  public async updateLocaleTexts(
    localeCodeKeys: Entry<ExtractSingular<T>> & Locale,
    fieldsToUpdate: Entry<ExtractSingular<T>>,
  ): Promise<boolean> {
    return await this.coreRepository.updateLocaleTexts(localeCodeKeys, fieldsToUpdate);
  }

  /**
   * Deletes the entry matching the given keys.
   * Executes `DELETE.from(<Entity>).where(keys)`.
   *
   * @remarks
   * Resolves to `true` ONLY when exactly one row was deleted: keys matching several rows delete them all and STILL
   * resolve to `false` — use `deleteWhere`, which returns the deleted-row count. Keys matching no row resolve to
   * `false` without an error. Use `deleteMany` for a list of key objects and `deleteAll` to empty the table. Draft
   * counterpart: `deleteDraft`.
   *
   * @param keys - An object representing the keys to filter the entries.
   * @returns A promise that resolves to `true` when exactly one row was deleted, `false` otherwise.
   *
   * @example
   * ```ts
   * const deleted = await this.delete({ ID: 201 });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#delete | CDS-TS-Repository - delete}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § delete
   */
  public async delete(keys: Entry<ExtractSingular<T>>): Promise<boolean> {
    return await this.coreRepository.delete(keys);
  }

  /**
   * Deletes several entries, one `DELETE` per key object.
   * Executes `DELETE.from(<Entity>).where(entry)` for EVERY entry, all statements issued concurrently.
   *
   * @remarks
   * Accepts a spread of key objects (`deleteMany(a, b)`) or a single array (`deleteMany([a, b])`). Resolves to `true`
   * ONLY when EVERY single delete affected exactly one row — one key matching nothing turns the whole call `false`
   * even though the other deletes have already been executed. An EMPTY list of entries resolves to `true` too (a
   * vacuous success — there is nothing to delete). Use `deleteWhere` to remove a whole matching set with one
   * statement and get the count back. Draft counterpart: `deleteManyDrafts`.
   *
   * @param entries - The key objects of the entries to be deleted, passed as a spread or as a single array.
   * @returns A promise that resolves to `true` when every single delete affected exactly one row, `false` otherwise.
   *
   * @example
   * ```ts
   * const deleted = await this.deleteMany([{ ID: 201 }, { ID: 252 }]);
   * // or: await this.deleteMany({ ID: 201 }, { ID: 252 });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#deletemany | CDS-TS-Repository - deleteMany}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § deleteMany
   */
  public async deleteMany(...entries: Entries<ExtractSingular<T>>[]): Promise<boolean> {
    return await this.coreRepository.deleteMany(...entries);
  }

  /**
   * Deletes every entry of the table while keeping the table itself.
   * Executes `DELETE.from(<Entity>)` without a `where` clause.
   *
   * @remarks
   * Resolves to `true` when at least one row was deleted, so emptying an ALREADY empty table resolves to `false` —
   * except on an external service answering a 204-style success without an affected count (`''`), which resolves to
   * `true` regardless. There is no filter and no confirmation step — scope the deletion with `deleteWhere` or
   * `deleteMany` whenever only a subset must go. Draft counterpart: `deleteAllDrafts`.
   *
   * @returns A promise that resolves to `true` when at least one row was deleted, `false` otherwise.
   *
   * @example
   * ```ts
   * const deleted = await this.deleteAll();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#deleteall | CDS-TS-Repository - deleteAll}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § deleteAll
   */
  public async deleteAll(): Promise<boolean> {
    return await this.coreRepository.deleteAll();
  }

  /**
   * Checks whether at least one entry matches the given keys.
   * Executes `SELECT.one.from(<Entity>).columns('count(*) as total').where(keys)`.
   *
   * @remarks
   * Answers with a single `count(*)` aggregate row — the matching rows are NOT materialized, which makes it cheaper
   * than `findOne` whenever the row itself is not needed. Use `countWhere` when the number of matches matters. Bound
   * to an external service via `@ExternalService`, the aggregate is NOT used: the matching rows are fetched and
   * their length is checked. Draft counterpart: `existsDraft`.
   *
   * @param keys - An object representing the keys to filter the entries.
   * @returns A promise that resolves to `true` if the item exists, `false` otherwise.
   *
   * @example
   * ```ts
   * if (await this.exists({ ID: 201 })) {
   *   // ...
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#exists | CDS-TS-Repository - exists}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § exists
   */
  public async exists(keys: Entry<ExtractSingular<T>>): Promise<boolean> {
    return await this.coreRepository.exists(keys);
  }

  /**
   * Counts every entry of the table.
   * Executes `SELECT.one.from(<Entity>).columns('count(*) as total')`.
   *
   * @remarks
   * Lets the database compute the aggregate instead of loading rows, and ALWAYS resolves to a number — `0` on an
   * empty table, never `undefined`. Use `countWhere` to count a subset and `exists` when only the yes/no answer is
   * needed. Bound to an external service via `@ExternalService`, every row is fetched and its length returned
   * instead. Draft counterpart: `countDrafts`.
   *
   * @returns A promise that resolves to the count of entries, `0` on an empty table.
   *
   * @example
   * ```ts
   * const numberOfBooks = await this.count();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#count | CDS-TS-Repository - count}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § count
   */
  public async count(): Promise<number> {
    return await this.coreRepository.count();
  }

  /**
   * Retrieves the first entry when the table is ordered ascending by the given column.
   * Executes ``SELECT.one.from(<Entity>).orderBy(`<column> asc`)``.
   *
   * @remarks
   * The column ONLY defines the order — it neither filters nor narrows the projection, the whole row is returned, or
   * `undefined` on an empty table. `findLast` is the descending twin. There is no keys or `Filter` parameter: order
   * a filtered set with `.builder().find(...).orderAsc(...)` instead. Draft counterpart: `findFirstDraft`.
   *
   * @param column - The column to order by.
   * @returns A promise that resolves to the first entry, or `undefined` on an empty table.
   *
   * @example
   * ```ts
   * const oldestBook = await this.findFirst('createdAt');
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#findfirst | CDS-TS-Repository - findFirst}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § findFirst
   */
  public async findFirst<ColumnKeys extends keyof ExtractSingular<T>>(
    column: ColumnKeys,
  ): Promise<ExtractSingular<T> | undefined> {
    return await this.coreRepository.findFirst(column);
  }

  /**
   * Retrieves the last entry when the table is ordered ascending by the given column.
   * Executes ``SELECT.one.from(<Entity>).orderBy(`<column> desc`)``.
   *
   * @remarks
   * The descending twin of `findFirst`: the column ONLY defines the order, the whole row is returned, or `undefined`
   * on an empty table. `NULL` values sort wherever the database puts them, so a nullable column gives a
   * database-dependent answer. There is no keys or `Filter` parameter: order a filtered set with
   * `.builder().find(...).orderDesc(...)` instead. Draft counterpart: `findLastDraft`.
   *
   * @param column - The column to order by.
   * @returns A promise that resolves to the last entry, or `undefined` on an empty table.
   *
   * @example
   * ```ts
   * const newestBook = await this.findLast('createdAt');
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#findlast | CDS-TS-Repository - findLast}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § findLast
   */
  public async findLast<ColumnKeys extends keyof ExtractSingular<T>>(
    column: ColumnKeys,
  ): Promise<ExtractSingular<T> | undefined> {
    return await this.coreRepository.findLast(column);
  }

  /**
   * Returns the entry matching the given keys, inserting `{ ...keys, ...defaults }` when there is none.
   * Executes `SELECT.one.from(<Entity>).where(keys)` and, on a miss, `INSERT.into(<Entity>).entries(...)` plus a
   * re-read of the inserted row.
   *
   * @remarks
   * `created` separates the two paths: `false` when an existing row was returned untouched, `true` when a row was
   * inserted — an existing row is NEVER patched, use `updateOrCreate` to write in both cases. `defaults` is spread
   * AFTER `keys`, so a column present in both takes its value from `defaults`. Because the insert is followed by a
   * re-read, `entry` carries the database-generated values as well. The read and the insert are two round trips and
   * are NOT locked against each other. Draft counterpart: `findOrCreateDraft`.
   *
   * @param keys - An object representing the keys to find the entry.
   * @param defaults - An object representing the default values for the new entry if not found.
   * @returns A promise that resolves to an object containing the entry and a boolean indicating if it was created.
   *
   * @example
   * ```ts
   * const { created, entry } = await this.findOrCreate({ ID: 1001 }, { title: 'Wuthering Heights', stock: 12 });
   *
   * if (created) {
   *   // ...
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#findorcreate | CDS-TS-Repository - findOrCreate}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § findOrCreate
   */
  public async findOrCreate(
    keys: Entry<ExtractSingular<T>>,
    defaults: Entry<ExtractSingular<T>>,
  ): Promise<{ created: boolean; entry: ExtractSingular<T> }> {
    return await this.coreRepository.findOrCreate(keys, defaults);
  }

  /**
   * Counts the entries matching the given keys.
   * Executes `SELECT.one.from(<Entity>).columns('count(*) as total').where(keys)`.
   *
   * @remarks
   * Keys are an `AND`-combined equality match; take the `Filter` overload for anything else. ALWAYS resolves to a
   * number — `0` when nothing matches, never `undefined`. Cheaper than `(await this.find(keys))?.length` because no
   * row is materialized, and more informative than `exists` when the amount matters. Draft counterpart:
   * `countDraftsWhere`.
   *
   * @param keys - An object representing the keys to filter the entries.
   * @returns A promise that resolves to the count of matching entries, `0` when nothing matches.
   *
   * @example
   * ```ts
   * const soldOut = await this.countWhere({ stock: 0 });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#countwhere | CDS-TS-Repository - countWhere}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § countWhere
   */
  public async countWhere(keys: Entry<ExtractSingular<T>>): Promise<number>;

  /**
   * Counts the entries matching the given `Filter` tree.
   * Executes `SELECT.one.from(<Entity>).columns('count(*) as total').where(<filter expression>)`.
   *
   * @remarks
   * Takes the same `Filter` instance as `find`, `updateMany` and `deleteWhere` — build it once and reuse it to size
   * a set before writing to it. ALWAYS resolves to a number, `0` when nothing matches. Bound to an external service
   * via `@ExternalService`, the matching rows are fetched and counted in memory instead. Draft counterpart:
   * `countDraftsWhere`.
   *
   * @param filter - A `Filter` instance describing the where clause.
   * @returns A promise that resolves to the count of matching entries, `0` when nothing matches.
   *
   * @example
   * ```ts
   * const expensive = new Filter<Books>({ field: 'price', operator: 'GREATER THAN', value: 100 });
   * const numberOfExpensiveBooks = await this.countWhere(expensive);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#countwhere | CDS-TS-Repository - countWhere}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § countWhere
   */
  public async countWhere(filter: Filter<ExtractSingular<T>>): Promise<number>;

  public async countWhere(keys?: Entry<ExtractSingular<T>> | Filter<ExtractSingular<T>>): Promise<number> {
    return await this.coreRepository.countWhere(keys);
  }

  /**
   * Updates EVERY entry matching the given keys and reports how many were affected.
   * Executes `UPDATE.entity(<Entity>).set(fieldsToUpdate).where(keys)`.
   *
   * @remarks
   * The bulk twin of `update`: one statement for all matching rows, resolving to the affected-row count instead of a
   * boolean — `0` when nothing matched, which is the only way to detect a no-op. `fieldsToUpdate` is a partial
   * patch, omitted columns keep their value; use `incrementMany` / `decrementMany` when a numeric column must change
   * relative to its current value. Draft counterpart: `updateManyDrafts`.
   *
   * @param keys - An object representing the keys to filter the entries.
   * @param fieldsToUpdate - An object representing the fields and their updated values.
   * @returns A promise that resolves to the number of updated entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * const updatedCount = await this.updateMany({ currency_code: 'GBP' }, { currency_code: 'EUR' });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#updatemany | CDS-TS-Repository - updateMany}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § updateMany
   */
  public async updateMany(keys: Entry<ExtractSingular<T>>, fieldsToUpdate: Entry<ExtractSingular<T>>): Promise<number>;

  /**
   * Updates EVERY entry matching the given `Filter` tree and reports how many were affected.
   * Executes `UPDATE.entity(<Entity>).set(fieldsToUpdate).where(<filter expression>)`.
   *
   * @remarks
   * Reaches the rows a keys object cannot address — ranges, `LIKE`, `IN`, association paths, `'OR'` combinations —
   * with a single statement, resolving to the affected-row count (`0` when nothing matched). Count the set first
   * with the same `Filter` via `countWhere` when the write must be previewed. Draft counterpart: `updateManyDrafts`.
   *
   * @param filter - A `Filter` instance describing the where clause.
   * @param fieldsToUpdate - An object representing the fields and their updated values.
   * @returns A promise that resolves to the number of updated entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * const lowStock = new Filter<Books>({ field: 'stock', operator: 'LESS THAN', value: 5 });
   * const updatedCount = await this.updateMany(lowStock, { isAvailable: false });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#updatemany | CDS-TS-Repository - updateMany}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § updateMany
   */
  public async updateMany(
    filter: Filter<ExtractSingular<T>>,
    fieldsToUpdate: Entry<ExtractSingular<T>>,
  ): Promise<number>;

  public async updateMany(
    keys: Entry<ExtractSingular<T>> | Filter<ExtractSingular<T>>,
    fieldsToUpdate: Entry<ExtractSingular<T>>,
  ): Promise<number> {
    return await this.coreRepository.updateMany(keys, fieldsToUpdate);
  }

  /**
   * Deletes EVERY entry matching the given keys and reports how many were removed.
   * Executes `DELETE.from(<Entity>).where(keys)`.
   *
   * @remarks
   * The bulk twin of `delete`: one statement for the whole matching set, resolving to the deleted-row count instead
   * of a boolean — `0` when nothing matched. Use `deleteMany` when the rows are addressed by a list of key objects
   * and `deleteAll` to empty the table. Draft counterpart: `deleteDraftsWhere`.
   *
   * @param keys - An object representing the keys to filter the entries.
   * @returns A promise that resolves to the number of deleted entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * const deletedCount = await this.deleteWhere({ stock: 0 });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#deletewhere | CDS-TS-Repository - deleteWhere}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § deleteWhere
   */
  public async deleteWhere(keys: Entry<ExtractSingular<T>>): Promise<number>;

  /**
   * Deletes EVERY entry matching the given `Filter` tree and reports how many were removed.
   * Executes `DELETE.from(<Entity>).where(<filter expression>)`.
   *
   * @remarks
   * Removes rows a keys object cannot address — ranges, `LIKE`, `IN`, association paths, `'OR'` combinations — with
   * one statement, resolving to the deleted-row count (`0` when nothing matched). Sizing the set first with the same
   * `Filter` via `countWhere` is the only way to preview the damage. Draft counterpart: `deleteDraftsWhere`.
   *
   * @param filter - A `Filter` instance describing the where clause.
   * @returns A promise that resolves to the number of deleted entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * const soldOut = new Filter<Books>({ field: 'stock', operator: 'EQUALS', value: 0 });
   * const deletedCount = await this.deleteWhere(soldOut);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#deletewhere | CDS-TS-Repository - deleteWhere}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § deleteWhere
   */
  public async deleteWhere(filter: Filter<ExtractSingular<T>>): Promise<number>;

  public async deleteWhere(keys?: Entry<ExtractSingular<T>> | Filter<ExtractSingular<T>>): Promise<number> {
    return await this.coreRepository.deleteWhere(keys);
  }

  // ********************************************************************************************
  // INCREMENT / DECREMENT METHODS
  // ********************************************************************************************

  /**
   * Raises one numeric column of the matching entry by `value`, which defaults to `1`.
   * Executes `UPDATE.entity(<Entity>).where(keys).with({ <column>: { '+=': value } })`.
   *
   * @remarks
   * The arithmetic happens IN the database — the row is never read into memory first, so concurrent increments do
   * not overwrite each other, which a `findOne` + `update` pair would. `column` is restricted to the numeric columns
   * of the entity by `NumericKeys`. Resolves to `true` ONLY when exactly one row was affected, so keys matching
   * nothing yield `false`. Use `incrementMany` for several columns or several rows and `decrement` for the opposite
   * direction. Draft counterpart: `incrementDraft`.
   *
   * @param keys - The keys to identify the entity to update.
   * @param column - The numeric column to increment.
   * @param value - The value to increment by (default: 1).
   * @returns A promise that resolves to `true` when exactly one row was affected, `false` otherwise.
   *
   * @example
   * ```ts
   * const bumped = await this.increment({ ID: 201 }, 'stock'); // + 1
   * const restocked = await this.increment({ ID: 201 }, 'stock', 5); // + 5
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#increment | CDS-TS-Repository - increment}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § increment
   */
  public async increment(
    keys: Entry<ExtractSingular<T>>,
    column: NumericKeys<ExtractSingular<T>>,
    value = 1,
  ): Promise<boolean> {
    return await this.coreRepository.increment(keys, column, value);
  }

  /**
   * Lowers one numeric column of the matching entry by `value`, which defaults to `1`.
   * Executes `UPDATE.entity(<Entity>).where(keys).with({ <column>: { '-=': value } })`.
   *
   * @remarks
   * The mirror of `increment`, with the same in-database arithmetic and the same concurrency guarantee. NOTHING
   * clamps the result: the column can go negative, so guard the floor yourself (for example with a preceding
   * `countWhere`) when that is not acceptable. Resolves to `true` ONLY when exactly one row was affected. Use
   * `decrementMany` for several columns or several rows. Draft counterpart: `decrementDraft`.
   *
   * @param keys - The keys to identify the entity to update.
   * @param column - The numeric column to decrement.
   * @param value - The value to decrement by (default: 1).
   * @returns A promise that resolves to `true` when exactly one row was affected, `false` otherwise.
   *
   * @example
   * ```ts
   * const sold = await this.decrement({ ID: 201 }, 'stock'); // - 1
   * const soldFive = await this.decrement({ ID: 201 }, 'stock', 5); // - 5
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#decrement | CDS-TS-Repository - decrement}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § decrement
   */
  public async decrement(
    keys: Entry<ExtractSingular<T>>,
    column: NumericKeys<ExtractSingular<T>>,
    value = 1,
  ): Promise<boolean> {
    return await this.coreRepository.decrement(keys, column, value);
  }

  /**
   * Raises several numeric columns of EVERY entry matching the given keys and reports how many were affected.
   * Executes `UPDATE.entity(<Entity>).with({ <field>: { '+=': <value> }, … }).where(keys)`.
   *
   * @remarks
   * One statement for all matching rows and all listed columns, resolving to the affected-row count instead of a
   * boolean — `0` when nothing matched. `fields` is restricted to the numeric columns by `IncrementFields`, and a
   * field left `undefined` is skipped instead of being treated as `0`. Use `increment` for the single-row, single-
   * column case. Draft counterpart: `incrementManyDrafts`.
   *
   * @param keys - The keys to identify the entries to update.
   * @param fields - An object with numeric field names as keys and increment values as values.
   * @returns A promise that resolves to the number of updated entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * const updatedCount = await this.incrementMany({ currency_code: 'GBP' }, { stock: 10, price: 1 });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#incrementmany | CDS-TS-Repository - incrementMany}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § incrementMany
   */
  public async incrementMany(
    keys: Entry<ExtractSingular<T>>,
    fields: IncrementFields<ExtractSingular<T>>,
  ): Promise<number>;

  /**
   * Raises several numeric columns of EVERY entry matching the given `Filter` tree and reports how many were
   * affected.
   * Executes `UPDATE.entity(<Entity>).with({ <field>: { '+=': <value> }, … }).where(<filter expression>)`.
   *
   * @remarks
   * Same single-statement, in-database arithmetic as the keys overload, but over the sets only a `Filter` can
   * address — ranges, `LIKE`, `IN`, association paths, `'OR'` combinations. Resolves to the affected-row count, `0`
   * when nothing matched. Draft counterpart: `incrementManyDrafts`.
   *
   * @param filter - A `Filter` instance describing the where clause.
   * @param fields - An object with numeric field names as keys and increment values as values.
   * @returns A promise that resolves to the number of updated entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * const inStock = new Filter<Books>({ field: 'stock', operator: 'GREATER THAN', value: 0 });
   * const updatedCount = await this.incrementMany(inStock, { price: 2 });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#incrementmany | CDS-TS-Repository - incrementMany}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § incrementMany
   */
  public async incrementMany(
    filter: Filter<ExtractSingular<T>>,
    fields: IncrementFields<ExtractSingular<T>>,
  ): Promise<number>;

  public async incrementMany(
    keys: Entry<ExtractSingular<T>> | Filter<ExtractSingular<T>>,
    fields: IncrementFields<ExtractSingular<T>>,
  ): Promise<number> {
    return await this.coreRepository.incrementMany(keys, fields);
  }

  /**
   * Lowers several numeric columns of EVERY entry matching the given keys and reports how many were affected.
   * Executes `UPDATE.entity(<Entity>).with({ <field>: { '-=': <value> }, … }).where(keys)`.
   *
   * @remarks
   * The mirror of `incrementMany`: one statement for all matching rows and all listed columns, resolving to the
   * affected-row count (`0` when nothing matched). A field left `undefined` is skipped, and NOTHING clamps the
   * results — the columns can go negative. Use `decrement` for the single-row, single-column case. Draft
   * counterpart: `decrementManyDrafts`.
   *
   * @param keys - The keys to identify the entries to update.
   * @param fields - An object with numeric field names as keys and decrement values as values.
   * @returns A promise that resolves to the number of updated entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * const updatedCount = await this.decrementMany({ currency_code: 'GBP' }, { stock: 1 });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#decrementmany | CDS-TS-Repository - decrementMany}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § decrementMany
   */
  public async decrementMany(
    keys: Entry<ExtractSingular<T>>,
    fields: IncrementFields<ExtractSingular<T>>,
  ): Promise<number>;

  /**
   * Lowers several numeric columns of EVERY entry matching the given `Filter` tree and reports how many were
   * affected.
   * Executes `UPDATE.entity(<Entity>).with({ <field>: { '-=': <value> }, … }).where(<filter expression>)`.
   *
   * @remarks
   * Same single-statement, in-database arithmetic as the keys overload, but over the sets only a `Filter` can
   * address. Resolves to the affected-row count, `0` when nothing matched, and NOTHING clamps the results — the
   * columns can go negative. Draft counterpart: `decrementManyDrafts`.
   *
   * @param filter - A `Filter` instance describing the where clause.
   * @param fields - An object with numeric field names as keys and decrement values as values.
   * @returns A promise that resolves to the number of updated entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * const sold = new Filter<Books>({ field: 'title', operator: 'STARTS_WITH', value: 'The' });
   * const updatedCount = await this.decrementMany(sold, { stock: 1 });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#decrementmany | CDS-TS-Repository - decrementMany}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § decrementMany
   */
  public async decrementMany(
    filter: Filter<ExtractSingular<T>>,
    fields: IncrementFields<ExtractSingular<T>>,
  ): Promise<number>;

  public async decrementMany(
    keys: Entry<ExtractSingular<T>> | Filter<ExtractSingular<T>>,
    fields: IncrementFields<ExtractSingular<T>>,
  ): Promise<number> {
    return await this.coreRepository.decrementMany(keys, fields);
  }
}

export { BaseRepository };
