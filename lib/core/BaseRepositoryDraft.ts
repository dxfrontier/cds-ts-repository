import cds from '@sap/cds';

import { CoreRepository } from './CoreRepository';

import type {
  Columns,
  DraftEntries,
  Entity,
  FindReturn,
  ShowOnlyColumns,
  ExtractSingular,
  BaseRepositoryConstructor,
  InsertResult,
  Draft,
  NumericKeys,
  IncrementFields,
} from '../types/types';
import type { Filter } from '../util/filter/Filter';
import util from '../util/util';

/**
 * Typed data-access layer for the DRAFT rows of a draft-enabled CDS entity — the same operations as
 * `BaseRepository`, named with a `Draft` / `Drafts` suffix and executed against the entity's drafts
 * persistence table (`<Entity>.drafts`) instead of the active one.
 *
 * @template T The type of the entity.
 *
 * @remarks
 * The entity MUST be draft-enabled (`@odata.draft.enabled: true`) — the drafts table is resolved from
 * `entity.drafts`, and for an entity without it EVERY method here silently falls back to the ACTIVE
 * table. Combine both layers with `Mixin(BaseRepository<T>, BaseRepositoryDraft<T>)` so that the active
 * methods (`create`, `find`, `update`, ...) sit next to their draft twins (`createDraft`, `findDrafts`,
 * `updateDraft`, ...) on one repository — see `BaseRepository` for the package-level mental model.
 * Everything here is a plain repository-level statement — NO `DraftAdministrativeData` admin row is
 * written and NO Fiori draft-lifecycle event (`NEW`, `draftEdit`, `draftActivate`, `draftDiscard`)
 * fires, drafts normally originate through the service. External services are NOT supported — a remote
 * OData entity has no drafts table, so `createDraft` / `createManyDrafts` / `updateOrCreateDraft` throw
 * and every other method would target the remote ACTIVE entity set instead.
 *
 * @example
 * ```ts
 * import { BaseRepository, BaseRepositoryDraft, Mixin } from '@dxfrontier/cds-ts-repository';
 * import { Books } from '#cds-models/CatalogService';
 *
 * export class BookRepository extends Mixin(BaseRepository<Books>, BaseRepositoryDraft<Books>) {
 *   constructor() {
 *     super(Books);
 *   }
 *
 *   public async draftsInFlight(): Promise<number> {
 *     return await this.countDrafts();
 *   }
 * }
 * ```
 *
 * @see {@link https://github.com/dxfrontier/cds-ts-repository#drafts--baserepositorydraft | CDS-TS-Repository - BaseRepositoryDraft}
 * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § Drafts : BaseRepositoryDraft
 */
abstract class BaseRepositoryDraft<T> {
  protected coreRepository: CoreRepository<Draft<T>>;

  /**
   * Creates a draft repository bound to the given `cds-typer` entity.
   * @param entity - The entity this repository manages.
   */
  constructor(protected entity: Entity & Draft<T>) {
    const constructor = this.constructor as BaseRepositoryConstructor;

    if (constructor.externalService) {
      // casting is needed as findExternalServiceEntity returns Entity and we need Entity + DraftAdministrativeFields
      this.entity = util.findExternalServiceEntity(this.entity, constructor.externalService) as Entity & Draft<T>;
      this.coreRepository = new CoreRepository(this.entity, constructor.externalService);

      return;
    }

    this.coreRepository = new CoreRepository(this.entity);
  }

  /**
   * Guards the create/upsert draft methods against an attached external service.
   *
   * The constructor swaps `this.entity` for the external service's entity when `@ExternalService` is
   * used, and that remote entity has no `.drafts` - `findUtils.resolveEntityName` would silently fall
   * back to the active entity name, so a create/upsert would INSERT into the remote active entity set
   * with draft-only fields the remote does not declare. Throwing here instead matches how
   * `CoreRepository.getLocaleTexts` guards its own external-service-unsupported path.
   * @param methodName The name of the calling method, used in the thrown error message.
   * @throws {Error} Always, when an external service is attached via `@ExternalService`.
   */
  private assertNoExternalService(methodName: string): void {
    const constructor = this.constructor as BaseRepositoryConstructor;

    if (constructor.externalService) {
      throw new Error(`${methodName} is currently not supported on External services !`);
    }
  }

  /**
   * Normalizes a draft entry before it is persisted into the drafts table.
   *
   * Always defaults `DraftAdministrativeData_DraftUUID` (generated via `cds.utils.uuid()`) when the
   * caller did not supply one, without overwriting a caller-provided value and without mutating the
   * original entry. `HasActiveEntity` is only defaulted (to `false`) when `defaultHasActiveEntity` is
   * `true` - the update path of an upsert must pass `false` so that an existing draft's
   * `HasActiveEntity` is left untouched instead of being silently reset.
   * @param entry The draft entry to normalize.
   * @param defaultHasActiveEntity Whether to default `HasActiveEntity` to `false` when omitted.
   * @returns A new object with the draft administrative fields defaulted where applicable.
   */
  private normalizeDraftEntry(entry: Draft<T>, defaultHasActiveEntity: boolean): Draft<T> {
    const normalized = {
      ...entry,
      DraftAdministrativeData_DraftUUID: entry.DraftAdministrativeData_DraftUUID ?? cds.utils.uuid(),
    } as Draft<T>;

    if (defaultHasActiveEntity) {
      normalized.HasActiveEntity = entry.HasActiveEntity ?? false;
    }

    return normalized;
  }

  // Public routines

  /**
   * Inserts a single draft entry into the drafts persistence table.
   * Executes `INSERT.into(<Entity>.drafts).entries(entry)`.
   *
   * @remarks
   * A repository-level insert — NO `DraftAdministrativeData` admin row is created and NO Fiori
   * draft-lifecycle event fires, drafts normally originate through the service's `NEW` / `draftEdit`
   * flow. `DraftAdministrativeData_DraftUUID` is generated when the entry omits it and `HasActiveEntity`
   * defaults to `false`; caller-provided values are NEVER overwritten and the caller's object is never
   * mutated. `IsActiveEntity` does not have to be passed, the statement already targets the drafts
   * table. THROWS when an external service is attached, the drafts table only lives on the primary
   * database. Many rows at once: `createManyDrafts`. Active counterpart: `create`.
   *
   * @param entry - An object representing the draft entry to be created.
   * @returns A promise that resolves to the inserted result.
   * @throws {Error} - When an external service is attached via `@ExternalService` - the drafts table
   * only exists on the primary database, so this is not supported the way the active `create` is.
   *
   * @example
   * ```ts
   * const created = await this.createDraft({ ID: 201, title: 'Wuthering Heights', stock: 12 });
   *
   * created.query.INSERT.entries.length; // 1
   * // the generated draft UUID is part of the inserted entry
   * const [inserted] = created.query.INSERT.entries;
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#createdraft | CDS-TS-Repository - createDraft}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § createDraft
   */
  public async createDraft(entry: Draft<T>): Promise<InsertResult<Draft<T>>> {
    this.assertNoExternalService('createDraft');

    return await this.coreRepository.create(this.normalizeDraftEntry(entry, true));
  }

  /**
   * Inserts several draft entries into the drafts persistence table with one statement.
   * Executes `INSERT.into(<Entity>.drafts).entries(...entries)`.
   *
   * @remarks
   * Same repository-level insert as `createDraft`, once per entry — NO `DraftAdministrativeData` admin
   * row and NO Fiori draft-lifecycle event. Entries are passed as varargs OR as a single array, both
   * forms behave identically. EVERY entry gets its own generated `DraftAdministrativeData_DraftUUID`
   * when it omits one (the rows are never linked to each other) and `HasActiveEntity` defaults to
   * `false`. THROWS when an external service is attached. Active counterpart: `createMany`.
   *
   * @param entries - The draft entries to be created, passed as varargs or as a single array.
   * @returns A promise that resolves to the insert result.
   * @throws {Error} - When an external service is attached via `@ExternalService` - the drafts table
   * only exists on the primary database, so this is not supported the way the active `createMany` is.
   *
   * @example
   * ```ts
   * const created = await this.createManyDrafts(
   *   { ID: 201, title: 'Wuthering Heights' },
   *   { ID: 202, title: 'Jane Eyre' },
   * );
   *
   * // the single-array form is equivalent
   * await this.createManyDrafts([{ ID: 203, title: 'Villette' }]);
   * created.query.INSERT.entries.length; // 2
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#createmanydrafts | CDS-TS-Repository - createManyDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § createManyDrafts
   */
  public async createManyDrafts(...entries: DraftEntries<ExtractSingular<T>>[]): Promise<InsertResult<Draft<T>>> {
    this.assertNoExternalService('createManyDrafts');

    const normalizedEntries = entries.map((entry) =>
      Array.isArray(entry)
        ? entry.map((item) => this.normalizeDraftEntry(item, true))
        : this.normalizeDraftEntry(entry, true),
    );

    return await this.coreRepository.createMany(...normalizedEntries);
  }

  /**
   * Updates the draft rows that already exist and inserts the ones that do not.
   * Executes `UPSERT.into(<Entity>.drafts).entries(...entries)`.
   *
   * @remarks
   * UPSERT PATCH semantics — resolves `true` as soon as at least ONE row was written, `false` when the
   * statement affected nothing. `DraftAdministrativeData_DraftUUID` is generated per entry when omitted,
   * which REPLACES the linkage of a row that already exists - pass the stored UUID back to preserve it.
   * Unlike `createDraft`, `HasActiveEntity` is NEVER defaulted here — on an update the existing value
   * survives (a draft opened through `draftEdit` keeps its `true`), on the insert path the column stays
   * `NULL` unless provided. Entries are passed as varargs or as a single array. THROWS when an external
   * service is attached. Active counterpart: `updateOrCreate`.
   *
   * @param entries - The draft entries to be created or updated, passed as varargs or as a single array.
   * @returns A promise that resolves to `true` when at least one row was written, `false` when the
   * statement affected nothing.
   * @throws {Error} - When an external service is attached via `@ExternalService` - the drafts table
   * only exists on the primary database, so this is not supported the way the active `updateOrCreate` is.
   *
   * @example
   * ```ts
   * const draft = await this.findOneDraft({ ID: 201 });
   *
   * const written = await this.updateOrCreateDraft({
   *   ID: 201,
   *   DraftAdministrativeData_DraftUUID: draft?.DraftAdministrativeData_DraftUUID,
   *   title: 'Wuthering Heights - 2nd edition',
   * });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#updateorcreatedraft | CDS-TS-Repository - updateOrCreateDraft}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § updateOrCreateDraft
   */
  public async updateOrCreateDraft(...entries: DraftEntries<ExtractSingular<T>>[]): Promise<boolean> {
    this.assertNoExternalService('updateOrCreateDraft');

    const normalizedEntries = entries.map((entry) =>
      Array.isArray(entry)
        ? entry.map((item) => this.normalizeDraftEntry(item, false))
        : this.normalizeDraftEntry(entry, false),
    );

    return await this.coreRepository.updateOrCreate(...normalizedEntries);
  }

  /**
   * Retrieves every row of the drafts persistence table.
   * Executes `SELECT.from(<Entity>.drafts)`.
   *
   * @remarks
   * Draft rows only exist between the moment a draft is opened (`NEW` / `draftEdit`) and its activation
   * or discard, so this returns the drafts currently in flight - for ALL users, not just the requesting
   * one. Every row carries the draft administrative fields on top of the entity's own elements. No
   * predicate is applied — use `findDrafts` to filter and `paginateDrafts` on large tables. An empty
   * drafts table resolves to an empty array, so the `undefined` of the return type is defensive: narrow
   * with `drafts?.length` rather than a plain truthiness check. Active counterpart: `getAll`.
   *
   * @returns A promise that resolves to all draft rows, an empty array when the drafts table is empty.
   *
   * @example
   * ```ts
   * const drafts = await this.getAllDrafts();
   *
   * for (const draft of drafts ?? []) {
   *   console.log(draft.DraftAdministrativeData_DraftUUID, draft.HasActiveEntity);
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#getall | CDS-TS-Repository - getAllDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § getAll
   */
  public async getAllDrafts(): Promise<Draft<T>[] | undefined> {
    return await this.coreRepository.getAll();
  }

  /**
   * Retrieves the distinct value combinations of the given columns from the drafts persistence table.
   * Executes `SELECT.distinct.from(<Entity>.drafts).columns(...columns)`.
   *
   * @remarks
   * Columns are passed as varargs OR as a single array. Distinctness applies to the WHOLE column list at
   * once, NOT per column, so two columns yield distinct pairs. The resolved rows are narrowed to exactly
   * the requested columns - the draft administrative fields are absent unless they are part of the list.
   * An empty match resolves to an empty array, so the `undefined` of the return type is defensive.
   * Active counterpart: `getDistinctColumns`.
   *
   * @param columns - The column names to retrieve the distinct entries for, passed as varargs or as a
   * single array.
   * @returns A promise that resolves to the distinct entries narrowed to the requested columns, an empty
   * array when nothing matches.
   *
   * @example
   * ```ts
   * const pairs = await this.getDraftsDistinctColumns(['title', 'stock']);
   *
   * // varargs form, single column
   * const titles = await this.getDraftsDistinctColumns('title');
   * titles?.forEach((row) => console.log(row.title));
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#getdistinctcolumns | CDS-TS-Repository - getDraftsDistinctColumns}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § getDistinctColumns
   */
  public async getDraftsDistinctColumns<ColumnKeys extends Columns<Draft<T>>>(
    ...columns: ColumnKeys[]
  ): Promise<Pick<Draft<T>, ShowOnlyColumns<Draft<T>, ColumnKeys>>[] | undefined> {
    return await this.coreRepository.getDistinctColumns(...columns);
  }

  /**
   * Retrieves one page of draft rows, optionally skipping the leading ones.
   * Executes `SELECT.from(<Entity>.drafts).limit(limit, skip)`.
   *
   * @remarks
   * `skip` is optional — without it the query is a plain `limit(limit)` with no offset. NO ordering is
   * added, and an unordered page is not stable across calls - chain `builderDraft().find().orderAsc(...)`
   * with its own `paginate` when the page order matters. An exhausted page resolves to an empty array,
   * not to `undefined`. Active counterpart: `paginate`.
   *
   * @param options.limit - The limit for the result set.
   * @param [options.skip] - Optional 'skip', which will skip a specified number of items for the result
   * set (default: 0).
   * @returns A promise that resolves to one page of draft rows, an empty array when the page is exhausted.
   *
   * @example
   * ```ts
   * const firstPage = await this.paginateDrafts({ limit: 10 });
   * const secondPage = await this.paginateDrafts({ limit: 10, skip: 10 });
   *
   * const stablePage = await this.builderDraft().find().orderAsc(['title']).paginate({ limit: 10 }).execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#paginate | CDS-TS-Repository - paginateDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § paginate
   */
  public async paginateDrafts(options: { limit: number; skip?: number | undefined }): Promise<Draft<T>[] | undefined> {
    return await this.coreRepository.paginate(options);
  }

  /**
   * Retrieves every draft row matching the given keys.
   * Executes `SELECT.from(<Entity>.drafts).where(keys)`.
   *
   * @remarks
   * The keys are combined with AND; an empty object matches everything, exactly like `getAllDrafts`.
   * `IsActiveEntity` never has to be part of the keys, the statement already targets the drafts table.
   * For anything beyond equality use the `Filter` overload, and `findOneDraft` when a single row is
   * expected. Keys that match nothing resolve to an empty array, NOT to `undefined` and never to an
   * error. Active counterpart: `find`.
   *
   * @param keys - An object representing the keys to filter the entries.
   * @returns A promise that resolves to the matching draft rows, an empty array when nothing matches.
   *
   * @example
   * ```ts
   * const drafts = await this.findDrafts({ title: 'Wuthering Heights' });
   *
   * for (const draft of drafts ?? []) {
   *   console.log(draft.ID, draft.DraftAdministrativeData_DraftUUID);
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#find | CDS-TS-Repository - findDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § find
   */
  public async findDrafts(keys: Draft<T>): Promise<Draft<T>[] | undefined>;
  /**
   * Retrieves every draft row matching the given `Filter` tree.
   * Executes `SELECT.from(<Entity>.drafts).where(<compiled filter>)`.
   *
   * @remarks
   * Same read as the keys overload, with the full operator set (`LIKE`, `BETWEEN`, `IN`, `IS NULL`,
   * `EXISTS`, ...) and `'AND'` / `'OR'` composition; a `Filter` is compiled into a CQL condition string
   * whereas a keys object stays a structured where clause. A `Filter` typed on the active entity is
   * accepted here - the draft rows carry the same elements. Active counterpart: `find`.
   *
   * @param filter - A Filter instance.
   * @returns A promise that resolves to the matching draft rows, an empty array when nothing matches.
   *
   * @example
   * ```ts
   * import { Filter } from '@dxfrontier/cds-ts-repository';
   *
   * const lowStock = new Filter<Books>({ field: 'stock', operator: 'LESS THAN', value: 10 });
   * const drafts = await this.findDrafts(lowStock);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#find | CDS-TS-Repository - findDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § find
   */
  public async findDrafts(filter: Filter<Draft<T>>): Promise<Draft<T>[] | undefined>;
  public async findDrafts(keys: Draft<T> | Filter<Draft<T>>): Promise<Draft<T>[] | undefined> {
    return await this.coreRepository.find(keys);
  }

  /**
   * Reads a single draft row by keys and, ONLY when it exists, writes the given fields to it.
   * Executes `SELECT.one.from(<Entity>.drafts).where(keys)` and then
   * `UPDATE.entity(<Entity>.drafts).where(keys).set(fieldsToUpdate)`.
   *
   * @remarks
   * Skips the UPDATE entirely and resolves `false` when no draft row matches, where `updateDraft` would
   * fire a statement that hits nothing. Also resolves `false` when the UPDATE did not affect EXACTLY one
   * row, so a keys object matching several drafts reports `false` although the rows WERE written - use
   * `updateManyDrafts` there. The read and the write are two statements in the ambient CDS transaction,
   * NOT an atomic compare-and-set. Active counterpart: `findOneAndUpdate`.
   *
   * @param keys - The keys to identify the draft entity to find and update.
   * @param fieldsToUpdate - The fields and their new values to update on the found draft entity.
   * @returns A promise that resolves to `true` when exactly one draft row was updated, `false` otherwise.
   *
   * @example
   * ```ts
   * const wasUpdated = await this.findOneDraftAndUpdate(
   *   { ID: 201 },
   *   { title: 'Wuthering Heights - draft', stock: 7 },
   * );
   *
   * if (!wasUpdated) {
   *   // no draft row for that key, or more than one matched
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#findoneandupdate | CDS-TS-Repository - findOneDraftAndUpdate}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § findOneAndUpdate
   */
  public async findOneDraftAndUpdate(keys: Draft<T>, fieldsToUpdate: Draft<T>): Promise<boolean> {
    return await this.coreRepository.findOneAndUpdate(keys, fieldsToUpdate);
  }

  /**
   * Retrieves a single draft row matching the given keys.
   * Executes `SELECT.one.from(<Entity>.drafts).where(keys)`.
   *
   * @remarks
   * Resolves `undefined` when nothing matches, so ALWAYS narrow before dereferencing. When the keys match
   * several draft rows the database picks one arbitrarily - no ordering is added; use `findDrafts` for
   * all of them, or `findFirstDraft` / `findLastDraft` for a deterministic pick. This method takes keys
   * ONLY, a `Filter` is not accepted here. Active counterpart: `findOne`.
   *
   * @param keys - An object representing the keys to filter the record.
   * @returns A promise that resolves to a single matching draft row, `undefined` when nothing matches.
   *
   * @example
   * ```ts
   * const draft = await this.findOneDraft({ ID: 201 });
   *
   * if (draft) {
   *   console.log(draft.HasActiveEntity, draft.DraftAdministrativeData_DraftUUID);
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#findone | CDS-TS-Repository - findOneDraft}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § findOne
   */
  public async findOneDraft(keys: Draft<T>): Promise<Draft<T> | undefined> {
    return await this.coreRepository.findOne(keys);
  }

  /**
   * Opens the chainable query builder on the drafts persistence table.
   * Returns `{ find, findOne }`, building `SELECT.from(<Entity>.drafts)` / `SELECT.one.from(<Entity>.drafts)`.
   *
   * @remarks
   * The entry point for everything the flat draft methods cannot express — `columns`, `columnsFormatter`,
   * `getExpand`, `orderAsc` / `orderDesc`, `groupBy` / `having`, `paginate`, `forUpdate` / `forShareLock`
   * and the terminals `execute`, `executeAndCount`, `forEach`, `pipeline`, `stream`. NOTHING is sent to
   * the database until a terminal is awaited. `find` and `findOne` accept keys, a `Filter`, or nothing.
   * Active counterpart: `builder`.
   *
   * @returns An instance of FindReturn for building queries.
   *
   * @example
   * ```ts
   * const drafts = await this.builderDraft()
   *   .find({ stock: 10 })
   *   .columns('ID', 'title')
   *   .orderDesc(['title'])
   *   .execute();
   *
   * const oneDraft = await this.builderDraft().findOne({ ID: 201 }).getExpand(['author']).execute();
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#builder | CDS-TS-Repository - builderDraft}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § builder
   */
  public builderDraft(): FindReturn<Draft<T>> {
    return this.coreRepository.builder();
  }

  /**
   * Updates the draft row matching the given keys with the provided fields.
   * Executes `UPDATE.entity(<Entity>.drafts).where(keys).set(fieldsToUpdate)`.
   *
   * @remarks
   * Resolves `true` ONLY when EXACTLY one draft row was affected — `false` both when nothing matched and
   * when several rows matched, even though those rows were written. Use `updateManyDrafts` when more than
   * one row is expected (it resolves the affected count) and `findOneDraftAndUpdate` to avoid firing the
   * statement at all when the row does not exist. Draft administrative fields are only touched when they
   * are part of `fieldsToUpdate`, and no Fiori draft-lifecycle event fires. Active counterpart: `update`.
   *
   * @param keys - An object representing the keys to filter the entries.
   * @param fieldsToUpdate - An object representing the fields and their updated values for the matching
   * entries.
   * @returns A promise that resolves to `true` when exactly one draft row was updated, `false` otherwise.
   *
   * @example
   * ```ts
   * const updated = await this.updateDraft(
   *   { ID: 201 },
   *   { title: 'Wuthering Heights - draft', stock: 3 },
   * );
   * // false when no draft row carries that key
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#update | CDS-TS-Repository - updateDraft}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § update
   */
  public async updateDraft(keys: Draft<T>, fieldsToUpdate: Draft<T>): Promise<boolean> {
    return await this.coreRepository.update(keys, fieldsToUpdate);
  }

  /**
   * Deletes the draft row matching the given keys.
   * Executes `DELETE.from(<Entity>.drafts).where(keys)`.
   *
   * @remarks
   * Resolves `true` ONLY when EXACTLY one draft row was removed — `false` both when nothing matched and
   * when several rows matched, even though those rows were deleted - `deleteDraftsWhere` resolves the
   * count instead, and `deleteManyDrafts` takes a list of key objects. The ACTIVE row is NOT touched, so
   * this is a repository-level discard which does NOT fire the service's `draftDiscard`.
   * Active counterpart: `delete`.
   *
   * @param keys - An object representing the keys to filter the entries.
   * @returns A promise that resolves to `true` when exactly one draft row was deleted, `false` otherwise.
   *
   * @example
   * ```ts
   * const deleted = await this.deleteDraft({ ID: 201 });
   *
   * if (deleted) {
   *   // the draft is gone, the active Book row is untouched
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#delete | CDS-TS-Repository - deleteDraft}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § delete
   */
  public async deleteDraft(keys: Draft<T>): Promise<boolean> {
    return await this.coreRepository.delete(keys);
  }

  /**
   * Deletes one draft row per key object, running the statements in parallel.
   * Executes one `DELETE.from(<Entity>.drafts).where(entry)` per entry.
   *
   * @remarks
   * Takes ONE array argument - NOT varargs, unlike `createManyDrafts` / `updateOrCreateDraft`. Resolves
   * `true` only when EVERY statement removed exactly one row, and `false` for an EMPTY array since
   * nothing was deleted. The statements are independent — a partial failure still leaves the successful
   * deletes applied, up to the ambient CDS transaction. Prefer `deleteDraftsWhere` when a single
   * predicate covers all rows. Active counterpart: `deleteMany`.
   *
   * @param entries - An array of objects representing the keys to filter the entries.
   * @returns A promise that resolves to `true` when every statement removed exactly one draft row,
   * `false` otherwise.
   *
   * @example
   * ```ts
   * const deleted = await this.deleteManyDrafts([{ ID: 201 }, { ID: 202 }]);
   * // false as soon as one of the two keys matched no draft row
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#deletemany | CDS-TS-Repository - deleteManyDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § deleteMany
   */
  public async deleteManyDrafts(entries: DraftEntries<ExtractSingular<T>>[]): Promise<boolean> {
    return await this.coreRepository.deleteMany(...entries);
  }

  /**
   * Deletes every row of the drafts persistence table, keeping the table itself.
   * Executes `DELETE.from(<Entity>.drafts)` without a where clause.
   *
   * @remarks
   * Resolves `true` when at least ONE row was removed, so an already empty drafts table resolves `false`
   * rather than throwing. Wipes the drafts of ALL users, including the ones being edited right now, and
   * leaves every ACTIVE row untouched. There is no confirmation step - scope the deletion with
   * `deleteDraftsWhere` when only part of the drafts should go. Active counterpart: `deleteAll`.
   *
   * @returns A promise that resolves to `true` when at least one draft row was removed, `false` when the
   * drafts table was already empty.
   *
   * @example
   * ```ts
   * const deleted = await this.deleteAllDrafts();
   * // false when the drafts table was already empty
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#deleteall | CDS-TS-Repository - deleteAllDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § deleteAll
   */
  public async deleteAllDrafts(): Promise<boolean> {
    return await this.coreRepository.deleteAll();
  }

  /**
   * Checks whether at least one draft row matches the given keys.
   * Executes `SELECT.one.from(<Entity>.drafts).columns('count(*) as total').where(keys)`.
   *
   * @remarks
   * The existence is resolved by a `count(*)` aggregate, NOT by materializing rows, so prefer this over
   * `(await this.findOneDraft(keys)) !== undefined` for a pure presence check. `true` as soon as ONE row
   * matches; use `countDraftsWhere` when the number itself matters. Active counterpart: `exists`.
   *
   * @param keys - An object representing the keys to filter the entries.
   * @returns A promise that resolves to `true` when at least one draft row matches, `false` otherwise.
   *
   * @example
   * ```ts
   * const exists = await this.existsDraft({ ID: 201 });
   *
   * if (!exists) {
   *   await this.createDraft({ ID: 201, title: 'Wuthering Heights' });
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#exists | CDS-TS-Repository - existsDraft}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § exists
   */
  public async existsDraft(keys: Draft<T>): Promise<boolean> {
    return await this.coreRepository.exists(keys);
  }

  /**
   * Counts every row of the drafts persistence table.
   * Executes `SELECT.one.from(<Entity>.drafts).columns('count(*) as total')`.
   *
   * @remarks
   * The count is computed by the database and resolves to `0` on an empty drafts table, NEVER to
   * `undefined`. Unfiltered — `countDraftsWhere` takes keys or a `Filter`, `existsDraft` is cheaper when
   * only the presence matters. Counts the drafts of ALL users currently in flight, not just the ones of
   * the requesting user. Active counterpart: `count`.
   *
   * @returns A promise that resolves to the count of draft rows, `0` on an empty drafts table.
   *
   * @example
   * ```ts
   * const count = await this.countDrafts();
   *
   * if (count === 0) {
   *   // nobody is editing this entity right now
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#count | CDS-TS-Repository - countDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § count
   */
  public async countDrafts(): Promise<number> {
    return await this.coreRepository.count();
  }

  /**
   * Retrieves the first draft row when the table is ordered ascending by the given column.
   * Executes `SELECT.one.from(<Entity>.drafts).orderBy('<column> asc')`.
   *
   * @remarks
   * Resolves `undefined` on an empty drafts table. Exactly ONE column can be ordered on and no predicate
   * is applied - chain `builderDraft().find(...).orderAsc([...])` for multi-column ordering or a filtered
   * "first". `NULL` values sort according to the database's collation, so they may come first. Mirror
   * method: `findLastDraft`. Active counterpart: `findFirst`.
   *
   * @param column - The column to order by.
   * @returns A promise that resolves to the first draft entry, `undefined` on an empty drafts table.
   *
   * @example
   * ```ts
   * const oldestDraft = await this.findFirstDraft('createdAt');
   *
   * console.log(oldestDraft?.DraftAdministrativeData_DraftUUID);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#findfirst | CDS-TS-Repository - findFirstDraft}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § findFirst
   */
  public async findFirstDraft<ColumnKeys extends keyof Draft<T>>(column: ColumnKeys): Promise<Draft<T> | undefined> {
    return await this.coreRepository.findFirst(column);
  }

  /**
   * Retrieves the last draft row when the table is ordered descending by the given column.
   * Executes `SELECT.one.from(<Entity>.drafts).orderBy('<column> desc')`.
   *
   * @remarks
   * The descending mirror of `findFirstDraft` — same single-column ordering, same `undefined` on an empty
   * drafts table, and `NULL` values again sort by the database's collation. Use
   * `builderDraft().find(...).orderDesc([...])` when the "last" row has to be filtered or ordered on more
   * than one column. Active counterpart: `findLast`.
   *
   * @param column - The column to order by.
   * @returns A promise that resolves to the last draft entry, `undefined` on an empty drafts table.
   *
   * @example
   * ```ts
   * const newestDraft = await this.findLastDraft('createdAt');
   *
   * console.log(newestDraft?.DraftAdministrativeData_DraftUUID);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#findlast | CDS-TS-Repository - findLastDraft}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § findLast
   */
  public async findLastDraft<ColumnKeys extends keyof Draft<T>>(column: ColumnKeys): Promise<Draft<T> | undefined> {
    return await this.coreRepository.findLast(column);
  }

  /**
   * Retrieves the draft row matching the given keys, inserting it from `keys` + `defaults` when missing.
   * Executes `SELECT.one.from(<Entity>.drafts).where(keys)` and, only on a miss,
   * `INSERT.into(<Entity>.drafts).entries({ ...keys, ...defaults })` followed by a second read.
   *
   * @remarks
   * `created` tells the two paths apart and `entry` is ALWAYS the stored row, since the inserted draft is
   * read back. `defaults` win over `keys` on overlapping fields. The insert does NOT go through the
   * `createDraft` normalization — `DraftAdministrativeData_DraftUUID` and `HasActiveEntity` are NOT
   * defaulted, pass them in `defaults` when the new draft has to carry them. Read and insert are separate
   * statements, so a concurrent insert can still make the write fail. Active counterpart: `findOrCreate`.
   *
   * @param keys - An object representing the keys to find the draft entry.
   * @param defaults - An object representing the default values for the new draft entry if not found.
   * @returns A promise that resolves to an object containing the draft entry and a boolean indicating if
   * it was created.
   *
   * @example
   * ```ts
   * const { entry, created } = await this.findOrCreateDraft(
   *   { ID: 201 },
   *   { title: 'Wuthering Heights', DraftAdministrativeData_DraftUUID: '2f12d711-b09e-4b57-b035-2cbd0a02ba19' },
   * );
   *
   * if (created) {
   *   console.log(entry.title);
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#findorcreate | CDS-TS-Repository - findOrCreateDraft}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § findOrCreate
   */
  public async findOrCreateDraft(keys: Draft<T>, defaults: Draft<T>): Promise<{ created: boolean; entry: Draft<T> }> {
    return await this.coreRepository.findOrCreate(keys, defaults);
  }

  /**
   * Counts the draft rows matching the given keys.
   * Executes `SELECT.one.from(<Entity>.drafts).columns('count(*) as total').where(keys)`.
   *
   * @remarks
   * Resolves `0` when nothing matches, never `undefined`. The database computes the aggregate, so no rows
   * are transferred - cheaper than `(await this.findDrafts(keys))?.length`. Use `countDrafts` for the
   * unfiltered total and `existsDraft` when only the presence matters. Active counterpart: `countWhere`.
   *
   * @param keys - An object representing the keys to filter the draft entries.
   * @returns A promise that resolves to the count of matching draft entries, `0` when nothing matches.
   *
   * @example
   * ```ts
   * const outOfStock = await this.countDraftsWhere({ stock: 0 });
   *
   * if (outOfStock > 0) {
   *   // some drafts still have to be replenished before activation
   * }
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#countwhere | CDS-TS-Repository - countDraftsWhere}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § countWhere
   */
  public async countDraftsWhere(keys: Draft<T>): Promise<number>;

  /**
   * Counts the draft rows matching the given `Filter` tree.
   * Executes `SELECT.one.from(<Entity>.drafts).columns('count(*) as total').where(<compiled filter>)`.
   *
   * @remarks
   * Same aggregate as the keys overload, with the full operator set and `'AND'` / `'OR'` composition
   * instead of plain equality. Resolves `0` when the predicate matches nothing. A `Filter` typed on the
   * active entity is accepted here - the draft rows carry the same elements. Active counterpart:
   * `countWhere`.
   *
   * @param filter - A Filter instance.
   * @returns A promise that resolves to the count of matching draft entries, `0` when nothing matches.
   *
   * @example
   * ```ts
   * import { Filter } from '@dxfrontier/cds-ts-repository';
   *
   * const wellStocked = new Filter<Books>({ field: 'stock', operator: 'GREATER THAN', value: 10 });
   * const count = await this.countDraftsWhere(wellStocked);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#countwhere | CDS-TS-Repository - countDraftsWhere}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § countWhere
   */
  public async countDraftsWhere(filter: Filter<Draft<T>>): Promise<number>;

  public async countDraftsWhere(keys?: Draft<T> | Filter<Draft<T>>): Promise<number> {
    return await this.coreRepository.countWhere(keys);
  }

  /**
   * Updates EVERY draft row matching the given keys and resolves how many were affected.
   * Executes `UPDATE.entity(<Entity>.drafts).set(fieldsToUpdate).where(keys)`.
   *
   * @remarks
   * One statement for all matching rows, resolving `0` when nothing matched instead of throwing. Prefer it
   * over `updateDraft` as soon as more than one row can match — `updateDraft` reports `false` for a
   * multi-row hit even though it wrote those rows. Only the listed fields are written, the rest of the
   * draft row - including its administrative fields - stays as it is. Active counterpart: `updateMany`.
   *
   * @param keys - An object representing the keys to filter the draft entries.
   * @param fieldsToUpdate - An object representing the fields and their updated values.
   * @returns A promise that resolves to the number of updated draft entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * const updatedCount = await this.updateManyDrafts({ stock: 0 }, { isAvailable: false });
   *
   * console.log(`${updatedCount} draft(s) marked unavailable`);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#updatemany | CDS-TS-Repository - updateManyDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § updateMany
   */
  public async updateManyDrafts(keys: Draft<T>, fieldsToUpdate: Draft<T>): Promise<number>;

  /**
   * Updates EVERY draft row matching the given `Filter` tree and resolves how many were affected.
   * Executes `UPDATE.entity(<Entity>.drafts).set(fieldsToUpdate).where(<compiled filter>)`.
   *
   * @remarks
   * Same single statement as the keys overload, with the full operator set and `'AND'` / `'OR'`
   * composition instead of plain equality. Resolves `0` when the predicate matches nothing. Beware of an
   * over-broad filter — there is no row limit, EVERY matching draft of EVERY user is rewritten.
   * Active counterpart: `updateMany`.
   *
   * @param filter - A Filter instance.
   * @param fieldsToUpdate - An object representing the fields and their updated values.
   * @returns A promise that resolves to the number of updated draft entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * import { Filter } from '@dxfrontier/cds-ts-repository';
   *
   * const lowStock = new Filter<Books>({ field: 'stock', operator: 'LESS THAN', value: 5 });
   * const updatedCount = await this.updateManyDrafts(lowStock, { isAvailable: false });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#updatemany | CDS-TS-Repository - updateManyDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § updateMany
   */
  public async updateManyDrafts(filter: Filter<Draft<T>>, fieldsToUpdate: Draft<T>): Promise<number>;

  public async updateManyDrafts(keys: Draft<T> | Filter<Draft<T>>, fieldsToUpdate: Draft<T>): Promise<number> {
    return await this.coreRepository.updateMany(keys, fieldsToUpdate);
  }

  /**
   * Deletes EVERY draft row matching the given keys and resolves how many were removed.
   * Executes `DELETE.from(<Entity>.drafts).where(keys)`.
   *
   * @remarks
   * One statement for all matching rows, resolving `0` when nothing matched instead of throwing. Unlike
   * `deleteDraft` there is no exactly-one-row expectation, and unlike `deleteManyDrafts` it is a single
   * predicate rather than one statement per key object. The ACTIVE rows are NOT touched and no Fiori
   * `draftDiscard` fires. Active counterpart: `deleteWhere`.
   *
   * @param keys - An object representing the keys to filter the draft entries.
   * @returns A promise that resolves to the number of deleted draft entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * const deletedCount = await this.deleteDraftsWhere({ stock: 0 });
   *
   * console.log(`${deletedCount} abandoned draft(s) removed`);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#deletewhere | CDS-TS-Repository - deleteDraftsWhere}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § deleteWhere
   */
  public async deleteDraftsWhere(keys: Draft<T>): Promise<number>;

  /**
   * Deletes EVERY draft row matching the given `Filter` tree and resolves how many were removed.
   * Executes `DELETE.from(<Entity>.drafts).where(<compiled filter>)`.
   *
   * @remarks
   * Same single statement as the keys overload, with the full operator set and `'AND'` / `'OR'`
   * composition instead of plain equality. Resolves `0` when the predicate matches nothing. Beware of an
   * over-broad filter — there is no row limit, and a `Filter` matching everything is equivalent to
   * `deleteAllDrafts`. Active counterpart: `deleteWhere`.
   *
   * @param filter - A Filter instance.
   * @returns A promise that resolves to the number of deleted draft entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * import { Filter } from '@dxfrontier/cds-ts-repository';
   *
   * const emptyStock = new Filter<Books>({ field: 'stock', operator: 'EQUALS', value: 0 });
   * const deletedCount = await this.deleteDraftsWhere(emptyStock);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#deletewhere | CDS-TS-Repository - deleteDraftsWhere}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § deleteWhere
   */
  public async deleteDraftsWhere(filter: Filter<Draft<T>>): Promise<number>;

  public async deleteDraftsWhere(keys?: Draft<T> | Filter<Draft<T>>): Promise<number> {
    return await this.coreRepository.deleteWhere(keys);
  }

  // ********************************************************************************************
  // INCREMENT / DECREMENT METHODS
  // ********************************************************************************************

  /**
   * Adds a value to a numeric column of the draft row matching the given keys.
   * Executes `UPDATE.entity(<Entity>.drafts).where(keys).with({ <column>: { '+=': value } })`.
   *
   * @remarks
   * The database does the arithmetic, so the current value is never read into JS and concurrent
   * increments cannot overwrite each other. The value defaults to `1` and may be negative. `column` is
   * restricted to the NUMERIC elements of the entity by `NumericKeys<Draft<T>>`. Resolves `true` ONLY
   * when EXACTLY one draft row was affected - use `incrementManyDrafts` for several rows or several
   * columns at once, and `decrementDraft` to subtract. Active counterpart: `increment`.
   *
   * @param keys - The keys to identify the draft entity to update.
   * @param column - The numeric column to increment.
   * @param value - The value to increment by (default: 1).
   * @returns A promise that resolves to `true` when exactly one draft row was affected, `false` otherwise.
   *
   * @example
   * ```ts
   * const bumped = await this.incrementDraft({ ID: 201 }, 'stock', 5);
   *
   * // the value is optional and defaults to 1
   * await this.incrementDraft({ ID: 201 }, 'stock');
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#increment | CDS-TS-Repository - incrementDraft}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § increment
   */
  public async incrementDraft(keys: Draft<T>, column: NumericKeys<Draft<T>>, value = 1): Promise<boolean> {
    return await this.coreRepository.increment(keys, column, value);
  }

  /**
   * Subtracts a value from a numeric column of the draft row matching the given keys.
   * Executes `UPDATE.entity(<Entity>.drafts).where(keys).with({ <column>: { '-=': value } })`.
   *
   * @remarks
   * The subtracting mirror of `incrementDraft` — same database-side arithmetic, same `NumericKeys` guard,
   * same `true` ONLY on EXACTLY one affected draft row. The value defaults to `1`. NO floor is applied -
   * the column can go negative unless the CDS model constrains it. Several rows or several columns at
   * once: `decrementManyDrafts`. Active counterpart: `decrement`.
   *
   * @param keys - The keys to identify the draft entity to update.
   * @param column - The numeric column to decrement.
   * @param value - The value to decrement by (default: 1).
   * @returns A promise that resolves to `true` when exactly one draft row was affected, `false` otherwise.
   *
   * @example
   * ```ts
   * const reduced = await this.decrementDraft({ ID: 201 }, 'stock', 5);
   *
   * // the value is optional and defaults to 1
   * await this.decrementDraft({ ID: 201 }, 'stock');
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#decrement | CDS-TS-Repository - decrementDraft}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § decrement
   */
  public async decrementDraft(keys: Draft<T>, column: NumericKeys<Draft<T>>, value = 1): Promise<boolean> {
    return await this.coreRepository.decrement(keys, column, value);
  }

  /**
   * Adds the given amounts to several numeric columns of EVERY draft row matching the keys.
   * Executes `UPDATE.entity(<Entity>.drafts).with({ <field>: { '+=': amount } }).where(keys)`.
   *
   * @remarks
   * One statement for all matching rows, resolving the affected count (`0` when nothing matched). Fields
   * whose amount is `undefined` are skipped, so a partially filled object is safe to pass. The keys are
   * restricted to the NUMERIC elements by `IncrementFields<Draft<T>>`. Prefer `incrementDraft` when a
   * single row and a single column are targeted. Active counterpart: `incrementMany`.
   *
   * @param keys - The keys to identify the draft entities to update.
   * @param fields - An object with numeric field names as keys and increment values as values.
   * @returns A promise that resolves to the number of updated draft entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * const updatedCount = await this.incrementManyDrafts({ isAvailable: true }, { stock: 10, price: 1 });
   *
   * console.log(`${updatedCount} draft(s) restocked`);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#incrementmany | CDS-TS-Repository - incrementManyDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § incrementMany
   */
  public async incrementManyDrafts(keys: Draft<T>, fields: IncrementFields<Draft<T>>): Promise<number>;

  /**
   * Adds the given amounts to several numeric columns of EVERY draft row matching the `Filter` tree.
   * Executes `UPDATE.entity(<Entity>.drafts).with({ <field>: { '+=': amount } }).where(<compiled filter>)`.
   *
   * @remarks
   * Same single statement as the keys overload, with the full operator set and `'AND'` / `'OR'`
   * composition instead of plain equality. Resolves `0` when the predicate matches nothing, and fields
   * with an `undefined` amount are skipped. Beware of an over-broad filter — EVERY matching draft of
   * EVERY user is incremented. Active counterpart: `incrementMany`.
   *
   * @param filter - A Filter instance.
   * @param fields - An object with numeric field names as keys and increment values as values.
   * @returns A promise that resolves to the number of updated draft entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * import { Filter } from '@dxfrontier/cds-ts-repository';
   *
   * const inStock = new Filter<Books>({ field: 'stock', operator: 'GREATER THAN', value: 0 });
   * const updatedCount = await this.incrementManyDrafts(inStock, { stock: 1 });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#incrementmany | CDS-TS-Repository - incrementManyDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § incrementMany
   */
  public async incrementManyDrafts(filter: Filter<Draft<T>>, fields: IncrementFields<Draft<T>>): Promise<number>;

  public async incrementManyDrafts(
    keys: Draft<T> | Filter<Draft<T>>,
    fields: IncrementFields<Draft<T>>,
  ): Promise<number> {
    return await this.coreRepository.incrementMany(keys, fields);
  }

  /**
   * Subtracts the given amounts from several numeric columns of EVERY draft row matching the keys.
   * Executes `UPDATE.entity(<Entity>.drafts).with({ <field>: { '-=': amount } }).where(keys)`.
   *
   * @remarks
   * The subtracting mirror of `incrementManyDrafts` — one statement for all matching rows, the affected
   * count as result (`0` when nothing matched), `undefined` amounts skipped and the fields restricted to
   * the NUMERIC elements by `IncrementFields<Draft<T>>`. The amounts are POSITIVE numbers, the direction
   * comes from the method. NO floor is applied, columns can go negative. Single row and column:
   * `decrementDraft`. Active counterpart: `decrementMany`.
   *
   * @param keys - The keys to identify the draft entities to update.
   * @param fields - An object with numeric field names as keys and decrement values as values.
   * @returns A promise that resolves to the number of updated draft entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * const updatedCount = await this.decrementManyDrafts({ isAvailable: true }, { stock: 1 });
   *
   * console.log(`${updatedCount} draft(s) reduced by one`);
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#decrementmany | CDS-TS-Repository - decrementManyDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § decrementMany
   */
  public async decrementManyDrafts(keys: Draft<T>, fields: IncrementFields<Draft<T>>): Promise<number>;

  /**
   * Subtracts the given amounts from several numeric columns of EVERY draft row matching the `Filter` tree.
   * Executes `UPDATE.entity(<Entity>.drafts).with({ <field>: { '-=': amount } }).where(<compiled filter>)`.
   *
   * @remarks
   * Same single statement as the keys overload, with the full operator set and `'AND'` / `'OR'`
   * composition instead of plain equality. Resolves `0` when the predicate matches nothing, and fields
   * with an `undefined` amount are skipped. Beware of an over-broad filter — EVERY matching draft of
   * EVERY user is decremented, with no floor at zero. Active counterpart: `decrementMany`.
   *
   * @param filter - A Filter instance.
   * @param fields - An object with numeric field names as keys and decrement values as values.
   * @returns A promise that resolves to the number of updated draft entries, `0` when nothing matched.
   *
   * @example
   * ```ts
   * import { Filter } from '@dxfrontier/cds-ts-repository';
   *
   * const sold = new Filter<Books>({ field: 'isAvailable', operator: 'EQUALS', value: false });
   * const updatedCount = await this.decrementManyDrafts(sold, { stock: 1 });
   * ```
   *
   * @see {@link https://github.com/dxfrontier/cds-ts-repository#decrementmany | CDS-TS-Repository - decrementManyDrafts}
   * Full docs ship with this package: node_modules/@dxfrontier/cds-ts-repository/README.md § decrementMany
   */
  public async decrementManyDrafts(filter: Filter<Draft<T>>, fields: IncrementFields<Draft<T>>): Promise<number>;

  public async decrementManyDrafts(
    keys: Draft<T> | Filter<Draft<T>>,
    fields: IncrementFields<Draft<T>>,
  ): Promise<number> {
    return await this.coreRepository.decrementMany(keys, fields);
  }
}

export { BaseRepositoryDraft };
