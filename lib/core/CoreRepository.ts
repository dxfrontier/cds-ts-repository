// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Service } from '@sap/cds';

import FindBuilder from '../util/find/FindBuilder';
import FindOneBuilder from '../util/find/FindOneBuilder';
import coreRepositoryUtils from '../util/coreRepository/coreRepositoryUtils';

import type {
  Entry,
  Locale,
  FindReturn,
  Entries,
  Columns,
  ShowOnlyColumns,
  Entity,
  ExternalServiceBinding,
  ExternalServiceProps,
  // CreateReturnType,
  ExtractSingular,
  InsertResult,
  NumericKeys,
  IncrementFields,
} from '../types/types';
import type { Filter } from '..';
import { findUtils } from '../util/find/findUtils';
import util from '../util/util';

/**
 * Where a query has to be executed : the name of the entity it targets and, on the external service
 * path, the connected service running it. `service` being absent is what selects the primary database.
 */
type QueryTarget = {
  entityName: string;
  service?: ExternalServiceProps;
};

/**
 * Core repository class providing CRUD operations for entities.
 * @template T The type of the entity.
 */
class CoreRepository<T> {
  private readonly resolvedEntity: string;
  private readonly databaseTarget: QueryTarget;
  private externalTarget?: Promise<QueryTarget>;

  /**
   * Creates an instance of CoreRepository.
   * @param entity The entity this repository manages.
   * @param externalService The connected external service, or the descriptor of a connection still in flight.
   */
  constructor(
    protected readonly entity: Entity,
    protected readonly externalService?: ExternalServiceBinding,
  ) {
    this.resolvedEntity = findUtils.resolveEntityName(entity);
    this.databaseTarget = { entityName: this.resolvedEntity };
  }

  /**
   * Whether this repository is bound to an external service, answered SYNCHRONOUSLY.
   *
   * The binding is present from construction on, even while the connection of a lazily attached service
   * is still pending, so the methods refusing the external path can throw without awaiting anything.
   */
  private get isExternal(): boolean {
    return this.externalService !== undefined;
  }

  /**
   * Resolves where the next query has to be executed, awaiting a pending connection ONCE.
   *
   * The primary database target is the entity name resolved at construction time. The external one is
   * memoized: the connection is awaited and the entity re-resolved from the service's entity set on the
   * first call, every later call reuses that outcome (a failed connection keeps rejecting).
   * @returns A promise resolving to the entity name to build the query from and the service to run it on.
   */
  private async target(): Promise<QueryTarget> {
    if (!this.externalService) {
      return this.databaseTarget;
    }

    this.externalTarget ??= this.resolveExternalTarget(this.externalService);

    return await this.externalTarget;
  }

  /**
   * Connects the external service and re-resolves the entity on it.
   * @param externalService The connected service or the descriptor of the pending connection.
   * @returns A promise resolving to the remote entity name and the connected service.
   */
  private async resolveExternalTarget(externalService: ExternalServiceBinding): Promise<QueryTarget> {
    const resolved = await util.resolveExternalTarget(this.entity, externalService);

    return { entityName: findUtils.resolveEntityName(resolved.entity), service: resolved.service };
  }

  // Public routines
  public async create(entry: Entry<T>): Promise<InsertResult<T>> {
    const target = await this.target();
    const query = INSERT.into(target.entityName).entries(entry);

    if (target.service) {
      const executedQuery: T = await target.service.run(query);

      return {
        query: { INSERT: { entries: [executedQuery] } },
      };
    }

    return await query;
  }

  public async createMany(...entries: Entries<T>[]): Promise<InsertResult<T>> {
    const target = await this.target();

    if (target.service) {
      const inserted: T[] = [];

      for (const entry of entries) {
        const query = INSERT.into(target.entityName).entries(entry);
        const result = await target.service.run(query);

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

    const query: InsertResult<T> = await INSERT.into(target.entityName).entries(...entries);
    return query;
  }

  public async getAll(): Promise<T[] | undefined> {
    const target = await this.target();
    const query = SELECT.from(target.entityName);

    if (target.service) {
      return await target.service.run(query);
    }

    return await query;
  }

  public async getDistinctColumns<ColumnKeys extends Columns<T>>(
    ...columns: ColumnKeys[]
  ): Promise<Pick<T, ShowOnlyColumns<T, ColumnKeys>>[] | undefined> {
    const allColumns = Array.isArray(columns[0]) ? columns[0] : columns;
    const target = await this.target();

    if (target.service) {
      const query = SELECT.from(target.entityName)
        .columns(...allColumns)
        .groupBy(...allColumns);

      return await target.service.run(query);
    }

    const query = SELECT.distinct.from(target.entityName).columns(...allColumns);
    return await query;
  }

  public async paginate(options: { limit: number; skip?: number | undefined }): Promise<T[] | undefined> {
    const target = await this.target();
    const query = SELECT.from(target.entityName).limit(options.limit);

    if (options.skip !== undefined) {
      query.limit(options.limit, options.skip);
    }

    if (target.service) {
      return await target.service.run(query);
    }

    return await query;
  }

  public async getLocaleTexts<ColumnKeys extends Columns<T>>(
    ...columns: ColumnKeys[]
  ): Promise<(Pick<T, ExtractSingular<ColumnKeys>> & Locale)[] | undefined> {
    // Refused before the connection is even awaited : the `.texts` sibling exists on the primary
    // database only.
    if (this.isExternal) {
      throw new Error('Currently not supported on External services !');
    }

    const items = Array.isArray(columns[0]) ? columns[0] : columns;
    const query = SELECT.from(`${this.entity.name}.texts`).columns(...items, 'locale');

    return await query;
  }

  public async find(keys?: Entry<T> | Filter<T>): Promise<T[] | undefined> {
    const filterKeys = coreRepositoryUtils.buildQueryKeys(keys);
    const target = await this.target();
    const query = SELECT.from(target.entityName);

    if (filterKeys) {
      query.where(filterKeys);
    }

    if (target.service) {
      return await target.service.run(query);
    }

    return await query;
  }

  public async findOneAndUpdate(keys: Entry<T>, fieldsToUpdate: Entry<T>): Promise<boolean> {
    const target = await this.target();

    // Case 1: External Service
    if (target.service) {
      const findOneQuery = SELECT.one.from(target.entityName).where(keys);
      const foundEntity: T | undefined = await target.service.run(findOneQuery);

      if (!foundEntity) {
        return false;
      }

      const updateQuery = UPDATE.entity(target.entityName).where(keys).set(fieldsToUpdate);
      const updated = await target.service.run(updateQuery);
      return updated === 1;
    }

    // Case 2: Regular Database — a single atomic UPDATE, no probe SELECT first.
    const query = UPDATE.entity(target.entityName).where(keys).set(fieldsToUpdate);
    return coreRepositoryUtils.resolveAffected(await query) === 1;
  }

  public async findOne(keys: Entry<T>): Promise<T | undefined> {
    const target = await this.target();
    const query = SELECT.one.from(target.entityName).where(keys);

    if (target.service) {
      return await target.service.run(query);
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
    const target = await this.target();
    const query = UPDATE.entity(target.entityName).where(keys).set(fieldsToUpdate);

    if (target.service) {
      const updated = await target.service.run(query);
      return updated === 1;
    }

    const updated = coreRepositoryUtils.resolveAffected(await query);
    return updated === 1;
  }

  public async updateOrCreate(...entries: Entries<T>[]): Promise<boolean> {
    // Refused before the connection is even awaited : a remote service has no UPSERT.
    if (this.isExternal) {
      throw new Error('Currently not supported on External services, please use update instead !');
    }

    const query = UPSERT.into(this.resolvedEntity).entries(...entries);

    const updatedOrCreated = coreRepositoryUtils.resolveAffected(await query);
    return updatedOrCreated > 0;
  }

  public async updateLocaleTexts(localeCodeKeys: Entry<T> & Locale, fieldsToUpdate: Entry<T>): Promise<boolean> {
    // Refused before the connection is even awaited : the `.texts` sibling exists on the primary
    // database only.
    if (this.isExternal) {
      throw new Error('Currently not supported on External services !');
    }

    const query = UPDATE.entity(`${this.entity.name}.texts`).with(fieldsToUpdate).where(localeCodeKeys);

    const updated = coreRepositoryUtils.resolveAffected(await query);
    return updated === 1;
  }

  public async delete(keys: Entry<T>): Promise<boolean> {
    const target = await this.target();
    const query = DELETE.from(target.entityName).where(keys);

    if (target.service) {
      const deleted: unknown = await target.service.run(query);
      return coreRepositoryUtils.resolveExternalWriteSuccess(deleted, 'one');
    }

    const deleted = coreRepositoryUtils.resolveAffected(await query);
    return deleted === 1;
  }

  public async deleteMany(...entries: Entries<T>[]): Promise<boolean> {
    const items = Array.isArray(entries[0]) ? entries[0] : entries;
    const target = await this.target();
    const queries = items.map((instance) => DELETE.from(target.entityName).where(instance));

    if (target.service) {
      const deletedItems: unknown[] = await target.service.run(queries);
      return deletedItems.every((item) => coreRepositoryUtils.resolveExternalWriteSuccess(item, 'one'));
    }

    const deletedItems = (await Promise.all(queries)).map((result) => coreRepositoryUtils.resolveAffected(result));
    return coreRepositoryUtils.isAllSuccess(deletedItems);
  }

  public async deleteAll(): Promise<boolean> {
    const target = await this.target();
    const query = DELETE.from(target.entityName);

    if (target.service) {
      const deleted: unknown = await target.service.run(query);
      return coreRepositoryUtils.resolveExternalWriteSuccess(deleted, 'some');
    }

    const deleted = coreRepositoryUtils.resolveAffected(await query);
    return deleted > 0;
  }

  public async exists(keys: Entry<T>): Promise<boolean> {
    const target = await this.target();

    if (target.service) {
      const query = SELECT.from(target.entityName).where(keys);
      const found: T[] = await target.service.run(query);
      return found.length > 0;
    }

    // Regular DB : resolve existence with a single `count(*)` aggregate row instead of
    // materializing every matching row and then reading `.length`.
    const query = SELECT.one.from(target.entityName).columns('count(*) as total').where(keys);
    const result = (await query) as { total?: number } | undefined;
    return coreRepositoryUtils.resolveCount(result) > 0;
  }

  public async count(): Promise<number> {
    const target = await this.target();

    if (target.service) {
      const query = SELECT.from(target.entityName);
      const found: T[] = await target.service.run(query);
      return found.length;
    }

    // Regular DB : let the database compute the count via `count(*)` rather than
    // fetching all rows into memory.
    const query = SELECT.one.from(target.entityName).columns('count(*) as total');
    const result = (await query) as { total?: number } | undefined;
    return coreRepositoryUtils.resolveCount(result);
  }

  public async findFirst<ColumnKeys extends keyof T>(column: ColumnKeys): Promise<T | undefined> {
    const target = await this.target();
    const query = SELECT.one.from(target.entityName).orderBy(`${column as string} asc`);

    if (target.service) {
      return await target.service.run(query);
    }

    return await query;
  }

  public async findLast<ColumnKeys extends keyof T>(column: ColumnKeys): Promise<T | undefined> {
    const target = await this.target();
    const query = SELECT.one.from(target.entityName).orderBy(`${column as string} desc`);

    if (target.service) {
      return await target.service.run(query);
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
    const target = await this.target();

    if (target.service) {
      const query = SELECT.from(target.entityName);

      if (filterKeys) {
        query.where(filterKeys);
      }

      const found: T[] = await target.service.run(query);
      return found.length;
    }

    // Regular DB : compute the matching count with a single `count(*)` aggregate row.
    const query = SELECT.one.from(target.entityName).columns('count(*) as total');

    if (filterKeys) {
      query.where(filterKeys);
    }

    const result = (await query) as { total?: number } | undefined;
    return coreRepositoryUtils.resolveCount(result);
  }

  public async updateMany(keys: Entry<T> | Filter<T>, fieldsToUpdate: Entry<T>): Promise<number> {
    const filterKeys = coreRepositoryUtils.buildQueryKeys(keys);
    const target = await this.target();
    const query = UPDATE.entity(target.entityName).set(fieldsToUpdate);

    if (filterKeys) {
      query.where(filterKeys);
    }

    if (target.service) {
      const updated: number = await target.service.run(query);
      return updated;
    }

    const updated = coreRepositoryUtils.resolveAffected(await query);
    return updated;
  }

  public async deleteWhere(keys?: Entry<T> | Filter<T>): Promise<number> {
    const filterKeys = coreRepositoryUtils.buildQueryKeys(keys);
    const target = await this.target();
    const query = DELETE.from(target.entityName);

    if (filterKeys) {
      query.where(filterKeys);
    }

    if (target.service) {
      const deleted: number = await target.service.run(query);
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
    const columnName = column as string;
    const incrementExpression = { [columnName]: { '+=': value } };
    const target = await this.target();
    const query = UPDATE.entity(target.entityName).where(keys).with(incrementExpression);

    if (target.service) {
      const updated = await target.service.run(query);
      return updated === 1;
    }

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
    const columnName = column as string;
    const decrementExpression = { [columnName]: { '-=': value } };
    const target = await this.target();
    const query = UPDATE.entity(target.entityName).where(keys).with(decrementExpression);

    if (target.service) {
      const updated = await target.service.run(query);
      return updated === 1;
    }

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
    const filterKeys = coreRepositoryUtils.buildQueryKeys(keys);
    const incrementExpression: Record<string, object> = {};

    for (const [fieldName, incrementValue] of Object.entries(fields)) {
      if (incrementValue !== undefined) {
        incrementExpression[fieldName] = { '+=': incrementValue };
      }
    }

    const target = await this.target();
    const query = UPDATE.entity(target.entityName).with(incrementExpression);

    if (filterKeys) {
      query.where(filterKeys);
    }

    if (target.service) {
      const updated: number = await target.service.run(query);
      return updated;
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
    const filterKeys = coreRepositoryUtils.buildQueryKeys(keys);
    const decrementExpression: Record<string, object> = {};

    for (const [fieldName, decrementValue] of Object.entries(fields)) {
      if (decrementValue !== undefined) {
        decrementExpression[fieldName] = { '-=': decrementValue };
      }
    }

    const target = await this.target();
    const query = UPDATE.entity(target.entityName).with(decrementExpression);

    if (filterKeys) {
      query.where(filterKeys);
    }

    if (target.service) {
      const updated: number = await target.service.run(query);
      return updated;
    }

    const updated = coreRepositoryUtils.resolveAffected(await query);
    return updated;
  }
}

export { CoreRepository };
