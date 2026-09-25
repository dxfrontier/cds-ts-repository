// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Service } from '@sap/cds';
import type { ql } from '@sap/cds';

import FindBuilder from '../util/find/FindBuilder';
import FindOneBuilder from '../util/find/FindOneBuilder';
import coreRepositoryUtils from '../util/coreRepository/coreRepositoryUtils';
import util from '../util/util';

import type {
  Entry,
  Locale,
  FindReturn,
  Entries,
  Columns,
  ShowOnlyColumns,
  Entity,
  ExternalServiceProps,
  // CreateReturnType,
  ExtractSingular,
  InsertResult,
  NumericKeys,
  IncrementFields,
} from '../types/types';
import type { Filter } from '..';
import { findUtils } from '../util/find/findUtils';

/**
 * Core repository class providing CRUD operations for entities.
 * @template T The type of the entity.
 */
class CoreRepository<T> {
  private readonly resolvedEntity: string;

  /**
   * Creates an instance of CoreRepository.
   * @param entity The entity this repository manages.
   */
  constructor(
    protected readonly entity: Entity,
    protected readonly externalService?: ExternalServiceProps,
  ) {
    this.resolvedEntity = findUtils.resolveEntityName(entity);
  }

  // Public routines
  public async create(entry: Entry<T>): Promise<InsertResult<T>> {
    const query = INSERT.into(this.resolvedEntity).entries(entry);

    if (this.externalService) {
      const executedQuery: T = await this.externalService.run(query);

      return {
        query: { INSERT: { entries: [executedQuery] } },
      };
    }

    return await query;
  }

  public async createMany(...entries: Entries<T>[]): Promise<InsertResult<T>> {
    if (this.externalService) {
      const inserted: T[] = [];

      for (const entry of entries) {
        const query = INSERT.into(this.resolvedEntity).entries(entry);
        const result = await this.externalService.run(query);

        inserted.push(result);
      }

      return {
        query: {
          INSERT: {
            entries: inserted,
          },
        },
      };
    }

    const query: InsertResult<T> = await INSERT.into(this.resolvedEntity).entries(...entries);
    return query;
  }

  public async getAll(): Promise<T[] | undefined> {
    const query = SELECT.from(this.resolvedEntity);

    if (this.externalService) {
      return await this.externalService.run(query);
    }

    return await query;
  }

  public async getDistinctColumns<ColumnKeys extends Columns<T>>(
    ...columns: ColumnKeys[]
  ): Promise<Pick<T, ShowOnlyColumns<T, ColumnKeys>>[] | undefined> {
    const allColumns = Array.isArray(columns[0]) ? columns[0] : columns;

    if (this.externalService) {
      const query = SELECT.from(this.resolvedEntity)
        .columns(...allColumns)
        .groupBy(...allColumns);

      return await this.externalService.run(query);
    }

    const query = SELECT.distinct.from(this.resolvedEntity).columns(...allColumns);
    return await query;
  }

  public async paginate(options: { limit: number; skip?: number | undefined }): Promise<T[] | undefined> {
    const query = SELECT.from(this.resolvedEntity).limit(options.limit);

    if (options.skip !== undefined) {
      query.limit(options.limit, options.skip);
    }

    if (this.externalService) {
      return await this.externalService.run(query);
    }

    return await query;
  }

  public async getLocaleTexts<ColumnKeys extends Columns<T>>(
    ...columns: ColumnKeys[]
  ): Promise<(Pick<T, ExtractSingular<ColumnKeys>> & Locale)[] | undefined> {
    const items = Array.isArray(columns[0]) ? columns[0] : columns;
    const query = SELECT.from(`${this.entity.name}.texts`).columns(...items, 'locale');

    if (this.externalService) {
      throw new Error('Currently not supported on External services !');
    }

    return await query;
  }

  public async find(keys?: Entry<T> | Filter<T>): Promise<T[] | undefined> {
    const filterKeys = coreRepositoryUtils.buildQueryKeys(keys);
    const query = SELECT.from(this.resolvedEntity);

    if (filterKeys) {
      query.where(filterKeys);
    }

    if (this.externalService) {
      return await this.externalService.run(query);
    }

    return await query;
  }

  public async findOneAndUpdate(keys: Entry<T>, fieldsToUpdate: Entry<T>): Promise<boolean> {
    const findOneQuery = SELECT.one.from(this.resolvedEntity).where(keys);

    // Case 1: External Service
    if (this.externalService) {
      const foundEntity: T | undefined = await this.externalService.run(findOneQuery);

      if (!foundEntity) {
        return false;
      }

      // Address the found row by its own key : the lookup keys may be any properties, the remote needs the key.
      const foundKey = this.pickExternalKey(foundEntity as Entry<T>) ?? keys;
      const externalKey = this.resolveExternalKey('findOneAndUpdate', foundKey);
      const updateQuery = UPDATE.entity(this.resolvedEntity, externalKey).set(fieldsToUpdate);
      return await this.runExternalKeyedWrite(updateQuery);
    }

    // Case 2: Regular Database
    const foundOne: T | undefined = await findOneQuery;

    if (!foundOne) {
      return false;
    }

    return this.update(keys, fieldsToUpdate);
  }

  public async findOne(keys: Entry<T>): Promise<T | undefined> {
    const query = SELECT.one.from(this.resolvedEntity).where(keys);

    if (this.externalService) {
      return await this.externalService.run(query);
    }

    return await query;
  }

  public builder(): FindReturn<T> {
    return {
      find: (keys?: Entry<T> | Filter<T>): FindBuilder<T, any> => {
        const filterKeys = coreRepositoryUtils.buildQueryKeys(keys);

        return new FindBuilder<T, unknown>(this.entity, filterKeys, this.externalService);
      },
      findOne: (keys?: Entry<T> | Filter<T>): FindOneBuilder<T, any> => {
        const filterKeys = coreRepositoryUtils.buildQueryKeys(keys);

        return new FindOneBuilder<T, unknown>(this.entity, filterKeys, this.externalService);
      },
    };
  }

  public async update(keys: Entry<T>, fieldsToUpdate: Entry<T>): Promise<boolean> {
    if (this.externalService) {
      const externalKey = this.resolveExternalKey('update', keys);
      const externalQuery = UPDATE.entity(this.resolvedEntity, externalKey).set(fieldsToUpdate);
      return await this.runExternalKeyedWrite(externalQuery);
    }

    const query = UPDATE.entity(this.resolvedEntity).where(keys).set(fieldsToUpdate);
    const updated = coreRepositoryUtils.resolveAffected(await query);
    return updated === 1;
  }

  public async updateOrCreate(...entries: Entries<T>[]): Promise<boolean> {
    const query = UPSERT.into(this.resolvedEntity).entries(...entries);

    if (this.externalService) {
      throw new Error('Currently not supported on External services, please use update instead !');
    }

    const updatedOrCreated = coreRepositoryUtils.resolveAffected(await query);
    return updatedOrCreated > 0;
  }

  public async updateLocaleTexts(localeCodeKeys: Entry<T> & Locale, fieldsToUpdate: Entry<T>): Promise<boolean> {
    if (this.externalService) {
      const externalQuery = UPDATE.entity(`${this.entity.name}.texts`, localeCodeKeys).with(fieldsToUpdate);
      return await this.runExternalKeyedWrite(externalQuery, { notFoundAsFailure: false });
    }

    const query = UPDATE.entity(`${this.entity.name}.texts`).with(fieldsToUpdate).where(localeCodeKeys);
    const updated = coreRepositoryUtils.resolveAffected(await query);
    return updated === 1;
  }

  public async delete(keys: Entry<T>): Promise<boolean> {
    if (this.externalService) {
      const externalKey = this.resolveExternalKey('delete', keys);
      const externalQuery = DELETE.from(this.resolvedEntity, externalKey);
      return await this.runExternalKeyedWrite(externalQuery);
    }

    const query = DELETE.from(this.resolvedEntity).where(keys);
    const deleted = coreRepositoryUtils.resolveAffected(await query);
    return deleted === 1;
  }

  public async deleteMany(...entries: Entries<T>[]): Promise<boolean> {
    const items = Array.isArray(entries[0]) ? entries[0] : entries;

    if (this.externalService) {
      const externalQueries = items.map((instance) =>
        DELETE.from(this.resolvedEntity, this.resolveExternalKey('deleteMany', instance as Entry<T>)),
      );

      // Every deletion is settled before resolving : a 404 of one row must neither hide a later error of another row
      // nor return while sibling deletions are still in flight.
      const settled = await Promise.allSettled(externalQueries.map((query) => this.externalService!.run(query)));
      const rejections = settled.filter((outcome): outcome is PromiseRejectedResult => outcome.status === 'rejected');
      const unexpected = rejections.find((rejection) => !this.isUpstreamNotFound(rejection.reason));

      if (unexpected) {
        throw unexpected.reason;
      }

      if (rejections.length > 0) {
        return false;
      }

      return (
        settled.length > 0 &&
        settled.every((outcome) =>
          coreRepositoryUtils.resolveExternalWriteSuccess(
            (outcome as PromiseFulfilledResult<unknown>).value,
            this.externalServiceKind(),
          ),
        )
      );
    }

    const queries = items.map((instance) => DELETE.from(this.resolvedEntity).where(instance));
    const deletedItems = (await Promise.all(queries)).map((result) => coreRepositoryUtils.resolveAffected(result));
    return coreRepositoryUtils.isAllSuccess(deletedItems);
  }

  public async deleteAll(): Promise<boolean> {
    const query = DELETE.from(this.resolvedEntity);

    if (this.externalService) {
      const deleted: number = await this.externalService.run(query);
      return deleted > 0;
    }

    const deleted = coreRepositoryUtils.resolveAffected(await query);
    return deleted > 0;
  }

  public async exists(keys: Entry<T>): Promise<boolean> {
    if (this.externalService) {
      const query = SELECT.from(this.resolvedEntity).where(keys);
      const found: T[] = await this.externalService.run(query);
      return found.length > 0;
    }

    // Regular DB : resolve existence with a single `count(*)` aggregate row instead of
    // materializing every matching row and then reading `.length`.
    const query = SELECT.one.from(this.resolvedEntity).columns('count(*) as total').where(keys);
    const result = (await query) as { total?: number } | undefined;
    return coreRepositoryUtils.resolveCount(result) > 0;
  }

  public async count(): Promise<number> {
    if (this.externalService) {
      const query = SELECT.from(this.resolvedEntity);
      const found: T[] = await this.externalService.run(query);
      return found.length;
    }

    // Regular DB : let the database compute the count via `count(*)` rather than
    // fetching all rows into memory.
    const query = SELECT.one.from(this.resolvedEntity).columns('count(*) as total');
    const result = (await query) as { total?: number } | undefined;
    return coreRepositoryUtils.resolveCount(result);
  }

  public async findFirst<ColumnKeys extends keyof T>(column: ColumnKeys): Promise<T | undefined> {
    const query = SELECT.one.from(this.resolvedEntity).orderBy(`${column as string} asc`);

    if (this.externalService) {
      return await this.externalService.run(query);
    }

    return await query;
  }

  public async findLast<ColumnKeys extends keyof T>(column: ColumnKeys): Promise<T | undefined> {
    const query = SELECT.one.from(this.resolvedEntity).orderBy(`${column as string} desc`);

    if (this.externalService) {
      return await this.externalService.run(query);
    }

    return await query;
  }

  public async findOrCreate(keys: Entry<T>, defaults: Entry<T>): Promise<{ created: boolean; entry: T }> {
    const found = await this.findOne(keys);

    if (found) {
      return { created: false, entry: found };
    }

    const entryToCreate = { ...keys, ...defaults } as Entry<T>;
    await this.create(entryToCreate);

    const created = await this.findOne(keys);

    return { created: true, entry: created as T };
  }

  public async countWhere(keys?: Entry<T> | Filter<T>): Promise<number> {
    const filterKeys = coreRepositoryUtils.buildQueryKeys(keys);

    if (this.externalService) {
      const query = SELECT.from(this.resolvedEntity);

      if (filterKeys) {
        query.where(filterKeys);
      }

      const found: T[] = await this.externalService.run(query);
      return found.length;
    }

    // Regular DB : compute the matching count with a single `count(*)` aggregate row.
    const query = SELECT.one.from(this.resolvedEntity).columns('count(*) as total');

    if (filterKeys) {
      query.where(filterKeys);
    }

    const result = (await query) as { total?: number } | undefined;
    return coreRepositoryUtils.resolveCount(result);
  }

  public async updateMany(keys: Entry<T> | Filter<T>, fieldsToUpdate: Entry<T>): Promise<number> {
    const filterKeys = coreRepositoryUtils.buildQueryKeys(keys);

    if (this.externalService && filterKeys) {
      this.assertExternalKeyObject('updateMany', filterKeys);

      const externalKey = this.resolveExternalKey('updateMany', filterKeys);
      const externalQuery = UPDATE.entity(this.resolvedEntity, externalKey).set(fieldsToUpdate);
      return (await this.runExternalKeyedWrite(externalQuery)) ? 1 : 0;
    }

    const query = UPDATE.entity(this.resolvedEntity).set(fieldsToUpdate);

    if (filterKeys) {
      query.where(filterKeys);
    }

    if (this.externalService) {
      const updated: number = await this.externalService.run(query);
      return updated;
    }

    const updated = coreRepositoryUtils.resolveAffected(await query);
    return updated;
  }

  public async deleteWhere(keys?: Entry<T> | Filter<T>): Promise<number> {
    const filterKeys = coreRepositoryUtils.buildQueryKeys(keys);

    if (this.externalService && filterKeys) {
      this.assertExternalKeyObject('deleteWhere', filterKeys);

      const externalKey = this.resolveExternalKey('deleteWhere', filterKeys);
      const externalQuery = DELETE.from(this.resolvedEntity, externalKey);
      return (await this.runExternalKeyedWrite(externalQuery)) ? 1 : 0;
    }

    const query = DELETE.from(this.resolvedEntity);

    if (filterKeys) {
      query.where(filterKeys);
    }

    if (this.externalService) {
      const deleted: number = await this.externalService.run(query);
      return deleted;
    }

    const deleted = coreRepositoryUtils.resolveAffected(await query);
    return deleted;
  }

  /**
   * Increments a numeric field by the specified value.
   * @param keys - The keys to identify the entity to update.
   * @param column - The numeric column to increment.
   * @param value - The value to increment by (default: 1).
   * @returns A promise that resolves to `true` if the increment is successful, `false` otherwise.
   */
  public async increment(keys: Entry<T>, column: NumericKeys<T>, value = 1): Promise<boolean> {
    this.assertNotExternalService('increment');

    const columnName = column as string;
    const incrementExpression = { [columnName]: { '+=': value } };
    const query = UPDATE.entity(this.resolvedEntity).where(keys).with(incrementExpression);

    const updated = coreRepositoryUtils.resolveAffected(await query);
    return updated === 1;
  }

  /**
   * Decrements a numeric field by the specified value.
   * @param keys - The keys to identify the entity to update.
   * @param column - The numeric column to decrement.
   * @param value - The value to decrement by (default: 1).
   * @returns A promise that resolves to `true` if the decrement is successful, `false` otherwise.
   */
  public async decrement(keys: Entry<T>, column: NumericKeys<T>, value = 1): Promise<boolean> {
    this.assertNotExternalService('decrement');

    const columnName = column as string;
    const decrementExpression = { [columnName]: { '-=': value } };
    const query = UPDATE.entity(this.resolvedEntity).where(keys).with(decrementExpression);

    const updated = coreRepositoryUtils.resolveAffected(await query);
    return updated === 1;
  }

  /**
   * Increments multiple numeric fields by their specified values for all matching entries.
   * @param keys - The keys or filter to identify the entities to update.
   * @param fields - An object with numeric field names as keys and increment values as values.
   * @returns A promise that resolves to the number of updated entries.
   */
  public async incrementMany(keys: Entry<T> | Filter<T>, fields: IncrementFields<T>): Promise<number> {
    this.assertNotExternalService('incrementMany');

    const filterKeys = coreRepositoryUtils.buildQueryKeys(keys);
    const incrementExpression: Record<string, object> = {};

    for (const [fieldName, incrementValue] of Object.entries(fields)) {
      if (incrementValue !== undefined) {
        incrementExpression[fieldName] = { '+=': incrementValue };
      }
    }

    const query = UPDATE.entity(this.resolvedEntity).with(incrementExpression);

    if (filterKeys) {
      query.where(filterKeys);
    }

    const updated = coreRepositoryUtils.resolveAffected(await query);
    return updated;
  }

  /**
   * Decrements multiple numeric fields by their specified values for all matching entries.
   * @param keys - The keys or filter to identify the entities to update.
   * @param fields - An object with numeric field names as keys and decrement values as values.
   * @returns A promise that resolves to the number of updated entries.
   */
  public async decrementMany(keys: Entry<T> | Filter<T>, fields: IncrementFields<T>): Promise<number> {
    this.assertNotExternalService('decrementMany');

    const filterKeys = coreRepositoryUtils.buildQueryKeys(keys);
    const decrementExpression: Record<string, object> = {};

    for (const [fieldName, decrementValue] of Object.entries(fields)) {
      if (decrementValue !== undefined) {
        decrementExpression[fieldName] = { '-=': decrementValue };
      }
    }

    const query = UPDATE.entity(this.resolvedEntity).with(decrementExpression);

    if (filterKeys) {
      query.where(filterKeys);
    }

    const updated = coreRepositoryUtils.resolveAffected(await query);
    return updated;
  }

  // Private routines

  /**
   * Runs one key-addressed write (`UPDATE.entity(target, keys)` / `DELETE.from(target, keys)`) on the external
   * service and normalizes its result into a success boolean.
   *
   * A remote OData service addresses the written row through the URL (`PATCH /Entity(<key>)`), so writes are built
   * with the keyed forms : `@sap/cds` >= 10.1 rejects a `.where(...)` subject on remote UPDATE / DELETE requests.
   * @param query - The keyed write query.
   * @param options.notFoundAsFailure - Resolve to `false` when the remote answers 404 (no row with that key).
   * @returns `true` when the write succeeded, `false` otherwise. Any other error is rethrown unchanged.
   */
  private async runExternalKeyedWrite(
    query: ql.ConstructedQuery<any>,
    options = { notFoundAsFailure: true },
  ): Promise<boolean> {
    try {
      const result: unknown = await this.externalService!.run(query);
      return coreRepositoryUtils.resolveExternalWriteSuccess(result, this.externalServiceKind());
    } catch (error) {
      if (options.notFoundAsFailure && this.isUpstreamNotFound(error)) {
        return false;
      }

      throw error;
    }
  }

  /**
   * Tells whether an external-service error reports that the addressed row does not exist : a remote OData
   * service's 404 answer is wrapped by CAP into a 502 error, keeping the upstream status on
   * `error.reason.response.status`, whereas an in-process (mocked) service rejects directly with a plain 404 error
   * (`code`, `status` or `statusCode`) that has no `reason`.
   * @param error - The error an external-service `run` rejected with.
   * @returns `true` when the error reports a 404 (remote or in-process), `false` otherwise.
   */
  private isUpstreamNotFound(error: unknown): boolean {
    const err = error as
      | { reason?: { response?: { status?: unknown } }; code?: unknown; status?: unknown; statusCode?: unknown }
      | undefined;

    if (err?.reason != null) {
      return err.reason.response?.status === 404;
    }

    return err?.code === 404 || err?.status === 404 || err?.statusCode === 404;
  }

  /**
   * Reads the `kind` of the attached external service (for example `'odata'`, `'odata-v2'`, `'app-service'`).
   * @returns The service kind, `undefined` when the service does not expose one.
   */
  private externalServiceKind(): unknown {
    return (this.externalService as { kind?: unknown } | undefined)?.kind;
  }

  /**
   * Resolves the key elements a remote service addresses a row of this entity by, from the entity definition : the
   * repository's own entity (re-resolved from the external service by `BaseRepository`), else the entity of the same
   * name in the external service's entity set. Association keys are skipped (their foreign keys are key elements
   * too) and `IsActiveEntity` of a draft-enabled remote entity is optional.
   * @returns The required and optional key element names, `undefined` when no entity definition with keys is found.
   */
  private resolveExternalKeyNames(): { required: string[]; optional: string[] } | undefined {
    type KeyElements = Record<string, { isAssociation?: boolean }>;

    const serviceEntity = this.externalService?.entities?.[util.subtractExternalEntity(this.entity.name)] as
      { keys?: KeyElements } | undefined;
    const keys = (this.entity as { keys?: KeyElements }).keys ?? serviceEntity?.keys;

    const names = keys ? Object.keys(keys).filter((name) => !keys[name]?.isAssociation) : [];
    const required = names.filter((name) => name !== 'IsActiveEntity');

    if (required.length === 0) {
      return undefined;
    }

    return { required, optional: names.filter((name) => name === 'IsActiveEntity') };
  }

  /**
   * Picks the key of a row read from the external service, used to address that exact row in a keyed write.
   * @param row - A row read from the external service.
   * @returns The key element values of `row`, `undefined` when the key elements cannot be resolved.
   */
  private pickExternalKey(row: Entry<T>): Entry<T> | undefined {
    const keyNames = this.resolveExternalKeyNames();

    if (!keyNames) {
      return undefined;
    }

    const record = row as Record<string, unknown>;
    const key = [...keyNames.required, ...keyNames.optional]
      .filter((name) => record[name] !== undefined)
      .map((name) => [name, record[name]]);

    return Object.fromEntries(key) as Entry<T>;
  }

  /**
   * Guards the keys of a key-addressed external-service write : an OData service addresses the written row by its
   * key in the URL, so the keys must be exactly the entity's key elements. When the key elements cannot be
   * resolved (no entity definition with keys), the keys are passed on unchecked.
   * @param methodName - The name of the calling method, used in the thrown error message.
   * @param keys - The keys passed by the caller.
   * @returns The keys, limited to the properties that hold a value.
   * @throws {Error} When a key element is missing, or a property that is not a key element is passed.
   */
  private resolveExternalKey(methodName: string, keys: Entry<T>): Entry<T> {
    const keyNames = this.resolveExternalKeyNames();

    if (!keyNames) {
      return keys;
    }

    const record = keys as Record<string, unknown>;
    const received = Object.keys(record).filter((name) => record[name] !== undefined);
    const accepted = [...keyNames.required, ...keyNames.optional];
    const isFullKey =
      keyNames.required.every((name) => received.includes(name)) && received.every((name) => accepted.includes(name));

    if (!isFullKey) {
      const expected = keyNames.required.join(', ');

      throw new Error(
        `${methodName} on external services addresses a row by its full key : expected (${expected}), received (${received.join(', ')}) !`,
      );
    }

    return Object.fromEntries(received.map((name) => [name, record[name]])) as Entry<T>;
  }

  /**
   * Guards the methods whose query cannot be expressed as an OData request against an attached external service :
   * OData UPDATE requests carry plain values only, so in-database arithmetic cannot be expressed.
   * @param methodName - The name of the calling method, used in the thrown error message.
   * @throws {Error} When an external service is attached via `@ExternalService`.
   */
  private assertNotExternalService(methodName: string): void {
    if (this.externalService) {
      throw new Error(`${methodName} is not supported on OData external services !`);
    }
  }

  /**
   * Guards the external-service path of `updateMany` / `deleteWhere` against a `Filter` : an OData service addresses
   * a written row by its key in the URL, so only a plain key object can be sent.
   * @param methodName - The name of the calling method, used in the thrown error message.
   * @param filterKeys - The keys resolved by `coreRepositoryUtils.buildQueryKeys` (a string for any `Filter`).
   * @throws {Error} When `filterKeys` was built from a `Filter`.
   */
  private assertExternalKeyObject(methodName: string, filterKeys: Entry<T> | string): asserts filterKeys is Entry<T> {
    if (typeof filterKeys === 'string') {
      throw new Error(
        `${methodName} with a filter is not supported on OData external services, address the rows by key instead !`,
      );
    }
  }
}

export { CoreRepository };
